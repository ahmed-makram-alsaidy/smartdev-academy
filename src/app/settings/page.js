'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // العميل الجديد
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <--- Added this missing import
import { Save, Loader2, User, Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const supabase = createClient();
  const router = useRouter();
  const { isRtl } = useLanguage();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setEmail(user.email);
      setFullName(user.user_metadata?.full_name || '');
      setLoading(false);
    };

    getProfile();
  }, [router, supabase]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      // تحديث بيانات الجدول العام للمستخدمين أيضًا
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('users').update({ full_name: fullName }).eq('id', user.id);

      alert('تم تحديث الملف الشخصي بنجاح');
      router.refresh();
    } catch (error) {
      alert('خطأ: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white pb-20 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>

      <div className="max-w-2xl mx-auto px-6 pt-32">
        <h1 className="text-3xl font-bold mb-8">إعدادات الحساب</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleUpdateProfile} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className={`absolute top-3 text-slate-500 ${isRtl ? 'right-3' : 'left-3'}`} size={18} />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className={`w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 text-slate-500 cursor-not-allowed ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-1">لا يمكن تغيير البريد الإلكتروني.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">الاسم الكامل</label>
                <div className="relative">
                  <User className={`absolute top-3 text-slate-500 ${isRtl ? 'right-3' : 'left-3'}`} size={18} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 text-white focus:border-blue-500 outline-none transition-colors ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link href="/update-password">
                  <button type="button" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                    <Lock size={16} /> تغيير كلمة المرور
                  </button>
                </Link>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> حفظ التغييرات</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
