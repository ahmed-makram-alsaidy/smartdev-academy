'use client';

import { useState } from 'react';
import { FolderOpen, Plus, Trash2, FileText, Link as LinkIcon, Download } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ResourcesManager({ materials, fetchMaterials }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const supabase = createClient();

    const handleAddResource = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const resourceData = {
            title: formData.get('title'),
            description: formData.get('description'),
            file_url: formData.get('file_url'),
            file_type: formData.get('file_type') || 'link',
        };

        const { error } = await supabase.from('materials').insert([resourceData]);
        if (!error) {
            setIsModalOpen(false);
            fetchMaterials();
        } else {
            alert('Error adding resource');
        }
    };

    const handleDeleteResource = async (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            await supabase.from('materials').delete().eq('id', id);
            fetchMaterials();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FolderOpen className="text-primary-500" />
                    Resources Library
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Add Resource
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials?.map((material) => (
                    <div key={material.id} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-xl text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                {material.file_type === 'pdf' ? <FileText size={24} /> : <LinkIcon size={24} />}
                            </div>
                            <button
                                onClick={() => handleDeleteResource(material.id)}
                                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{material.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{material.description}</p>

                        <a
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors"
                        >
                            <Download size={16} /> Access Resource
                        </a>
                    </div>
                ))}

                {(!materials || materials.length === 0) && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No resources found. Add some to get started.
                    </div>
                )}
            </div>

            {/* Add Resource Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Resource</h2>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Title</label>
                                <input name="title" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Description</label>
                                <textarea name="description" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors h-24" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">URL</label>
                                <input name="file_url" type="url" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Type</label>
                                <select name="file_type" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors">
                                    <option value="link">Link</option>
                                    <option value="pdf">PDF</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors">Add Resource</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
