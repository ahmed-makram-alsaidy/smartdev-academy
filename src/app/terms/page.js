import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <FileText className="text-purple-500 w-12 h-12" />
            <h1 className="text-4xl font-bold">الشروط والأحكام</h1>
        </div>
        
        <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-white mb-2">1. حقوق الملكية الفكرية</h2>
                <p>جميع محتويات المنصة من فيديوهات وأكواد ومواد تعليمية هي ملكية حصرية لـ SmartDev Academy. يمنع منعاً باتاً إعادة نشرها أو مشاركتها دون إذن.</p>
            </section>
            
            <section>
                <h2 className="text-xl font-bold text-white mb-2">2. سياسة الاسترداد</h2>
                <p>يمكنك طلب استرداد المبلغ المدفوع بالكامل خلال 14 يوماً من تاريخ الشراء، بشرط عدم إكمال أكثر من 30% من محتوى الكورس.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-2">3. السلوك في المجتمع</h2>
                <p>نلتزم بتوفير بيئة تعليمية آمنة ومحترمة. سيتم حظر أي حساب يقوم بنشر تعليقات مسيئة أو محتوى غير لائق.</p>
            </section>
        </div>
      </div>
    </div>
  );
}
