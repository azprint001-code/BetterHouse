
import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Clock, Wallet, CheckCircle, 
  FileText, ArrowRight, Activity, Building2, MapPin, MoreVertical, 
  Users, DollarSign, Calendar, Wrench, ChevronRight, ShieldAlert, Zap
} from 'lucide-react';
import { User, UserRole, TicketStatus, PaymentStatus } from '../types';
import { 
  FINANCE_RECORDS, TICKETS, AG_EVENTS, DOCUMENTS, INTERVENTIONS, 
  getFinancialSummary, getUserBalance 
} from '../services/mockData';

interface DashboardProps {
  user: User;
}

const COLORS = {
  emerald: '#10b981',
  blue: '#3b82f6',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  slate: '#64748b'
};

// --- ANIMATION HOOK ---
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(end * ease));

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// --- SHARED COMPONENTS ---

const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
  const count = useCountUp(value);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ==================================================================================
// 🔥 SYNDIC DASHBOARD (ADMIN VIEW)
// ==================================================================================

const SyndicDashboard: React.FC = () => {
  const summary = getFinancialSummary();
  const recoveryRate = Math.round((summary.totalIncome / (summary.totalIncome + summary.totalPending)) * 100) || 0;

  // Chart Data Prep
  const chartData = [
    { name: 'Jan', Entrées: 40000, Sorties: 24000 },
    { name: 'Fév', Entrées: 30000, Sorties: 13980 },
    { name: 'Mar', Entrées: 20000, Sorties: 58000 },
    { name: 'Avr', Entrées: 27800, Sorties: 39080 },
    { name: 'Mai', Entrées: 18900, Sorties: 48000 },
    { name: 'Juin', Entrées: 23900, Sorties: 38000 },
  ];

  const pieData = [
    { name: 'Payé', value: FINANCE_RECORDS.filter(f => f.status === PaymentStatus.PAID).length },
    { name: 'En attente', value: FINANCE_RECORDS.filter(f => f.status === PaymentStatus.PENDING).length },
    { name: 'En retard', value: FINANCE_RECORDS.filter(f => f.status === PaymentStatus.LATE).length },
  ];

  const unpaidUsers = [
    { name: 'Mme. Sarah Bennani', amount: 3800, days: 15, lot: 'A2' },
    { name: 'Société Tech Maroc', amount: 6200, days: 45, lot: 'B1' },
    { name: 'M. Karim Alami', amount: 1200, days: 5, lot: 'A1' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. TOP BAR: KPIS ANIMÉS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Trésorerie', value: summary.balance, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: '+12% vs N-1' },
          { title: 'Impayés', value: summary.totalPending, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', sub: '3 dossiers critiques' },
          { title: 'Dépenses (YTD)', value: summary.totalExpense, icon: TrendingDown, color: 'text-blue-600', bg: 'bg-blue-50', sub: '45% du budget' },
          { title: 'Recouvrement', value: recoveryRate, suffix: '%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Objectif: 90%' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group cursor-default"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
                  <AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
                  {kpi.title !== 'Recouvrement' && !kpi.suffix && <span className="text-sm text-gray-400 font-normal ml-1">MAD</span>}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} group-hover:rotate-12 transition-transform duration-300`}>
                <kpi.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${kpi.title === 'Impayés' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. GRAPHIQUES INTERACTIFS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Flux Financiers</h3>
            <select className="text-sm border-gray-200 rounded-lg px-2 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Cette année</option>
              <option>L'année dernière</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="Entrées" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="Sorties" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats / Unpaid Watchlist */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-500"/> Surveillance Impayés
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            {unpaidUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${u.days > 30 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    {u.lot}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.days} jours de retard</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{u.amount} MAD</p>
                  <span className="text-[10px] text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Relancer</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
            Voir tous les débiteurs
          </button>
        </div>
      </div>

      {/* 3. ACTIONS RAPIDES & ACTIVITÉ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actions Grid */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          {[
            { label: 'Appel de fonds', icon: FileText, color: 'bg-emerald-500' },
            { label: 'Saisir Paiement', icon: DollarSign, color: 'bg-blue-500' },
            { label: 'Nouvel Incident', icon: Wrench, color: 'bg-amber-500' },
            { label: 'Planifier AG', icon: Calendar, color: 'bg-purple-500' },
          ].map((action, i) => (
            <button key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 h-32">
              <div className={`p-3 rounded-full ${action.color} text-white shadow-md`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-bold text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Timeline Activité */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Fil d'actualité</h3>
              <button className="text-sm text-emerald-600 font-medium hover:underline">Tout voir</button>
           </div>
           <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {[
                { type: 'payment', title: 'Paiement reçu - 4,500 MAD', desc: 'M. Karim Alami (Lot A1)', time: 'Il y a 2h', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100' },
                { type: 'ticket', title: 'Nouvel incident: Fuite d\'eau', desc: 'Signalé par Mme Bennani (Parking)', time: 'Il y a 5h', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100' },
                { type: 'doc', title: 'Contrat Assurance Ajouté', desc: 'AXA Assurance Multirisque 2024', time: 'Hier', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
                { type: 'ag', title: 'Convocation AG envoyée', desc: 'AG Ordinaire du 15 Mars', time: 'Hier', icon: Users, color: 'text-purple-500', bg: 'bg-purple-100' },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                   <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <item.icon size={16} className={item.color} />
                   </div>
                   <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white hover:border-emerald-200">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                         <div className="font-bold text-gray-800 text-sm">{item.title}</div>
                         <time className="font-mono text-xs text-gray-400">{item.time}</time>
                      </div>
                      <div className="text-gray-500 text-xs">{item.desc}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};


// ==================================================================================
// 🔒 COPROPRIETAIRE DASHBOARD (PERSONAL VIEW)
// ==================================================================================

const CoproDashboard: React.FC<{ user: User }> = ({ user }) => {
  const balance = getUserBalance(user.id);
  const nextAG = AG_EVENTS.find(ag => new Date(ag.date) > new Date());
  
  // Logic for Balance Card Color
  const balanceColor = balance === 0 
    ? { bg: 'from-emerald-500 to-teal-600', icon: CheckCircle, status: 'Tout est à jour', iconColor: 'text-emerald-100' }
    : balance < 2000 
      ? { bg: 'from-amber-500 to-orange-600', icon: Clock, status: 'Paiement attendu', iconColor: 'text-amber-100' }
      : { bg: 'from-red-500 to-rose-600', icon: AlertTriangle, status: 'Retard important', iconColor: 'text-red-100' };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      
      {/* 1. HERO CARD (PERSONAL SITUATION) */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${balanceColor.bg} p-8 text-white shadow-xl transform transition-all hover:scale-[1.01]`}>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2 opacity-90">
                  <Building2 size={18} />
                  <span className="text-sm font-medium tracking-wide">Ma Situation Financière</span>
               </div>
               <h1 className="text-5xl font-bold tracking-tight mb-2">
                 <AnimatedNumber value={balance} suffix=" MAD" />
               </h1>
               <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                  <balanceColor.icon size={16} className="text-white" />
                  <span className="text-sm font-medium">{balanceColor.status}</span>
               </div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 min-w-[280px]">
               <h3 className="text-sm font-medium opacity-80 mb-4 uppercase tracking-wider">Prochaine Échéance</h3>
               <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">Appel T1 2024</span>
                  <span className="font-mono opacity-80">01 Jan</span>
               </div>
               <div className="w-full bg-black/20 rounded-full h-2 mb-4">
                  <div className="bg-white h-2 rounded-full w-[75%]"></div>
               </div>
               <button className="w-full py-2 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition shadow-lg">
                  Payer maintenant
               </button>
            </div>
         </div>
         
         {/* Background Decoration */}
         <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute -left-10 -top-20 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
      </div>

      {/* 2. SHORTCUTS & ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Déclarer un incident', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
           { label: 'Mes Documents', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
           { label: 'Contacter le Syndic', icon: MoreVertical, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
           { label: 'Prochaine AG', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
         ].map((action, i) => (
           <button 
             key={i}
             className={`p-4 rounded-xl border ${action.border} bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-3 group`}
           >
              <div className={`p-3 rounded-full ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                 <action.icon size={20} />
              </div>
              <span className="font-bold text-gray-700 text-sm text-left leading-tight group-hover:text-gray-900">{action.label}</span>
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* 3. ACTIVITY FEED */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
               <Activity size={20} className="text-emerald-500" /> Activité Récente
            </h3>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               {/* Mock Activity for Copro */}
               {[
                 { title: 'Paiement confirmé', date: '25 Nov', desc: 'Virement de 3,500 MAD reçu', icon: CheckCircle, color: 'text-emerald-500' },
                 { title: 'Nouveau Document', date: '20 Nov', desc: 'PV Assemblée Générale 2023', icon: FileText, color: 'text-blue-500' },
                 { title: 'Incident résolu', date: '15 Nov', desc: 'Réparation fuite d\'eau Hall B', icon: Wrench, color: 'text-gray-500' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-default">
                    <div className={`p-3 rounded-full bg-gray-50 ${item.color}`}>
                       <item.icon size={18} />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                       <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.date}</span>
                 </div>
               ))}
               <button className="w-full py-3 text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors border-t border-gray-100">
                  Voir tout l'historique
               </button>
            </div>
         </div>

         {/* 4. NOTIFICATIONS / NEXT AG */}
         <div className="space-y-6">
            <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
               <Zap size={20} className="text-amber-500" /> À ne pas manquer
            </h3>

            {nextAG ? (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-bl-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">Prochaine Assemblée</span>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">{nextAG.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                     <Calendar size={14} /> {new Date(nextAG.date).toLocaleDateString()}
                     <MapPin size={14} className="ml-2" /> {nextAG.location}
                  </div>
                  
                  <button className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-sm hover:bg-blue-100 transition-colors">
                     Confirmer ma présence
                  </button>
               </div>
            ) : (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center py-10">
                  <p className="text-gray-400 text-sm">Aucune AG planifiée pour le moment.</p>
               </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-800 mb-4 text-sm">Contacts Utiles</h4>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <Users size={14} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-700">Syndic (Urgence)</p>
                        <p className="text-[10px] text-gray-400">05 22 00 00 00</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <ShieldAlert size={14} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-700">Gardiennage</p>
                        <p className="text-[10px] text-gray-400">06 61 00 00 00</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// ==================================================================================
// MAIN COMPONENT
// ==================================================================================

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return user.role === UserRole.SYNDIC 
    ? <SyndicDashboard /> 
    : <CoproDashboard user={user} />;
};
