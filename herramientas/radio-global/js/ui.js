"use strict";

/*
==========================================================
 Radio Global
 Interfaz de usuario
==========================================================
*/

const RadioUI = (() => {

    const elements = {};

    function init() {
        elements.searchInput = document.getElementById("searchInput");
        elements.countrySelect = document.getElementById("countrySelect");
        elements.tagSelect = document.getElementById("tagSelect");
        elements.qualitySelect = document.getElementById("qualitySelect");

        elements.searchBtn = document.getElementById("searchBtn");
        elements.chileBtn = document.getElementById("chileBtn");
        elements.emergencyBtn = document.getElementById("emergencyBtn");
        elements.lowPowerBtn = document.getElementById("lowPowerBtn");

        elements.resultsList = document.getElementById("resultsList");
        elements.resultsStatus = document.getElementById("resultsStatus");

        elements.favoritesList = document.getElementById("favoritesList");
        elements.historyList = document.getElementById("historyList");

        elements.nowPlaying = document.getElementById("nowPlaying");
        elements.stationMeta = document.getElementById("stationMeta");
        elements.dataEstimate = document.getElementById("dataEstimate");
    }

    function setStatus(message) {
        elements.resultsStatus.textContent = message;
    }

    function getQualityLabel(station) {
        const bitrate = Number(station.bitrate || 0);

        if (!bitrate) return "Calidad no informada";
        if (bitrate <= 32) return "Ultra bajo";
        if (bitrate <= 64) return "Bajo";
        if (bitrate <= 128) return "Medio";
        return "Alto";
    }

    function getDataText(station) {
        const bitrate = Number(station.bitrate || 0);
        const usage = estimateDataUsage(bitrate);

        if (!usage) return "Consumo no disponible";

        return `${bitrate} kbps · aprox. ${usage} MB/h`;
    }

    function stationMetaText(station) {
        const parts = [];

        if (station.country) parts.push(station.country);
        if (station.language) parts.push(station.language);
        if (station.codec) parts.push(station.codec);
        if (station.bitrate) parts.push(`${station.bitrate} kbps`);

        return parts.join(" · ") || "Información no disponible";
    }

    function createStationCard(station) {
        const card = document.createElement("article");
        card.className = "station-card";

        const title = document.createElement("h3");
        title.textContent = station.name || "Emisora sin nombre";

        const meta = document.createElement("p");
        meta.className = "station-meta";
        meta.textContent = stationMetaText(station);

        const usage = document.createElement("p");
        usage.className = "station-meta";
        usage.textContent = `${getQualityLabel(station)} · ${getDataText(station)}`;

        const actions = document.createElement("div");
        actions.className = "station-actions";

        const playBtn = document.createElement("button");
        playBtn.type = "button";
        playBtn.textContent = "Escuchar";
        playBtn.dataset.action = "play";
        playBtn.dataset.stationId = station.stationuuid;

        const favBtn = document.createElement("button");
        favBtn.type = "button";
        favBtn.className = "ghost";
        favBtn.textContent = RadioStorage.isFavorite(station.stationuuid)
            ? "Quitar favorito"
            : "Favorito";
        favBtn.dataset.action = "favorite";
        favBtn.dataset.stationId = station.stationuuid;

        actions.appendChild(playBtn);
        actions.appendChild(favBtn);

        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(usage);
        card.appendChild(actions);

        return card;
    }

    function renderStations(stations) {
        elements.resultsList.innerHTML = "";

        if (!stations.length) {
            setStatus("No se encontraron emisoras disponibles.");
            return;
        }

        setStatus(`${stations.length} emisoras disponibles.`);

        stations.forEach(station => {
            elements.resultsList.appendChild(createStationCard(station));
        });
    }

    function renderCompactList(container, stations, emptyText) {
        container.innerHTML = "";

        if (!stations.length) {
            container.textContent = emptyText;
            return;
        }

        stations.forEach(station => {
            const item = document.createElement("div");
            item.className = "compact-item";

            const title = document.createElement("h3");
            title.textContent = station.name || "Emisora sin nombre";

            const meta = document.createElement("p");
            meta.className = "station-meta";
            meta.textContent = stationMetaText(station);

            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Escuchar";
            button.dataset.action = "play";
            button.dataset.stationId = station.stationuuid;

            item.appendChild(title);
            item.appendChild(meta);
            item.appendChild(button);

            container.appendChild(item);
        });
    }

    function renderFavorites() {
        renderCompactList(
            elements.favoritesList,
            RadioStorage.getFavorites(),
            "No hay favoritos guardados."
        );
    }

    function renderHistory() {
        renderCompactList(
            elements.historyList,
            RadioStorage.getHistory(),
            "No hay historial todavía."
        );
    }

    function updatePlayer(station) {
        if (!station) {
            elements.nowPlaying.textContent = "Ninguna emisora seleccionada";
            elements.stationMeta.textContent = "Selecciona una radio para iniciar la reproducción.";
            elements.dataEstimate.textContent = "Consumo estimado: no disponible.";
            return;
        }

        elements.nowPlaying.textContent = station.name || "Emisora sin nombre";
        elements.stationMeta.textContent = stationMetaText(station);
        elements.dataEstimate.textContent = `Consumo estimado: ${getDataText(station)}`;
    }

    function toggleLowPower() {
        document.body.classList.toggle("low-power");

        const settings = RadioStorage.getSettings();
        settings.lowPower = document.body.classList.contains("low-power");
        RadioStorage.saveSettings(settings);
    }

    function restoreSettings() {
        const settings = RadioStorage.getSettings();

        if (settings.lowPower) {
            document.body.classList.add("low-power");
        }
    }

    function getElements() {
        return elements;
    }

    return {
        init,
        setStatus,
        renderStations,
        renderFavorites,
        renderHistory,
        updatePlayer,
        toggleLowPower,
        restoreSettings,
        getElements
    };

})();
