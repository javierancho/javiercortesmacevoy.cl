/* ============================================================
   JCM TOOLS
   Sistema de internacionalización (ES / EN)
   Flujo Caja PYME
============================================================ */

const translations = {

    es: {

        /* ---------------- Menú ---------------- */

        nav_about: "Sobre mí",
        nav_tools: "Herramientas",
        nav_interests: "Intereses",
        nav_projects: "Proyectos",
        nav_contact: "Contacto",

        /* ---------------- Hero ---------------- */

        eyebrow: "Finanzas para pequeñas empresas",

        title: "Flujo Caja PYME",

        subtitle:
            "Configure una plantilla Excel personalizada para proyectar el efectivo disponible de su empresa y anticipar meses con riesgo de quedarse sin caja.",

        summary:
            "El flujo de caja permite mirar hacia adelante: cuánto dinero entrará, cuánto saldrá y si la empresa tendrá efectivo suficiente para cumplir sus compromisos.",

        /* ---------------- Pasos ---------------- */

        step_config: "Configuración",
        step_preview: "Vista previa",
        step_download: "Descargar",

        /* ---------------- Configuración ---------------- */

        config_title: "Datos para generar la plantilla",

        config_help:
            "Complete los datos principales. El Excel se generará localmente en su navegador.",

        company_name: "Nombre de la empresa",

        business_type: "Giro o actividad",

        currency: "Moneda",

        country_optional: "País (opcional)",

        projection_title: "Inicio de la proyección",

        start_month: "Mes de inicio",

        start_year: "Año de inicio",

        cash_title: "Caja y seguridad",

        initial_cash: "Saldo inicial de caja",

        minimum_reserve: "Reserva mínima de seguridad",

        positive_help:
            "Todos los valores deben ingresarse como positivos.",

        reserve_help:
            "Monto mínimo recomendado para enfrentar imprevistos.",

        mode_title: "Modo de generación",

        sample_data:
            "Generar ejemplo con datos ficticios",

        protect_formulas:
            "Proteger fórmulas",

        data_validation:
            "Activar validación de datos",

        cash_alerts:
            "Activar alertas de caja",

        categories_title:
            "Categorías incluidas",

        income_title:
            "Ingresos",

        expense_title:
            "Egresos",

        preview_button:
            "Actualizar vista previa",

        preview_title:
            "Vista previa",

        preview_help:
            "Revise la configuración antes de generar el archivo Excel.",

        impact_title:
            "Registro de impacto",

        impact_text:
            "Al generar la plantilla podrá enviarse un registro completamente anónimo para conocer cuántas personas utilizan esta herramienta. Nunca se envían ni almacenan datos financieros.",

        generate_button:
            "Generar plantilla Excel",

        download_pending:
            "El generador Excel se incorporará en la siguiente etapa.",

        education_title:
            "¿Por qué importa el flujo de caja?",

        education_text_1:
            "Una empresa puede vender y aun así quedarse sin efectivo si cobra tarde y paga antes.",

        education_text_2:
            "El objetivo es asegurar que exista caja suficiente para cumplir los compromisos futuros.",

        education_phrase:
            "La utilidad mantiene viva una empresa en el largo plazo; la caja le permite sobrevivir día a día.",

        disclaimer_title:
            "Uso educativo",

        disclaimer_text_1:
            "Esta herramienta tiene fines exclusivamente educativos.",

        disclaimer_text_2:
            "No reemplaza la asesoría de un contador o asesor financiero."

    },

    en: {

        nav_about: "About",
        nav_tools: "Tools",
        nav_interests: "Interests",
        nav_projects: "Projects",
        nav_contact: "Contact",

        eyebrow: "Finance for Small Businesses",

        title: "SME Cash Flow",

        subtitle:
            "Generate a customized Excel workbook to project your company's available cash and identify future cash shortages.",

        summary:
            "Cash flow helps you anticipate how much money will come in and go out, ensuring enough liquidity to meet future commitments.",

        step_config: "Configuration",
        step_preview: "Preview",
        step_download: "Download",

        config_title: "Workbook configuration",

        config_help:
            "Complete the required information. The Excel workbook will be generated locally in your browser.",

        company_name: "Company name",

        business_type: "Business activity",

        currency: "Currency",

        country_optional: "Country (optional)",

        projection_title: "Projection start",

        start_month: "Starting month",

        start_year: "Starting year",

        cash_title: "Cash configuration",

        initial_cash: "Opening cash balance",

        minimum_reserve: "Minimum cash reserve",

        positive_help:
            "Always enter positive values.",

        reserve_help:
            "Recommended minimum cash available.",

        mode_title: "Generation mode",

        sample_data:
            "Generate sample data",

        protect_formulas:
            "Protect formulas",

        data_validation:
            "Enable data validation",

        cash_alerts:
            "Enable cash alerts",

        categories_title:
            "Included categories",

        income_title:
            "Income",

        expense_title:
            "Expenses",

        preview_button:
            "Refresh preview",

        preview_title:
            "Preview",

        preview_help:
            "Review the configuration before generating the workbook.",

        impact_title:
            "Impact statistics",

        impact_text:
            "An anonymous event may be sent when the workbook is generated. Financial information is never transmitted.",

        generate_button:
            "Generate Excel workbook",

        download_pending:
            "Excel generation will be added in the next stage.",

        education_title:
            "Why is cash flow important?",

        education_text_1:
            "A company may have sales and still run out of cash if it collects late and pays early.",

        education_text_2:
            "The objective is to ensure enough cash to meet future obligations.",

        education_phrase:
            "Profit keeps a business alive in the long term; cash keeps it alive every day.",

        disclaimer_title:
            "Educational use",

        disclaimer_text_1:
            "This tool is intended for educational purposes only.",

        disclaimer_text_2:
            "It does not replace professional financial or accounting advice."

    }

};

/* ========================================================= */

function applyLanguage(lang){

    localStorage.setItem("language",lang);

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(el=>{

        const key = el.dataset.i18n;

        if(translations[lang][key]){

            el.textContent = translations[lang][key];

        }

    });

    document.getElementById("langEs").classList.toggle("active",lang==="es");
    document.getElementById("langEn").classList.toggle("active",lang==="en");

}

document.addEventListener("DOMContentLoaded",()=>{

    const saved = localStorage.getItem("language") || "es";

    applyLanguage(saved);

    document.getElementById("langEs").addEventListener("click",()=>applyLanguage("es"));

    document.getElementById("langEn").addEventListener("click",()=>applyLanguage("en"));

});
