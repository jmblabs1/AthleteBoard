/* ---------- Shared UI state ----------
   `players` is a cache of what the store last returned. Don't edit it
   directly: call the store, then reloadPlayers(). */
import { DEFAULT_SORT } from "./config.js";
import { getPlayers } from "./data/playerStore.js";

export const state = {
  players: [],
  activeTab: "batting",
  sortCol: DEFAULT_SORT.batting,
  sortDir: "desc",
  searchQuery: ""
};

export async function reloadPlayers(){
  state.players = await getPlayers();
}
