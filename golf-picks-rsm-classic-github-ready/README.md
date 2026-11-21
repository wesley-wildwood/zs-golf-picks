# Golf Picks Live

Deployment-ready leaderboard for Sean and Zach's weekly Golf Picks game.

- `public/`: browser app for this week's RSM Classic leaderboard
- `api/scores.js`: Vercel live-score function
- `supabase/migrations/001_initial.sql`: score snapshot database
- `tests/`: scoring-rule and API checks
- `DEPLOYMENT.md`: complete GitHub, Supabase, and Vercel instructions

## Current Tournament

**The RSM Classic**

- Event ID: `401850981`
- Venue: Sea Island Golf Club, St. Simons Island, Georgia
- Par: 70
- Main-game scoring: best two scores in rounds 2 through 4 only
- Alternates: disabled this week

## Picks

- Sean starters: Keith Mitchell, Sami Valimaki, Sepp Straka, Rasmus Hojgaard
- Sean Best Ball: Chris Kirk
- Zach starters: Michael Thorbjornsen, Maverick McNealy, Max Greyserman, Jackson Koivun
- Zach Best Ball: Garrick Higgo

## Updating Future Weeks

Edit `public/scoring.js`:

1. Replace the tournament in `TOURNAMENTS`.
2. Set the ESPN `eventId`, event name, venue, par, and picks.
3. Set `scoringRounds` and `hasAlternates` for any week-specific rule changes.
4. Add simple spelling aliases in `NAME_ALIASES` if a pick may differ from ESPN's spelling.

## Local check

```bash
npm test
npm run dev
```

Open `http://127.0.0.1:3000`.
