import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CourseInterface from '@/components/CourseInterface'
import { BookOpen, CheckCircle, PlayCircle, Lock, Star, Users, Clock, Award } from 'lucide-react'

// هام جداً: هذا السطر يجبر الصفحة على التحديث في كل زيارة للتأكد من حالة تسجيل الدخول
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CoursePage({ params }) {
  const supabase = await createClient()
  const { slug } = params

  // 1. جلب تفاصيل الكورس والدروس
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (
        id,
        title,
        order,
        is_assignment,
        video_url,
        content
      )
    `)
    .eq('slug', slug)
    .single()

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الكورس غير موجود</h1>
          <Link href="/courses" className="text-blue-400 hover:text-blue-300 underline">
            العودة للكورسات
          </Link>
        </div>
      </div>
    )
  }

  // ترتيب الدروس
  const sortedLessons = course.lessons?.sort((a, b) => a.order - b.order) || []

  // 2. التحقق من المستخدم (يتم التحقق في كل طلب للصفحة بسبب force-dynamic)
  const { data: { user } } = await supabase.auth.getUser()

  let isEnrolled = false
  let enrollmentData = null

  // 3. التحقق من الاشتراك
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle() // استخدام maybeSingle أفضل لتجنب الأخطاء

    if (enrollment) {
      isEnrolled = true
      enrollmentData = enrollment
    }
  }

  // 1.5. جلب الاختبارات
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('course_id', course.id)
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // 4. عرض الواجهة بناءً على الحالة
  // الحالة أ: المستخدم مشترك ومسجل دخول
  if (isEnrolled && user) {
    return (
      <CourseInterface
        course={course}
        lessons={sortedLessons}
        quizzes={quizzes || []}
        user={user}
        initialProgress={enrollmentData.completed_lessons}
      />
    )
  }

  // الحالة ب: المستخدم غير مشترك (عرض صفحة البيع)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-6">
                <Star size={14} className="fill-blue-400" /> كورس مميز
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                {course.title}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-10 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  <span>{sortedLessons.length} درس</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-purple-500" />
                  <span>متاح للجميع</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-yellow-500" />
                  <span>شهادة إتمام</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <form action={async () => {
                    'use server'
                    const supabase = await createClient()
                    const { data: { user } } = await supabase.auth.getUser()
                    if (!user) return redirect(`/login?next=/course/${slug}`)
                    const { error } = await supabase.from('enrollments').insert({ user_id: user.id, course_id: course.id, completed_lessons: [] })
                    if (!error) redirect(`/course/${slug}`)
                  }}>
                    <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                      اشترك الآن {course.price > 0 ? `(${course.price} ج.م)` : '(مجاناً)'}
                    </button>
                  </form>
                ) : (
                  <Link
                    href={`/login?next=/course/${slug}`}
                    className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    سجل دخول للاشتراك
                  </Link>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-auto object-cover" />
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-slate-900 text-slate-600">
                    <BookOpen size={64} />
                  </div>
                )}
                <div className="p-6 bg-slate-900/90 backdrop-blur-sm">
                  <h3 className="font-bold text-white text-lg mb-2">ماذا ستتعلم؟</h3>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> فهم أساسيات الموضوع بعمق</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> تطبيقات عملية ومشاريع حقيقية</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> الحصول على شهادة معتمدة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
          <BookOpen className="text-blue-500" /> محتويات الدورة
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {sortedLessons.length > 0 ? sortedLessons.map((lesson, index) => (
            <div key={lesson.id} className="p-5 border-b border-slate-800 last:border-0 flex items-center gap-4 hover:bg-slate-800/50 transition-colors group">
              <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-sm border border-slate-700 group-hover:border-slate-600">
                {index + 1}
              </span>
              <div className="flex-1">
                <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{lesson.title}</span>
              </div>
              <div className="flex items-center text-slate-500 text-sm gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <Lock size={14} />
                <span>مغلق</span>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-slate-500">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <p>لا توجد دروس لعرضها حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
