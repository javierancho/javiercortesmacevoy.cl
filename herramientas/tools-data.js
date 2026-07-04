"use strict";

/*
==========================================================
 Herramientas del sitio
 Archivo único para mantener accesos del index principal
==========================================================
*/

const SITE_TOOLS = [
  {
    categoryKey: "cat_radio",
    categoryEs: "Comunicaciones",
    categoryEn: "Communications",
    iconClass: "radio",
    iconText: "⌁",
    tools: [
      {
        key: "tool_antennas",
        titleEs: "Calculadora de Antenas",
        titleEn: "Antenna Calculator",
        url: "herramientas/radioaficion/antenas/"
      },
      {
        key: "tool_earthquakes",
        titleEs: "Monitor de Sismos",
        titleEn: "Earthquake Monitor",
        url: "herramientas/sismos/",
        analyticsTool: "Monitor de Sismos",
        analyticsEvent: "acceso_herramienta"
      },
      {
        key: "tool_radio_global",
        titleEs: "Radio Global",
        titleEn: "Global Radio",
        url: "herramientas/radio-global/",
        analyticsTool: "Radio Global",
        analyticsEvent: "acceso_herramienta"
      }
    ]
  },
  {
    categoryKey: "cat_supplychain",
    categoryEs: "Inventarios",
    categoryEn: "Stock",
    iconClass: "sc",
    iconText: "□",
    tools: [
      {
        key: "tool_rop",
        titleEs: "Punto de Reorden (ROP)",
        titleEn: "Reorder Point (ROP)",
        url: "herramientas/supplychain/rop/"
      }
    ]
  },
  {
    categoryKey: "cat_finance",
    categoryEs: "Finanzas",
    categoryEn: "Finance",
    iconClass: "fin",
    iconText: "%",
    tools: [
      {
        key: "tool_cashflow",
        titleEs: "Flujo Caja PYME",
        titleEn: "SME Cash Flow",
        url: "herramientas/flujo-caja-pyme/"
      },
      {
        key: "tool_installments",
        titleEs: "Simulador de Cuotas",
        titleEn: "Installment Simulator",
        url: "herramientas/simulador-cuotas/"
      },
      {
        key: "tool_sale_price",
        titleEs: "Cálculo Precio Venta",
        titleEn: "Sale Price Calculator",
        url: "herramientas/calculo-precio-venta/"
      }
    ]
  },
  {
    categoryKey: "cat_other",
    categoryEs: "Otros",
    categoryEn: "Other",
    iconClass: "other",
    iconText: "▦",
    tools: [
      {
        key: "tool_codes",
        titleEs: "Generador de Códigos",
        titleEn: "Code Generator",
        url: "herramientas/generador-codigos/"
      },
      {
        key: "tool_steganography",
        titleEs: "Esteganografía",
        titleEn: "Steganography",
        url: "herramientas/esteganografia/"
      },
      {
        key: "tool_random",
        titleEs: "Azar",
        titleEn: "Random",
        url: "herramientas/azar/"
      }
    ]
  }
];
