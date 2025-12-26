import React, { useState, useMemo } from 'react';
import type { Protocol, Stage, VoiceName } from '../types';
import { StageType, VOICES } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ThermometerIcon, VolumeUpIcon } from './icons/Icons';
import { useActiveBackground } from '../hooks/useActiveBackground';

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

export const SessionSettingsScreen: React.FC<SessionSettingsScreenProps> = ({ protocol, defaultVoiceGuidance, defaultVoice, onStart, onBack }) => {
  const { t } = useLanguage();
  const [saunaTemp, setSaunaTemp] = useState(BASE_SAUNA_TEMP);
  const [coldTemp, setColdTemp] = useState(BASE_COLD_TEMP);
  const [isVoiceGuidanceEnabled, setIsVoiceGuidanceEnabled] = useState(defaultVoiceGuidance);
  const [voice, setVoice] = useState<VoiceName>(defaultVoice);
  const { backgroundUrl } = useActiveBackground('config');

  const containerStyle = backgroundUrl ? {
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url("${backgroundUrl}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white p-6 transition-all duration-1000" style={containerStyle}>
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center justify-center mb-6">
          <button onClick={onBack} className="absolute left-0 text-slate-300 hover:text-white transition-colors">&larr; {t('back')}</button>
          <h1 className="text-3xl font-bold text-center">{t('session_settings_title')}</h1>
        </div>
        
        <div className="space-y-6 mt-8">
            <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700">
                <label className="flex items-center gap-2 font-bold text-amber-400 mb-4"><ThermometerIcon className="w-5 h-5"/> Sauna Temperature: {saunaTemp}°C</label>
                <input type="range" min="60" max="110" value={saunaTemp} onChange={e => setSaunaTemp(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg accent-amber-500" />
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700">
                <label className="flex items-center gap-2 font-bold text-sky-400 mb-4"><ThermometerIcon className="w-5 h-5"/> Water Temperature: {coldTemp}°C</label>
                <input type="range" min="1" max="20" value={coldTemp} onChange={e => setColdTemp(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg accent-sky-500" />
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <label className="font-bold text-slate-200">Voice Guidance</label>
                        <p className="text-sm text-slate-400">Assistant cues for each stage.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isVoiceGuidanceEnabled} onChange={() => setIsVoiceGuidanceEnabled(v => !v)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 rounded-full peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>
            </div>
        </div>

        <div className="mt-12">
          <button 
            onClick={() => onStart(protocol, { voiceGuidance: isVoiceGuidanceEnabled, voice })} 
            className="w-full bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-full text-xl hover:bg-amber-400 transition-transform active:scale-95 shadow-xl"
          >
            {t('begin_session')}
          </button>
        </div>
      </div>
    </div>
  );
};
