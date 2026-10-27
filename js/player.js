/* ---------- Player model ---------- */
import { STAT_COLUMNS } from "./config.js";

export function emptyStatObject(category){
  const obj = {};
  STAT_COLUMNS[category].forEach(c => obj[c] = "");
  return obj;
}

export function newPlayer(name, sourceUrl){
  return {
    id: crypto.randomUUID(),
    name,
    sourceUrl: sourceUrl || "",
    school: "",
    batting: emptyStatObject("batting"),
    pitching: emptyStatObject("pitching"),
    fielding: emptyStatObject("fielding")
  };
}

/* Coerce a loosely-shaped record (seed file, imported JSON, future API
   response) into a complete player: fills missing fields and makes sure
   every configured stat column exists. */
export function normalizePlayer(p){
  return {
    id: p.id || crypto.randomUUID(),
    name: p.name || "Unnamed",
    sourceUrl: p.sourceUrl || "",
    school: p.school || "",
    batting: { ...emptyStatObject("batting"), ...(p.batting||{}) },
    pitching: { ...emptyStatObject("pitching"), ...(p.pitching||{}) },
    fielding: { ...emptyStatObject("fielding"), ...(p.fielding||{}) }
  };
}
