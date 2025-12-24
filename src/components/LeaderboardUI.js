'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Crown, Trophy, Medal, User, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardUI({ topUsers, currentUser, userRank }) {
    const { language, isRtl } = useLanguage();

    const t = {
        en: {
            title: "Leaderboard",
            subtitle: "Top performing students",
            rank: "Rank",
            student: "Student",
            score: "XP",
            you: "You",
            points: "Points",
            noData: "No data available yet.",
            yourRank: "Your Rank"
        },
        ar: {
            title: "لوحة المتصدرين",
            subtitle: "أفضل الطلاب أداءً وإنجازاً",
            rank: "الترتيب",
            student: "الطالب",
            score: "نقاط الخبرة",
            you: "أنت",
            points: "نقطة",
            noData: "لا توجد بيانات متاحة بعد.",
            yourRank: "ترتيبك الحالي"
        }
    }[language || 'ar'];

    const getRankIcon = (index) => {
        if (index === 0) return <Crown className="text-yellow-500 fill-yellow-500" size={24} />;
        if (index === 1) return <Medal className="text-slate-300 fill-slate-300" size={24} />;
        if (index === 2) return <Medal className="text-orange-500 fill-orange-500" size={24} />;
        return <span className="font-bold text-slate-500 text-lg">#{index + 1}</span>;
    };

    const getRowStyle = (index) => {
        if (index === 0) return "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20";
        if (index === 1) return "bg-gradient-to-r from-slate-300/10 to-transparent border-slate-300/20";
        if (index === 2) return "bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/20";
        return "bg-slate-900 border-slate-800 hover:border-slate-700";
    };

    return (
        <div className={`min-h-screen bg-slate-950 text-white py-12 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">

                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 relative z-10 flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-500" size={40} /> {t.title}
                    </h1>
                    <p className="text-lg text-slate-400 relative z-10">{t.subtitle}</p>
                </div>

                {/* Top 10 List */}
                <div className="space-y-4 mb-12">
                    {topUsers && topUsers.length > 0 ? (
                        topUsers.map((user, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={user.user_id}
                                className={`relative p-4 rounded-2xl border flex items-center gap-4 transition-all ${getRowStyle(index)} ${currentUser?.id === user.user_id ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''}`}
                            >
                                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                                    {getRankIcon(index)}
                                </div>

                                <div className="flex-shrink-0">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.full_name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg border-2 border-slate-700">
                                            {user.full_name?.charAt(0).toUpperCase() || <User size={20} />}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-white truncate flex items-center gap-2">
                                        {user.full_name || t.student}
                                        {currentUser?.id === user.user_id && (
                                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">{t.you}</span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <Star size={12} className="text-yellow-500" /> {Math.round(user.total_score)} {t.score}
                                    </p>
                                </div>

                                <div className="text-right hidden sm:block">
                                    <div className="text-2xl font-bold text-white">{Math.round(user.total_score)}</div>
                                    <div className="text-xs text-slate-500 uppercase">{t.points}</div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
                            <Trophy size={48} className="mx-auto mb-4 text-slate-700" />
                            <p className="text-slate-500">{t.noData}</p>
                        </div>
                    )}
                </div>

                {/* Current User Rank (if not in top 10) */}
                {currentUser && userRank > 10 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky bottom-6 bg-slate-900/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
                    >
                        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-slate-400 text-lg">
                            #{userRank}
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-400">
                                {currentUser.full_name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-white">{t.yourRank}</h3>
                            <p className="text-sm text-slate-400">{t.subtitle}</p>
                        </div>
                        <div className="text-right">
                            {/* We might need to fetch the user's score if it's not passed, but usually we can pass it */}
                            <div className="text-xl font-bold text-blue-400">
                                {/* Placeholder if score isn't available in this context, or pass it from parent */}
                                Keep Going! 🚀
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
