"use strict";

/*
==========================================================
 Radio Global
 Aplicación principal
==========================================================
*/

let currentStations = [];

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {

    RadioUI.init();

    RadioUI.restoreSettings();

    RadioPlayer.init(
        document.getElementById("radioAudio")
    );

    loadCountries();

    RadioUI.renderFavorites();

    RadioUI.renderHistory();

    bindEvents();

}

async function loadCountries() {

    const select = document.getElementById("countrySelect");

    try {

        const countries = await RadioAPI.getCountries();

        countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(country => {

                if (country.iso_3166_1) {

                    const option = document.createElement("option");

                    option.value = country.iso_3166_1;

                    option.textContent = country.name;

                    select.appendChild(option);

                }

            });

    }
    catch (error) {

        console.error(error);

    }

}

function bindEvents() {

    const ui = RadioUI.getElements();

    ui.searchBtn.addEventListener("click", searchStations);

    ui.chileBtn.addEventListener("click", loadChileStations);

    ui.lowPowerBtn.addEventListener("click", () => {

        RadioUI.toggleLowPower();

    });

    document
        .getElementById("playBtn")
        .addEventListener("click", () => {

            RadioPlayer.play();

        });

    document
        .getElementById("pauseBtn")
        .addEventListener("click", () => {

            RadioPlayer.pause();

        });

    document
        .getElementById("stopBtn")
        .addEventListener("click", () => {

            RadioPlayer.stop();

        });

    document
        .getElementById("volumeRange")
        .addEventListener("input", e => {

            RadioPlayer.setVolume(e.target.value);

        });

    document
        .getElementById("resultsList")
        .addEventListener("click", stationAction);

    document
        .getElementById("favoritesList")
        .addEventListener("click", stationAction);

    document
        .getElementById("historyList")
        .addEventListener("click", stationAction);

}

async function loadChileStations() {

    RadioUI.setStatus("Cargando radios de Chile...");

    let stations = await RadioAPI.getChileStations();

    stations = RadioAPI.cleanStations(stations);

    stations = applyQualityFilter(stations);

    currentStations = stations;

    RadioUI.renderStations(stations);

}

async function searchStations() {

    const ui = RadioUI.getElements();

    let stations = [];

    if (ui.searchInput.value.trim() !== "") {

        stations = await RadioAPI.searchByName(
            ui.searchInput.value.trim()
        );

    }
    else if (ui.tagSelect.value !== "") {

        stations = await RadioAPI.searchByTag(
            ui.tagSelect.value
        );

    }
    else if (ui.countrySelect.value !== "") {

        stations = await RadioAPI.searchByCountry(
            ui.countrySelect.value
        );

    }

    stations = RadioAPI.cleanStations(stations);

    stations = applyQualityFilter(stations);

    currentStations = stations;

    RadioUI.renderStations(stations);

}

function applyQualityFilter(stations) {

    const quality =
        document.getElementById("qualitySelect").value;

    return RadioAPI.filterByQuality(
        stations,
        quality
    );

}

async function stationAction(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const stationId = button.dataset.stationId;

    if (!stationId) return;

    let station = currentStations.find(s =>
        s.stationuuid === stationId
    );

    if (!station) {

        station =
            RadioStorage
                .getFavorites()
                .find(s => s.stationuuid === stationId);

    }

    if (!station) {

        station =
            RadioStorage
                .getHistory()
                .find(s => s.stationuuid === stationId);

    }

    if (!station) return;

    switch (button.dataset.action) {

        case "play":

            const ok =
                await RadioPlayer.playStation(station);

            if (ok) {

                RadioStorage.addToHistory(station);

                RadioStorage.saveLastStation(station);

                RadioUI.updatePlayer(station);

                RadioUI.renderHistory();

            }

            break;

        case "favorite":

            RadioStorage.toggleFavorite(station);

            RadioUI.renderFavorites();

            RadioUI.renderStations(currentStations);

            break;

    }

}
