'use client';

import Button from '@/components/Button';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يمكن إضافة منطق إرسال البيانات لقاعدة البيانات
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-20 flex items-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div>
            <h1 className="text-5xl font-bold mb-6">تواصل معنا</h1>
            <p className="text-slate-400 text-lg mb-12">
                لديك استفسار؟ اقتراح؟ أو واجهت مشكلة؟ فريقنا جاهز لمساعدتك على مدار الساعة.
            </p>
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500"><Mail /></div>
                    <div>
                        <h4 className="font-bold">البريد الإلكتروني</h4>
                        <p className="text-slate-400">dev.ahmed.alsaidy@gmail.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500"><Phone /></div>
                    <div>
                        <h4 className="font-bold">الهاتف</h4>
                        <p className="text-slate-400">+201006409514</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><MapPin /></div>
                    <div>
                        <h4 className="font-bold">المقر الرئيسي</h4>
                        <p className="text-slate-400">القاهرة، التجمع الخامس</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 text-4xl">✓</div>
                    <h3 className="text-2xl font-bold mb-2">تم استلام رسالتك!</h3>
                    <p className="text-slate-400">سنتواصل معك في أقرب وقت ممكن.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">الاسم</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none" placeholder="اسمك الكريم" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">البريد الإلكتروني</label>
                        <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none" placeholder="example@mail.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">الرسالة</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none h-32" placeholder="كيف يمكننا مساعدتك؟" required></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full py-4 rounded-xl font-bold">إرسال الرسالة</Button>
                </form>
            )}
        </div>

      </div>
    </div>
  );
}
