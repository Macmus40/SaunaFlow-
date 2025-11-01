
import React, { useState } from 'react';
import { UserManagement } from './UserManagement';
import { ContentManagement } from './ContentManagement';
import { SubscriptionManagement } from './SubscriptionManagement';
import { UsersIcon, PhotoIcon, CreditCardIcon } from '../icons/Icons';

interface AdminPanelProps {
  onExit: () => void;
}

type AdminView = 'users' | 'content' | 'subscriptions';

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
      isActive
        ? 'bg-amber-500/10 text-amber-300'
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`}
  >
    <div className="w-6 h-6">{icon}</div>
    <span className="font-semibold">{label}</span>
  </button>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const [currentView, setCurrentView] = useState<AdminView>('users');

  const renderView = () => {
    switch (currentView) {
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentManagement />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-800/50 p-4 border-b md:border-b-0 md:border-r border-slate-700 flex-shrink-0">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-center">SaunaFlow</h1>
            <h2 className="text-sm text-amber-400 text-center tracking-widest">ADMIN</h2>
        </div>
        <nav className="flex flex-row md:flex-col items-center space-x-2 md:space-x-0 md:space-y-2">
            <NavItem label="Clients" icon={<UsersIcon />} isActive={currentView === 'users'} onClick={() => setCurrentView('users')} />
            <NavItem label="Content" icon={<PhotoIcon />} isActive={currentView === 'content'} onClick={() => setCurrentView('content')} />
            <NavItem label="Subscriptions" icon={<CreditCardIcon />} isActive={currentView === 'subscriptions'} onClick={() => setCurrentView('subscriptions')} />
        </nav>
        <div className="mt-auto pt-8">
             <button onClick={onExit} className="w-full text-center text-slate-500 hover:text-slate-300 text-sm transition-colors py-2">
                &larr; Exit Admin Panel
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};
