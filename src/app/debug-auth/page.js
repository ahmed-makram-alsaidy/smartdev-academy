'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function DebugAuthPage() {
    const { user, loading } = useAuth();
    const [sessionInfo, setSessionInfo] = useState(null);
    const [cookiesInfo, setCookiesInfo] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { session }, error } = await supabase.auth.getSession();

            setSessionInfo({
                hasSession: !!session,
                userId: session?.user?.id,
                email: session?.user?.email,
                error: error?.message,
            });

            // Get all cookies
            setCookiesInfo(document.cookie);
        };

        checkSession();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Auth Debug Page</h1>

                <div className="space-y-6">
                    {/* AuthContext State */}
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h2 className="text-xl font-semibold mb-4 text-primary-400">AuthContext State</h2>
                        <div className="space-y-2">
                            <p><strong>Loading:</strong> <span className={loading ? 'text-yellow-400' : 'text-green-400'}>{loading ? 'true' : 'false'}</span></p>
                            <p><strong>User:</strong> <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'Logged in' : 'Not logged in'}</span></p>
                            {user && (
                                <>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Role:</strong> <span className="text-blue-400">{user.role || 'No role'}</span></p>
                                    <p><strong>User ID:</strong> {user.id}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h2 className="text-xl font-semibold mb-4 text-secondary-400">Direct Session Check</h2>
                        {sessionInfo ? (
                            <div className="space-y-2">
                                <p><strong>Has Session:</strong> <span className={sessionInfo.hasSession ? 'text-green-400' : 'text-red-400'}>{sessionInfo.hasSession ? 'true' : 'false'}</span></p>
                                {sessionInfo.hasSession && (
                                    <>
                                        <p><strong>User ID:</strong> {sessionInfo.userId}</p>
                                        <p><strong>Email:</strong> {sessionInfo.email}</p>
                                    </>
                                )}
                                {sessionInfo.error && (
                                    <p><strong>Error:</strong> <span className="text-red-400">{sessionInfo.error}</span></p>
                                )}
                            </div>
                        ) : (
                            <p className="text-slate-400">Loading session info...</p>
                        )}
                    </div>

                    {/* Cookies */}
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h2 className="text-xl font-semibold mb-4 text-accent-400">Cookies</h2>
                        <div className="bg-slate-950 p-4 rounded overflow-x-auto">
                            <pre className="text-xs text-slate-300">{cookiesInfo || 'No cookies found'}</pre>
                        </div>
                    </div>

                    {/* Raw User Object */}
                    {user && (
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <h2 className="text-xl font-semibold mb-4 text-green-400">Raw User Object</h2>
                            <div className="bg-slate-950 p-4 rounded overflow-x-auto">
                                <pre className="text-xs text-slate-300">{JSON.stringify(user, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
