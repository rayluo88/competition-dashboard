-- Create Teams table
CREATE TABLE teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL -- e.g., 'red', 'blue'
);

-- Create Players table
CREATE TABLE players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE
);

-- Create Games table
CREATE TABLE games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_number INTEGER NOT NULL, -- 1 to 28
    time_slot TEXT NOT NULL, -- e.g., "10:00 AM"
    court_number INTEGER NOT NULL, -- 1 or 2
    game_type TEXT NOT NULL CHECK (game_type IN ('MD', 'WD', 'XD')),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed')),
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Game Rosters table (linking players to games)
CREATE TABLE game_rosters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    player_1_id UUID REFERENCES players(id),
    player_2_id UUID REFERENCES players(id),
    UNIQUE(game_id, team_id) -- One entry per team per game
);

-- Enable Realtime
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table game_rosters;
