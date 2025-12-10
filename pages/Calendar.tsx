import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, 
  Plus, Filter, AlertCircle, CheckCircle, Wrench, Users, Wallet, 
  MoreVertical, Edit, Trash2, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CALENDAR_EVENTS, USERS } from '../services/mockData';
import { User, UserRole, CalendarEvent, EventCategory, EventImportance } from '../types';

interface CalendarProps {
  user?: User;
}

// ==================================================================================
// 🔥 SYNDIC VIEW (ADMINISTRATION - GOOGLE CALENDAR STYLE)
// ==================================================================================

const SyndicCalendarView: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // --- CALENDAR ENGINE ---
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    // Adjust for Monday start (0 = Mon in our logic)
    const startDay = firstDay === 0 ? 6 : firstDay - 1; 
    return { days, startDay };
  };

  const { days, startDay } = getDaysInMonth(currentDate);
  const totalSlots = Math.ceil((days + startDay) / 7) * 7;
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // --- EVENTS ---
  
  const events = CALENDAR_EVENTS.filter(ev => {
    if (activeFilter === 'all') return true;
    return ev.category === activeFilter;
  });

  const getEventsForDay = (day: number) => {
    const dStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return events.filter(ev => ev.startDate.startsWith(dStr));
  };

  const getCategoryColor = (cat: EventCategory) => {
    switch(cat) {
      case EventCategory.AG: return 'bg-purple-100 text-purple-700 border-purple-200';
      case EventCategory.TRAVAUX: return 'bg-blue-100 text-blue-700 border-blue-200';
      case EventCategory.INTERVENTION: return 'bg-sky-100 text-sky-700 border-sky-200';
      case EventCategory.PAIEMENT: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case EventCategory.URGENCE: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (cat: EventCategory) => {
    switch(cat) {
      case EventCategory.AG: return Users;
      case EventCategory.TRAVAUX: return Wrench;
      case EventCategory.PAIEMENT: return Wallet;
      case EventCategory.URGENCE: return AlertCircle;
      default: return CalendarIcon;
    }
  };

  // --- ACTION HANDLERS ---
  
  const handleDeepLink = (ev: CalendarEvent) => {
    if (!ev.linkType) return;
    switch(ev.linkType) {
      case 'AG': navigate('/ag'); break;
      case 'TICKET': navigate('/maintenance'); break;
      case 'INTERVENTION': navigate('/maintenance'); break;
      case 'FINANCE': navigate('/accounting'); break;
      case 'DOC': navigate('/documents'); break;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Agenda Syndic</h2>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
               <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20}/></button>
               <span className="px-4 font-bold text-gray-700 min-w-[140px] text-center">
                 {currentDate.toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'}).toUpperCase()}
               </span>
               <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20}/></button>
            </div>
         </div>
         <div className="flex gap-2">
            <select 
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
               <option value="all">Toutes catégories</option>
               <option value={EventCategory.AG}>Assemblées</option>
               <option value={EventCategory.TRAVAUX}>Travaux</option>
               <option value={EventCategory.PAIEMENT}>Paiements</option>
               <option value={EventCategory.URGENCE}>Urgences</option>
            </select>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2">
              <Plus size={16} /> Nouvel Événement
            </button>
         </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-[600px]">
         {/* MAIN CALENDAR GRID */}
         <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
               {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d => (
                 <div key={d} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                    {d}
                 </div>
               ))}
            </div>
            
            {/* Days Grid */}
            <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-gray-100 gap-px">
               {/* Empty slots */}
               {Array.from({length: startDay}).map((_, i) => (
                 <div key={`empty-${i}`} className="bg-gray-50/30"></div>
               ))}
               
               {/* Real Days */}
               {Array.from({length: days}).map((_, i) => {
                 const day = i + 1;
                 const dayEvents = getEventsForDay(day);
                 const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                 
                 return (
                   <div key={day} className="bg-white p-2 min-h-[100px] hover:bg-gray-50 transition-colors group relative">
                      <div className="flex justify-between items-start mb-1">
                         <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-emerald-600 text-white' : 'text-gray-700'}`}>
                           {day}
                         </span>
                         <button className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-emerald-500">
                           <Plus size={14} />
                         </button>
                      </div>
                      
                      <div className="space-y-1">
                         {dayEvents.map(ev => {
                           const Icon = getCategoryIcon(ev.category);
                           return (
                             <div 
                               key={ev.id} 
                               onClick={() => setSelectedEvent(ev)}
                               className={`text-[10px] px-1.5 py-1 rounded border truncate cursor-pointer hover:opacity-80 flex items-center gap-1 ${getCategoryColor(ev.category)}`}
                             >
                                <Icon size={10} className="flex-shrink-0" />
                                <span className="truncate">{ev.title}</span>
                             </div>
                           );
                         })}
                      </div>
                   </div>
                 );
               })}
               
               {/* Trailing empty slots */}
               {Array.from({length: totalSlots - (days + startDay)}).map((_, i) => (
                 <div key={`trail-${i}`} className="bg-gray-50/30"></div>
               ))}
            </div>
         </div>

         {/* SIDEBAR: UPCOMING / DETAILS */}
         <div className="w-80 flex flex-col gap-6">
            {selectedEvent ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-in slide-in-from-right duration-200">
                 <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${getCategoryColor(selectedEvent.category)}`}>
                       {React.createElement(getCategoryIcon(selectedEvent.category), {size: 20})}
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">×</button>
                 </div>
                 
                 <h3 className="font-bold text-gray-800 text-lg mb-1">{selectedEvent.title}</h3>
                 <p className="text-sm text-gray-500 mb-4">{new Date(selectedEvent.startDate).toLocaleString('fr-FR', {weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit'})}</p>
                 
                 <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4 border border-gray-100">
                    {selectedEvent.description || "Aucune description."}
                 </div>
                 
                 <div className="flex items-center gap-2 mb-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedEvent.level === EventImportance.URGENT ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                       {selectedEvent.level}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedEvent.isVisibleToOwners ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                       {selectedEvent.isVisibleToOwners ? 'Public' : 'Privé'}
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 mb-4">
                    <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                       <Edit size={14} /> Modifier
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50">
                       <Trash2 size={14} /> Supprimer
                    </button>
                 </div>
                 
                 {selectedEvent.linkId && (
                    <button 
                      onClick={() => handleDeepLink(selectedEvent)}
                      className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center justify-center gap-2"
                    >
                       Ouvrir le module <ArrowRight size={14} />
                    </button>
                 )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex-1">
                 <h3 className="font-bold text-gray-800 mb-4">Prochains Événements</h3>
                 <div className="space-y-3">
                    {CALENDAR_EVENTS.filter(e => new Date(e.startDate) >= new Date()).slice(0, 5).map(ev => (
                       <div key={ev.id} onClick={() => setSelectedEvent(ev)} className="flex gap-3 items-start p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center min-w-[3rem] bg-gray-100 rounded p-1">
                             <span className="text-xs font-bold text-gray-500 uppercase">{new Date(ev.startDate).toLocaleString('fr-FR', {month:'short'})}</span>
                             <span className="text-lg font-bold text-gray-800">{new Date(ev.startDate).getDate()}</span>
                          </div>
                          <div>
                             <p className="font-bold text-sm text-gray-800 line-clamp-1">{ev.title}</p>
                             <p className="text-xs text-gray-500">{new Date(ev.startDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${getCategoryColor(ev.category)}`}>
                               {ev.category}
                             </span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};


// ==================================================================================
// 🔒 COPROPRIETAIRE VIEW (PERSONAL AGENDA)
// ==================================================================================

const CoproCalendarView: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  
  // FILTERING LOGIC
  const myEvents = CALENDAR_EVENTS.filter(ev => {
     // 1. Must be visible to owners
     if (!ev.isVisibleToOwners) return false;
     
     // 2. Logic specific to Copro
     // - PAIEMENT: Must be general OR related to my lots
     // - TRAVAUX/AG/URGENCE: Generally public
     if (ev.category === EventCategory.PAIEMENT && ev.relatedLotIds && ev.relatedLotIds.length > 0) {
        // If relatedLotIds exists, check if user owns any of them
        const ownsLot = user.lotIds?.some(id => ev.relatedLotIds?.includes(id));
        if (!ownsLot) return false;
     }
     
     return true;
  }).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const upcomingEvents = myEvents.filter(e => new Date(e.startDate) >= new Date());

  const getEventStyle = (level: EventImportance) => {
    switch(level) {
      case EventImportance.URGENT: return 'bg-red-50 border-l-4 border-red-500';
      case EventImportance.IMPORTANT: return 'bg-amber-50 border-l-4 border-amber-500';
      default: return 'bg-white border-l-4 border-emerald-500 shadow-sm border border-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mon Agenda</h2>
            <p className="text-gray-500 text-sm">Échéances personnelles et vie de la copropriété.</p>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">{currentMonth}</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: UPCOMING LIST */}
          <div className="space-y-4">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Clock className="text-emerald-500" /> À Venir
             </h3>
             
             {upcomingEvents.length > 0 ? upcomingEvents.slice(0,5).map(ev => (
               <div key={ev.id} className={`p-4 rounded-lg ${getEventStyle(ev.level)} transition-transform hover:translate-x-1`}>
                  <div className="flex justify-between items-start mb-1">
                     <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                       <CalendarIcon size={12}/> {new Date(ev.startDate).toLocaleDateString()}
                     </span>
                     <span className="text-[10px] bg-white bg-opacity-50 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                       {ev.category}
                     </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mb-1">{ev.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ev.description}</p>
                  
                  {ev.linkId && (
                    <button 
                      onClick={() => {
                        if (ev.linkType === 'AG') navigate('/ag');
                        if (ev.linkType === 'FINANCE') navigate('/accounting');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      Voir le détail <ArrowRight size={12}/>
                    </button>
                  )}
               </div>
             )) : (
               <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-gray-500">
                  Aucun événement à venir.
               </div>
             )}
          </div>

          {/* RIGHT: SUMMARY WIDGETS */}
          <div className="space-y-6">
             {/* Payment Alert */}
             {myEvents.some(e => e.category === EventCategory.PAIEMENT && new Date(e.startDate) > new Date()) && (
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-full text-red-500">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Prochaine Échéance</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      N'oubliez pas de régler votre appel de fonds avant le 30 du mois.
                    </p>
                    <button onClick={() => navigate('/accounting')} className="mt-3 text-xs bg-red-500 text-white px-3 py-1.5 rounded font-medium hover:bg-red-600">
                      Régler maintenant
                    </button>
                  </div>
               </div>
             )}

             {/* AG Alert */}
             {myEvents.some(e => e.category === EventCategory.AG && new Date(e.startDate) > new Date()) && (
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="bg-purple-50 p-3 rounded-full text-purple-500">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Assemblée Générale</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Votre présence est importante pour les votes à venir.
                    </p>
                    <button onClick={() => navigate('/ag')} className="mt-3 text-xs bg-purple-600 text-white px-3 py-1.5 rounded font-medium hover:bg-purple-700">
                      Voir convocation
                    </button>
                  </div>
               </div>
             )}
             
             {/* Info Block */}
             <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                  <CheckCircle size={18}/> Synchronisation
                </h4>
                <p className="text-sm text-blue-700">
                  Cet agenda se met à jour automatiquement en fonction des convocations, travaux et appels de fonds émis par le syndic.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
};

// ==================================================================================
// MAIN COMPONENT
// ==================================================================================

export const CalendarView: React.FC<CalendarProps> = ({ user }) => {
  const currentUser = user || USERS[0]; // Fallback to Syndic if undefined
  
  return currentUser.role === UserRole.SYNDIC 
    ? <SyndicCalendarView /> 
    : <CoproCalendarView user={currentUser} />;
};