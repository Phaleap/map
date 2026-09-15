/* global localPlaces, importantAreas */
(function (global) {
  "use strict";

  const KML_NAMESPACE = "http://www.opengis.net/kml/2.2";
  const DOWNLOAD_FILENAME = "tonle-sap-map.kml";

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function wrapCdata(value) {
    return `<![CDATA[${String(value).replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
  }

  function hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  function descriptionTable(rows) {
    const body = rows
      .filter((row) => hasValue(row.value))
      .map((row) => `
        <tr>
          <th style="padding:3px 10px 3px 0;text-align:left;vertical-align:top;white-space:nowrap;">${escapeXml(row.label)}</th>
          <td style="padding:3px 0;vertical-align:top;">${escapeXml(row.value)}</td>
        </tr>`)
      .join("");

    return `<table style="font-family:Arial,'Noto Sans Khmer',sans-serif;font-size:13px;border-collapse:collapse;">${body}
      </table>`;
  }

  function assertSite(site) {
    if (!site || !hasValue(site.nameEn) || !hasValue(site.nameKh)) {
      throw new Error("A project site is missing its English or Khmer name.");
    }

    if (!Number.isFinite(site.lat) || !Number.isFinite(site.lng)) {
      throw new Error(`Invalid coordinates for project site: ${site.nameEn}`);
    }

    if (Math.abs(site.lat) > 90 || Math.abs(site.lng) > 180) {
      throw new Error(`Out-of-range coordinates for project site: ${site.nameEn}`);
    }
  }

  function projectSitePlacemark(site) {
    assertSite(site);
    const latitude = site.lat.toFixed(6);
    const longitude = site.lng.toFixed(6);
    const description = descriptionTable([
      { label: "Name Khmer", value: site.nameKh },
      { label: "Name English", value: site.nameEn },
      { label: "Type", value: "Project Site" },
      { label: "Latitude", value: latitude },
      { label: "Longitude", value: longitude }
    ]);

    return `      <Placemark>
        <name>${escapeXml(site.nameEn)}</name>
        <styleUrl>#projectSiteStyle</styleUrl>
        <description>${wrapCdata(description)}</description>
        <Point>
          <altitudeMode>clampToGround</altitudeMode>
          <coordinates>${longitude},${latitude},0</coordinates>
        </Point>
      </Placemark>`;
  }

  function samePosition(first, last) {
    return first[0] === last[0] && first[1] === last[1];
  }

  function normalizeRing(ring) {
    if (!Array.isArray(ring) || ring.length < 3) {
      throw new Error("A core-area polygon contains an invalid ring.");
    }

    const validatedRing = ring.map((position) => {
      if (
        !Array.isArray(position) ||
        position.length < 2 ||
        !Number.isFinite(position[0]) ||
        !Number.isFinite(position[1])
      ) {
        throw new Error("A core-area polygon contains an invalid coordinate.");
      }

      const longitude = position[0];
      const latitude = position[1];
      if (Math.abs(longitude) > 180 || Math.abs(latitude) > 90) {
        throw new Error("A core-area polygon contains an out-of-range coordinate.");
      }

      return [longitude, latitude];
    });

    if (!samePosition(validatedRing[0], validatedRing[validatedRing.length - 1])) {
      validatedRing.push([...validatedRing[0]]);
    }

    if (validatedRing.length < 4) {
      throw new Error("A core-area polygon ring does not contain enough positions.");
    }

    return validatedRing;
  }

  function ringCoordinates(ring) {
    return normalizeRing(ring)
      .map((position) => `${position[0]},${position[1]},0`)
      .join(" ");
  }

  function polygonGeometry(coordinates, indentation) {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      throw new Error("A core-area polygon is missing its coordinates.");
    }

    const innerBoundaries = coordinates
      .slice(1)
      .map((ring) => `${indentation}  <innerBoundaryIs>
${indentation}    <LinearRing>
${indentation}      <coordinates>${ringCoordinates(ring)}</coordinates>
${indentation}    </LinearRing>
${indentation}  </innerBoundaryIs>`)
      .join("\n");

    return `${indentation}<Polygon>
${indentation}  <tessellate>1</tessellate>
${indentation}  <altitudeMode>clampToGround</altitudeMode>
${indentation}  <outerBoundaryIs>
${indentation}    <LinearRing>
${indentation}      <coordinates>${ringCoordinates(coordinates[0])}</coordinates>
${indentation}    </LinearRing>
${indentation}  </outerBoundaryIs>${innerBoundaries ? `\n${innerBoundaries}` : ""}
${indentation}</Polygon>`;
  }

  function geometryToKml(geometry, indentation) {
    if (!geometry || !hasValue(geometry.type)) {
      throw new Error("A core-area GeoJSON feature is missing its geometry.");
    }

    if (geometry.type === "Polygon") {
      return polygonGeometry(geometry.coordinates, indentation);
    }

    if (geometry.type === "MultiPolygon") {
      const polygons = geometry.coordinates
        .map((coordinates) => polygonGeometry(coordinates, `${indentation}  `))
        .join("\n");
      return `${indentation}<MultiGeometry>
${polygons}
${indentation}</MultiGeometry>`;
    }

    if (geometry.type === "GeometryCollection") {
      const geometries = geometry.geometries
        .map((item) => geometryToKml(item, `${indentation}  `))
        .join("\n");
      return `${indentation}<MultiGeometry>
${geometries}
${indentation}</MultiGeometry>`;
    }

    throw new Error(`Unsupported core-area geometry type: ${geometry.type}`);
  }

  function getGeoJsonFeatures(geoJson) {
    if (!geoJson || geoJson.type !== "FeatureCollection" || !Array.isArray(geoJson.features)) {
      throw new Error("A core-area file is not a valid GeoJSON FeatureCollection.");
    }

    if (geoJson.features.length === 0) {
      throw new Error("A core-area GeoJSON file contains no features.");
    }

    return geoJson.features;
  }

  function coreAreaDescription(area, properties) {
    const rows = [
      { label: "Name Khmer", value: area.nameKh },
      { label: "Name English", value: area.nameEn },
      { label: "Type", value: "Core Area" }
    ];

    if (properties.name && properties.name !== area.nameKh) {
      rows.push({ label: "GeoJSON Khmer Name", value: properties.name });
    }
    if (properties.name_eng && properties.name_eng !== area.nameEn) {
      rows.push({ label: "GeoJSON English Name", value: properties.name_eng });
    }

    rows.push(
      { label: "Designation Khmer", value: properties.desig },
      { label: "Designation English", value: properties.desig_eng },
      { label: "Status", value: properties.status },
      { label: "Status Year", value: properties.status_yr },
      { label: "Reported Area", value: properties.rep_area },
      { label: "GIS Area", value: properties.gis_area },
      { label: "Management Authority", value: properties.mang_auth }
    );

    return descriptionTable(rows);
  }

  function coreAreaPlacemark(areaData) {
    const { area, geoJson } = areaData;
    if (!area || !hasValue(area.nameEn) || !hasValue(area.nameKh)) {
      throw new Error("A core area is missing its English or Khmer name.");
    }

    const features = getGeoJsonFeatures(geoJson);
    const geometries = features.map((feature) => feature.geometry);
    const geometry = geometries.length === 1
      ? geometryToKml(geometries[0], "        ")
      : `        <MultiGeometry>
${geometries.map((item) => geometryToKml(item, "          ")).join("\n")}
        </MultiGeometry>`;
    const properties = features[0].properties || {};

    return `      <Placemark>
        <name>${escapeXml(area.nameEn)}</name>
        <styleUrl>#coreAreaStyle</styleUrl>
        <description>${wrapCdata(coreAreaDescription(area, properties))}</description>
${geometry}
      </Placemark>`;
  }

  function buildKml(siteData, coreAreaData) {
    if (!Array.isArray(siteData) || !Array.isArray(coreAreaData)) {
      throw new Error("KML export data is not available.");
    }

    const sitePlacemarks = siteData.map(projectSitePlacemark).join("\n");
    const coreAreaPlacemarks = coreAreaData.map(coreAreaPlacemark).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="${KML_NAMESPACE}">
  <Document>
    <name>Tonlé Sap Map</name>
    <Style id="projectSiteStyle">
      <IconStyle>
        <color>ff1e53d9</color>
        <scale>0.9</scale>
        <Icon>
          <href>https://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
        </Icon>
        <hotSpot x="0.5" y="0.5" xunits="fraction" yunits="fraction"/>
      </IconStyle>
      <LabelStyle>
        <scale>0.85</scale>
      </LabelStyle>
    </Style>
    <Style id="coreAreaStyle">
      <LineStyle>
        <color>ff647a0d</color>
        <width>2.5</width>
      </LineStyle>
      <PolyStyle>
        <color>5581b910</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
    </Style>
    <Folder>
      <name>Project Sites</name>
      <open>1</open>
${sitePlacemarks}
    </Folder>
    <Folder>
      <name>Core Areas</name>
      <open>1</open>
${coreAreaPlacemarks}
    </Folder>
  </Document>
</kml>`;
  }

  async function loadCoreAreas(areaData, fetchFunction) {
    return Promise.all(areaData.map(async (area) => {
      let response;
      try {
        response = await fetchFunction(area.geoJsonFile);
      } catch (error) {
        throw new Error(`Could not load ${area.nameEn}. Check your connection and try again.`, {
          cause: error
        });
      }

      if (!response.ok) {
        throw new Error(`Could not load ${area.nameEn} (HTTP ${response.status}).`);
      }

      let geoJson;
      try {
        geoJson = await response.json();
      } catch (error) {
        throw new Error(`The polygon data for ${area.nameEn} is not valid JSON.`, {
          cause: error
        });
      }

      getGeoJsonFeatures(geoJson);
      return { area, geoJson };
    }));
  }

  function validateGeneratedKml(kmlString, expectedSiteCount, expectedAreaCount) {
    if (typeof DOMParser === "undefined") return;

    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(kmlString, "application/xml");
    if (xmlDocument.getElementsByTagName("parsererror").length > 0) {
      throw new Error("The generated KML is not valid XML.");
    }

    const folders = Array.from(xmlDocument.getElementsByTagNameNS(KML_NAMESPACE, "Folder"));
    const findFolder = (folderName) => folders.find((folder) => {
      const name = folder.getElementsByTagNameNS(KML_NAMESPACE, "name")[0];
      return name && name.textContent === folderName;
    });
    const projectSitesFolder = findFolder("Project Sites");
    const coreAreasFolder = findFolder("Core Areas");

    if (!projectSitesFolder || !coreAreasFolder) {
      throw new Error("The generated KML is missing a required folder.");
    }

    const projectPlacemarks = projectSitesFolder.getElementsByTagNameNS(KML_NAMESPACE, "Placemark");
    const corePlacemarks = coreAreasFolder.getElementsByTagNameNS(KML_NAMESPACE, "Placemark");
    if (projectPlacemarks.length !== expectedSiteCount) {
      throw new Error(`Expected ${expectedSiteCount} project sites, but generated ${projectPlacemarks.length}.`);
    }
    if (corePlacemarks.length !== expectedAreaCount) {
      throw new Error(`Expected ${expectedAreaCount} core areas, but generated ${corePlacemarks.length}.`);
    }

    const allPlacemarks = [...projectPlacemarks, ...corePlacemarks];
    allPlacemarks.forEach((placemark) => {
      const name = placemark.getElementsByTagNameNS(KML_NAMESPACE, "name")[0];
      const value = name ? name.textContent.trim() : "";
      if (!value || value === "undefined" || value === "null") {
        throw new Error("The generated KML contains a Placemark without a valid name.");
      }
    });

    const pointCoordinates = projectSitesFolder.getElementsByTagNameNS(KML_NAMESPACE, "coordinates");
    Array.from(pointCoordinates).forEach((node) => {
      const [longitude, latitude, altitude] = node.textContent.trim().split(",").map(Number);
      if (
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude) ||
        altitude !== 0 ||
        Math.abs(longitude) > 180 ||
        Math.abs(latitude) > 90
      ) {
        throw new Error("The generated KML contains an invalid project-site coordinate.");
      }
    });

    const rings = coreAreasFolder.getElementsByTagNameNS(KML_NAMESPACE, "LinearRing");
    Array.from(rings).forEach((ring) => {
      const coordinates = ring
        .getElementsByTagNameNS(KML_NAMESPACE, "coordinates")[0]
        .textContent.trim().split(/\s+/);
      if (coordinates.length < 4 || coordinates[0] !== coordinates[coordinates.length - 1]) {
        throw new Error("The generated KML contains an open or invalid polygon ring.");
      }
    });
  }

  function downloadKml(kmlString) {
    const blob = new Blob([kmlString], {
      type: "application/vnd.google-earth.kml+xml"
    });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = DOWNLOAD_FILENAME;
    downloadLink.hidden = true;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function setupExportButton() {
    const exportButton = document.getElementById("kml-export-button");
    const exportLabel = document.getElementById("kml-export-label");
    const exportStatus = document.getElementById("kml-export-status");
    if (!exportButton || !exportLabel || !exportStatus) return;

    function setStatus(message, isError) {
      exportStatus.textContent = message;
      exportStatus.hidden = !message;
      exportStatus.classList.toggle("is-error", Boolean(isError));
    }

    exportButton.addEventListener("click", async () => {
      exportButton.disabled = true;
      exportButton.setAttribute("aria-busy", "true");
      exportLabel.textContent = "Preparing KML…";
      setStatus("Loading the core-area boundaries…", false);

      try {
        const coreAreaData = await loadCoreAreas(importantAreas, fetch);
        const kmlString = buildKml(localPlaces, coreAreaData);
        validateGeneratedKml(kmlString, localPlaces.length, importantAreas.length);
        downloadKml(kmlString);
        setStatus("Google Earth file downloaded.", false);
      } catch (error) {
        console.error("KML export failed:", error);
        setStatus(error.message || "Could not create the Google Earth file. Please try again.", true);
      } finally {
        exportButton.disabled = false;
        exportButton.removeAttribute("aria-busy");
        exportLabel.textContent = "Export to Google Earth";
      }
    });
  }

  const api = {
    buildKml,
    escapeXml,
    loadCoreAreas,
    validateGeneratedKml
  };

  global.TonleSapKml = api;

  if (typeof document !== "undefined") {
    setupExportButton();
  }
}(typeof window !== "undefined" ? window : globalThis));
