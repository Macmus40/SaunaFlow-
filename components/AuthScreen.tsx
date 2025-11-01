
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

const backgroundImage = 'https://images.unsplash.com/photo-1544161515-cfd626dba494?auto=format&fit=crop&w=1280&q=80';

interface AuthScreenProps {
    onDevLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onDevLogin }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { t } = useLanguage();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ 
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Sprawdź swoją skrzynkę e-mail, aby znaleźć link do logowania!');
        }
        setLoading(false);
    };

    return (
        <div className="relative flex flex-col min-h-screen text-white">
            <div
                className="absolute inset-0 bg-cover bg-center -z-10"
                style={{ backgroundImage: `url("${backgroundImage}")` }}
            />
            <div className="absolute inset-0 bg-black/70 -z-10" />

            <header className="w-full flex justify-end p-4 sm:p-6">
                <LanguageSwitcher />
            </header>
            <main className="flex flex-col items-center justify-center flex-grow text-center p-4 sm:p-6">
                <h1 className="text-4xl font-bold mb-4">{t('welcome_title')}</h1>
                <p className="text-lg text-slate-300 mb-8 max-w-md">
                    {t('auth_subtitle')}
                </p>

                <div className="w-full max-w-sm mb-8 space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('email_placeholder')}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-4 text-lg focus:ring-amber-500 focus:border-amber-500 placeholder-slate-500"
                            required
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-full text-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {loading ? t('auth_sending') : t('auth_send_link')}
                        </button>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-700" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-slate-900 px-2 text-sm text-slate-500">lub</span>
                        </div>
                    </div>
                     <button
                        onClick={onDevLogin}
                        className="w-full bg-slate-700 text-slate-200 font-semibold py-3 px-10 rounded-full text-base hover:bg-slate-600 transition-colors"
                    >
                        Kontynuuj jako deweloper
                    </button>
                </div>
                {message && <p className="text-amber-300">{message}</p>}
            </main>
        </div>
    );
};
