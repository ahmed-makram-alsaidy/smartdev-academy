'use client';

import { LineChart, BarChart } from '../AdminCharts';
import { Users, BookOpen, CheckSquare, Trophy } from 'lucide-react';

function StatCard({ title, value, color, icon: Icon, data }) {
    const colors = {
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-pink-500',
        green: 'from-emerald-500 to-green-500',
        yellow: 'from-yellow-500 to-orange-500',
        rose: 'from-rose-500 to-red-500'
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform h-40 flex flex-col justify-between">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} opacity-5 rounded-bl-full -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`}></div>

            {/* Sparkline Background */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 pointer-events-none">
                <LineChart data={data} color={color} />
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-lg`}>
                    <Icon size={20} />
                </div>
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">{title}</h3>
            </div>
            <p className="text-3xl font-black text-white relative z-10">{value}</p>
        </div>
    );
}

export default function AdminStats({ t, stats }) {
    return (
        <div className="space-y-8 animate-in fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">{t.overview}</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title={t.totalStudents}
                    value={stats.users}
                    color="blue"
                    icon={Users}
                    data={[10, 15, 12, 20, 25, 30, 28, 35, 40, 45]}
                />
                <StatCard
                    title={t.activeCourses}
                    value={stats.courses}
                    color="purple"
                    icon={BookOpen}
                    data={[5, 8, 6, 9, 12, 10, 15, 14, 18, 20]}
                />
                <StatCard
                    title={t.pendingTasks}
                    value={stats.pendingAssignments}
                    color="yellow"
                    icon={CheckSquare}
                    data={[2, 4, 3, 6, 5, 8, 7, 10, 9, 12]}
                />
                <StatCard
                    title="Certificates"
                    value={stats.certificates || 0}
                    color="rose"
                    icon={Trophy}
                    data={[1, 2, 1, 3, 2, 4, 3, 5, 4, 6]}
                />
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">Activity Trends (Last 7 Days)</h2>
                <BarChart
                    data={[12, 19, 15, 25, 22, 30, 28]}
                    labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                    color="blue"
                />
            </div>
        </div>
    );
}
