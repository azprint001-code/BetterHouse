import React, { useState } from 'react';
import { 
  AlertCircle, Wrench, HardHat, Plus, CheckCircle, Clock, 
  ChevronRight, Filter, Search, Camera, FileText, Calendar, DollarSign, User as UserIcon
} from 'lucide-react';
import { TICKETS, INTERVENTIONS, PROVIDERS, USERS } from '../services/mockData';
import { User, UserRole, TicketStatus, TicketPriority, InterventionStatus, Ticket } from '../types';

interface MaintenanceProps {
  user: User;
}

const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const styles = {
    [TicketPriority.LOW]: 'bg-gray-100 text-gray-600',
    [TicketPriority.MEDIUM]: 'bg-blue-100 text-blue-600',
    [TicketPriority.HIGH]: 'bg-amber-100 text-amber-600',
    [TicketPriority.URGENT]: 'bg-red-100 text-red-600 font-bold animate-pulse',
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${styles[priority]}`}>{priority}</span>;
};

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles = {
    [TicketStatus.OPEN]: 'bg-gray-100 text-gray-700',
    [TicketStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-700 border border-blue-100',
    [TicketStatus.WAITING_PROVIDER]: 'bg-amber-50 text-amber-700 border border-amber-100',
    [TicketStatus.RESOLVED]: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    [TicketStatus.CLOSED]: 'bg-slate-100 text-slate-500',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

// ==================================================================================
// 🔥 SYNDIC VIEW (FULL ADMINISTRATION)
// ==================================================================================

const SyndicMaintenanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'interventions'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // --- TICKET DETAIL MODAL / VIEW ---
  if (selectedTicket) {
    const relatedInterventions = INTERVENTIONS.filter(i => i.ticketId === selectedTicket.id);
    
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm font-medium">
          <ChevronRight size={16} className="rotate-180"/> Retour à la liste
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                   <h2 className="text-2xl font-bold text-gray-800">{selectedTicket.title}</h2>
                   <PriorityBadge priority={selectedTicket.priority} />
                 </div>
                 <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={14}/> {selectedTicket.dateCreated}</span>
                    <span className="flex items-center gap-1"><UserIcon size={14} className="w-4 h-4"/> Déclaré par {selectedTicket.authorName}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedTicket.category}</span>
                 </div>
              </div>
              <StatusBadge status={selectedTicket.status} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <div>
                   <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                   <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                     {selectedTicket.description}
                   </p>
                 </div>

                 {/* INTERVENTIONS MANAGEMENT */}
                 <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">Interventions & Travaux</h3>
                      <button className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700">
                        + Planifier
                      </button>
                    </div>
                    {relatedInterventions.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">Aucune intervention planifiée.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {relatedInterventions.map(inter => (
                          <div key={inter.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                             <div className="flex justify-between mb-2">
                               <span className="font-bold text-sm text-gray-800">Intervention #{inter.id}</span>
                               <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{inter.status}</span>
                             </div>
                             <p className="text-sm text-gray-600 mb-3">{inter.description}</p>
                             <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                                <span className="flex items-center gap-1">
                                  <HardHat size={12}/> {PROVIDERS.find(p => p.id === inter.providerId)?.name}
                                </span>
                                <span className="flex items-center gap-1 font-mono font-medium text-gray-700">
                                  <DollarSign size={12}/> Est: {inter.costEstimated} MAD
                                </span>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
              </div>

              {/* SIDEBAR ACTIONS */}
              <div className="space-y-4">
                 <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                    <h4 className="font-bold text-emerald-800 text-sm mb-3">Actions Rapides</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left text-sm bg-white p-2 rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition">
                        Changer le statut
                      </button>
                      <button className="w-full text-left text-sm bg-white p-2 rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition">
                        Assigner un prestataire
                      </button>
                      <button className="w-full text-left text-sm bg-white p-2 rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition">
                        Ajouter une note interne
                      </button>
                      <button className="w-full text-left text-sm bg-red-50 p-2 rounded border border-red-200 text-red-700 hover:bg-red-100 transition mt-4">
                        Clôturer le ticket
                      </button>
                    </div>
                 </div>
                 
                 <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 text-sm mb-3">Informations Copropriétaire</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{selectedTicket.authorName}</p>
                      <p className="text-xs text-gray-400">Lot A1</p>
                      <button className="text-blue-600 hover:underline text-xs mt-2">Contacter</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Incidents & Travaux</h2>
           <p className="text-gray-500 text-sm">Administration complète des signalements et chantiers.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2">
          <Plus size={16} /> Créer Ticket
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Liste des Tickets
        </button>
        <button 
           onClick={() => setActiveTab('interventions')}
           className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'interventions' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Suivi des Interventions
        </button>
      </div>

      {activeTab === 'tickets' && (
        <div className="space-y-4">
           {/* Filters */}
           <div className="flex gap-2 mb-4">
             <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
             </div>
             <button className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50"><Filter size={16}/></button>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ticket</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Priorité</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Déclarant</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {TICKETS.map(ticket => (
                   <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                     <td className="px-6 py-4">
                       <p className="text-sm font-bold text-gray-900">{ticket.title}</p>
                       <p className="text-xs text-gray-500">{ticket.category} • {ticket.dateCreated}</p>
                     </td>
                     <td className="px-6 py-4"><PriorityBadge priority={ticket.priority}/></td>
                     <td className="px-6 py-4"><StatusBadge status={ticket.status}/></td>
                     <td className="px-6 py-4 text-sm text-gray-600">{ticket.authorName}</td>
                     <td className="px-6 py-4 text-right">
                       <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">Gérer</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'interventions' && (
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Intervention</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Prestataire</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Coût Est.</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {INTERVENTIONS.map(inter => {
                    const ticket = TICKETS.find(t => t.id === inter.ticketId);
                    const provider = PROVIDERS.find(p => p.id === inter.providerId);
                    return (
                      <tr key={inter.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{inter.description}</p>
                          <p className="text-xs text-gray-500">Lié à : {ticket?.title}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{provider?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{inter.datePlanned}</td>
                        <td className="px-6 py-4 text-sm font-mono">{inter.costEstimated} MAD</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs font-medium ${inter.status === 'Terminée' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                             {inter.status}
                           </span>
                        </td>
                      </tr>
                    );
                 })}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
};

// ==================================================================================
// 🔒 COPROPRIETAIRE VIEW (RESTRICTED)
// ==================================================================================

const CoproMaintenanceView: React.FC<{ user: User }> = ({ user }) => {
  const [showDeclareForm, setShowDeclareForm] = useState(false);
  const [viewTicketId, setViewTicketId] = useState<string | null>(null);

  // SECURITY FILTER: Only my tickets OR public tickets
  const myTickets = TICKETS.filter(t => t.authorId === user.id || t.isPublic);

  if (showDeclareForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
         <div className="flex items-center gap-2 mb-6">
           <button onClick={() => setShowDeclareForm(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ChevronRight className="rotate-180" size={20}/></button>
           <h2 className="text-xl font-bold text-gray-800">Déclarer un incident</h2>
         </div>
         
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Titre</label>
               <input type="text" placeholder="Ex: Fuite d'eau..." className="w-full border p-2 rounded-lg text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                 <select className="w-full border p-2 rounded-lg text-sm bg-white">
                   <option>Plomberie</option>
                   <option>Électricité</option>
                   <option>Ascenseur</option>
                   <option>Parties Communes</option>
                   <option>Autre</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Lot concerné</label>
                 <select className="w-full border p-2 rounded-lg text-sm bg-white">
                   <option>Parties Communes</option>
                   {user.lotIds?.map(id => <option key={id}>Lot {id} (Mon lot)</option>)}
                 </select>
               </div>
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Description détaillée</label>
               <textarea rows={4} className="w-full border p-2 rounded-lg text-sm" placeholder="Décrivez le problème..."></textarea>
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Photos</label>
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition cursor-pointer">
                  <Camera size={24} className="mb-2"/>
                  <span className="text-xs">Cliquez pour ajouter des photos</span>
               </div>
            </div>
            
            <div className="pt-4 flex justify-end">
               <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700">Envoyer le signalement</button>
            </div>
         </div>
      </div>
    );
  }

  // TICKET DETAIL (READ ONLY)
  if (viewTicketId) {
    const t = myTickets.find(ticket => ticket.id === viewTicketId);
    if (!t) return null; // Should not happen

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => setViewTicketId(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm font-medium">
          <ChevronRight size={16} className="rotate-180"/> Retour
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h2>
                 <p className="text-sm text-gray-500 flex items-center gap-2">
                   <Clock size={14} /> Créé le {t.dateCreated}
                   <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{t.category}</span>
                 </p>
              </div>
              <StatusBadge status={t.status} />
           </div>

           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h4 className="font-bold text-blue-800 text-sm mb-1">Suivi Syndic</h4>
              <p className="text-sm text-blue-700">
                {t.status === TicketStatus.OPEN && "Votre ticket a bien été reçu, le syndic va l'analyser."}
                {t.status === TicketStatus.WAITING_PROVIDER && "Un prestataire a été contacté pour intervention."}
                {t.status === TicketStatus.RESOLVED && "L'incident est marqué comme résolu."}
              </p>
           </div>

           <div>
              <h3 className="font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{t.description}</p>
           </div>
           
           {/* NO ACCESS TO COSTS, INTERVENTIONS, OR PROVIDER DETAILS */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Mes Incidents</h2>
           <p className="text-gray-500 text-sm">Suivi de mes signalements et des problèmes communs.</p>
        </div>
        <button 
          onClick={() => setShowDeclareForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2"
        >
          <Plus size={16} /> Déclarer un incident
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {myTickets.map(t => (
           <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer flex flex-col h-full" onClick={() => setViewTicketId(t.id)}>
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-2 rounded-lg ${t.priority === 'Urgente' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    <AlertCircle size={20} />
                 </div>
                 <StatusBadge status={t.status} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{t.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{t.description}</p>
              
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                 <span>{t.dateCreated}</span>
                 <span className="flex items-center gap-1">
                    {t.authorId === user.id ? 'Moi' : 'Public'}
                 </span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export const MaintenanceView: React.FC<MaintenanceProps> = ({ user }) => {
  return user.role === UserRole.SYNDIC ? <SyndicMaintenanceView /> : <CoproMaintenanceView user={user} />;
};