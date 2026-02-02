'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanCode = code.trim();

        if (cleanCode === 'admin123') {
            router.push('/admin');
        } else if (cleanCode === 'capA') {
            router.push('/captain?team=A');
        } else if (cleanCode === 'capB') {
            router.push('/captain?team=B');
        } else {
            setError('Invalid Access Code');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-center">Team Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <input
                                type="password"
                                placeholder="Enter Access Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            Enter
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-xs text-slate-400">
                        <p>Admin: admin123</p>
                        <p>Team A Captain: capA</p>
                        <p>Team B Captain: capB</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
