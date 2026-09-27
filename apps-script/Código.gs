const VIDEO_URL =
  "https://raw.githubusercontent.com/LeandroCustodio2002/bad-apple-google-sheets/main/data/video_80_60_10fps.json";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Bad Apple")
    .addItem("Player", "openPlayer")
    .addToUi();
}

function openPlayer() {

  const html = HtmlService
    .createHtmlOutputFromFile("player")
    .setWidth(300)
    .setHeight(200);

  SpreadsheetApp.getUi()
    .showSidebar(html);
}

function getFrames() {

  const response =
    UrlFetchApp.fetch(VIDEO_URL);

  return response.getContentText();
}

function setupScreen() {

  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.clear();
  sheet.setHiddenGridlines(true);

  const rows = 30;
  const cols = 40;

  const rowSize = 18;
  const colSize = 24;

  sheet.setRowHeights(1, rows, rowSize);
  sheet.setColumnWidths(1, cols, colSize);

  sheet.setActiveSelection("A1");
}

function renderFrame(frame) {

  const colors = frame.map(row =>
    row.split("").map(pixel =>
      pixel === "1"
        ? "#000000"
        : "#FFFFFF"
    )
  );

  SpreadsheetApp
    .getActiveSheet()
    .getRange(
      1,
      1,
      colors.length,
      colors[0].length
    )
    .setBackgrounds(colors);
}

function renderChanges(changes) {

  const sheet =
    SpreadsheetApp.getActiveSheet();

  const blackCells = [];
  const whiteCells = [];

  for (const change of changes) {

    const row = change[0];
    const col = change[1];
    const pixel = change[2];

    const a1 = toA1(row, col);

    if (pixel === "1") {
      blackCells.push(a1);
    } else {
      whiteCells.push(a1);
    }
  }

  if (blackCells.length > 0) {
    sheet
      .getRangeList(blackCells)
      .setBackground("#000000");
  }

  if (whiteCells.length > 0) {
    sheet
      .getRangeList(whiteCells)
      .setBackground("#FFFFFF");
  }
}

function toA1(row, col) {

  let columnName = "";

  while (col > 0) {

    const remainder =
      (col - 1) % 26;

    columnName =
      String.fromCharCode(
        65 + remainder
      ) + columnName;

    col =
      Math.floor(
        (col - 1) / 26
      );
  }

  return columnName + row;
}