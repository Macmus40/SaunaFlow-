import React from 'react';
import type { SessionLog } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { FaceFrownIcon, FaceNeutralIcon, FaceSmileIcon, PencilIcon } from './icons/Icons';

const MoodIcon: React.FC<{ mood: 'stressed' | 'neutral' | 'calm' }> = ({ mood }) => {
    switch(mood) {
        case 'stressed': return <FaceFrownIcon />;
        case 'neutral': return <FaceNeutralIcon />;
        case 'calm': return <FaceSmileIcon />;
        default: return null;
    }
};

interface WellbeingSummaryProps {
    sessionLog: SessionLog;
}

export const WellbeingSummary: React.FC<WellbeingSummaryProps> = ({ sessionLog }) => {
    const { t } = useLanguage();
    const hasWellbeingData = sessionLog.mood || sessionLog.energy || sessionLog.hydration || sessionLog.intention;

    if (!hasWellbeingData) {
        return null;
    }

    return (
        <div className="bg-slate-800 rounded-2xl p-6 mt-6 w-full max-w-sm border border-slate-700">
            <h2 className="text-lg font-bold text-slate-300 mb-4 text-center">{t('wellbeing_summary_title')}</h2>
            <div className="space-y-3 text-left">
                {sessionLog.mood && (
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 text-amber-400 flex-shrink-0"><MoodIcon mood={sessionLog.mood} /></div>
                        <span className="text-slate-400">{t('mood_label')}: <span className="font-semibold text-slate-200">{t(`mood_${sessionLog.mood}`)}</span></span>
                    </div>
                )}
                {sessionLog.energy && (
                     <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 text-amber-400 flex-shrink-0">⚡️</div>
                        <span className="text-slate-400">{t('energy_label')}: <span className="font-semibold text-slate-200">{sessionLog.energy}/5</span></span>
                    </div>
                )}
                 {sessionLog.hydration && (
                     <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 text-amber-400 flex-shrink-0">💧</div>
                        <span className="text-slate-400">{t('hydration_label')}: <span className="font-semibold text-slate-200">{sessionLog.hydration}/5</span></span>
                    </div>
                )}
                 {sessionLog.intention && (
                     <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 text-amber-400 flex-shrink-0 pt-1"><PencilIcon /></div>
                        <span className="text-slate-400">{t('intention_label')}: <span className="font-semibold text-slate-200 italic">"{sessionLog.intention}"</span></span>
                    </div>
                )}
            </div>
        </div>
    );
};
