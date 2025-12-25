
import React, { useState } from 'react';
import type { Goal } from '../types';
import { Goal as GoalEnum } from '../types';
import { SunIcon, BoltIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface OnboardingScreenProps {
  onOnboardingComplete: (name: string, goal: Goal) => void;
}

const backgroundImage = 'https://images.unsplash.com/photo-1544161515-cfd626dba494?auto=format&fit=crop&w=1280&q=80';

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onOnboardingComplete }) => {
  const [name, setName] = useState('');
  const { t } = useLanguage();
  
  return (
    <div className="relative flex flex-col min-h-screen text-white">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />

      <header className="w-full flex justify-end p-4 sm:p-6">
        <LanguageSwitcher />
      </header>
      <main className="flex flex-col items-center justify-center flex-grow text-center p-4 sm:p-6">
        <h1 className="text-4xl font-bold mb-4">{t('welcome_title')}</h1>
        <p className="text-lg text-slate-300 mb-8 max-w-md">
          {t('welcome_subtitle')}
        </p>

        <div className="w-full max-w-sm mb-8">
          <label htmlFor="name" className="block text-slate-300 mb-2 text-left">{t('name_label')}</label>
          <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('name_placeholder')}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-4 text-lg focus:ring-amber-500 focus:border-amber-500 placeholder-slate-500"
              autoFocus
          />
        </div>

        <p className={`text-lg text-slate-300 mb-12 max-w-md transition-opacity duration-500 ${name.trim() ? 'opacity-100' : 'opacity-0'}`}>
          {t('goal_prompt')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <GoalCard
            icon={<SunIcon />}
            title={t('goal_relax_title')}
            description={t('goal_relax_desc')}
            onClick={() => onOnboardingComplete(name.trim(), GoalEnum.Relax)}
            disabled={!name.trim()}
          />
          <GoalCard
            icon={<BoltIcon />}
            title={t('goal_performance_title')}
            description={t('goal_performance_desc')}
            onClick={() => onOnboardingComplete(name.trim(), GoalEnum.Performance)}
            disabled={!name.trim()}
          />
        </div>
      </main>
    </div>
  );
};

interface GoalCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({ icon, title, description, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-left hover:bg-slate-700/80 hover:border-slate-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
        <div className="w-12 h-12 text-amber-400 mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </button>
);