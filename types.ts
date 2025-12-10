

export enum UserRole {
  SYNDIC = 'SYNDIC',
  COPROPRIETAIRE = 'COPROPRIETAIRE'
}

export enum TicketStatus {
  OPEN = 'Nouveau',
  IN_PROGRESS = 'En cours',
  WAITING_PROVIDER = 'Attente Prestataire',
  RESOLVED = 'Résolu',
  CLOSED = 'Clôturé'
}

export enum TicketPriority {
  LOW = 'Basse',
  MEDIUM = 'Moyenne',
  HIGH = 'Haute',
  URGENT = 'Urgente'
}

export enum InterventionStatus {
  PLANNED = 'Planifiée',
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminée',
  CANCELLED = 'Annulée'
}

export enum PaymentStatus {
  PAID = 'Payé',
  PENDING = 'En attente',
  LATE = 'En retard',
  CANCELLED = 'Annulé'
}

// --- AG TYPES ---
export enum AGStatus {
  DRAFT = 'Brouillon',
  PLANNED = 'Planifiée', // Date fixée, pas encore envoyée
  CONVENED = 'Convoquée', // Convocations envoyées
  ONGOING = 'En cours', // Jour J
  COMPLETED = 'Terminée', // Votes clos
  CLOSED = 'Clôturée' // PV Signé et publié
}

export enum AGType {
  ORDINAIRE = 'Ordinaire',
  EXTRAORDINAIRE = 'Extraordinaire'
}

export enum VoteStatus {
  PENDING = 'En attente',
  ADOPTED = 'Adoptée',
  REJECTED = 'Rejetée'
}

export enum PresenceStatus {
  PRESENT = 'Présent',
  REPRESENTED = 'Représenté',
  ABSENT = 'Absent'
}

export interface Resolution {
  id: string;
  agId: string;
  title: string;
  description: string;
  type: 'MAJORITE_SIMPLE' | 'MAJORITE_ABSOLUE' | 'UNANIMITE';
  
  // Results
  votesFor: number;
  tantiemesFor: number;
  votesAgainst: number;
  tantiemesAgainst: number;
  votesAbstain: number;
  tantiemesAbstain: number;
  
  status: VoteStatus;
}

export interface Participant {
  id: string;
  agId: string;
  userId: string; // Link to Owner
  lotIds: string[]; // Lots represented
  totalTantiemes: number;
  status: PresenceStatus;
  proxyName?: string; // If Represented
  proxyDocUrl?: string;
}

export interface AGEvent {
  id: string;
  coproprieteId: string;
  title: string;
  type: AGType;
  date: string;
  location: string;
  description?: string;
  status: AGStatus;
  
  // Documents
  convocationUrl?: string;
  minutesUrl?: string; // PV Final
  attendanceSheetUrl?: string;
  
  // Relations
  resolutions: Resolution[];
  participants: Participant[];
}

// --- END AG TYPES ---

export enum AccountingClass {
  CLASSE_1 = 'Classe 1 - Financement Permanent',
  CLASSE_2 = 'Classe 2 - Actif Immobilisé',
  CLASSE_3 = 'Classe 3 - Actif Circulant',
  CLASSE_4 = 'Classe 4 - Passif Circulant',
  CLASSE_5 = 'Classe 5 - Trésorerie',
  CLASSE_6 = 'Classe 6 - Charges',
  CLASSE_7 = 'Classe 7 - Produits'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  // Coproprietaire specific profile fields
  isOccupant?: boolean; // true = Occupant, false = Bailleur
  correspondenceAddress?: string;
  lotIds?: string[]; // IDs of lots owned
}

export interface Copropriete {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  constructionYear?: number;
  budgetAnnuel: number;
  totalLots: number;
  bankAccount: string;
  fiscalYearStart: string; // "MM-DD"
  regulationUrl?: string;
  services?: string[]; // e.g. "Gardiennage", "Ascenseur"
}

