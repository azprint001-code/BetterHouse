

import React, { useState } from 'react';
import { 
  User as UserIcon, Bell, Lock, Globe, Shield, Building, CreditCard, 
  FileText, Users, Mail, Phone, MapPin, PenTool, Save, CheckCircle, 
  AlertTriangle, Smartphone, ChevronRight, LogOut, History, Key, Eye, Edit
} from 'lucide-react';
import { USERS, SYNDIC_PROFILE, COPRO_SETTINGS, DOCUMENT_TEMPLATES, SECURITY_LOGS } from '../services/mockData';
import { User, UserRole } from '../types';

interface SettingsProps {
  user: User;
}

// ==================================================================================
// 🔥 SYNDIC VIEW (FULL ADMIN PANEL)
// ==================================================================================

const SyndicSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'identity' | 'property' | 'users' | 'notifications' | 'templates'>('identity');

  // --- SUB-COMPONENTS ---

  const IdentitySettings = () => (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
             <Building className="text-emerald-600" size={20}/> Identité du Cabinet
          </h3>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-emerald-500 transition">
                   <img src={SYNDIC_PROFILE.logoUrl} alt="Logo" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium">Modifier</div>
                </div>
                <span className="text-xs text-gray-500 font-medium uppercase">Logo Officiel</span>
             </div>

             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom de l'entreprise</label>
                   <input type="text" defaultValue={SYNDIC_PROFILE.companyName} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email professionnel</label>
                   <input type="email" defaultValue={SYNDIC_PROFILE.email} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                   <input type="tel" defaultValue={SYNDIC_PROFILE.phone} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse Siège</label>
                   <input type="text" defaultValue={SYNDIC_PROFILE.address} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
             </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
             <FileText className="text-blue-600" size={20}/> Informations Légales & Bancaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">RIB (Relevé d'Identité Bancaire)</label>
                <div className="relative">
                   <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                   <input type="text" defaultValue={SYNDIC_PROFILE.rib} className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm font-mono bg-gray-50" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Ce RIB apparaîtra sur les appels de fonds.</p>
             </div>
             
             <div className="md:col-span-2 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                   <label className="block text-xs font-bold text-gray-500 uppercase">Signature Électronique</label>
                   <button className="text-xs text-emerald-600 font-medium hover:underline">Mettre à jour</button>
                </div>
                <div className="h-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                   <p className="text-gray-400 text-sm italic">Signature numérisée active</p>
                </div>
             </div>
          </div>
       </div>
       
       <div className="flex justify-end pt-4">
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-emerald-700 flex items-center gap-2">
             <Save size={18} /> Enregistrer les modifications
          </button>
       </div>
    </div>
  );

  const PropertySettings = () => (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Configuration Copropriété</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Devise</label>
                <select disabled className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed">
                   <option>Dirham Marocain (MAD)</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Langue par défaut</label>
                <select defaultValue={COPRO_SETTINGS.language} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                   <option value="FR">Français</option>
                   <option value="AR">Arabe</option>
                </select>
             </div>
             
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Début Exercice Comptable</label>
                <input type="text" defaultValue={COPRO_SETTINGS.fiscalYearStart} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="MM-JJ" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fin Exercice Comptable</label>
                <input type="text" defaultValue={COPRO_SETTINGS.fiscalYearEnd} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="MM-JJ" />
             </div>
             
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pénalités de retard (%)</label>
                <div className="flex items-center gap-2">
                   <input type="number" defaultValue={COPRO_SETTINGS.penaltyRate} className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                   <span className="text-sm text-gray-600">% par an</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Appliqué automatiquement sur les charges impayées après échéance.</p>
             </div>
          </div>
       </div>
       
       <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0" />
          <div>
             <h4 className="font-bold text-amber-800 text-sm">Zone de Danger</h4>
             <p className="text-xs text-amber-700 mt-1">La modification de la période comptable peut entraîner des incohérences sur les rapports financiers déjà générés.</p>
          </div>
       </div>
    </div>
  );

  const UserManagement = () => (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300">
       <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Gestion des Utilisateurs</h3>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
             <Users size={16} /> Ajouter un copropriétaire
          </button>
       </div>
       
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Utilisateur</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rôle</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lots</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {USERS.filter(u => u.role === UserRole.COPROPRIETAIRE).map(u => (
                   <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                               <img src={u.avatarUrl} alt="" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                               <p className="text-sm font-medium text-gray-900">{u.name}</p>
                               <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">Copropriétaire</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                         {u.lotIds?.join(', ')}
                      </td>
                      <td className="px-6 py-4">
                         <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                            <CheckCircle size={12} /> Actif
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-gray-400 hover:text-emerald-600 font-medium text-xs">Gérer</button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const TemplatesManager = () => (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List */}
          <div className="col-span-1 space-y-3">
             {DOCUMENT_TEMPLATES.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-emerald-500 transition shadow-sm group">
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500">{t.type}</span>
                      <Edit size={14} className="text-gray-300 group-hover:text-emerald-500"/>
                   </div>
                   <h4 className="font-bold text-gray-800 text-sm">{t.title}</h4>
                </div>
             ))}
             <button className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-sm font-medium hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition">
                + Créer un modèle
             </button>
          </div>
          
          {/* Editor */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
             <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
                <span className="font-bold text-gray-700 text-sm">Éditeur de Modèle</span>
                <div className="flex gap-2">
                   <button className="text-xs bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-100">Aperçu</button>
                   <button className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700">Sauvegarder</button>
                </div>
             </div>
             <div className="p-4 flex-1">
                <textarea className="w-full h-full resize-none outline-none text-sm font-mono text-gray-600" defaultValue={DOCUMENT_TEMPLATES[0].content}></textarea>
             </div>
             <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Variables disponibles</p>
                <div className="flex flex-wrap gap-2">
                   {DOCUMENT_TEMPLATES[0].variables.map(v => (
                      <span key={v} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-blue-600 font-mono cursor-pointer hover:border-blue-400">
                         {`{{${v}}}`}
                      </span>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  // --- MAIN RENDER ---

  const tabs = [
    { id: 'identity', label: 'Identité Syndic', icon: Building },
    { id: 'property', label: 'Copropriété', icon: MapPin },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'templates', label: 'Modèles & Docs', icon: FileText },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
       {/* Sidebar Nav */}
       <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">Administration</h2>
          <nav className="space-y-1">
             {tabs.map(t => (
                <button
                   key={t.id}
                   onClick={() => setActiveTab(t.id as any)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                   <t.icon size={18} />
                   {t.label}
                </button>
             ))}
          </nav>
       </div>
       
       {/* Content Area */}
       <div className="flex-1">
          {activeTab === 'identity' && <IdentitySettings />}
          {activeTab === 'property' && <PropertySettings />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'notifications' && <div className="text-gray-500 p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">Module de configuration des notifications en cours...</div>}
          {activeTab === 'templates' && <TemplatesManager />}
       </div>
    </div>
  );
};


// ==================================================================================
// 🔒 COPROPRIETAIRE VIEW (MINIMALIST PROFILE)
// ==================================================================================

const CoproSettingsView: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
       <div className="flex items-center gap-4 mb-2">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
             <UserIcon size={32} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-gray-800">Mon Compte</h2>
             <p className="text-gray-500 text-sm">Gérez vos informations personnelles et vos préférences.</p>
          </div>
       </div>

       {/* 1. PERSONAL INFO */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-blue-500"/> Informations Personnelles
             </h3>
             <button className="text-sm text-emerald-600 font-medium hover:underline">Modifier</button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex items-center gap-4 md:col-span-2 pb-4 border-b border-gray-50">
                <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full border-2 border-gray-100" />
                <div>
                   <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition">
                      Changer la photo
                   </button>
                   <p className="text-[10px] text-gray-400 mt-1">JPG, PNG max 2MB</p>
                </div>
             </div>
             
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nom complet</label>
                <input type="text" value={user.name} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-not-allowed" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input type="email" value={user.email} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Téléphone</label>
                <input type="tel" value={user.phone} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Langue</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                   <option>Français</option>
                   <option>Arabe</option>
                </select>
             </div>
          </div>
       </div>

       {/* 2. NOTIFICATIONS */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Bell size={18} className="text-amber-500"/> Préférences de Notification
             </h3>
          </div>
          <div className="p-6 space-y-4">
             {[
               { label: 'Nouvel appel de fonds', desc: 'Recevoir un email quand une quittance est générée' },
               { label: 'Rappels AG', desc: 'Notifications J-7 et J-1 avant une assemblée' },
               { label: 'Informations Travaux', desc: 'Alertes sur les interventions dans l\'immeuble' },
               { label: 'Messages du Syndic', desc: 'Notification directe lors d\'un nouveau message' }
             ].map((item, idx) => (
               <div key={idx} className="flex items-center justify-between py-2">
                  <div>
                     <p className="text-sm font-medium text-gray-800">{item.label}</p>
                     <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${idx !== 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                     <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${idx !== 2 ? 'left-5.5' : 'left-0.5'}`}></div>
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* 3. SECURITY */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Shield size={18} className="text-red-500"/> Sécurité & Connexion
             </h3>
          </div>
          <div className="p-6 space-y-6">
             <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><Key size={20}/></div>
                   <div>
                      <p className="font-bold text-sm text-gray-800">Mot de passe</p>
                      <p className="text-xs text-gray-500">Dernière modification il y a 90 jours</p>
                   </div>
                </div>
                <ChevronRight size={16} className="text-gray-400"/>
             </div>
             
             <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><Smartphone size={20}/></div>
                   <div>
                      <p className="font-bold text-sm text-gray-800">Double Authentification (2FA)</p>
                      <p className="text-xs text-emerald-600 font-medium">Activée</p>
                   </div>
                </div>
                <div className="w-11 h-6 bg-emerald-500 rounded-full relative">
                   <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-5.5 shadow-sm"></div>
                </div>
             </div>

             <div className="pt-2">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Historique de connexion</p>
                <div className="space-y-3">
                   {SECURITY_LOGS.map(log => (
                      <div key={log.id} className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2 text-gray-700">
                            <History size={14} className="text-gray-400"/>
                            {log.device} <span className="text-gray-400">•</span> {log.ip}
                         </div>
                         <span className="text-gray-500 text-xs">{log.date}</span>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="pt-4 border-t border-gray-100">
                <button className="text-red-500 text-sm font-medium flex items-center gap-2 hover:underline">
                   <LogOut size={16}/> Déconnecter toutes les autres sessions
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

// ==================================================================================
// MAIN COMPONENT
// ==================================================================================

export const SettingsView: React.FC<SettingsProps> = ({ user }) => {
  return user.role === UserRole.SYNDIC 
    ? <SyndicSettingsView /> 
    : <CoproSettingsView user={user} />;
};