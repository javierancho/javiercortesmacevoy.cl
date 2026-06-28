"use strict";

/* ============================================================
   JCM Analytics
   Registro de uso de herramientas
============================================================ */

const JCMAnalytics = (() => {

    const ENDPOINT =
        "https://script.google.com/macros/s/AKfycbwjBNfzTQdqImOrnmYhgknI2wVbqtIJFimOim7Uv7wAm6N66RSXxMFWz2gY1BiUGQQo/exec";

    async function track(data = {}) {

        const payload = {

            herramienta: data.herramienta || "",

            evento: data.evento || "",

            empresa: data.empresa || "",

            rubro: data.rubro || "",

            pais: data.pais || "",

            idioma:
                document.documentElement.lang || "es",

            moneda: data.moneda || "",

            mes_inicio: data.mes_inicio || "",

            anio_inicio: data.anio_inicio || "",

            dispositivo:
                window.innerWidth <= 768
                    ? "Móvil"
                    : "Escritorio",

            navegador:
                navigator.userAgent,

            version:
                data.version || "1.0"

        };

        try {

            await fetch(ENDPOINT, {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

        }

        catch (e) {

            console.warn("Analytics no disponible.");

        }

    }

    return {

        track

    };

})();
