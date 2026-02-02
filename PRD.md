# Product Requirements Document (PRD) - Pickleball Team Competition App

## 1. Overview
A mobile-friendly web application to manage a friendly team pickleball competition between 2 teams. The app handles scheduling, scoring, and roster management with specific constraints to ensure fair play and equal participation.

## 2. User Roles & Authentication

| Role | Authentication | Capabilities |
| :--- | :--- | :--- |
| **Admin** | Shared Password | Setup games, edit scores, override schedules, manage master roster. |
| **Captain (Team A)** | Shared Password | Select players for upcoming games (Next or Rest). Cannot change finished games. |
| **Captain (Team B)** | Shared Password | Same as Captain A. |
| **Public / Player** | No Login Required | View schedule, live scores, and team Rosters. |

## 3. Core Features

### 3.1. Tournament Setup (Admin)
*   **Roster Management**:
    *   2 Teams (e.g., Team A, Team B).
    *   **Composition**: 10 Players per team (6 Female, 4 Male).
    *   Storage: Name, Gender, Team ID.
*   **Player Database Management**:
    *   **CRUD Operations**: Admin can Create, Read, Update, and Delete players.
    *   **Input Fields**: Name, Gender (M/F), Team (A/B).
    *   **Validation**: Ensure Name is not empty.
*   **Schedule Generation**:
    *   **Timeframe**: 10:00 AM to 1:30 PM (3.5 Hours).
    *   **Interval**: 15 minutes per slot. Total 14 Time Slots.
    *   **Concurrency**: 2 Games played simultaneously per slot. Total 28 Games.
    *   **Game Type Balancing**:
        *   Objective: Ensure "even chance to play" relative to gender ratio (6F:4M).
        *   **Algorithm**: The schedule will assign game types to match the roster distribution of 6 Females to 4 Males.
        *   *Cycle (Every 5 Games)*: **2 WD, 2 XD, 1 MD**.
        *   *Ordering Constraint*: **No consecutive WD games**.
        *   *Proposed Sequence*: **WD -> MD -> XD -> WD -> XD**.
            *   2 WD = 4 Female spots.
            *   2 XD = 2 Female spots + 2 Male spots.
            *   1 MD = 2 Male spots.
            *   **Total**: 6 Female spots, 4 Male spots. (Perfect Match, No Back-to-Back WD).

### 3.2. Captain's Dashboard (Active Game Management)
*   **Upcoming Games View**: List of games sorted by time.
*   **Player Selection**:
    *   Captain assigns 2 players for their team for a specific game.
    *   **Validation Check 1 (Gender)**: Must match game type (WD=2F, MD=2M, XD=1M+1F).
    *   **Validation Check 2 (Rest Rule)**:
        *   Constraint: A player cannot be selected if they played in any of the **previous 3 games**.
        *   *Definition*: "Games" refers to the sequential game ID (1 to 28), not just time slots.
        *   *Failure State*: UI disables invalid players with a "Resting" indicator.
*   **Lockout**: Captains cannot edit players for games marked as "Completed" or "In Progress" (optional buffer).

### 3.3. Admin & Scoring
*   **Live Scoring**: Admin enters result (e.g., Team A: 11 - Team B: 9).
*   **Leaderboard**: Real-time tally of Total Wins per Team.
*   **Correction**: Admin can edit rosters for past games if a mistake was made (audit log optional).

### 3.4. Public View
*   Mobile-first responsive design.
*   Shows "Now Playing", "Upcoming", and "Results".
*   Team Standings.

## 4. Technical Architecture

### 4.1. Stack
*   **Frontend**: Next.js (App Router), Tailwind CSS, Lucide React (Icons).
*   **Backend/DB**: Supabase (PostgreSQL + Realtime Subscriptions).
*   **Hosting**: Vercel.

### 4.2. Schema Design (Draft)
*   `players`: id, name, team_id, gender
*   `games`: id, time_slot, court_number (1 or 2), game_type (MD/WD/XD), status (scheduled/active/finished), score_a, score_b
*   `game_rosters`: game_id, team_id, player_1_id, player_2_id

## 5. Mobile UX Requirements
*   **Big Buttons**: Easy to tap on phone screens outdoors.
*   **High Contrast**: Visible in sunlight.
*   **No Paging**: Infinite scroll or simple tabs for Schedule/Scores.
