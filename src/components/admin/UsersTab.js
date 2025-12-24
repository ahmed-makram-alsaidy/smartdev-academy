'use client';

export default function UsersTab({ t, users, isRtl }) {
    return (
        <div className="space-y-6 animate-in fade-in">
            <h1 className="text-3xl font-bold text-white">{t.studentsList}</h1>
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-300">
                        <tr>
                            <th className="p-4">{t.name}</th>
                            <th className="p-4">{t.email}</th>
                            <th className="p-4">{t.role}</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white font-bold flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                        {u.full_name?.[0] || u.email?.[0]?.toUpperCase()}
                                    </div>
                                    {u.full_name || 'N/A'}
                                </td>
                                <td className="p-4 text-slate-400 font-mono text-sm">{u.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-primary-400'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
