/* global L, importantAreas, provinces, localPlaces */
(function () {
  "use strict";
  const lakeBounds = L.latLngBounds([12.28, 103.38], [13.42, 104.82]);
  const dragBounds = L.latLngBounds([11.95, 103.05], [13.75, 105.15]);
  const areaLayers = new Map();
  const placeMarkers = new Map();
  let map;
  const infoCard = document.getElementById("info-card");
  const infoKh = document.getElementById("info-kh");
  const infoEn = document.getElementById("info-en");
  const legend = document.getElementById("legend");
  const legendButton = document.getElementById("btn-legend");

  function initializeMap() {
    map = L.map("map", { zoomControl: true, minZoom: 9, maxZoom: 15, maxBounds: dragBounds, maxBoundsViscosity: 0.8, zoomSnap: 0.25 });
    map.zoomControl.setPosition("bottomright");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
    resetToTonleSap();
  }
  function areaStyle(isSelected) { return { color: isSelected ? "#004f49" : "#087b72", weight: isSelected ? 5 : 3, opacity: 1, fillColor: "#37bca6", fillOpacity: isSelected ? 0.43 : 0.20 }; }
  function showInfo(item) { infoEn.textContent = item.nameEn; infoKh.textContent = item.nameKh; infoCard.hidden = false; }
  function clearSelection() {
    areaLayers.forEach((layer) => layer.setStyle(areaStyle(false)));
    placeMarkers.forEach((marker) => marker.setStyle({ fillColor: "#d76d23", color: "#ffffff", weight: 3, radius: 9 }));
  }
  function highlightArea(area, fitToArea) {
    clearSelection();
    const layer = areaLayers.get(area.id);
    if (layer) { layer.setStyle(areaStyle(true)); layer.bringToFront(); if (fitToArea) map.fitBounds(layer.getBounds(), { padding: [55, 55], maxZoom: 12 }); }
    showInfo(area);
  }
  function highlightLocalPlace(place) {
    clearSelection();
    const marker = placeMarkers.get(place.id);
    if (marker) marker.setStyle({ fillColor: "#9d3f05", color: "#ffffff", weight: 4, radius: 12 });
    showInfo(place);
  }
  async function loadImportantAreaPolygons() {
    await Promise.all(importantAreas.map(async (area) => {
      try {
        const response = await fetch(area.geoJsonFile);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const geoJson = await response.json();
        const layer = L.geoJSON(geoJson, { style: areaStyle(false) }).addTo(map);
        layer.on("click", () => highlightArea(area, false));
        areaLayers.set(area.id, layer);
        addAreaLabel(area);
      } catch (error) { console.error(`Could not load conservation area: ${area.id}`, error); }
    }));
  }
  function addAreaLabel(area) {
    const icon = L.divIcon({ className: "area-label-marker", html: `<button class="area-label" type="button" aria-label="${area.nameEn}"><span>${area.nameEn}</span><small>${area.nameKh}</small></button>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    L.marker(area.center, { icon, keyboard: false, interactive: true, zIndexOffset: 500 }).on("click", () => highlightArea(area, true)).addTo(map);
  }
  function renderProvinceLabels() {
    provinces.forEach((province) => {
      const icon = L.divIcon({ className: "province-label-marker", html: `<div class="province-label"><span>${province.nameEn}</span><small>${province.nameKh}</small></div>`, iconSize: [0, 0], iconAnchor: [0, 0] });
      L.marker([province.lat, province.lng], { icon, interactive: false, keyboard: false, zIndexOffset: 100 }).addTo(map);
    });
  }
  function renderLocalPlaceMarkers() {
    localPlaces.forEach((place) => {
      const marker = L.circleMarker([place.lat, place.lng], { radius: 9, fillColor: "#d76d23", color: "#ffffff", weight: 3, fillOpacity: 1, className: "local-place-marker" }).addTo(map);
      marker.bindTooltip(`<span class="place-name-en">${place.nameEn}</span><span class="place-name-kh">${place.nameKh}</span>`, { className: "place-tooltip", permanent: true, direction: "right", offset: [9, 0] });
      marker.on("click", () => highlightLocalPlace(place));
      placeMarkers.set(place.id, marker);
    });
  }
  function resetToTonleSap() { clearSelection(); infoCard.hidden = true; map.fitBounds(lakeBounds, { padding: [22, 22], animate: true }); }
  function toggleLegend() { const willOpen = legend.hidden; legend.hidden = !willOpen; legendButton.setAttribute("aria-expanded", String(willOpen)); }
  function setupMobileUI() {
    document.getElementById("btn-reset-view").addEventListener("click", resetToTonleSap);
    legendButton.addEventListener("click", toggleLegend);
    document.getElementById("btn-close-legend").addEventListener("click", toggleLegend);
    document.getElementById("btn-close-info").addEventListener("click", () => { infoCard.hidden = true; });
  }
  function init() { initializeMap(); renderProvinceLabels(); renderLocalPlaceMarkers(); loadImportantAreaPolygons(); setupMobileUI(); }
  init();
}());
