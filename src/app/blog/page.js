'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, isRtl } = useLanguage();

  const t = {
    en: {
      title: "Tech Insights & Tutorials",
      subtitle: "Stay updated with the latest in development, programming tips, and academy news.",
      readMore: "Read Article",
      noPosts: "No posts found yet. Check back later!",
      loading: "Loading articles...",
      by: "By Admin"
    },
    ar: {
      title: "رؤى تقنية ودروس",
      subtitle: "ابقى على اطلاع بآخر مستجدات التطوير، نصائح البرمجة، وأخبار الأكاديمية.",
      readMore: "اقرأ المقال",
      noPosts: "لا توجد مقالات منشورة بعد. عد لاحقاً!",
      loading: "جاري تحميل المقالات...",
      by: "بواسطة المشرف"
    }
  }[language];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className={`min-h-screen bg-slate-950 text-white pt-24 pb-20 px-6 transition-all duration-300 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {t.title}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {t.subtitle}
            </p>
        </div>

        {/* Content */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="h-[400px] bg-slate-900 rounded-2xl animate-pulse border border-slate-800"></div>
             ))}
           </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article 
                key={post.id} 
                className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/blog/${post.id}`} className="block h-48 overflow-hidden bg-slate-800 relative">
                  {post.thumbnail_url ? (
                    <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                        <span className="text-4xl font-black opacity-20">SmartDev</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                </Link>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full">
                        <Calendar size={12} />
                        {new Date(post.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                    <span className="flex items-center gap-1">
                        <User size={12} />
                        {t.by}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  
                  <p className="text-slate-400 line-clamp-3 mb-6 text-sm leading-relaxed flex-1">
                    {post.content?.substring(0, 150)}...
                  </p>
                  
                  <Link href={`/blog/${post.id}`} className="flex items-center gap-2 text-white font-bold text-sm bg-blue-600/10 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg w-fit transition-all mt-auto">
                    {t.readMore} {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <h3 className="text-2xl font-bold text-slate-500">{t.noPosts}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
