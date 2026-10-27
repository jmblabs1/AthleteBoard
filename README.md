# AthleteBoard

A web tool for tracking college baseball players' stats (Batting, Pitching, Fielding). Plain HTML/CSS/JS using native ES modules, no build step.

## Run locally
ES modules and the seed JSON file can't load over `file://`, so serve the folder with any static server:

```
python -m http.server 8000      # then open http://localhost:8000
# or
npx serve
```

The VS Code **Live Preview** extension also works.

## Project layout
```
index.html                    markup only
css/styles.css                all styles
data/seed-players.json        dummy players loaded on first run (empty this before launch)
js/
  main.js                     entry point: wires modules, first render
  config.js                   stat columns, default sorts, derived stats, getStatValue()
  player.js                   player model: newPlayer(), normalizePlayer()
  state.js                    shared UI state (players cache, active tab, sort, search)
  roster.js                   fetchRosterFromUrl() stub
  utils.js                    escapeHtml()
  data/
    playerStore.js            the only data API the UI uses (async CRUD)
    localStorageBackend.js    current implementation of that API
  ui/                         table, search/tabs, add flow, detail modal, import/export
```

## Data
All reads and writes go through `js/data/playerStore.js`:
`getPlayers()`, `addPlayers()`, `updatePlayer()`, `deletePlayer()`, `replaceAllPlayers()`.
Today these are backed by `localStorage` (per-browser), seeded from `data/seed-players.json` on first run. To move to a real database, write a backend module with the same five async functions and change the one import in `playerStore.js`.

## Branches
- `main` – live site
- `dev` – work in progress / test site

## Status
Prototype. Data is stored per-browser; there are no accounts or shared database yet.