export interface Building {
  id: string;
  coproprieteId: string;
  name: string; // "Bloc A"
  floors: number;
  description?: string;
}

export interface Lot {
  id: string;
  coproprieteId: string;
  buildingId: string; // FK to Building
  ownerId: string; // FK to User
  numero: string;
  type: 'Appartement' | 'Commerce' | 'Garage' | 'Cave';
  usage: 'Habitation' | 'Professionnel';
  etage: number;
  surface: number; // m2
  
  // Tantièmes
  tantiemesGeneraux: number; // /1000 or /10000
  tantiemesAscenseur?: number;
  tantiemesChauffage?: number;
  
  notes?: string;
}

export interface TechnicalInfo {
  id: string;
  category: string; // Ascenseur, Toiture, Incendie
  description: string;
  lastMaintenance?: string;
  providerId?: string;
  status: 'Bon' | 'Moyen' | 'Critique';
}

export interface BudgetLine {
  id: string;
  category: string;
  estimatedAmount: number;
  spentAmount: number;
  year: number;
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: string;
  status: PaymentStatus;
  userReference?: string; // Who paid or who was paid
  proofUrl?: string;
  relatedLotId?: string;
}

export interface Intervention {
  id: string;
  ticketId: string;
  providerId: string;
  datePlanned: string;
  dateRealized?: string;
  status: InterventionStatus;
  costEstimated: number;
  costReal?: number;
  description: string;
  documents?: string[]; // URLs
  syndicComment?: string;
}

export interface Ticket {
  id: string;
  coproprieteId: string;
  title: string;
  description: string;
  category: string; // ELECTRICITE, ASCENSEUR, EAU...
  priority: TicketPriority;
  status: TicketStatus;
  
  authorId: string;
  authorName: string; // De-normalized for display
  lotId?: string; // Optional if general incident
  
  dateCreated: string;
  dateResolved?: string;
  
  isPublic: boolean; // Visible to all owners?
  
  photos?: string[];
  
  // Linked Intervention
  interventionId?: string;
}

export interface Contract {
  id: string;
  providerId: string;
  startDate: string;
  endDate: string;
  amount: number;
  description: string;
  documentUrl?: string;
  status: 'Actif' | 'Expiré' | 'Résilié';
}

export interface Provider {
  id: string;
  name: string;
  serviceType: string; // Plomberie, Electricité, Sécurité...
  email: string;
  phone: string;
  address?: string;
  rating: number; // 0-5
  status: 'Actif' | 'Inactif';
  interventionsCount: number;
  documents?: string[];
}

export enum DocumentType {
  // AG
  PV_AG = 'PV Assemblée Générale',
  CONVOCATION_AG = 'Convocation AG',
  ANNEXE_AG = 'Annexe AG',
  
  // Finance
  BUDGET = 'Budget',
  RELEVE_COMPTABLE = 'Relevé Comptable Global',
  ETAT_IMPAYES = 'État des Impayés',
  
  // Providers
  CONTRAT_PRESTATAIRE = 'Contrat Prestataire',
  FACTURE_PRESTATAIRE = 'Facture Prestataire',
  DEVIS = 'Devis',
  
  // Legal
  DOCUMENT_JURIDIQUE = 'Document Juridique',
  REGLEMENT_COPROPRIETE = 'Règlement de Copropriété',
  REGLEMENT_INTERIEUR = 'Règlement Intérieur',
  
  // Comms
  NOTE_OFFICIELLE = 'Note Officielle',
  COMMUNICATION_IMPORTANTE = 'Communication Importante',
  
  // Tech
  RAPPORT_TECHNIQUE = 'Rapport Technique',
  
  // Misc
  AUTRE_PUBLIC = 'Autre (Public)',
  AUTRE_INTERNE = 'Autre (Interne)',
  
