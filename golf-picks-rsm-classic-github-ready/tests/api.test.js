import test from "node:test";
import assert from "node:assert/strict";
import scoresHandler from "../api/scores.js";

test("scores API shapes the live feed for the browser", async () => {
  const originalFetch = globalThis.fetch;
  let fetchedUrl = "";
  globalThis.fetch = async (url) => {
    fetchedUrl = String(url);
    return new Response(JSON.stringify({
    events: [{
      id: "401850981",
      name: "The RSM Classic",
      date: "2026-11-19T05:00Z",
      endDate: "2026-11-23T05:00Z",
      competitions: [{
        competitors: [{
          id: "4425904",
          order: 3,
          score: "-9",
          athlete: { displayName: "Michael Thorbjornsen", shortName: "M. Thorbjornsen" },
          linescores: [
            { period: 1, value: 64, displayValue: "-6", linescores: Array.from({ length: 18 }, () => ({ value: 4 })) },
            { period: 2, value: 69, displayValue: "-3", linescores: Array.from({ length: 18 }, () => ({ value: 4 })) },
            { period: 3, value: 33, displayValue: "-2", linescores: Array.from({ length: 9 }, () => ({ value: 4 })) }
          ]
        }, {
          id: "8961",
          order: 93,
          score: "E",
          athlete: { displayName: "Sepp Straka", shortName: "S. Straka" },
          linescores: [
            { period: 1, value: 66, displayValue: "-4", linescores: Array.from({ length: 18 }, () => ({ value: 4 })) },
            { period: 2, value: 76, displayValue: "+4", linescores: Array.from({ length: 18 }, () => ({ value: 4 })) }
          ]
        }]
      }]
    }]
  }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  let statusCode = 200;
  let body;
  const response = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; }
  };

  try {
    await scoresHandler({ method: "GET", url: "/api/scores?tournament=rsm-classic", headers: { host: "example.test" } }, response);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(statusCode, 200);
  assert.ok(fetchedUrl.includes("event=401850981"));
  assert.equal(body.event.id, "401850981");
  assert.equal(body.event.slug, "rsm-classic");
  assert.equal(body.event.currentRound, 3);
  assert.equal(body.players[0].name, "Michael Thorbjornsen");
  assert.equal(body.players[0].missedCut, false);
  assert.equal(body.players[0].rounds[3].status, "playing");
  assert.equal(body.players[1].name, "Sepp Straka");
  assert.equal(body.players[1].missedCut, true);
  assert.equal(body.players[1].rounds[3].status, "not_started");
  assert.equal(body.snapshotSaved, false);
});
