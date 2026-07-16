# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's Open Championship leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**The Open**

- Event ID: `401811957`
- Venue: Royal Birkdale Golf Club, Southport, England
- Par: 70

## Picks

- Sean starters: Scottie Scheffler, Matthew Fitzpatrick, Xander Schauffele, Viktor Hovland
- Sean alt: Wyndham Clark
- Sean Best Ball: Justin Rose
- Zach starters: Rory McIlroy, Tommy Fleetwood, Chris Gotterup, Jordan Spieth
- Zach alt: Jon Rahm
- Zach Best Ball: Patrick Reed

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
