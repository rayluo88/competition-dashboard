import { Player, Team } from "@/app/types";

export const TEAMS: Team[] = [
    { id: 'team_a', name: 'Team A', color: 'red' },
    { id: 'team_b', name: 'Team B', color: 'blue' }
];

// 6 Females, 4 Males per team
export const SEED_PLAYERS: Partial<Player>[] = [
    // Team A
    { name: 'Alice (A)', gender: 'Female', team_id: 'team_a' },
    { name: 'Amy (A)', gender: 'Female', team_id: 'team_a' },
    { name: 'Anna (A)', gender: 'Female', team_id: 'team_a' },
    { name: 'Audrey (A)', gender: 'Female', team_id: 'team_a' },
    { name: 'Amanda (A)', gender: 'Female', team_id: 'team_a' },
    { name: 'Abby (A)', gender: 'Female', team_id: 'team_a' },
    { name: 'Adam (A)', gender: 'Male', team_id: 'team_a' },
    { name: "Alex (A)", gender: 'Male', team_id: 'team_a' },
    { name: 'Aaron (A)', gender: 'Male', team_id: 'team_a' },
    { name: 'Arthur (A)', gender: 'Male', team_id: 'team_a' },

    // Team B
    { name: 'Bella (B)', gender: 'Female', team_id: 'team_b' },
    { name: 'Beth (B)', gender: 'Female', team_id: 'team_b' },
    { name: 'Bianca (B)', gender: 'Female', team_id: 'team_b' },
    { name: 'Bonnie (B)', gender: 'Female', team_id: 'team_b' },
    { name: 'Brenda (B)', gender: 'Female', team_id: 'team_b' },
    { name: 'Becky (B)', gender: 'Female', team_id: 'team_b' },
    { name: 'Bob (B)', gender: 'Male', team_id: 'team_b' },
    { name: 'Bill (B)', gender: 'Male', team_id: 'team_b' },
    { name: 'Ben (B)', gender: 'Male', team_id: 'team_b' },
    { name: 'Bruce (B)', gender: 'Male', team_id: 'team_b' },
];
