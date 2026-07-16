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
      id: "401811957",
      name: "The Open",
      date: "2026-07-16T04:00Z",
      endDate: "2026-07-19T04:00Z",
      competitions: [{
        competitors: [{
          id: "10140",
          order: 2,
          score: "-3",
          athlete: { displayName: "Scottie Scheffler", shortName: "S. Scheffler" },
          linescores: [
            { period: 1, value: 71, displayValue: "+1", linescores: Array.from({ length: 18 }, () => ({ value: 4 })) },
            { period: 2, value: 32, displayValue: "-4", linescores: Array.from({ length: 9 }, () => ({ value: 4 })) }
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
    await scoresHandler({ method: "GET", url: "/api/scores?tournament=the-open", headers: { host: "example.test" } }, response);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(statusCode, 200);
  assert.ok(fetchedUrl.includes("event=401811957"));
  assert.equal(body.event.id, "401811957");
  assert.equal(body.event.slug, "the-open");
  assert.equal(body.event.currentRound, 2);
  assert.equal(body.players[0].name, "Scottie Scheffler");
  assert.equal(body.players[0].rounds[2].status, "playing");
  assert.equal(body.snapshotSaved, false);
});
