/* ==========================================================
   Monitor de Sismos
   Internacionalización ES / EN
========================================================== */

const translations = {

    es: {

        navAbout: "Sobre mí",
        navTools: "Herramientas",
        navInterests: "Intereses",
        navProjects: "Proyectos",
        navContact: "Contacto",

        eyebrow: "Herramientas / Utilidades",

        title: "Monitor de Sismos",

        subtitle:
            "Visualización referencial de sismos recientes en Chile y el mundo, utilizando fuentes públicas. No reemplaza información oficial de SENAPRED, SHOA ni del Centro Sismológico Nacional.",

        refresh: "Actualizar datos",

        noticeTitle: "Uso informativo.",

        noticeText:
            "Esta página muestra información pública con fines de consulta. Ante una emergencia sigue siempre las instrucciones de las autoridades.",

        lastChileLabel: "Chile",
        lastChileTitle: "Último sismo registrado",

        mapLabel: "Mapa",
        mapTitle: "Sismos recientes",

        recordsLabel: "Registros",
        recordsTitle: "Listado de sismos",

        sourceFilter: "Fuente",
        sourceChile: "Chile",
        sourceWorld: "Mundo",

        minMagnitude: "Magnitud mínima",

        magnitude: "Magnitud",
        depth: "Profundidad",
        dateTime: "Fecha y hora",
        location: "Ubicación",

        source: "Fuente",

        officialReport: "Ver informe oficial",

        centerChile: "Centrar Chile",
        viewWorld: "Ver mundo",

        tableDate: "Fecha",
        tableMagnitude: "Magnitud",
        tableDepth: "Prof.",
        tableLocation: "Ubicación",
        tableSource: "Fuente",

        loading: "Cargando datos...",

        notLoaded: "Sin actualizar"

    },

    en: {

        navAbout: "About",
        navTools: "Tools",
        navInterests: "Interests",
        navProjects: "Projects",
        navContact: "Contact",

        eyebrow: "Tools / Utilities",

        title: "Earthquake Monitor",

        subtitle:
            "Reference visualization of recent earthquakes in Chile and worldwide using public data sources. This page does not replace official emergency information.",

        refresh: "Refresh",

        noticeTitle: "Information only.",

        noticeText:
            "This page displays public earthquake information for reference purposes only. Follow official authorities during emergencies.",

        lastChileLabel: "Chile",
        lastChileTitle: "Latest earthquake",

        mapLabel: "Map",
        mapTitle: "Recent earthquakes",

        recordsLabel: "Records",
        recordsTitle: "Earthquake list",

        sourceFilter: "Source",
        sourceChile: "Chile",
        sourceWorld: "World",

        minMagnitude: "Minimum magnitude",

        magnitude: "Magnitude",
        depth: "Depth",
        dateTime: "Date & Time",
        location: "Location",

        source: "Source",

        officialReport: "Official report",

        centerChile: "Center Chile",
        viewWorld: "World view",

        tableDate: "Date",
        tableMagnitude: "Magnitude",
        tableDepth: "Depth",
        tableLocation: "Location",
        tableSource: "Source",

        loading: "Loading...",

        notLoaded: "Not updated"

    }

};

/* ==========================================================
   Aplicar idioma
========================================================== */

function applyLanguage(language) {

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.dataset.i18n;

        if (translations[language][key]) {

            element.textContent =
                translations[language][key];

        }

    });

    localStorage.setItem(
        "language",
        language
    );

    document
        .getElementById("lang-es")
        .classList.toggle(
            "active",
            language === "es"
        );

    document
        .getElementById("lang-en")
        .classList.toggle(
            "active",
            language === "en"
        );

}

/* ==========================================================
   Inicialización
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const language =
            localStorage.getItem("language") || "es";

        applyLanguage(language);

        document
            .getElementById("lang-es")
            .addEventListener(
                "click",
                () => applyLanguage("es")
            );

        document
            .getElementById("lang-en")
            .addEventListener(
                "click",
                () => applyLanguage("en")
            );

    }
);
