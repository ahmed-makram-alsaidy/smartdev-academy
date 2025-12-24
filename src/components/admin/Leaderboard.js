'use client';

import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard({ users }) {
    // Sort users by some metric (e.g., completed lessons or quiz scores)
    // For now, we'll mock a score or use a random one if not available in the schema yet
    // Ideally, we should fetch this from a 'leaderboard' view or calculate it
    const sortedUsers = [...users].map(u => ({
        ...u,
        score: Math.floor(Math.random() * 1000) // Mock score for now until we have real data
    })).sort((a, b) => b.score - a.score).slice(0, 10);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="text-yellow-400 w-6 h-6" />;
            case 1: return <Medal className="text-slate-300 w-6 h-6" />;
            case 2: return <Medal className="text-amber-600 w-6 h-6" />;
            default: return <span className="text-slate-500 font-bold w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Award className="text-primary-500" />
                Leaderboard
            </h1>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-300">
                        <tr>
                            <th className="p-4 w-20 text-center">Rank</th>
                            <th className="p-4">Student</th>
                            <th className="p-4 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user, index) => (
                            <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 flex justify-center items-center">
                                    {getRankIcon(index)}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                                            {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{user.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right font-mono text-primary-400 font-bold">
                                    {user.score} XP
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
