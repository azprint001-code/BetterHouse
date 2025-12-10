
import React, { useState } from 'react';
import { HardHat, Phone, Star, Mail, MapPin, FileText, Plus, ShieldCheck, AlertCircle } from 'lucide-react';
import { PROVIDERS, CONTRACTS } from '../services/mockData';
import { User, UserRole, Provider } from '../types';

interface ProvidersProps {
  user: User;
}

// ==================================================================================
// 🔥 SYNDIC VIEW (FULL MANAGEMENT)
// ==================================================================================

const SyndicProvidersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'contracts'>('directory');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Prestataires</h2>
           <p className="text-gray-500 text-sm">Annuaire fournisseurs et gestion des contrats.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2">
          <Plus size={16} /> Ajouter Prestataire
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button 
           onClick={() => setActiveTab('directory')}
           className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'directory' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Répertoire
        </button>
        <button 
           onClick={() => setActiveTab('contracts')}
           className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'contracts' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Contrats & Facturation
        </button>
      </div>

      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {PROVIDERS.map(provider => (
             <div key={provider.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <HardHat size={24} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${provider.status === 'Actif' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {provider.status}
                  </span>
               </div>
               
               <h3 className="font-bold text-gray-900 text-lg">{provider.name}</h3>
               <p className="text-sm text-gray-500 mb-4">{provider.serviceType}</p>
               
               <div className="space-y-3 border-t border-gray-100 pt-4 mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" /> {provider.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" /> {provider.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" /> {provider.address || 'Adresse non renseignée'}
                  </div>
               </div>

               <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center mb-4">
                  <div className="text-xs text-gray-500">
                     <span className="block font-bold text-gray-700">{provider.interventionsCount}</span> Interventions
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                     {provider.rating} <Star size={14} fill="currentColor"/>
                  </div>
               </div>
               
               <div className="flex gap-2">
                 <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Modifier</button>
                 <button className="flex-1 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Contacter</button>
               </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'contracts' && (
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONTRACTS.map(contract => {
                 const provider = PROVIDERS.find(p => p.id === contract.providerId);
                 return (
                   <div key={contract.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-gray-800 text-lg">{provider?.name}</h4>
                           <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{contract.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{contract.description}</p>
                        
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm text-gray-600">
                           <div className="flex justify-between">
                             <span>Montant Annuel</span>
                             <span className="font-mono font-bold">{contract.amount.toLocaleString()} MAD</span>
                           </div>
                           <div className="flex justify-between">
                             <span>Échéance</span>
                             <span className="font-medium text-red-500">{contract.endDate}</span>
                           </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                         <button className="text-xs flex items-center gap-1 text-gray-500 hover:text-emerald-600"><FileText size={14}/> Voir Contrat</button>
                         <button className="text-xs flex items-center gap-1 text-gray-500 hover:text-emerald-600 ml-3"><FileText size={14}/> Factures</button>
                      </div>
                   </div>
                 );
              })}
              
              <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition p-6 min-h-[200px]">
                 <Plus size={32} className="mb-2" />
                 <span className="font-medium">Nouveau Contrat</span>
              </button>
            </div>
         </div>
      )}
    </div>
  );
};

// ==================================================================================
// 🔒 COPROPRIETAIRE VIEW (READ ONLY - DIRECTORY)
// ==================================================================================

const CoproProvidersView: React.FC = () => {
  // SECURITY: Only show active providers, no contract details, no internal notes
  const safeProviders = PROVIDERS.filter(p => p.status === 'Actif');

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
         <div className="bg-white p-2 rounded-full text-blue-500 shadow-sm">
           <ShieldCheck size={24} />
         </div>
         <div>
           <h3 className="font-bold text-blue-900 text-lg">Contacts Utiles & Urgences</h3>
           <p className="text-blue-700 text-sm mt-1">
             Retrouvez ici les coordonnées des prestataires agréés par la copropriété pour vos interventions privatives ou pour signaler une urgence.
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeProviders.map(p => (
           <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                 <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                    <HardHat size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-800">{p.name}</h4>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">{p.serviceType}</span>
                 </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                 <div className="flex items-center gap-3">
                   <Phone size={16} className="text-emerald-500" /> 
                   <span className="font-medium">{p.phone}</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Mail size={16} className="text-gray-400" /> 
                   <span>{p.email}</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <MapPin size={16} className="text-gray-400" /> 
                   <span>{p.address}</span>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 text-center">
                 <p className="text-xs text-gray-400 italic">Pour toute intervention sur les parties communes, merci de passer par le Syndic.</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export const ProvidersView: React.FC<ProvidersProps> = ({ user }) => {
  return user.role === UserRole.SYNDIC ? <SyndicProvidersView /> : <CoproProvidersView />;
};
