import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export type BackgroundScope = 'start' | 'login' | 'ritual' | 'config';

export function useActiveBackground(scope: BackgroundScope) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScopeMissing, setIsScopeMissing] = useState(false);

  useEffect(() => {
    async function fetchBackground() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Próba 1: Zapytanie z kolumną 'scope'
      const query = supabase
        .from('backgrounds')
        .select('public_url')
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      const { data, error } = await query.eq('scope', scope).maybeSingle();

      if (error) {
        // Jeśli błąd dotyczy braku kolumny (PGRST204 lub komunikat o braku kolumny)
        if (error.message.includes('scope') || error.code === 'PGRST204' || error.code === '42703') {
          console.warn("Table 'backgrounds' is missing 'scope' column. Falling back to global active background.");
          setIsScopeMissing(true);
          
          // Próba 2: Fallback - pobranie dowolnego aktywnego tła bez filtra scope
          const { data: fallbackData } = await supabase
            .from('backgrounds')
            .select('public_url')
            .eq('user_id', session.user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (fallbackData) setBackgroundUrl(fallbackData.public_url);
        }
      } else if (data) {
        setBackgroundUrl(data.public_url);
      }
      setLoading(false);
    }

    fetchBackground();

    const channel = supabase
      .channel(`bg-${scope}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'backgrounds'
      }, () => {
        fetchBackground();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scope]);

  return { backgroundUrl, loading, isScopeMissing };
}
