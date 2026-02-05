'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Player } from '@/app/types';
import { TEAMS } from '@/lib/roster';

export default function PlayersStatsPage() {
    const [stats, setStats] = useState<Record<string, number>>({});
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // 1. Fetch Players
            const { data: playersData } = await supabase.from('players').select('*').order('name');
            // 2. Fetch Rosters (All selections)
            const { data: rostersData } = await supabase.from('game_rosters').select('*');

            if (playersData) {
                setPlayers(playersData as Player[]);
            }

            // 3. Aggregate Counts
            const counts: Record<string, number> = {};
            if (rostersData) {
                rostersData.forEach((r: any) => {
                    // Count Player 1
                    if (r.player_1_id) {
                        counts[r.player_1_id] = (counts[r.player_1_id] || 0) + 1;
                    }
                    // Count Player 2
                    if (r.player_2_id) {
                        counts[r.player_2_id] = (counts[r.player_2_id] || 0) + 1;
                    }
                });
            }
            setStats(counts);
            setLoading(false);
        };

        fetchData();

        // Realtime Subscription for updates
        const channel = supabase.channel('players-stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'game_rosters' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const renderTeamStats = (teamId: string) => {
        const teamPlayers = players
            .filter(p => p.team_id === teamId)
            .sort((a, b) => {
                const countA = stats[a.id] || 0;
                const countB = stats[b.id] || 0;
                // Sort by Count Descending
                if (countB !== countA) return countB - countA;
                // Then by Name Ascending
                return a.name.localeCompare(b.name);
            });
        const team = TEAMS.find(t => t.id === teamId);

        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className={`p-3 text-white font-bold text-center ${team?.color === 'red' ? 'bg-red-600' : 'bg-blue-600'}`}>
                    {team?.name}
                </div>
                <div className="divide-y divide-slate-100">
                    {teamPlayers.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-3 hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${p.gender === 'Female' ? 'bg-pink-400' : 'bg-blue-400'}`} />
                                <span className={p.active === false ? 'text-slate-400 line-through' : 'font-medium text-slate-700'}>
                                    {p.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {stats[p.id] || 0} matches
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center py-10 text-slate-400">Loading stats...</div>;

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-slate-800">Player Statistics</h1>
            <p className="text-sm text-slate-500 bg-yellow-50 p-3 rounded border border-yellow-100 mb-4">
                Shows total matches scheduled and played. 
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TEAMS.map(team => (
                    <div key={team.id}>
                        {renderTeamStats(team.id)}
                    </div>
                ))}
            </div>
        </div>
    );
}
