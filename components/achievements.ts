
import React from 'react';
import type { Achievement, SessionLog } from '../types';
import { Goal } from '../types';
import { FireIcon, TrophyIcon, SparklesIcon, HeartIcon, BoltIcon } from './icons/Icons';

export const ALL_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_flame',
        title: 'achievement_first_flame_title',
        description: 'achievement_first_flame_desc',
        icon: React.createElement(FireIcon),
        isUnlocked: (history: SessionLog[]) => history.length >= 1,
    },
    {
        id: 'consistent_ember',
        title: 'achievement_consistent_ember_title',
        description: 'achievement_consistent_ember_desc',
        icon: React.createElement(SparklesIcon),
        isUnlocked: (history: SessionLog[], streak: number) => streak >= 7,
    },
    {
        id: 'sauna_veteran',
        title: 'achievement_sauna_veteran_title',
        description: 'achievement_sauna_veteran_desc',
        icon: React.createElement(TrophyIcon),
        isUnlocked: (history: SessionLog[]) => history.length >= 25,
    },
    {
        id: 'zen_turtle',
        title: 'achievement_zen_turtle_title',
        description: 'achievement_zen_turtle_desc',
        icon: React.createElement(HeartIcon),
        isUnlocked: (history: SessionLog[]) => history.some(log => log.goal === Goal.Relax),
    },
    {
        id: 'the_phoenix',
        title: 'achievement_the_phoenix_title',
        description: 'achievement_the_phoenix_desc',
        icon: React.createElement(BoltIcon),
        isUnlocked: (history: SessionLog[]) => history.some(log => log.goal === Goal.Performance),
    },
];
