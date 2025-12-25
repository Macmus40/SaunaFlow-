import React from 'react';
import type { SessionLog } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { WellbeingSummary } from './WellbeingSummary';

interface HistoryDetailScreenProps {
  sessionLog: SessionLog;
  onBack: () => void;
}

export const HistoryDetailScreen: React.FC<HistoryDetailScreenProps> = ({ sessionLog, onBack }) => {
  const { t } = useLanguage();
  const date = new Date(sessionLog.date);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white p-6">
       <div className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center justify-center mb-6">
            <button onClick={onBack} className="absolute left-0 text-slate-300 hover:text-white transition-colors">&larr; {t('back_to_dashboard')}</button>
            <h1 className="text-3xl font-bold text-center">{t('history_detail_title')}</h1>
        </div>
        <p className="text-slate-400 text-center mb-10">
            {date.toLocaleDateString(t('lang_code'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' at '}
            {date.toLocaleTimeString(t('lang_code'), { hour: '2-digit', minute: '2-digit' })}
        </p>

        <div className="flex flex-col items-center">
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm border border-slate-700">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-amber-400">{sessionLog.protocolName}</h2>
                    <p className="text-slate-400">{t('goal_label', { goal: t(`goal_${sessionLog.goal}`) })}</p>
                </div>
                <div className="flex justify-between py-4 border-b border-slate-700">
                    <span className="text-slate-400">{t('summary_total_time')}</span>
                    <span className="font-bold text-xl">{Math.round(sessionLog.totalTime / 60)} {t('minutes')}</span>
                </div>
                <div className="flex justify-between pt-4">
                    <span className="text-slate-400">{t('summary_cycles_completed')}</span>
                    <span className="font-bold text-xl">{sessionLog.cyclesCompleted}</span>
                </div>
            </div>
            
            <WellbeingSummary sessionLog={sessionLog} />
        </div>
      </div>
    </div>
  );
};
