# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's FedEx St. Jude Championship leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**FedEx St. Jude Championship**

- Event ID: `401811962`
- Venue: TPC Southwind, Memphis, Tennessee
- Par: 70

## Picks

- Sean starters: Cameron Young, Matthew Fitzpatrick, Rory McIlroy, Hideki Matsuyama
- Sean alt: Collin Morikawa
- Sean Best Ball: Tom Kim
- Zach starters: Scottie Scheffler, Xander Schauffele, Sam Burns, Jordan Spieth
- Zach alt: Tommy Fleetwood
- Zach Best Ball: Chris Gotterup

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
