"use strict";

/*
==========================================================
 Radio Browser API
==========================================================
*/

const RadioAPI = (() => {

    //------------------------------------------------------
    // Consulta genérica
    //------------------------------------------------------

    async function request(endpoint) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, CONFIG.REQUEST_TIMEOUT);

        try {

            const response = await fetch(
                CONFIG.API_BASE + endpoint,
                {
                    signal: controller.signal,
                    headers: {
                        "User-Agent": CONFIG.USER_AGENT
                    }
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error("Error HTTP " + response.status);
            }

            return await response.json();

        }
        catch (error) {

            console.error("Radio Browser:", error);

            return [];

        }

    }

    //------------------------------------------------------
    // Países
    //------------------------------------------------------

    async function getCountries() {

        return await request("/countries");

    }

    //------------------------------------------------------
    // Idiomas
    //------------------------------------------------------

    async function getLanguages() {

        return await request("/languages");

    }

    //------------------------------------------------------
    // Buscar por nombre
    //------------------------------------------------------

    async function searchByName(name) {

        if (!name) return [];

        return await request(
            "/stations/byname/" +
            encodeURIComponent(name)
        );

    }

    //------------------------------------------------------
    // Buscar por país
    //------------------------------------------------------

    async function searchByCountry(countryCode) {

        if (!countryCode) return [];

        return await request(
            "/stations/bycountrycodeexact/" +
            countryCode
        );

    }

    //------------------------------------------------------
    // Buscar por categoría
    //------------------------------------------------------

    async function searchByTag(tag) {

        if (!tag) return [];

        return await request(
            "/stations/bytagexact/" +
            encodeURIComponent(tag)
        );

    }

    //------------------------------------------------------
    // Buscar por idioma
    //------------------------------------------------------

    async function searchByLanguage(language) {

        if (!language) return [];

        return await request(
            "/stations/bylanguageexact/" +
            encodeURIComponent(language)
        );

    }

    //------------------------------------------------------
    // Radios de Chile
    //------------------------------------------------------

    async function getChileStations() {

        return await searchByCountry("CL");

    }

    //------------------------------------------------------
    // Filtrar radios válidas
    //------------------------------------------------------

    function cleanStations(stations) {

        return stations

            .filter(station => station.url_resolved)

            .filter(station => station.lastcheckok === 1)

            .sort((a, b) => b.votes - a.votes)

            .slice(0, CONFIG.MAX_RESULTS);

    }

    //------------------------------------------------------
    // Filtrar por calidad
    //------------------------------------------------------

    function filterByQuality(stations, quality) {

        if (!quality) return stations;

        return stations.filter(station => {

            const bitrate = Number(station.bitrate);

            switch (quality) {

                case "ultra":
                    return bitrate <= 32;

                case "low":
                    return bitrate > 32 && bitrate <= 64;

                case "medium":
                    return bitrate > 64 && bitrate <= 128;

                case "high":
                    return bitrate > 128;

                default:
                    return true;

            }

        });

    }

    //------------------------------------------------------
    // Consumo aproximado
    //------------------------------------------------------

    function estimateUsage(bitrate) {

        return estimateDataUsage(Number(bitrate));

    }

    //------------------------------------------------------

    return {

        getCountries,

        getLanguages,

        searchByName,

        searchByCountry,

        searchByTag,

        searchByLanguage,

        getChileStations,

        cleanStations,

        filterByQuality,

        estimateUsage

    };

})();
