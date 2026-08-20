# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's BMW Championship leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**BMW Championship**

- Event ID: `401811963`
- Venue: Bellerive Country Club, St. Louis, Missouri
- Par: 70

## Picks

- Sean starters: Sam Burns, Xander Schauffele, Matt Fitzpatrick, Si Woo Kim
- Sean alt: Alex Noren
- Sean Best Ball: Cameron Young
- Zach starters: Scottie Scheffler, Ludvig Aberg, Tommy Fleetwood, Chris Gotterup
- Zach alt: Justin Thomas
- Zach Best Ball: Viktor Hovland

## Updating Future Weeks

Edit `public/scoring.js`:

1. Replace the tournament in `TOURNAMENTS`.
2. Set the ESPN `eventId`, event name, venue, par, and picks.
3. Add simple spelling aliases in `NAME_ALIASES` if a pick may differ from ESPN's spelling.

## Local check

```bash
npm test
npm run dev
```

Open `http://127.0.0.1:3000`.
