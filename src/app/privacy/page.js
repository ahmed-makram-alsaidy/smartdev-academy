import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Shield className="text-blue-500 w-12 h-12" />
            <h1 className="text-4xl font-bold">سياسة الخصوصية</h1>
        </div>
        
        <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-white mb-2">1. المعلومات التي نجمعها</h2>
                <p>نحن نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل، مثل الاسم والبريد الإلكتروني. كما نجمع بيانات حول تقدمك في الكورسات لتحسين تجربتك التعليمية.</p>
            </section>
            
            <section>
                <h2 className="text-xl font-bold text-white mb-2">2. كيف نستخدم معلوماتك</h2>
                <p>نستخدم بياناتك لإصدار الشهادات، ومتابعة تقدمك، وإرسال تحديثات مهمة حول الكورسات. لن نقوم ببيع بياناتك لأطراف ثالثة أبداً.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">3. أمان البيانات</h2>
                <p>نستخدم أحدث تقنيات التشفير لحماية بياناتك الشخصية وكلمات المرور الخاصة بك.</p>
            </section>

            <p className="text-sm text-slate-500 mt-12 border-t border-slate-800 pt-4">آخر تحديث: ديسمبر 2024</p>
        </div>
      </div>
    </div>
  );
}
