
import React, { useState, useMemo } from 'react';
import type { Protocol, Stage, VoiceName } from '../types';
import { StageType, VOICES } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ThermometerIcon, VolumeUpIcon } from './icons/Icons';

type SessionSettings = {
    voiceGuidance: boolean;
    voice: VoiceName;
};

interface SessionSettingsScreenProps {
  protocol: Protocol;
  defaultVoiceGuidance: boolean;
  defaultVoice: VoiceName;
  onStart: (protocol: Protocol, settings: SessionSettings) => void;
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


export const SessionSettingsScreen: React.FC<SessionSettingsScreenProps> = ({ protocol, defaultVoiceGuidance, defaultVoice, onStart, onBack }) => {
  const { t } = useLanguage();
  const [saunaTemp, setSaunaTemp] = useState(BASE_SAUNA_TEMP);
  const [coldTemp, setColdTemp] = useState(BASE_COLD_TEMP);
  const [isVoiceGuidanceEnabled, setIsVoiceGuidanceEnabled] = useState(defaultVoiceGuidance);
  const [voice, setVoice] = useState<VoiceName>(defaultVoice);

  const adjustedProtocol = useMemo(
    () => calculateAdjustedProtocol(protocol, saunaTemp, coldTemp),
    [protocol, saunaTemp, coldTemp]
  );
  
  const hasChanges = JSON.stringify(protocol.stages) !== JSON.stringify(adjustedProtocol.stages);

  const handleStart = (useAdjusted: boolean) => {
      const selectedProtocol = useAdjusted ? adjustedProtocol : protocol;
      onStart(selectedProtocol, { voiceGuidance: isVoiceGuidanceEnabled, voice });
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center justify-center mb-6">
          <button onClick={onBack} className="absolute left-0 text-slate-300 hover:text-white transition-colors">&larr; {t('back')}</button>
          <h1 className="text-3xl font-bold text-center">{t('session_settings_title')}</h1>
        </div>
        <p className="text-slate-400 text-center mb-10">{t('session_settings_subtitle')}</p>

        <div className="space-y-6">
            <TempSlider
                label={t('sauna_temp')}
                value={saunaTemp}
                onChange={setSaunaTemp}
                min={60}
                max={110}
                step={1}
                color="text-amber-400"
                accent="accent-amber-500"
            />
            <TempSlider
                label={t('water_temp')}
                value={coldTemp}
                onChange={setColdTemp}
                min={1}
                max={20}
                step={1}
                color="text-sky-400"
                accent="accent-sky-500"
            />
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <label className="font-bold flex items-center space-x-2 text-slate-200">
                            <VolumeUpIcon className="w-5 h-5" />
                            <span>{t('audio_guidance_label')}</span>
                        </label>
                        <p className="text-sm text-slate-400 mt-1">{t('audio_guidance_desc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isVoiceGuidanceEnabled} onChange={() => setIsVoiceGuidanceEnabled(v => !v)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-amber-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                {isVoiceGuidanceEnabled && (
                    <div className="border-t border-slate-700 pt-4">
                        <label className="block text-sm font-medium text-slate-400 mb-2">{t('assistant_voice_label')}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {VOICES.map(v => (
                                <button
                                    key={v}
                                    onClick={() => setVoice(v)}
                                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${voice === v ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
                                >
                                    {t(`voice_${v}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        {hasChanges && (
            <div className="mt-10 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                <h3 className="text-lg font-bold text-slate-200 mb-4 text-center">{t('adjusted_times')}</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">{t('original')}</h4>
                        <div className="space-y-1">
                            {protocol.stages.map(stage => (
                                <p key={stage.type} className="text-slate-300">
                                    {t('stage_duration_display', { stageName: t(`stage_${stage.type}`), duration: Math.round(stage.duration / 60) })}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-amber-400 mb-2">{t('recommended')}</h4>
                        <div className="space-y-1">
                        {adjustedProtocol.stages.map((stage, index) => (
                                <p key={stage.type} className={`font-semibold ${protocol.stages[index].duration !== stage.duration ? 'text-amber-300' : 'text-slate-300'}`}>
                                    {t('stage_duration_display', { stageName: t(`stage_${stage.type}`), duration: (stage.duration / 60).toFixed(1) })}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-10 flex flex-col items-center space-y-4">
          <button 
            onClick={() => handleStart(true)} 
            className="w-full bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-full text-xl hover:bg-amber-400 transition-transform transform hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            {hasChanges ? t('start_adjusted') : t('begin_session')}
          </button>
          {hasChanges && (
            <button 
                onClick={() => handleStart(false)}
                className="text-slate-400 hover:text-white underline transition-colors"
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
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-2">
            <label className={`font-bold flex items-center space-x-2 ${color}`}>
                <ThermometerIcon className="w-5 h-5" />
                <span>{label}</span>
            </label>
            <span className="font-mono text-lg text-white">{value}°C</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className={`w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer ${accent}`}
        />
    </div>
);
