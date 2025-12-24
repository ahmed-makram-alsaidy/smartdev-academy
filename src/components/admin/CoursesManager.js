'use client';

import { Plus, Edit, Trash2, Video, FileText } from 'lucide-react';

export default function CoursesManager({ t, courses, setIsCourseModalOpen, setCurrentCourse, fetchLessons, handleDeleteCourse }) {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t.manageCourses}</h1>
                <button
                    onClick={() => { setCurrentCourse(null); setIsCourseModalOpen(true) }}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> {t.newCourse}
                </button>
            </div>

            <div className="grid gap-4">
                {courses.map(c => (
                    <div key={c.id} className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-primary-500/30 transition-all">
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden relative">
                                {c.thumbnail_url ? (
                                    <img src={c.thumbnail_url} className="w-full h-full object-cover" alt={c.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <Video size={24} />
                                    </div>
                                )}
                                {!c.is_published && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white bg-red-500/80 px-2 py-1 rounded">Draft</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{c.title}</h3>
                                <p className="text-slate-400 text-sm font-mono">{c.price === 0 ? 'Free' : `$${c.price}`}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => fetchLessons(c.id)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-primary-400 text-sm font-medium transition-colors"
                            >
                                {t.manageLessons}
                            </button>
                            <button
                                onClick={() => { setCurrentCourse(c); setIsCourseModalOpen(true) }}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                                title={t.edit}
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDeleteCourse(c.id)}
                                className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg text-red-400 transition-colors"
                                title={t.delete}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
