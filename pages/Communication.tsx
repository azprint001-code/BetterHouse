

import React, { useState } from 'react';
import { 
  Mail, Send, Bell, User as UserIcon, MessageSquare, Megaphone, 
  Target, FileText, BarChart2, Plus, Search, Filter, Paperclip, 
  CheckCircle, Check, Eye, Trash2, Edit
} from 'lucide-react';
import { MESSAGES, USERS, COMMUNICATION_TEMPLATES, BUILDINGS } from '../services/mockData';
import { User, UserRole, Message, MessageType, CommunicationTemplate } from '../types';

interface CommProps {
  user: User;
}

// ==================================================================================
// 🔥 SYNDIC VIEW (FULL COMMAND CENTER)
// ==================================================================================

const SyndicCommunicationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'broadcast' | 'templates' | 'analytics'>('inbox');
  const [selectedConversationUser, setSelectedConversationUser] = useState<string | null>(null);
  const [showNewBroadcastForm, setShowNewBroadcastForm] = useState(false);

  // --- 1. MESSAGERIE 1-1 ---
  
  // Group messages by user (Simulating threads)
  // Only Private messages sent to/from syndic
  const privateMessages = MESSAGES.filter(m => m.type === MessageType.MESSAGE_PRIVE);
  
  // Get list of users who have chatted
  const chatUsers = Array.from(new Set([
    ...privateMessages.map(m => m.senderUserId === 'u1' ? m.receiverUserId : m.senderUserId)
  ])).filter(uid => uid && uid !== 'u1'); // Exclude syndic himself

  const selectedUserMessages = selectedConversationUser 
    ? privateMessages.filter(m => (m.senderUserId === selectedConversationUser && m.receiverUserId === 'u1') || (m.senderUserId === 'u1' && m.receiverUserId === selectedConversationUser)).sort((a,b) => new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime())
    : [];

  const InboxView = () => (
    <div className="flex h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
         <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">Messagerie Privée</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
              <input type="text" placeholder="Rechercher un copropriétaire..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"/>
            </div>
         </div>
         <div className="overflow-y-auto flex-1">
            {chatUsers.map(uid => {
               const u = USERS.find(user => user.id === uid);
               if (!u) return null;
               // Last message
               const lastMsg = privateMessages.filter(m => m.senderUserId === uid || m.receiverUserId === uid).sort((a,b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime())[0];
               const isSelected = selectedConversationUser === uid;
               
               return (
                 <div 
                    key={uid} 
                    onClick={() => setSelectedConversationUser(uid as string)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors flex gap-3 ${isSelected ? 'bg-white border-l-4 border-l-emerald-500 shadow-sm' : ''}`}
                 >
                    <img src={u.avatarUrl} className="w-10 h-10 rounded-full border border-gray-200" />
                    <div className="flex-1 overflow-hidden">
                       <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-gray-800 truncate">{u.name}</h4>
                          <span className="text-[10px] text-gray-400">{new Date(lastMsg.dateSent).toLocaleDateString()}</span>
                       </div>
                       <p className="text-xs text-gray-500 truncate mt-1">{lastMsg.content}</p>
                    </div>
                 </div>
               );
            })}
            {chatUsers.length === 0 && (
               <div className="p-8 text-center text-gray-400 text-sm">Aucune conversation active</div>
            )}
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
         {selectedConversationUser ? (
           <>
             {/* Header */}
             <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                   <img src={USERS.find(u => u.id === selectedConversationUser)?.avatarUrl} className="w-10 h-10 rounded-full" />
                   <div>
                      <h3 className="font-bold text-gray-800">{USERS.find(u => u.id === selectedConversationUser)?.name}</h3>
                      <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> En ligne</p>
                   </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20}/></button>
             </div>
             
             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedUserMessages.map(msg => {
                   const isMe = msg.senderUserId === 'u1';
                   return (
                     <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-xl shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                           <p className="text-sm">{msg.content}</p>
                           <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                              {new Date(msg.dateSent).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                              {isMe && <span className="ml-1">✓✓</span>}
                           </div>
                        </div>
                     </div>
                   );
                })}
             </div>
             
             {/* Input */}
             <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                   <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><Paperclip size={20}/></button>
                   <input type="text" placeholder="Écrivez votre message..." className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                   <button className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition"><Send size={20}/></button>
                </div>
             </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Sélectionnez une conversation pour commencer</p>
           </div>
         )}
      </div>
    </div>
  );

  // --- 2. BROADCAST CENTER ---
  
  const BroadcastView = () => (
    <div className="space-y-6">
       {/* Actions */}
       <div className="flex justify-between items-center bg-emerald-50 p-6 rounded-xl border border-emerald-100">
          <div>
             <h3 className="font-bold text-emerald-900 text-lg">Centre de Diffusion</h3>
             <p className="text-emerald-700 text-sm mt-1">Envoyez des annonces groupées ou ciblées à vos copropriétaires.</p>
          </div>
          <button 
            onClick={() => setShowNewBroadcastForm(true)} 
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2"
          >
             <Megaphone size={18} /> Nouvelle Annonce
          </button>
       </div>

       {/* Form Overlay */}
       {showNewBroadcastForm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-xl text-gray-800">Nouvelle Diffusion</h3>
                  <button onClick={() => setShowNewBroadcastForm(false)} className="text-gray-400 hover:text-gray-600">Fermer</button>
               </div>
               
               <div className="p-6 overflow-y-auto space-y-6">
                  {/* Target Selector */}
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Cible du message</label>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-500">
                           <input type="radio" name="target" className="text-emerald-600" defaultChecked />
                           <span className="text-sm font-medium">Tout le monde</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-500">
                           <input type="radio" name="target" className="text-emerald-600" />
                           <span className="text-sm font-medium">Par Bâtiment</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-500">
                           <input type="radio" name="target" className="text-emerald-600" />
                           <span className="text-sm font-medium">Débiteurs (Retard)</span>
                        </label>
                     </div>
                     <div className="mt-3">
                        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                           <option>Sélectionnez un bâtiment...</option>
                           {BUILDINGS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                     </div>
                  </div>

                  {/* Template Selector */}
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Utiliser un modèle</label>
                     <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50">
                        <option value="">-- Aucun modèle --</option>
                        {COMMUNICATION_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                     </select>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Sujet</label>
                        <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Ex: Coupure d'eau prévue..."/>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                        <textarea rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Votre message ici..."></textarea>
                        <p className="text-xs text-gray-400 mt-1">Variables disponibles: {'{{nom}}'}, {'{{lot}}'}, {'{{solde}}'}</p>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pièce jointe</label>
                        <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                     </div>
                  </div>
               </div>
               
               <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                  <button onClick={() => setShowNewBroadcastForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">Annuler</button>
                  <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2">
                    <Send size={16} /> Envoyer la diffusion
                  </button>
               </div>
            </div>
         </div>
       )}

       {/* Active Broadcasts List */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
             <h3 className="font-bold text-gray-800">Historique des Diffusions</h3>
          </div>
          <table className="w-full text-left">
             <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sujet</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cible</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Taux d'ouverture</th>
                   <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {MESSAGES.filter(m => m.type === MessageType.ANNONCE || m.type === MessageType.MESSAGE_CIBLE).map(msg => (
                   <tr key={msg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                         <p className="font-bold text-sm text-gray-800">{msg.title}</p>
                         <p className="text-xs text-gray-500 truncate max-w-xs">{msg.content}</p>
                      </td>
                      <td className="px-6 py-4">
                         {msg.type === MessageType.ANNONCE ? (
                           <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">Global</span>
                         ) : (
                           <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                              <Target size={12}/> {msg.targetBuildingId ? `Bâtiment ${BUILDINGS.find(b => b.id === msg.targetBuildingId)?.name}` : 'Ciblé'}
                           </span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(msg.dateSent).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex flex-col items-center">
                            <span className="font-bold text-emerald-600">85%</span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                               <div className="h-full bg-emerald-500 w-[85%]"></div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-gray-400 hover:text-emerald-600 p-2"><Eye size={16}/></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  // --- 3. TEMPLATES MANAGER ---

  const TemplatesView = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMMUNICATION_TEMPLATES.map(tpl => (
           <div key={tpl.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-300 transition group relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                 <button className="p-1.5 bg-gray-100 hover:bg-white rounded text-gray-500"><Edit size={14}/></button>
                 <button className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-500"><Trash2 size={14}/></button>
              </div>
              <div className="mb-4">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-3">
                    <FileText size={20} />
                 </div>
                 <h4 className="font-bold text-gray-800">{tpl.title}</h4>
                 <p className="text-sm text-gray-500 mt-1">Sujet : {tpl.subject}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 font-mono mb-4 line-clamp-3">
                 {tpl.content}
              </div>
              <div className="flex flex-wrap gap-2">
                 {tpl.variables.map(v => (
                    <span key={v} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-500 font-medium">
                       {'{' + v + '}'}
                    </span>
                 ))}
              </div>
           </div>
        ))}
        
        <button className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 transition p-6 min-h-[250px]">
           <Plus size={32} className="mb-2"/>
           <span className="font-bold">Créer un modèle</span>
        </button>
     </div>
  );

  // --- MAIN RENDER ---
  const MoreVertical = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Communication</h2>
            <p className="text-gray-500 text-sm">Centre de messagerie et de diffusion.</p>
          </div>
       </div>

       {/* Navigation Tabs */}
       <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full max-w-2xl">
          {[
            {id: 'inbox', label: 'Messagerie 1-1', icon: MessageSquare},
            {id: 'broadcast', label: 'Diffusions & Annonces', icon: Megaphone},
            {id: 'templates', label: 'Modèles', icon: FileText},
            {id: 'analytics', label: 'Statistiques', icon: BarChart2}
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <tab.icon size={16}/> {tab.label}
            </button>
          ))}
       </div>

       <div className="mt-6">
          {activeTab === 'inbox' && <InboxView />}
          {activeTab === 'broadcast' && <BroadcastView />}
          {activeTab === 'templates' && <TemplatesView />}
          {activeTab === 'analytics' && <div className="text-center py-20 text-gray-400">Module Analytics en cours de développement...</div>}
       </div>
    </div>
  );
};


// ==================================================================================
// 🔒 COPROPRIETAIRE VIEW (SECURE INBOX)
// ==================================================================================

const CoproCommunicationView: React.FC<CommProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'private'>('announcements');

  // --- FILTERING LOGIC (SECURITY) ---
  // 1. Announcements: type = ANNONCE or MESSAGE_CIBLE (where target matches user building)
  // 2. Private: sender or receiver is user
  
  const userBuildingId = 'b_A'; // Mock: Assume user is in Building A (In real app, derive from user.lotIds -> lots -> buildingId)
  
  const announcements = MESSAGES.filter(m => 
    (m.type === MessageType.ANNONCE) || 
    (m.type === MessageType.MESSAGE_CIBLE && (!m.targetBuildingId || m.targetBuildingId === userBuildingId))
  ).sort((a,b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime());

  const privateMsgs = MESSAGES.filter(m => 
    (m.type === MessageType.MESSAGE_PRIVE || m.type === MessageType.SYSTEME) && 
    (m.senderUserId === user.id || m.receiverUserId === user.id)
  ).sort((a,b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-slate-900 text-white p-8">
             <h2 className="text-2xl font-bold flex items-center gap-3">
               <Mail className="text-emerald-400" /> Ma Boîte de Réception
             </h2>
             <p className="text-slate-400 mt-2">
               Recevez les informations officielles et échangez directement avec votre syndic.
             </p>
          </div>
          
          <div className="flex border-b border-gray-200">
             <button 
               onClick={() => setActiveTab('announcements')}
               className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'announcements' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/10' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
             >
               Annonces Officielles
             </button>
             <button 
               onClick={() => setActiveTab('private')}
               className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'private' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/10' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
             >
               Mes Messages Privés
             </button>
          </div>

          <div className="p-0 min-h-[400px] bg-gray-50">
             {activeTab === 'announcements' && (
                <div className="divide-y divide-gray-200">
                   {announcements.map(msg => (
                      <div key={msg.id} className="p-6 bg-white hover:bg-gray-50 transition">
                         <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${msg.type === MessageType.ANNONCE ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                               {msg.type === MessageType.ANNONCE ? 'Information Globale' : 'Information Ciblée'}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(msg.dateSent).toLocaleDateString()}</span>
                         </div>
                         <h3 className="font-bold text-gray-800 text-lg mb-2">{msg.title}</h3>
                         <div className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {msg.content}
                         </div>
                      </div>
                   ))}
                   {announcements.length === 0 && (
                      <div className="p-12 text-center text-gray-400">Aucune annonce récente.</div>
                   )}
                </div>
             )}

             {activeTab === 'private' && (
                <div className="flex flex-col h-[500px]">
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {privateMsgs.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                           <MessageSquare size={48} className="mx-auto mb-2 opacity-20"/>
                           <p>Aucun message. Démarrez une conversation avec le syndic ci-dessous.</p>
                        </div>
                      ) : (
                        privateMsgs.map(msg => {
                           const isMe = msg.senderUserId === user.id;
                           return (
                              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[80%] rounded-xl p-4 shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                    {!isMe && <p className="text-xs font-bold text-gray-400 mb-1">{msg.senderUserId === 'system' ? 'Système' : 'Syndic'}</p>}
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-[10px] mt-2 text-right ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                                       {new Date(msg.dateSent).toLocaleDateString()} {new Date(msg.dateSent).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </p>
                                 </div>
                              </div>
                           );
                        })
                      )}
                   </div>
                   
                   {/* Reply Area */}
                   <div className="p-4 bg-white border-t border-gray-200">
                      <p className="text-xs text-gray-400 mb-2 ml-1">Écrire au Syndic</p>
                      <div className="flex gap-2">
                         <input type="text" placeholder="Tapez votre message..." className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                         <button className="bg-emerald-600 text-white px-6 rounded-lg hover:bg-emerald-700 transition shadow-sm font-medium">Envoyer</button>
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

// ==================================================================================
// MAIN COMPONENT
// ==================================================================================

export const CommunicationView: React.FC<CommProps> = ({ user }) => {
  return user.role === UserRole.SYNDIC 
    ? <SyndicCommunicationView /> 
    : <CoproCommunicationView user={user} />;
};
