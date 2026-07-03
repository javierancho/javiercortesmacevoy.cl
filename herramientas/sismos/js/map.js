/* ==========================================================
   Monitor de Sismos
   Gestión del mapa (Leaflet)
========================================================== */

let map;
let markers = [];

function initMap() {
    map = L.map("map", {
        worldCopyJump: true
    }).setView([-30.0, -71.0], 4);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 18
        }
    ).addTo(map);
}

function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });

    markers = [];
}

function getMagnitudeColor(magnitude) {
    if (magnitude >= 6) return "#b91c1c";
    if (magnitude >= 5) return "#dc2626";
    if (magnitude >= 4) return "#f97316";
    if (magnitude >= 3) return "#facc15";
    if (magnitude >= 2) return "#60a5fa";
    return "#94a3b8";
}

function getMagnitudeRadius(magnitude) {
    if (magnitude >= 6) return 24;
    if (magnitude >= 5) return 20;
    if (magnitude >= 4) return 16;
    if (magnitude >= 3) return 12;
    if (magnitude >= 2) return 9;
    return 6;
}

function addMarker(lat, lon, popup, magnitude = 2) {
    const color = getMagnitudeColor(magnitude);
    const radius = getMagnitudeRadius(magnitude);

    const marker = L.circleMarker([lat, lon], {
        radius: radius,
        color: color,
        weight: 1,
        fillColor: color,
        fillOpacity: 0.38,
        opacity: 0.75
    });

    marker.bindPopup(popup);
    marker.addTo(map);

    markers.push(marker);
}

function centerChile() {
    map.setView([-30.0, -71.0], 4);
}

function viewWorld() {
    map.setView([15, 0], 2);
}
