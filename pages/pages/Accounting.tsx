import React, { useState } from 'react';
import { Download, Filter, Plus, Search, FileText, PieChart as PieIcon, CreditCard, Receipt } from 'lucide-react';
import { FINANCE_RECORDS, BUDGET_LINES } from '../services/mockData';
import { PaymentStatus, User, UserRole, FinancialRecord } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AccountingProps {
  user: User;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Accounting: React.FC<AccountingProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'budget' | 'appels'>('journal');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // --- FILTERS ---
  const filteredRecords = FINANCE_RECORDS.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true : record.type === filter;
    
    // Permission: Owners only see global data or their own payments
    if (user.role === UserRole.COPROPRIETAIRE) {
       // Logic: Owner sees all DEBITS (Expenses) but only their own CREDITS (Payments)
       if (record.type === 'CREDIT' && !record.description.includes('Lot A1')) return false; 
    }
    return matchesSearch && matchesFilter;
  });

  const budgetChartData = BUDGET_LINES.map(b => ({
    name: b.category,
    Prévu: b.estimatedAmount,
    Réel: b.spentAmount
  }));

  const budgetPieData = BUDGET_LINES.map(b => ({
    name: b.category,
    value: b.estimatedAmount
  }));

  // --- TABS CONTENT ---
  
  const JournalView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une opération..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tout voir</option>
            <option value="CREDIT">Recettes</option>
            <option value="DEBIT">Dépenses</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Libellé</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Montant</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{record.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {record.description}
                  {record.userReference && <div className="text-xs text-gray-400 font-normal">{record.userReference}</div>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{record.category}</span>
                </td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${record.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {record.type === 'CREDIT' ? '+' : '-'}{record.amount.toLocaleString()} MAD
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${record.status === PaymentStatus.PAID ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${record.status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-800' : ''}
                    ${record.status === PaymentStatus.LATE ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredRecords.length === 0 && (
        <div className="p-12 text-center text-gray-400 flex flex-col items-center">
          <Receipt size={48} className="mb-4 opacity-20" />
          <p>Aucune écriture comptable trouvée.</p>
        </div>
      )}
    </div>
  );

  const BudgetView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Suivi Budgétaire 2023</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="Prévu" fill="#e2e8f0" barSize={20} radius={[0, 4, 4, 0]} />
                <Bar dataKey="Réel" fill="#10b981" barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Répartition</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budgetPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {budgetPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 max-h-48 overflow-y-auto">
             {BUDGET_LINES.map((line, idx) => (
               <div key={line.id} className="flex justify-between items-center text-xs">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                    <span className="text-gray-600">{line.category}</span>
                 </div>
                 <span className="font-medium">{line.estimatedAmount.toLocaleString()} MAD</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CallsView = () => (
    <div className="space-y-6">
      {user.role === UserRole.SYNDIC && (
         <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-emerald-800">Générer un Appel de Fonds</h3>
              <p className="text-sm text-emerald-600 mt-1">Créez automatiquement les appels pour le trimestre à venir (T1 2024).</p>
            </div>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 shadow-sm transition">
              Générer T1 2024
            </button>
         </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Historique des Appels</h3>
        </div>
        <div className="divide-y divide-gray-100">
           {FINANCE_RECORDS.filter(r => r.category === 'Appel de fonds').map(record => (
             <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.description}</p>
                    <p className="text-xs text-gray-500">Échéance : {record.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{record.amount.toLocaleString()} MAD</p>
                  <button className="text-xs text-emerald-600 hover:underline mt-1">Télécharger Avis</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Comptabilité</h2>
          <p className="text-gray-500 text-sm">Gestion financière, budget et appels de fonds.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
            <Download size={16} />
            Exporter
          </button>
          {user.role === UserRole.SYNDIC && (
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm">
              <Plus size={16} />
              Saisir
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full max-w-md">
        <button 
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${activeTab === 'journal' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Grand Livre
        </button>
        <button 
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${activeTab === 'budget' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Budget
        </button>
        <button 
          onClick={() => setActiveTab('appels')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${activeTab === 'appels' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Appels de fonds
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'journal' && <JournalView />}
        {activeTab === 'budget' && <BudgetView />}
        {activeTab === 'appels' && <CallsView />}
      </div>
    </div>
  );
};