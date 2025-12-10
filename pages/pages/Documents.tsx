import React, { useState } from 'react';
import { 
  Folder, FileText, Download, Search, MoreVertical, Plus, 
  Archive, Shield, CreditCard, Users, Briefcase, Eye, EyeOff, 
  Trash2, Edit, Filter, AlertTriangle, FileCheck, Lock
} from 'lucide-react';
import { DOCUMENTS, USERS } from '../services/mockData';
import { User, UserRole, Document, DocumentType } from '../types';

// ==================================================================================
// 🔥 SYNDIC VIEW (FULL ARCHIVE MANAGEMENT)
// ==================================================================================

const SyndicDocumentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ag' | 'finance' | 'legal' | 'tech'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // --- STATS ---
  const stats = {
    total: DOCUMENTS.length,
    ag: DOCUMENTS.filter(d => [DocumentType.PV_AG, DocumentType.CONVOCATION_AG].includes(d.type)).length,
    finance: DOCUMENTS.filter(d => [DocumentType.FACTURE_PRESTATAIRE, DocumentType.BUDGET].includes(d.type)).length,
    contracts: DOCUMENTS.filter(d => d.type === DocumentType.CONTRAT_PRESTATAIRE).length,
    missingPV: 0 // Mock logic could check AGs without linked PV
  };

  // --- FILTERS ---
  const filterDocuments = (docs: Document[]) => {
    return docs.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = 
        activeTab === 'all' ? true :
        activeTab === 'ag' ? [DocumentType.PV_AG, DocumentType.CONVOCATION_AG, DocumentType.ANNEXE_AG].includes(doc.type) :
        activeTab === 'finance' ? [DocumentType.BUDGET, DocumentType.RELEVE_COMPTABLE, DocumentType.FACTURE_PRESTATAIRE, DocumentType.ETAT_IMPAYES].includes(doc.type) :
        activeTab === 'legal' ? [DocumentType.REGLEMENT_COPROPRIETE, DocumentType.CONTRAT_PRESTATAIRE, DocumentType.DOCUMENT_JURIDIQUE].includes(doc.type) :
        activeTab === 'tech' ? [DocumentType.RAPPORT_TECHNIQUE, DocumentType.DEVIS].includes(doc.type) : true;
      
      return matchesSearch && matchesTab;
    });
  };

  const filteredDocs = filterDocuments(DOCUMENTS);

  return (
    <div className="space-y-8">
      {/* 1. DASHBOARD HEADER */}
      <div>
         <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Documents & Archives</h2>
              <p className="text-gray-500 text-sm">Centre de gestion documentaire centralisé.</p>
            </div>
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2"
            >
              <Plus size={16} /> Ajouter un document
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={20}/></div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Docs AG</p>
                 <p className="text-xl font-bold text-gray-800">{stats.ag}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard size={20}/></div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Compta & Factures</p>
                 <p className="text-xl font-bold text-gray-800">{stats.finance}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Briefcase size={20}/></div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Contrats Actifs</p>
                 <p className="text-xl font-bold text-gray-800">{stats.contracts}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
               <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={20}/></div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">À Classer</p>
                 <p className="text-xl font-bold text-gray-800">2</p>
               </div>
            </div>
         </div>
      </div>

      {/* 2. MAIN ARCHIVE INTERFACE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
         
         {/* Toolbar */}
         <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
               {[
                 {id: 'all', label: 'Tout'},
                 {id: 'ag', label: 'Assemblées'},
                 {id: 'finance', label: 'Comptabilité'},
                 {id: 'legal', label: 'Juridique'},
                 {id: 'tech', label: 'Technique'}
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                     ${activeTab === tab.id ? 'bg-slate-800 text-white' : 'text-gray-600 hover:bg-gray-50'}
                   `}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>

            <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Rechercher..." 
                 className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-5/12">Document</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-2/12">Catégorie</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-2/12">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-1/12 text-center">Visibilité</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-2/12 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50 group transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="bg-red-50 text-red-500 p-2.5 rounded-lg">
                                <FileText size={20} />
                             </div>
                             <div>
                                <p className="font-medium text-gray-800 text-sm">{doc.title}</p>
                                <p className="text-xs text-gray-500">{doc.description} • {doc.size}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                            {doc.type}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-600">
                          {doc.dateDocument || doc.dateUpload}
                       </td>
                       <td className="px-6 py-4 text-center">
                          {doc.isVisibleToOwners ? (
                             <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                               <Eye size={12} /> Public
                             </span>
                          ) : (
                             <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                               <EyeOff size={12} /> Privé
                             </span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Télécharger">
                               <Download size={16} />
                             </button>
                             <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Modifier">
                               <Edit size={16} />
                             </button>
                             <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Supprimer">
                               <Trash2 size={16} />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            {filteredDocs.length === 0 && (
               <div className="p-12 text-center text-gray-400">
                  <Archive size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Aucun document trouvé pour ces critères.</p>
               </div>
            )}
         </div>
      </div>

      {/* Upload Modal (Mock) */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ajouter un document</h3>
              <div className="space-y-4">
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 cursor-pointer transition">
                    <Plus size={32} className="mx-auto text-gray-400 mb-2"/>
                    <p className="text-sm text-gray-600">Glissez un fichier ici ou cliquez pour parcourir</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Titre</label>
                    <input type="text" className="w-full border p-2 rounded-lg text-sm" placeholder="Ex: Facture Lydec..."/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                    <select className="w-full border p-2 rounded-lg text-sm bg-white">
                       {Object.values(DocumentType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="checkbox" id="public" className="rounded text-emerald-600"/>
                    <label htmlFor="public" className="text-sm text-gray-700">Rendre visible aux copropriétaires</label>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setUploadModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Annuler</button>
                    <button onClick={() => setUploadModalOpen(false)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Enregistrer</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};


// ==================================================================================
// 🔒 COPROPRIETAIRE VIEW (DIGITAL SAFE)
// ==================================================================================

const CoproDocumentsView: React.FC<{ user: User }> = ({ user }) => {
  // --- SECURITY FILTERING ---
  // 1. Personal Docs (OwnerId matches)
  // 2. Public Docs (VisibleToOwners is true)
  // 3. STRICTLY NO Internal Docs (Contracts, Invoices, etc.)

  const myDocs = DOCUMENTS.filter(d => 
    (d.ownerId === user.id) || // Personal
    (d.isVisibleToOwners === true && !d.ownerId && d.coproprieteId === 'copro_1') // Public
  );

  const personalDocs = myDocs.filter(d => d.ownerId === user.id);
  const agDocs = myDocs.filter(d => [DocumentType.PV_AG, DocumentType.CONVOCATION_AG, DocumentType.ANNEXE_AG].includes(d.type));
  const publicDocs = myDocs.filter(d => [DocumentType.REGLEMENT_COPROPRIETE, DocumentType.NOTE_OFFICIELLE, DocumentType.REGLEMENT_INTERIEUR].includes(d.type));

  const DocCard: React.FC<{ doc: Document }> = ({ doc }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer">
       <div className={`p-3 rounded-lg flex-shrink-0 ${doc.ownerId ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          {doc.ownerId ? <Lock size={20} /> : <FileText size={20} />}
       </div>
       <div className="flex-1 overflow-hidden">
          <p className="font-bold text-gray-800 text-sm truncate">{doc.title}</p>
          <p className="text-xs text-gray-500 mt-1 truncate">{doc.description}</p>
          <div className="flex items-center gap-3 mt-3">
             <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-gray-500 uppercase tracking-wide">
               {doc.type}
             </span>
             <span className="text-[10px] text-gray-400">{doc.dateDocument || doc.dateUpload}</span>
          </div>
       </div>
       <div className="opacity-0 group-hover:opacity-100 self-center">
          <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition">
             <Download size={18} />
          </button>
       </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Shield className="text-emerald-400" /> Mon Coffre-fort Numérique
            </h2>
            <p className="text-slate-300 max-w-xl">
              Accédez à vos documents personnels et aux archives officielles de la copropriété en toute sécurité.
              Les documents confidentiels du syndic ne sont pas accessibles ici.
            </p>
         </div>
         <FileCheck className="absolute right-[-20px] bottom-[-40px] text-white opacity-5 w-64 h-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* LEFT COL: PERSONAL */}
         <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Lock size={18} className="text-blue-600" /> Mes Documents Personnels
            </h3>
            <div className="space-y-3">
               {personalDocs.length > 0 ? personalDocs.map(d => <DocCard key={d.id} doc={d} />) : (
                 <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500">
                   Aucun document personnel disponible.
                 </div>
               )}
            </div>
         </div>

         {/* RIGHT COL: PUBLIC */}
         <div className="space-y-8">
            <div className="space-y-4">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Users size={18} className="text-purple-600" /> Assemblées Générales
               </h3>
               <div className="space-y-3">
                  {agDocs.length > 0 ? agDocs.map(d => <DocCard key={d.id} doc={d} />) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500">
                       Aucun document d'AG publié.
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase size={18} className="text-amber-600" /> Règlements & Vie de l'immeuble
               </h3>
               <div className="space-y-3">
                  {publicDocs.length > 0 ? publicDocs.map(d => <DocCard key={d.id} doc={d} />) : (
                     <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500">
                       Aucun règlement disponible.
                     </div>
                  )}
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

export const DocumentsView: React.FC<{ user?: User }> = ({ user }) => {
  // In real app, user is passed. Mock fallback for safety.
  const currentUser = user || USERS[0];
  
  return currentUser.role === UserRole.SYNDIC 
    ? <SyndicDocumentsView /> 
    : <CoproDocumentsView user={currentUser} />;
};
