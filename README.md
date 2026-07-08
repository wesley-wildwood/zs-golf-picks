# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app with the Scottish Open / ISCO toggle
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current tournaments

**Genesis Scottish Open**

- Sean starters: Rory McIlroy, Tommy Fleetwood, Matthew Fitzpatrick, Ludvig Aberg
- Sean alt: Wyndham Clark
- Sean Best Ball: Tyrrell Hatton
- Zach starters: Scottie Scheffler, Xander Schauffele, Chris Gotterup, Robert MacIntyre
- Zach alt: Viktor Hovland
- Zach Best Ball: Justin Thomas

**ISCO Championship**

- Sean starters: Davis Thompson, Stephan Jaeger, Christiaan Bezuidenhout, Beau Hossler
- Sean alt: Lee Hodges
- Sean Best Ball: Tom Hoge
- Zach starters: Max Homa, Jackson Koivun, Ben Kohles, Denny McCarthy
- Zach alt: Neal Shipley
- Zach Best Ball: Taylor Pendrith

## Updating Future Weeks

Edit `public/scoring.js`:

1. Add or replace a tournament in `TOURNAMENTS`.
2. Set the ESPN `eventId`, event name, venue, par, and picks.
3. Add simple spelling aliases in `NAME_ALIASES` if a pick may differ from ESPN's spelling.

## Local check

```bash
npm test
npm run dev
```

Open `http://127.0.0.1:3000`.
