# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's TOUR Championship leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**TOUR Championship**

- Event ID: `401811964`
- Venue: East Lake Golf Club, Atlanta, Georgia
- Par: 70

## Picks

- Sean starters: Sam Burns, Matt Fitzpatrick, Si Woo Kim, Chris Gotterup
- Sean alt: Collin Morikawa
- Sean Best Ball: Ludvig Aberg
- Zach starters: Scottie Scheffler, Rory McIlroy, Tom Kim, Ryan Fox
- Zach alt: Viktor Hovland
- Zach Best Ball: Justin Rose

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
