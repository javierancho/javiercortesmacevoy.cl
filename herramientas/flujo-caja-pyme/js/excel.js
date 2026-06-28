"use strict";

async function generateCashflowWorkbook(config) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Javier Cortés Mac Evoy";
  workbook.created = new Date();

  const wsInfo = workbook.addWorksheet("Instrucciones");
  const wsFlow = workbook.addWorksheet("Flujo de Caja");
  const wsCat = workbook.addWorksheet("Categorías");

  const colors = {
    primary: "0F2F4F",
    accent: "2563EB",
    soft: "EDF4FF",
    input: "FFF2CC",
    formula: "F8FAFC",
    income: "EAF7EF",
    expense: "FDECEC",
    result: "E6FFFB",
    warning: "FFF4E6",
    danger: "FDE2E2",
    white: "FFFFFF",
    line: "D9E2EC"
  };

  const months = buildMonths(config.startMonth, config.startYear, config.endYear);

  buildInstructions(wsInfo, config, colors);
  buildCategories(wsCat, config, colors);
  buildCashflow(wsFlow, config, months, colors);

  workbook.eachSheet(sheet => {
    sheet.views = [{ showGridLines: false }];
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const fileName = "FlujoCaja_" + safeFileName(config.companyName) + "_" + config.startYear + ".xlsx";

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function buildMonths(startMonth, startYear, endYear) {
  const result = [];

  for (let year = startYear; year <= endYear; year++) {
    const firstMonth = year === startYear ? startMonth : 0;

    for (let month = firstMonth; month <= 11; month++) {
      result.push({ month, year });
    }
  }

  return result;
}

function buildInstructions(ws, config, colors) {
  ws.columns = [
    { width: 28 },
    { width: 90 }
  ];

  title(ws, "A1", "Flujo Caja PYME", colors);
  merge(ws, "A1:B1");

  section(ws, "A3", "Empresa", colors);
  ws.getCell("B3").value = config.companyName;

  section(ws, "A4", "Período", colors);
  ws.getCell("B4").value =
    monthName(config.startMonth) + " " + config.startYear + " - Diciembre " + config.endYear;

  section(ws, "A6", "Uso de la plantilla", colors);
  ws.getCell("B6").value =
    "Esta plantilla permite proyectar ingresos, egresos, flujo neto y saldo final de caja. Su objetivo es ayudar a anticipar meses con riesgo de falta de efectivo.";

  section(ws, "A8", "Regla importante", colors);
  ws.getCell("B8").value =
    "Todos los valores deben ingresarse como positivos. No utilice números negativos. La plantilla clasifica automáticamente ingresos y egresos.";

  section(ws, "A10", "Colores", colors);
  ws.getCell("B10").value =
    "Amarillo: celdas editables. Blanco o gris: fórmulas automáticas. Verde: resultados. Rojo: caja negativa. Naranjo: caja bajo la reserva mínima.";

  section(ws, "A12", "Uso educativo", colors);
  ws.getCell("B12").value =
    "Esta herramienta y la plantilla Excel se entregan con fines exclusivamente educativos y de apoyo al aprendizaje. No constituyen asesoría financiera, contable, tributaria ni legal.";

  section(ws, "A14", "Autor", colors);
  ws.getCell("B14").value =
    "Plantilla generada por Javier Cortés Mac Evoy · www.javiercortesmacevoy.cl · Versión 1.0";

  ws.getColumn(2).alignment = { wrapText: true, vertical: "top" };
}

function buildCategories(ws, config, colors) {
  ws.columns = [
    { width: 28 },
    { width: 28 }
  ];

  title(ws, "A1", "Categorías", colors);
  merge(ws, "A1:B1");

  section(ws, "A3", "Ingresos", colors);

  let row = 4;
  config.incomeCategories.forEach(item => {
    ws.getCell(row, 1).value = item;
    ws.getCell(row, 1).fill = fill(colors.income);
    row++;
  });

  row += 1;
  section(ws, "A" + row, "Egresos", colors);
  row++;

  config.expenseCategories.forEach(item => {
    ws.getCell(row, 1).value = item;
    ws.getCell(row, 1).fill = fill(colors.expense);
    row++;
  });

  applyBorders(ws);
}

function buildCashflow(ws, config, months, colors) {
  const startCol = 3;
  const endCol = startCol + months.length - 1;

  ws.columns = [
    { width: 5 },
    { width: 32 },
    ...months.map(() => ({ width: 14 }))
  ];

  title(ws, "A1", "Flujo de Caja Proyectado", colors);
  merge(ws, 1, 1, 1, endCol);

  ws.getCell("A3").value = "Empresa";
  ws.getCell("B3").value = config.companyName;

  ws.getCell("A4").value = "Período";
  ws.getCell("B4").value =
    monthName(config.startMonth) + " " + config.startYear + " - Diciembre " + config.endYear;

  ws.getCell("A5").value = "Moneda";
  ws.getCell("B5").value = config.currency;

  ws.getCell("A6").value = "Reserva mínima";
  ws.getCell("B6").value = config.minimumReserve;
  inputCell(ws.getCell("B6"), colors);

  ws.getCell("A7").value = "Nota";
  ws.getCell("B7").value = "Ingrese todos los montos como valores positivos.";

  for (let c = startCol; c <= endCol; c++) {
    const m = months[c - startCol];

    ws.getCell(9, c).value = m.year;
    ws.getCell(10, c).value = monthNameShort(m.month);

    ws.getCell(9, c).fill = fill(colors.primary);
    ws.getCell(9, c).font = { color: { argb: colors.white }, bold: true };
    ws.getCell(10, c).fill = fill(colors.soft);
    ws.getCell(10, c).font = { bold: true, color: { argb: colors.primary } };
    ws.getCell(9, c).alignment = center();
    ws.getCell(10, c).alignment = center();
  }

  let row = 12;

  sectionRow(ws, row, "Saldo inicial de caja", colors);
  const saldoInicialRow = row;
  row++;

  sectionRow(ws, row, "INGRESOS", colors);
  row++;

  const incomeStart = row;
  config.incomeCategories.forEach(cat => {
    ws.getCell(row, 2).value = cat;
    editableRow(ws, row, startCol, endCol, colors);
    row++;
  });
  const incomeEnd = row - 1;

  totalRow(ws, row, "Total ingresos", colors);
  const totalIncomeRow = row;
  row++;

  row++;

  sectionRow(ws, row, "EGRESOS", colors);
  row++;

  const expenseStart = row;
  config.expenseCategories.forEach(cat => {
    ws.getCell(row, 2).value = cat;
    editableRow(ws, row, startCol, endCol, colors);
    row++;
  });
  const expenseEnd = row - 1;

  totalRow(ws, row, "Total egresos", colors);
  const totalExpenseRow = row;
  row++;

  row++;

  totalRow(ws, row, "Flujo neto", colors);
  const netFlowRow = row;
  row++;

  totalRow(ws, row, "Saldo final de caja", colors);
  const finalCashRow = row;
  row++;

  totalRow(ws, row, "Alerta de caja", colors);
  const alertRow = row;
  row += 2;

  sectionRow(ws, row, "RESUMEN ANUAL", colors);
  const summaryTitleRow = row;
  row++;

  const years = [...new Set(months.map(m => m.year))];

  ws.getCell(row, 2).value = "Indicador";
  years.forEach((year, index) => {
    ws.getCell(row, 3 + index).value = year;
  });
  headerRow(ws, row, 2, 2 + years.length, colors);
  row++;

  const summaryRows = {
    income: row++,
    expense: row++,
    net: row++,
    close: row++,
    negative: row++,
    lowReserve: row++
  };

  ws.getCell(summaryRows.income, 2).value = "Total ingresos";
  ws.getCell(summaryRows.expense, 2).value = "Total egresos";
  ws.getCell(summaryRows.net, 2).value = "Flujo neto";
  ws.getCell(summaryRows.close, 2).value = "Caja cierre año";
  ws.getCell(summaryRows.negative, 2).value = "Meses con caja negativa";
  ws.getCell(summaryRows.lowReserve, 2).value = "Meses bajo reserva mínima";

  for (let c = startCol; c <= endCol; c++) {
    const col = colLetter(c);

    if (c === startCol) {
      ws.getCell(saldoInicialRow, c).value = config.initialCash;
      inputCell(ws.getCell(saldoInicialRow, c), colors);
    } else {
      ws.getCell(saldoInicialRow, c).value = { formula: `${colLetter(c - 1)}${finalCashRow}` };
      formulaCell(ws.getCell(saldoInicialRow, c), colors);
    }

    ws.getCell(totalIncomeRow, c).value = { formula: `SUM(${col}${incomeStart}:${col}${incomeEnd})` };
    ws.getCell(totalExpenseRow, c).value = { formula: `SUM(${col}${expenseStart}:${col}${expenseEnd})` };
    ws.getCell(netFlowRow, c).value = { formula: `${col}${totalIncomeRow}-${col}${totalExpenseRow}` };
    ws.getCell(finalCashRow, c).value = { formula: `${col}${saldoInicialRow}+${col}${netFlowRow}` };
    ws.getCell(alertRow, c).value = {
      formula: `IF(${col}${finalCashRow}<0,"Caja negativa",IF(${col}${finalCashRow}<$B$6,"Bajo reserva","OK"))`
    };

    [totalIncomeRow, totalExpenseRow, netFlowRow, finalCashRow, alertRow].forEach(r => {
      formulaCell(ws.getCell(r, c), colors);
    });

    if (config.dataValidation) {
      for (let r = incomeStart; r <= incomeEnd; r++) addPositiveValidation(ws.getCell(r, c));
      for (let r = expenseStart; r <= expenseEnd; r++) addPositiveValidation(ws.getCell(r, c));
    }
  }

  years.forEach((year, index) => {
    const targetCol = 3 + index;
    const monthCols = months
      .map((m, i) => ({ m, col: startCol + i }))
      .filter(x => x.m.year === year)
      .map(x => colLetter(x.col));

    ws.getCell(summaryRows.income, targetCol).value =
      { formula: monthCols.map(c => `${c}${totalIncomeRow}`).join("+") };

    ws.getCell(summaryRows.expense, targetCol).value =
      { formula: monthCols.map(c => `${c}${totalExpenseRow}`).join("+") };

    ws.getCell(summaryRows.net, targetCol).value =
      { formula: monthCols.map(c => `${c}${netFlowRow}`).join("+") };

    ws.getCell(summaryRows.close, targetCol).value =
      { formula: `${monthCols[monthCols.length - 1]}${finalCashRow}` };

    ws.getCell(summaryRows.negative, targetCol).value =
      { formula: monthCols.map(c => `IF(${c}${finalCashRow}<0,1,0)`).join("+") };

    ws.getCell(summaryRows.lowReserve, targetCol).value =
      { formula: monthCols.map(c => `IF(AND(${c}${finalCashRow}>=0,${c}${finalCashRow}<$B$6),1,0)`).join("+") };
  });

  applyCashflowStyles(ws, startCol, endCol, {
    saldoInicialRow,
    incomeStart,
    incomeEnd,
    totalIncomeRow,
    expenseStart,
    expenseEnd,
    totalExpenseRow,
    netFlowRow,
    finalCashRow,
    alertRow,
    summaryTitleRow,
    summaryRows
  }, colors);

  if (config.sampleData) {
    addSampleData(ws, config, startCol, endCol, incomeStart, incomeEnd, expenseStart, expenseEnd);
  }

  applyBorders(ws);
  freeze(ws, startCol);

  ws.getCell("B3").font = { bold: true };
  ws.getCell("B4").font = { bold: true };
  ws.getCell("B5").font = { bold: true };
}

function applyCashflowStyles(ws, startCol, endCol, rows, colors) {
  for (let r = rows.incomeStart; r <= rows.incomeEnd; r++) {
    ws.getCell(r, 2).fill = fill(colors.income);
  }

  for (let r = rows.expenseStart; r <= rows.expenseEnd; r++) {
    ws.getCell(r, 2).fill = fill(colors.expense);
  }

  for (let c = startCol; c <= endCol; c++) {
    moneyFormat(ws.getCell(rows.saldoInicialRow, c));
    moneyFormat(ws.getCell(rows.totalIncomeRow, c));
    moneyFormat(ws.getCell(rows.totalExpenseRow, c));
    moneyFormat(ws.getCell(rows.netFlowRow, c));
    moneyFormat(ws.getCell(rows.finalCashRow, c));

    ws.getCell(rows.totalIncomeRow, c).fill = fill(colors.income);
    ws.getCell(rows.totalExpenseRow, c).fill = fill(colors.expense);
    ws.getCell(rows.netFlowRow, c).fill = fill(colors.result);
    ws.getCell(rows.finalCashRow, c).fill = fill(colors.result);
    ws.getCell(rows.alertRow, c).fill = fill(colors.soft);
  }

  ws.getColumn(2).font = { bold: true };

  Object.values(rows.summaryRows).forEach(r => {
    for (let c = 2; c <= 8; c++) {
      ws.getCell(r, c).fill = fill(colors.formula);
      ws.getCell(r, c).font = { bold: c === 2 };
      if (c > 2) moneyFormat(ws.getCell(r, c));
    }
  });

  for (let c = 1; c <= endCol; c++) {
    ws.getCell(rows.summaryTitleRow, c).fill = fill(colors.primary);
    ws.getCell(rows.summaryTitleRow, c).font = { color: { argb: colors.white }, bold: true };
  }
}

function addSampleData(ws, config, startCol, endCol, incomeStart, incomeEnd, expenseStart, expenseEnd) {
  for (let c = startCol; c <= endCol; c++) {
    for (let r = incomeStart; r <= incomeEnd; r++) {
      ws.getCell(r, c).value = 800000 + ((c - startCol) * 25000);
    }

    for (let r = expenseStart; r <= expenseEnd; r++) {
      ws.getCell(r, c).value = 350000 + ((r - expenseStart) * 50000);
    }
  }
}

function addPositiveValidation(cell) {
  cell.dataValidation = {
    type: "decimal",
    operator: "greaterThanOrEqual",
    formulae: [0],
    showErrorMessage: true,
    errorTitle: "Valor inválido",
    error: "Ingrese un valor mayor o igual a cero. Todos los montos deben ser positivos."
  };
}

function title(ws, cellRef, text, colors) {
  const cell = ws.getCell(cellRef);
  cell.value = text;
  cell.fill = fill(colors.primary);
  cell.font = { color: { argb: colors.white }, bold: true, size: 18 };
  cell.alignment = center();
}

function section(ws, cellRef, text, colors) {
  const cell = ws.getCell(cellRef);
  cell.value = text;
  cell.fill = fill(colors.soft);
  cell.font = { bold: true, color: { argb: colors.primary } };
}

function sectionRow(ws, row, text, colors) {
  ws.getCell(row, 2).value = text;
  ws.getCell(row, 2).fill = fill(colors.primary);
  ws.getCell(row, 2).font = { color: { argb: colors.white }, bold: true };
}

function totalRow(ws, row, text, colors) {
  ws.getCell(row, 2).value = text;
  ws.getCell(row, 2).font = { bold: true };
  ws.getCell(row, 2).fill = fill(colors.soft);
}

function headerRow(ws, row, fromCol, toCol, colors) {
  for (let c = fromCol; c <= toCol; c++) {
    ws.getCell(row, c).fill = fill(colors.primary);
    ws.getCell(row, c).font = { color: { argb: colors.white }, bold: true };
    ws.getCell(row, c).alignment = center();
  }
}

function editableRow(ws, row, startCol, endCol, colors) {
  for (let c = startCol; c <= endCol; c++) {
    inputCell(ws.getCell(row, c), colors);
    moneyFormat(ws.getCell(row, c));
  }
}

function inputCell(cell, colors) {
  cell.fill = fill(colors.input);
}

function formulaCell(cell, colors) {
  cell.fill = fill(colors.formula);
}

function fill(color) {
  return {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: color }
  };
}

function center() {
  return {
    horizontal: "center",
    vertical: "middle"
  };
}

function moneyFormat(cell) {
  cell.numFmt = '$ #,##0;[Red]-$ #,##0';
}

function applyBorders(ws) {
  ws.eachRow(row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: "thin", color: { argb: "D9E2EC" } },
        left: { style: "thin", color: { argb: "D9E2EC" } },
        bottom: { style: "thin", color: { argb: "D9E2EC" } },
        right: { style: "thin", color: { argb: "D9E2EC" } }
      };
      cell.alignment = cell.alignment || { vertical: "middle" };
    });
  });
}

function merge(ws, a, b, c, d) {
  if (typeof a === "string") {
    ws.mergeCells(a);
  } else {
    ws.mergeCells(a, b, c, d);
  }
}

function freeze(ws, startCol) {
  ws.views = [
    {
      state: "frozen",
      xSplit: startCol - 1,
      ySplit: 10
    }
  ];
}

function monthName(index) {
  return [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ][index];
}

function monthNameShort(index) {
  return [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ][index];
}

function colLetter(col) {
  let temp = "";
  let letter = "";

  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }

  return letter;
}
