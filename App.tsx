
import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HealthCheckScreen } from './components/HealthCheckScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ProtocolSelectionScreen } from './components/ProtocolSelectionScreen';
import { CustomProtocolScreen } from './components/CustomProtocolScreen';
import { SessionSettingsScreen } from './components/SessionSettingsScreen';
import { WellbeingCheckScreen } from './components/WellbeingCheckScreen';
import { SessionScreen } from './components/SessionScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthScreen } from './components/AuthScreen';
import { AppState, Goal } from './types';
import type { Protocol, SessionLog } from './types';


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Loading);
  const [session, setSession] = useState<Session | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionLog[]>([]);
  const [lastCompletedSession, setLastCompletedSession] = useState<SessionLog | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const healthCheckAccepted = localStorage.getItem('saunaflow_health_check_accepted') === 'true';

      if (!healthCheckAccepted) {
        setAppState(AppState.HealthCheck);
      } else if (!session) {
        setAppState(AppState.Auth);
      } else {
        setAppState(AppState.Loading);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, goal')
          .eq('id', session.user.id)
          .single();
        
        // PGRST116: "JSON object requested, but row count returned was 0" means no profile found, which is not an error here.
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          setAppState(AppState.Auth);
          return;
        }

        if (profile) {
          setUsername(profile.username);
          setGoal(profile.goal as Goal);

          const { data: history, error: historyError } = await supabase
            .from('session_history')
            .select('*')
            .eq('user_id', session.user.id)
            .order('date', { ascending: false });

          if (historyError) {
            console.error("Error fetching session history:", historyError);
          } else {
            setSessionHistory(history || []);
          }
          setAppState(AppState.Dashboard);
        } else {
          setAppState(AppState.Onboarding);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Bezpieczne sprawdzanie niespójnych stanów.
  useEffect(() => {
    const statesRequiringProtocol: AppState[] = [
        AppState.SessionSettings,
        AppState.WellbeingCheck,
        AppState.InSession,
    ];
    if (statesRequiringProtocol.includes(appState) && !selectedProtocol) {
      console.warn(`Niespójny stan: ${AppState[appState]} bez protokołu. Powrót do pulpitu.`);
      setAppState(AppState.Dashboard);
    }
    if (appState === AppState.Summary && !lastCompletedSession) {
      console.warn("Niespójny stan: Podsumowanie bez logu sesji. Powrót do pulpitu.");
      setAppState(AppState.Dashboard);
    }
  }, [appState, selectedProtocol, lastCompletedSession]);

  const handleHealthCheckComplete = () => {
    localStorage.setItem('saunaflow_health_check_accepted', 'true');
    if (!session) {
        setAppState(AppState.Auth);
    }
    // The onAuthStateChange listener will handle fetching the profile or redirecting to Onboarding.
  };
  
  const handleDevLogin = async () => {
      // Create a mock session object. The user ID must be a valid UUID for Supabase RLS to work.
      const devSession = {
        user: { 
            id: '8d12a197-24d9-43e8-8e8a-2e4a6b28eb7a', // A sample UUID
            email: 'dev@saunaflow.com' 
        },
        // Add other required properties of the Session object, even if they are null
        access_token: 'dev-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'dev-refresh-token',
      } as unknown as Session;
      
      setSession(devSession);
      // Manually trigger the logic that onAuthStateChange would handle
      setAppState(AppState.Loading);
      const { data: profile } = await supabase
          .from('profiles')
          .select('username, goal')
          .eq('id', devSession.user.id)
          .single();

      if (profile) {
        setUsername(profile.username);
        setGoal(profile.goal as Goal);
        const { data: history } = await supabase
            .from('session_history')
            .select('*')
            .eq('user_id', devSession.user.id)
            .order('date', { ascending: false });
        setSessionHistory(history || []);
        setAppState(AppState.Dashboard);
      } else {
        setAppState(AppState.Onboarding);
      }
  };

  const handleOnboardingComplete = async (name: string, selectedGoal: Goal) => {
    if (!session) return;
    
    const { error } = await supabase.from('profiles').insert({
      id: session.user.id,
      username: name,
      goal: selectedGoal
    });

    if (error) {
      console.error("Error saving profile:", error);
      // TODO: Show an error message to the user
    } else {
      setUsername(name);
      setGoal(selectedGoal);
      setAppState(AppState.Dashboard);
    }
  };

  const handleStartRitual = () => {
    setAppState(AppState.ProtocolSelection);
  };

  const handleCreateCustomRitual = () => {
    setAppState(AppState.CustomProtocol);
  };

  const handleProtocolSelected = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setAppState(AppState.SessionSettings);
  };

  const handleProceedToWellbeing = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setAppState(AppState.WellbeingCheck);
  };

  const handleStartSession = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setAppState(AppState.InSession);
  };
  
  const handleExitSession = () => {
    setSelectedProtocol(null);
    setAppState(AppState.Dashboard);
  };

  const handleSessionComplete = useCallback(async (sessionLog: SessionLog) => {
    if (!session) return;

    const { error } = await supabase.from('session_history').insert({
      ...sessionLog,
      user_id: session.user.id,
    });

    if (error) {
      console.error("Error saving session history:", error);
    }

    const newHistory = [sessionLog, ...sessionHistory];
    setSessionHistory(newHistory);
    setLastCompletedSession(sessionLog);
    setAppState(AppState.Summary);
  }, [sessionHistory, session]);

  const handleBackToDashboard = () => {
    setSelectedProtocol(null);
    setLastCompletedSession(null);
    setAppState(AppState.Dashboard);
  };
  
  const handleBackToProtocolSelection = () => {
    setSelectedProtocol(null);
    setAppState(AppState.ProtocolSelection);
  }

  const handleBackToSessionSettings = () => {
    setAppState(AppState.SessionSettings);
  };

  const handleChangeGoal = async () => {
    if (!session || !goal) return;
    const newGoal = goal === Goal.Relax ? Goal.Performance : Goal.Relax;
    setGoal(newGoal); // Optimistic UI update

    const { error } = await supabase
      .from('profiles')
      .update({ goal: newGoal })
      .eq('id', session.user.id);
    
    if (error) {
        console.error("Error updating goal:", error);
        setGoal(goal); // Revert on error
    }
  };

  const handleResetApp = async () => {
    await supabase.auth.signOut();
    // Clear local state to prevent flash of old content
    setSession(null);
    setGoal(null);
    setUsername(null);
    setSessionHistory([]);
    setLastCompletedSession(null);
    // onAuthStateChange will set appState to Auth
  };
  
  const handleEnterAdmin = () => {
    setAppState(AppState.AdminPanel);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.Loading:
        return (
          <div className="flex items-center justify-center h-screen bg-slate-900">
            <div className="text-white text-xl">Loading SaunaFlow...</div>
          </div>
        );
      case AppState.HealthCheck:
        return <HealthCheckScreen onComplete={handleHealthCheckComplete} />;
      case AppState.Auth:
        return <AuthScreen onDevLogin={handleDevLogin} />;
      case AppState.Onboarding:
        return <OnboardingScreen onOnboardingComplete={handleOnboardingComplete} />;
      case AppState.Dashboard:
        return <DashboardScreen 
                  session={session}
                  username={username}
                  goal={goal} 
                  sessionHistory={sessionHistory}
                  onStartRitual={handleStartRitual}
                  onChangeGoal={handleChangeGoal}
                  onResetApp={handleResetApp}
                  onEnterAdmin={handleEnterAdmin}
                />;
      case AppState.ProtocolSelection:
        return <ProtocolSelectionScreen 
                  goal={goal} 
                  onProtocolSelected={handleProtocolSelected}
                  onBack={handleBackToDashboard}
                  onCustomRitual={handleCreateCustomRitual}
                />;
      case AppState.CustomProtocol:
        return <CustomProtocolScreen
                  goal={goal}
                  onStartProtocol={handleProtocolSelected}
                  onBack={handleBackToProtocolSelection}
                />;
      case AppState.SessionSettings:
        if (!selectedProtocol) return null;
        return <SessionSettingsScreen 
                  protocol={selectedProtocol}
                  onStart={handleProceedToWellbeing}
                  onBack={handleBackToProtocolSelection}
                />;
      case AppState.WellbeingCheck:
        if (!selectedProtocol) return null;
        return <WellbeingCheckScreen
                    protocol={selectedProtocol}
                    onComplete={handleStartSession}
                    onBack={handleBackToSessionSettings}
                />;
      case AppState.InSession:
        if (!selectedProtocol) return null;
        return <SessionScreen 
                  protocol={selectedProtocol} 
                  onSessionComplete={handleSessionComplete} 
                  onExit={handleExitSession}
                />;
      case AppState.Summary:
        if (!lastCompletedSession) return null;
        return <SummaryScreen 
                  sessionLog={lastCompletedSession} 
                  onDone={handleBackToDashboard} 
                />;
      case AppState.AdminPanel:
        return <AdminPanel onExit={handleBackToDashboard} />;
      default:
        return (
          <div className="flex items-center justify-center h-screen bg-slate-900">
            <div className="text-white text-xl">Loading SaunaFlow...</div>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-slate-900">{renderContent()}</div>;
};

export default App;
