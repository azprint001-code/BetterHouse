
import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Download, CheckCircle, Clock, 
  FileText, Plus, Edit3, Trash2, Mic, UserCheck, Shield, ChevronRight, AlertTriangle
} from 'lucide-react';
import { AG_EVENTS, USERS } from '../services/mockData';
import { User, UserRole, AGStatus, AGType, VoteStatus, PresenceStatus, AGEvent, Resolution } from '../types';

interface AGProps {
  user: User;
}

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: AGStatus }) => {
  const styles = {
    [AGStatus.DRAFT]: 'bg-gray-100 text-gray-600',
    [AGStatus.PLANNED]: 'bg-blue-50 text-blue-600 border-blue-100',
    [AGStatus.CONVENED]: 'bg-purple-50 text-purple-600 border-purple-100',
    [AGStatus.ONGOING]: 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse',
    [AGStatus.COMPLETED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [AGStatus.CLOSED]: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status]}`}>
      {status}
    </span>
  );
};

const VoteBadge = ({ status }: { status: VoteStatus }) => {
  const styles = {
    [VoteStatus.PENDING]: 'bg-gray-100 text-gray-500',
    [VoteStatus.ADOPTED]: 'bg-emerald-100 text-emerald-700',
    [VoteStatus.REJECTED]: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>{status}</span>;
};

// ==================================================================================
// 🔥 SYNDIC VIEW (ADMINISTRATION)
// ==================================================================================

const SyndicAGView: React.FC = () => {
  const [selectedAG, setSelectedAG] = useState<AGEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'agenda' | 'presence' | 'session' | 'pv'>('info');

  // If no AG selected, show list
  if (!selectedAG) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Assemblées</h2>
            <p className="text-gray-500 text-sm">Planification, convocations et tenue des AG.</p>
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2">
            <Plus size={16} /> Créer une AG
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {AG_EVENTS.map((ag) => (
                <tr 
                  key={ag.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedAG(ag)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {new Date(ag.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{ag.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ag.type}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ag.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center justify-end gap-1">
                      Gérer <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // AG MANAGEMENT INTERFACE
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setSelectedAG(null)} 
          className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition"
        >
          <ChevronRight size={20} className="transform rotate-180" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">{selectedAG.title}</h2>
            <StatusBadge status={selectedAG.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-4">
            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(selectedAG.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock size={14}/> {new Date(selectedAG.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span className="flex items-center gap-1"><MapPin size={14}/> {selectedAG.location}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6">
          {[
            { id: 'info', label: 'Planification', icon: Edit3 },
            { id: 'agenda', label: 'Ordre du Jour', icon: FileText },
            { id: 'presence', label: 'Convocations & Présence', icon: Users },
            { id: 'session', label: 'Séance & Votes', icon: Mic },
            { id: 'pv', label: 'PV & Clôture', icon: CheckCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                pb-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* TABS CONTENT */}
      
      {/* 1. PLANIFICATION */}
      {activeTab === 'info' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input type="date" defaultValue={selectedAG.date.split('T')[0]} className="w-full border p-2 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heure</label>
                <input type="time" defaultValue={selectedAG.date.split('T')[1].substring(0,5)} className="w-full border p-2 rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lieu</label>
              <input type="text" defaultValue={selectedAG.location} className="w-full border p-2 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea defaultValue={selectedAG.description} rows={3} className="w-full border p-2 rounded-lg text-sm"></textarea>
            </div>
            <div className="pt-4 flex justify-end">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">Enregistrer les modifications</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AGENDA */}
      {activeTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="flex gap-3">
               <div className="mt-1 text-blue-500"><AlertTriangle size={20} /></div>
               <div className="text-sm text-blue-800">
                 <p className="font-bold">Mode Édition</p>
                 <p>Vous pouvez modifier les résolutions tant que l'AG n'est pas convoquée.</p>
               </div>
             </div>
             <button className="bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-50">
               + Ajouter une résolution
             </button>
          </div>

          <div className="space-y-3">
            {selectedAG.resolutions.map((res, idx) => (
              <div key={res.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                <div className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full font-bold text-gray-600 text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{res.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{res.description}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">Type: {res.type}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit3 size={16}/></button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PRESENCE */}
      {activeTab === 'presence' && (
        <div className="space-y-6">
           {/* Actions Bar */}
           <div className="flex justify-between items-center">
              <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                   <Download size={16}/> Générer Convocations
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm">
                   <Users size={16}/> Envoyer Convocations
                 </button>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm">
                 <span className="text-gray-500">Quorum actuel :</span>
                 <span className="ml-2 font-bold text-emerald-600">350 / 1000</span>
              </div>
           </div>

           {/* Attendance Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Copropriétaire</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tantièmes</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Présence</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mandataire</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {selectedAG.participants.map(part => {
                   const user = USERS.find(u => u.id === part.userId);
                   return (
                     <tr key={part.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">{user?.name}</td>
                       <td className="px-6 py-4 text-sm font-mono">{part.totalTantiemes}</td>
                       <td className="px-6 py-4">
                         <select 
                           defaultValue={part.status}
                           className={`text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer
                             ${part.status === PresenceStatus.PRESENT ? 'text-emerald-600' : ''}
                             ${part.status === PresenceStatus.ABSENT ? 'text-red-500' : ''}
                             ${part.status === PresenceStatus.REPRESENTED ? 'text-blue-600' : ''}
                           `}
                         >
                           <option value={PresenceStatus.PRESENT}>Présent</option>
                           <option value={PresenceStatus.ABSENT}>Absent</option>
                           <option value={PresenceStatus.REPRESENTED}>Représenté</option>
                         </select>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-500">
                         {part.status === PresenceStatus.REPRESENTED ? (
                           <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                             <Shield size={10} /> {part.proxyName || 'Non défini'}
                           </span>
                         ) : '-'}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-gray-400 hover:text-emerald-600 text-sm">Détail</button>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* 4. VOTING SESSION */}
      {activeTab === 'session' && (
        <div className="space-y-6">
           <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-800">Session de vote en cours</h3>
                  <p className="text-sm text-amber-700">Saisissez les résultats des votes pour chaque résolution.</p>
                </div>
                <div className="text-amber-800 text-sm font-mono font-bold bg-white/50 px-3 py-1 rounded">
                   AG {selectedAG.status === AGStatus.ONGOING ? 'OUVERTE' : 'NON DÉMARRÉE'}
                </div>
              </div>
           </div>

           {selectedAG.resolutions.map((res, idx) => (
             <div key={res.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                   <h4 className="font-bold text-gray-800">Résolution #{idx + 1} : {res.title}</h4>
                   <VoteBadge status={res.status} />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-emerald-600 uppercase mb-1 block">Pour</label>
                        <div className="flex gap-2">
                          <input type="number" placeholder="Voix" className="w-1/2 border p-2 rounded text-sm" defaultValue={res.votesFor} />
                          <input type="number" placeholder="Tantièmes" className="w-1/2 border p-2 rounded text-sm font-mono bg-gray-50" defaultValue={res.tantiemesFor} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-red-600 uppercase mb-1 block">Contre</label>
                         <div className="flex gap-2">
                          <input type="number" placeholder="Voix" className="w-1/2 border p-2 rounded text-sm" defaultValue={res.votesAgainst} />
                          <input type="number" placeholder="Tantièmes" className="w-1/2 border p-2 rounded text-sm font-mono bg-gray-50" defaultValue={res.tantiemesAgainst} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Abstention</label>
                         <div className="flex gap-2">
                          <input type="number" placeholder="Voix" className="w-1/2 border p-2 rounded text-sm" defaultValue={res.votesAbstain} />
                          <input type="number" placeholder="Tantièmes" className="w-1/2 border p-2 rounded text-sm font-mono bg-gray-50" defaultValue={res.tantiemesAbstain} />
                        </div>
                      </div>
                   </div>
                   <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                      <p className="text-gray-500 text-sm mb-2">Règle de majorité : <span className="font-bold">{res.type}</span></p>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex max-w-xs mb-2">
                         <div className="bg-emerald-500 h-full" style={{ width: '70%' }}></div>
                         <div className="bg-red-500 h-full" style={{ width: '10%' }}></div>
                         <div className="bg-gray-400 h-full" style={{ width: '20%' }}></div>
                      </div>
                      <p className="text-emerald-600 font-bold">Résolution Adoptée à 70%</p>
                      <button className="mt-4 text-sm border border-gray-300 bg-white px-3 py-1 rounded hover:bg-gray-50">Recalculer</button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* 5. PV */}
      {activeTab === 'pv' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4">Génération du Procès-Verbal</h3>
               <p className="text-sm text-gray-600 mb-6">
                 Le PV est généré automatiquement à partir des résultats des votes. Une fois clôturé, il sera visible par tous les copropriétaires.
               </p>
               <button className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 mb-3 flex justify-center items-center gap-2">
                 <FileText size={18} /> Prévisualiser le PV
               </button>
               <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 flex justify-center items-center gap-2">
                 <CheckCircle size={18} /> Clôturer l'AG et Publier
               </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                 <Download size={24} className="text-gray-400"/>
               </div>
               <p className="font-medium text-gray-700">Documents signés</p>
               <p className="text-xs text-gray-500 mt-1">Glissez ici le PV signé scanné pour archivage</p>
            </div>
         </div>
      )}
    </div>
  );
};


// ==================================================================================
// 🔒 COPROPRIETAIRE VIEW (READ ONLY / LIMITED)
// ==================================================================================

const CoproprietaireAGView: React.FC<{ user: User }> = ({ user }) => {
  const [selectedAG, setSelectedAG] = useState<AGEvent | null>(null);

  // 1. LIST VIEW
  if (!selectedAG) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Mes Assemblées Générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AG_EVENTS.map((ag) => {
             const isUpcoming = new Date(ag.date) > new Date();
             return (
              <div key={ag.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className={`h-2 w-full ${isUpcoming ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                      <div className="bg-gray-100 px-3 py-1 rounded text-xs font-bold uppercase text-gray-600">
                        {new Date(ag.date).getFullYear()}
                      </div>
                      <StatusBadge status={ag.status} />
                   </div>
                   <h3 className="text-lg font-bold text-gray-800 mb-2">{ag.title}</h3>
                   <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(ag.date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long'})} à {new Date(ag.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {ag.location}
                      </p>
                   </div>
                   <div className="mt-auto pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => setSelectedAG(ag)}
                        className="w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                      >
                        Voir le détail
                      </button>
                   </div>
                </div>
              </div>
             );
          })}
        </div>
      </div>
    );
  }

  // 2. DETAIL VIEW
  const myParticipantRecord = selectedAG.participants.find(p => p.userId === user.id);
  const isClosed = selectedAG.status === AGStatus.CLOSED;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => setSelectedAG(null)}
        className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm font-medium mb-2"
      >
        <ChevronRight size={16} className="transform rotate-180" /> Retour à la liste
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedAG.title}</h2>
              <StatusBadge status={selectedAG.status} />
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl">{selectedAG.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Date & Heure</span>
                <span className="font-medium text-gray-800 flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-500"/>
                  {new Date(selectedAG.date).toLocaleString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Lieu</span>
                <span className="font-medium text-gray-800 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-500"/>
                  {selectedAG.location}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Type</span>
                <span className="font-medium text-gray-800">{selectedAG.type}</span>
              </div>
            </div>
         </div>
      </div>

      {/* Participation Section (Only if not closed) */}
      {!isClosed && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
             <h3 className="font-bold text-blue-900 mb-1">Ma Participation</h3>
             <p className="text-sm text-blue-700">
               Statut actuel : <span className="font-bold uppercase">{myParticipantRecord?.status || 'Non déclaré'}</span>
             </p>
           </div>
           <div className="flex gap-3">
             <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-100 border border-blue-200">
               Je serai présent
             </button>
             <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-800">
               Donner pouvoir
             </button>
           </div>
        </div>
      )}

      {/* PV Download (Only if Closed) */}
      {isClosed && selectedAG.minutesUrl && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
               <FileText size={24} />
             </div>
             <div>
               <h3 className="font-bold text-emerald-900">Procès-Verbal Disponible</h3>
               <p className="text-sm text-emerald-700">Le compte rendu officiel de l'assemblée a été publié.</p>
             </div>
           </div>
           <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-emerald-700 flex items-center gap-2">
             <Download size={18} /> Télécharger le PV
           </button>
        </div>
      )}

      {/* Agenda & Resolutions (Read Only) */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 text-lg">Ordre du jour & Résolutions</h3>
        {selectedAG.resolutions.map((res, idx) => (
          <div key={res.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex gap-4">
             <div className="mt-1">
               <span className="bg-gray-100 text-gray-600 font-bold w-6 h-6 flex items-center justify-center rounded text-xs">
                 {idx + 1}
               </span>
             </div>
             <div className="flex-1">
               <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800">{res.title}</h4>
                  {isClosed && <VoteBadge status={res.status} />}
               </div>
               <p className="text-sm text-gray-600 mt-1">{res.description}</p>
               
               {/* Show simplified result if closed */}
               {isClosed && (
                 <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-medium">Résultat du vote :</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Adoptée</span>
                    {/* Note: We do NOT show raw vote counts to owners here to keep interface simple/private */}
                 </div>
               )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ==================================================================================
// MAIN COMPONENT (ROUTER)
// ==================================================================================

export const AGView: React.FC<AGProps> = ({ user }) => {
  if (user.role === UserRole.SYNDIC) {
    return <SyndicAGView />;
  }
  return <CoproprietaireAGView user={user} />;
};
