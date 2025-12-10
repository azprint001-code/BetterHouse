import React from 'react';
import { Building, MapPin, Ruler, Users, Calendar, AlertCircle, FileText, Download } from 'lucide-react';
import { COPROPRIETE, LOTS, AG_EVENTS, TICKETS } from '../services/mockData';
import { User, UserRole } from '../types';

export const PropertyView: React.FC = () => (
  <div className="space-y-6">
    {/* Header Info */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{COPROPRIETE.name}</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-2">
            <MapPin size={16} />
            <span>{COPROPRIETE.address}, {COPROPRIETE.city}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Compte Bancaire</p>
          <p className="font-mono text-gray-800 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-200 mt-1">
            {COPROPRIETE.bankAccount}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Lots</p>
          <p className="text-xl font-bold text-gray-800">{COPROPRIETE.totalLots}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Budget Annuel</p>
          <p className="text-xl font-bold text-gray-800">{COPROPRIETE.budgetAnnuel.toLocaleString()} MAD</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Assurance</p>
          <p className="text-xl font-bold text-emerald-600">Active</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Exercice</p>
          <p className="text-xl font-bold text-gray-800">2023-2024</p>
        </div>
      </div>
    </div>

    {/* Lots Grid */}
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Liste des Lots Privatifs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LOTS.map(lot => (
          <div key={lot.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">{lot.type}</span>
              <span className="text-gray-400 text-sm">Etg {lot.etage}</span>
            </div>
            <h4 className="text-lg font-bold text-gray-800">Lot {lot.numero}</h4>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Ruler size={14} /> {lot.surface} m²
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} /> {lot.tantiemesGeneraux}/1000
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AGView: React.FC<{ user: User }> = ({ user }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">Assemblées Générales</h2>
      {user.role === UserRole.SYNDIC && (
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
          Nouvelle Convocation
        </button>
      )}
    </div>

    <div className="space-y-4">
      {AG_EVENTS.map(ag => (
        <div key={ag.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg flex flex-col items-center justify-center w-16 h-16">
              <span className="text-xs font-bold uppercase">{new Date(ag.date).toLocaleString('fr-FR', { month: 'short' })}</span>
              <span className="text-xl font-bold">{new Date(ag.date).getDate()}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{ag.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar size={14} /> {new Date(ag.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} /> {ag.location}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border
              ${ag.status === 'Planifiée' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
            `}>
              {ag.status}
            </span>
            <button className="text-gray-400 hover:text-emerald-600 border p-2 rounded-lg hover:bg-gray-50">
              <Download size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MaintenanceView: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Incidents & Maintenance</h2>
    
    <div className="grid gap-4">
      {TICKETS.map(ticket => (
        <div key={ticket.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="mt-1">
                <AlertCircle className="text-amber-500" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">{ticket.title}</h4>
                <p className="text-gray-600 mt-1">{ticket.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">{ticket.category}</span>
                  <span className="text-xs text-gray-400">Ouvert le {ticket.dateCreated} par {ticket.authorName}</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
              ${ticket.priority === 'Urgente' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}
            `}>
              {ticket.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);