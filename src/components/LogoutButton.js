'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const { signOut } = useAuth();

    return (
        <button
            onClick={signOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-all border border-red-500/20 hover:border-red-500/30"
        >
            <LogOut size={18} />
            تسجيل خروج
        </button>
    );
}
