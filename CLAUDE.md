# AthleteBoard – project context

Web tool for following college baseball players and viewing their stats. Intended data source: SIDEARM Sports-style athletics stat pages.

## Stack
- Static site, vanilla JS as native ES modules, no build step. `index.html` (markup) + `css/styles.css` + `js/` (entry `js/main.js`). Needs a static server locally (`python -m http.server`); `file://` won't load modules.
- Data access goes only through `js/data/playerStore.js` (async: `getPlayers`, `addPlayers`, `updatePlayer`, `deletePlayer`, `replaceAllPlayers`). UI code never touches `localStorage` directly. After a mutation, call `reloadPlayers()` (`js/state.js`) then `renderTable()`.
- Current backend: `js/data/localStorageBackend.js`, seeded from `data/seed-players.json` on first run. A future real DB = new backend with the same five functions + swap the import in `playerStore.js`.
- Storage key `athleteboard-v5` (in `localStorageBackend.js`). Bump the version in `STORAGE_KEY` whenever the stored data shape changes.

## Current features
- Batting / Pitching / Fielding tabs (pill navigation), click-to-sort columns, search by name or school.
- Add Player flow (team URL, then choose players), player detail editor, Unfollow, Export/Import JSON.
- Batting column order is final: GP-GS, AVG, OBP, SLG, OPS, AB, H, 2B, 3B, HR, TB, R, RBI, BB, HBP, SO, BB:SO, SF, SH, GDP, SB-ATT.
- BB:SO is derived, read-only, sortable: (BB+HBP)/SO. Derived stats live in `DERIVED_STATS` (`js/config.js`); always read stats through `getStatValue()`.
- MVP decision: no "recently updated" behavior. Just list stats; a page refresh shows changes.

## Rules to keep
- Seed data uses name-keyed objects, never positional arrays (prevents silent column misalignment when columns are reordered).
- Header styling: dark green with yellow accents.

## Known gaps / next steps
- `fetchRosterFromUrl()` (`js/roster.js`) is a stub. A real version needs a serverless scraper (browsers cannot cross-origin scrape athletics sites).
- Six dummy seed players in `data/seed-players.json` must be removed before launch (set the file to `[]`; product should start empty).- No accounts or shared database; data is per-browser.

## Workflow
Work on `dev`; merge to `main` to publish the live site.
