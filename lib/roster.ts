import { Player, Team } from "@/app/types";

// Valid UUIDs for Teams
export const TEAM_A_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
export const TEAM_B_ID = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';

export const TEAMS: Team[] = [
    { id: TEAM_A_ID, name: 'Team A', color: 'red' },
    { id: TEAM_B_ID, name: 'Team B', color: 'blue' }
];

// 6 Females, 4 Males per team
export const SEED_PLAYERS: Partial<Player>[] = [
    // Team A
    { name: 'Alice (A)', gender: 'Female', team_id: TEAM_A_ID },
    { name: 'Amy (A)', gender: 'Female', team_id: TEAM_A_ID },
    { name: 'Anna (A)', gender: 'Female', team_id: TEAM_A_ID },
    { name: 'Audrey (A)', gender: 'Female', team_id: TEAM_A_ID },
    { name: 'Amanda (A)', gender: 'Female', team_id: TEAM_A_ID },
    { name: 'Abby (A)', gender: 'Female', team_id: TEAM_A_ID },
    { name: 'Adam (A)', gender: 'Male', team_id: TEAM_A_ID },
    { name: 'Alex (A)', gender: 'Male', team_id: TEAM_A_ID },
    { name: 'Aaron (A)', gender: 'Male', team_id: TEAM_A_ID },
    { name: 'Arthur (A)', gender: 'Male', team_id: TEAM_A_ID },

    // Team B
    { name: 'Bella (B)', gender: 'Female', team_id: TEAM_B_ID },
    { name: 'Beth (B)', gender: 'Female', team_id: TEAM_B_ID },
    { name: 'Bianca (B)', gender: 'Female', team_id: TEAM_B_ID },
    { name: 'Bonnie (B)', gender: 'Female', team_id: TEAM_B_ID },
    { name: 'Brenda (B)', gender: 'Female', team_id: TEAM_B_ID },
    { name: 'Becky (B)', gender: 'Female', team_id: TEAM_B_ID },
    { name: 'Bob (B)', gender: 'Male', team_id: TEAM_B_ID },
    { name: 'Bill (B)', gender: 'Male', team_id: TEAM_B_ID },
    { name: 'Ben (B)', gender: 'Male', team_id: TEAM_B_ID },
    { name: 'Bruce (B)', gender: 'Male', team_id: TEAM_B_ID },
];
