
import React, { useState, useMemo } from 'react';
import type { Protocol, Stage } from '../types';
import { StageType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ThermometerIcon } from './icons/Icons';

interface SessionSettingsScreenProps {
  protocol: Protocol;
  onStart: (protocol: Protocol) => void;
  onBack: () => void;
}

const BASE_SAUNA_TEMP = 85;
const BASE_COLD_TEMP = 10;

const calculateAdjustedProtocol = (
  originalProtocol: Protocol,
  saunaTemp: number,
  coldTemp: number
): Protocol => {
  const newStages = originalProtocol.stages.map((stage): Stage => {
    if (stage.type === StageType.Sauna) {
      const tempDelta = saunaTemp - BASE_SAUNA_TEMP;
      // For every 5°C hotter, reduce time by 12%. For every 5°C colder, increase by 6%.
      const modifier = tempDelta > 0
        ? 1 - (tempDelta / 5) * 0.12
        : 1 - (tempDelta / 5) * 0.06;
      // Clamp modifier to avoid extreme values (e.g., 50% to 150% of original time)
      const clampedModifier = Math.max(0.5, Math.min(1.5, modifier));
      return { ...stage, duration: Math.round(stage.duration * clampedModifier) };
    }
    if (stage.type === StageType.Cold) {
      const tempDelta = coldTemp - BASE_COLD_TEMP;
       // For every 2°C colder, reduce time by 20%. For every 2°C warmer, increase by 10%.
      const modifier = tempDelta < 0
        ? 1 - (Math.abs(tempDelta) / 2) * 0.20
        : 1 + (tempDelta / 2) * 0.10;
      const clampedModifier = Math.max(0.5, Math.min(1.5, modifier));
      return { ...stage, duration: Math.round(stage.duration * clampedModifier) };
    }
    return stage;
  });

  return { ...originalProtocol, stages: newStages };
};


export const SessionSettingsScreen: React.FC<SessionSettingsScreenProps> = ({ protocol, onStart, onBack }) => {
  const { t } = useLanguage();
  const [saunaTemp, setSaunaTemp] = useState(BASE_SAUNA_TEMP);
  const [coldTemp, setColdTemp] = useState(BASE_COLD_TEMP);

  const adjustedProtocol = useMemo(
    () => calculateAdjustedProtocol(protocol, saunaTemp, coldTemp),
    [protocol, saunaTemp, coldTemp]
  );
  
  const hasChanges = JSON.stringify(protocol.stages) !== JSON.stringify(adjustedProtocol.stages);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center justify-center mb-6">
          <button onClick={onBack} className="absolute left-0 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">&larr; {t('back')}</button>
          <h1 className="text-3xl font-bold text-center">{t('session_settings_title')}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-10">{t('session_settings_subtitle')}</p>

        <div className="space-y-8">
            <TempSlider
                label={t('sauna_temp')}
                value={saunaTemp}
                onChange={setSaunaTemp}
                min={60}
                max={110}
                step={1}
                color="text-amber-600 dark:text-amber-400"
                accent="accent-amber-500"
            />
            <TempSlider
                label={t('water_temp')}
                value={coldTemp}
                onChange={setColdTemp}
                min={1}
                max={20}
                step={1}
                color="text-sky-600 dark:text-sky-400"
                accent="accent-sky-500"
            />
        </div>
        
        <div className="mt-12 p-6 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">{t('adjusted_times')}</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{t('original')}</h4>
                    <div className="space-y-1">
                        {protocol.stages.map(stage => (
                             <p key={stage.type} className="text-slate-700 dark:text-slate-300">
                                {t('stage_duration_display', { stageName: t(`stage_${stage.type}`), duration: Math.round(stage.duration / 60) })}
                             </p>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">{t('recommended')}</h4>
                    <div className="space-y-1">
                       {adjustedProtocol.stages.map((stage, index) => (
                             <p key={stage.type} className={`font-semibold ${protocol.stages[index].duration !== stage.duration ? 'text-amber-600 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                 {t('stage_duration_display', { stageName: t(`stage_${stage.type}`), duration: (stage.duration / 60).toFixed(1) })}
                             </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-10 flex flex-col items-center space-y-4">
          <button 
            onClick={() => onStart(adjustedProtocol)} 
            className="w-full bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-full text-xl hover:bg-amber-400 transition-transform transform hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            {t('start_adjusted')}
          </button>
          {hasChanges && (
            <button 
                onClick={() => onStart(protocol)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline transition-colors"
            >
                {t('start_original')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface TempSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    color: string;
    accent: string;
}

const TempSlider: React.FC<TempSliderProps> = ({ label, value, onChange, min, max, step, color, accent }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
            <label className={`font-bold flex items-center space-x-2 ${color}`}>
                <ThermometerIcon className="w-5 h-5" />
                <span>{label}</span>
            </label>
            <span className="font-mono text-lg text-slate-900 dark:text-white">{value}°C</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className={`w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer ${accent}`}
        />
    </div>
);
