
import React from 'react';
import type { Session } from '@supabase/auth-js';
import type { Goal, SessionLog, Achievement } from '../types';
import { FireIcon, SnowflakeIcon, HeartIcon, CogIcon, ChevronRightIcon } from './icons/Icons';
import { ALL_ACHIEVEMENTS } from './achievements';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { supabase } from '../lib/supabaseClient';


interface DashboardScreenProps {
  session: Session | null;
  username: string | null;
  goal: Goal | null;
  sessionHistory: SessionLog[];
  onStartRitual: () => void;
  onResetApp: () => void;
  onEnterAdmin: () => void;
  onViewHistoryDetail: (log: SessionLog) => void;
  onGoToProfileSettings: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ session, username, goal, sessionHistory, onStartRitual, onResetApp, onEnterAdmin, onViewHistoryDetail, onGoToProfileSettings }) => {
  const { t } = useLanguage();
  const totalMinutes = sessionHistory.reduce((acc, log) => acc + log.totalTime, 0) / 60;
  const totalSessions = sessionHistory.length;
  
  const calculateStreak = () => {
    if (sessionHistory.length === 0) return 0;
    const sortedHistory = sessionHistory;
    const today = new Date();
    today.setHours(0,0,0,0);
    const firstSessionDate = new Date(sortedHistory[0].date);
    firstSessionDate.setHours(0,0,0,0);
    const diffTime = today.getTime() - firstSessionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;
    let streak = 1;
    let lastDate = firstSessionDate;
    for (let i = 1; i < sortedHistory.length; i++) {
        const currentDate = new Date(sortedHistory[i].date);
        currentDate.setHours(0,0,0,0);
        const dayDifference = (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDifference === 1) {
            streak++;
            lastDate = currentDate;
        } else if (dayDifference > 1) {
            break;
        }
    }
    return streak;
  };
  
  const streak = calculateStreak();

  const handleResetClick = () => {
    if (window.confirm(t('reset_app_confirm'))) {
      onResetApp();
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col min-h-screen text-white p-6">
      <header className="mb-8 flex justify-between items-start">
        <div>
            <h1 className="text-4xl font-bold text-slate-100">{t('dashboard_greeting_name', { username: username || 'User' })}</h1>
            <div className="flex items-center space-x-4 mt-2 flex-wrap">
            <p className="text-slate-400">{t('current_goal', { goal: goal ? t(`goal_${goal}`) : '' })}</p>
            <button onClick={handleSignOut} className="text-sm text-amber-400 hover:text-amber-300 underline">
                {t('sign_out')}
            </button>
            <button onClick={handleResetClick} className="text-sm text-rose-400 hover:text-rose-300 underline">
                {t('reset_app')}
            </button>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onGoToProfileSettings} className="p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" aria-label={t('profile_settings_title')}>
                <CogIcon className="w-6 h-6" />
            </button>
            <LanguageSwitcher />
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<FireIcon className="text-amber-400" />} value={streak} label={t('stat_streak')} />
          <StatCard icon={<HeartIcon className="text-rose-400" />} value={Math.round(totalMinutes)} label={t('stat_total_minutes')} />
          <StatCard icon={<SnowflakeIcon className="text-sky-400" />} value={totalSessions} label={t('stat_sessions')} />
        </div>
        
        <div className="text-center mb-10">
          <button 
            onClick={onStartRitual}
            className="bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-full text-xl hover:bg-amber-400 transition-transform transform hover:scale-105 shadow-lg shadow-amber-500/20">
            {t('start_ritual')}
          </button>
        </div>

        <AchievementsGrid sessionHistory={sessionHistory} streak={streak} />
      </main>

      <div className="mt-auto pt-10">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">{t('history')}</h2>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 max-h-60 overflow-y-auto">
          {sessionHistory.length > 0 ? (
            sessionHistory.map((log) => (
              <button
                key={log.date}
                onClick={() => onViewHistoryDetail(log)}
                className="w-full flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0 text-left hover:bg-slate-700/50 rounded-md px-2 -mx-2 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-200">{log.protocolName}</p>
                  <p className="text-sm text-slate-400">{new Date(log.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-slate-200">{Math.round(log.totalTime / 60)} {t('minutes_short')}</p>
                    <p className="text-sm text-slate-400">{log.cyclesCompleted} {t('cycles_short')}</p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                </div>
              </button>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">{t('history_empty')}</p>
          )}
        </div>
      </div>
      <footer className="text-center mt-6">
        <button onClick={onEnterAdmin} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
          Admin Panel
        </button>
      </footer>
    </div>
  );
};

const AchievementsGrid: React.FC<{sessionHistory: SessionLog[], streak: number}> = ({ sessionHistory, streak }) => {
    const { t } = useLanguage();
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4">{t('achievements')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ALL_ACHIEVEMENTS.map(ach => (
                    <AchievementCard key={ach.id} achievement={ach} unlocked={ach.isUnlocked(sessionHistory, streak)} />
                ))}
            </div>
        </div>
    )
};

const AchievementCard: React.FC<{achievement: Achievement, unlocked: boolean}> = ({ achievement, unlocked }) => {
    const { t } = useLanguage();
    return (
    <div className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${unlocked ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800 border-slate-700 opacity-60'}`}>
        <div className={`w-12 h-12 mb-2 ${unlocked ? 'text-amber-400' : 'text-slate-500'}`}>{achievement.icon}</div>
        <h3 className={`font-bold text-sm ${unlocked ? 'text-amber-300' : 'text-slate-300'}`}>{t(achievement.title)}</h3>
        {unlocked && <p className="text-xs text-slate-400 mt-1">{t(achievement.description)}</p>}
    </div>
)};


interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-start">
        <div className="w-10 h-10 mb-3">{icon}</div>
        <p className="text-4xl font-bold text-slate-100">{value}</p>
        <p className="text-slate-400">{label}</p>
    </div>
)
