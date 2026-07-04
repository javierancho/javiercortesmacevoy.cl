/* ==========================================================
   Monitor de Sismos
   Lógica principal
========================================================== */

let chileEarthquakes = [];
let worldEarthquakes = [];

document.addEventListener("DOMContentLoaded", () => {
    initMap();
    bindEvents();
    loadData();
});

function bindEvents() {
    document.getElementById("refreshBtn").addEventListener("click", loadData);
    document.getElementById("centerChileBtn").addEventListener("click", centerChile);
    document.getElementById("viewWorldBtn").addEventListener("click", viewWorld);

    document.getElementById("sourceSelect").addEventListener("change", () => {
        renderTable();
        renderMap();
    });

    document.getElementById("periodSelect").addEventListener("change", loadData);

    document.getElementById("minMagnitude").addEventListener("change", () => {
        renderTable();
        renderMap();
    });
}

async function loadData() {
    setLoadingState();

    try {
        const period = document.getElementById("periodSelect").value;

        const [lastChile, chileList, worldData] = await Promise.all([
            getLastChileEarthquake(),
            getChileEarthquakes(),
            getWorldEarthquakes(period, 0)
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

    return list.map(item => {
        const date = item.fecha || item.date || "";
        const time = item.hora || item.hour || "";

        return {
            date: time ? `${date} ${time}` : date,
            rawTime: Date.parse(`${date} ${time}`) || 0,
            magnitude: Number(item.magnitud || item.magnitude || item.mag || 0),
            depth: item.profundidad || item.depth || "",
            location: item.lugar || item.place || item.location || "",
            latitude: Number(item.latitud || item.latitude || item.lat || 0),
            longitude: Number(item.longitud || item.longitude || item.lon || 0),
            source: "Boostr / CSN",
            url: item.url || item.informe || item.report || item.info || ""
        };
    })
    .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .sort((a, b) => b.rawTime - a.rawTime);
}

function normalizeUSGSData(data) {
    if (!data || !Array.isArray(data.features)) return [];

    return data.features.map(feature => {
        const props = feature.properties || {};
        const coords = feature.geometry && feature.geometry.coordinates
            ? feature.geometry.coordinates
            : [];

        return {
            date: props.time ? new Date(props.time).toLocaleString("es-CL") : "",
            rawTime: props.time || 0,
            magnitude: Number(props.mag || 0),
            depth: coords[2] !== undefined ? `${Number(coords[2]).toFixed(1)} km` : "",
            location: props.place || "Sin ubicación",
            latitude: Number(coords[1]),
            longitude: Number(coords[0]),
            source: "USGS FDSN",
            url: props.url || ""
        };
    })
    .filter(item =>
        Number.isFinite(item.latitude) &&
        Number.isFinite(item.longitude)
    )
    .sort((a, b) => b.rawTime - a.rawTime);
}

function renderLastChile(data) {
    const item = data.data || data;

    document.getElementById("lastMagnitude").textContent =
        item.magnitud || item.magnitude || item.mag || "--";

    document.getElementById("lastDepth").textContent =
        item.profundidad || item.depth || "--";

    document.getElementById("lastDateTime").textContent =
        `${item.fecha || item.date || ""} ${item.hora || item.hour || ""}`.trim() || "--";

    document.getElementById("lastLocation").textContent =
        item.lugar || item.place || item.location || "--";

    const link = item.url || item.informe || item.report || item.info || "";
    const reportLink = document.getElementById("lastReportLink");

    if (link) {
        reportLink.href = link;
        reportLink.classList.remove("hidden");
    } else {
        reportLink.classList.add("hidden");
    }
}

function getFilteredData() {
    const source = document.getElementById("sourceSelect").value;
    const minMagnitude = Number(document.getElementById("minMagnitude").value);

    const data = source === "chile"
        ? chileEarthquakes
        : worldEarthquakes;

    return data.filter(item => item.magnitude >= minMagnitude);
}

function renderTable() {
    const filtered = getFilteredData();
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
            <td>
                <span class="mag-badge mag-${getMagnitudeClass(item.magnitude)}">
                    ${formatMagnitude(item.magnitude)}
                </span>
            </td>
            <td>${item.depth}</td>
            <td>
                ${
                    item.url
                        ? `<a href="${item.url}" target="_blank" rel="noopener">${item.location}</a>`
                        : item.location
                }
            </td>
            <td>${item.source}</td>
        </tr>
    `).join("");
}

function renderMap() {
    clearMarkers();

    const filtered = getFilteredData();

    filtered.forEach(item => {
        addMarker(
            item.latitude,
            item.longitude,
            `
                <strong>Magnitud ${formatMagnitude(item.magnitude)}</strong><br>
                ${item.location}<br>
                Profundidad: ${item.depth}<br>
                Fecha: ${item.date}<br>
                Fuente: ${item.source}
            `,
            item.magnitude
        );
    });
}

function getMagnitudeClass(magnitude) {
    if (magnitude >= 6) return "high";
    if (magnitude >= 5) return "strong";
    if (magnitude >= 4) return "medium";
    if (magnitude >= 3) return "light";
    return "low";
}

function formatMagnitude(value) {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "--";
    }

    return number.toFixed(1);
}

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
