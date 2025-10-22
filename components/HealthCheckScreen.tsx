
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldCheckIcon } from './icons/Icons';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HealthCheckScreenProps {
  onComplete: () => void;
}

const CHECKLIST_ITEMS = [
    'health_check_statement_1',
    'health_check_statement_2',
    'health_check_statement_3',
    'health_check_statement_4',
    'health_check_statement_5',
];

const backgroundImage = 'https://images.unsplash.com/photo-1544161515-cfd626dba494?auto=format&fit=crop&w=1280&q=80';

export const HealthCheckScreen: React.FC<HealthCheckScreenProps> = ({ onComplete }) => {
    const { t } = useLanguage();
    const [checked, setChecked] = useState(new Array(CHECKLIST_ITEMS.length).fill(false));

    const handleCheckboxChange = (index: number) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        setChecked(newChecked);
    };

    const allChecked = checked.every(Boolean);

    return (
        <div className="relative flex flex-col min-h-screen text-white">
            <div
                className="absolute inset-0 bg-cover bg-center -z-10"
                style={{ backgroundImage: `url("${backgroundImage}")`, filter: 'blur(4px) brightness(0.6)' }}
            />
            <div className="absolute inset-0 bg-black/60 -z-10" />

            <header className="w-full flex justify-end p-4 sm:p-6">
                <LanguageSwitcher />
            </header>
            <main className="flex flex-col items-center justify-center flex-grow text-center p-4 sm:p-6">
                <div className="w-full max-w-lg">
                    <div className="text-amber-400 w-16 h-16 mx-auto mb-4">
                        <ShieldCheckIcon />
                    </div>
                    <h1 className="text-3xl font-bold mb-3">{t('health_check_title')}</h1>
                    <p className="text-slate-300 mb-8">{t('health_check_subtitle')}</p>

                    <div className="space-y-4 text-left bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                        {CHECKLIST_ITEMS.map((itemKey, index) => (
                            <label key={itemKey} className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={checked[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                    className="mt-1 h-5 w-5 rounded border-slate-500 bg-slate-700/80 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-800"
                                />
                                <span className="text-slate-300">{t(itemKey)}</span>
                            </label>
                        ))}
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={onComplete}
                            disabled={!allChecked}
                            className="w-full bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400"
                        >
                            {allChecked ? t('health_check_button_enabled') : t('health_check_button_disabled')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
