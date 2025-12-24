'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { createQuiz, updateQuiz, deleteQuiz, addQuestion, deleteQuestion, getQuizAttempts } from '@/app/actions/quiz';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { useRealtime } from '@/hooks/useRealtime';

// Import Components
import AdminSidebar from './admin/AdminSidebar';
import AdminStats from './admin/AdminStats';
import CoursesManager from './admin/CoursesManager';
import AssignmentsTab from './admin/AssignmentsTab';
import QuizzesTab from './admin/QuizzesTab';
import UsersTab from './admin/UsersTab';
import BlogTab from './admin/BlogTab';
import Leaderboard from './admin/Leaderboard';
import ResourcesManager from './admin/ResourcesManager';
import { CourseModal, LessonModal, QuizModal, QuestionsModal, PostModal, QuizResultsModal } from './admin/AdminModals';

const fetcher = async (url) => {
  const supabase = createClient();
  // Simple fetcher mapping URLs to Supabase queries
  if (url === 'stats') {
    const [usersRes, coursesRes, submissionsRes, certificatesRes] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('certificates').select('*', { count: 'exact', head: true })
    ]);
    return {
      users: usersRes.count || 0,
      courses: coursesRes.count || 0,
      pendingAssignments: submissionsRes.count || 0,
      certificates: certificatesRes.count || 0
    };
  }
  if (url === 'courses') return (await supabase.from('courses').select('*').order('created_at', { ascending: false })).data;
  if (url === 'users') return (await supabase.from('users').select('*').order('created_at', { ascending: false })).data;
  if (url === 'posts') return (await supabase.from('posts').select('*').order('created_at', { ascending: false })).data;
  if (url === 'quizzes') return (await supabase.from('quizzes').select('*, courses(title)').order('created_at', { ascending: false })).data;
  if (url === 'submissions') return (await supabase.from('submissions').select(`*, users (full_name, email), lessons (title, course_id)`).order('created_at', { ascending: false })).data;
  if (url === 'materials') return (await supabase.from('materials').select('*').order('created_at', { ascending: false })).data;

  return null;
};

