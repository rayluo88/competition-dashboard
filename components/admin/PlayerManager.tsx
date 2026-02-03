'use client';

import React, { useEffect, useState } from 'react';
import { Player, Team } from '@/app/types';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TEAMS } from '@/lib/roster';

export default function PlayerManager() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>(TEAMS[0].id);
    const [loading, setLoading] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newGender, setNewGender] = useState<'Male' | 'Female'>('Female');
    const [isEditingId, setIsEditingId] = useState<string | null>(null);

    const fetchPlayers = async () => {
        setLoading(true);
        const { data } = await supabase.from('players').select('*').order('name');
        if (data) setPlayers(data as Player[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return alert('Name is required');

        const newPlayer = {
            name: newName.trim(),
            gender: newGender,
            team_id: selectedTeam,
            active: true
        };

        const { error } = await supabase.from('players').insert(newPlayer);
        if (error) {
            alert('Error adding player: ' + error.message);
        } else {
            setNewName(''); // Reset form
            fetchPlayers();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will remove them from historical games too!')) return;

        const { error } = await supabase.from('players').delete().eq('id', id);
        if (error) alert('Error deleting: ' + error.message);
        else fetchPlayers();
    };

    const handleUpdate = async (id: string, name: string) => {
        const { error } = await supabase.from('players').update({ name }).eq('id', id);
        if (error) alert('Error updating: ' + error.message);
        else {
            setIsEditingId(null);
            fetchPlayers();
        }
    };

    // Filter displayed players
    const teamPlayers = players.filter(p => p.team_id === selectedTeam);
    const currentTeam = TEAMS.find(t => t.id === selectedTeam);

    return (
        <Card className="bg-white">
            <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Manage Players</h2>
                    <div className="flex gap-2">
                        {TEAMS.map(team => (
                            <button
                                key={team.id}
                                onClick={() => setSelectedTeam(team.id)}
                                className={`px-4 py-2 rounded text-sm font-bold border transition
                                    ${selectedTeam === team.id
                                        ? `bg-${team.color}-500 text-white border-${team.color}-600`
                                        : 'bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {team.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add Player Form */}
                <div className="flex gap-2 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <input
                        type="text"
                        placeholder="New Player Name"
                        className="flex-1 p-2 border rounded"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded"
                        value={newGender}
                        onChange={e => setNewGender(e.target.value as 'Male' | 'Female')}
                    >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                    </select>
                    <Button onClick={handleAdd} size="sm">Add</Button>
                </div>

                {/* Player List */}
                <div className="space-y-2">
                    {teamPlayers.length === 0 && <div className="text-center text-slate-400 py-4">No players found.</div>}

                    {teamPlayers.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                            {isEditingId === p.id ? (
                                <div className="flex flex-1 gap-2">
                                    <input
                                        autoFocus
                                        className="flex-1 p-1 border rounded"
                                        defaultValue={p.name}
                                        onBlur={(e) => handleUpdate(p.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleUpdate(p.id, e.currentTarget.value);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={`flex items-center gap-3 ${p.active === false ? 'opacity-50 line-through' : ''}`}>
                                    <span className={`w-2 h-2 rounded-full ${p.gender === 'Female' ? 'bg-pink-400' : 'bg-blue-400'}`} />
                                    <span className="font-medium">{p.name}</span>
                                    <span className="text-xs text-slate-400 uppercase">{p.active === false ? 'Inactive' : p.gender}</span>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    className={`text-xs px-2 h-6 ${p.active !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                                    variant="ghost"
                                    onClick={async () => {
                                        const newActive = p.active === false ? true : false;
                                        await supabase.from('players').update({ active: newActive }).eq('id', p.id);
                                        fetchPlayers();
                                    }}
                                >
                                    {p.active !== false ? 'Active' : 'Inactive'}
                                </Button>
                                <button
                                    className="text-xs text-slate-500 hover:text-blue-600 px-2"
                                    onClick={() => setIsEditingId(p.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-xs text-red-400 hover:text-red-700 px-2"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
