/**
 * Performance Optimization Guide for SmartDev Academy
 * قائمة نصائح وأفضل الممارسات للتحسين المستمر
 */

# دليل تحسين الأداء

## تحسينات تم تطبيقها ✅

### 1. Caching Strategy
- استخدام ISR (Incremental Static Regeneration) - `revalidate: 60`
- الصفحات المخزنة:
  - `/courses` - تحديث كل 60 ثانية
  - `/dashboard` - dynamic (لا caching بسبب بيانات المستخدم)

### 2. Database Query Optimization
- تحديد الحقول المطلوبة بدلاً من `select('*')`
- مثال: `select('id, title, description, thumbnail_url, slug, price')`

### 3. Component Optimization
- استخدام React.memo للمكونات:
  - `CourseCard` - wrapped with memo
  - `NavLink` in Navbar - memoized
- استخدام useMemo للقيم المشتقة
- استخدام useCallback للـ functions

### 4. Image Optimization
- إضافة `loading="lazy"` لجميع الصور
- استخدام responsive images

---

## تحسينات مستقبلية موصى بها 📝

### Database Indexing
قم بإضافة indexes على الأعمدة الأكثر استخداماً:

```sql
-- Index for courses queries
CREATE INDEX idx_courses_published ON courses(is_published, created_at DESC);

-- Index for enrollments
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- Index for lessons
CREATE INDEX idx_lessons_course ON lessons(course_id, "order");

-- Index for users role
CREATE INDEX idx_users_role ON users(role);
```

### Pagination
إضافة pagination للقوائم الطويلة:

```javascript
const ITEMS_PER_PAGE = 12;

const { data, error } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false })
  .range(0, ITEMS_PER_PAGE - 1);
```

### Advanced Lazy Loading
استخدام dynamic imports للمكونات الثقيلة:

```javascript
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard'),
  { loading: () => <PageSkeleton /> }
);
```

### Request Deduplication
استخدام SWR أو React Query لـ caching و deduplication:

```javascript
import useSWR from 'swr';

function useUser() {
  const { data, error } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  });
  return { user: data, isLoading: !error && !data, isError: error };
}
```

---

## Best Practices

### 1. Bundle Size Optimization
- استخدم `next/dynamic` للمكونات الكبيرة
- تجنب importing مكتبات كاملة
- استخدم tree-shaking

### 2. React Performance
- استخدم `React.memo` للمكونات التي تعيد render كثيراً
- استخدم `useMemo` للحسابات الثقيلة
- استخدم `useCallback` للـ functions المُمررة كـ props

### 3. Database Queries
- حدد الحقول المطلوبة فقط
- استخدم pagination
- أضف indexes على الأعمدة المستخدمة في WHERE و ORDER BY

### 4. Caching
- استخدم ISR للصفحات شبه-الثابتة
- استخدم SWR/React Query للـ client-side caching
- فكر في استخدام Redis للـ server-side caching

---

## Monitoring & Metrics

### Performance Metrics to Track:
1. **Time to First Byte (TTFB)** - يجب أن يكون < 200ms
2. **First Contentful Paint (FCP)** - يجب أن يكون < 1.8s
3. **Largest Contentful Paint (LCP)** - يجب أن يكون < 2.5s
4. **Time to Interactive (TTI)** - يجب أن يكون < 3.8s
5. **Total Blocking Time (TBT)** - يجب أن يكون < 200ms

### Tools:
- Chrome DevTools - Lighthouse
- Next.js Analytics
- Vercel Analytics (إذا deployed على Vercel)
- Google PageSpeed Insights

---

## Quick Wins

### سريع وسهل:
1. ✅ إضافة `loading="lazy"` لجميع الصور
2. ✅ استخدام React.memo للمكونات المُعاد render-ها
3. ✅ تحديد الحقول في database queries
4. ✅ إضافة debouncing للأزرار والinputs
5. ✅ استخدام ISR caching

### متوسط الصعوبة:
1. إضافة pagination
2. تحسين database indexes
3. استخدام dynamic imports
4. إضافة SWR/React Query

### متقدم:
1. Server-side caching مع Redis
2. Image optimization service
3. Edge caching
4. Service Workers
