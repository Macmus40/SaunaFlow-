
import type { Protocol, Track } from './types';
import { Goal, StageType } from './types';

export const PROTOCOLS: Protocol[] = [
  {
    id: 'relax_1',
    name: 'protocol_relax_1_name',
    description: 'protocol_relax_1_desc',
    cycles: 2,
    goal: Goal.Relax,
    stages: [
      { type: StageType.Sauna, duration: 10 * 60 },
      { type: StageType.Cold, duration: 1 * 60 },
      { type: StageType.Rest, duration: 10 * 60 },
    ],
  },
  {
    id: 'relax_2',
    name: 'protocol_relax_2_name',
    description: 'protocol_relax_2_desc',
    cycles: 3,
    goal: Goal.Relax,
    stages: [
      { type: StageType.Sauna, duration: 15 * 60 },
      { type: StageType.Cold, duration: 2 * 60 },
      { type: StageType.Rest, duration: 15 * 60 },
    ],
  },
  {
    id: 'perf_1',
    name: 'protocol_perf_1_name',
    description: 'protocol_perf_1_desc',
    cycles: 3,
    goal: Goal.Performance,
    stages: [
      { type: StageType.Sauna, duration: 12 * 60 },
      { type: StageType.Cold, duration: 3 * 60 },
      { type: StageType.Rest, duration: 8 * 60 },
    ],
  },
    {
    id: 'perf_2',
    name: 'protocol_perf_2_name',
    description: 'protocol_perf_2_desc',
    cycles: 4,
    goal: Goal.Performance,
    stages: [
      { type: StageType.Sauna, duration: 15 * 60 },
      { type: StageType.Cold, duration: 4 * 60 },
      { type: StageType.Rest, duration: 10 * 60 },
    ],
  },
];

export const PLAYLIST: Track[] = [
  {
    id: 'hazy_after_hours',
    titleKey: 'music_hazy_after_hours_title',
    artistKey: 'music_artist_mixkit',
    src: 'https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6ad3?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    id: 'spirit_in_the_woods',
    titleKey: 'music_spirit_in_the_woods_title',
    artistKey: 'music_artist_mixkit',
    src: 'https://assets.mixkit.co/music/preview/mixkit-spirit-in-the-woods-13.mp3',
    cover: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    id: 'sleepy_cat',
    titleKey: 'music_sleepy_cat_title',
    artistKey: 'music_artist_mixkit',
    src: 'https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3',
    cover: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=100&h=100&q=80',
  }
];

export const STAGE_CONTENT: Record<StageType, { microcopy: string[], tips: string[] }> = {
  [StageType.Sauna]: {
    microcopy: [
      'microcopy_sauna_1',
      'microcopy_sauna_2',
      'microcopy_sauna_3',
      'microcopy_sauna_4',
      'microcopy_sauna_5',
    ],
    tips: [
        'tip_sauna_1',
        'tip_sauna_2',
        'tip_sauna_3',
    ]
  },
  [StageType.Cold]: {
    microcopy: [
      'microcopy_cold_1',
      'microcopy_cold_2',
      'microcopy_cold_3',
      'microcopy_cold_4',
      'microcopy_cold_5',
    ],
    tips: [
        'tip_cold_1',
        'tip_cold_2',
        'tip_cold_3',
    ]
  },
  [StageType.Rest]: {
    microcopy: [
      'microcopy_rest_1',
      'microcopy_rest_2',
      'microcopy_rest_3',
      'microcopy_rest_4',
      'microcopy_rest_5',
    ],
    tips: [
        'tip_rest_1',
        'tip_rest_2',
        'tip_rest_3',
    ]
  },
};

export const STAGE_COLORS: Record<StageType, { 
    bg: string; 
    text: string; 
    ring: string; 
    ringBg: string;
    bar: string;
    track: string;
    sand: string;
    glass: string;
}> = {
  [StageType.Sauna]: {
    bg: 'bg-slate-900',
    text: 'text-amber-400',
    ring: 'stroke-amber-400',
    ringBg: 'stroke-amber-400/20',
    bar: 'bg-amber-400',
    track: 'bg-amber-400/30',
    sand: 'fill-amber-400',
    glass: 'stroke-amber-400/40',
  },
  [StageType.Cold]: {
    bg: 'bg-slate-900',
    text: 'text-blue-400',
    ring: 'stroke-blue-400',
    ringBg: 'stroke-blue-400/20',
    bar: 'bg-blue-400',
    track: 'bg-blue-400/30',
    sand: 'fill-blue-400',
    glass: 'stroke-blue-400/40',
  },
  [StageType.Rest]: {
    bg: 'bg-slate-900',
    text: 'text-slate-300',
    ring: 'stroke-slate-400',
    ringBg: 'stroke-slate-400/20',
    bar: 'bg-slate-400',
    track: 'bg-slate-400/30',
    sand: 'fill-slate-400',
    glass: 'stroke-slate-400/40',
  },
};