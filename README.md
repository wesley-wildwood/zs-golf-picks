# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's 3M Open leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**3M Open**

- Event ID: `401811959`
- Venue: TPC Twin Cities, Blaine, Minnesota
- Par: 71

## Picks

- Sean starters: Hideki Matsuyama, Tom Kim, Kurt Kitayama, Jackson Suber
- Sean alt: Mac Meissner
- Sean Best Ball: Jake Knapp
- Zach starters: Scottie Scheffler, Maverick McNealy, Pierceson Coody, Jackson Koivun
- Zach alt: Max Homa
- Zach Best Ball: Sam Stevens

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
