/* ---------- Export / Import ---------- */
import { normalizePlayer } from "../player.js";
import { state, reloadPlayers } from "../state.js";
import { replaceAllPlayers } from "../data/playerStore.js";
import { renderTable } from "./table.js";

export function initImportExport(){
  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.players, null, 2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "athleteboard-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  const importBtn = document.getElementById("importBtn");
  const importFile = document.getElementById("importFile");
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async e => {
    const file = e.target.files[0];
    if(!file) return;
    try{
      const parsed = JSON.parse(await file.text());
      if(!Array.isArray(parsed)) throw new Error("Invalid file");
      await replaceAllPlayers(parsed.map(normalizePlayer));
      await reloadPlayers();
      renderTable();
    }catch{
      alert("That file could not be imported.");
    }finally{
      e.target.value = "";
    }
  });
}
