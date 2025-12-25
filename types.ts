import React from 'react';

export enum Goal {
  Relax = 'Relax',
  Performance = 'Performance',
}

export enum StageType {
  Sauna = 'SAUNA',
  Cold = 'COLD',
  Rest = 'REST',
}

export interface Stage {
  type: StageType;
  duration: number; // in seconds
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  cycles: number;
  stages: Stage[];
  goal: Goal;
}

export interface SessionLog {
  protocolName: string;
  totalTime: number; // in seconds
  cyclesCompleted: number;
  date: string;
  goal: Goal | null;
  hydration?: number; // 1-5
  energy?: number; // 1-5
  mood?: 'stressed' | 'neutral' | 'calm';
  intention?: string;
  user_id?: string;
}

export interface BackgroundImage {
  id: string;
  url: string;
  storage_path: string;
  created_at: string;
  created_by: string;
}

export enum AppState {
    Loading,
    HealthCheck,
    Auth,
    Onboarding,
    Dashboard,
    ProtocolSelection,
    CustomProtocol,
    SessionSettings,
    WellbeingCheck,
    InSession,
    Summary,
    AdminPanel,
    HistoryDetail,
    ProfileSettings,
}

export interface Achievement {
    id:string;
    title: string;
    description: string;
    icon: React.ReactNode;
    isUnlocked: (sessionHistory: SessionLog[], streak: number) => boolean;
}

export interface Track {
  id: string;
  titleKey: string;
  artistKey: string;
  src: string;
  cover: string;
}

export type TimerStyle = 'circle' | 'bar' | 'digital' | 'hourglass';
export type TimerStatus = 'initial' | 'running' | 'paused' | 'completed';

export const VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'] as const;
export type VoiceName = typeof VOICES[number];

export interface UserPreferences {
    defaultTimerStyle: TimerStyle;
    defaultVolume: number;
    defaultVoiceGuidance: boolean;
    defaultVoice: VoiceName;
}

// Admin Panel Types
export type SubscriptionStatus = 'Active' | 'Expired' | 'Lifetime';
export type UserGroup = 'Individual' | 'Corporate' | 'Friends';

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  subscriptionStatus: SubscriptionStatus;
  group: UserGroup;
  sessionCount: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // in USD
  billingCycle: 'monthly' | 'yearly' | 'once';
}

export interface TimerProps {
  progress: number;
  timeLeft: number;
  colors: {
      ring: string;
      ringBg: string;
      text: string;
      bar: string;
      track: string;
      sand: string;
      glass: string;
  };
  stageType: StageType;
}

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};