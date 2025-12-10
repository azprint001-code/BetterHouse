
import React, { useState } from 'react';
import { 
  Building, MapPin, Ruler, Users, FileText, Settings, ShieldCheck, Box, 
  Home, Edit, Trash2, Plus, Download, Info, CheckCircle, Key, Layers, PenTool, Phone,
  PieChart
} from 'lucide-react';
import { COPROPRIETE, LOTS, USERS, BUILDINGS, TECHNICAL_INFOS } from '../services/mockData';
import { User, UserRole, Lot } from '../types';

interface PropertyProps {
  user?: User; // Optional only because current routing might pass it optionally, but we expect it
}

export const PropertyView: React.FC<PropertyProps> = ({ user }) => {
  // If no user is passed (shouldn't happen in real routing), default to Syndic for preview
  const currentUser = user || USERS[0];
  const isSyndic = currentUser.role === UserRole.SYNDIC;

  // Tabs management
  // Default tab differs by role
  const [activeTab, setActiveTab] = useState(isSyndic ? 'lots' : 'my_lots');
  const [filterBuilding, setFilterBuilding] = useState('all');

  // --- SYNDIC VIEWS ---

  const BuildingsAndLotsView = () => {
    const filteredLots = filterBuilding === 'all' 
      ? LOTS 
      : LOTS.filter(l => l.buildingId === filterBuilding);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-2">
            <select 
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
            >
              <option value="all">Tous les bâtiments</option>
              {BUILDINGS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Plus size={16} /> Ajouter Bâtiment
            </button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2">
              <Plus size={16} /> Créer un Lot
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lot</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Bâtiment</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Propriétaire</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tantièmes</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Surface</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLots.map(lot => {
                  const building = BUILDINGS.find(b => b.id === lot.buildingId);
                  const owner = USERS.find(u => u.id === lot.ownerId);
                  return (
                    <tr key={lot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{lot.numero}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{building?.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium 
                          ${lot.type === 'Appartement' ? 'bg-blue-50 text-blue-700' : 
                            lot.type === 'Commerce' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                          {lot.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                             {owner?.name.charAt(0)}
                           </div>
                           <span className="text-sm text-gray-700 truncate max-w-[150px]">{owner?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{lot.tantiemesGeneraux}/1000</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lot.surface} m²</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const OwnersView = () => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2">
          <Plus size={16} /> Ajouter Copropriétaire
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Copropriétaire</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lots Possédés</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Coordonnées</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {USERS.filter(u => u.role === UserRole.COPROPRIETAIRE).map(owner => (
                <tr key={owner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={owner.avatarUrl} alt="" className="w-9 h-9 rounded-full border border-gray-200" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{owner.name}</p>
                        <p className="text-xs text-gray-500">ID: {owner.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${owner.isOccupant ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                       {owner.isOccupant ? 'Occupant' : 'Bailleur'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-wrap gap-1">
                      {owner.lotIds?.map(lotId => {
                        const l = LOTS.find(lt => lt.id === lotId);
                        return <span key={lotId} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-medium border border-gray-200">{l?.numero}</span>;
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1"><Phone size={12}/> {owner.phone}</span>
                      <span className="text-xs text-gray-400">{owner.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium hover:underline">Gérer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TantiemesView = () => {
    // SYNDIC VIEW: Full Table
    if (isSyndic) {
      return (
        <div className="space-y-6">
           <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
             <Info className="text-blue-500 mt-0.5" size={20} />
             <div>
               <h4 className="font-bold text-blue-800 text-sm">Répartition des charges</h4>
               <p className="text-blue-600 text-xs mt-1">
                 Les tantièmes généraux sont utilisés pour la majorité des charges communes. 
                 Les tantièmes "Ascenseur" s'appliquent uniquement aux charges de maintenance et d'électricité de l'ascenseur.
               </p>
             </div>
           </div>
    
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lot</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Propriétaire</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center bg-gray-100">Généraux (/1000)</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Ascenseur (/1000)</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Chauffage</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {LOTS.map(lot => (
                    <tr key={lot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{lot.numero}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{USERS.find(u => u.id === lot.ownerId)?.name}</td>
                      <td className="px-6 py-4 text-sm font-mono font-bold text-center bg-gray-50/50">{lot.tantiemesGeneraux}</td>
                      <td className="px-6 py-4 text-sm font-mono text-center">{lot.tantiemesAscenseur || '-'}</td>
                      <td className="px-6 py-4 text-sm font-mono text-center">{lot.tantiemesChauffage || '-'}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                    <td className="px-6 py-4" colSpan={2}>TOTAL</td>
                    <td className="px-6 py-4 text-center">{LOTS.reduce((acc, l) => acc + l.tantiemesGeneraux, 0)}</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                  </tr>
                </tbody>
              </table>
           </div>
        </div>
      );
    }

    // COPRO VIEW: Summary Card
    const myLots = LOTS.filter(l => l.ownerId === currentUser.id);
    const myTotalTantiemes = myLots.reduce((acc, l) => acc + l.tantiemesGeneraux, 0);

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800">Ma Quote-part de Charges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Vos Tantièmes Généraux</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-emerald-600">{myTotalTantiemes}</span>
                <span className="text-gray-400 font-medium">/ 1000</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Soit {(myTotalTantiemes/10).toFixed(1)}% des charges communes</p>
            </div>
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <PieChart size={32} />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
             <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
               <Info size={18} /> Comprendre mes charges
             </h4>
             <p className="text-sm text-blue-700 leading-relaxed">
               Vos appels de fonds sont calculés proportionnellement à vos tantièmes.
               Si le budget annuel est de 100 000 MAD et que vous possédez 45/1000èmes,
               votre part annuelle sera de 4 500 MAD (hors consommations individuelles et charges spéciales comme l'ascenseur).
             </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h4 className="font-bold text-gray-700">Détail par lot</h4>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
               <tr>
                 <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Lot</th>
                 <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                 <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">Généraux (/1000)</th>
                 <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">Ascenseur (/1000)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myLots.map(lot => (
                <tr key={lot.id}>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">{lot.numero}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{lot.type}</td>
                  <td className="px-6 py-3 text-sm font-mono text-center font-bold">{lot.tantiemesGeneraux}</td>
                  <td className="px-6 py-3 text-sm font-mono text-center">{lot.tantiemesAscenseur || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const TechnicalView = () => (
    <div className="space-y-6">
      {/* HEADER WITH ACTIONS (SYNDIC ONLY) */}
      {isSyndic && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus size={18}/> Ajouter un équipement</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catégorie</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>Ascenseur</option>
                  <option>Incendie</option>
                  <option>Pompe à eau</option>
                  <option>Électrique</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Ex: Extincteurs Hall A" />
              </div>
              <div className="flex items-end">
                 <button className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700">Enregistrer</button>
              </div>
           </div>
        </div>
      )}

      {/* LIST (VISIBLE TO ALL) */}
      <div className="space-y-4">
          <h3 className="font-bold text-gray-800">État des équipements</h3>
           {TECHNICAL_INFOS.map(tech => (
             <div key={tech.id} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm font-bold text-gray-800">{tech.category}</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase
                       ${tech.status === 'Bon' ? 'bg-emerald-100 text-emerald-700' : 
                         tech.status === 'Moyen' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                       {tech.status}
                     </span>
                   </div>
                   <p className="text-xs text-gray-500">{tech.description}</p>
                   <p className="text-xs text-gray-400 mt-2">Dernière maintenance: {tech.lastMaintenance}</p>
                </div>
                {isSyndic && (
                  <button className="text-gray-400 hover:text-emerald-600 border p-2 rounded-lg hover:bg-gray-50">
                    <Edit size={16} />
                  </button>
                )}
             </div>
           ))}
      </div>
    </div>
  );

  const GeneralInfoView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Informations Générales</h3>
            {isSyndic && <button className="text-sm text-emerald-600 font-medium hover:underline">Modifier</button>}
          </div>
          <div className="space-y-4">
             <div className="flex justify-between border-b border-gray-50 pb-3">
               <span className="text-sm text-gray-500">Nom de la résidence</span>
               <span className="text-sm font-medium text-gray-900">{COPROPRIETE.name}</span>
             </div>
             <div className="flex justify-between border-b border-gray-50 pb-3">
               <span className="text-sm text-gray-500">Adresse</span>
               <span className="text-sm font-medium text-gray-900 text-right">{COPROPRIETE.address}, {COPROPRIETE.city}</span>
             </div>
             <div className="flex justify-between border-b border-gray-50 pb-3">
               <span className="text-sm text-gray-500">Construction</span>
               <span className="text-sm font-medium text-gray-900">{COPROPRIETE.constructionYear}</span>
             </div>
             <div className="flex justify-between border-b border-gray-50 pb-3">
               <span className="text-sm text-gray-500">Compte Bancaire</span>
               <span className="text-sm font-mono bg-gray-100 px-2 rounded text-gray-700">{COPROPRIETE.bankAccount}</span>
             </div>
             <div className="pt-2">
               <span className="text-sm text-gray-500 block mb-2">Services inclus</span>
               <div className="flex flex-wrap gap-2">
                 {COPROPRIETE.services?.map(s => (
                   <span key={s} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium">{s}</span>
                 ))}
               </div>
             </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Documents Légaux</h3>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 text-red-500 p-2 rounded"><FileText size={18}/></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Règlement de Copropriété</p>
                    <p className="text-xs text-gray-400">PDF • 5.2 MB</p>
                  </div>
                </div>
                <Download size={18} className="text-gray-300 group-hover:text-emerald-600" />
             </div>
             <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-500 p-2 rounded"><ShieldCheck size={18}/></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Contrat Assurance RC</p>
                    <p className="text-xs text-gray-400">PDF • 1.1 MB</p>
                  </div>
                </div>
                <Download size={18} className="text-gray-300 group-hover:text-emerald-600" />
             </div>
          </div>
          
          {isSyndic && (
            <div className="mt-8 pt-6 border-t border-gray-100">
               <button className="w-full border-2 border-dashed border-gray-200 text-gray-400 rounded-lg py-3 text-sm font-medium hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                 <Plus size={18} /> Téléverser un document
               </button>
            </div>
          )}
       </div>
    </div>
  );

  // --- COPROPRIETAIRE VIEWS ---

  const MyLotsView = () => {
    // FILTER: ONLY SHOW MY LOTS
    const myLots = LOTS.filter(l => l.ownerId === currentUser.id);

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800">Mes Lots</h3>
        {myLots.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">Aucun lot associé à votre compte.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Numéro du lot</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Bâtiment</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Surface</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Tantièmes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myLots.map(lot => {
                  const building = BUILDINGS.find(b => b.id === lot.buildingId);
                  return (
                    <tr key={lot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{lot.numero}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{building?.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium 
                          ${lot.type === 'Appartement' ? 'bg-blue-50 text-blue-700' : 
                            lot.type === 'Commerce' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                          {lot.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lot.surface} m²</td>
                      <td className="px-6 py-4 text-sm font-mono text-emerald-600 font-bold text-right">{lot.tantiemesGeneraux}/1000</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    );
  };

  const ContactsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-emerald-500">
          <h3 className="font-bold text-gray-800 text-lg mb-1">Syndic</h3>
          <p className="text-sm text-gray-500 mb-4">Gestionnaire Principal</p>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
               <div className="bg-gray-100 p-2 rounded-full"><Users size={16}/></div>
               <span className="text-sm font-medium">{USERS.find(u => u.role === UserRole.SYNDIC)?.name}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="bg-gray-100 p-2 rounded-full"><Phone size={16}/></div>
               <span className="text-sm text-gray-600">{USERS.find(u => u.role === UserRole.SYNDIC)?.phone}</span>
             </div>
             <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700">Envoyer un message</button>
             </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-lg mb-1">Gardiennage</h3>
          <p className="text-sm text-gray-500 mb-4">Poste de sécurité (24/7)</p>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
               <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full"><ShieldCheck size={16}/></div>
               <span className="text-sm font-medium">Atlas Sécurité</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="bg-gray-100 p-2 rounded-full"><Phone size={16}/></div>
               <span className="text-sm text-gray-600 font-bold">0522 00 00 00</span>
             </div>
          </div>
       </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-lg mb-1">Ascenseur</h3>
          <p className="text-sm text-gray-500 mb-4">En cas de panne</p>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
               <div className="bg-blue-50 text-blue-600 p-2 rounded-full"><PenTool size={16}/></div>
               <span className="text-sm font-medium">Otis Maroc</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="bg-gray-100 p-2 rounded-full"><Phone size={16}/></div>
               <span className="text-sm text-gray-600 font-bold">0522 22 22 22</span>
             </div>
          </div>
       </div>
    </div>
  );

  // --- MAIN RENDER ---

  const syndicTabs = [
    { id: 'lots', label: 'Immeubles & Lots' },
    { id: 'owners', label: 'Copropriétaires' },
    { id: 'tantiemes', label: 'Répartition' },
    { id: 'info', label: 'Infos & Docs' },
    { id: 'tech', label: 'Dossier Technique' },
  ];

  const ownerTabs = [
    { id: 'my_lots', label: 'Immeubles & Lots' }, // Renamed from "Mes Lots" to match prompt requirement
    { id: 'info', label: 'Infos & Docs' },
    { id: 'tantiemes', label: 'Répartition' }, // Added
    { id: 'tech', label: 'Dossier Technique' }, // Added
    { id: 'contacts', label: 'Contacts' },
  ];

  const tabs = isSyndic ? syndicTabs : ownerTabs;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-slate-900"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-start md:items-end -mt-12 gap-6">
          <div className="bg-white p-2 rounded-xl shadow-md z-10">
            <div className="w-24 h-24 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
               <Building size={48} />
            </div>
          </div>
          <div className="flex-1 z-10">
            <h1 className="text-3xl font-bold text-gray-900">{COPROPRIETE.name}</h1>
            <div className="flex items-center gap-4 text-gray-500 mt-2 text-sm font-medium">
              <span className="flex items-center gap-1"><MapPin size={16} /> {COPROPRIETE.address}</span>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">ID: {COPROPRIETE.id}</span>
            </div>
          </div>
          <div className="flex gap-4 md:mb-2 z-10">
            {/* Contextual Top Actions could go here */}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {/* SYNDIC TABS */}
        {activeTab === 'lots' && <BuildingsAndLotsView />}
        {activeTab === 'owners' && <OwnersView />}
        
        {/* SHARED BUT DIFFERENTIATED TABS */}
        {activeTab === 'tantiemes' && <TantiemesView />}
        {activeTab === 'info' && <GeneralInfoView />}
        {activeTab === 'tech' && <TechnicalView />}

        {/* OWNER SPECIFIC TABS */}
        {activeTab === 'my_lots' && <MyLotsView />}
        {activeTab === 'contacts' && <ContactsView />}
      </div>
    </div>
  );
};
