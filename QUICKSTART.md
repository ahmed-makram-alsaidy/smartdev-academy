# Quick Start Guide - دليل البدء السريع

## للمطور الجديد:

### 1. التثبيت (5 دقائق)
```bash
npm install
```

### 2. إعداد Supabase (10 دقائق)

#### أ) إنشاء المشروع:
1. اذهب إلى https://supabase.com
2. "New Project"
3. احفظ Project URL و API Key

#### ب) أضف Environment Variables:
أنشئ `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
```

#### ج) تشغيل Database Schema:
1. افتح Supabase SQL Editor
2. انسخ والصق الـ schema من طلب المستخدم الأصلي
3. Run

### 3. تشغيل المشروع
```bash
npm run dev
```

افتح http://localhost:3000

### 4. إنشاء Admin User
1. سجل من `/signup`
2. في Supabase: Table Editor → users
3. غيّر role إلى `admin`
4. سجل دخول مرة أخرى

✅ جاهز!

---

## للمطور المتقدم:

### تحسينات مطبقة:
- ✅ Server-side authentication
- ✅ React.memo + useMemo + useCallback
- ✅ Debouncing (300ms buttons)
- ✅ ISR Caching (60s)
- ✅ Lazy loading images
- ✅ Error boundaries
- ✅ Loading skeletons
- ✅ Mobile-first responsive design

### الملفات الرئيسية:
- `app/login/page.js` - Server Actions
- `components/Navbar.js` - Optimized
- `context/AuthContext.js` - Fixed infinite loop
- `components/LoadingSkeletons.js` - UX
- `components/ErrorBoundary.js` - Error handling
- `utils/debounce.js` - Performance

### التحسينات المستقبلية:
راجع `PERFORMANCE_GUIDE.md`