  // Personal
  RELEVE_COMPTABLE_PERSO = 'Mon Relevé de Compte',
  RECU_PAIEMENT_PERSO = 'Reçu de Paiement'
}

export interface Document {
  id: string;
  coproprieteId: string;
  uploadedByUserId: string;
  type: DocumentType;
  title: string;
  description?: string;
  
  url: string;
  size: string;
  
  dateUpload: string;
  dateDocument?: string;
  
  isVisibleToOwners: boolean;
  
  // Relations (Foreign Keys)
  agId?: string;
  providerId?: string;
  interventionId?: string;
  lotId?: string;
  ownerId?: string; // For personal docs
}

// --- COMMUNICATION ---

export enum MessageType {
  ANNONCE = 'Annonce',
  MESSAGE_CIBLE = 'Message Ciblé',
  MESSAGE_PRIVE = 'Message Privé',
  SYSTEME = 'Système'
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  subject: string;
  content: string;
  variables: string[]; // e.g. {{nom}}, {{date}}
}

export interface Message {
  id: string;
  coproprieteId: string;
  
  senderUserId: string;
  receiverUserId?: string; // Optional for broadcasts
  
  type: MessageType;
  
  title: string; // Subject
  content: string;
  attachmentUrl?: string;
  
  dateSent: string;
  readBy: string[]; // User IDs who have read the message
  
  // Targeting metadata
  targetBuildingId?: string; // For filtered broadcasts
  isVisibleToOwners: boolean;
}

// --- CALENDAR (AGENDA) ---

export enum EventCategory {
  AG = 'AG',
  TRAVAUX = 'Travaux',
  INTERVENTION = 'Intervention',
  PAIEMENT = 'Paiement', // E.g. échéances
  URGENCE = 'Urgence',
  AUTRE = 'Autre'
}

export enum EventImportance {
  NORMAL = 'Normal',
  IMPORTANT = 'Important',
  URGENT = 'Urgent'
}

export interface CalendarEvent {
  id: string;
  coproprieteId: string;
  category: EventCategory;
  title: string;
  description?: string;
  
  startDate: string; // ISO String
  endDate?: string;
  
  level: EventImportance;
  isVisibleToOwners: boolean;
  
  // Deep Linking
  linkType?: 'AG' | 'TICKET' | 'INTERVENTION' | 'FINANCE' | 'DOC';
  linkId?: string;
  
  // Filtering
  relatedLotIds?: string[]; // If specific to certain owners
}

// --- END CALENDAR ---

// --- SETTINGS ---

export interface SyndicProfile {
  id: string;
  userId: string;
  companyName: string; // "Cabinet Expert Immo"
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  rib: string; // For official docs
  signatureUrl?: string;
}

export interface CoproprieteSettings {
  id: string;
  coproprieteId: string;
  currency: 'MAD';
  language: 'FR' | 'AR';
  fiscalYearStart: string; // "01-01"
  fiscalYearEnd: string; // "12-31"
  penaltyRate: number; // e.g. 5%
  autoPublishDocuments: boolean;
}

export interface NotificationSettings {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean; // If supported
  alertTypes: {
    urgent: boolean;
    payment: boolean;
    work: boolean;
    ag: boolean;
  };
}

export interface SecurityLog {
  id: string;
  date: string;
  device: string;
  ip: string;
  status: 'Success' | 'Failed';
}

export interface DocumentTemplate {
  id: string;
  type: 'PV_AG' | 'CONVOCATION' | 'RELANCE' | 'NOTE';
  title: string;
  content: string; // HTML or Markdown
  variables: string[]; // available variables
}

// --- END SETTINGS ---

export interface NavItem {
  label: string;
  icon: any;
  path: string;
  roles: UserRole[];
}

export interface AccountingAccount {
  code: string;
  name: string;
  class: AccountingClass;
  type: 'DEBIT' | 'CREDIT';
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  accountCode: string;
  debit: number;
  credit: number;
  reference?: string;
}