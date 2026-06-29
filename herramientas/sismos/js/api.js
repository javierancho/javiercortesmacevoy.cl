/* ============================================================
   Monitor de Sismos
   API Layer
   Javier Cortés Mac Evoy
============================================================ */

/* ---------- Endpoints ---------- */

const BOOSTR_LAST =
    "https://api.boostr.cl/earthquake.json";

const BOOSTR_LIST =
    "https://api.boostr.cl/earthquakes.json";

const USGS_DAY =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


/* ============================================================
   Función genérica
============================================================ */

async function fetchJSON(url) {

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Error ${response.status}`
        );

    }

    return await response.json();

}


/* ============================================================
   Último sismo Chile
============================================================ */

async function getLastChileEarthquake() {

    return await fetchJSON(
        BOOSTR_LAST
    );

}


/* ============================================================
   Últimos sismos Chile
============================================================ */

async function getChileEarthquakes() {

    return await fetchJSON(
        BOOSTR_LIST
    );

}


/* ============================================================
   Sismos mundiales
============================================================ */

async function getWorldEarthquakes() {

    return await fetchJSON(
        USGS_DAY
    );

}
