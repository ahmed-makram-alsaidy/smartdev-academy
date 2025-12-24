'use client';

import { X, Trash2 } from 'lucide-react';

export function CourseModal({ t, currentCourse, setIsCourseModalOpen, handleSaveCourse }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{currentCourse ? t.editCourse : t.createCourse}</h2>
                    <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>
                <form onSubmit={handleSaveCourse} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{t.title}</label>
                        <input name="title" defaultValue={currentCourse?.title} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{t.slug}</label>
                        <input name="slug" defaultValue={currentCourse?.slug} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{t.price}</label>
                            <input name="price" type="number" defaultValue={currentCourse?.price} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{t.thumbnail}</label>
                            <input name="thumbnail_url" defaultValue={currentCourse?.thumbnail_url} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{t.description}</label>
                        <textarea name="description" defaultValue={currentCourse?.description} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors h-24" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_published" defaultChecked={currentCourse?.is_published} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600 focus:ring-primary-500" />
                            <label className="text-white text-sm">{t.publish}</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="has_certificate" defaultChecked={currentCourse?.has_certificate} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600 focus:ring-primary-500" />
                            <label className="text-white text-sm">Has Certificate?</label>
                        </div>
                    </div>
                    <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary-600/20">{t.save}</button>
                </form>
            </div>
        </div>
    );
}

