/* ---------- Rendering: main table ---------- */
import { STAT_COLUMNS, getStatValue } from "../config.js";
import { escapeHtml } from "../utils.js";
import { state, reloadPlayers } from "../state.js";
import { deletePlayer } from "../data/playerStore.js";

const tableArea = document.getElementById("tableArea");
const tabCount = document.getElementById("tabCount");

let onOpenPlayer = () => {};

/* Called once from main.js; avoids a circular import with detailModal.js. */
export function initTable(handlers){
  onOpenPlayer = handlers.onOpenPlayer;
}

function getFilteredSorted(){
  const { players, searchQuery, sortCol, sortDir, activeTab } = state;
  let list = players.filter(p => {
    if(searchQuery){
      const q = searchQuery.toLowerCase();
      if(!p.name.toLowerCase().includes(q) && !p.school.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  list = [...list].sort((a,b) => {
    let av, bv;
    if(sortCol === "__name__"){ av = a.name; bv = b.name; }
    else if(sortCol === "__school__"){ av = a.school; bv = b.school; }
    else { av = getStatValue(a, activeTab, sortCol); bv = getStatValue(b, activeTab, sortCol); }
    const an = parseFloat(av), bn = parseFloat(bv);
    let cmp;
    if(!isNaN(an) && !isNaN(bn) && av !== "" && bv !== ""){ cmp = an - bn; }
    else { cmp = String(av||"").localeCompare(String(bv||"")); }
    return sortDir === "asc" ? cmp : -cmp;
  });
  return list;
}

export function renderTable(){
  const { players, sortCol, sortDir, activeTab } = state;
  tabCount.textContent = `${players.length} player${players.length===1?"":"s"}`;

  if(players.length === 0){
    tableArea.innerHTML = `
      <div class="empty-state">
        <div class="big">No players followed yet</div>
        <div>Add players from a college team's baseball stats page to start tracking them.</div>
        <button class="add-btn" onclick="document.getElementById('openAddFlow').click()">+ Add Player</button>
      </div>`;
    return;
  }

  const list = getFilteredSorted();
  const cols = STAT_COLUMNS[activeTab];

  function arrowFor(colKey){
    if(sortCol !== colKey) return "";
    return sortDir === "asc" ? '<span class="arrow">&uarr;</span>' : '<span class="arrow">&darr;</span>';
  }

  let html = `<div class="table-wrap"><table><thead><tr>
    <th data-col="__name__" class="${sortCol==='__name__'?'sorted':''}">Player${arrowFor('__name__')}</th>
    <th data-col="__school__" class="${sortCol==='__school__'?'sorted':''}">School${arrowFor('__school__')}</th>`;
  cols.forEach(c => html += `<th data-col="${c}" class="${sortCol===c?'sorted':''}">${c}${arrowFor(c)}</th>`);
  html += `<th class="no-sort">Actions</th></tr></thead><tbody>`;

  if(list.length === 0){
    html += `<tr><td colspan="${cols.length+3}" style="text-align:center;color:#64748b;padding:32px;">No players match.</td></tr>`;
  }

  list.forEach(p => {
    html += `<tr>
      <td class="name-cell"><a class="player-link" data-id="${p.id}">${escapeHtml(p.name)}</a></td>
      <td>${escapeHtml(p.school) || "&mdash;"}</td>`;
    cols.forEach(c => {
      const val = getStatValue(p, activeTab, c);
      const primary = c === sortCol ? ' class="stat-primary"' : '';
      html += `<td${primary}>${val === "" || val === undefined ? "&mdash;" : escapeHtml(String(val))}</td>`;
    });
    html += `<td><button class="unfollow-btn" data-unfollow-id="${p.id}">Unfollow</button></td>`;
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  tableArea.innerHTML = html;

  tableArea.querySelectorAll(".player-link").forEach(link => {
    link.addEventListener("click", () => onOpenPlayer(link.dataset.id));
  });
  tableArea.querySelectorAll("th[data-col]").forEach(th => {
    th.addEventListener("click", () => {
      const col = th.dataset.col;
      if(state.sortCol === col){ state.sortDir = state.sortDir === "asc" ? "desc" : "asc"; }
      else { state.sortCol = col; state.sortDir = "desc"; }
      renderTable();
    });
  });
  tableArea.querySelectorAll("[data-unfollow-id]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await deletePlayer(btn.dataset.unfollowId);
      await reloadPlayers();
      renderTable();
    });
  });
}
