import { Code, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-b from-blue-900/20 to-slate-950 py-24 px-6 text-center">
          <h1 className="text-5xl font-black mb-6">قصتنا</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              نحن مجموعة من المبرمجين العرب، قررنا تغيير واقع التعليم التقني في وطننا العربي.
          </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                  <Code className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">مهمتنا</h3>
                  <p className="text-slate-400">تخريج 10,000 مبرمج محترف جاهز لسوق العمل بحلول 2026.</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                  <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">مجتمعنا</h3>
                  <p className="text-slate-400">نؤمن بأن التعلم الجماعي هو الأسرع والأكثر فاعلية.</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                  <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">رؤيتنا</h3>
                  <p className="text-slate-400">أن نكون المصدر الأول للمحتوى التقني العربي عالمياً.</p>
              </div>
          </div>
      </div>
    </div>
  );
}
