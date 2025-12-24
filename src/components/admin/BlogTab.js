'use client';

import { Plus, Edit, Trash2 } from 'lucide-react';

export default function BlogTab({ t, posts, language, setCurrentPost, setIsPostModalOpen, handleDeletePost }) {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t.manageBlog}</h1>
                <button
                    onClick={() => { setCurrentPost(null); setIsPostModalOpen(true) }}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> {t.newPost}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map(p => (
                    <div key={p.id} className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden group hover:border-primary-500/30 transition-all">
                        <div className="h-40 bg-slate-800 relative overflow-hidden">
                            {p.thumbnail_url && (
                                <img src={p.thumbnail_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.title} />
                            )}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${p.is_published ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                    {p.is_published ? t.published : t.draft}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-white mb-2 line-clamp-1 text-lg">{p.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{p.content?.substring(0, 100)}...</p>

                            <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => { setCurrentPost(p); setIsPostModalOpen(true) }}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-primary-400 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeletePost(p.id)}
                                    className="p-2 bg-slate-800 hover:bg-red-900/20 text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-white/5">
                        No posts found. Write something inspiring!
                    </div>
                )}
            </div>
        </div>
    );
}
