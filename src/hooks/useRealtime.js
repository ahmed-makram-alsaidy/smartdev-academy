import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useRealtime(table, callback, filter = null) {
    const supabase = createClient();

    useEffect(() => {
        // Don't subscribe if no callback provided
        if (!callback) return;

        const channel = supabase
            .channel(`realtime-${table}-${Date.now()}`) // Unique channel name to prevent conflicts
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table,
                    filter: filter,
                },
                (payload) => {
                    console.log(`Change received for ${table}:`, payload);
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, filter, callback, supabase]);
}
