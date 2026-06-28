"use strict";

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function money(value) {
  const number = Number(value || 0);
  return "$" + Math.round(number).toLocaleString("es-CL");
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked'))
    .map(input => input.value);
}

function getFormConfig() {
  const startMonth = Number(document.getElementById("startMonth").value);
  const startYear = Number(document.getElementById("startYear").value);
  const endYear = startYear + 3;
  const totalMonths = (endYear - startYear) * 12 + (12 - startMonth);

  return {
    companyName: document.getElementById("companyName").value.trim() || "Sin nombre",
    businessType: document.getElementById("businessType").value,
    currency: document.getElementById("currency").value,
    country: document.getElementById("country").value.trim(),
    startMonth,
    startYear,
    endYear,
    totalMonths,
    initialCash: Number(document.getElementById("initialCash").value || 0),
    minimumReserve: Number(document.getElementById("minimumReserve").value || 0),
    sampleData: document.getElementById("sampleData").checked,
    protectFormulas: document.getElementById("protectFormulas").checked,
    dataValidation: document.getElementById("dataValidation").checked,
    cashAlerts: document.getElementById("cashAlerts").checked,
    incomeCategories: getCheckedValues("income"),
    expenseCategories: getCheckedValues("expense")
  };
}

function businessLabel(value) {
  const labels = {
    comercio: "Comercio",
    servicios: "Servicios",
    manufactura: "Manufactura",
    restaurante: "Restaurante",
    transporte: "Transporte",
    salud: "Salud",
    otro: "Otro"
  };

  return labels[value] || value;
}

function updatePreview() {
  const config = getFormConfig();

  document.getElementById("previewCompany").textContent = config.companyName;
  document.getElementById("previewBusiness").textContent = businessLabel(config.businessType);
  document.getElementById("previewPeriod").textContent =
    monthNames[config.startMonth] + " " + config.startYear + " - Diciembre " + config.endYear;

  document.getElementById("previewMonths").textContent = config.totalMonths;
  document.getElementById("previewIncomeCount").textContent = config.incomeCategories.length;
  document.getElementById("previewExpenseCount").textContent = config.expenseCategories.length;
  document.getElementById("previewCurrency").textContent = config.currency;
  document.getElementById("previewValidation").textContent = config.dataValidation ? "Sí" : "No";
  document.getElementById("previewProtection").textContent = config.protectFormulas ? "Sí" : "No";
}

function validateConfig(config) {
  if (!config.companyName || config.companyName === "Sin nombre") {
    alert("Ingrese el nombre de la empresa.");
    return false;
  }

  if (!config.startYear || config.startYear < 2026 || config.startYear > 2040) {
    alert("Ingrese un año de inicio válido.");
    return false;
  }

  if (config.initialCash < 0 || config.minimumReserve < 0) {
    alert("El saldo inicial y la reserva mínima no pueden ser negativos.");
    return false;
  }

  if (config.incomeCategories.length === 0) {
    alert("Seleccione al menos una categoría de ingresos.");
    return false;
  }

  if (config.expenseCategories.length === 0) {
    alert("Seleccione al menos una categoría de egresos.");
    return false;
  }

  return true;
}

function safeFileName(text) {
  return String(text || "Empresa")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 40) || "Empresa";
}

async function handleGenerate() {
  const config = getFormConfig();

  if (!validateConfig(config)) {
    return;
  }

  updatePreview();

  const status = document.getElementById("downloadStatus");
  status.textContent = "Generando plantilla Excel...";

  try {
    if (typeof generateCashflowWorkbook !== "function") {
      status.textContent = "El generador Excel aún no está disponible.";
      return;
    }

    await generateCashflowWorkbook(config);
      if (window.JCMAnalytics) {
    window.JCMAnalytics.track({
      herramienta: "Flujo Caja PYME",
      evento: "excel_generado",
      empresa: config.companyName,
      rubro: config.businessType,
      pais: config.country,
      moneda: config.currency,
      mes_inicio: monthNames[config.startMonth],
      anio_inicio: config.startYear,
      version: "1.0"
    });
  }
    status.textContent = "Plantilla generada correctamente.";
  } catch (error) {
    console.error(error);
    status.textContent = "No fue posible generar la plantilla. Revise la configuración.";
  }
}

