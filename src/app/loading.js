'use client'; // إضافة use client لضمان توافق الأيقونات

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center z-50 fixed inset-0">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">جاري تجهيز البيانات...</p>
    </div>
  );
}
