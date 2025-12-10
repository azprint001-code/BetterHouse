import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Wallet, 
  FileText, 
  Wrench, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  MessageSquare,
  Archive,
  HardHat
} from 'lucide-react';
import { User, UserRole, NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Ma Copropriété', icon: Building2, path: '/property', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Comptabilité', icon: Wallet, path: '/accounting', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Assemblées (AG)', icon: Users, path: '/ag', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Incidents & Travaux', icon: Wrench, path: '/maintenance', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Prestataires', icon: HardHat, path: '/providers', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Documents', icon: Archive, path: '/documents', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Communication', icon: MessageSquare, path: '/communication', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Agenda', icon: CalendarDays, path: '/agenda', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
  { label: 'Paramètres', icon: Settings, path: '/settings', roles: [UserRole.SYNDIC, UserRole.COPROPRIETAIRE] },
];

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-20 sticky top-0 shadow-md">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <Building2 size={24} className="text-emerald-500" />
          BetterHouse
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out shadow-xl
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-2">
           <Building2 size={28} className="text-emerald-500" />
           <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none">BetterHouse<span className="text-emerald-500">.</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">SaaS Maroc v1.0</p>
           </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg mb-6 border border-slate-700/50 backdrop-blur-sm">
            <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-slate-600" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-emerald-400 font-semibold">{user.role === UserRole.SYNDIC ? 'Syndic Manager' : 'Copropriétaire'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                      : 'hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 w-full rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {filteredNav.find(n => n.path === location.pathname)?.label || 'BetterHouse'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate('/communication')}
                className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-gray-100"
              >
              <MessageSquare size={20} />
            </button>
            <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-20">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};