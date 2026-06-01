# homerc

A customizable browser startpage / new tab replacement for Firefox.

## Features

- 12-hour analog clock with AM/PM
- DuckDuckGo search bar (press Enter to search)
- Quick links: DuckDuckGo, YouTube, GitHub, ChatGPT, Claude
- Custom shortcuts: add, edit, delete your own links from settings (gear icon)
- Drawing canvas: full-screen whiteboard with Blank, Lined, Grid, and Dots templates; adjustable brush size and color; undo/redo (Ctrl+Z / Ctrl+Shift+Z); save as PNG
- Custom background image: upload from settings, stored in localStorage
- Dark theme with frosted-glass search bar

## Usage

Load as a temporary add-on in Firefox:

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json`

Or zip the contents and submit to AMO.

## Build

```bash
cd homerc && zip -r ../homerc.zip . -x homerc.zip
```

## Project Structure

```
homerc/
  manifest.json          Extension manifest (MV3)
  index.html             Main page / new tab
  css/style.css          Styles
  js/script.js           Clock, search, shortcuts, background
  js/canvas.js           Drawing canvas logic
  js/canvasTemplates.js  Canvas background templates
  icons/homerc.png       Extension icon
  LICENSE                MIT
```

## License

MIT
