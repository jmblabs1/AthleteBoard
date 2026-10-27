/* ---------- Add Players flow ---------- */
import { escapeHtml } from "../utils.js";
import { newPlayer } from "../player.js";
import { reloadPlayers } from "../state.js";
import { addPlayers } from "../data/playerStore.js";
import { fetchRosterFromUrl } from "../roster.js";
import { renderTable } from "./table.js";

const addOverlay = document.getElementById("addOverlay");
const addBody = document.getElementById("addBody");
const addFoot = document.getElementById("addFoot");
const addStepLabel = document.getElementById("addStepLabel");
const addTitle = document.getElementById("addTitle");
const addSub = document.getElementById("addSub");

let pendingUrl = "";

async function addAndClose(names){
  await addPlayers(names.map(name => newPlayer(name, pendingUrl)));
  await reloadPlayers();
  renderTable();
  closeAdd();
}

function openAddFlowStep1(){
  pendingUrl = "";
  addStepLabel.textContent = "Step 1 of 2";
  addTitle.textContent = "Add players from a team";
  addSub.textContent = "Paste the team's baseball stats page URL.";
  addBody.innerHTML = `
    <div class="field">
      <label for="teamUrlInput">Team stats page URL</label>
      <input id="teamUrlInput" type="url" placeholder="https://merrimackathletics.com/sports/baseball/stats?path=baseball" />
      <div class="hint">Works best with SIDEARM Sports-hosted athletics sites. Support for other vendors can be added later.</div>
    </div>`;
  addFoot.innerHTML = `
    <button class="secondary" data-close-add>Cancel</button>
    <button class="add-btn" id="findPlayersBtn">Find Players</button>`;
  document.getElementById("findPlayersBtn").addEventListener("click", () => {
    const url = document.getElementById("teamUrlInput").value.trim();
    if(!url) return;
    pendingUrl = url;
    openAddFlowStep2(url);
  });
  addOverlay.classList.add("open");
}

function openAddFlowStep2(url){
  const discovered = fetchRosterFromUrl(url); // stub — see roster.js

  addStepLabel.textContent = "Step 2 of 2";
  addTitle.textContent = "Choose Players";
  addSub.textContent = discovered.length
    ? "Select which players to follow."
    : "Automatic roster lookup isn't wired up yet in this prototype — type the player names to add.";

  if(discovered.length){
    addBody.innerHTML = `<div class="chooser-list">` +
      discovered.map(name => `
        <label class="chooser-row">
          <input type="checkbox" value="${escapeHtml(name)}" checked />
          ${escapeHtml(name)}
        </label>`).join("") +
      `</div>`;
    addFoot.innerHTML = `
      <button class="secondary" id="backToStep1">Back</button>
      <button class="add-btn" id="addSelectedBtn">Add Selected</button>`;
    document.getElementById("addSelectedBtn").addEventListener("click", () => {
      const checked = [...addBody.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
      addAndClose(checked);
    });
  } else {
    addBody.innerHTML = `
      <div class="field">
        <label for="manualNames">Player names</label>
        <textarea id="manualNames" rows="4" placeholder="One name per line, e.g.&#10;Andrew Schmit&#10;Jake Donovan"></textarea>
        <div class="hint">You'll be able to fill in each player's stats after adding them.</div>
      </div>`;
    addFoot.innerHTML = `
      <button class="secondary" id="backToStep1">Back</button>
      <button class="add-btn" id="addManualBtn">Add Players</button>`;
    document.getElementById("addManualBtn").addEventListener("click", () => {
      const names = document.getElementById("manualNames").value
        .split("\n").map(s => s.trim()).filter(Boolean);
      if(!names.length) return;
      addAndClose(names);
    });
  }

  document.getElementById("backToStep1").addEventListener("click", openAddFlowStep1);
}

function closeAdd(){ addOverlay.classList.remove("open"); }

export function initAddFlow(){
  document.getElementById("openAddFlow").addEventListener("click", openAddFlowStep1);
  /* Delegated so buttons rendered later (e.g. step 1's Cancel) also close. */
  addOverlay.addEventListener("click", e => {
    if(e.target === addOverlay || e.target.closest("[data-close-add]")) closeAdd();
  });
}
