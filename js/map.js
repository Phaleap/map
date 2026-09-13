/* global L, coreAreas, targetCommunes, provinces */
(function () {
  "use strict";

  // Coordinates bounding the Tonlé Sap lake basin
  const lakeBounds = L.latLngBounds([12.20, 103.40], [13.45, 104.90]);
  const dragBounds = L.latLngBounds([11.80, 103.10], [13.75, 105.20]);

  let map;
  let currentMode = "coreAreas"; // 'coreAreas' | 'communes' | 'provinces'
  let selectedItemId = null;

  const markers = new Map();
  const coreBoundaries = new Map();
  const geoJsonCache = new Map();

  // DOM Elements
  const btnResetLake = document.getElementById("btn-reset-lake");
  const tabCore = document.getElementById("tab-core");
  const tabCommunes = document.getElementById("tab-communes");
  const tabProvinces = document.getElementById("tab-provinces");
  const drawerCategoryTitle = document.getElementById("drawer-category-title");
  const drawerList = document.getElementById("drawer-list");
  const drawerDetail = document.getElementById("drawer-detail");
  const btnCloseDetail = document.getElementById("btn-close-detail");
  const btnDetailBack = document.getElementById("btn-detail-back");

  // Detail Card Elements
  const detailBadge = document.getElementById("detail-badge");
  const detailTitleEn = document.getElementById("detail-title-en");
  const detailTitleKh = document.getElementById("detail-title-kh");
  const detailHighlight = document.getElementById("detail-highlight");
  const detailStats = document.getElementById("detail-stats");
  const detailDesc = document.getElementById("detail-desc");

  function initMap() {
    map = L.map("map", {
      zoomControl: true,
      scrollWheelZoom: true,
      maxBounds: dragBounds,
      maxBoundsViscosity: 0.9,
      minZoom: 9,
      maxZoom: 16
    });

    // Clean, readable OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
    }).addTo(map);

    // Initial positioning to show the whole lake
    resetWholeLakeView();
  }

  function resetWholeLakeView() {
    selectedItemId = null;
    hideDetailView();
    updateMarkersHighlight();
    resetCoreBoundariesStyle();

    const isMobile = window.innerWidth <= 860;
    map.fitBounds(lakeBounds, {
      paddingTopLeft: isMobile ? [10, 120] : [430, 20],
      paddingBottomRight: isMobile ? [10, 260] : [20, 20]
    });
  }

  // Load and pre-render all 3 Core Area boundaries on the lake
  async function loadCoreBoundaries() {
    for (const area of coreAreas) {
      if (!area.geoJsonFile) continue;
      try {
        let geojson = geoJsonCache.get(area.geoJsonFile);
        if (!geojson) {
          const res = await fetch(area.geoJsonFile);
          geojson = await res.json();
          geoJsonCache.set(area.geoJsonFile, geojson);
        }

        const layer = L.geoJSON(geojson, {
          style: getBoundaryStyle(area.id === selectedItemId)
        }).addTo(map);

        layer.bringToBack();
        layer.on("click", () => selectItem(area, "coreAreas"));
        coreBoundaries.set(area.id, layer);
      } catch (err) {
        console.error("Could not load boundary for:", area.nameEn, err);
      }
    }
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
      fillOpacity: 0.08
    };
  }

  function resetCoreBoundariesStyle() {
    coreBoundaries.forEach((layer, id) => {
      layer.setStyle(getBoundaryStyle(id === selectedItemId));
    });
  }

  function createMarkerIcon(item, mode) {
    let emoji = "🌿";
    let pinClass = "core-pin";

    if (mode === "communes") {
      emoji = "📍";
      pinClass = "commune-pin";
    } else if (mode === "provinces") {
      emoji = "🏛️";
      pinClass = "province-pin";
    }

    return L.divIcon({
      className: `custom-pin ${pinClass}`,
      html: `<span>${emoji}</span>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  }

  function renderModeMarkers(mode) {
    // Clear existing markers from map
    markers.forEach((marker) => map.removeLayer(marker));
    markers.clear();

    const data = getActiveData(mode);

    data.forEach((item) => {
      const icon = createMarkerIcon(item, mode);
      const marker = L.marker([item.lat, item.lng], { icon })
        .bindPopup(createPopupHtml(item), { className: "donor-popup-wrapper", closeButton: false });

      marker.on("click", () => selectItem(item, mode));
      marker.addTo(map);
      markers.set(item.id, marker);
    });

    updateMarkersHighlight();
  }

  function createPopupHtml(item) {
    let statHtml = "";
    if (item.stats && item.stats.length > 0) {
      statHtml = `<div class="popup-metric">${item.stats[0].label}: ${item.stats[0].value}</div>`;
    } else if (item.targetCommunesCount) {
      statHtml = `<div class="popup-metric">${item.targetCommunesCount} Target Communes</div>`;
    }

    return `
      <div class="donor-popup">
        <div class="popup-title-en">${item.nameEn}</div>
        <div class="popup-title-kh">${item.nameKh}</div>
        ${statHtml}
      </div>
    `;
  }

  function updateMarkersHighlight() {
    markers.forEach((marker, id) => {
      const el = marker.getElement();
      if (!el) return;
      if (id === selectedItemId) {
        el.classList.add("selected");
        marker.setZIndexOffset(1000);
      } else {
        el.classList.remove("selected");
        marker.setZIndexOffset(0);
      }
    });
  }

  function getActiveData(mode) {
    if (mode === "coreAreas") return coreAreas;
    if (mode === "communes") return targetCommunes;
    if (mode === "provinces") return provinces;
    return coreAreas;
  }

  function updateCategoryHeaders(mode) {
    if (mode === "coreAreas") {
      drawerCategoryTitle.innerHTML = `
        <h2>3 Core Conservation Areas</h2>
        <p>UNESCO Biosphere Reserves & Ramsar Protected Wetlands</p>
      `;
    } else if (mode === "communes") {
      drawerCategoryTitle.innerHTML = `
        <h2>12 Target Communes</h2>
        <p>Community Fisheries (CFi) Across 5 Provinces</p>
      `;
    } else if (mode === "provinces") {
      drawerCategoryTitle.innerHTML = `
        <h2>5 Surrounding Provinces</h2>
        <p>The Provinces Bordering the Tonlé Sap Great Lake</p>
      `;
    }
  }

  function renderDrawerList(mode) {
    const data = getActiveData(mode);

    drawerList.innerHTML = data.map((item) => {
      const isSelected = item.id === selectedItemId;
      const subtitle = item.provinceEn ? `${item.provinceEn} Province · ${item.districtEn || ""}` : (item.nameKh || "");
      const statSnippet = item.stats ? `${item.stats[0].label}: ${item.stats[0].value}` : (item.highlight || "");

      return `
        <button class="card-item ${isSelected ? "selected" : ""}" type="button" data-id="${item.id}">
          <div class="card-top">
            <div>
              <div class="card-title-en">${item.nameEn}</div>
              <div class="card-title-kh">${item.nameKh}</div>
            </div>
            <span class="badge">${item.statusBadge || (mode === "communes" ? "CFi Commune" : "Province")}</span>
          </div>
          <div class="card-highlight">${item.highlight || ""}</div>
          <div class="card-footer">
            <span>${statSnippet}</span>
            <span class="arrow">→</span>
          </div>
        </button>
      `;
    }).join("");

    drawerList.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = data.find((d) => d.id === btn.dataset.id);
        if (item) selectItem(item, mode);
      });
    });
  }

  async function selectItem(item, mode) {
    if (!item) return;
    selectedItemId = item.id;

    updateMarkersHighlight();
    showDetailView(item, mode);

    // If it's a Core Area with boundary polygon, fit to the polygon boundary!
    if (mode === "coreAreas" && coreBoundaries.has(item.id)) {
      resetCoreBoundariesStyle();
      const layer = coreBoundaries.get(item.id);
      layer.setStyle(getBoundaryStyle(true));
      layer.bringToFront();

      const isMobile = window.innerWidth <= 860;
      map.fitBounds(layer.getBounds(), {
        paddingTopLeft: isMobile ? [10, 80] : [440, 40],
        paddingBottomRight: isMobile ? [10, 240] : [40, 40],
        maxZoom: 14
      });
    } else {
      resetCoreBoundariesStyle();
      const zoomLevel = item.zoom || (mode === "communes" ? 12 : 10);
      map.flyTo([item.lat, item.lng], zoomLevel, { duration: 1.2 });
    }

    const marker = markers.get(item.id);
    if (marker) {
      setTimeout(() => {
        if (selectedItemId === item.id) marker.openPopup();
      }, 500);
    }
  }

  function showDetailView(item, mode) {
    detailBadge.textContent = item.statusBadge || (mode === "communes" ? "Community Fishery" : "Lake Province");
    detailTitleEn.textContent = item.nameEn;
    detailTitleKh.textContent = item.nameKh;
    detailHighlight.textContent = item.highlight || "";

    // Render Stats Grid
    if (item.stats && item.stats.length > 0) {
      detailStats.innerHTML = item.stats.map((s) => `
        <div class="stat-box">
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `).join("");
      detailStats.hidden = false;
    } else if (item.communesList) {
      detailStats.innerHTML = `
        <div class="stat-box" style="grid-column: span 2;">
          <div class="stat-value">${item.targetCommunesCount} Target Communes</div>
          <div class="stat-label">${item.communesList.join(", ")}</div>
        </div>
      `;
      detailStats.hidden = false;
    } else {
      detailStats.hidden = true;
    }

    detailDesc.textContent = item.description || "";
    detailDesc.hidden = !item.description;

    drawerList.hidden = true;
    drawerDetail.hidden = false;
  }

  function hideDetailView() {
    drawerDetail.hidden = true;
    drawerList.hidden = false;
  }

  function switchMode(newMode) {
    if (currentMode === newMode && selectedItemId === null) return;
    currentMode = newMode;
    selectedItemId = null;

    // Update Tab UI
    [tabCore, tabCommunes, tabProvinces].forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === newMode);
    });

    hideDetailView();
    updateCategoryHeaders(newMode);
    renderModeMarkers(newMode);
    renderDrawerList(newMode);

    // If switching to Core Areas, fit to show all 3 core areas
    if (newMode === "coreAreas") {
      resetCoreBoundariesStyle();
    }
  }

  function setupEventListeners() {
    tabCore.addEventListener("click", () => switchMode("coreAreas"));
    tabCommunes.addEventListener("click", () => switchMode("communes"));
    tabProvinces.addEventListener("click", () => switchMode("provinces"));

    btnResetLake.addEventListener("click", resetWholeLakeView);

    btnCloseDetail.addEventListener("click", () => {
      hideDetailView();
      renderDrawerList(currentMode);
    });

    btnDetailBack.addEventListener("click", () => {
      hideDetailView();
      renderDrawerList(currentMode);
    });
  }

  async function init() {
    initMap();
    setupEventListeners();
    await loadCoreBoundaries();
    switchMode("coreAreas");
  }

  init();
}());
