# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's Rocket Classic leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**Rocket Classic**

- Event ID: `401811960`
- Venue: Detroit Golf Club, Detroit, Michigan
- Par: 70

## Picks

- Sean starters: Chris Gotterup, Xander Schauffele, Russell Henley, Si Woo Kim
- Sean alt: Jacob Bridgeman
- Sean Best Ball: Ryan Gerard
- Zach starters: Cameron Young, Jackson Koivun, Hideki Matsuyama, Jordan Spieth
- Zach alt: Ben Griffin
- Zach Best Ball: Jake Knapp

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
