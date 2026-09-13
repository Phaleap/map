/* global L, areas */
(function () {
  "use strict";

  const lakeBounds = L.latLngBounds([12.18, 103.68], [13.45, 104.78]);
  const dragBounds = L.latLngBounds([11.98, 103.35], [13.67, 105.05]);
  const markerStyle = { radius: 6, weight: 2, color: "#ffffff", fillColor: "#1f8a70", fillOpacity: 1 };

  let map;
  let selectedAreaId = null;
  let activeBoundaryLayer = null;
  const geoJsonCache = new Map();
  const markers = new Map();
  const searchInput = document.getElementById("location-search");
  const clearSearchButton = document.getElementById("clear-search");
  const resultsElement = document.getElementById("location-results");

  function initializeMap() {
    map = L.map("map", {
      zoomControl: false,
      scrollWheelZoom: true,
      maxBounds: dragBounds,
      maxBoundsViscosity: 1,
      minZoom: 10,
      maxZoom: 15
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    map.fitBounds(lakeBounds, { padding: [20, 20] });
  }

  function normalizeSearchText(value) {
    return (value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function matchesArea(area, query) {
    const q = normalizeSearchText(query);
    const values = [
      area.nameKh,
      area.nameEn,
      ...(area.aliasesKh || []),
      ...(area.aliasesEn || [])
    ];
    return values.some((value) => normalizeSearchText(value).includes(q));
  }

  function filterAreas() {
    const query = searchInput.value;
    return query.trim() ? areas.filter((area) => matchesArea(area, query)) : areas;
  }

  function areaPopup(area) {
    return `<div class="popup-kh">${area.nameKh}</div>${area.nameEn ? `<div class="popup-en">${area.nameEn}</div>` : ""}`;
  }

  function createAreaMarkers() {
    areas.forEach((area) => {
      const marker = L.circleMarker([area.lat, area.lng], markerStyle)
        .bindPopup(areaPopup(area), { className: "location-popup" });
      marker.on("click", () => selectArea(area));
      marker.addTo(map);
      markers.set(area.id, marker);
    });
  }

  function highlightSelectedArea() {
    markers.forEach((marker, id) => {
      const isSelected = id === selectedAreaId;
      marker.setStyle({
        weight: isSelected ? 3 : markerStyle.weight,
        fillColor: isSelected ? "#0f766e" : markerStyle.fillColor,
        color: markerStyle.color
      });
      marker.setRadius(isSelected ? 10 : markerStyle.radius);
      if (isSelected) marker.bringToFront();
    });
  }

  function clearActiveBoundary() {
    if (activeBoundaryLayer) {
      map.removeLayer(activeBoundaryLayer);
      activeBoundaryLayer = null;
    }
  }

  async function showAreaBoundary(area) {
    clearActiveBoundary();

    if (!area.geoJsonFile) {
      map.flyTo([area.lat, area.lng], 12);
      return;
    }

    try {
      let geojson = geoJsonCache.get(area.geoJsonFile);
      if (!geojson) {
        const response = await fetch(area.geoJsonFile);
        geojson = await response.json();
        geoJsonCache.set(area.geoJsonFile, geojson);
      }

      if (selectedAreaId !== area.id) return;

      activeBoundaryLayer = L.geoJSON(geojson, {
        style: {
          color: "#087f73",
          weight: 3,
          fillColor: "#18a999",
          fillOpacity: 0.14
        }
      }).addTo(map);

      activeBoundaryLayer.bringToBack();

      map.fitBounds(activeBoundaryLayer.getBounds(), {
        padding: [50, 50]
      });
    } catch (err) {
      console.error("Could not load boundary GeoJSON:", err);
      map.flyTo([area.lat, area.lng], 12);
    }
  }

  function renderAreaList() {
    const results = filterAreas();
    const hasQuery = Boolean(searchInput.value.trim());
    clearSearchButton.hidden = !hasQuery;

    if (!results.length) {
      resultsElement.innerHTML = '<p class="empty-results">រកមិនឃើញទីតាំង<br><span>No location found</span></p>';
      return;
    }

    resultsElement.innerHTML = results.map((area) => `
      <button class="location-card" type="button" data-area-id="${area.id}">
        <span class="card-marker"></span>
        <span>
          <span class="card-name-kh">${area.nameKh}</span>
          ${area.nameEn ? `<span class="card-name-en">${area.nameEn}</span>` : ""}
        </span>
      </button>`).join("");

    resultsElement.querySelectorAll("[data-area-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const area = areas.find((item) => item.id === button.dataset.areaId);
        selectArea(area);
      });
    });
  }

  async function selectArea(area) {
    if (!area) return;
    selectedAreaId = area.id;
    highlightSelectedArea();
    await showAreaBoundary(area);
    const marker = markers.get(area.id);
    if (marker && selectedAreaId === area.id) {
      marker.bringToFront();
      marker.openPopup();
    }
  }

  function clearSearch() {
    searchInput.value = "";
    searchInput.focus();
    renderAreaList();
  }

  function init() {
    initializeMap();
    createAreaMarkers();
    renderAreaList();
    searchInput.addEventListener("input", renderAreaList);
    clearSearchButton.addEventListener("click", clearSearch);
  }

  init();
}());
