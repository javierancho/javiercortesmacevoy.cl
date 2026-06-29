/* ==========================================================
   Monitor de Sismos
   Gestión del mapa (Leaflet)
========================================================== */

let map;
let markers = [];

/**
 * Inicializa el mapa
 */
function initMap() {

    map = L.map("map").setView([-30.0, -71.0], 4);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

}

/**
 * Elimina todos los marcadores
 */
function clearMarkers() {

    markers.forEach(marker => {

        map.removeLayer(marker);

    });

    markers = [];

}

/**
 * Agrega un marcador
 */
function addMarker(lat, lon, popup) {

    const marker = L.marker([lat, lon]);

    marker.bindPopup(popup);

    marker.addTo(map);

    markers.push(marker);

}

/**
 * Centrar en Chile
 */
function centerChile() {

    map.setView([-30.0, -71.0], 4);

}

/**
 * Mostrar mundo
 */
function viewWorld() {

    map.setView([15, 0], 2);

}
