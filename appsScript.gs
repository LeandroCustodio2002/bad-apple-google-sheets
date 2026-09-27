const VIDEO_URL =
  "https://raw.githubusercontent.com/LeandroCustodio2002/bad-apple-google-sheets/main/video_80_60_10fps.json";

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

  const rows = 60;
  const cols = 80;

  const rowSize = 9;
  const colSize = 12;

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