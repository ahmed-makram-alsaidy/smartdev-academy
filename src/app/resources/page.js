'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // استخدام العميل الجديد لمنع التعليق
import { FileText, Download, Search, Filter, FolderOpen, Video, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import { useLanguage } from '@/context/LanguageContext';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [courses, setCourses] = useState([]);

  const supabase = createClient(); // إنشاء نسخة العميل
  const { isRtl } = useLanguage(); // لدعم الاتجاه RTL

  useEffect(() => {
    async function fetchData() {
      // 1. جلب الملفات
      const { data: matData } = await supabase
        .from('materials')
        .select(`*, courses (id, title)`)
        .order('created_at', { ascending: false });

      if (matData) setMaterials(matData);

      // 2. جلب الكورسات للفلتر
      const { data: courseData } = await supabase.from('courses').select('id, title');
      if (courseData) setCourses(courseData);

      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  // تصفية النتائج
  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || mat.course_id?.toString() === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const getIcon = (type) => {
    if (type === 'pdf') return <FileText className="text-red-400" size={24} />;
    if (type === 'zip' || type === 'rar') return <FolderOpen className="text-yellow-400" size={24} />;
    if (['png', 'jpg', 'jpeg'].includes(type)) return <FileText className="text-blue-400" size={24} />;
    return <FileText className="text-slate-400" size={24} />;
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📚 مكتبة المصادر</h1>
            <p className="text-slate-400">جميع ملفات المعسكر، السلايدات، والأكواد المرفقة.</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className={`absolute top-3 text-slate-500 ${isRtl ? 'right-3' : 'left-3'}`} size={18} />
              <input
                type="text"
                placeholder="ابحث عن ملف..."
                className={`bg-slate-900 border border-slate-700 rounded-lg py-2 text-white focus:border-blue-500 outline-none w-full sm:w-64 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute top-3 text-slate-500 ${isRtl ? 'right-3' : 'left-3'}`} size={18} />
              <select
                className={`bg-slate-900 border border-slate-700 rounded-lg py-2 text-white focus:border-blue-500 outline-none appearance-none w-full sm:w-48 cursor-pointer ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="all">كل الكورسات</option>
                <option value="general">ملفات عامة</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
            <FolderOpen className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400">لا توجد ملفات مطابقة للبحث.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((mat) => (
              <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-slate-800 p-3 rounded-lg group-hover:bg-slate-700 transition-colors">
                    {getIcon(mat.file_type)}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {mat.file_type || 'FILE'}
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg mb-2 line-clamp-1" title={mat.title}>{mat.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                  {mat.description || 'لا يوجد وصف متاح.'}
                </p>

                <div className="border-t border-slate-800 pt-4 mt-auto">
                  {mat.courses && (
                    <div className="mb-3 text-xs text-slate-500 flex items-center gap-1">
                      <Video size={12} />
                      <span className="truncate">تابع لـ: {mat.courses.title}</span>
                    </div>
                  )}
                  <a href={mat.file_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full justify-center text-sm py-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 bg-transparent border-slate-700 text-slate-300">
                      <Download size={16} /> تحميل الملف
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
