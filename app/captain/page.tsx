'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Game, Player, GameRoster } from '@/app/types';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { isPlayerResting, isValidGenderForGameType } from '@/lib/validation';
import { TEAM_A_ID, TEAM_B_ID } from '@/lib/roster';

function CaptainContent() {
    const searchParams = useSearchParams();
    const teamLetter = searchParams.get('team') as 'A' | 'B';
    // Simple mapping
    const teamId = teamLetter === 'A' ? TEAM_A_ID : TEAM_B_ID;
    // In a real DB we'd fetch the team ID by letter or name. Assumed fixed for now.

    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [rosters, setRosters] = useState<GameRoster[]>([]);
    const [gameHistory, setGameHistory] = useState<Record<string, number[]>>({}); // PlayerID -> List of Game Sequences

    const [restWindow, setRestWindow] = useState(3);

    // Fetch Data
    useEffect(() => {
        if (!teamLetter) return;

        const fetchData = async () => {
            // 1. Get Games
            const { data: gamesData } = await supabase.from('games').select('*').order('sequence_number');
            if (gamesData) setGames(gamesData as Game[]);

            // 2. Get Players (All players to check for inactive status globally)
            const { data: allPlayers } = await supabase.from('players').select('*');
            if (allPlayers) {
                const all = allPlayers as Player[];
                // Check if ANY player is inactive
                const anyInactive = all.some(p => p.active === false);
                setRestWindow(anyInactive ? 1 : 3);

                // Filter for THIS team
                setPlayers(all.filter(p => p.team_id === teamId));
            }

            // 3. Get Existing Rosters
            const { data: rostersData } = await supabase.from('game_rosters').select('*').eq('team_id', teamId);
            if (rostersData) {
                setRosters(rostersData as GameRoster[]);

                // Build History
                const hist: Record<string, number[]> = {};
                // We need to map game_id to sequence_number to build history quickly
                const gameIdToSeq = new Map(gamesData?.map((g: any) => [g.id, g.sequence_number]));

                rostersData.forEach((r: GameRoster) => {
                    const seq = gameIdToSeq.get(r.game_id);
                    if (seq) {
                        if (r.player_1_id) {
                            if (!hist[r.player_1_id]) hist[r.player_1_id] = [];
                            hist[r.player_1_id].push(seq);
                        }
                        if (r.player_2_id) {
                            if (!hist[r.player_2_id]) hist[r.player_2_id] = [];
                            hist[r.player_2_id].push(seq);
                        }
                    }
                });
                setGameHistory(hist);
            }
        };
        fetchData();
    }, [teamLetter, teamId]);

    const handleSelectPlayer = async (gameId: string, slot: 1 | 2, playerId: string) => {
        // Check validity
        // 1. Find the game
        const game = games.find(g => g.id === gameId);
        if (!game) return;

        // 2. Find player
        const player = players.find(p => p.id === playerId);
        if (!player) return; // or empty to clear?

        // 3. Check Rest Rule
        if (isPlayerResting(game.sequence_number, gameHistory[playerId] || [], restWindow)) {
            alert(`${player.name} needs to rest (played in last ${restWindow} games).`);
            return;
        }

        // 4. Check Gender Rule
        // Need the OTHER player in this roster to check full pair validity
        const currentRoster = rosters.find(r => r.game_id === gameId) || { player_1_id: null, player_2_id: null };
        const partnerId = slot === 1 ? currentRoster.player_2_id : currentRoster.player_1_id;
        const partner = players.find(p => p.id === partnerId);

        if (!isValidGenderForGameType(player, partner || null, game.game_type)) {
            alert(`Invalid gender for ${game.game_type}.`);
            return;
        }

        // Optimistic Update? No, let's just push to DB.
        // If roster doesn't exist, insert. If exists, update.
        // Supabase Upsert on (game_id, team_id) unique key.
        const newRoster = {
            game_id: gameId,
            team_id: teamId,
            player_1_id: slot === 1 ? playerId : currentRoster.player_1_id,
            player_2_id: slot === 2 ? playerId : currentRoster.player_2_id
        };

        const { error } = await supabase.from('game_rosters').upsert(newRoster, { onConflict: 'game_id, team_id' });
        if (error) {
            alert('Error saving selection: ' + error.message);
        } else {
            window.location.reload(); // Quick refresh to update history/state
        }
    };

    return (
        <div className="pb-20 space-y-4">
            <h1 className="text-xl font-bold p-4 bg-white shadow-sm rounded-lg">Captain - Team {teamLetter}</h1>

            {games.map(game => {
                const roster = rosters.find(r => r.game_id === game.id);
                const p1 = players.find(p => p.id === roster?.player_1_id);
                const p2 = players.find(p => p.id === roster?.player_2_id);
                const locked = game.status !== 'scheduled';

                return (
                    <Card key={game.id} className={locked ? 'opacity-70 bg-slate-50' : 'bg-white'}>
                        <div className="bg-slate-100 p-2 text-xs flex justify-between font-mono text-slate-500">
                            <span>Match #{game.sequence_number} | {game.time_slot}</span>
                            <span className="font-bold">{game.game_type}</span>
                        </div>
                        <CardContent className="p-4 flex gap-4 items-center">
                            <select
                                disabled={locked}
                                className="flex-1 p-2 border rounded text-sm bg-white disabled:bg-slate-100"
                                value={p1?.id || ''}
                                onChange={(e) => handleSelectPlayer(game.id, 1, e.target.value)}
                            >
                                <option value="">Select Player 1 {game.game_type === 'XD' ? '(Female)' : ''}</option>
                                {players
                                    .filter(p => p.active !== false)
                                    .filter(p => {
                                        if (game.game_type === 'WD') return p.gender === 'Female';
                                        if (game.game_type === 'MD') return p.gender === 'Male';
                                        if (game.game_type === 'XD') return p.gender === 'Female'; // Slot 1 for XD is Female
                                        return true;
                                    })
                                    .map(p => (
                                        <option key={p.id} value={p.id} disabled={isPlayerResting(game.sequence_number, gameHistory[p.id] || [], restWindow)}>
                                            {p.name} {isPlayerResting(game.sequence_number, gameHistory[p.id] || [], restWindow) ? `(Resting ${restWindow})` : ''}
                                        </option>
                                    ))}
                            </select>

                            <select
                                disabled={locked}
                                className="flex-1 p-2 border rounded text-sm bg-white disabled:bg-slate-100"
                                value={p2?.id || ''}
                                onChange={(e) => handleSelectPlayer(game.id, 2, e.target.value)}
                            >
                                <option value="">Select Player 2 {game.game_type === 'XD' ? '(Male)' : ''}</option>
                                {players
                                    .filter(p => p.active !== false)
                                    .filter(p => {
                                        if (game.game_type === 'WD') return p.gender === 'Female';
                                        if (game.game_type === 'MD') return p.gender === 'Male';
                                        if (game.game_type === 'XD') return p.gender === 'Male'; // Slot 2 for XD is Male
                                        return true;
                                    })
                                    .map(p => (
                                        <option key={p.id} value={p.id} disabled={p.id === p1?.id || isPlayerResting(game.sequence_number, gameHistory[p.id] || [], restWindow)}>
                                            {p.name} {isPlayerResting(game.sequence_number, gameHistory[p.id] || [], restWindow) ? `(Resting ${restWindow})` : ''}
                                        </option>
                                    ))}
                            </select>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default function CaptainPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CaptainContent />
        </Suspense>
    );
}
