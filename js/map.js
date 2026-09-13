/* global L, importantAreas */
(function () {
  "use strict";

  // Coordinates encompassing the entire Tonlé Sap lake
  const lakeBounds = L.latLngBounds([12.20, 103.45], [13.45, 104.85]);
  const dragBounds = L.latLngBounds([11.80, 103.10], [13.75, 105.20]);

  let map;
  let selectedAreaId = null;

  const markers = new Map();
  const boundaryLayers = new Map();
  const geoJsonCache = new Map();

  const btnResetView = document.getElementById("btn-reset-view");

  function initMap() {
    map = L.map("map", {
      zoomControl: true,
      scrollWheelZoom: true,
      maxBounds: dragBounds,
      maxBoundsViscosity: 0.85,
      minZoom: 9,
      maxZoom: 16
    });

    // Move zoom control to top-left with generous spacing
    map.zoomControl.setPosition("topleft");

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
    }).addTo(map);

    resetToWholeLake();
  }

  function resetToWholeLake() {
    selectedAreaId = null;
    map.closePopup();
    resetBoundaryStyles();
    updateMarkerSelection();
    map.fitBounds(lakeBounds, { padding: [30, 30] });
  }

  function getBoundaryStyle(isSelected) {
    if (isSelected) {
      return {
        color: "#087f73",
        weight: 3.5,
        dashArray: null,
        fillColor: "#18a999",
        fillOpacity: 0.22
      };
    }
    return {
      color: "#0f766e",
      weight: 2,
      dashArray: "6, 6",
      fillColor: "#14b8a6",
      fillOpacity: 0.09
    };
  }

  function resetBoundaryStyles() {
    boundaryLayers.forEach((layer, id) => {
      layer.setStyle(getBoundaryStyle(id === selectedAreaId));
    });
  }

  function updateMarkerSelection() {
    markers.forEach((marker, id) => {
      const el = marker.getElement();
      if (!el) return;
      const wrapper = el.querySelector(".area-pin-wrapper");
      if (wrapper) {
        wrapper.classList.toggle("selected", id === selectedAreaId);
      }
      marker.setZIndexOffset(id === selectedAreaId ? 1000 : 0);
    });
  }

  function createPopupContent(area) {
    return `
      <div class="popup-card">
        <div class="popup-badge-row">
          <span class="popup-badge">${area.badge}</span>
          <span class="popup-size">${area.areaSize}</span>
        </div>
        <div class="popup-title-en">${area.nameEn}</div>
        <div class="popup-title-kh">${area.nameKh}</div>
        <p class="popup-summary">${area.summary}</p>
        <div class="popup-province">📍 ${area.provinceEn} · ${area.provinceKh}</div>
      </div>
    `;
  }

  async function loadAreaBoundariesAndMarkers() {
    for (const area of importantAreas) {
      // 1. Create friendly pin marker with permanent label
      const shortName = area.nameEn.replace(" Core Conservation Area", "").replace(" Core Area", "").replace(" Ramsar Site", "");
      const icon = L.divIcon({
        className: "area-marker-container",
        html: `
          <div class="area-pin-wrapper" title="${area.nameEn}">
            <div class="area-pin-icon">🌿</div>
            <div class="area-pin-label">${shortName}</div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -35]
      });

      const marker = L.marker([area.lat, area.lng], { icon })
        .bindPopup(createPopupContent(area), {
          className: "donor-popup-wrapper",
          autoPanPadding: [60, 60],
          closeButton: true
        });

      marker.on("click", () => selectArea(area));
      marker.addTo(map);
      markers.set(area.id, marker);

      // 2. Load and render real boundary polygon
      if (area.geoJsonFile) {
        try {
          let geojson = geoJsonCache.get(area.geoJsonFile);
          if (!geojson) {
            const res = await fetch(area.geoJsonFile);
            geojson = await res.json();
            geoJsonCache.set(area.geoJsonFile, geojson);
          }

          const layer = L.geoJSON(geojson, {
            style: getBoundaryStyle(false)
          }).addTo(map);

          layer.bringToBack();
          layer.on("click", () => selectArea(area));
          boundaryLayers.set(area.id, layer);
        } catch (err) {
          console.error("Could not load GeoJSON boundary for:", area.nameEn, err);
        }
      }
    }
  }

  function selectArea(area) {
    if (!area) return;
    selectedAreaId = area.id;

    // Highlight this boundary and bring to front
    resetBoundaryStyles();
    updateMarkerSelection();

    const layer = boundaryLayers.get(area.id);
    if (layer) {
      layer.setStyle(getBoundaryStyle(true));
      layer.bringToFront();

      // Zoom & fit to the actual polygon boundary with comfortable padding
      map.fitBounds(layer.getBounds(), {
        padding: [60, 60],
        maxZoom: 13
      });
    } else {
      map.flyTo([area.lat, area.lng], 12, { duration: 1.2 });
    }

    // Open popup after positioning
    const marker = markers.get(area.id);
    if (marker) {
      setTimeout(() => {
        if (selectedAreaId === area.id) {
          marker.openPopup();
        }
      }, 450);
    }
  }

  function init() {
    initMap();
    loadAreaBoundariesAndMarkers();
    btnResetView.addEventListener("click", resetToWholeLake);
  }

  init();
}());
