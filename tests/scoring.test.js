import test from "node:test";
import assert from "node:assert/strict";
import { getTournament, normalizeName, projectedRoundScore, scoreGame, scoreGolfer, scoreTeam } from "../public/scoring.js";

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
  assert.equal(result.toPar, -9);
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

test("missed-cut golfers render as missed cut instead of not started", () => {
  const result = scoreGolfer({
    id: "sepp-straka",
    name: "Sepp Straka",
    missedCut: true,
    tournamentToPar: 0,
    position: null,
    rounds: {
      1: { strokes: 66, toPar: -4, holes: 18, status: "complete" },
      2: { strokes: 76, toPar: 4, holes: 18, status: "complete" },
      3: { strokes: null, toPar: null, holes: 0, status: "not_started" }
    }
  }, 3, 70);

  assert.equal(result.status, "missed_cut");
  assert.equal(result.rounds[2], null);
  assert.equal(result.total, 142);
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
  assert.equal(normalizeName("Hideki Matzuyama"), normalizeName("Hideki Matsuyama"));
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
  assert.equal(normalizeName("Rai"), normalizeName("Aaron Rai"));
  assert.equal(normalizeName("Fitzpatrick"), normalizeName("Matt Fitzpatrick"));
  assert.equal(normalizeName("Matthew Fitzpatrick"), normalizeName("Matt Fitzpatrick"));
  assert.equal(normalizeName("Maverick"), normalizeName("Maverick McNealy"));
  assert.equal(normalizeName("Harman"), normalizeName("Brian Harman"));
  assert.equal(normalizeName("Morikawa"), normalizeName("Collin Morikawa"));
  assert.equal(normalizeName("Fleetwood"), normalizeName("Tommy Fleetwood"));
  assert.equal(normalizeName("Si Woo"), normalizeName("Si Woo Kim"));
  assert.equal(normalizeName("Noren"), normalizeName("Alex Noren"));
  assert.equal(normalizeName("Hovland"), normalizeName("Viktor Hovland"));
  assert.equal(normalizeName("JT"), normalizeName("Justin Thomas"));
  assert.equal(normalizeName("Ludvig"), normalizeName("Ludvig Aberg"));
  assert.equal(normalizeName("Fox"), normalizeName("Ryan Fox"));
  assert.equal(normalizeName("Rose"), normalizeName("Justin Rose"));
  assert.equal(normalizeName("Keith"), normalizeName("Keith Mitchell"));
  assert.equal(normalizeName("Sami Välimäki"), normalizeName("Sami Valimaki"));
  assert.equal(normalizeName("Straka"), normalizeName("Sepp Straka"));
  assert.equal(normalizeName("Rasmus"), normalizeName("Rasmus Højgaard"));
  assert.equal(normalizeName("Thorbs"), normalizeName("Michael Thorbjornsen"));
  assert.equal(normalizeName("Greyserman"), normalizeName("Max Greyserman"));
  assert.equal(normalizeName("Kirk"), normalizeName("Chris Kirk"));
  assert.equal(normalizeName("Higgo"), normalizeName("Garrick Higgo"));
});

test("RSM Classic counts only rounds 2 through 4 and disables alternates", () => {
  const names = [
    "Keith Mitchell", "Sami Välimäki", "Sepp Straka", "Rasmus Højgaard", "Michael Thorbjornsen",
    "Maverick McNealy", "Max Greyserman", "Jackson Koivun", "Chris Kirk", "Garrick Higgo"
  ];
  const payload = {
    event: { slug: "rsm-classic", currentRound: 2, par: 70 },
    players: names.map((name, index) => ({ ...player(name, 68 + (index % 4), index % 3), position: index + 1 }))
  };
  const result = scoreGame(payload, getTournament("rsm-classic"));
  assert.equal(result.Sean.rounds[0].total, null);
  assert.equal(result.Zach.rounds[0].total, null);
  assert.equal(result.Sean.rounds[1].total, 140);
  assert.equal(result.Zach.rounds[1].total, 141);
  assert.equal(result.Sean.total, 140);
  assert.equal(result.Zach.total, 141);
  assert.equal(result.leaderText, "Sean leads by 1");
  assert.equal(result.altRows.length, 0);
  assert.equal(result.bestBallRows.length, 2);
});
