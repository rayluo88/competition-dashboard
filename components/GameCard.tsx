import React from 'react';
import { Game, GameRoster, Team } from '@/app/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from 'lucide-react'; // Placeholder - using lucide badge? No, I need a UI badge.
// Actually, I'll just use a span for badge for now or install a Badge component.
// Let's us a simple span with tailwind classes for the Badge.

import { cn } from '@/lib/utils';

// Helper for Game Type Badge Color
const getGameTypeColor = (type: string) => {
    switch (type) {
        case 'MD': return 'bg-blue-100 text-blue-800';
        case 'WD': return 'bg-pink-100 text-pink-800';
        case 'XD': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

interface GameCardProps {
    game: Game;
    roster?: GameRoster;
    playerNames?: { a: string[], b: string[] };
}

export function GameCard({ game, playerNames }: GameCardProps) {
    return (
        <Card className="mb-4 overflow-hidden border-none shadow-md ring-1 ring-slate-900/5">
            <div className="flex justify-between items-center bg-slate-50 p-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">Match #{game.sequence_number}</span>
                    <span className="font-semibold text-sm">{game.time_slot}</span>
                </div>
                <span className={cn("px-2 py-0.5 rounded text-xs font-bold", getGameTypeColor(game.game_type))}>
                    {game.game_type}
                </span>
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    {/* Team A */}
                    <div className="text-center w-1/3">
                        <div className="font-bold text-slate-900">Team A</div>
                        {playerNames?.a && playerNames.a.length > 0 && (
                            <div className="text-[10px] text-slate-500 font-medium leading-tight mt-1">
                                {playerNames.a.join('/')}
                            </div>
                        )}
                        <div className="text-3xl font-bold mt-1 tabular-nums">{game.score_a}</div>
                    </div>

                    {/* VS / Status */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                            {game.status === 'active' ? (
                                <span className="text-green-600 animate-pulse">● Live</span>
                            ) : (
                                game.status
                            )}
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="text-center w-1/3">
                        <div className="font-bold text-slate-900">Team B</div>
                        {playerNames?.b && playerNames.b.length > 0 && (
                            <div className="text-[10px] text-slate-500 font-medium leading-tight mt-1">
                                {playerNames.b.join('/')}
                            </div>
                        )}
                        <div className="text-3xl font-bold mt-1 tabular-nums">{game.score_b}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
