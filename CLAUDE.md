# AthleteBoard – project context

Web tool for following college baseball players and viewing their stats. Intended data source: SIDEARM Sports-style athletics stat pages.

## Stack
- Single self-contained `index.html` (HTML + CSS + vanilla JS), `localStorage` persistence.
- Storage key `athleteboard-v5`. Bump the version in `STORAGE_KEY` whenever the stored data shape changes.

## Current features
- Batting / Pitching / Fielding tabs (pill navigation), click-to-sort columns, search by name or school.
- Add Player flow (team URL, then choose players), player detail editor, Unfollow, Export/Import JSON.
- Batting column order is final: GP-GS, AVG, OBP, SLG, OPS, AB, H, 2B, 3B, HR, TB, R, RBI, BB, HBP, SO, BB:SO, SF, SH, GDP, SB-ATT.
- BB:SO is derived, read-only, sortable: (BB+HBP)/SO. Derived stats live in `DERIVED_STATS`; always read stats through `getStatValue()`.
- MVP decision: no "recently updated" behavior. Just list stats; a page refresh shows changes.

## Rules to keep
- Seed data uses name-keyed objects, never positional arrays (prevents silent column misalignment when columns are reordered).
- Header styling: dark green with yellow accents.

## Known gaps / next steps
- `fetchRosterFromUrl()` is a stub. A real version needs a serverless scraper (browsers cannot cross-origin scrape athletics sites).
- Six dummy seed players in `seedPlayers()` must be removed before launch (product should start empty).
- No accounts or shared database; data is per-browser.

## Workflow
Work on `dev`; merge to `main` to publish the live site.
