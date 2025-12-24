'use client';

import { X, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizResultsModal({ isOpen, onClose, attempts, quizTitle }) {
    if (!isOpen) return null;

    const formatTime = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-800">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">نتائج الاختبار</h2>
                            <p className="text-slate-400 text-sm">{quizTitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                        {attempts && attempts.length > 0 ? (
                            <div className="space-y-4">
                                {/* Stats Summary */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <p className="text-slate-400 text-sm mb-1">إجمالي المحاولات</p>
                                        <p className="text-2xl font-bold text-white">{attempts.length}</p>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <p className="text-slate-400 text-sm mb-1">ناجحين</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {attempts.filter(a => a.passed).length}
                                        </p>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <p className="text-slate-400 text-sm mb-1">راسبين</p>
                                        <p className="text-2xl font-bold text-red-400">
                                            {attempts.filter(a => !a.passed).length}
                                        </p>
                                    </div>
                                </div>

                                {/* Results Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-800">
                                                <th className="text-right p-3 text-slate-400 font-medium text-sm">الطالب</th>
                                                <th className="text-center p-3 text-slate-400 font-medium text-sm">الدرجة</th>
                                                <th className="text-center p-3 text-slate-400 font-medium text-sm">الوقت</th>
                                                <th className="text-center p-3 text-slate-400 font-medium text-sm">الحالة</th>
                                                <th className="text-right p-3 text-slate-400 font-medium text-sm">التاريخ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attempts.map((attempt) => (
                                                <tr
                                                    key={attempt.id}
                                                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                                {attempt.users?.full_name?.[0] || attempt.users?.email?.[0]?.toUpperCase() || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium text-sm">
                                                                    {attempt.users?.full_name || 'طالب'}
                                                                </p>
                                                                <p className="text-slate-500 text-xs">
                                                                    {attempt.users?.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <span className="text-white font-bold text-lg">
                                                            {attempt.score}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex items-center justify-center gap-1 text-slate-400 text-sm">
                                                            <Clock size={14} />
                                                            {formatTime(attempt.time_taken)}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex items-center justify-center">
                                                            {attempt.passed ? (
                                                                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium">
                                                                    <CheckCircle size={14} />
                                                                    ناجح
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium">
                                                                    <XCircle size={14} />
                                                                    راسب
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right text-slate-400 text-sm">
                                                        {formatDate(attempt.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User size={32} className="text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">لا توجد محاولات</h3>
                                <p className="text-slate-400">لم يقم أي طالب بحل هذا الاختبار بعد</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
