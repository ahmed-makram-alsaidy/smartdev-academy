'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/Button';
import { 
  Code, Rocket, CheckCircle, Shield, Zap, Users, ArrowRight, Star, 
  Terminal, Globe, Cpu, ChevronDown, Layout, Server, Database, PlayCircle, Instagram, Twitter, Linkedin
} from 'lucide-react';

export default function Home() {
  // حالة لفتح وإغلاق الأسئلة الشائعة
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* --- 1. Hero Section (الواجهة الرئيسية) --- */}
      <section className="relative w-full pt-32 pb-20 flex flex-col items-center text-center px-4 md:px-6">
        
        {/* خلفية متحركة */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
        
        {/* شارة تشجيعية */}
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium text-blue-400 mb-8 hover:border-blue-500/50 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>الدفعة القادمة تبدأ قريباً - احجز مكانك</span>
        </div>
        
        {/* العنوان الرئيسي */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-[1.1] max-w-5xl mx-auto">
          احترف البرمجة.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            ابنِ المستقبل.
          </span>
        </h1>
        
        {/* الوصف */}
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          منصة <span className="text-white font-bold">SmartDev</span> ليست مجرد كورسات، بل بيئة عمل تحاكي الشركات العالمية. تعلم بالممارسة، ابنِ مشاريع حقيقية، واستعد لسوق العمل.
        </p>
        
        {/* أزرار الدعوة للعمل */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto relative z-10">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1">
              🚀 ابدأ رحلتك مجاناً
            </Button>
          </Link>
          <Link href="#tracks" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 bg-slate-900/50 backdrop-blur-md border border-slate-700 hover:bg-slate-800 rounded-xl">
              تصفح المسارات
            </Button>
          </Link>
        </div>

        {/* شريط الإحصائيات */}
        <div className="mt-20 w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-10">
            {[
                { label: 'طالب نشط', value: '+5,000', icon: Users },
                { label: 'مشروع تخرج', value: '+1,200', icon: Rocket },
                { label: 'ساعة محتوى', value: '+400', icon: PlayCircle },
                { label: 'توظيف', value: '94%', icon: CheckCircle },
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <stat.icon className="w-6 h-6 text-slate-500" />
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                    <span className="text-slate-500 text-sm">{stat.label}</span>
                </div>
            ))}
        </div>
      </section>

      {/* --- 2. Why Us (المميزات) --- */}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">لماذا تختار <span className="text-blue-500">SmartDev</span>؟</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">نحن نردم الفجوة بين التعليم الأكاديمي واحتياجات سوق العمل الحقيقية.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Terminal size={40} />}
              title="تطبيق عملي 100%"
              desc="لا وقت للنظريات المملة. ستكتب الكود من اليوم الأول وتبني مشاريع تضعها في معرض أعمالك."
              color="blue"
            />
            <FeatureCard 
              icon={<Shield size={40} />}
              title="Code Reviews"
              desc="فريق من الخبراء يراجع كودك سطرًا بسطر ويعطيك ملاحظات لتحسين أدائك وجودة برمجتك."
              color="purple"
            />
            <FeatureCard 
              icon={<Globe size={40} />}
              title="مجتمع تقني"
              desc="انضم لمجتمع من المبرمجين الشغوفين. شارك مشاكلك، ساعد غيرك، وابنِ شبكة علاقات قوية."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* --- 3. Tracks (المسارات التعليمية) --- */}
      <section id="tracks" className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">اختر مسارك</h2>
               <p className="text-slate-400 max-w-xl">مسارات تعليمية متكاملة تأخذك من الصفر وحتى الاحتراف.</p>
            </div>
            <Link href="/login">
                <Button variant="outline" className="gap-2">عرض كل الكورسات <ArrowRight size={16}/></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TrackCard 
              title="Frontend Developer"
              level="مبتدأ -> محترف"
              lessons="120 درس"
              icon={<Layout size={32} className="text-blue-400"/>}
              techs={['HTML', 'CSS', 'React', 'Next.js']}
              gradient="from-blue-500/10 to-blue-600/5"
            />
            <TrackCard 
              title="Backend Master"
              level="متوسط"
              lessons="95 درس"
              icon={<Server size={32} className="text-green-400"/>}
              techs={['Node.js', 'Express', 'PostgreSQL', 'Docker']}
              gradient="from-green-500/10 to-green-600/5"
            />
            <TrackCard 
              title="Fullstack Hero"
              level="شامل"
              lessons="215 درس"
              icon={<Database size={32} className="text-purple-400"/>}
              techs={['MERN Stack', 'Supabase', 'DevOps', 'Security']}
              gradient="from-purple-500/10 to-purple-600/5"
            />
          </div>
        </div>
      </section>

      {/* --- 4. Interactive Preview (معاينة النظام) --- */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
           <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-white leading-tight">
                  تعلم. <span className="text-blue-500">طبق.</span> شارك.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                  منهجيتنا تعتمد على الـ "Micro-Learning". دروس قصيرة، تحديات فورية، ومشاريع ضخمة. هكذا تبني الذاكرة العضلية للبرمجة.
              </p>
              <ul className="space-y-4">
                  {['دروس فيديو بجودة 4K', 'محرر أكواد مدمج (قريباً)', 'شهادات معتمدة'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300">
                          <CheckCircle className="text-blue-500" size={20} /> {item}
                      </li>
                  ))}
              </ul>
           </div>
           
           <div className="flex-1 w-full relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
               <div className="relative bg-[#0d1117] border border-slate-700 rounded-xl p-6 shadow-2xl">
                   <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                       <div className="w-3 h-3 rounded-full bg-red-500"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
                       <code>
                           <span className="text-purple-400">const</span> <span className="text-blue-400">Dream</span> = <span className="text-yellow-400">async</span> () ={'>'} {'{'}<br/>
                           &nbsp;&nbsp;<span className="text-slate-500">// هل أنت جاهز للتغيير؟</span><br/>
                           &nbsp;&nbsp;<span className="text-purple-400">await</span> student.<span className="text-blue-300">learn</span>(<span className="text-green-300">'SmartDev'</span>);<br/>
                           &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-green-300">'Software Engineer'</span>;<br/>
                           {'}'}
                       </code>
                   </pre>
               </div>
           </div>
        </div>
      </section>

      {/* --- 5. Testimonials (آراء الطلاب) --- */}
      <section className="py-24 px-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-16">قصص نجاح من قلب المنصة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <TestimonialCard 
                    name="أحمد محمد"
                    role="Frontend Developer @ Startup"
                    text="المحتوى هنا يختلف تماماً عن اليوتيوب. التسلسل والترتيب وفر علي شهور من التشتت. حصلت على وظيفتي الأولى بعد 3 شهور من الانضمام."
                  />
                  <TestimonialCard 
                    name="سارة علي"
                    role="Freelancer"
                    text="نظام مراجعة الكود هو الأفضل! كنت أظن أني أعرف أكتب كود، لكن الملاحظات التي حصلت عليها نقلت مستواي لمرحلة الاحتراف."
                  />
                  <TestimonialCard 
                    name="محمود حسن"
                    role="طالب حاسبات"
                    text="الشهادة التي حصلت عليها دعمت الـ CV الخاص بي جداً، والمشاريع العملية جعلتني واثقاً في المقابلات التقنية."
                  />
              </div>
          </div>
      </section>

      {/* --- 6. FAQ (الأسئلة الشائعة) --- */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">الأسئلة الشائعة</h2>
          <div className="space-y-4">
              {[
                  { q: "هل الكورسات مناسبة للمبتدئين؟", a: "نعم! جميع المسارات تبدأ من الصفر تماماً ولا تتطلب أي خبرة مسبقة." },
                  { q: "هل أحصل على شهادة بعد الانتهاء؟", a: "بالتأكيد. بعد إكمال مشاهدة الدروس وتسليم المشاريع المطلوبة، ستحصل على شهادة موثقة يمكنك إضافتها لـ LinkedIn." },
                  { q: "كيف يتم تصحيح الواجبات؟", a: "يتم رفع الكود على GitHub، ويقوم فريق من المدربين بمراجعته وإعطائك تقريراً مفصلاً بنقاط القوة والضعف." },
                  { q: "هل يمكنني استرداد المبلغ؟", a: "نعم، نقدم ضمان استرداد الأموال لمدة 14 يوماً في حال لم يعجبك المحتوى." }
              ].map((item, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center p-6 text-right hover:bg-slate-800/50 transition-colors"
                      >
                          <span className="font-bold text-white">{item.q}</span>
                          <ChevronDown className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`} size={20} />
                      </button>
                      <div className={`px-6 text-slate-400 leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                          {item.a}
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* --- 7. Final CTA (الخاتمة) --- */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">جاهز لكتابة قصة نجاحك؟</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">الفرصة لا تأتي مرتين. استثمر في نفسك الآن وانضم لآلاف المبرمجين المحترفين.</p>
                <Link href="/login">
                    {/* إصلاح مشكلة الزر الأبيض: استخدام !important وتحديد لون نص غامق */}
                    <Button className="!bg-white !text-blue-900 hover:!bg-blue-50 border-none text-xl px-10 py-4 shadow-xl font-bold rounded-xl">
                        ابدأ الآن مجاناً
                    </Button>
                </Link>
            </div>
            {/* زخارف */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

      {/* --- 8. Footer (التذييل) --- */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Code className="text-blue-500" />
                        <span className="text-xl font-bold text-white">SmartDev Academy</span>
                    </Link>
                    <p className="text-slate-400 max-w-sm mb-6">
                        منصتك الأولى لتعلم البرمجة باللغة العربية. نؤمن بأن التعليم الجيد حق للجميع، وهدفنا تخريج جيل من المبدعين.
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon icon={<Twitter size={20}/>} href="#" />
                        <SocialIcon icon={<Linkedin size={20}/>} href="#" />
                        <SocialIcon icon={<Instagram size={20}/>} href="#" />
                    </div>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6">روابط سريعة</h4>
                    <ul className="space-y-3 text-slate-400">
                        <li><Link href="/" className="hover:text-blue-400 transition-colors">الكورسات</Link></li>
                        <li><Link href="/about" className="hover:text-blue-400 transition-colors">من نحن</Link></li>
                        {/* لا توجد صفحة أسعار حالياً، نربطها بالرئيسية */}
                        <li><Link href="/#tracks" className="hover:text-blue-400 transition-colors">المسارات</Link></li>
                        <li><Link href="/blog" className="hover:text-blue-400 transition-colors">المدونة</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">الدعم</h4>
                    <ul className="space-y-3 text-slate-400">
                        <li><Link href="/#faq" className="hover:text-blue-400 transition-colors">الأسئلة الشائعة</Link></li>
                        <li><Link href="/contact" className="hover:text-blue-400 transition-colors">اتصل بنا</Link></li>
                        <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">سياسة الخصوصية</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-400 transition-colors">الشروط والأحكام</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm">© 2025 SmartDev Academy. جميع الحقوق محفوظة.</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>صنع بحب ❤️ في مصر</span>
                </div>
            </div>
        </div>
      </footer>

    </div>
  );
}

// --- Components Helpers ---

const FeatureCard = ({ icon, title, desc, color }) => {
    const colors = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        green: "text-green-500 bg-green-500/10 border-green-500/20",
    };

    return (
        <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-slate-900/50 ${colors[color].replace('text-', 'border-').split(' ')[2]}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

const TrackCard = ({ title, level, lessons, icon, techs, gradient }) => (
    <div className={`relative p-1 rounded-3xl bg-gradient-to-br ${gradient} hover:from-slate-800 hover:to-slate-800 transition-all group`}>
        <div className="bg-slate-950 h-full rounded-[22px] p-6 border border-slate-800 relative z-10 flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {icon}
                </div>
                <span className="bg-slate-900 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-800">{level}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
                <PlayCircle size={14}/> {lessons}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
                {techs.map((t, i) => (
                    <span key={i} className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {t}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const TestimonialCard = ({ name, role, text }) => (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative">
        <div className="text-blue-500 absolute top-4 right-6 text-6xl opacity-20 font-serif">"</div>
        <p className="text-slate-300 mb-6 relative z-10 leading-relaxed">
            {text}
        </p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                {name[0]}
            </div>
            <div>
                <h4 className="text-white font-bold text-sm">{name}</h4>
                <p className="text-slate-500 text-xs">{role}</p>
            </div>
        </div>
    </div>
);

const SocialIcon = ({ icon, href }) => (
    <a href={href} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
        {icon}
    </a>
);
