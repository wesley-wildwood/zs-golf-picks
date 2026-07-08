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
});

test("Scottish Open picks produce both team scores", () => {
  const names = [
    "Rory McIlroy", "Tommy Fleetwood", "Matt Fitzpatrick", "Ludvig Åberg", "Wyndham Clark", "Tyrrell Hatton",
    "Scottie Scheffler", "Xander Schauffele", "Chris Gotterup", "Robert MacIntyre", "Viktor Hovland", "Justin Thomas"
  ];
  const payload = {
    event: { slug: "scottish-open", currentRound: 2, par: 70 },
    players: names.map((name, index) => ({ ...player(name, 68 + (index % 4), index % 3), position: index + 1 }))
  };
  const result = scoreGame(payload, getTournament("scottish-open"));
  assert.ok(Number.isFinite(result.Sean.total));
  assert.ok(Number.isFinite(result.Zach.total));
  assert.equal(result.altRows.length, 2);
  assert.equal(result.bestBallRows.length, 2);
});

test("ISCO Championship picks produce both team scores", () => {
  const names = [
    "Davis Thompson", "Stephan Jaeger", "Christiaan Bezuidenhout", "Beau Hossler", "Lee Hodges", "Tom Hoge",
    "Max Homa", "Jackson Koivun", "Ben Kohles", "Denny McCarthy", "Neal Shipley", "Taylor Pendrith"
  ];
  const payload = {
    event: { slug: "isco-championship", currentRound: 2, par: 72 },
    players: names.map((name, index) => ({ ...player(name, 70 + (index % 4), index % 3), position: index + 1 }))
  };
  const result = scoreGame(payload, getTournament("isco-championship"));
  assert.ok(Number.isFinite(result.Sean.total));
  assert.ok(Number.isFinite(result.Zach.total));
  assert.equal(result.altRows.length, 2);
  assert.equal(result.bestBallRows.length, 2);
});
