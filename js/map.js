/* global L, importantAreas, localPlaces */
(function () {
  "use strict";

  // Bounding box encompassing Tonlé Sap lake, all 12 project locations, and their text labels
  const lakeBounds = L.latLngBounds([12.25, 103.20], [13.42, 105.18]);
  const dragBounds = L.latLngBounds([11.75, 102.60], [14.00, 105.60]);

  const areaLayers = new Map();
  const localPlaceMarkers = new Map();

  let map;
  let selectedItemId = null;

  const infoCard = document.getElementById("info-card");
  const infoKh = document.getElementById("info-kh");
  const infoEn = document.getElementById("info-en");
  const btnCloseInfo = document.getElementById("btn-close-info");

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
  }

  function showBottomCard(item) {
    infoKh.textContent = item.nameKh;
    infoEn.textContent = item.nameEn || "";
    infoEn.hidden = !item.nameEn;
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

  function setupEvents() {
    if (btnCloseInfo) {
      btnCloseInfo.addEventListener("click", () => {
        clearSelection();
      });
    }

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
