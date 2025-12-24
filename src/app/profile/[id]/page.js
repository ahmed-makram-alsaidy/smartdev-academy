'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // العميل الجديد
import { useParams } from 'next/navigation';
import { User, Calendar, Award, BookOpen, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { isRtl } = useLanguage();

  useEffect(() => {
    const getProfileData = async () => {
      // 1. جلب بيانات المستخدم
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !userData) {
        setLoading(false);
        return;
      }

      setProfile(userData);

      // 2. جلب إحصائيات الكورسات
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('completed_lessons')
        .eq('user_id', id);

      // حساب عدد الدروس المكتملة
      let totalCompletedLessons = 0;
      let coursesCount = enrollments?.length || 0;

      enrollments?.forEach(en => {
        if (en.completed_lessons) totalCompletedLessons += en.completed_lessons.length;
      });

      setStats({
        courses: coursesCount,
        lessons: totalCompletedLessons
      });

      setLoading(false);
    };

    getProfileData();
  }, [id, supabase]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">المستخدم غير موجود</div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-950 text-white ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">

        {/* Header Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl font-bold mb-6 text-slate-300 shadow-xl">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.full_name?.[0]?.toUpperCase() || <User size={40} />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
            <p className="text-slate-400 flex items-center gap-2 text-sm">
              <Calendar size={14} /> انضم في {new Date(profile.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
            </p>
            <div className="mt-4 px-4 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase border border-blue-500/20">
              {profile.role === 'admin' ? 'Admin' : 'Student'}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-3">
              <BookOpen size={24} />
            </div>
            <span className="text-3xl font-bold">{stats?.courses || 0}</span>
            <span className="text-slate-500 text-sm">كورس مسجل</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-3">
              <Award size={24} />
            </div>
            <span className="text-3xl font-bold">{stats?.lessons || 0}</span>
            <span className="text-slate-500 text-sm">درس مكتمل</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:border-green-500/30 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-3">
              <User size={24} />
            </div>
            <span className="text-xl font-bold text-slate-300">نشط</span>
            <span className="text-slate-500 text-sm">حالة الحساب</span>
          </div>
        </div>

      </div>
    </div>
  );
}
