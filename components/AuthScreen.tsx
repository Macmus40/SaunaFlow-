import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useActiveBackground } from '../hooks/useActiveBackground';

interface AuthScreenProps {
    onDevLogin: () => void;
    isSupabaseConfigured: boolean;
    isTestMode: boolean;
    onOpenDebug: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onDevLogin, isSupabaseConfigured, isTestMode, onOpenDebug }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    const { t } = useLanguage();
    const { backgroundUrl } = useActiveBackground('login');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isSupabaseConfigured) {
            setMessage({ text: "CRITICAL: Supabase URL/Key missing.", type: 'error' });
            return;
        }
        setMessage(null);
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: window.location.origin }
            });
            if (error) throw error;
            setMessage({ text: t('auth_magic_link_sent'), type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.message || "Failed to send magic link.", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = backgroundUrl ? {
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url("${backgroundUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {};

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-white relative overflow-hidden transition-all duration-1000" style={containerStyle}>
            {!backgroundUrl && <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />}
            
            <header className="w-full flex justify-between p-6 z-10">
                <div className="text-2xl font-bold tracking-tighter text-amber-500">SaunaFlow</div>
                <LanguageSwitcher />
            </header>
            
            <main className="flex flex-col items-center justify-center flex-grow p-6 z-10">
                <div className="w-full max-w-sm">
                    <h1 className="text-4xl font-bold mb-2 text-center">Welcome Back</h1>
                    <p className="text-slate-400 text-center mb-8">{t('auth_subtitle')}</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('email_placeholder')}
                            required
                            className="w-full bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !isSupabaseConfigured}
                            className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:bg-amber-400 transition-all disabled:opacity-50"
                        >
                            {loading ? "Sending..." : t('auth_send_link')}
                        </button>
                    </form>
                    {message && <div className={`mt-6 p-4 rounded-xl text-sm border ${message.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>{message.text}</div>}
                    {isTestMode && <button onClick={onDevLogin} className="w-full mt-8 text-slate-500 hover:text-slate-300 text-sm">Continue as Developer</button>}
                </div>
            </main>
        </div>
    );
};
