// src/components/CourseCard.js
import Link from 'next/link';
import { Play, CheckCircle, Award, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function CourseCard({ course, progress }) {
  // حساب نسبة التقدم (افتراضية حالياً)
  const percent = progress || 0;
  const isCompleted = percent === 100;

  return (
    <div className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all group flex flex-col h-full ${isCompleted ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
      {/* صورة الكورس */}
      <div className="h-48 bg-slate-800 relative overflow-hidden">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
        
        {/* شارة الاكتمال على الصورة */}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <CheckCircle size={12} /> مكتمل
          </div>
        )}
      </div>

      {/* المحتوى */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
          {course.description || 'تعلم المهارات الأساسية لتصبح مبرمجاً محترفاً.'}
        </p>
        
        {/* شريط التقدم */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>التقدم</span>
            <span className={isCompleted ? "text-green-400 font-bold" : ""}>{percent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href={`/course/${course.slug || course.id}`} className="block w-full">
            <Button 
              variant="outline" 
              className={`w-full justify-center ${isCompleted ? 'hover:bg-slate-800' : 'group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'}`}
            >
              {isCompleted ? (
                <> <RotateCcw size={16} /> مراجعة المحتوى </>
              ) : percent > 0 ? (
                'استكمال التعلم'
              ) : (
                'ابدأ الكورس'
              )}
            </Button>
          </Link>

          {/* زر الشهادة يظهر فقط عند اكتمال الكورس 100% */}
          {isCompleted && (
            <Link href={`/certificate/${course.slug}`} className="block w-full animate-pulse hover:animate-none">
              <Button variant="outline" className="w-full justify-center border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white font-bold shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Award size={18} /> تحميل الشهادة
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
