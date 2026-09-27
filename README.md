# Bad Apple!! on Google Sheets

**Bad Apple!!** animation running inside a Google Sheets spreadsheet

## Repository structure

```
bad-apple-google-sheets/
├── apps-script/
│   ├── Código.gs        # Server script (menu, screen setup, rendering)
│   └── player.html      # Sidebar with the Play button and the animation loop
├── notebooks/
│   └── convertVideoIntoJson.ipynb   # Converts the .mp4 video into JSON frames (Colab)
├── data/
│   ├── video_40_30_10fps.json       # 40×30 px, 10 fps (~2.9 MB)
│   ├── video_80_60_10fps.json       # 80×60 px, 10 fps (~11 MB)
│   └── video_80_60_15fps.json       # 80×60 px, 15 fps (~16.6 MB)
├── assets/
│   └── badApple.mp3     # Soundtrack
└── README.md
```

## How it works

```
 badApple.mp4 ──► notebooks/convertVideoIntoJson.ipynb ──► data/video_W_H_FPSfps.json
                                                                   │
                                                   (GitHub raw URL)│
                                                                   ▼
 Sheet ◄───── setBackgrounds ◄── Código.gs ◄── google.script.run ◄── player.html
```

1. **Conversion (notebook):** the video is downscaled to `W × H`, converted to black and white, and sampled at the desired FPS.
2. **Hosting:** the JSON lives in `data/` and is downloaded by Apps Script from GitHub (`raw.githubusercontent.com`).
3. **Player (sidebar):** `player.html` requests the frames from the server (`getFrames`), computes the current frame from the elapsed time and, on each frame:
   - on the first one, calls `renderFrame` and paints the whole screen with `setBackgrounds`;
   - on the following ones, computes only the cells that changed and calls `renderChanges`, which paints those cells with `getRangeList(...).setBackground`.

### Frame format

Each JSON file is an array of frames. Each frame is an array of `H` strings with `W` characters: `"1"` = black and `"0"` = white.

```json
[
  ["1111111111", "1100000011", "..."],
  ["..."]
]
```

## How to use

1. Create a Google Sheets spreadsheet and open **Extensions → Apps Script**.
2. Create the project files:
   - `Código.gs` with the contents of `apps-script/Código.gs`;
   - an HTML file named **`player`** with the contents of `apps-script/player.html`. The name must be exactly this, because the script calls `createHtmlOutputFromFile("player")`.
3. Save and reload the spreadsheet. The **Bad Apple** menu will appear.
4. Run the `setupScreen` function from the Apps Script editor. It adjusts the cell size and hides the gridlines.
5. Click **Bad Apple → Player → ▶ Play**.

On the first run, Google asks for authorization to access the spreadsheet and make external requests (`UrlFetchApp`).

## Configuration

| What | Where |
|---|---|
| Video used (resolution/FPS) | `VIDEO_URL` in `apps-script/Código.gs` |
| Player FPS | `FPS` in `apps-script/player.html`. Must match the JSON's FPS |
| Screen size | `rows`, `cols`, `rowSize` and `colSize` in `setupScreen` (`Código.gs`) |

> ⚠️ Keep `VIDEO_URL`, `FPS` and `setupScreen`'s `rows`/`cols` consistent with the chosen JSON. Currently `VIDEO_URL` points to the 80×60 file, but `setupScreen` only sets up 40×30.

`VIDEO_URL` points to the `main` branch on GitHub, so a new or moved JSON only works after `git push`.

### Generating new frames

1. Open `notebooks/convertVideoIntoJson.ipynb` in [Google Colab](https://colab.research.google.com/).
2. Adjust `WIDTH`, `HEIGHT`, `TARGET_FPS` and `THRESHOLD` in the configuration cell.
3. Run all cells and upload the `.mp4` when prompted.
4. Rename the downloaded `frames.json` to `video_<W>_<H>_<FPS>fps.json`, put it in `data/` and push.
