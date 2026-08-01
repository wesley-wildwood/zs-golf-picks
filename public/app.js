import { DEFAULT_TOURNAMENT_SLUG, TOURNAMENTS, getTournament, scoreGame } from "./scoring.js";

const REFRESH_MS = 60_000;
const savedSlug = window.localStorage.getItem("golf-picks:tournament");
let activeSlug = TOURNAMENTS[savedSlug] ? savedSlug : DEFAULT_TOURNAMENT_SLUG;

const elements = {
  title: document.querySelector("#event-title"),
  subtitle: document.querySelector("#event-subtitle"),
  tournamentTabs: document.querySelector("#tournament-tabs"),
  sourcePill: document.querySelector("#source-pill"),
  sourceLabel: document.querySelector("#source-label"),
  refreshButton: document.querySelector("#refresh-button"),
  errorBanner: document.querySelector("#error-banner")
};

elements.refreshButton.addEventListener("click", loadScores);
renderTournamentTabs();
loadScores();
window.setInterval(loadScores, REFRESH_MS);

async function loadScores() {
  const tournament = getTournament(activeSlug);
  setLoading(true);
  updateHeading(tournament);

  try {
    const response = await fetch(`/api/scores?tournament=${encodeURIComponent(tournament.slug)}`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || payload.error || `Request failed (${response.status})`);
    render(payload, scoreGame(payload, tournament), tournament);
    elements.errorBanner.hidden = true;
    elements.sourcePill.className = "source-pill live";
    elements.sourceLabel.textContent = payload.event.status || "Live scores";
  } catch (error) {
    elements.sourcePill.className = "source-pill delayed";
    elements.sourceLabel.textContent = "Scores delayed";
    elements.errorBanner.textContent = `Live scores are temporarily unavailable: ${error.message}`;
    elements.errorBanner.hidden = false;
  } finally {
    setLoading(false);
  }
}

function renderTournamentTabs() {
  elements.tournamentTabs.innerHTML = Object.values(TOURNAMENTS).map((tournament) => `
    <button
      type="button"
      class="tournament-tab ${tournament.slug === activeSlug ? "active" : ""}"
      data-slug="${escapeHtml(tournament.slug)}"
      aria-pressed="${tournament.slug === activeSlug ? "true" : "false"}"
    >
      <span>${escapeHtml(tournament.shortName)}</span>
    </button>
  `).join("");

  for (const button of elements.tournamentTabs.querySelectorAll("button")) {
    button.addEventListener("click", () => {
      activeSlug = button.dataset.slug;
      window.localStorage.setItem("golf-picks:tournament", activeSlug);
      renderTournamentTabs();
      clearScores();
      loadScores();
    });
  }
}

function updateHeading(tournament) {
  elements.title.textContent = tournament.eventName;
  elements.subtitle.textContent = `${tournament.venue} · ${tournament.location}`;
}

function clearScores() {
  document.querySelector("#sean-total").textContent = "...";
  document.querySelector("#zach-total").textContent = "...";
  document.querySelector("#sean-match").textContent = "Waiting";
  document.querySelector("#zach-match").textContent = "Waiting";
  document.querySelector("#leader-text").textContent = "Waiting for live scores";
  document.querySelector("#updated-at").textContent = "Not updated yet";
  document.querySelector("#sean-rounds").innerHTML = "";
  document.querySelector("#zach-rounds").innerHTML = "";
  document.querySelector("#sean-team").innerHTML = "";
  document.querySelector("#zach-team").innerHTML = "";
  document.querySelector("#alt-table").innerHTML = "";
  document.querySelector("#best-ball-table").innerHTML = "";
}

