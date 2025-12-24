import { createClient } from '@/utils/supabase/server'
import CourseCard from '@/components/CourseCard'
import { BookOpen } from 'lucide-react'

// Enable ISR caching - revalidate every 60 seconds
export const revalidate = 60;

export default async function CoursesPage() {
  const supabase = await createClient()

  // جلب الكورسات المنشورة فقط مع تحديد الحقول المطلوبة
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, description, thumbnail_url, slug, price, is_published')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">دوراتنا التعليمية 📚</h1>
          <p className="text-lg sm:text-xl text-slate-400">اكتشف مسارات التعلم وابدأ رحلتك البرمجية اليوم</p>
        </div>

        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-2xl shadow-lg border border-slate-800">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد دورات</h3>
            <p className="text-slate-400 mb-6">لم يتم نشر أي دورات تعليمية حتى الآن.</p>
          </div>
        )}
      </div>
    </div>
  )
}
