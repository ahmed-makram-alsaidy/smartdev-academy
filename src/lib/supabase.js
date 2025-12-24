import { createClient } from '@/utils/supabase/client';

// هذا الملف موجود فقط للتوافق مع الكود القديم الذي قد نسينا تحديثه.
// يفضل دائماً استخدام @/utils/supabase/client أو @/utils/supabase/server مباشرة.

export const supabase = createClient();
