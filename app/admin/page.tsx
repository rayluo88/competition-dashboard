'use client';

import React, { useEffect, useState } from 'react';
import { Game } from '@/app/types';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { generateSchedule } from '@/lib/scheduling';
import { Card, CardContent } from '@/components/ui/card';
import { SEED_PLAYERS, TEAMS } from '@/lib/roster';

// Utils to upsert games to Supabase
async function seedSchedule() {
    const confirmation = confirm("This will wipe existing games and start fresh. Are you sure?");
    if (!confirmation) return;

    const schedule = generateSchedule();

    // Clean existing
    await supabase.from('games').delete().neq('sequence_number', -1);

    const { error } = await supabase.from('games').insert(schedule.map(s => ({
        sequence_number: s.sequenceNumber,
        time_slot: s.timeSlot,
        court_number: s.courtNumber,
        game_type: s.gameType,
        status: 'scheduled',
        score_a: 0,
        score_b: 0
    })));

    if (error) alert('Error creating schedule: ' + error.message);
    else window.location.reload();
}

async function seedPlayers() {
    const confirmation = confirm("This will reset all players to the default roster. Are you sure?");
    if (!confirmation) return;

    await supabase.from('teams').upsert(TEAMS);
    await supabase.from('players').delete().neq('name', 'XXX');
    const { error } = await supabase.from('players').insert(SEED_PLAYERS);

    if (error) alert('Error seeding players: ' + error.message);
    else alert('Players seeded successfully!');
}

import PlayerManager from '@/components/admin/PlayerManager';

export default function AdminPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [view, setView] = useState<'schedule' | 'players'>('schedule');

    useEffect(() => {
        const fetchGames = async () => {
            const { data } = await supabase.from('games').select('*').order('sequence_number');
            if (data) setGames(data as Game[]);
        };
        fetchGames();

        const channel = supabase.channel('admin:games')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => fetchGames())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const updateScore = async (gameId: string, team: 'a' | 'b', val: number) => {
        const field = team === 'a' ? 'score_a' : 'score_b';
        await supabase.from('games').update({ [field]: val }).eq('id', gameId);
    };

    const updateStatus = async (gameId: string, status: string) => {
        await supabase.from('games').update({ status }).eq('id', gameId);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <div className="space-x-2">
                        <div className="flex bg-slate-100 p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => setView('schedule')}
                                className={`px-3 py-1 text-sm rounded-md transition ${view === 'schedule' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Schedule
                            </button>
                            <button
                                onClick={() => setView('players')}
                                className={`px-3 py-1 text-sm rounded-md transition ${view === 'players' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Players
                            </button>
                        </div>
                    </div>
                </div>

                {view === 'schedule' && (
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={seedPlayers}>Seed Players</Button>
                        <Button variant="destructive" size="sm" onClick={seedSchedule}>Reset Schedule</Button>
                    </div>
                )}
            </div>

            {view === 'players' ? (
                <PlayerManager />
            ) : (
                <div className="space-y-4">
                    {games.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            No games found. Click "Reset / Init Schedule" to generate.
                        </div>
                    )}

                    {games.map(game => (
                        <Card key={game.id} className="overflow-hidden">
                            <div className="bg-slate-100 p-2 text-xs flex justify-between font-mono text-slate-500">
                                <span>Match #{game.sequence_number} | {game.time_slot}</span>
                                <span className="font-bold uppercase text-slate-900">{game.game_type}</span>
                            </div>
                            <CardContent className="p-4 flex flex-col gap-4">
                                {/* Status Toggle */}
                                <div className="flex justify-center gap-2">
                                    {['scheduled', 'active', 'completed'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus(game.id, s)}
                                            className={`px-2 py-1 text-xs rounded border capitalize ${game.status === s ? 'bg-slate-900 text-white' : 'bg-white'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                {/* Score Inputs */}
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex flex-col items-center gap-1 w-20">
                                        <span className="font-bold text-sm">Team A</span>
                                        <input
                                            type="number"
                                            className="w-16 p-2 text-center border rounded text-2xl font-mono"
                                            value={game.score_a}
                                            onChange={(e) => updateScore(game.id, 'a', parseInt(e.target.value) || 0)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>

                                    <div className="text-slate-300">vs</div>

                                    <div className="flex flex-col items-center gap-1 w-20">
                                        <span className="font-bold text-sm">Team B</span>
                                        <input
                                            type="number"
                                            className="w-16 p-2 text-center border rounded text-2xl font-mono"
                                            value={game.score_b}
                                            onChange={(e) => updateScore(game.id, 'b', parseInt(e.target.value) || 0)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
