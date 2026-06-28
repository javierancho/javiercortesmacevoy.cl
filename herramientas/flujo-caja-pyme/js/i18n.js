const LANG = {

    es: {

        pageTitle: "Flujo Caja PYME",

        heroTitle: "Flujo Caja PYME",

        heroSubtitle:
            "Planifique el flujo de efectivo de su empresa y genere una plantilla profesional de Excel completamente personalizada.",

        step1: "Configuración",
        step2: "Vista previa",
        step3: "Descargar",

        company: "Nombre de la empresa",
        companyPlaceholder: "Ej.: Comercial ABC SpA",

        business: "Actividad económica",

        currency: "Moneda",

        startMonth: "Mes de inicio",

        startYear: "Año de inicio",

        openingCash: "Saldo inicial de caja",

        reserveCash: "Reserva mínima de seguridad",

        reserveHelp:
            "Corresponde al efectivo mínimo recomendado para enfrentar imprevistos sin comprometer la operación.",

        customization: "Opciones",

        logo: "Permitir incorporar logotipo posteriormente",

        protect: "Proteger fórmulas",

        validation: "Validar datos ingresados",

        alerts: "Activar alertas de caja",

        sample: "Generar ejemplo con datos ficticios",

        income: "Categorías de ingresos",

        expenses: "Categorías de egresos",

        preview: "Vista previa",

        generate: "Generar plantilla Excel",

        analyticsTitle: "Estadísticas anónimas",

        analyticsText:
            "Si lo desea, puede compartir información básica y completamente opcional para ayudarnos a conocer el impacto de esta herramienta. Nunca se almacenarán datos financieros ni el contenido de su flujo de caja.",

        disclaimer:
            "Esta herramienta tiene fines exclusivamente educativos y de apoyo a la gestión financiera. No reemplaza la asesoría profesional de un contador, auditor o asesor financiero."

    },

    en: {

        pageTitle: "SME Cash Flow",

        heroTitle: "SME Cash Flow",

        heroSubtitle:
            "Plan your company's cash flow and generate a fully customized professional Excel workbook.",

        step1: "Configuration",
        step2: "Preview",
        step3: "Download",

        company: "Company name",
        companyPlaceholder: "Example: ABC Trading Ltd.",

        business: "Business activity",

        currency: "Currency",

        startMonth: "Starting month",

        startYear: "Starting year",

        openingCash: "Opening cash balance",

        reserveCash: "Minimum cash reserve",

        reserveHelp:
            "Minimum recommended cash available to face unexpected events.",

        customization: "Options",

        logo: "Allow future logo",

        protect: "Protect formulas",

        validation: "Enable validation",

        alerts: "Enable cash alerts",

        sample: "Generate sample data",

        income: "Income categories",

        expenses: "Expense categories",

        preview: "Preview",

        generate: "Generate Excel workbook",

        analyticsTitle: "Anonymous statistics",

        analyticsText:
            "Optionally share basic information so we can measure the educational impact of this tool. No financial information is stored.",

        disclaimer:
            "This tool is provided for educational purposes only and does not replace professional accounting or financial advice."

    }

};

function setLanguage(lang) {

    localStorage.setItem("language", lang);

    document.querySelectorAll("[data-i18n]").forEach(el => {

        const key = el.dataset.i18n;

        if (LANG[lang][key]) {

            el.textContent = LANG[lang][key];

        }

    });

    document.querySelectorAll("[data-placeholder]").forEach(el => {

        const key = el.dataset.placeholder;

        if (LANG[lang][key]) {

            el.placeholder = LANG[lang][key];

        }

    });

    document.title = LANG[lang].pageTitle;

    document.getElementById("btnES").classList.toggle("active", lang === "es");
    document.getElementById("btnEN").classList.toggle("active", lang === "en");

}

document.addEventListener("DOMContentLoaded", () => {

    const lang = localStorage.getItem("language") || "es";

    setLanguage(lang);

    document.getElementById("btnES").onclick = () => setLanguage("es");
    document.getElementById("btnEN").onclick = () => setLanguage("en");

});
