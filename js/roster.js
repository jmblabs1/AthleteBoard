/* ---------- Roster "discovery" stub ----------
   In production this calls a small backend/serverless scraper that
   fetches the team stats page (e.g. SIDEARM-format sites) and parses
   the roster. Browsers can't reliably cross-origin-scrape athletics
   sites, so for this prototype the human fills in the names that the
   backend would otherwise have discovered. Swap this function's body
   for a real fetch() to your scraping service later — nothing else
   in the app needs to change.
------------------------------------------------ */
export function fetchRosterFromUrl(url){
  return []; // placeholder — real implementation returns discovered names
}
