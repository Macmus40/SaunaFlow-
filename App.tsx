import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/auth-js';
import { supabase, IS_CONFIGURED, IS_TEST_MODE } from './lib/supabaseClient';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HealthCheckScreen } from './components/admin/HealthCheckScreen';
import { AuthScreen } from './components/AuthScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ProtocolSelectionScreen } from './components/ProtocolSelectionScreen';
import { SessionSettingsScreen } from './components/SessionSettingsScreen';
import { WellbeingCheckScreen } from './components/WellbeingCheckScreen';
import { SessionScreen } from './components/SessionScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { AdminPanel } from './components/admin/AdminPanel';
import { HistoryDetailScreen } from './components/HistoryDetailScreen';
import { ProfileSettingsScreen } from './components/ProfileSettingsScreen';
import { DebugPanel } from './components/DebugPanel';
import { AppState, Goal } from './types';
import type { Protocol, SessionLog, UserPreferences } from './types';

const DEFAULT_PREFERENCES: UserPreferences = {
    defaultTimerStyle: 'circle',
    defaultVolume: 0.5,
    defaultVoiceGuidance: true,
    defaultVoice: 'Kore',
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Loading);
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [sessionHistory, setSessionHistory] = useState<SessionLog[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [lastCompletedSession, setLastCompletedSession] = useState<SessionLog | null>(null);
  const [selectedHistoryLog, setSelectedHistoryLog] = useState<SessionLog | null>(null);
  const [sessionSettings, setSessionSettings] = useState<any>({ voiceGuidance: true, voice: 'Kore' });
  const [showDebug, setShowDebug] = useState(false);

  const cleanUrl = useCallback(() => {
    if (window.location.hash.includes('access_token=')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    if (!IS_CONFIGURED) { setAuthReady(true); setAppState(AppState.Auth); return; }
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        if (initialSession) cleanUrl();
      } catch (e) { console.error(e); } finally { setAuthReady(true); }
    };
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') { if (newSession) cleanUrl(); }
      if (event === 'SIGNED_OUT') setAppState(AppState.Auth);
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, [cleanUrl]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authReady) return;
      if (!session) { setAppState(AppState.Auth); return; }
      const healthAccepted = localStorage.getItem('saunaflow_health_check_accepted') === 'true';
      if (!healthAccepted) { setAppState(AppState.HealthCheck); return; }
      setAppState(AppState.Loading);
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          setUsername(profile.username);
          setGoal(profile.goal as Goal);
          const { data: history } = await supabase.from('session_history').select('*').eq('user_id', session.user.id).order('date', { ascending: false });
          setSessionHistory(history || []);
          setAppState(AppState.Dashboard);
        } else { setAppState(AppState.Onboarding); }
      } catch (err) { setAppState(AppState.Onboarding); }
    };
    fetchUserData();
  }, [session, authReady]);

  const renderContent = () => {
    if (showDebug) return <DebugPanel session={session} onExit={() => setShowDebug(false)} />;
    if (!authReady) return <div className="flex h-screen items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
    
    switch (appState) {
      case AppState.HealthCheck: return <HealthCheckScreen onComplete={() => setAppState(AppState.Auth)} />;
      case AppState.Auth: return <AuthScreen onDevLogin={() => setSession({ user: { id: 'dev-user', email: 'dev@saunaflow.com' } } as any)} isSupabaseConfigured={IS_CONFIGURED} isTestMode={IS_TEST_MODE} onOpenDebug={() => setShowDebug(true)} />;
      case AppState.Onboarding: return <OnboardingScreen onOnboardingComplete={(n, g) => { setUsername(n); setGoal(g); setAppState(AppState.Dashboard); }} />;
      case AppState.Dashboard: return <DashboardScreen session={session} username={username} goal={goal} sessionHistory={sessionHistory} onStartRitual={() => setAppState(AppState.ProtocolSelection)} onResetApp={() => setAppState(AppState.Auth)} onEnterAdmin={() => setAppState(AppState.AdminPanel)} onViewHistoryDetail={(log) => { setSelectedHistoryLog(log); setAppState(AppState.HistoryDetail); }} onGoToProfileSettings={() => setAppState(AppState.ProfileSettings)} />;
      case AppState.ProtocolSelection: return <ProtocolSelectionScreen goal={goal} onProtocolSelected={(p) => { setSelectedProtocol(p); setAppState(AppState.SessionSettings); }} onBack={() => setAppState(AppState.Dashboard)} onCustomRitual={() => {}} />;
      case AppState.SessionSettings: return <SessionSettingsScreen protocol={selectedProtocol!} defaultVoiceGuidance={userPreferences.defaultVoiceGuidance} defaultVoice={userPreferences.defaultVoice} onStart={(p, s) => { setSelectedProtocol(p); setSessionSettings(s); setAppState(AppState.WellbeingCheck); }} onBack={() => setAppState(AppState.ProtocolSelection)} />;
      case AppState.WellbeingCheck: return <WellbeingCheckScreen onComplete={() => setAppState(AppState.InSession)} onBack={() => setAppState(AppState.SessionSettings)} />;
      case AppState.InSession: return <SessionScreen protocol={selectedProtocol!} onSessionComplete={(l) => { setSessionHistory([l as SessionLog, ...sessionHistory]); setLastCompletedSession(l as SessionLog); setAppState(AppState.Summary); }} onExit={() => setAppState(AppState.Dashboard)} voiceGuidanceEnabled={sessionSettings.voiceGuidance} voice={sessionSettings.voice} defaultTimerStyle={userPreferences.defaultTimerStyle} defaultVolume={userPreferences.defaultVolume} />;
      case AppState.Summary: return <SummaryScreen sessionLog={lastCompletedSession!} onDone={() => setAppState(AppState.Dashboard)} />;
      case AppState.AdminPanel: return <AdminPanel session={session} onExit={() => setAppState(AppState.Dashboard)} />;
      case AppState.HistoryDetail: return <HistoryDetailScreen sessionLog={selectedHistoryLog!} onBack={() => setAppState(AppState.Dashboard)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans relative">
      {renderContent()}
    </div>
  );
};

export default App;
