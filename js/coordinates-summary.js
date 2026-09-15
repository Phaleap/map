/* global localPlaces, importantAreas */
(function (global) {
  "use strict";

  const CSV_FILENAME = "tonle-sap-coordinates.csv";
  const CENTROID_METHOD = "Area-weighted polygon centroid (inside polygon)";
  const INTERIOR_METHOD = "Interior point from widest polygon scanline (centroid was outside)";

  function hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  function ringMetrics(ring) {
    if (!Array.isArray(ring) || ring.length < 4) {
      throw new Error("A KBA polygon contains an invalid ring.");
    }

    let twiceArea = 0;
    let longitudeSum = 0;
    let latitudeSum = 0;

    for (let index = 0; index < ring.length - 1; index += 1) {
      const current = ring[index];
      const next = ring[index + 1];
      if (
        !Array.isArray(current) ||
        !Array.isArray(next) ||
        !Number.isFinite(current[0]) ||
        !Number.isFinite(current[1]) ||
        !Number.isFinite(next[0]) ||
        !Number.isFinite(next[1])
      ) {
        throw new Error("A KBA polygon contains an invalid coordinate.");
      }

      const crossProduct = (current[0] * next[1]) - (next[0] * current[1]);
      twiceArea += crossProduct;
      longitudeSum += (current[0] + next[0]) * crossProduct;
      latitudeSum += (current[1] + next[1]) * crossProduct;
    }

    const signedArea = twiceArea / 2;
    if (Math.abs(signedArea) < Number.EPSILON) {
      throw new Error("A KBA polygon contains a zero-area ring.");
    }

    return {
      area: Math.abs(signedArea),
      longitude: longitudeSum / (6 * signedArea),
      latitude: latitudeSum / (6 * signedArea)
    };
  }

  function polygonMetrics(polygon) {
    if (!Array.isArray(polygon) || polygon.length === 0) {
      throw new Error("A KBA polygon is missing its coordinate rings.");
    }

    const outer = ringMetrics(polygon[0]);
    let weightedLongitude = outer.longitude * outer.area;
    let weightedLatitude = outer.latitude * outer.area;
    let totalArea = outer.area;

    polygon.slice(1).forEach((hole) => {
      const inner = ringMetrics(hole);
      weightedLongitude -= inner.longitude * inner.area;
      weightedLatitude -= inner.latitude * inner.area;
      totalArea -= inner.area;
    });

    if (totalArea <= 0) {
      throw new Error("A KBA polygon has invalid interior-ring geometry.");
    }

    return {
      area: totalArea,
      longitude: weightedLongitude / totalArea,
      latitude: weightedLatitude / totalArea
    };
  }

  function geometryPolygons(geometry) {
    if (!geometry || !hasValue(geometry.type)) {
      throw new Error("A KBA feature is missing its geometry.");
    }

    if (geometry.type === "Polygon") return [geometry.coordinates];
    if (geometry.type === "MultiPolygon") return geometry.coordinates;
    if (geometry.type === "GeometryCollection") {
      return geometry.geometries.flatMap(geometryPolygons);
    }

    throw new Error(`Unsupported KBA geometry type: ${geometry.type}`);
  }

  function geoJsonPolygons(geoJson) {
    if (!geoJson || geoJson.type !== "FeatureCollection" || !Array.isArray(geoJson.features)) {
      throw new Error("A KBA file is not a valid GeoJSON FeatureCollection.");
    }

    const polygons = geoJson.features.flatMap((feature) => geometryPolygons(feature.geometry));
    if (polygons.length === 0) {
      throw new Error("A KBA GeoJSON file does not contain polygon geometry.");
    }
    return polygons;
  }

  function areaWeightedCentroid(polygons) {
    let totalArea = 0;
    let weightedLongitude = 0;
    let weightedLatitude = 0;

    polygons.forEach((polygon) => {
      const metrics = polygonMetrics(polygon);
      totalArea += metrics.area;
      weightedLongitude += metrics.longitude * metrics.area;
      weightedLatitude += metrics.latitude * metrics.area;
    });

    if (totalArea <= 0) {
      throw new Error("Could not calculate the KBA polygon area.");
    }

    return [weightedLongitude / totalArea, weightedLatitude / totalArea];
  }

  function pointOnSegment(point, start, end) {
    const epsilon = 1e-12;
    const segmentLongitude = end[0] - start[0];
    const segmentLatitude = end[1] - start[1];
    const squaredLength = (segmentLongitude ** 2) + (segmentLatitude ** 2);

    if (squaredLength <= epsilon) {
      return Math.abs(point[0] - start[0]) <= epsilon
        && Math.abs(point[1] - start[1]) <= epsilon;
    }

    const cross = ((point[1] - start[1]) * (end[0] - start[0]))
      - ((point[0] - start[0]) * (end[1] - start[1]));
    if (Math.abs(cross) > epsilon) return false;

    const dot = ((point[0] - start[0]) * (end[0] - start[0]))
      + ((point[1] - start[1]) * (end[1] - start[1]));
    if (dot < -epsilon) return false;

    return dot <= squaredLength + epsilon;
  }

  function pointInRing(point, ring) {
    let inside = false;

    for (let currentIndex = 0, previousIndex = ring.length - 1;
      currentIndex < ring.length;
      previousIndex = currentIndex, currentIndex += 1) {
      const current = ring[currentIndex];
      const previous = ring[previousIndex];

      if (pointOnSegment(point, previous, current)) return true;

      const crossesLatitude = (current[1] > point[1]) !== (previous[1] > point[1]);
      const intersectionLongitude = ((previous[0] - current[0])
        * (point[1] - current[1]) / (previous[1] - current[1])) + current[0];

      if (crossesLatitude && point[0] < intersectionLongitude) inside = !inside;
    }

    return inside;
  }

  function pointInPolygon(point, polygon) {
    if (!pointInRing(point, polygon[0])) return false;
    return !polygon.slice(1).some((hole) => pointInRing(point, hole));
  }

  function pointInPolygons(point, polygons) {
    return polygons.some((polygon) => pointInPolygon(point, polygon));
  }

  function ringScanlineIntersections(ring, latitude) {
    const intersections = [];
    for (let index = 0, previousIndex = ring.length - 1;
      index < ring.length;
      previousIndex = index, index += 1) {
      const current = ring[index];
      const previous = ring[previousIndex];
      if ((current[1] > latitude) !== (previous[1] > latitude)) {
        intersections.push(
          current[0] + ((latitude - current[1]) * (previous[0] - current[0])
            / (previous[1] - current[1]))
        );
      }
    }
    return intersections;
  }

  function representativeInteriorPoint(polygons, preferredPoint) {
    const allLatitudes = polygons
      .flatMap((polygon) => polygon.flatMap((ring) => ring.map((position) => position[1])))
      .filter(Number.isFinite)
      .sort((first, second) => first - second);
    const uniqueLatitudes = [...new Set(allLatitudes)];
    const candidateLatitudes = [preferredPoint[1]];

    for (let index = 0; index < uniqueLatitudes.length - 1; index += 1) {
      candidateLatitudes.push((uniqueLatitudes[index] + uniqueLatitudes[index + 1]) / 2);
    }

    let bestPoint = null;
    let bestWidth = -Infinity;

    polygons.forEach((polygon) => {
      candidateLatitudes.forEach((latitude) => {
        const intersections = polygon
          .flatMap((ring) => ringScanlineIntersections(ring, latitude))
          .sort((first, second) => first - second);

        for (let index = 0; index < intersections.length - 1; index += 1) {
          const left = intersections[index];
          const right = intersections[index + 1];
          const candidate = [(left + right) / 2, latitude];
          const width = right - left;
          if (width > bestWidth && pointInPolygon(candidate, polygon)) {
            bestPoint = candidate;
            bestWidth = width;
          }
        }
      });
    });

    if (!bestPoint) {
      throw new Error("Could not calculate an interior representative point for a KBA polygon.");
    }

    return bestPoint;
  }

  function calculateRepresentativePoint(geoJson) {
    const polygons = geoJsonPolygons(geoJson);
    const centroid = areaWeightedCentroid(polygons);

    if (pointInPolygons(centroid, polygons)) {
      return {
        lng: centroid[0],
        lat: centroid[1],
        method: CENTROID_METHOD
      };
    }

    const interiorPoint = representativeInteriorPoint(polygons, centroid);
    return {
      lng: interiorPoint[0],
      lat: interiorPoint[1],
      method: INTERIOR_METHOD
    };
  }

  function validateCoordinateRecord(record, label) {
    if (!hasValue(record.nameKh) || !hasValue(record.nameEn)) {
      throw new Error(`${label} is missing a Khmer or English name.`);
    }
    if (!Number.isFinite(record.lat) || !Number.isFinite(record.lng)) {
      throw new Error(`${label} has an invalid coordinate.`);
    }
    if (record.lat < -90 || record.lat > 90 || record.lng < -180 || record.lng > 180) {
      throw new Error(`${label} has an out-of-range coordinate.`);
    }
  }

  async function loadKbaArea(area, fetchFunction) {
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

    const geoJson = await response.json();
    const representativePoint = calculateRepresentativePoint(geoJson);
    const result = {
      id: area.id,
      nameKh: area.nameKh,
      nameEn: area.nameEn,
      lat: representativePoint.lat,
      lng: representativePoint.lng,
      method: representativePoint.method
    };
    validateCoordinateRecord(result, area.nameEn);
    return result;
  }

  async function buildCoordinateSummary(siteData, areaData, fetchFunction) {
    if (!Array.isArray(siteData) || !Array.isArray(areaData)) {
      throw new Error("Coordinate source data is not available.");
    }

    const communeIds = new Set();
    const communes = siteData.map((site) => {
      validateCoordinateRecord(site, site.nameEn || site.id || "Project site");
      if (communeIds.has(site.id)) {
        throw new Error(`Duplicate project-site ID: ${site.id}`);
      }
      communeIds.add(site.id);
      return {
        id: site.id,
        nameKh: site.nameKh,
        nameEn: site.nameEn,
        lat: site.lat,
        lng: site.lng
      };
    });

    const kbaAreas = await Promise.all(
      areaData.map((area) => loadKbaArea(area, fetchFunction))
    );

    return { kbaAreas, communes };
  }

  function csvCell(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
  }

  function createCsv(summary) {
    const rows = [
      ["Type", "Khmer Name", "English Name", "Latitude", "Longitude"],
      ...summary.kbaAreas.map((area) => [
        "KBA/Core Area",
        area.nameKh,
        area.nameEn,
        area.lat.toFixed(6),
        area.lng.toFixed(6)
      ]),
      ...summary.communes.map((commune) => [
        "Commune/Project Site",
        commune.nameKh,
        commune.nameEn,
        commune.lat.toFixed(6),
        commune.lng.toFixed(6)
      ])
    ];

    return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  }

  function copyText(summary) {
    const lines = [
      "3 KBA/Core Areas",
      ...summary.kbaAreas.map((area, index) => (
        `${index + 1}. ${area.nameKh} | ${area.nameEn} | ${area.lat.toFixed(6)}, ${area.lng.toFixed(6)}`
      )),
      "",
      "12 Communes / Project Sites",
      ...summary.communes.map((commune, index) => (
        `${index + 1}. ${commune.nameKh} | ${commune.nameEn} | ${commune.lat.toFixed(6)}, ${commune.lng.toFixed(6)}`
      ))
    ];
    return lines.join("\n");
  }

  function downloadCsv(summary) {
    const blob = new Blob(["\uFEFF", createCsv(summary)], {
      type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = CSV_FILENAME;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function writeToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();
    if (!copied) throw new Error("Copying coordinates is not supported by this browser.");
  }

  function addCell(row, value, className, label) {
    const cell = document.createElement("td");
    cell.textContent = value;
    if (className) cell.className = className;
    if (label) cell.dataset.label = label;
    row.appendChild(cell);
  }

  function renderKbaTable(kbaAreas, tableBody, methodList) {
    tableBody.textContent = "";
    methodList.textContent = "";
    kbaAreas.forEach((area, index) => {
      const row = document.createElement("tr");
      addCell(row, String(index + 1), "coordinate-index", "No.");
      addCell(row, area.nameKh, "coordinate-name-kh", "Khmer");
      addCell(row, area.nameEn, "coordinate-name-en", "English");
      addCell(row, area.lat.toFixed(6), "coordinate-number", "Latitude");
      addCell(row, area.lng.toFixed(6), "coordinate-number", "Longitude");
      tableBody.appendChild(row);

      const methodItem = document.createElement("li");
      const areaName = document.createElement("strong");
      areaName.textContent = `${area.nameEn}: `;
      methodItem.appendChild(areaName);
      methodItem.appendChild(document.createTextNode(area.method));
      methodList.appendChild(methodItem);
    });
  }

  function setupCoordinateSummaryUi() {
    const panelToggle = document.getElementById("coordinate-table-toggle");
    const kbaTableBody = document.getElementById("kba-coordinate-table-body");
    const kbaMethodList = document.getElementById("kba-coordinate-methods");
    const copyButton = document.getElementById("copy-coordinates-button");
    const csvButton = document.getElementById("csv-export-button");
    const status = document.getElementById("coordinate-summary-status");
    const communeTab = document.getElementById("commune-coordinates-tab");
    const kbaTab = document.getElementById("kba-coordinates-tab");
    const communePanel = document.getElementById("commune-coordinates-panel");
    const kbaPanel = document.getElementById("kba-coordinates-panel");
    if (
      !panelToggle || !kbaTableBody || !kbaMethodList || !copyButton || !csvButton ||
      !status || !communeTab || !kbaTab || !communePanel || !kbaPanel
    ) return;

    let summaryPromise = null;
    let currentSummary = null;

    function setStatus(message, isError) {
      status.textContent = message;
      status.hidden = !message;
      status.classList.toggle("is-error", Boolean(isError));
    }

    function activateTab(activeTab, activePanel, inactiveTab, inactivePanel) {
      activeTab.classList.add("is-active");
      activeTab.setAttribute("aria-selected", "true");
      activeTab.tabIndex = 0;
      activePanel.hidden = false;
      inactiveTab.classList.remove("is-active");
      inactiveTab.setAttribute("aria-selected", "false");
      inactiveTab.tabIndex = -1;
      inactivePanel.hidden = true;
      activeTab.focus();
    }

    async function ensureSummary() {
      if (currentSummary) return currentSummary;
      if (!summaryPromise) {
        setStatus("Calculating KBA representative coordinates…", false);
        summaryPromise = buildCoordinateSummary(localPlaces, importantAreas, fetch)
          .then((summary) => {
            currentSummary = summary;
            renderKbaTable(summary.kbaAreas, kbaTableBody, kbaMethodList);
            copyButton.disabled = false;
            csvButton.disabled = false;
            setStatus("", false);
            return summary;
          })
          .catch((error) => {
            summaryPromise = null;
            console.error("Coordinate summary failed:", error);
            setStatus(error.message || "Could not load the coordinate summary.", true);
            throw error;
          });
      }
      return summaryPromise;
    }

    panelToggle.addEventListener("click", () => {
      ensureSummary().catch(() => {});
    });

    communeTab.addEventListener("click", () => {
      activateTab(communeTab, communePanel, kbaTab, kbaPanel);
    });

    kbaTab.addEventListener("click", () => {
      activateTab(kbaTab, kbaPanel, communeTab, communePanel);
    });

    [communeTab, kbaTab].forEach((tab) => {
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const showKba = event.key === "End"
          || ((event.key === "ArrowLeft" || event.key === "ArrowRight") && tab === communeTab);
        if (showKba) {
          activateTab(kbaTab, kbaPanel, communeTab, communePanel);
        } else {
          activateTab(communeTab, communePanel, kbaTab, kbaPanel);
        }
      });
    });

    copyButton.addEventListener("click", async () => {
      try {
        const summary = await ensureSummary();
        await writeToClipboard(copyText(summary));
        setStatus("Coordinates copied.", false);
      } catch (error) {
        console.error("Could not copy coordinates:", error);
        setStatus(error.message || "Could not copy the coordinates.", true);
      }
    });

    csvButton.addEventListener("click", async () => {
      try {
        const summary = await ensureSummary();
        downloadCsv(summary);
        setStatus("Coordinate CSV downloaded.", false);
      } catch (error) {
        console.error("Could not export coordinate CSV:", error);
        setStatus(error.message || "Could not create the coordinate CSV.", true);
      }
    });
  }

  const api = {
    buildCoordinateSummary,
    calculateRepresentativePoint,
    createCsv,
    copyText
  };

  global.TonleSapCoordinates = api;

  if (typeof document !== "undefined") {
    setupCoordinateSummaryUi();
  }
}(typeof window !== "undefined" ? window : globalThis));
