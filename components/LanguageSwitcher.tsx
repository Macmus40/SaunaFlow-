
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FlagUKIcon, FlagPLIcon, FlagDEIcon, FlagDKIcon, FlagSEIcon, FlagNOIcon, FlagFIIcon } from './icons/Icons';

type Language = {
    code: 'en' | 'pl' | 'de' | 'da' | 'sv' | 'no' | 'fi';
    Icon: React.FC<{ className?: string }>;
}

const LANGUAGES: Language[] = [
    { code: 'en', Icon: FlagUKIcon },
    { code: 'de', Icon: FlagDEIcon },
    { code: 'pl', Icon: FlagPLIcon },
    { code: 'da', Icon: FlagDKIcon },
    { code: 'sv', Icon: FlagSEIcon },
    { code: 'no', Icon: FlagNOIcon },
    { code: 'fi', Icon: FlagFIIcon },
];

export const LanguageSwitcher: React.FC = () => {
    const { lang, setLang } = useLanguage();

    return (
        <div className="flex items-center space-x-2 bg-slate-800/50 p-1.5 rounded-full border border-slate-700">
            {LANGUAGES.map(({ code, Icon }) => (
                <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={`w-8 h-8 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-110 focus:outline-none ${
                        lang === code ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-800' : 'opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`Switch to ${code} language`}
                >
                    <Icon className="w-full h-full object-cover" />
                </button>
            ))}
        </div>
    );
};
