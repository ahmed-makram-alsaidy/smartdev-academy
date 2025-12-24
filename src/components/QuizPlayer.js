'use client';

import { useState, useEffect } from 'react';
import { getQuizQuestions, submitQuiz } from '@/app/actions/quiz';
import { Loader2, CheckCircle, XCircle, Clock, AlertTriangle, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function QuizPlayer({ quiz, user, onComplete }) {
    const { language } = useLanguage();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [startTime, setStartTime] = useState(null);

    const t = {
        en: {
            loading: "Loading Quiz...",
            submit: "Submit Answers",
            submitting: "Submitting...",
            passed: "Congratulations!",
            failed: "Keep Trying!",
            score: "Your Score",
            question: "Question",
            timeLimit: "Time Limit",
            mins: "mins",
            instructions: "Please answer all questions before submitting.",
            tryAgain: "Try Again",
            greatJob: "Great job! You passed!",
            reviewMaterial: "Review the material and try again."
        },
        ar: {
            loading: "جاري تحميل الاختبار...",
            submit: "تسليم الإجابات",
            submitting: "جاري التسليم...",
            passed: "مبروك!",
            failed: "حاول مرة أخرى!",
            score: "درجتك",
            question: "السؤال",
            timeLimit: "الوقت المحدد",
            mins: "دقيقة",
            instructions: "يرجى الإجابة على جميع الأسئلة قبل التسليم.",
            tryAgain: "حاول مرة أخرى",
            greatJob: "أحسنت! لقد اجتزت الاختبار",
            reviewMaterial: "راجع المادة وحاول مرة أخرى"
        }
    }[language || 'ar'];

    useEffect(() => {
        const loadQuestions = async () => {
            const { data, error } = await getQuizQuestions(quiz.id);
            if (!error && data) {
                setQuestions(data);
                setStartTime(Date.now());
            }
            setLoading(false);
        };
        loadQuestions();
    }, [quiz.id]);

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            alert(t.instructions);
            return;
        }

        setSubmitting(true);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const res = await submitQuiz(quiz.id, { ...answers, timeTaken });
        setSubmitting(false);

        if (!res.error) {
            setResult(res);
            if (onComplete && res.passed) onComplete(quiz.id);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-500 w-12 h-12 mb-4" />
                <p className="text-slate-400">{t.loading}</p>
            </div>
        );
    }

    if (result) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto p-4 sm:p-8"
            >
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl border border-slate-700 p-6 sm:p-10 text-center shadow-2xl">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mb-6"
                    >
                        {result.passed ? (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                                <XCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                            </div>
                        )}
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-4xl font-black text-white mb-3"
                    >
                        {result.passed ? t.passed : t.failed}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm sm:text-base text-slate-400 mb-8"
                    >
                        {result.passed ? t.greatJob : t.reviewMaterial}
                    </motion.p>

                    {/* Score Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-950 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 border border-slate-800"
                    >
                        <p className="text-slate-400 text-xs sm:text-sm mb-2 uppercase tracking-wide">{t.score}</p>
                        <div className="flex items-baseline justify-center gap-2 mb-4">
                            <span className="text-5xl sm:text-7xl font-black text-white">{result.score}</span>
                            <span className="text-2xl sm:text-3xl text-slate-500">/ {result.maxScore}</span>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold ${result.passed
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                                : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            <TrendingUp size={18} />
                            {Math.round(result.percentage)}%
                        </div>
                    </motion.div>

                    {/* Try Again Button */}
                    {!result.passed && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={() => {
                                setResult(null);
                                setAnswers({});
                                setStartTime(Date.now());
                            }}
                            className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-500/50"
                        >
                            {t.tryAgain}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8 sticky top-16 sm:top-20 bg-slate-950/95 backdrop-blur-md z-10 pb-4 border-b border-slate-800">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">{quiz.title}</h1>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                    {quiz.time_limit_minutes > 0 && (
                        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs sm:text-sm">
                            <Clock size={14} className="text-primary-400" />
                            <span className="text-slate-300">{quiz.time_limit_minutes} {t.mins}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs sm:text-sm">
                        <AlertTriangle size={14} className="text-yellow-400" />
                        <span className="text-slate-300">{questions.length} {t.question}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs sm:text-sm">
                        <Award size={14} className="text-green-400" />
                        <span className="text-slate-300">{answeredCount}/{questions.length}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-4 sm:space-y-6">
                {questions.map((q, index) => {
                    const isAnswered = answers[q.id] !== undefined;

                    return (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-slate-900 rounded-xl sm:rounded-2xl border transition-all ${isAnswered ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-slate-800'
                                }`}
                        >
                            <div className="p-4 sm:p-6">
                                {/* Question Header */}
                                <div className="flex gap-3 sm:gap-4 mb-4">
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm sm:text-base font-bold ${isAnswered
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className="flex-1 text-base sm:text-lg font-bold text-white leading-relaxed">
                                        {q.question_text}
                                    </h3>
                                </div>

                                {/* Options */}
                                <div className="space-y-2 sm:space-y-3">
                                    {q.options.map((opt, i) => {
                                        const isObject = typeof opt === 'object' && opt !== null;
                                        const optionText = isObject ? opt.text : opt;
                                        const optionValue = isObject ? opt.value : opt;
                                        const isSelected = answers[q.id] === optionValue;

                                        return (
                                            <motion.label
                                                key={i}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                        ? 'bg-primary-600/10 border-primary-500 shadow-lg shadow-primary-500/20'
                                                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-slate-600'
                                                        }`}>
                                                        {isSelected && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white" />}
                                                    </div>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    value={optionValue}
                                                    checked={isSelected}
                                                    onChange={() => handleOptionSelect(q.id, optionValue)}
                                                    className="hidden"
                                                />
                                                <span className={`flex-1 text-sm sm:text-base ${isSelected ? 'text-white font-medium' : 'text-slate-300'
                                                    }`}>
                                                    {optionText}
                                                </span>
                                            </motion.label>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 mt-8 sm:mt-10 bg-slate-950/95 backdrop-blur-md py-4 border-t border-slate-800">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || answeredCount < questions.length}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-600 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            {t.submitting}
                        </>
                    ) : (
                        t.submit
                    )}
                </button>
                {answeredCount < questions.length && (
                    <p className="text-center text-xs sm:text-sm text-slate-500 mt-2">
                        {t.instructions}
                    </p>
                )}
            </div>
        </div>
    );
}
