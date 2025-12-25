
import React, { useState, useEffect } from 'react';
// FIX: Reverted to `import type`. A value import for a type-only export can break type inference for the entire module, causing subsequent errors. Using `import type` is the correct approach for importing types.
// FIX: The Session type might not be properly re-exported in some versions of `@supabase/supabase-js`. Importing directly from `@supabase/auth-js` is more robust.
import type { Session } from '@supabase/auth-js';
import type { Goal, UserPreferences, TimerStyle } from '../types';
import { Goal as GoalEnum, VOICES } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { SunIcon, BoltIcon } from './icons/Icons';

interface ProfileSettingsScreenProps {
    session: Session;
    username: string | null;
    goal: Goal | null;
    preferences: UserPreferences;
    onSave: (name: string, goal: Goal, preferences: UserPreferences) => void;
    onBack: () => void;
}

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-200 mb-5">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ session, username, goal, preferences, onSave, onBack }) => {
    const { t } = useLanguage();
    const [nameInput, setNameInput] = useState(username || '');
    const [selectedGoal, setSelectedGoal] = useState(goal || GoalEnum.Relax);
    const [prefs, setPrefs] = useState<UserPreferences>(preferences);

    useEffect(() => {
        setNameInput(username || '');
        setSelectedGoal(goal || GoalEnum.Relax);
        setPrefs(preferences);
    }, [username, goal, preferences]);

    const handleSave = () => {
        onSave(nameInput.trim(), selectedGoal, prefs);
    };
    
    const isChanged =
        nameInput !== username ||
        selectedGoal !== goal ||
        JSON.stringify(prefs) !== JSON.stringify(preferences);

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-white p-6">
            <div className="w-full max-w-2xl mx-auto">
                <div className="relative flex items-center justify-center mb-8">
                    <h1 className="text-3xl font-bold">{t('profile_settings_title')}</h1>
                </div>

                <div className="space-y-6">
                    <Section title={t('profile_info_title')}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-400 mb-1">{t('user_name_label')}</label>
                            <input
                                id="username"
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className="w-full bg-slate-700/80 border border-slate-600 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">{t('email_label')}</label>
                            <p className="text-slate-300 p-3 bg-slate-800 rounded-lg">{session.user.email}</p>
                        </div>
                    </Section>

                    <Section title={t('primary_goal_label')}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <GoalOption
                                icon={<SunIcon />}
                                title={t('goal_relax_title')}
                                description={t('goal_relax_desc')}
                                isSelected={selectedGoal === GoalEnum.Relax}
                                onClick={() => setSelectedGoal(GoalEnum.Relax)}
                            />
                            <GoalOption
                                icon={<BoltIcon />}
                                title={t('goal_performance_title')}
                                description={t('goal_performance_desc')}
                                isSelected={selectedGoal === GoalEnum.Performance}
                                onClick={() => setSelectedGoal(GoalEnum.Performance)}
                            />
                        </div>
                    </Section>
                    
                    <Section title={t('session_prefs_title')}>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t('default_timer_style_label')}</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {(['circle', 'bar', 'digital', 'hourglass'] as TimerStyle[]).map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setPrefs(p => ({ ...p, defaultTimerStyle: style }))}
                                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${prefs.defaultTimerStyle === style ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
                                    >
                                        {t(`timer_style_${style}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="volume" className="block text-sm font-medium text-slate-400 mb-2">{t('default_volume_label')}</label>
                            <input
                                id="volume"
                                type="range"
                                min="0" max="1" step="0.05"
                                value={prefs.defaultVolume}
                                onChange={e => setPrefs(p => ({ ...p, defaultVolume: parseFloat(e.target.value) }))}
                                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-400"
                            />
                        </div>
                         <div className="flex justify-between items-center">
                            <div>
                               <label className="font-medium text-slate-300">{t('audio_guidance_label')}</label>
                               <p className="text-sm text-slate-500 mt-1">{t('audio_guidance_desc')}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={prefs.defaultVoiceGuidance} onChange={() => setPrefs(p => ({ ...p, defaultVoiceGuidance: !p.defaultVoiceGuidance }))} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                         </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t('default_voice_label')}</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {VOICES.map(voice => (
                                    <button
                                        key={voice}
                                        onClick={() => setPrefs(p => ({ ...p, defaultVoice: voice }))}
                                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${prefs.defaultVoice === voice ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
                                    >
                                        {t(`voice_${voice}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Section>
                </div>
                
                <div className="mt-8 flex items-center space-x-4">
                     <button
                        onClick={handleSave}
                        disabled={!isChanged}
                        className="flex-1 bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-full text-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('save_changes')}
                    </button>
                    <button onClick={onBack} className="flex-1 bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-full text-lg hover:bg-slate-600 transition-colors">
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};


const GoalOption: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ icon, title, description, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`bg-slate-700/50 p-4 text-left rounded-lg border-2 transition-all duration-200 ${isSelected ? 'border-amber-500' : 'border-transparent hover:border-slate-600'}`}
    >
        <div className="w-8 h-8 text-amber-400 mb-2">{icon}</div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{description}</p>
    </button>
);