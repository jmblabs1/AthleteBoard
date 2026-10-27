/* ---------- Entry point ---------- */
import { reloadPlayers } from "./state.js";
import { initTable, renderTable } from "./ui/table.js";
import { initControls } from "./ui/controls.js";
import { initAddFlow } from "./ui/addFlow.js";
import { initDetailModal, openDetail } from "./ui/detailModal.js";
import { initImportExport } from "./ui/importExport.js";

initTable({ onOpenPlayer: openDetail });
initControls();
initAddFlow();
initDetailModal();
initImportExport();

await reloadPlayers();
renderTable();
