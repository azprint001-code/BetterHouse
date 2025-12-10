
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Accounting } from './pages/Accounting';
import { PropertyView } from './pages/Property';
import { AGView } from './pages/AG';
import { MaintenanceView } from './pages/Maintenance';
import { ProvidersView } from './pages/Providers';
import { DocumentsView } from './pages/Documents';
import { CommunicationView } from './pages/Communication';
import { CalendarView } from './pages/Calendar';
import { SettingsView } from './pages/Settings';
import { USERS } from './services/mockData';
import { User, UserRole } from './types';
import { Building2 } from 'lucide-react';

const LoginScreen: React.FC<{ onLogin: (userId: string) => void }> = ({ onLogin }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
      <div className="text-center mb-8 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 text-emerald-600">
           <Building2 size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">BetterHouse<span className="text-emerald-500">.</span></h1>
        <p className="text-gray-500 mt-2 text-sm">Gestion de Copropriété SaaS Maroc</p>
      </div>
      
      <div className="space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sélectionnez un profil Démo</p>
        {USERS.filter(u => u.role === UserRole.SYNDIC).map(user => (
          <button
            key={user.id}
            onClick={() => onLogin(user.id)}
            className="w-full flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
            <div className="text-left">
              <h3 className="font-bold text-gray-800 group-hover:text-emerald-700">{user.name}</h3>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide bg-emerald-100 inline-block px-2 py-0.5 rounded mt-1">Syndic</p>
            </div>
          </button>
        ))}
        {USERS.filter(u => u.role === UserRole.COPROPRIETAIRE).slice(0, 1).map(user => (
           <button
            key={user.id}
            onClick={() => onLogin(user.id)}
            className="w-full flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all group"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
            <div className="text-left">
              <h3 className="font-bold text-gray-800 group-hover:text-blue-700">{user.name}</h3>
               <p className="text-xs text-blue-600 font-bold uppercase tracking-wide bg-blue-100 inline-block px-2 py-0.5 rounded mt-1">Copropriétaire</p>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 border-t border-gray-100 pt-6 text-center">
        <p className="text-xs text-gray-400">
          Version 1.0.4 • © 2023 BetterHouse Maroc
        </p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (userId: string) => {
    const user = USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={currentUser} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={currentUser} />} />
          <Route path="/accounting" element={<Accounting user={currentUser} />} />
          <Route path="/property" element={<PropertyView user={currentUser} />} />
          <Route path="/ag" element={<AGView user={currentUser} />} />
          <Route path="/maintenance" element={<MaintenanceView user={currentUser} />} />
          <Route path="/providers" element={<ProvidersView user={currentUser} />} />
          <Route path="/documents" element={<DocumentsView user={currentUser} />} />
          <Route path="/communication" element={<CommunicationView user={currentUser} />} />
          <Route path="/agenda" element={<CalendarView user={currentUser} />} />
          <Route path="/settings" element={<SettingsView user={currentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