export default function AdminDashboardClient() {
  const { language, isRtl } = useLanguage();
  const { signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // SWR Hooks - Only fetch data for active tab
  const { data: stats, mutate: mutateStats, isLoading: statsLoading } = useSWR(activeTab === 'overview' ? 'stats' : null, fetcher);
  const { data: courses, mutate: mutateCourses, isLoading: coursesLoading } = useSWR(activeTab === 'courses' || activeTab === 'quizzes' ? 'courses' : null, fetcher);
  const { data: users, mutate: mutateUsers, isLoading: usersLoading } = useSWR(activeTab === 'users' || activeTab === 'leaderboard' ? 'users' : null, fetcher);
  const { data: posts, mutate: mutatePosts, isLoading: postsLoading } = useSWR(activeTab === 'blog' ? 'posts' : null, fetcher);
  const { data: quizzes, mutate: mutateQuizzes, isLoading: quizzesLoading } = useSWR(activeTab === 'quizzes' ? 'quizzes' : null, fetcher);
  const { data: submissions, mutate: mutateSubmissions, isLoading: submissionsLoading } = useSWR(activeTab === 'assignments' ? 'submissions' : null, fetcher);
  const { data: materials, mutate: mutateMaterials, isLoading: materialsLoading } = useSWR(activeTab === 'resources' ? 'materials' : null, fetcher);

  // Realtime Subscriptions - Optimized with useCallback
  const handleUsersChange = useCallback(() => { mutateStats(); mutateUsers(); }, []);
  const handleCoursesChange = useCallback(() => { mutateStats(); mutateCourses(); }, []);
  const handleSubmissionsChange = useCallback(() => { mutateStats(); mutateSubmissions(); }, []);
  const handlePostsChange = useCallback(() => { mutatePosts(); }, []);
  const handleQuizzesChange = useCallback(() => { mutateQuizzes(); }, []);
  const handleMaterialsChange = useCallback(() => { mutateMaterials(); }, []);
  const handleCertificatesChange = useCallback(() => { mutateStats(); }, []);

  // Only subscribe to realtime for active tabs to reduce load
  useRealtime('users', activeTab === 'users' || activeTab === 'leaderboard' || activeTab === 'overview' ? handleUsersChange : null);
  useRealtime('courses', activeTab === 'courses' || activeTab === 'overview' ? handleCoursesChange : null);
  useRealtime('submissions', activeTab === 'assignments' || activeTab === 'overview' ? handleSubmissionsChange : null);
  useRealtime('posts', activeTab === 'blog' ? handlePostsChange : null);
  useRealtime('quizzes', activeTab === 'quizzes' ? handleQuizzesChange : null);
  useRealtime('materials', activeTab === 'resources' ? handleMaterialsChange : null);
  useRealtime('certificates', activeTab === 'overview' ? handleCertificatesChange : null);

  // Modal States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Blog Modal States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // Quiz Modal States
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState([]);

  // Translations
  const t = {
    en: {
      adminPanel: "Admin Panel", overview: "Overview", courses: "Courses", students: "Students", assignments: "Assignments", blog: "Blog",
      totalStudents: "Total Students", activeCourses: "Active Courses", pendingTasks: "Pending Tasks", manageCourses: "Manage Courses",
      newCourse: "New Course", edit: "Edit", delete: "Delete", manageLessons: "Manage Lessons", studentsList: "Students List",
      name: "Name", email: "Email", role: "Role", joined: "Joined", editCourse: "Edit Course", createCourse: "Create Course",
      title: "Title", slug: "Slug (URL)", price: "Price", thumbnail: "Thumbnail URL", description: "Description", publish: "Publish",
      save: "Save", noLessons: "No lessons", addLesson: "Add Lesson", lessonTitle: "Lesson Title", videoUrl: "Video URL",
      content: "Content", resourceLink: "Resource Link", isAssignment: "Assignment?", isFinal: "Final?", loading: "Loading...",
      submissionsList: "Submissions", status: "Status", action: "Action", viewFile: "File", approve: "Approve", reject: "Reject",
      noSubmissions: "No submissions", manageBlog: "Blog Posts", newPost: "New Post", editPost: "Edit Post", createPost: "Create Post",
      postContent: "Content", postImage: "Image URL", published: "Published", draft: "Draft", deletePostConfirm: "Delete post?", date: "Date",
      quizzes: "Quizzes", manageQuizzes: "Manage Quizzes", newQuiz: "New Quiz", editQuiz: "Edit Quiz", createQuiz: "Create Quiz",
      questions: "Questions", addQuestion: "Add Question", questionText: "Question Text", points: "Points", correctAnswer: "Correct Answer",
      option1: "Option 1", option2: "Option 2", option3: "Option 3", option4: "Option 4", timeLimit: "Time Limit (mins)", passingScore: "Passing Score (%)"
    },
    ar: {
      adminPanel: "لوحة التحكم", overview: "نظرة عامة", courses: "الكورسات", students: "الطلاب", assignments: "الواجبات", blog: "المدونة",
      totalStudents: "إجمالي الطلاب", activeCourses: "الكورسات النشطة", pendingTasks: "واجبات بالانتظار", manageCourses: "إدارة الكورسات",
      newCourse: "كورس جديد", edit: "تعديل", delete: "حذف", manageLessons: "إدارة الدروس", studentsList: "قائمة الطلاب",
      name: "الاسم", email: "البريد الإلكتروني", role: "الدور", joined: "تاريخ الانضمام", editCourse: "تعديل الكورس", createCourse: "إنشاء كورس",
      title: "العنوان", slug: "الرابط", price: "السعر", thumbnail: "رابط الصورة", description: "الوصف", publish: "نشر",
      save: "حفظ", noLessons: "لا توجد دروس", addLesson: "إضافة درس", lessonTitle: "عنوان الدرس", videoUrl: "رابط الفيديو",
      content: "المحتوى", resourceLink: "رابط المصدر", isAssignment: "واجب؟", isFinal: "نهائي؟", loading: "جاري التحميل...",
      submissionsList: "التسليمات", status: "الحالة", action: "إجراء", viewFile: "الملف", approve: "قبول", reject: "رفض",
      noSubmissions: "لا توجد تسليمات", manageBlog: "إدارة المدونة", newPost: "مقال جديد", editPost: "تعديل المقال", createPost: "إنشاء مقال",
      postContent: "المحتوى", postImage: "رابط الصورة", published: "منشور", draft: "مسودة", deletePostConfirm: "حذف المقال؟", date: "التاريخ",
      quizzes: "الاختبارات", manageQuizzes: "إدارة الاختبارات", newQuiz: "اختبار جديد", editQuiz: "تعديل الاختبار", createQuiz: "إنشاء اختبار",
      questions: "الأسئلة", addQuestion: "إضافة سؤال", questionText: "نص السؤال", points: "الدرجات", correctAnswer: "الإجابة الصحيحة",
      option1: "الخيار 1", option2: "الخيار 2", option3: "الخيار 3", option4: "الخيار 4", timeLimit: "الوقت (دقيقة)", passingScore: "درجة النجاح (%)"
    }
  }[language || 'ar'];

  // --- Handlers ---
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseData = {
      title: formData.get('title'), description: formData.get('description'), price: parseFloat(formData.get('price')) || 0,
      slug: formData.get('slug'), is_published: formData.get('is_published') === 'on', thumbnail_url: formData.get('thumbnail_url'),
      has_certificate: formData.get('has_certificate') === 'on'
    };
    if (currentCourse?.id) await supabase.from('courses').update(courseData).eq('id', currentCourse.id);
    else await supabase.from('courses').insert([courseData]);
    setIsCourseModalOpen(false); mutateCourses(); mutateStats();
  };

  const handleDeleteCourse = async (id) => { if (confirm('Confirm delete?')) { await supabase.from('courses').delete().eq('id', id); mutateCourses(); mutateStats(); } };

  const fetchLessons = async (courseId) => {
    setSelectedCourseId(courseId);
    const { data } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('order', { ascending: true });
    setLessons(data || []); setIsLessonModalOpen(true);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let content = formData.get('content');
    if (formData.get('resource_link')) content += `\n\n[Resource Link](${formData.get('resource_link')})`;
    await supabase.from('lessons').insert([{
      course_id: selectedCourseId, title: formData.get('title'), video_url: formData.get('video_url'), content,
      order: lessons.length + 1, is_assignment: formData.get('is_assignment') === 'on', is_final: formData.get('is_final') === 'on'
    }]);
    fetchLessons(selectedCourseId); e.target.reset();
  };

  const handleDeleteLesson = async (id) => { if (confirm('Delete lesson?')) { await supabase.from('lessons').delete().eq('id', id); fetchLessons(selectedCourseId); } };

  const handleSubmissionStatus = async (id, status) => { await supabase.from('submissions').update({ status }).eq('id', id); mutateSubmissions(); mutateStats(); };

  const handleSavePost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const postData = { title: formData.get('title'), content: formData.get('content'), thumbnail_url: formData.get('thumbnail_url'), is_published: formData.get('is_published') === 'on' };
    if (currentPost?.id) await supabase.from('posts').update(postData).eq('id', currentPost.id);
    else await supabase.from('posts').insert([postData]);
    setIsPostModalOpen(false); mutatePosts();
  };

  const handleDeletePost = async (id) => { if (confirm('Delete post?')) { await supabase.from('posts').delete().eq('id', id); mutatePosts(); } };

  // --- Quiz Handlers ---
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (currentQuiz?.id) await updateQuiz(currentQuiz.id, formData);
    else await createQuiz(formData);
    setIsQuizModalOpen(false); mutateQuizzes();
  };

  const handleDeleteQuiz = async (id) => { if (confirm('Delete quiz?')) { await deleteQuiz(id); mutateQuizzes(); } };

  const fetchQuestions = async (quizId) => {
    setSelectedQuizId(quizId);
    const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizId).order('order', { ascending: true });
    setQuizQuestions(data || []); setIsQuestionsModalOpen(true);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('quiz_id', selectedQuizId);
    await addQuestion(formData);
    fetchQuestions(selectedQuizId); e.target.reset();
  };

  const handleDeleteQuestion = async (id) => { if (confirm('Delete question?')) { await deleteQuestion(id); fetchQuestions(selectedQuizId); } };

  const fetchAttempts = async (quizId) => {
    console.log('📝 Fetching attempts for quiz ID:', quizId);
    try {
      const result = await getQuizAttempts(quizId);

      if (result.error) {
        console.error('❌ Error from getQuizAttempts:', result.error);
        alert(`خطأ في تحميل النتائج: ${result.error}`);
        return;
      }

      console.log('✅ Quiz attempts received:', result.data);
      setQuizAttempts(result.data || []);
      setIsResultsModalOpen(true);
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('حدث خطأ غير متوقع');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Clear SWR cache
      mutate(() => true, undefined, { revalidate: false });
      // Sign out using AuthContext
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 flex font-sans overflow-hidden transition-all duration-300`} dir={isRtl ? 'rtl' : 'ltr'}>

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isRtl={isRtl}
        t={t}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="flex-1 h-screen overflow-y-auto bg-slate-950 relative custom-scrollbar">
        <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white bg-slate-800 rounded-lg"><Menu size={24} /></button>
          <span className="mx-4 font-bold text-white">{t.adminPanel}</span>
        </div>

        <div className="p-6 md:p-10 w-full mx-auto">
          {activeTab === 'overview' && (
            statsLoading ? <LoadingSpinner /> : <AdminStats t={t} stats={stats || { users: 0, courses: 0, pendingAssignments: 0, certificates: 0 }} />
          )}
          {activeTab === 'courses' && (
            coursesLoading ? <LoadingSpinner /> : <CoursesManager t={t} courses={courses || []} setIsCourseModalOpen={setIsCourseModalOpen} setCurrentCourse={setCurrentCourse} fetchLessons={fetchLessons} handleDeleteCourse={handleDeleteCourse} />
          )}
          {activeTab === 'assignments' && (
            submissionsLoading ? <LoadingSpinner /> : <AssignmentsTab t={t} submissions={submissions || []} isRtl={isRtl} handleSubmissionStatus={handleSubmissionStatus} />
          )}
          {activeTab === 'quizzes' && (
            quizzesLoading || coursesLoading ? <LoadingSpinner /> : <QuizzesTab t={t} quizzes={quizzes || []} courses={courses || []} setIsQuizModalOpen={setIsQuizModalOpen} setCurrentQuiz={setCurrentQuiz} fetchQuestions={fetchQuestions} handleDeleteQuiz={handleDeleteQuiz} fetchAttempts={fetchAttempts} />
          )}
          {activeTab === 'users' && (
            usersLoading ? <LoadingSpinner /> : <UsersTab t={t} users={users || []} isRtl={isRtl} />
          )}
          {activeTab === 'leaderboard' && (
            usersLoading ? <LoadingSpinner /> : <Leaderboard users={users || []} />
          )}
          {activeTab === 'resources' && (
            materialsLoading ? <LoadingSpinner /> : <ResourcesManager materials={materials || []} fetchMaterials={mutateMaterials} />
          )}
          {activeTab === 'blog' && (
            postsLoading ? <LoadingSpinner /> : <BlogTab t={t} posts={posts || []} language={language} setCurrentPost={setCurrentPost} setIsPostModalOpen={setIsPostModalOpen} handleDeletePost={handleDeletePost} />
          )}
        </div>
      </main>

      {/* Modals */}
      {isCourseModalOpen && <CourseModal t={t} currentCourse={currentCourse} setIsCourseModalOpen={setIsCourseModalOpen} handleSaveCourse={handleSaveCourse} />}
      {isLessonModalOpen && <LessonModal t={t} lessons={lessons} setIsLessonModalOpen={setIsLessonModalOpen} handleAddLesson={handleAddLesson} handleDeleteLesson={handleDeleteLesson} />}
      {isQuizModalOpen && <QuizModal t={t} currentQuiz={currentQuiz} courses={courses} setIsQuizModalOpen={setIsQuizModalOpen} handleSaveQuiz={handleSaveQuiz} />}
      {isQuestionsModalOpen && <QuestionsModal t={t} questions={quizQuestions} setIsQuestionsModalOpen={setIsQuestionsModalOpen} handleAddQuestion={handleAddQuestion} handleDeleteQuestion={handleDeleteQuestion} />}
      {isPostModalOpen && <PostModal t={t} currentPost={currentPost} setIsPostModalOpen={setIsPostModalOpen} handleSavePost={handleSavePost} />}
      {isResultsModalOpen && <QuizResultsModal t={t} attempts={quizAttempts} setIsResultsModalOpen={setIsResultsModalOpen} />}
    </div>
  );
}
