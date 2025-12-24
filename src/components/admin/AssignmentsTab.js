'use client';

import { FileCheck, CheckCircle, XCircle } from 'lucide-react';

export default function AssignmentsTab({ t, submissions, isRtl, handleSubmissionStatus }) {
    return (
        <div className="space-y-6 animate-in fade-in">
            <h1 className="text-3xl font-bold text-white">{t.submissionsList}</h1>
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-300">
                        <tr>
                            <th className="p-4">{t.studentsList}</th>
                            <th className="p-4">{t.title}</th>
                            <th className="p-4">{t.viewFile}</th>
                            <th className="p-4">{t.status}</th>
                            <th className="p-4">{t.action}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map(s => (
                            <tr key={s.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">{s.users?.full_name || s.users?.email}</td>
                                <td className="p-4 text-slate-400">{s.lessons?.title}</td>
                                <td className="p-4">
                                    {s.file_url ? (
                                        <a href={s.file_url} target="_blank" className="text-primary-400 underline flex gap-1 items-center hover:text-primary-300">
                                            <FileCheck size={16} /> Link
                                        </a>
                                    ) : '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                            s.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                'bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleSubmissionStatus(s.id, 'approved')} className="p-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors" title={t.approve}>
                                        <CheckCircle size={18} />
                                    </button>
                                    <button onClick={() => handleSubmissionStatus(s.id, 'rejected')} className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" title={t.reject}>
                                        <XCircle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {submissions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                    {t.noSubmissions}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
