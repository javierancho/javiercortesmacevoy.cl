"use strict";

/*
==========================================================
 Radio Global
 Configuración general
==========================================================
*/

const CONFIG = {

    // Nombre de la aplicación
    APP_NAME: "Radio Global",

    // Versión
    VERSION: "0.1.0",

    // API Radio Browser
    API_BASE: "https://de1.api.radio-browser.info/json",

    // User Agent recomendado por Radio Browser
    USER_AGENT: "RadioGlobal-javiercortesmacevoy.cl",

    // Tiempo máximo de espera para consultas (ms)
    REQUEST_TIMEOUT: 10000,

    // Cantidad máxima de resultados
    MAX_RESULTS: 50,

    // País inicial
    DEFAULT_COUNTRY: "CL",

    // Idioma inicial
    DEFAULT_LANGUAGE: "",

    // Calidad inicial
    DEFAULT_QUALITY: "",

    // Volumen inicial
    DEFAULT_VOLUME: 0.80,

    // Historial máximo
    MAX_HISTORY: 20,

    // Favoritos máximos
    MAX_FAVORITES: 100,

    // Países destacados
    FEATURED_COUNTRIES: [
        "CL",
        "AR",
        "PE",
        "BR",
        "UY",
        "US",
        "MX",
        "ES",
        "GB",
        "FR",
        "DE",
        "IT",
        "JP",
        "AU"
    ],

    // Categorías visibles
    CATEGORIES: [

        "news",
        "classical",
        "rock",
        "pop",
        "jazz",
        "blues",
        "country",
        "electronic",
        "ambient",
        "lofi",
        "children",
        "sports",
        "talk",
        "culture",
        "public",
        "emergency",
        "hamradio",
        "latin",
        "instrumental",
        "relax"

    ],

    // Clasificación por bitrate
    QUALITY: {

        ultra: {
            name: "Ultra bajo",
            maxBitrate: 32
        },

        low: {
            name: "Bajo",
            maxBitrate: 64
        },

        medium: {
            name: "Medio",
            maxBitrate: 128
        },

        high: {
            name: "Alto",
            minBitrate: 129
        }

    },

    // LocalStorage
    STORAGE: {

        FAVORITES: "rg_favorites",

        HISTORY: "rg_history",

        SETTINGS: "rg_settings",

        LAST_STATION: "rg_last_station"

    }

};

/*
==========================================================
 Utilidades
==========================================================
*/

/**
 * Calcula consumo aproximado de datos.
 * Fórmula:
 * MB/h = bitrate × 0.45
 */
function estimateDataUsage(bitrate) {

    if (!bitrate || bitrate <= 0) {
        return null;
    }

    return Math.round(bitrate * 0.45);

}
