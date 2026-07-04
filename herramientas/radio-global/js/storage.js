"use strict";

/*
==========================================================
 Radio Global
 LocalStorage
==========================================================
*/

const RadioStorage = (() => {

    function read(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            console.warn("No fue posible guardar en LocalStorage.");
        }
    }

    function getFavorites() {
        return read(CONFIG.STORAGE.FAVORITES, []);
    }

    function saveFavorites(favorites) {
        write(CONFIG.STORAGE.FAVORITES, favorites.slice(0, CONFIG.MAX_FAVORITES));
    }

    function isFavorite(stationId) {
        return getFavorites().some(station => station.stationuuid === stationId);
    }

    function toggleFavorite(station) {
        if (!station || !station.stationuuid) return getFavorites();

        let favorites = getFavorites();

        if (isFavorite(station.stationuuid)) {
            favorites = favorites.filter(item => item.stationuuid !== station.stationuuid);
        } else {
            favorites.unshift(station);
        }

        saveFavorites(favorites);
        return favorites;
    }

    function getHistory() {
        return read(CONFIG.STORAGE.HISTORY, []);
    }

    function addToHistory(station) {
        if (!station || !station.stationuuid) return getHistory();

        let history = getHistory()
            .filter(item => item.stationuuid !== station.stationuuid);

        history.unshift(station);
        history = history.slice(0, CONFIG.MAX_HISTORY);

        write(CONFIG.STORAGE.HISTORY, history);
        return history;
    }

    function saveSettings(settings) {
        write(CONFIG.STORAGE.SETTINGS, settings);
    }

    function getSettings() {
        return read(CONFIG.STORAGE.SETTINGS, {
            volume: CONFIG.DEFAULT_VOLUME,
            lowPower: false
        });
    }

    function saveLastStation(station) {
        write(CONFIG.STORAGE.LAST_STATION, station);
    }

    function getLastStation() {
        return read(CONFIG.STORAGE.LAST_STATION, null);
    }

    return {
        getFavorites,
        saveFavorites,
        isFavorite,
        toggleFavorite,
        getHistory,
        addToHistory,
        saveSettings,
        getSettings,
        saveLastStation,
        getLastStation
    };

})();
