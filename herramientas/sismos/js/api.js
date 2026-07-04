/* ============================================================
   Monitor de Sismos
   API Layer
============================================================ */

const BOOSTR_LAST =
    "https://api.boostr.cl/earthquake.json";

const BOOSTR_LIST =
    "https://api.boostr.cl/earthquakes.json";

const USGS_FDSN =
    "https://earthquake.usgs.gov/fdsnws/event/1/query";

const USGS_LIMIT = 20000;

/* ==========================
   Fetch genérico
========================== */

async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error ${response.status}`);
    }

    return await response.json();
}

/* ==========================
   Fechas
========================== */

function getDateRange(period = "week") {
    const end = new Date();
    const start = new Date(end);

    if (period === "day") {
        start.setDate(end.getDate() - 1);
    } else if (period === "month") {
        start.setDate(end.getDate() - 30);
    } else {
        start.setDate(end.getDate() - 7);
    }

    return {
        starttime: start.toISOString().slice(0, 10),
        endtime: end.toISOString().slice(0, 10)
    };
}

/* ==========================
   Chile - Boostr / CSN
========================== */

async function getLastChileEarthquake() {
    return await fetchJSON(BOOSTR_LAST);
}

async function getChileEarthquakes() {
    return await fetchJSON(BOOSTR_LIST);
}

/* ==========================
   Mundo - USGS FDSN API
========================== */

async function getWorldEarthquakes(period = "week", minMagnitude = 0) {
    const range = getDateRange(period);

    const params = new URLSearchParams({
        format: "geojson",
        starttime: range.starttime,
        endtime: range.endtime,
        minmagnitude: String(minMagnitude),
        eventtype: "earthquake",
        orderby: "time",
        limit: String(USGS_LIMIT)
    });

    return await fetchJSON(`${USGS_FDSN}?${params.toString()}`);
}
