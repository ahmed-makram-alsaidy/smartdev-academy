'use client';

import { Plus, HelpCircle, Edit, Trash2 } from 'lucide-react';

export default function QuizzesTab({ t, quizzes, courses, setIsQuizModalOpen, setCurrentQuiz, fetchQuestions, handleDeleteQuiz, fetchAttempts }) {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t.manageQuizzes}</h1>
                <button
                    onClick={() => { setCurrentQuiz(null); setIsQuizModalOpen(true) }}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> {t.newQuiz}
                </button>
            </div>

            <div className="grid gap-4">
                {quizzes.map(q => (
                    <div key={q.id} className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-primary-500/30 transition-all">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-primary-500">
                                <HelpCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{q.title}</h3>
                                <p className="text-slate-400 text-sm">{q.courses?.title}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchAttempts(q.id)}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-400 text-sm transition-colors"
                            >
                                Results
                            </button>
                            <button
                                onClick={() => fetchQuestions(q.id)}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-primary-400 text-sm transition-colors"
                            >
                                {t.questions}
                            </button>
                            <button
                                onClick={() => { setCurrentQuiz(q); setIsQuizModalOpen(true) }}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDeleteQuiz(q.id)}
                                className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg text-red-400 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {quizzes.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-white/5">
                        No quizzes found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
