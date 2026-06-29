"use strict";

window.JCMAnalytics = (function () {
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbz9zlvNdIH2A5_OBH9tImljut65e9UihKq1XTuvyq_5meffup3R8sjyrRdFOAFUuRxg/exec";

  function track(data) {
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
        anio_inicio: String(data.anio_inicio || ""),
        dispositivo: window.innerWidth <= 768 ? "Móvil" : "Escritorio",
        navegador: navigator.userAgent,
        version: data.version || "1.0"
      };

      const body = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
        navigator.sendBeacon(ENDPOINT, blob);
        return;
      }

      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: body
      });

    } catch (error) {
      console.warn("JCM Analytics no disponible.");
    }
  }

  function trackTool(toolName, eventName = "uso_herramienta", extra = {}) {
    track({
      herramienta: toolName,
      evento: eventName,
      version: extra.version || "1.0",
      ...extra
    });
  }

  return {
    track,
    trackTool
  };
})();
