# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's Wyndham Championship leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**Wyndham Championship**

- Event ID: `401811961`
- Venue: Sedgefield Country Club, Greensboro, North Carolina
- Par: 70

## Picks

- Sean starters: Jackson Koivun, Ryan Gerard, Aaron Rai, Ben Griffin
- Sean alt: Michael Kim
- Sean Best Ball: Tom Kim
- Zach starters: Cameron Young, Hideki Matsuyama, Alex Fitzpatrick, Jordan Spieth
- Zach alt: Brian Harman
- Zach Best Ball: Maverick McNealy

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
