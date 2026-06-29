/* ==========================================================
   Monitor de Sismos
   Lógica principal
========================================================== */

let chileEarthquakes = [];
let worldEarthquakes = [];

/* ==========================
   Inicio
========================== */

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    bindEvents();
    loadData();
});

/* ==========================
   Eventos
========================== */

function bindEvents() {
    document.getElementById("refreshBtn").addEventListener("click", loadData);
    document.getElementById("centerChileBtn").addEventListener("click", centerChile);
    document.getElementById("viewWorldBtn").addEventListener("click", viewWorld);

document.getElementById("sourceSelect").addEventListener("change", () => {
    renderTable();
    renderMap();
});

document.getElementById("minMagnitude").addEventListener("change", () => {
    renderTable();
    renderMap();
});
}

/* ==========================
   Carga de datos
========================== */

async function loadData() {
    setLoadingState();

    try {
        const [lastChile, chileList, worldData] = await Promise.all([
            getLastChileEarthquake(),
            getChileEarthquakes(),
            getWorldEarthquakes()
        ]);

        chileEarthquakes = normalizeChileData(chileList);
        worldEarthquakes = normalizeUSGSData(worldData);

        renderLastChile(lastChile);
        renderTable();
        renderMap();

        document.getElementById("lastUpdate").textContent =
            `Actualizado: ${new Date().toLocaleTimeString("es-CL", {
                hour: "2-digit",
                minute: "2-digit"
            })}`;

    } catch (error) {
        showError(error);
    }
}

/* ==========================
   Normalización de datos
========================== */

function normalizeChileData(data) {

    let list = [];

    if (Array.isArray(data)) {

        list = data;

    } else if (Array.isArray(data.data)) {

        list = data.data;

    } else if (Array.isArray(data.earthquakes)) {

        list = data.earthquakes;

    } else if (data && typeof data.data === "object") {

        list = [data.data];

    }

    return list.map(item => ({
        date: item.fecha || item.date || "",
        time: item.hora || item.hour || "",
        magnitude: parseFloat(item.magnitud || item.magnitude || item.mag || 0),
        depth: item.profundidad || item.depth || "",
        location: item.lugar || item.place || item.location || "",
        latitude: parseFloat(item.latitud || item.latitude || item.lat || 0),
        longitude: parseFloat(item.longitud || item.longitude || item.lon || 0),
        source: "Boostr / CSN",
        url: item.url || item.informe || item.report || item.info || ""
    })).map(item => ({
        ...item,
        date: item.time ? `${item.date} ${item.time}` : item.date
    })).filter(item => item.latitude && item.longitude);

}
function normalizeUSGSData(data) {
    if (!data || !Array.isArray(data.features)) return [];

    return data.features.map(feature => {
        const props = feature.properties || {};
        const coords = feature.geometry?.coordinates || [];

        return {
            date: props.time ? new Date(props.time).toLocaleString("es-CL") : "",
            magnitude: props.mag || 0,
            depth: coords[2] !== undefined ? `${coords[2]} km` : "",
            location: props.place || "",
            latitude: coords[1],
            longitude: coords[0],
            source: "USGS",
            url: props.url || ""
        };
    }).filter(item => item.latitude && item.longitude);
}

/* ==========================
   Último sismo Chile
========================== */

function renderLastChile(data) {
    const magnitude = data.magnitud || data.magnitude || data.mag || "--";
    const depth = data.profundidad || data.depth || "--";
    const location = data.lugar || data.place || data.location || "--";
    const date =
        data.fecha ||
        data.date ||
        data.datetime ||
        data.hora ||
        "--";

    document.getElementById("lastMagnitude").textContent = magnitude;
    document.getElementById("lastDepth").textContent = depth;
    document.getElementById("lastDateTime").textContent = date;
    document.getElementById("lastLocation").textContent = location;

    const link = data.url || data.informe || data.report || "";

    const reportLink = document.getElementById("lastReportLink");

    if (link) {
        reportLink.href = link;
        reportLink.classList.remove("hidden");
    } else {
        reportLink.classList.add("hidden");
    }
}

/* ==========================
   Tabla
========================== */

function renderTable() {
    const source = document.getElementById("sourceSelect").value;
    const minMagnitude = parseFloat(document.getElementById("minMagnitude").value);

    const data = source === "chile" ? chileEarthquakes : worldEarthquakes;

    const filtered = data.filter(item => item.magnitude >= minMagnitude);

    const tbody = document.getElementById("earthquakeTableBody");

    if (!filtered.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No hay registros para los filtros seleccionados.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td>${item.date}</td>
            <td>${item.magnitude}</td>
            <td>${item.depth}</td>
            <td>${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">${item.location}</a>` : item.location}</td>
            <td>${item.source}</td>
        </tr>
    `).join("");
}

/* ==========================
   Mapa
========================== */

function renderMap() {
    clearMarkers();

    const selectedSource = document.getElementById("sourceSelect").value;
    const data = selectedSource === "chile" ? chileEarthquakes : worldEarthquakes;
    const minMagnitude = parseFloat(document.getElementById("minMagnitude").value);
    const filtered = data.filter(item => item.magnitude >= minMagnitude);

    filtered.slice(0, 100).forEach(item => {
        addMarker(
            item.latitude,
            item.longitude,
            `
                <strong>Magnitud ${item.magnitude}</strong><br>
                ${item.location}<br>
                Profundidad: ${item.depth}<br>
                Fecha: ${item.date}
            `
        );
    });
}

/* ==========================
   Estados
========================== */

function setLoadingState() {
    document.getElementById("lastUpdate").textContent = "Actualizando...";
    document.getElementById("earthquakeTableBody").innerHTML = `
        <tr>
            <td colspan="5" class="empty-state">
                Cargando datos...
            </td>
        </tr>
    `;
}

function showError(error) {
    document.getElementById("lastUpdate").textContent = "Error al actualizar";

    document.getElementById("earthquakeTableBody").innerHTML = `
        <tr>
            <td colspan="5" class="empty-state">
                No fue posible cargar la información. Intenta nuevamente.
            </td>
        </tr>
    `;

    console.error(error);
}
