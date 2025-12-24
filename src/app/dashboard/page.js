import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LineChart } from '@/components/AdminCharts'
import LogoutButton from '@/components/LogoutButton'
import { Award, BookOpen, Trophy, User, FolderOpen, Edit, LogOut, FileQuestion, Star, Crown } from 'lucide-react'

// هام جداً: هذا السطر يجبر الصفحة على التحديث في كل زيارة للتأكد من حالة تسجيل الدخول
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Get Auth User
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 2. Get User Profile Details
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Get Enrollments with Course details
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses (
        id,
        title,
        slug,
        slug,
        thumbnail_url,
        description,
        has_certificate,
        lessons (id)
      )
    `)
    .eq('user_id', user.id)

  // 4. Get Resources
  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // 5. Get Leaderboard (Top 5)
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(5)

  // 6. Get Available Quizzes
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select(`*, courses(title)`)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(5)

  // حساب الإحصائيات بأمان
  const completedLessonsCount = enrollments?.reduce((acc, curr) => acc + (curr.completed_lessons?.length || 0), 0) || 0;
  const certificatesCount = enrollments?.filter(e => (e.completed_lessons?.length || 0) === (e.course?.lessons?.length || 1)).length || 0;

  // Calculate User Rank
  const userRank = leaderboard?.findIndex(u => u.user_id === user.id) + 1;
  const userScore = leaderboard?.find(u => u.user_id === user.id)?.total_score || 0;

  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">

        {/* Welcome Section */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 px-4 sm:px-8 py-6 sm:py-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-lg shadow-blue-500/20 ring-4 ring-slate-800">
              {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                مرحباً بك، {profile?.full_name || user.email?.split('@')[0]} 👋
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400">هذه هي لوحة التحكم الخاصة بتعلمك.</p>
            </div>
          </div>

          <div className="flex gap-3 relative z-10 w-full md:w-auto">
            <Link
              href="/settings"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all border border-slate-700 hover:border-slate-600 text-sm sm:text-base"
            >
              <Edit size={18} />
              <span className="hidden sm:inline">تعديل بياناتي</span>
              <span className="sm:hidden">تعديل</span>
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-3 sm:gap-4 hover:border-blue-500/30 transition-colors">
            <div className="p-2 sm:p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <BookOpen size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">الدورات المسجلة</p>
              <p className="text-2xl font-bold text-white">{enrollments?.length || 0}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-3 sm:gap-4 hover:border-green-500/30 transition-colors">
            <div className="p-2 sm:p-3 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20">
              <CheckCircle size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">الدروس المكتملة</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{completedLessonsCount}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-3 sm:gap-4 hover:border-yellow-500/30 transition-colors">
            <div className="p-2 sm:p-3 bg-yellow-500/10 text-yellow-400 rounded-xl border border-yellow-500/20">
              <Award size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">الشهادات</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{certificatesCount}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-3 sm:gap-4 hover:border-purple-500/30 transition-colors">
            <div className="p-2 sm:p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Trophy size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">نقاطي (XP)</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{Math.round(userScore)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Activity Chart Section */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <LineChartIcon className="text-blue-500" size={20} />
              نشاط التعلم (آخر 7 أيام)
            </h3>
            <div className="h-64 w-full">
              <LineChart data={[5, 12, 8, 15, 20, 18, 25]} color="blue" />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">

            {/* Leaderboard Preview */}
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Crown className="text-yellow-500" size={20} />
                لوحة الشرف
              </h3>
              <div className="space-y-3">
                {leaderboard?.map((u, index) => (
                  <div key={u.user_id} className={`flex items-center gap-3 p-3 rounded-xl ${u.user_id === user.id ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-slate-950 border border-slate-800'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-slate-300 text-black' :
                        index === 2 ? 'bg-orange-400 text-black' :
                          'bg-slate-800 text-slate-400'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{u.full_name || 'مستخدم'}</p>
                      <p className="text-xs text-slate-500">{Math.round(u.total_score)} XP</p>
                    </div>
                    {u.user_id === user.id && <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">أنت</div>}
                  </div>
                ))}
                {(!leaderboard || leaderboard.length === 0) && <p className="text-slate-500 text-sm text-center py-4">لا يوجد بيانات حالياً</p>}
              </div>
              <Link href="/leaderboard" className="block mt-4 text-center text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors">عرض الترتيب الكامل</Link>
            </div>

            {/* Resources Preview */}
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FolderOpen className="text-blue-500" size={20} />
                أحدث المصادر
              </h3>
              <div className="space-y-3">
                {materials?.map(m => (
                  <a
                    key={m.id}
                    href={m.file_url}
                    target="_blank"
                    className="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className="font-medium text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">{m.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(m.created_at).toLocaleDateString()}</div>
                  </a>
                ))}
                {(!materials || materials.length === 0) && <p className="text-slate-500 text-sm text-center py-4">لا توجد مصادر حالياً</p>}
              </div>
              <Link href="/resources" className="block mt-4 text-center text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors">عرض كل المصادر</Link>
            </div>

            {/* Quizzes Preview */}
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileQuestion className="text-purple-500" size={20} />
                الاختبارات المتاحة
              </h3>
              <div className="space-y-3">
                {quizzes?.map(q => (
                  <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all">
                    <div className="font-medium text-slate-200 line-clamp-1">{q.title}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">{q.courses?.title}</span>
                      <Link href={`/quiz/${q.id}`} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-lg transition-colors">
                        ابدأ
                      </Link>
                    </div>
                  </div>
                ))}
                {(!quizzes || quizzes.length === 0) && <p className="text-slate-500 text-sm text-center py-4">لا توجد اختبارات حالياً</p>}
              </div>
            </div>

          </div>
        </div>

        {/* Certificates Section */}
        {certificatesCount > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="text-yellow-500" />
              الشهادات المكتسبة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.filter(e => (e.completed_lessons?.length || 0) === (e.course?.lessons?.length || 1) && e.course?.has_certificate).map(e => (
                <div key={e.course_id} className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-yellow-500/10 transition-shadow">
                  <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-500 shadow-sm">
                    <Award size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{e.course?.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">تم الإكمال بنجاح</p>
                    <Link href={`/certificate/${e.course?.slug}`} className="text-yellow-500 text-sm font-bold hover:text-yellow-400 transition-colors">تحميل الشهادة</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Courses Section */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="text-blue-500" />
          كورساتي
        </h2>

        {enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {enrollments.map((enrollment) => {
              const totalLessons = enrollment.course?.lessons?.length || 0;
              const completedCount = enrollment.completed_lessons?.length || 0;
              const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
              const isCompleted = progress === 100;

              return (
                <div key={enrollment.course_id} className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-300 flex flex-col group">
                  {enrollment.course?.thumbnail_url && (
                    <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
                      <img
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isCompleted && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          مكتمل
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{enrollment.course?.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">{enrollment.course?.description}</p>

                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                        <span>{progress}% مكتمل</span>
                        <span>{completedCount}/{totalLessons} درس</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-2.5 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Link
                        href={`/course/${enrollment.course?.slug}`}
                        className={`flex-1 text-center py-2.5 rounded-xl transition-all font-bold shadow-lg ${isCompleted
                          ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                          }`}
                      >
                        {isCompleted ? 'مراجعة الكورس' : 'اكمل التعلم'}
                      </Link>
                      {isCompleted && enrollment.course?.has_certificate && (
                        <Link href={`/certificate/${enrollment.course_id}`} className="px-4 py-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors flex items-center justify-center" title="تحميل الشهادة">
                          <Award size={20} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-2xl shadow-lg border border-slate-800">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">لست مشتركاً في أي كورس بعد</h3>
            <p className="text-slate-400 mb-6">ابدأ رحلة تعلمك اليوم واستكشف الكورسات المتاحة</p>
            <Link href="/courses" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
              تصفح الكورسات المتاحة <ArrowLeft size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckCircle({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}

function LineChartIcon({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18"></path>
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
    </svg>
  )
}

function ArrowLeft({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}
