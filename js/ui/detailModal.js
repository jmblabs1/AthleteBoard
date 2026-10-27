/* ---------- Player detail modal ---------- */
import { STAT_COLUMNS, CATEGORY_LABEL, DERIVED_STATS, getStatValue } from "../config.js";
import { escapeHtml } from "../utils.js";
import { state, reloadPlayers } from "../state.js";
import { updatePlayer, deletePlayer } from "../data/playerStore.js";
import { renderTable } from "./table.js";

const detailOverlay = document.getElementById("detailOverlay");
const detailName = document.getElementById("detailName");
const detailSub = document.getElementById("detailSub");
const detailBody = document.getElementById("detailBody");
const detailDelete = document.getElementById("detailDelete");
const detailSave = document.getElementById("detailSave");

let currentDetailId = null;

export function openDetail(id){
  currentDetailId = id;
  const p = state.players.find(pl => pl.id === id);
  if(!p) return;

  detailName.textContent = p.name;
  detailSub.textContent = p.school || "";

  let html = `
    <div class="field">
      <label>School</label>
      <input id="editSchool" type="text" value="${escapeHtml(p.school)}" />
    </div>
    <div class="field">
      <label>Stats source URL</label>
      <input id="editSourceUrl" type="url" value="${escapeHtml(p.sourceUrl)}" />
    </div>`;

  Object.keys(STAT_COLUMNS).forEach(category => {
    html += `<div class="stat-section"><h3>${CATEGORY_LABEL[category]}</h3><div class="stat-grid">`;
    STAT_COLUMNS[category].forEach(col => {
      const isDerived = DERIVED_STATS[category] && DERIVED_STATS[category][col];
      if(isDerived){
        html += `
          <div class="stat-field field">
            <label>${col} (auto)</label>
            <input type="text" value="${escapeHtml(getStatValue(p, category, col) || '—')}" disabled style="background:#f8fafc;color:#94a3b8;" />
          </div>`;
      } else {
        html += `
          <div class="stat-field field">
            <label>${col}</label>
            <input data-cat="${category}" data-col="${col}" type="text" value="${escapeHtml(p[category][col] ?? "")}" />
          </div>`;
      }
    });
    html += `</div></div>`;
  });

  detailBody.innerHTML = html;
  detailOverlay.classList.add("open");
}

function closeDetail(){ detailOverlay.classList.remove("open"); currentDetailId = null; }

export function initDetailModal(){
  detailSave.addEventListener("click", async () => {
    const p = state.players.find(pl => pl.id === currentDetailId);
    if(!p) return;
    p.school = document.getElementById("editSchool").value.trim();
    p.sourceUrl = document.getElementById("editSourceUrl").value.trim();
    detailBody.querySelectorAll("input[data-cat]").forEach(input => {
      p[input.dataset.cat][input.dataset.col] = input.value.trim();
    });
    await updatePlayer(p);
    await reloadPlayers();
    renderTable();
    closeDetail();
  });

  detailDelete.addEventListener("click", async () => {
    await deletePlayer(currentDetailId);
    await reloadPlayers();
    renderTable();
    closeDetail();
  });

  detailOverlay.addEventListener("click", e => { if(e.target === detailOverlay) closeDetail(); });
  document.querySelectorAll("[data-close-detail]").forEach(b => b.addEventListener("click", closeDetail));
}
