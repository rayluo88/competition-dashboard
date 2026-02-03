export type TeamID = string;
export type PlayerID = string;
export type GameID = string;

export type Gender = 'Male' | 'Female';
export type GameType = 'MD' | 'WD' | 'XD';
export type GameStatus = 'scheduled' | 'active' | 'completed';

export interface Team {
    id: TeamID;
    name: string;
    color: string;
}

export interface Player {
    id: PlayerID;
    name: string;
    gender: Gender;
    team_id: TeamID;
    active?: boolean;
}

export interface Game {
    id: GameID;
    sequence_number: number;
    time_slot: string;
    court_number: number;
    game_type: GameType;
    status: GameStatus;
    score_a: number;
    score_b: number;
}

export interface GameRoster {
    id: string;
    game_id: GameID;
    team_id: TeamID;
    player_1_id: PlayerID | null;
    player_2_id: PlayerID | null;
}
