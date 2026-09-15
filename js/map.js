/* global L, importantAreas, localPlaces */
(function () {
  "use strict";

  // Bounding box encompassing Tonlé Sap lake, all 12 project locations, and their text labels
  const lakeBounds = L.latLngBounds([12.25, 103.20], [13.42, 105.18]);
  const dragBounds = L.latLngBounds([11.75, 102.60], [14.00, 105.60]);

  const areaLayers = new Map();
  const localPlaceMarkers = new Map();
  const coordinateTableRows = new Map();

  let map;
  let selectedItemId = null;

  const infoCard = document.getElementById("info-card");
  const infoKh = document.getElementById("info-kh");
  const infoEn = document.getElementById("info-en");
  const infoCoordinates = document.getElementById("info-coordinates");
  const btnCloseInfo = document.getElementById("btn-close-info");
  const coordinateTableToggle = document.getElementById("coordinate-table-toggle");
  const coordinatePanel = document.getElementById("coordinate-panel");
  const coordinatePanelClose = document.getElementById("coordinate-panel-close");
  const coordinateTableBody = document.getElementById("coordinate-table-body");

  function areaStyle(isSelected) {
    return {
      color: isSelected ? "#064e3b" : "#0d7a64",
      weight: isSelected ? 4.5 : 2.5,
      opacity: 1,
      fillColor: "#10b981",
      fillOpacity: isSelected ? 0.35 : 0.15,
      className: "area-polygon-path"
    };
  }

  function markerDefaultStyle() {
    return {
      radius: 6.5,
      weight: 2.5,
      color: "#ffffff",
      fillColor: "#d9531e",
      fillOpacity: 1,
      className: "commune-point-marker"
    };
  }

  function markerSelectedStyle() {
    return {
      radius: 9.5,
      weight: 3.5,
      color: "#ffffff",
      fillColor: "#b71c1c",
      fillOpacity: 1,
      className: "commune-point-marker is-active"
    };
  }

  function initializeMap() {
    map = L.map("map", {
      zoomControl: true,
      minZoom: 6.5,
      maxZoom: 15,
      maxBounds: dragBounds,
      maxBoundsViscosity: 0.85,
      zoomSnap: 0.05
    });

    map.zoomControl.setPosition("bottomright");

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Initial view: Tonlé Sap lake dominates the screen
    fitTonleSap();

    // Map background tap dismisses selection and bottom card
    map.on("click", (e) => {
      if (e.originalEvent && e.originalEvent._handledByMarker) return;
      clearSelection();
    });
  }

  function fitTonleSap() {
    const isMobile = window.innerWidth <= 640;
    const bounds = isMobile
      ? L.latLngBounds([12.15, 103.15], [13.45, 105.25])
      : lakeBounds;

    map.fitBounds(bounds, {
      padding: isMobile ? [12, 12] : [36, 36],
      animate: false
    });
  }

  function clearSelection() {
    selectedItemId = null;
    infoCard.hidden = true;

    // Reset area layers
    areaLayers.forEach((layer) => {
      layer.setStyle(areaStyle(false));
    });

    // Reset commune markers
    localPlaceMarkers.forEach((marker) => {
      marker.setStyle(markerDefaultStyle());
      const el = marker.getElement();
      if (el) el.classList.remove("is-highlighted");
    });

    coordinateTableRows.forEach((row) => {
      row.classList.remove("is-selected");
      row.setAttribute("aria-selected", "false");
    });
  }

  function showBottomCard(item) {
    infoKh.textContent = item.nameKh;
    infoEn.textContent = item.nameEn || "";
    infoEn.hidden = !item.nameEn;

    const hasCoordinates = Number.isFinite(item.lat) && Number.isFinite(item.lng);
    infoCoordinates.hidden = !hasCoordinates;

    if (hasCoordinates) {
      const latitude = item.lat.toFixed(6);
      const longitude = item.lng.toFixed(6);
      infoCoordinates.textContent = `Coordinates: ${latitude}, ${longitude}`;
      infoCoordinates.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
      infoCoordinates.setAttribute(
        "aria-label",
        `Open ${item.nameEn || item.nameKh} coordinates in Google Maps`
      );
    }

    infoCard.hidden = false;
  }

  function selectArea(area) {
    if (selectedItemId === area.id) return;
    clearSelection();
    selectedItemId = area.id;

    const layer = areaLayers.get(area.id);
    if (layer) {
      layer.setStyle(areaStyle(true));
      layer.bringToFront();
    }

    // The name is shown only after a visitor taps the polygon.
    showBottomCard(area);
  }

  function selectCommune(place) {
    if (selectedItemId === place.id) return;
    clearSelection();
    selectedItemId = place.id;

    const marker = localPlaceMarkers.get(place.id);
    if (marker) {
      marker.setStyle(markerSelectedStyle());
      marker.bringToFront();
      const el = marker.getElement();
      if (el) el.classList.add("is-highlighted");
    }

    const tableRow = coordinateTableRows.get(place.id);
    if (tableRow) {
      tableRow.classList.add("is-selected");
      tableRow.setAttribute("aria-selected", "true");
    }

    showBottomCard(place);
  }

  // Render the 3 important-area polygons without permanent labels.
  async function renderImportantAreas() {
    for (const area of importantAreas) {
      try {
        const response = await fetch(area.geoJsonFile);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const geoJson = await response.json();

        const layer = L.geoJSON(geoJson, {
          style: areaStyle(false)
        }).addTo(map);

        layer.on("click", (e) => {
          if (e.originalEvent) e.originalEvent._handledByMarker = true;
          selectArea(area);
        });

        areaLayers.set(area.id, layer);
      } catch (err) {
        console.error(`Could not load GeoJSON boundary for: ${area.id}`, err);
      }
    }
  }

  // Render exactly 12 commune/local-area points
  function renderLocalPlaces() {
    localPlaces.forEach((place) => {
      const marker = L.circleMarker([place.lat, place.lng], markerDefaultStyle()).addTo(map);

      // Attach permanent bilingual label
      const englishLabel = place.nameEn
        ? `<div class="point-name-en">${place.nameEn}</div>`
        : "";

      marker.bindTooltip(`
        <div class="point-label-wrapper">
          <div class="point-name-kh">${place.nameKh}</div>
          ${englishLabel}
        </div>
      `, {
        permanent: true,
        direction: place.labelDirection || "top",
        offset: place.labelOffset || [0, -8],
        className: "commune-point-tooltip",
        interactive: true
      });

      marker.on("click", (e) => {
        if (e.originalEvent) e.originalEvent._handledByMarker = true;
        selectCommune(place);
      });

      localPlaceMarkers.set(place.id, marker);
    });
  }

  function addTableCell(row, value, className) {
    const cell = document.createElement("td");
    cell.textContent = value;
    if (className) cell.className = className;
    row.appendChild(cell);
    return cell;
  }

  function selectSiteFromTable(place) {
    selectCommune(place);
    map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 10), {
      animate: true,
      duration: 0.6
    });

    if (window.innerWidth <= 768) {
      closeCoordinatePanel(false);
      map.getContainer().focus();
    }
  }

  function renderCoordinateTable() {
    localPlaces.forEach((place, index) => {
      const row = document.createElement("tr");
      row.tabIndex = 0;
      row.setAttribute("aria-selected", "false");
      row.setAttribute("aria-label", `${place.nameEn}, ${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}`);

      addTableCell(row, String(index + 1), "coordinate-index");
      addTableCell(row, place.nameKh, "coordinate-name-kh");
      addTableCell(row, place.nameEn || "—", "coordinate-name-en");
      addTableCell(row, place.lat.toFixed(6), "coordinate-number");

      const longitudeCell = document.createElement("td");
      longitudeCell.className = "coordinate-number";
      const googleMapsLink = document.createElement("a");
      googleMapsLink.className = "coordinate-map-link";
      googleMapsLink.href = `https://www.google.com/maps?q=${place.lat.toFixed(6)},${place.lng.toFixed(6)}`;
      googleMapsLink.target = "_blank";
      googleMapsLink.rel = "noopener noreferrer";
      googleMapsLink.textContent = `${place.lng.toFixed(6)} ↗`;
      googleMapsLink.setAttribute("aria-label", `Open ${place.nameEn || place.nameKh} in Google Maps`);
      googleMapsLink.addEventListener("click", (event) => event.stopPropagation());
      longitudeCell.appendChild(googleMapsLink);
      row.appendChild(longitudeCell);

      row.addEventListener("click", () => selectSiteFromTable(place));
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectSiteFromTable(place);
        }
      });

      coordinateTableBody.appendChild(row);
      coordinateTableRows.set(place.id, row);
    });
  }

  function openCoordinatePanel() {
    coordinatePanel.hidden = false;
    coordinatePanel.setAttribute("aria-modal", window.innerWidth <= 768 ? "true" : "false");
    coordinateTableToggle.setAttribute("aria-expanded", "true");
    coordinatePanelClose.focus();
  }

  function closeCoordinatePanel(returnFocus = true) {
    coordinatePanel.hidden = true;
    coordinateTableToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) coordinateTableToggle.focus();
  }

  function setupEvents() {
    if (btnCloseInfo) {
      btnCloseInfo.addEventListener("click", () => {
        clearSelection();
      });
    }

    coordinateTableToggle.addEventListener("click", openCoordinatePanel);
    coordinatePanelClose.addEventListener("click", () => closeCoordinatePanel());

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !coordinatePanel.hidden) {
        closeCoordinatePanel();
      }
    });

    // Window resize maintains Tonlé Sap prominence if no item is selected
    window.addEventListener("resize", () => {
      if (!selectedItemId) {
        fitTonleSap();
      }
    });
  }

  function init() {
    initializeMap();
    renderImportantAreas();
    renderLocalPlaces();
    renderCoordinateTable();
    setupEvents();
  }

  init();

  // Expose select helpers for testing/programmatic taps
  window._tonleSapMap = {
    selectCommune,
    selectArea,
    clearSelection,
    localPlaces,
    importantAreas
  };
}());
