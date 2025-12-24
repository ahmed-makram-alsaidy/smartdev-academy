'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import {
  CheckCircle, PlayCircle, Menu, X, FileText, Link as LinkIcon,
  Loader2, Lock, AlertCircle, ChevronLeft, ChevronRight, HelpCircle,
  Download, FolderOpen, Video
} from 'lucide-react';
import Link from 'next/link';
import QuizPlayer from './QuizPlayer';

export default function CourseInterface({ course, lessons, quizzes = [], user, initialProgress }) {
  const { language, isRtl } = useLanguage();
  const savedLessonKey = `last_lesson_${course.id}_${user.id}`;

  const [activeLesson, setActiveLesson] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(savedLessonKey);
      if (saved) {
        const found = lessons.find(l => l.id.toString() === saved);
        if (found) return found;
      }
    }
    if (initialProgress && initialProgress.length > 0) {
      const firstUnfinished = lessons.find(l => !initialProgress.includes(l.id));
      if (firstUnfinished) return firstUnfinished;
    }
    return lessons[0];
  });

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(initialProgress || []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, resources, discussion

  // Assignment State
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  const t = {
    en: {
      back: "Back to Dashboard", lessons: "Lessons", lesson: "Lesson", selectLesson: "Select a lesson to start watching",
      noDesc: "No description for this lesson.", assignment: "Practical Assignment", assignmentDesc: "Submission is required to proceed.",
      submit: "Submit Solution", submitted: "Solution Submitted", pending: "Under Review", approved: "Approved",
      uploadInst: "Upload your project to Google Drive or GitHub and paste the link below.", placeholder: "https://github.com/username/project",
      markComplete: "Mark as Completed", completed: "Completed", files: "Lesson Files", noFiles: "No files attached.",
      quizzes: "Quizzes", quiz: "Quiz", overview: "Overview", resources: "Resources", discussion: "Discussion"
    },
    ar: {
      back: "العودة للوحة التحكم", lessons: "درس", lesson: "درس", selectLesson: "اختر درساً للبدء بالمشاهدة",
      noDesc: "لا يوجد وصف لهذا الدرس.", assignment: "واجب عملي", assignmentDesc: "مطلوب تسليم الواجب للمتابعة.",
      submit: "إرسال الحل", submitted: "تم إرسال الحل", pending: "قيد المراجعة", approved: "تم القبول",
      uploadInst: "ارفع مشروعك على Google Drive أو GitHub وضع الرابط هنا.", placeholder: "https://github.com/username/project",
      markComplete: "تحديد كمكتمل", completed: "مكتمل", files: "ملفات الدرس", noFiles: "لا توجد ملفات مرفقة.",
      quizzes: "الاختبارات", quiz: "اختبار", overview: "نظرة عامة", resources: "المصادر", discussion: "المناقشة"
    }
  }[language || 'ar'];

  useEffect(() => {
    if (activeLesson) {
      localStorage.setItem(savedLessonKey, activeLesson.id.toString());
    }
  }, [activeLesson, savedLessonKey]);

  useEffect(() => {
    if (activeLesson?.is_assignment && user) {
      const checkSub = async () => {
        const { data } = await supabase.from('submissions').select('status, file_url').eq('user_id', user.id).eq('lesson_id', activeLesson.id).maybeSingle();
        if (data) { setSubmissionStatus(data.status); setSubmissionUrl(data.file_url || ''); }
        else { setSubmissionStatus(null); setSubmissionUrl(''); }
      };
      checkSub();
    } else { setSubmissionStatus(null); setSubmissionUrl(''); }
  }, [activeLesson, user, supabase]);

  const markAsCompleted = async () => {
    if (completedLessons.includes(activeLesson.id)) return;
    setLoadingComplete(true);
    try {
      const newCompleted = [...completedLessons, activeLesson.id];
      const { error } = await supabase.from('enrollments').update({ completed_lessons: newCompleted }).eq('user_id', user.id).eq('course_id', course.id);
      if (error) throw error;
      setCompletedLessons(newCompleted);
      const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);
      if (currentIndex < lessons.length - 1) setActiveLesson(lessons[currentIndex + 1]);
    } catch (error) { console.error('Error:', error); alert('حدث خطأ أثناء حفظ التقدم'); } finally { setLoadingComplete(false); }
  };

  const handleHomeworkSubmit = async (e) => {
    e.preventDefault();
    if (!submissionUrl || !user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('submissions').insert({ user_id: user.id, lesson_id: activeLesson.id, file_url: submissionUrl, status: 'pending' });
      if (error) throw error;
      setSubmissionStatus('pending'); alert(t.submitted);
    } catch (err) { alert("Error: " + err.message); } finally { setSubmitting(false); }
  };

  const isYouTube = activeLesson?.video_url?.includes('youtube.com') || activeLesson?.video_url?.includes('youtu.be');
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    else if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    return url;
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-slate-950 text-slate-200 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Mobile Menu Toggle - Improved positioning */}
      <button
        className={`md:hidden fixed top-20 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all ${isRtl ? 'left-4' : 'right-4'} ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main Content Area (Video + Details) */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
        {activeQuiz ? (
          <div className="w-full h-full p-6">
            <button onClick={() => setActiveQuiz(null)} className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={20} className={isRtl ? "rotate-180" : ""} /> العودة للدروس
            </button>
            <QuizPlayer quiz={activeQuiz} user={user} onComplete={() => { }} />
          </div>
        ) : activeLesson ? (
          <>
            {/* Video Player */}
            <div className="w-full bg-black aspect-video relative shadow-2xl z-10">
              {activeLesson.video_url ? (
                isYouTube ? (
                  <iframe src={getEmbedUrl(activeLesson.video_url)} className="w-full h-full" allowFullScreen title={activeLesson.title}></iframe>
                ) : (
                  <video controls className="w-full h-full" src={activeLesson.video_url} poster={course.thumbnail_url}>Browser not supported.</video>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 backdrop-blur-sm">
                  <PlayCircle size={64} className="mb-4 opacity-20" />
                  <p>{t.selectLesson}</p>
                </div>
              )}
            </div>

            {/* Content Tabs & Details */}
            <div className="flex-1 bg-slate-950 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{activeLesson.title}</h1>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">Lesson {activeLesson.order}</span>
                    {activeLesson.is_assignment && <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-xs border border-purple-500/20">{t.assignment}</span>}
                  </div>
                </div>
                <button
                  onClick={markAsCompleted}
                  disabled={loadingComplete || completedLessons.includes(activeLesson.id)}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${completedLessons.includes(activeLesson.id)
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20 hover:-translate-y-0.5'
                    }`}
                >
                  {loadingComplete ? <Loader2 className="animate-spin" /> : completedLessons.includes(activeLesson.id) ? <><CheckCircle size={18} /> {t.completed}</> : t.markComplete}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 sm:gap-6 border-b border-slate-800 mb-6 overflow-x-auto">
                <button onClick={() => setActiveTab('overview')} className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>{t.overview}</button>
                <button onClick={() => setActiveTab('resources')} className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'resources' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>{t.resources}</button>
              </div>

              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="prose prose-invert max-w-none text-slate-300 mb-10">
                    {activeLesson.content ? <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} /> : <p className="text-slate-500 italic">{t.noDesc}</p>}
                  </div>

                  {activeLesson.is_assignment && (
                    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden mt-8">
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><FileText size={24} /></div>
                        <div><h3 className="text-xl font-bold text-white">{t.assignment}</h3><p className="text-sm text-slate-400">{t.assignmentDesc}</p></div>
                      </div>
                      {submissionStatus === 'approved' ? (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3"><CheckCircle size={20} /> <span>{t.approved}</span></div>
                      ) : (
                        <div className="space-y-4 relative z-10">
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-400"><h4 className="font-bold text-white mb-2 flex items-center gap-2"><AlertCircle size={16} /> {t.uploadInst}</h4></div>
                          <form onSubmit={handleHomeworkSubmit} className="flex flex-col gap-3">
                            <div className="relative flex-1">
                              <div className={`absolute top-3.5 text-slate-500 ${isRtl ? 'left-3' : 'right-3'}`}><LinkIcon size={18} /></div>
                              <input type="url" required disabled={submissionStatus === 'pending'} value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} className={`w-full bg-slate-950 border border-slate-700 rounded-xl py-3 text-sm sm:text-base text-white focus:border-purple-500 outline-none transition-colors ${isRtl ? 'pl-10 pr-4' : 'pl-4 pr-10'}`} placeholder={t.placeholder} />
                            </div>
                            <button type="submit" disabled={submitting || submissionStatus === 'pending'} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base">{submitting ? <Loader2 className="animate-spin" size={18} /> : submissionStatus === 'pending' ? t.pending : t.submit}</button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FolderOpen className="text-blue-500" size={20} /> {t.files}</h3>
                    <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                      <Download size={32} className="mx-auto mb-2 opacity-50" />
                      <p>{t.noFiles}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <PlayCircle size={64} className="mb-4 opacity-20" />
            <p>{t.selectLesson}</p>
          </div>
        )}
      </main>

      {/* Sidebar (Playlist) */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden')}
        fixed md:relative inset-y-0 w-96 bg-slate-900 border-r border-l border-slate-800 z-40 transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none
        ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}
      `}>
        <div className="p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors group">
            {isRtl ? <ChevronRight size={16} className="group-hover:-translate-x-1 transition-transform" /> : <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />} {t.back}
          </Link>
          <h2 className="font-bold text-white text-lg line-clamp-1 mb-4" title={course.title}>{course.title}</h2>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>{Math.round((completedLessons.length / lessons.length) * 100)}% {t.completed}</span>
              <span>{completedLessons.length}/{lessons.length}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-2 space-y-1">
            {lessons.map((lesson, index) => {
              const isActive = activeLesson?.id === lesson.id;
              const isCompleted = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => { setActiveLesson(lesson); setActiveQuiz(null); if (window.innerWidth < 768) setSidebarOpen(false); }}
                  className={`w-full text-start p-4 rounded-xl flex items-start gap-4 transition-all border ${isActive
                    ? 'bg-blue-600/10 border-blue-600/20'
                    : 'bg-transparent border-transparent hover:bg-slate-800'
                    }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? <CheckCircle size={18} className="text-green-500" /> : isActive ? <PlayCircle size={18} className="text-blue-500" /> : <Lock size={18} className="text-slate-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{t.lesson} {index + 1}</span>
                      {lesson.is_assignment && <span className="bg-purple-500/10 text-purple-400 text-[10px] px-1.5 py-0.5 rounded border border-purple-500/20">Assignment</span>}
                    </div>
                    <h4 className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>{lesson.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Video size={12} /> <span>Video Lesson</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {quizzes.length > 0 && (
            <div className="mt-2 pt-4 border-t border-slate-800 p-2">
              <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.quizzes}</h3>
              {quizzes.map((quiz, index) => {
                const isActive = activeQuiz?.id === quiz.id;
                return (
                  <button
                    key={quiz.id}
                    onClick={() => { setActiveQuiz(quiz); setActiveLesson(null); if (window.innerWidth < 768) setSidebarOpen(false); }}
                    className={`w-full text-start p-4 rounded-xl flex items-start gap-4 transition-all border ${isActive
                      ? 'bg-purple-600/10 border-purple-600/20'
                      : 'bg-transparent border-transparent hover:bg-slate-800'
                      }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <HelpCircle size={18} className={isActive ? "text-purple-400" : "text-slate-600"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-purple-400' : 'text-slate-500'}`}>{t.quiz} {index + 1}</span>
                      </div>
                      <h4 className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>{quiz.title}</h4>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