function render(payload, game, tournament) {
  renderScoreCard("sean", game.Sean, game.Zach);
  renderScoreCard("zach", game.Zach, game.Sean);
  document.querySelector("#leader-text").textContent = game.leaderText;
  document.querySelector("#updated-at").textContent = `Updated ${formatTime(payload.updatedAt)}`;
  document.querySelector("#event-meta").textContent = `Round ${payload.event.currentRound} · Par ${payload.event.par || tournament.par} · Auto-refreshes every 60 seconds`;
  renderTeam("#sean-team", game.Sean);
  renderTeam("#zach-team", game.Zach);
  renderAltRows("#alt-table", game.altRows, payload.event.currentRound);
  renderBestBallRows("#best-ball-table", game.bestBallRows);
  document.querySelector("#alt-verdict").textContent = game.altText;
  document.querySelector("#best-ball-verdict").textContent = game.bestBallText;
}

function renderScoreCard(prefix, team, opponent) {
  const total = document.querySelector(`#${prefix}-total`);
  const match = document.querySelector(`#${prefix}-match`);
  const rounds = document.querySelector(`#${prefix}-rounds`);
  total.textContent = `${display(team.total)} ${formatToPar(team.toPar)}`;
  if (!Number.isFinite(team.total) || !Number.isFinite(opponent.total)) match.textContent = "Waiting";
  else if (team.total === opponent.total) match.textContent = "Tied";
  else if (team.total < opponent.total) match.textContent = `Up ${opponent.total - team.total}`;
  else match.textContent = `Down ${team.total - opponent.total}`;
  rounds.innerHTML = team.rounds.map((round, index) => `<span>R${index + 1}: ${display(round.total)}</span>`).join("");
}

function renderTeam(selector, team) {
  document.querySelector(selector).innerHTML = team.golfers.map((golfer, golferIndex) => `
    <tr>
      <td class="golfer-name">${escapeHtml(golfer.name)}</td>
      <td>${statusBadge(golfer)}</td>
      <td>${formatTournamentScore(golfer)}</td>
      ${golfer.rounds.map((round, roundIndex) => `<td class="${team.rounds[roundIndex].counting.includes(golferIndex) ? "counting" : ""}">${display(round)}</td>`).join("")}
    </tr>
  `).join("");
}

function renderAltRows(selector, rows, currentRound) {
  document.querySelector(selector).innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.owner)}</td>
      <td class="golfer-name">${escapeHtml(row.name)}</td>
      <td>${statusBadge(row)}</td>
      <td>${display(row.rounds[currentRound - 1])}</td>
      <td>${display(row.total)}</td>
    </tr>
  `).join("");
}

function renderBestBallRows(selector, rows) {
  document.querySelector(selector).innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.owner)}</td>
      <td class="golfer-name">${escapeHtml(row.name)}</td>
      <td>${statusBadge(row)}</td>
      <td>${formatToPar(row.tournamentToPar)}</td>
      <td>${formatPosition(row.position)}</td>
    </tr>
  `).join("");
}

function statusBadge(golfer) {
  const status = golfer.status || "not_started";
  const label = status === "complete" ? "Finished" : status === "playing" ? `Thru ${golfer.holes}` : status === "missing" ? "Not found" : status === "missed_cut" ? "Missed Cut" : "Not started";
  return `<span class="status ${status}">${escapeHtml(label)}</span>`;
}

function formatTournamentScore(golfer) {
  if (!golfer.found) return "...";
  const toPar = golfer.tournamentToPar;
  const parText = toPar == null ? "" : toPar === 0 ? "E" : toPar > 0 ? `+${toPar}` : String(toPar);
  return `${display(golfer.total)}${parText ? ` (${parText})` : ""}`;
}

function formatPosition(position) {
  if (!position) return "...";
  return Number(position) === 1 ? "1" : `T${position}`;
}

function formatToPar(value) {
  if (!Number.isFinite(value)) return "";
  if (value === 0) return "(E)";
  return `(${value > 0 ? "+" : ""}${value})`;
}

function display(value) {
  return Number.isFinite(value) ? String(value) : "...";
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function setLoading(loading) {
  elements.refreshButton.disabled = loading;
  elements.refreshButton.classList.toggle("loading", loading);
  elements.refreshButton.querySelector("span:last-child").textContent = loading ? "Refreshing" : "Refresh scores";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  })[character]);
}
