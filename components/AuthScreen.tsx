import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

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

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isSupabaseConfigured) {
            setMessage({ text: "CRITICAL: Supabase URL/Key missing. Please check diagnostics.", type: 'error' });
            return;
        }
        
        setMessage(null);
        setLoading(true);
        
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });

            if (error) throw error;
            setMessage({ text: t('auth_magic_link_sent'), type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.message || "Failed to send magic link.", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
            
            <header className="w-full flex justify-between p-6 z-10">
                <div className="text-2xl font-bold tracking-tighter text-amber-500">SaunaFlow</div>
                <LanguageSwitcher />
            </header>
            
            <main className="flex flex-col items-center justify-center flex-grow p-6 z-10">
                {!isSupabaseConfigured && (
                    <div className="mb-8 p-4 bg-rose-500/20 border border-rose-500/40 rounded-xl text-center max-w-sm animate-pulse">
                        <h2 className="text-rose-400 font-bold mb-2">Configuration Missing</h2>
                        <p className="text-xs text-rose-300">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.</p>
                        <button onClick={onOpenDebug} className="mt-3 text-xs underline font-bold text-white">Open Diagnostic Panel</button>
                    </div>
                )}

                <div className="w-full max-w-sm">
                    <h1 className="text-4xl font-bold mb-2 text-center">Welcome Back</h1>
                    <p className="text-slate-400 text-center mb-8">{t('auth_subtitle')}</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('email_placeholder')}
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !isSupabaseConfigured}
                            className={`w-full font-bold py-4 px-10 rounded-xl transition-all shadow-lg ${
                                loading || !isSupabaseConfigured 
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                                : 'bg-amber-500 text-slate-900 hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                        >
                            {loading ? <div className="flex items-center justify-center space-x-2"><div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div><span>Sending...</span></div> : t('auth_send_link')}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl text-sm border ${
                            message.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {isTestMode && (
                        <div className="mt-12 text-center">
                            <div className="relative py-4 mb-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                                <span className="relative bg-slate-900 px-3 text-[10px] uppercase tracking-widest text-slate-600">Testing Only</span>
                            </div>
                            <button
                                onClick={onDevLogin}
                                className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                            >
                                Continue as Developer (Bypass)
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};