export function LessonModal({ t, lessons, setIsLessonModalOpen, handleAddLesson, handleDeleteLesson }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-white/10 p-6 h-[80vh] flex flex-col shadow-2xl">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">{t.manageLessons}</h2>
                    <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>

                <div className="flex-1 overflow-y-auto mb-6 space-y-2 custom-scrollbar pr-2">
                    {lessons.map((l, i) => (
                        <div key={l.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-colors">
                            <span className="text-slate-200 font-medium"><span className="text-slate-500 mr-2">{i + 1}.</span> {l.title}</span>
                            <button onClick={() => handleDeleteLesson(l.id)} className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {lessons.length === 0 && <p className="text-center text-slate-500 py-4">{t.noLessons}</p>}
                </div>

                <form onSubmit={handleAddLesson} className="space-y-4 border-t border-white/10 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" placeholder={t.lessonTitle} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                        <input name="video_url" placeholder={t.videoUrl} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                    </div>
                    <textarea name="content" placeholder={t.content} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors h-20" />
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_assignment" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600" />
                            <label className="text-slate-300 text-sm">{t.isAssignment}</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_final" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600" />
                            <label className="text-slate-300 text-sm">{t.isFinal}</label>
                        </div>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-green-600/20">{t.addLesson}</button>
                </form>
            </div>
        </div>
    );
}

export function QuizModal({ t, currentQuiz, courses, setIsQuizModalOpen, handleSaveQuiz }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{currentQuiz ? t.editQuiz : t.createQuiz}</h2>
                    <button onClick={() => setIsQuizModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>
                <form onSubmit={handleSaveQuiz} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{t.title}</label>
                        <input name="title" defaultValue={currentQuiz?.title} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Course</label>
                        <select name="course_id" defaultValue={currentQuiz?.course_id} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required>
                            <option value="">Select Course</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{t.timeLimit}</label>
                            <input name="time_limit_minutes" type="number" defaultValue={currentQuiz?.time_limit_minutes} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{t.passingScore}</label>
                            <input name="passing_score" type="number" defaultValue={currentQuiz?.passing_score} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_published" defaultChecked={currentQuiz?.is_published} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600" />
                        <label className="text-white text-sm">{t.publish}</label>
                    </div>
                    <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary-600/20">{t.save}</button>
                </form>
            </div>
        </div>
    );
}

export function QuestionsModal({ t, questions, setIsQuestionsModalOpen, handleAddQuestion, handleDeleteQuestion }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-3xl rounded-2xl border border-white/10 p-6 h-[85vh] flex flex-col shadow-2xl">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">{t.questions}</h2>
                    <button onClick={() => setIsQuestionsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar pr-2">
                    {questions.map((q, i) => (
                        <div key={q.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-white text-lg">{i + 1}. {q.question_text}</h4>
                                <button onClick={() => handleDeleteQuestion(q.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                                {q.options?.map((opt, idx) => {
                                    const isObject = typeof opt === 'object' && opt !== null;
                                    const optionText = isObject ? opt.text : opt;
                                    const optionValue = isObject ? opt.value : opt;
                                    const isCorrect = optionValue === q.correct_answer;

                                    return (
                                        <span key={idx} className={`p-2 rounded ${isCorrect ? 'bg-green-500/10 text-green-400 font-bold border border-green-500/20' : 'bg-slate-900'}`}>
                                            {optionText}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    {questions.length === 0 && <p className="text-center text-slate-500 py-4">No questions yet.</p>}
                </div>

                <form onSubmit={handleAddQuestion} className="space-y-3 border-t border-white/10 pt-4">
                    <input name="question_text" placeholder={t.questionText} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                    <div className="grid grid-cols-2 gap-3">
                        <input name="option1" placeholder={t.option1} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-primary-500 outline-none" required />
                        <input name="option2" placeholder={t.option2} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-primary-500 outline-none" required />
                        <input name="option3" placeholder={t.option3} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-primary-500 outline-none" />
                        <input name="option4" placeholder={t.option4} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-primary-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input name="correct_answer" placeholder={t.correctAnswer} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-primary-500 outline-none" required />
                        <input name="points" type="number" placeholder={t.points} defaultValue={10} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-primary-500 outline-none" />
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-green-600/20">{t.addQuestion}</button>
                </form>
            </div>
        </div>
    );
}

export function PostModal({ t, currentPost, setIsPostModalOpen, handleSavePost }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-3xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{currentPost ? t.editPost : t.createPost}</h2>
                    <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>
                <form onSubmit={handleSavePost} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{t.title}</label>
                        <input name="title" defaultValue={currentPost?.title} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{t.thumbnail}</label>
                        <input name="thumbnail_url" defaultValue={currentPost?.thumbnail_url} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{t.content}</label>
                        <textarea name="content" defaultValue={currentPost?.content} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-primary-500 outline-none transition-colors h-40" required />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_published" defaultChecked={currentPost?.is_published} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600" />
                        <label className="text-white text-sm">{t.publish}</label>
                    </div>
                    <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary-600/20">{t.save}</button>
                </form>
            </div>
        </div>
    );
}

export function QuizResultsModal({ t, attempts, setIsResultsModalOpen }) {
    console.log('🎯 QuizResultsModal rendered with attempts:', attempts);
    console.log('📊 Attempts count:', attempts?.length || 0);

    const formatTime = (seconds) => {
        if (!seconds) return '-';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-white/10 p-6 h-[80vh] flex flex-col shadow-2xl">
                <div className="flex justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Quiz Results</h2>
                        <p className="text-sm text-slate-400 mt-1">عدد المحاولات: {attempts?.length || 0}</p>
                    </div>
                    <button onClick={() => setIsResultsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-sm">
                                <th className="p-3">Student</th>
                                <th className="p-3">Score</th>
                                <th className="p-3">Time Taken</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            {attempts.map((attempt) => (
                                <tr key={attempt.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <td className="p-3">
                                        <div className="font-bold text-white">{attempt.users?.full_name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500">{attempt.users?.email}</div>
                                    </td>
                                    <td className="p-3 font-bold text-white">{attempt.score}</td>
                                    <td className="p-3 font-mono text-sm text-blue-400">{formatTime(attempt.time_taken)}</td>
                                    <td className="p-3 text-sm text-slate-500">{new Date(attempt.started_at).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${attempt.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {attempt.passed ? 'Passed' : 'Failed'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!attempts || attempts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <div className="text-slate-500">
                                            <p className="text-lg font-bold mb-2">لا توجد محاولات</p>
                                            <p className="text-sm">لم يقم أي طالب بحل هذا الاختبار بعد</p>
                                            {console.log('⚠️ No attempts to display')}
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
