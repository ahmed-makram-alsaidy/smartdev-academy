'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, User, ArrowLeft, ArrowRight, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, isRtl } = useLanguage();

  const t = {
    en: {
      back: "Back to Blog",
      loading: "Loading article...",
      notFound: "Article not found or has been removed.",
      by: "Admin",
      share: "Share",
      authorRole: "Tech Lead @ SmartDev",
      readTime: "min read"
    },
    ar: {
      back: "العودة للمدونة",
      loading: "جاري تحميل المقال...",
      notFound: "المقال غير موجود أو تم حذفه.",
      by: "المشرف",
      share: "مشاركة",
      authorRole: "قائد تقني @ SmartDev",
      readTime: "دقيقة قراءة"
    }
  }[language];

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Estimate read time
  const getReadTime = (text) => {
      if (!text) return 1;
      const wordsPerMinute = 200;
      const words = text.split(/\s+/).length;
      return Math.ceil(words / wordsPerMinute);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">{t.loading}</p>
        </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">{t.notFound}</h2>
        <Link href="/blog" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
            {isRtl ? <ArrowRight size={16}/> : <ArrowLeft size={16}/>} {t.back}
        </Link>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-950 text-white pt-24 pb-20 px-6 transition-all duration-300 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Reading Progress Indicator */}
        <div className="fixed top-20 left-0 w-full h-1 bg-slate-900 z-40">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 w-full origin-left transform scale-x-0 animate-[scrollProgress_1s_linear_forwards] timeline-scroll-indicator"></div>
        </div>

        <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Navigation */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
                {isRtl ? (
                    <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
                ) : (
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                )}
                <span className="font-medium">{t.back}</span>
            </Link>

            {/* Article Header */}
            <header className="mb-10 text-center md:text-start">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 font-medium justify-center md:justify-start">
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider text-xs font-bold">
                        Technology
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {getReadTime(post.content)} {t.readTime}
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl md:leading-[1.2] font-black mb-8">
                    {post.title}
                </h1>

                {/* Author Card */}
                <div className="flex items-center gap-4 border-y border-slate-800 py-6 justify-center md:justify-start">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-slate-950">
                        A
                    </div>
                    <div className="text-start">
                        <div className="font-bold text-white text-lg">{t.by}</div>
                        <div className="text-sm text-slate-500">{t.authorRole}</div>
                    </div>
                    <div className="flex-1"></div>
                    {/* Share Buttons (Desktop) */}
                    <div className="hidden md:flex gap-2">
                        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-[#1DA1F2] transition-colors"><Twitter size={20}/></button>
                        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-[#0A66C2] transition-colors"><Linkedin size={20}/></button>
                        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-[#1877F2] transition-colors"><Facebook size={20}/></button>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.thumbnail_url && (
                <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-800 group relative">
                    <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
                </div>
            )}

            {/* Content Body */}
            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose">
                {post.content ? (
                    post.content.split('\n').map((paragraph, idx) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return <br key={idx} />;
                        
                        // Simple check for "Headers" if line starts with # (Mock markdown)
                        if (trimmed.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-4">{trimmed.replace('## ', '')}</h2>;
                        if (trimmed.startsWith('# ')) return <h3 key={idx} className="text-xl font-bold text-white mt-6 mb-3">{trimmed.replace('# ', '')}</h3>;
                        
                        // Bullet points
                        if (trimmed.startsWith('- ')) return <li key={idx} className="ml-4 list-disc marker:text-blue-500 mb-2">{trimmed.replace('- ', '')}</li>;

                        return <p key={idx} className="mb-6 text-lg/8 text-slate-300">{trimmed}</p>;
                    })
                ) : (
                    <p className="text-slate-500 italic text-center">No content available.</p>
                )}
            </div>

            {/* Footer / Share (Mobile) */}
            <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{t.share}</span>
                    <Share2 size={16} className="text-slate-500"/>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-[#1DA1F2] hover:text-white hover:border-transparent transition-all group">
                        <Twitter size={18} /> 
                        <span className="text-sm font-bold">Twitter</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-[#0A66C2] hover:text-white hover:border-transparent transition-all group">
                        <Linkedin size={18} />
                        <span className="text-sm font-bold">LinkedIn</span>
                    </button>
                </div>
            </div>

        </article>
        
        {/* Style for scroll progress */}
        <style jsx global>{`
            @keyframes scrollProgress {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
            }
            .timeline-scroll-indicator {
                animation-timeline: scroll();
            }
        `}</style>
    </div>
  );
}
