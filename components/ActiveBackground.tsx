import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Komponent ActiveBackground
 * Pobiera aktywne tło użytkownika z tabeli 'backgrounds' i aplikuje je do #root.
 */
const ActiveBackground: React.FC = () => {
  useEffect(() => {
    const fetchAndApplyBackground = async () => {
      // 1. Pobranie sesji
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log("ActiveBackground: No active session.");
        return;
      }

      // 2. Zapytanie o aktywne tło
      const { data, error } = await supabase
        .from('backgrounds')
        .select('public_url, object_path')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error("ActiveBackground Error:", error.message);
        return;
      }

      // 3. Aplikacja stylu do #root
      if (data?.public_url) {
        console.log("ActiveBackground: Applying background:", data.public_url);
        const root = document.getElementById('root');
        
        if (root) {
          // Ustawiamy background-image z ciemnym overlayem (linear-gradient) dla kontrastu
          root.style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url("${data.public_url}")`;
          root.style.backgroundSize = "cover";
          root.style.backgroundPosition = "center";
          root.style.backgroundRepeat = "no-repeat";
          root.style.backgroundAttachment = "fixed";
          
          // Debug info w konsoli Netlify/Browser
          console.log(`ActiveBackground Applied: ${data.object_path}`);
        }
      } else {
        console.log("ActiveBackground: No active record found for user.");
      }
    };

    fetchAndApplyBackground();
  }, []);

  return null;
};

export default ActiveBackground;
