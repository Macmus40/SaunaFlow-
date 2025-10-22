
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Protocol } from '../types';
import { BatteryLowIcon, BatteryFullIcon, FaceFrownIcon, FaceNeutralIcon, FaceSmileIcon } from './icons/Icons';

interface WellbeingCheckScreenProps {
  protocol: Protocol;
  onComplete: (protocol: Protocol) => void;
  onBack: () => void;
}

export const WellbeingCheckScreen: React.FC<WellbeingCheckScreenProps> = ({ protocol, onComplete, onBack }) => {
  const { t } = useLanguage();
  const [hydration, setHydration] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState<'stressed' | 'neutral' | 'calm'>('neutral');
  const [intention, setIntention] = useState('');

  const moods = [
      { id: 'stressed', label: t('mood_stressed'), icon: <FaceFrownIcon /> },
      { id: 'neutral', label: t('mood_neutral'), icon: <FaceNeutralIcon /> },
      { id: 'calm', label: t('mood_calm'), icon: <FaceSmileIcon /> },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center justify-center mb-6">
          <button onClick={onBack} className="absolute left-0 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">&larr; {t('back')}</button>
          <h1 className="text-3xl font-bold text-center">{t('wellbeing_check_title')}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-10">{t('wellbeing_check_subtitle')}</p>

        <div className="space-y-8">
          {/* Hydration Slider */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-3 block">{t('hydration_label')}</label>
            <div className="flex items-center space-x-4">
              <span className="text-slate-500 text-sm">{t('hydration_desc_1')}</span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={hydration}
                onChange={(e) => setHydration(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-400"
              />
              <span className="text-slate-500 text-sm">{t('hydration_desc_5')}</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-3 block">{t('energy_label')}</label>
            <div className="flex items-center space-x-4">
              <span className="text-slate-500"><BatteryLowIcon className="w-6 h-6"/></span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-400"
              />
              <span className="text-slate-500"><BatteryFullIcon className="w-6 h-6"/></span>
            </div>
             <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1 mt-1">
                <span>{t('energy_desc_1')}</span>
                <span>{t('energy_desc_5')}</span>
            </div>
          </div>
          
          {/* Mood Selector */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-4 block">{t('mood_label')}</label>
            <div className="grid grid-cols-3 gap-4">
              {moods.map(({id, label, icon}) => (
                <button 
                  key={id}
                  onClick={() => setMood(id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${mood === id ? 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500' : 'bg-slate-100 dark:bg-slate-700/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  <div className={`w-10 h-10 mb-2 ${mood === id ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>{icon}</div>
                  <span className={`font-semibold text-sm ${mood === id ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intention Input */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <label htmlFor="intention" className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-3 block">{t('intention_label')}</label>
            <input
              id="intention"
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder={t('intention_placeholder')}
              className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="mt-10">
          <button 
            onClick={() => onComplete(protocol)}
            className="w-full bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-full text-xl hover:bg-amber-400 transition-transform transform hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            {t('begin_session')}
          </button>
        </div>
      </div>
    </div>
  );
};
