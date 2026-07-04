"use strict";

/*
==========================================================
 Radio Global
 Reproductor HTML5 Audio
==========================================================
*/

const RadioPlayer = (() => {

    let audio = null;
    let currentStation = null;
    let isPlaying = false;

    function init(audioElement) {

        audio = audioElement;

        if (!audio) {
            console.error("No se encontró el elemento de audio.");
            return;
        }

        audio.volume = CONFIG.DEFAULT_VOLUME;
        audio.preload = "none";

        audio.addEventListener("play", () => {
            isPlaying = true;
        });

        audio.addEventListener("pause", () => {
            isPlaying = false;
        });

        audio.addEventListener("error", () => {
            isPlaying = false;
            console.error("No fue posible reproducir esta emisora.");
        });
    }

    async function playStation(station) {

        if (!audio || !station || !station.url_resolved) {
            return false;
        }

        try {
            stop();

            currentStation = station;
            audio.src = station.url_resolved;
            audio.load();

            await audio.play();

            isPlaying = true;

            return true;
        }
        catch (error) {
            console.error("Error al reproducir:", error);
            isPlaying = false;
            return false;
        }
    }

    async function play() {

        if (!audio || !audio.src) {
            return false;
        }

        try {
            await audio.play();
            isPlaying = true;
            return true;
        }
        catch (error) {
            console.error("Error al reanudar:", error);
            return false;
        }
    }

    function pause() {

        if (!audio) return;

        audio.pause();
        isPlaying = false;
    }

    function stop() {

        if (!audio) return;

        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        isPlaying = false;
    }

    function setVolume(value) {

        if (!audio) return;

        const volume = Number(value);

        if (Number.isNaN(volume)) return;

        audio.volume = Math.min(1, Math.max(0, volume));
    }

    function getCurrentStation() {
        return currentStation;
    }

    function getStatus() {
        return {
            isPlaying,
            hasStation: Boolean(currentStation),
            station: currentStation
        };
    }

    return {
        init,
        playStation,
        play,
        pause,
        stop,
        setVolume,
        getCurrentStation,
        getStatus
    };

})();
