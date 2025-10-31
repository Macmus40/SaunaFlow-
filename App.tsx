
import React, { useState, useEffect, useCallback } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HealthCheckScreen } from './components/HealthCheckScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ProtocolSelectionScreen } from './components/ProtocolSelectionScreen';
import { CustomProtocolScreen } from './components/CustomProtocolScreen';
import { SessionSettingsScreen } from './components/SessionSettingsScreen';
import { WellbeingCheckScreen } from './components/WellbeingCheckScreen';
import { SessionScreen } from './components/SessionScreen';
import { SummaryScreen } from './components/SummaryScreen';
import type { Goal, Protocol, SessionLog } from './types';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Loading);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionLog[]>([]);
  const [lastCompletedSession, setLastCompletedSession] = useState<SessionLog | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    try {
      const healthCheckAccepted = localStorage.getItem('saunaflow_health_check_accepted') === 'true';

      if (!healthCheckAccepted) {
        setAppState(AppState.HealthCheck);
        return;
      }

      const storedGoal = localStorage.getItem('saunaflow_goal');
      const storedName = localStorage.getItem('saunaflow_username');
      const storedHistory = localStorage.getItem('saunaflow_history');
      
      if (storedGoal && storedName) {
        setGoal(storedGoal as Goal);
        setUserName(storedName);
        setAppState(AppState.Dashboard);
      } else {
        setAppState(AppState.Onboarding);
      }

      if (storedHistory) {
        setSessionHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
      localStorage.removeItem('saunaflow_health_check_accepted');
      setAppState(AppState.HealthCheck);
    }
  }, []);
  
  // Handles inconsistent states safely.
  useEffect(() => {
    const statesRequiringProtocol: AppState[] = [
        AppState.SessionSettings,
        AppState.WellbeingCheck,
        AppState.InSession,
    ];
    if (statesRequiringProtocol.includes(appState) && !selectedProtocol) {
      console.warn(`Inconsistent state: ${AppState[appState]} with no protocol. Returning to dashboard.`);
      setAppState(AppState.Dashboard);
    }
    if (appState === AppState.Summary && !lastCompletedSession) {
      console.warn("Inconsistent state: Summary with no session log. Returning to dashboard.");
      setAppState(AppState.Dashboard);
    }
  }, [appState, selectedProtocol, lastCompletedSession]);

  // Effect to handle the actual reset logic robustly.
  useEffect(() => {
    if (isResetting) {
      localStorage.clear();

      setGoal(null);
      setUserName(null);
      setSelectedProtocol(null);
      setSessionHistory([]);
      setLastCompletedSession(null);
      
      setAppState(AppState.HealthCheck);
      setIsResetting(false); // Reset the trigger
    }
  }, [isResetting]);

  const handleHealthCheckComplete = () => {
    localStorage.setItem('saunaflow_health_check_accepted', 'true');
    const storedGoal = localStorage.getItem('saunaflow_goal');
    const storedName = localStorage.getItem('saunaflow_username');
    if (storedGoal && storedName) {
      setAppState(AppState.Dashboard);
    } else {
      setAppState(AppState.Onboarding);
    }
  };

  const handleOnboardingComplete = (name: string, selectedGoal: Goal) => {
    setUserName(name);
    setGoal(selectedGoal);
    localStorage.setItem('saunaflow_username', name);
    localStorage.setItem('saunaflow_goal', selectedGoal);
    setAppState(AppState.Dashboard);
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

  const handleSessionComplete = useCallback((sessionLog: SessionLog) => {
    const newHistory = [...sessionHistory, sessionLog];
    setSessionHistory(newHistory);
    localStorage.setItem('saunaflow_history', JSON.stringify(newHistory));
    setLastCompletedSession(sessionLog);
    setAppState(AppState.Summary);
  }, [sessionHistory]);

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

  const handleChangeGoal = () => {
    localStorage.removeItem('saunaflow_goal');
    localStorage.removeItem('saunaflow_username');
    setGoal(null);
    setUserName(null);
    setAppState(AppState.Onboarding);
  };

  const handleResetApp = () => {
    // Trigger the reset effect.
    setIsResetting(true);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.HealthCheck:
        return <HealthCheckScreen onComplete={handleHealthCheckComplete} />;
      case AppState.Onboarding:
        return <OnboardingScreen onOnboardingComplete={handleOnboardingComplete} />;
      case AppState.Dashboard:
        return <DashboardScreen 
                  userName={userName}
                  goal={goal} 
                  sessionHistory={sessionHistory}
                  onStartRitual={handleStartRitual}
                  onChangeGoal={handleChangeGoal}
                  onResetApp={handleResetApp}
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
        if (!selectedProtocol) {
          return null; // Handled by useEffect
        }
        return <SessionSettingsScreen 
                  protocol={selectedProtocol}
                  onStart={handleProceedToWellbeing}
                  onBack={handleBackToProtocolSelection}
                />;
      case AppState.WellbeingCheck:
        if (!selectedProtocol) {
            return null;
        }
        return <WellbeingCheckScreen
                    protocol={selectedProtocol}
                    onComplete={handleStartSession}
                    onBack={handleBackToSessionSettings}
                />;
      case AppState.InSession:
        if (!selectedProtocol) {
          return null; // Handled by useEffect
        }
        return <SessionScreen 
                  protocol={selectedProtocol} 
                  onSessionComplete={handleSessionComplete} 
                  onExit={handleExitSession}
                />;
      case AppState.Summary:
        if (!lastCompletedSession) {
          return null; // Handled by useEffect
        }
        return <SummaryScreen 
                  sessionLog={lastCompletedSession} 
                  onDone={handleBackToDashboard} 
                />;
      case AppState.Loading:
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