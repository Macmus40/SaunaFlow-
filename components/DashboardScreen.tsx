
import React from 'react';
import type { Goal, SessionLog, Achievement } from '../types';
import { FireIcon, SnowflakeIcon, HeartIcon, TrophyIcon } from './icons/Icons';
import { ALL_ACHIEVEMENTS } from './achievements';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

interface DashboardScreenProps {
  userName: string | null;
  goal: Goal | null;
  sessionHistory: SessionLog[];
  onStartRitual: () => void;
  onChangeGoal: () => void;
  onResetApp: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ userName, goal, sessionHistory, onStartRitual, onChangeGoal, onResetApp }) => {
  const { t } = useLanguage();
  const totalMinutes = sessionHistory.reduce((acc, log) => acc + log.totalTime, 0) / 60;
  const totalSessions = sessionHistory.length;
  
  const calculateStreak = () => {
    if (sessionHistory.length === 0) return 0;
    
    let streak = 0;
    const sortedHistory = [...sessionHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const firstSessionDate = new Date(sortedHistory[0].date);
    firstSessionDate.setHours(0,0,0,0);
    
    const diffTime = today.getTime() - firstSessionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
        return 0;
    }
    
    streak = 1;
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

  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-white p-6">
      <header className="mb-8 flex justify-between items-start">
        <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{t('dashboard_greeting', { userName: userName || '' })}</h1>
            <div className="flex items-center space-x-4 mt-2">
            <p className="text-slate-600 dark:text-slate-400">{t('current_goal', { goal: goal ? t(`goal_${goal}`) : '' })}</p>
            <button onClick={onChangeGoal} className="text-sm text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 underline">
                {t('change_goal')}
            </button>
            <button onClick={handleResetClick} className="text-sm text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 underline">
                {t('reset_app')}
            </button>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <ThemeSwitcher />
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

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('history')}</h2>
        <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 max-h-60 overflow-y-auto">
          {sessionHistory.length > 0 ? (
            [...sessionHistory].reverse().map((log, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{log.protocolName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(log.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{Math.round(log.totalTime / 60)} {t('minutes_short')}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{log.cyclesCompleted} {t('cycles_short')}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-500 text-center py-8">{t('history_empty')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AchievementsGrid: React.FC<{sessionHistory: SessionLog[], streak: number}> = ({ sessionHistory, streak }) => {
    const { t } = useLanguage();
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('achievements')}</h2>
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
    <div className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${unlocked ? 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/30' : 'bg-slate-200/50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60'}`}>
        <div className={`w-12 h-12 mb-2 ${unlocked ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>{achievement.icon}</div>
        <h3 className={`font-bold text-sm ${unlocked ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'}`}>{t(achievement.title)}</h3>
        {unlocked && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t(achievement.description)}</p>}
    </div>
)};


interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-start">
        <div className="w-10 h-10 mb-3">{icon}</div>
        <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-slate-600 dark:text-slate-400">{label}</p>
    </div>
)
