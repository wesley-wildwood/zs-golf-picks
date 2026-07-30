import test from "node:test";
import assert from "node:assert/strict";
import { getTournament, normalizeName, projectedRoundScore, scoreGame, scoreTeam } from "../public/scoring.js";

function player(name, roundOne, roundTwoToPar, status = "playing") {
  return {
    id: name,
    name,
    tournamentToPar: roundOne - 70 + (roundTwoToPar || 0),
    position: 10,
    rounds: {
      1: { strokes: roundOne, toPar: roundOne - 70, holes: 18, status: "complete" },
      2: { strokes: null, toPar: roundTwoToPar, holes: status === "playing" ? 9 : 0, status },
      3: { strokes: null, toPar: null, holes: 0, status: "not_started" }
    }
  };
}

test("best two projected rounds count each day", () => {
  const players = [
    player("One", 68, -1),
    player("Two", 70, -3),
    player("Three", 67, 2),
    player("Four", 72, 0)
  ];
  const result = scoreTeam(players.map((item) => item.name), players, 2, 70);
  assert.equal(result.rounds[0].total, 135);
  assert.equal(result.rounds[1].total, 136);
  assert.equal(result.total, 271);
});

test("not-started golfers project to par only in the current round", () => {
  const round = { strokes: null, toPar: null, holes: 0, status: "not_started" };
  assert.equal(projectedRoundScore(round, 2, 2, 70), 70);
  assert.equal(projectedRoundScore(round, 3, 2, 70), null);
});

test("future placeholder rounds never create phantom scores", () => {
  const players = ["A", "B", "C", "D"].map((name) => player(name, 70, 0));
  const result = scoreTeam(["A", "B", "C", "D"], players, 2, 70);
  assert.equal(result.rounds[2].total, null);
  assert.equal(result.rounds[3].total, null);
});

test("Nordic characters normalize consistently", () => {
  assert.equal(normalizeName("Nicolai Højgaard"), normalizeName("Nicolai Hojgaard"));
});

test("name aliases cover weekly pick spelling variations", () => {
  assert.equal(normalizeName("Rober MacIntyre"), normalizeName("Robert MacIntyre"));
  assert.equal(normalizeName("Tyrell Hatton"), normalizeName("Tyrrell Hatton"));
  assert.equal(normalizeName("Ludvig Åberg"), normalizeName("Ludvig Aberg"));
  assert.equal(normalizeName("David Thompson"), normalizeName("Davis Thompson"));
  assert.equal(normalizeName("Hideki Matsuyanma"), normalizeName("Hideki Matsuyama"));
  assert.equal(normalizeName("Tom Kin"), normalizeName("Tom Kim"));
  assert.equal(normalizeName("Suber"), normalizeName("Jackson Suber"));
  assert.equal(normalizeName("Coody"), normalizeName("Pierceson Coody"));
  assert.equal(normalizeName("Knapp"), normalizeName("Jake Knapp"));
  assert.equal(normalizeName("Meissner"), normalizeName("Mac Meissner"));
  assert.equal(normalizeName("Stevens"), normalizeName("Sam Stevens"));
  assert.equal(normalizeName("Homa"), normalizeName("Max Homa"));
  assert.equal(normalizeName("Gotterup"), normalizeName("Chris Gotterup"));
  assert.equal(normalizeName("Xander"), normalizeName("Xander Schauffele"));
  assert.equal(normalizeName("Henley"), normalizeName("Russell Henley"));
  assert.equal(normalizeName("Cam Young"), normalizeName("Cameron Young"));
  assert.equal(normalizeName("Hideki"), normalizeName("Hideki Matsuyama"));
  assert.equal(normalizeName("Spieth"), normalizeName("Jordan Spieth"));
  assert.equal(normalizeName("Gerard"), normalizeName("Ryan Gerard"));
  assert.equal(normalizeName("Bridgeman"), normalizeName("Jacob Bridgeman"));
  assert.equal(normalizeName("Griffin"), normalizeName("Ben Griffin"));
});

test("Rocket Classic picks produce both team scores", () => {
  const names = [
    "Chris Gotterup", "Xander Schauffele", "Russell Henley", "Si Woo Kim", "Jacob Bridgeman", "Ryan Gerard",
    "Cameron Young", "Jackson Koivun", "Hideki Matsuyama", "Jordan Spieth", "Ben Griffin", "Jake Knapp"
  ];
  const payload = {
    event: { slug: "rocket-classic", currentRound: 2, par: 70 },
    players: names.map((name, index) => ({ ...player(name, 68 + (index % 4), index % 3), position: index + 1 }))
  };
  const result = scoreGame(payload, getTournament("rocket-classic"));
  assert.ok(Number.isFinite(result.Sean.total));
  assert.ok(Number.isFinite(result.Zach.total));
  assert.equal(result.altRows.length, 2);
  assert.equal(result.bestBallRows.length, 2);
});
