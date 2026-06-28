"use strict";

/* ============================================================
   JCM Analytics
   Registro de uso de herramientas
============================================================ */

const JCMAnalytics = (function () {
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbz9zlvNdIH2A5_OBH9tImljut65e9UihKq1XTuvyq_5meffup3R8sjyrRdFOAFUuRxg/exec";

  async function track(data) {
    try {
      const payload = {
        herramienta: data.herramienta || "",
        evento: data.evento || "",
        empresa: data.empresa || "",
        rubro: data.rubro || "",
        pais: data.pais || "",
        idioma: document.documentElement.lang || "es",
        moneda: data.moneda || "",
        mes_inicio: data.mes_inicio || "",
        anio_inicio: data.anio_inicio || "",
        dispositivo: window.innerWidth <= 768 ? "Móvil" : "Escritorio",
        navegador: navigator.userAgent,
        version: data.version || "1.0"
      };

      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.warn("Analytics no disponible.");
    }
  }

  return { track };
})();