function bindEvents() {
  const form = document.getElementById("cashflowForm");

  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);

  document.getElementById("previewButton").addEventListener("click", updatePreview);
  document.getElementById("generateButton").addEventListener("click", handleGenerate);
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  updatePreview();
});
"use strict";

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function money(value) {
  const number = Number(value || 0);
  return "$" + Math.round(number).toLocaleString("es-CL");
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked'))
    .map(input => input.value);
}

function getFormConfig() {
  const startMonth = Number(document.getElementById("startMonth").value);
  const startYear = Number(document.getElementById("startYear").value);
  const endYear = startYear + 3;
  const totalMonths = (endYear - startYear) * 12 + (12 - startMonth);

  return {
    companyName: document.getElementById("companyName").value.trim() || "Sin nombre",
    businessType: document.getElementById("businessType").value,
    currency: document.getElementById("currency").value,
    country: document.getElementById("country").value.trim(),
    startMonth,
    startYear,
    endYear,
    totalMonths,
    initialCash: Number(document.getElementById("initialCash").value || 0),
    minimumReserve: Number(document.getElementById("minimumReserve").value || 0),
    sampleData: document.getElementById("sampleData").checked,
    protectFormulas: document.getElementById("protectFormulas").checked,
    dataValidation: document.getElementById("dataValidation").checked,
    cashAlerts: document.getElementById("cashAlerts").checked,
    incomeCategories: getCheckedValues("income"),
    expenseCategories: getCheckedValues("expense")
  };
}

function businessLabel(value) {
  const labels = {
    comercio: "Comercio",
    servicios: "Servicios",
    manufactura: "Manufactura",
    restaurante: "Restaurante",
    transporte: "Transporte",
    salud: "Salud",
    otro: "Otro"
  };

  return labels[value] || value;
}

function updatePreview() {
  const config = getFormConfig();

  document.getElementById("previewCompany").textContent = config.companyName;
  document.getElementById("previewBusiness").textContent = businessLabel(config.businessType);
  document.getElementById("previewPeriod").textContent =
    monthNames[config.startMonth] + " " + config.startYear + " - Diciembre " + config.endYear;

  document.getElementById("previewMonths").textContent = config.totalMonths;
  document.getElementById("previewIncomeCount").textContent = config.incomeCategories.length;
  document.getElementById("previewExpenseCount").textContent = config.expenseCategories.length;
  document.getElementById("previewCurrency").textContent = config.currency;
  document.getElementById("previewValidation").textContent = config.dataValidation ? "Sí" : "No";
  document.getElementById("previewProtection").textContent = config.protectFormulas ? "Sí" : "No";
}

function validateConfig(config) {
  if (!config.companyName || config.companyName === "Sin nombre") {
    alert("Ingrese el nombre de la empresa.");
    return false;
  }

  if (!config.startYear || config.startYear < 2026 || config.startYear > 2040) {
    alert("Ingrese un año de inicio válido.");
    return false;
  }

  if (config.initialCash < 0 || config.minimumReserve < 0) {
    alert("El saldo inicial y la reserva mínima no pueden ser negativos.");
    return false;
  }

  if (config.incomeCategories.length === 0) {
    alert("Seleccione al menos una categoría de ingresos.");
    return false;
  }

  if (config.expenseCategories.length === 0) {
    alert("Seleccione al menos una categoría de egresos.");
    return false;
  }

  return true;
}

function safeFileName(text) {
  return String(text || "Empresa")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 40) || "Empresa";
}

async function handleGenerate() {
  const config = getFormConfig();

  if (!validateConfig(config)) {
    return;
  }

  updatePreview();

  const status = document.getElementById("downloadStatus");
  status.textContent = "Generando plantilla Excel...";

  try {
    if (typeof generateCashflowWorkbook !== "function") {
      status.textContent = "El generador Excel aún no está disponible.";
      return;
    }

    await generateCashflowWorkbook(config);

    status.textContent = "Plantilla generada correctamente.";
  } catch (error) {
    console.error(error);
    status.textContent = "No fue posible generar la plantilla. Revise la configuración.";
  }
}

function bindEvents() {
  const form = document.getElementById("cashflowForm");

  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);

  document.getElementById("previewButton").addEventListener("click", updatePreview);
  document.getElementById("generateButton").addEventListener("click", handleGenerate);
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  updatePreview();
});
