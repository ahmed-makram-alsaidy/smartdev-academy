'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import { Download, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Great_Vibes, Cinzel, Cairo } from 'next/font/google';

// تحميل الخطوط
const greatVibes = Great_Vibes({ subsets: ['latin'], weight: '400' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700', '900'] });
const cairo = Cairo({ subsets: ['latin', 'arabic'] });

export default function CertificatePage() {
  const { slug } = useParams();
  const router = useRouter();
  const containerRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [data, setData] = useState({ studentName: '', courseName: '', date: '' });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    async function validateCertificate() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data: course } = await supabase.from('courses').select('id, title, slug').eq('slug', slug).single();
      if (!course) return;

      const { count: totalLessons } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course.id);

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('completed_lessons')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single();

      const completedCount = enrollment?.completed_lessons?.length || 0;

      if (totalLessons > 0 && completedCount >= totalLessons) {
        setValid(true);
        setData({
          studentName: user.user_metadata?.full_name || user.email.split('@')[0],
          courseName: course.title,
          date: new Date().toLocaleDateString('en-GB'),
          serial: `SD-${course.id}-${user.id.slice(0, 8).toUpperCase()}`
        });
      }
      setLoading(false);
    }
    validateCertificate();
  }, [slug, router]);

  // حساب نسبة التصغير (Scale) لتناسب شاشة الموبايل
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = window.innerWidth;
        const certificateWidth = 1000; 
        const padding = 32; 
        
        const newScale = Math.min((parentWidth - padding) / certificateWidth, 1);
        setScale(newScale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, [valid]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-4">
      <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      <p>جاري صياغة الشهادة...</p>
    </div>
  );

  if (!valid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-center px-4">
        <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
            <CheckCircle className="text-red-500 w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">عذراً، لم تكمل الكورس بعد</h1>
        <p className="text-slate-400 mb-8 max-w-md">الشهادة هي جائزة الملتزمين. أكمل جميع الدروس والواجبات لفتح هذه الصفحة.</p>
        <Button onClick={() => router.push('/dashboard')}>العودة للوحة القيادة</Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen bg-slate-900 flex flex-col items-center py-8 ${cairo.className} print:bg-white print:p-0 print:block`}>
      
      {/* ستايل خاص للطباعة فقط */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            visibility: hidden; /* إخفاء كل شيء مبدئياً */
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* إظهار حاوية الشهادة ومحتوياتها */
          .certificate-container, .certificate-container * {
            visibility: visible;
          }

          .certificate-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0;
            padding: 0;
            transform: none !important; /* إلغاء التصغير عند الطباعة */
            z-index: 9999;
            background: white;
          }

          /* إجبار الشهادة على ملء الصفحة */
          .certificate-content {
            width: 100% !important;
            height: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          /* إخفاء الأزرار */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* الشريط العلوي */}
      <div className="w-full max-w-[1000px] flex justify-between items-center mb-8 px-4 no-print">
        <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> العودة للكورسات
        </button>
        <Button onClick={handlePrint} variant="primary" className="bg-gradient-to-r from-yellow-600 to-yellow-500 border-none text-black font-bold shadow-lg shadow-yellow-900/20">
          <Download size={18} /> تحميل / طباعة الشهادة
        </Button>
      </div>

      {/* حاوية التصغير (Scaling Wrapper) */}
      <div 
        ref={containerRef}
        className="certificate-container relative origin-top transition-transform duration-300 print:transform-none print:w-full print:h-full"
        style={{ 
          transform: `scale(${scale})`,
          width: '1000px', // عرض ثابت للشهادة
          height: '707px', // ارتفاع يتناسب مع A4 (1.414 aspect ratio)
          marginBottom: `-${(1 - scale) * 707}px` // إزالة الفراغ السفلي الناتج عن التصغير
        }}
      >
        {/* جسم الشهادة (ثابت الأبعاد) */}
        <div className="certificate-content bg-[#fffcf5] text-slate-900 w-full h-full relative shadow-2xl overflow-hidden mx-auto border border-slate-200">
          
          {/* إطار مزخرف خارجي */}
          <div className="absolute inset-2 border-4 border-slate-900"></div>
          {/* إطار ذهبي داخلي */}
          <div className="absolute inset-4 border-[3px] border-[#c5a059]"></div>
          
          {/* زخارف الزوايا */}
          <div className="absolute top-4 left-4 w-32 h-32 border-t-[8px] border-l-[8px] border-slate-900"></div>
          <div className="absolute top-6 left-6 w-28 h-28 border-t-[2px] border-l-[2px] border-[#c5a059]"></div>

          <div className="absolute bottom-4 right-4 w-32 h-32 border-b-[8px] border-r-[8px] border-slate-900"></div>
          <div className="absolute bottom-6 right-6 w-28 h-28 border-b-[2px] border-r-[2px] border-[#c5a059]"></div>
          
          {/* خلفية مائية */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* المحتوى */}
          <div className="relative h-full flex flex-col items-center justify-center text-center p-12 z-10">
            
            {/* العنوان */}
            <div className="mb-2">
              <h2 className={`${cinzel.className} text-6xl font-black text-slate-800 tracking-[0.2em] uppercase`}>
                Certificate
              </h2>
              <p className={`${cinzel.className} text-2xl text-[#c5a059] font-bold tracking-[0.3em] uppercase mt-2`}>
                Of Completion
              </p>
            </div>

            <div className="w-24 h-1 bg-slate-900 my-8"></div>

            {/* نص التقديم */}
            <p className={`${cinzel.className} text-slate-500 text-lg uppercase tracking-widest mb-4`}>
              This certifies that
            </p>

            {/* اسم الطالب */}
            <h1 className={`${greatVibes.className} text-8xl text-slate-900 mb-6 py-2 px-12 relative inline-block min-w-[300px]`}>
              {data.studentName}
              <div className="absolute bottom-4 left-10 right-10 h-[1px] bg-slate-300"></div>
            </h1>

            {/* نص الكورس */}
            <p className={`${cinzel.className} text-slate-500 text-sm uppercase tracking-widest mb-4`}>
              Has successfully completed the curriculum for
            </p>

            <h3 className="text-4xl font-bold text-[#b08d55] mb-6 max-w-3xl leading-snug px-4" dir="rtl">
              {data.courseName}
            </h3>

            <p className="text-slate-600 max-w-2xl text-sm leading-relaxed opacity-80 mb-12">
              وقد أظهر الطالب التزاماً استثنائياً واكتسب المهارات العملية اللازمة، مجتازاً جميع الاختبارات والواجبات المطلوبة في <strong>SmartDev Academy</strong>.
            </p>

            {/* التوقيعات */}
            <div className="w-full max-w-4xl flex justify-between items-end mt-auto px-12 pb-8">
              
              {/* توقيع المدرب */}
              <div className="text-center w-1/3">
                <div className={`${greatVibes.className} text-4xl text-blue-900 mb-2 transform -rotate-6`}>
                  Ahmed Alsaidy
                </div>
                <div className="w-full h-[2px] bg-slate-800 mx-auto"></div>
                <p className={`${cinzel.className} text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest`}>
                  Lead Instructor
                </p>
              </div>

              {/* الختم الذهبي */}
              <div className="relative transform translate-y-4">
                <div className="w-32 h-32 bg-[#c5a059] rounded-full flex items-center justify-center shadow-lg relative overflow-hidden border-4 border-double border-white/50">
                   <div className="absolute inset-0 border-[1px] border-white rounded-full m-1 opacity-50"></div>
                   <div className={`${cinzel.className} text-white font-black text-center text-[10px] leading-tight opacity-90`}>
                      SMARTDEV<br/>ACADEMY<br/><span className="text-[8px]">OFFICIAL SEAL</span>
                   </div>
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full"></div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 -z-10">
                   <div className="w-8 h-12 bg-red-800 rotate-12 absolute left-0 border-b-8 border-transparent border-l-8 border-red-900"></div>
                   <div className="w-8 h-12 bg-red-800 -rotate-12 absolute right-0 border-b-8 border-transparent border-r-8 border-red-900"></div>
                </div>
              </div>

              {/* التاريخ */}
              <div className="text-center w-1/3">
                <div className="text-xl font-serif text-slate-800 mb-2">
                  {data.date}
                </div>
                <div className="w-full h-[2px] bg-slate-800 mx-auto"></div>
                <p className={`${cinzel.className} text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest`}>
                  Date Issued
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {data.serial}</p>
              </div>

            </div>

          </div>
        </div>
      </div>
      
      <p className="text-slate-500 mt-8 text-sm no-print opacity-50">
        💡 نصيحة: تأكد من تفعيل "Background Graphics" عند الطباعة.
      </p>

    </div>
  );
}