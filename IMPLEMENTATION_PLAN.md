# Implementation Plan - Pickleball Team Competition App

# Goal Description
Build a mobile-friendly web app for a pickleball team competition (Team A vs Team B) with real-time scoring, roster management, and complex scheduling rules (gender balancing, rest constraints).

## User Review Required
> [!IMPORTANT]
> **Scheduling Algorithm**: The system will auto-generate game types based on the pattern **WD -> MD -> XD -> WD -> XD** to ensure 6F:4M balance and no consecutive WDs.

> [!CAUTION]
> **Authentication**: We are using **Shared Passwords** (Admin, Captain A, Captain B) for simplicity. This provides low security but high convenience for a friendly tournament.

## Proposed Changes

### Tech Stack Setup
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / Shadcn UI (for polished mobile components)
- **Database**: Supabase (PostgreSQL)
- **State/Realtime**: Supabase Realtime Subscriptions

### Database Schema (Supabase)
#### [NEW] `supabase/schema.sql`
- `teams`: id, name, color
- `players`: id, name, gender, team_id
- `games`: id, sequence_number, time_slot, court, game_type (MD/WD/XD), status, score_a, score_b
- `game_rosters`: game_id, team_id, player_1_id, player_2_id

### Frontend Implementation
#### [NEW] `components/`
- `GameCard`: Shows status, players (or selection slots), and score input.
- `RosterSelect`: Modal for Captains to pick players with "Rest" validation logic.
- `Dashboard`: Shows big "Team Wins" counters and smaller "Total Points" stats.

#### [NEW] `app/`
- `layout.tsx`: Main layout with simple nav.
- `page.tsx`: Public view (Dashboard + Match List).
- `admin/page.tsx`: Admin dashboard (Reset games, Edit scores).
- `captain/page.tsx`: Captain view (Select players).
- `login/page.tsx`: Shared password entry.

### Logic & Utilities
#### [NEW] `lib/`
- `scheduling.ts`: Helper to generate the 28-game schedule with the **WD-MD-XD-WD-XD** pattern.
- `validation.ts`:
    - `isPlayerResting(playerId, gameHistory)`: Checks the resting rule. Default is **2 games gap** (cannot play if played in last 3 games). **EXCEPTION**: If any player is Inactive, rule relaxes to **0 games gap** (cannot play consecutive games only).
    - `isValidGenderForGameType(player, gameType)`: Enforces MD/WD/XD gender rules.

## Verification Plan

### Automated Tests
- **Unit Tests**: Test `scheduling.ts` to confirm the generated sequence matches the ratio and avoids consecutive WDs.
- **Unit Tests**: Test `validation.ts` with mock history to ensure a player is correctly flagged as "Resting" if they played in the last 3 games.

### Manual Verification
- **Browser Output**:
    - **Admin Flow**: Login, Generate Schedule, Start Game, Enter Score.
    - **Captain Flow**: Login, Try to select a player who played recently (expect blocked), Select valid players (expect success).
    - **Realtime**: Open two windows (Admin & Public). Update score in Admin, verify instant update in Public window.
