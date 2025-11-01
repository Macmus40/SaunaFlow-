
import React from 'react';
import type { SessionLog } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SummaryScreenProps {
  sessionLog: SessionLog;
  onDone: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ sessionLog, onDone }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8 text-center">
      <div className="mb-4 text-6xl">🎉</div>
      <h1 className="text-4xl font-bold mb-2">{t('summary_title')}</h1>
      <p className="text-slate-300 text-lg mb-10">{t('summary_subtitle', { protocolName: sessionLog.protocolName })}</p>

      <div className="bg-slate-800 rounded-2xl p-8 mb-12 w-full max-w-sm border border-slate-700">
        <div className="flex justify-between py-4 border-b border-slate-700">
          <span className="text-slate-400">{t('summary_total_time')}</span>
          <span className="font-bold text-xl">{Math.round(sessionLog.totalTime / 60)} {t('minutes')}</span>
        </div>
        <div className="flex justify-between pt-4">
          <span className="text-slate-400">{t('summary_cycles_completed')}</span>
          <span className="font-bold text-xl">{sessionLog.cyclesCompleted}</span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="bg-amber-500 text-slate-900 font-bold py-4 px-12 rounded-full text-lg hover:bg-amber-400 transition-colors"
      >
        {t('done')}
      </button>
    </div>
  );
};