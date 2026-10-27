/* ---------- Player store ----------
   The ONLY module the UI imports for reading or writing player data.
   Every function is async so callers already handle a network-backed
   database. To move off localStorage, write a backend module (e.g.
   apiBackend.js) that exports these same five functions and point the
   import below at it — no UI code needs to change.

     getPlayers()              -> Promise<Player[]>
     addPlayers(players)       -> Promise<void>
     updatePlayer(player)      -> Promise<void>   (matched by id)
     deletePlayer(id)          -> Promise<void>
     replaceAllPlayers(players)-> Promise<void>   (used by Import JSON)
------------------------------------------------ */
export {
  getPlayers,
  addPlayers,
  updatePlayer,
  deletePlayer,
  replaceAllPlayers
} from "./localStorageBackend.js";
