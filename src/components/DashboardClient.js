'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlayCircle, Globe } from 'lucide-react';

const translations = {
  en: {
    welcome: "Welcome back,",
    ready: "Ready to continue your learning journey?",
    noCourses: "You haven't enrolled in any courses yet.",
    browse: "Browse Courses",
    progress: "Progress",
    lessons: "Lessons",
    toggleLang: "العربية"
  },
  ar: {
    welcome: "مرحباً بك مجدداً،",
    ready: "هل أنت مستعد لمواصلة رحلة التعلم؟",
    noCourses: "لم تقم بالتسجيل في أي دورات بعد.",
    browse: "تصفح الدورات",
    progress: "التقدم",
    lessons: "درس",
    toggleLang: "English"
  }
};

export default function DashboardClient({ user, enrolledCourses = [] }) {
  const [lang, setLang] = useState('ar'); // اللغة الافتراضية

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = translations[lang];
  const isRtl = lang === 'ar';

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-white pt-12 px-6 transition-all duration-300 ${isRtl ? 'font-sans' : ''}`} 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">
              {t.welcome} <span className="text-blue-500">{user?.user_metadata?.full_name || user?.full_name || 'Developer'}</span>!
            </h1>
            <p className="text-slate-400">{t.ready}</p>
          </div>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-full transition-all text-sm font-bold text-slate-300 hover:text-white"
          >
            <Globe size={16} />
            {t.toggleLang}
          </button>
        </header>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
            <h2 className="text-2xl font-bold mb-4">{t.noCourses}</h2>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all">
              {t.browse}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((enrollment) => (
              <Link href={`/course/${enrollment.courses.slug}`} key={enrollment.course_id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 block">
                <div className="aspect-video w-full overflow-hidden relative">
                   <img 
                    src={enrollment.courses.thumbnail_url || '/api/placeholder/400/320'} 
                    alt={enrollment.courses.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                   </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1 text-right-forced" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                    {enrollment.courses.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                    {enrollment.courses.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-blue-500 h-full rounded-full" 
                      style={{ width: `${Math.min(((enrollment.completed_lessons?.length || 0) * 10), 100)}%` }} // منطق تقريبي للنسبة
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium uppercase tracking-wider">
                    <span>{t.progress}</span>
                    <span>{enrollment.completed_lessons?.length || 0} {t.lessons}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
