'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import { Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // التحقق مما إذا كان المستخدم لديه جلسة (جاء من رابط الإيميل)
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            // إذا لم يكن هناك جلسة، ننتظر قليلاً فقد تكون قيد المعالجة من الرابط
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
                    setSessionLoading(false);
                }
            });
            // إذا مر وقت ولم يحدث شيء، نوجه للدخول
            setTimeout(() => {
                if(sessionLoading) setSessionLoading(false);
            }, 3000);
        } else {
            setSessionLoading(false);
        }
    };
    
    checkSession();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      
      setMessage('تم تحديث كلمة المرور بنجاح! جاري توجيهك...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
             <Loader2 className="animate-spin text-blue-500 mb-4" />
             <p className="text-slate-400">جاري التحقق من الرابط...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">تعيين كلمة مرور جديدة</h1>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور الجديدة</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 text-slate-500" size={20} />
              <input 
                type="password" 
                required 
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
          {message && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm flex items-center gap-2"><CheckCircle size={16} /> {message}</div>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'جاري التحديث...' : 'حفظ كلمة المرور'}
          </Button>
        </form>
      </div>
    </div>
  );
}
