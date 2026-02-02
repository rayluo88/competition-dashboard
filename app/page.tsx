'use client';

import React, { useEffect, useState } from 'react';
import { Game } from './types';
import { GameCard } from '@/components/GameCard';
import { supabase } from '@/lib/supabaseClient';

// MOCK DATA for display if DB is empty/unconnected
const MOCK_GAMES: Game[] = [
  { id: '1', sequence_number: 1, time_slot: '10:00 AM', court_number: 1, game_type: 'WD', status: 'completed', score_a: 11, score_b: 9 },
  { id: '2', sequence_number: 2, time_slot: '10:00 AM', court_number: 2, game_type: 'MD', status: 'completed', score_a: 8, score_b: 11 },
  { id: '3', sequence_number: 3, time_slot: '10:15 AM', court_number: 1, game_type: 'XD', status: 'active', score_a: 5, score_b: 5 },
  { id: '4', sequence_number: 4, time_slot: '10:15 AM', court_number: 2, game_type: 'WD', status: 'scheduled', score_a: 0, score_b: 0 },
  { id: '5', sequence_number: 5, time_slot: '10:30 AM', court_number: 1, game_type: 'XD', status: 'scheduled', score_a: 0, score_b: 0 },
];

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial Fetch
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('sequence_number', { ascending: true });

      if (data && data.length > 0) {
        setGames(data as Game[]);
      } else {
        // Fallback to mock data if no DB connection or empty DB
        console.log("No data from Supabase (or error), using Mock Data for demo.");
        setGames(MOCK_GAMES);
      }
      setLoading(false);
    };

    fetchGames();

    // Realtime Subscription
    const channel = supabase
      .channel('public:games')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (payload) => {
        console.log('Realtime update:', payload);
        // Simple strategy: Re-fetch or update local state. Re-fetch is safer for consistency.
        fetchGames();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Derived Stats
  const teamAWins = games.filter(g => g.status === 'completed' && g.score_a > g.score_b).length;
  const teamBWins = games.filter(g => g.status === 'completed' && g.score_b > g.score_a).length;
  const teamAPoints = games.reduce((acc, g) => acc + (g.score_a || 0), 0);
  const teamBPoints = games.reduce((acc, g) => acc + (g.score_b || 0), 0);

  return (
    <div className="space-y-6">
      {/* Dashboard / Leaderboard */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-6 shadow-xl shadow-red-200 border border-red-600/20 mb-8 text-red-50 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-yellow-200/80 mb-6">Current Standings</h2>

        <div className="flex justify-between items-end relative z-10">
          {/* Team A */}
          <div className="text-center flex-1">
            <div className="text-6xl font-black text-yellow-300 drop-shadow-sm leading-none">{teamAWins}</div>
            <div className="font-bold text-white/90 mt-2 text-lg">Team A</div>
            <div className="text-xs text-red-100 font-mono mt-1 opacity-80">{teamAPoints} pts</div>
          </div>

          <div className="text-2xl font-black text-white/20 pb-8 italic">VS</div>

          {/* Team B */}
          <div className="text-center flex-1">
            <div className="text-6xl font-black text-yellow-300 drop-shadow-sm leading-none">{teamBWins}</div>
            <div className="font-bold text-white/90 mt-2 text-lg">Team B</div>
            <div className="text-xs text-red-100 font-mono mt-1 opacity-80">{teamBPoints} pts</div>
          </div>
        </div>
      </section>

      <header className="px-2">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Today's Schedule</h3>
      </header>


      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading schedule...</div>
      ) : (
        <div className="space-y-4 pb-20">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
