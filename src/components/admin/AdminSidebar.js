'use client';

import {
    LayoutDashboard, BookOpen, Users, FileText,
    CheckSquare, HelpCircle, Trophy, FolderOpen,
    ChevronRight, ChevronLeft, LogOut, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isRtl, t, handleLogout, isLoggingOut }) {
    const menuItems = [
        { id: 'overview', icon: LayoutDashboard, label: t.overview },
        { id: 'courses', icon: BookOpen, label: t.courses },
        { id: 'assignments', icon: CheckSquare, label: t.assignments },
        { id: 'quizzes', icon: HelpCircle, label: t.quizzes },
        { id: 'users', icon: Users, label: t.students },
        { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' }, // New
        { id: 'resources', icon: FolderOpen, label: 'Resources' }, // New
        { id: 'blog', icon: FileText, label: t.blog },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {!sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(true)}
                />
            )}

            <aside
                className={`fixed md:relative z-30 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 flex flex-col
          ${sidebarOpen
                        ? 'w-64 translate-x-0'
                        : (isRtl ? 'w-0 translate-x-full md:w-20 md:translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0')
                    }`}
            >
                {/* Header */}
                <div className="h-20 flex items-center justify-center border-b border-white/5 px-4">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold text-white tracking-tight">
                            Smart<span className="text-primary-500">Admin</span>
                        </h1>
                    ) : (
                        <span className="text-primary-500 font-bold text-xl">S</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden
                ${activeTab === item.id
                                    ? 'text-white shadow-lg shadow-primary-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="activeAdminTab"
                                    className="absolute inset-0 bg-primary-600 rounded-xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <item.icon size={22} />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              ${!sidebarOpen ? 'justify-center' : ''}
            `}
                        title="Logout"
                    >
                        {isLoggingOut ? <Loader2 size={22} className="animate-spin" /> : <LogOut size={22} />}
                        {sidebarOpen && <span className="font-medium">{isLoggingOut ? 'جاري الخروج...' : 'Logout'}</span>}
                    </button>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"
                    >
                        {isRtl
                            ? (sidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)
                            : (sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />)
                        }
                    </button>
                </div>
            </aside>
        </>
    );
}
