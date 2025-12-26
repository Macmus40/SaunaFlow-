import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export type BackgroundScope = 'start' | 'login' | 'ritual' | 'config';

export function useActiveBackground(scope: BackgroundScope) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBackground() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('backgrounds')
        .select('public_url')
        .eq('user_id', session.user.id)
        .eq('scope', scope)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) {
        setBackgroundUrl(data.public_url);
      }
      setLoading(false);
    }

    fetchBackground();

    // Opcjonalnie: Subskrypcja zmian w czasie rzeczywistym
    const channel = supabase
      .channel(`bg-${scope}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'backgrounds',
        filter: `scope=eq.${scope}` 
      }, () => {
        fetchBackground();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scope]);

  return { backgroundUrl, loading };
}
