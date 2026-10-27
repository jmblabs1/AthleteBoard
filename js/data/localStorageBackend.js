/* ---------- localStorage backend (interim database) ----------
   Persists the whole player list as one JSON array in this browser.
   On first run (nothing stored yet) it loads data/seed-players.json;
   the seed isn't written to storage until the first change is saved.
------------------------------------------------ */
import { normalizePlayer } from "../player.js";

/* Bump the version whenever the stored data shape changes. */
const STORAGE_KEY = "athleteboard-v5";
const SEED_URL = new URL("../../data/seed-players.json", import.meta.url);

let cache = null;

async function loadSeed(){
  try{
    const res = await fetch(SEED_URL);
    if(!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map(normalizePlayer) : [];
  }catch{ return []; }
}

async function load(){
  if(cache) return cache;
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? parsed : await loadSeed();
  }catch{ cache = await loadSeed(); }
  return cache;
}

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cache)); }

/* Return copies so callers can't modify stored data without going
   through the functions below (as with a real database). */
export async function getPlayers(){
  return structuredClone(await load());
}

export async function addPlayers(players){
  cache = [...await load(), ...structuredClone(players)];
  save();
}

export async function updatePlayer(player){
  const copy = structuredClone(player);
  cache = (await load()).map(p => p.id === copy.id ? copy : p);
  save();
}

export async function deletePlayer(id){
  cache = (await load()).filter(p => p.id !== id);
  save();
}

export async function replaceAllPlayers(players){
  cache = structuredClone(players);
  save();
}
