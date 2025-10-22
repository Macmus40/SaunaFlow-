// Fix: Import React to resolve 'Cannot find namespace React' error.
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
}

export enum AppState {
    Loading,
    HealthCheck,
    Onboarding,
    Dashboard,
    ProtocolSelection,
    CustomProtocol,
    SessionSettings,
    WellbeingCheck,
    InSession,
    Summary,
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