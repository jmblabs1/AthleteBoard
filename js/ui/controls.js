/* ---------- Search + Tabs ---------- */
import { DEFAULT_SORT } from "../config.js";
import { state } from "../state.js";
import { renderTable } from "./table.js";

export function initControls(){
  document.getElementById("searchInput").addEventListener("input", e => {
    state.searchQuery = e.target.value;
    renderTable();
  });

  document.querySelectorAll(".tab-pill").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-pill").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.activeTab = tab.dataset.tab;
      state.sortCol = DEFAULT_SORT[state.activeTab];
      state.sortDir = "desc";
      renderTable();
    });
  });
}
