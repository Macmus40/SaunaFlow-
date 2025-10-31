
import React from 'react';
import type { Protocol } from '../types';
import { Goal } from '../types';
import { PROTOCOLS } from '../constants';
import { SparklesIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ProtocolSelectionScreenProps {
  goal: Goal | null;
  onProtocolSelected: (protocol: Protocol) => void;
  onBack: () => void;
  onCustomRitual: () => void;
}

export const ProtocolSelectionScreen: React.FC<ProtocolSelectionScreenProps> = ({ goal, onProtocolSelected, onBack, onCustomRitual }) => {
  const { t } = useLanguage();
  const filteredProtocols = PROTOCOLS.filter(p => p.goal === goal);

  const title = goal === Goal.Relax 
    ? t('protocol_title_relax')
    : goal === Goal.Performance
    ? t('protocol_title_performance')
    : t('protocol_title_generic');

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900 p-6 text-white">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center justify-center mb-10">
            <button onClick={onBack} className="absolute left-0 text-slate-300 hover:text-white transition-colors">&larr; {t('back_to_dashboard')}</button>
            <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="space-y-6">
          <button
            onClick={onCustomRitual}
            className="w-full text-left bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-2xl border border-amber-400 hover:opacity-90 transition-all duration-300 shadow-lg shadow-amber-500/20"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 text-white"><SparklesIcon /></div>
              <div>
                <h2 className="text-xl font-bold mb-1 text-slate-900">{t('custom_ritual_title')}</h2>
                <p className="text-amber-900">{t('custom_ritual_desc')}</p>
              </div>
            </div>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-2 text-sm text-slate-500">{t('or_choose_preset')}</span>
            </div>
          </div>

          {filteredProtocols.map(protocol => (
            <button
              key={protocol.id}
              onClick={() => onProtocolSelected(protocol)}
              className="w-full text-left bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:bg-slate-700 hover:border-amber-400 transition-all duration-300"
            >
              <h2 className="text-xl font-bold mb-2">{t(protocol.name)}</h2>
              <p className="text-slate-400 mb-4">{t(protocol.description)}</p>
              <div className="flex space-x-4 text-sm text-slate-300">
                <span>{protocol.cycles} {t('cycles')}</span>
                <span>&bull;</span>
                <span>{protocol.stages.map(s => Math.round(s.duration / 60)).join(' / ')} {t('min_stages')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};