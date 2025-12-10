

import { User, UserRole, Copropriete, Building, Lot, TechnicalInfo, FinancialRecord, PaymentStatus, Ticket, TicketStatus, TicketPriority, AGEvent, AGStatus, AGType, VoteStatus, PresenceStatus, Provider, Document, DocumentType, Message, MessageType, CommunicationTemplate, BudgetLine, JournalEntry, AccountingAccount, AccountingClass, Contract, Intervention, InterventionStatus, CalendarEvent, EventCategory, EventImportance, SyndicProfile, CoproprieteSettings, NotificationSettings, DocumentTemplate, SecurityLog } from '../types';

export const CURRENT_COPRO_ID = 'copro_1';

// --- PLAN COMPTABLE SYNDIC MAROC ---
// Based on official Plan Comptable for Syndics
export const PLAN_COMPTABLE_SYNDIC: AccountingAccount[] = [
  // CLASSE 1: FINANCEMENT PERMANENT
  { code: '1111', name: 'Fonds de roulement', class: AccountingClass.CLASSE_1, type: 'CREDIT' },
  { code: '1112', name: 'Fonds de réserve pour travaux', class: AccountingClass.CLASSE_1, type: 'CREDIT' },
  
  // CLASSE 3: ACTIF CIRCULANT (CRÉANCES)
  { code: '3421', name: 'Copropriétaires - Charges à recevoir', class: AccountingClass.CLASSE_3, type: 'DEBIT' },
  { code: '3422', name: 'Copropriétaires - Travaux à recevoir', class: AccountingClass.CLASSE_3, type: 'DEBIT' },
  { code: '3425', name: 'Copropriétaires - Avances sur charges', class: AccountingClass.CLASSE_3, type: 'CREDIT' }, // Often Credit
  { code: '3481', name: 'Débiteurs divers', class: AccountingClass.CLASSE_3, type: 'DEBIT' },

  // CLASSE 4: PASSIF CIRCULANT (DETTES)
  { code: '4411', name: 'Fournisseurs', class: AccountingClass.CLASSE_4, type: 'CREDIT' },
  { code: '4432', name: 'Rémunérations dues (Personnel)', class: AccountingClass.CLASSE_4, type: 'CREDIT' },
  { code: '4441', name: 'État - Impôts et taxes', class: AccountingClass.CLASSE_4, type: 'CREDIT' },
  { code: '4481', name: 'Créditeurs divers', class: AccountingClass.CLASSE_4, type: 'CREDIT' },

  // CLASSE 5: TRÉSORERIE
  { code: '5141', name: 'Banque', class: AccountingClass.CLASSE_5, type: 'DEBIT' },
  { code: '5161', name: 'Caisse', class: AccountingClass.CLASSE_5, type: 'DEBIT' },

  // CLASSE 6: CHARGES
  { code: '6111', name: 'Achats de fournitures consommables', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6121', name: 'Entretien et réparations (Ascenseur, etc.)', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6122', name: 'Assurances', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6131', name: 'Rémunération du syndic', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6132', name: 'Honoraires divers', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6141', name: 'Frais postaux et télécoms', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6142', name: 'Services bancaires', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6161', name: 'Gardiennage et nettoyage', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6171', name: 'Salaires et traitements', class: AccountingClass.CLASSE_6, type: 'DEBIT' },
  { code: '6581', name: 'Charges exceptionnelles', class: AccountingClass.CLASSE_6, type: 'DEBIT' },

  // CLASSE 7: PRODUITS (PROVISIONS)
  { code: '7111', name: 'Provisions sur charges courantes', class: AccountingClass.CLASSE_7, type: 'CREDIT' },
  { code: '7112', name: 'Provisions pour travaux', class: AccountingClass.CLASSE_7, type: 'CREDIT' },
  { code: '7121', name: 'Produits divers (Location parties communes)', class: AccountingClass.CLASSE_7, type: 'CREDIT' },
  { code: '7381', name: 'Intérêts bancaires et produits financiers', class: AccountingClass.CLASSE_7, type: 'CREDIT' },
  { code: '7581', name: 'Produits exceptionnels', class: AccountingClass.CLASSE_7, type: 'CREDIT' }
];


// --- JOURNAL ENTRIES (LIVRE JOURNAL) ---
// Simulating a Fiscal Year 2023 with specific Moroccan accounting flows
export const JOURNAL_ENTRIES: JournalEntry[] = [
  // 1. Initial State / Ranouveau
  { id: 'j1', date: '2023-01-01', description: 'Report à nouveau', accountCode: '5141', debit: 45000, credit: 0, reference: 'RAN' },
  { id: 'j2', date: '2023-01-01', description: 'Report à nouveau', accountCode: '1111', debit: 0, credit: 45000, reference: 'RAN' },

  // 2. Budget Vote & Appel de Fonds T1 (Engagement)
  { id: 'j3', date: '2023-01-05', description: 'Appel de fonds T1 2023 - Tous Copro', accountCode: '3421', debit: 112500, credit: 0, reference: 'AF-T1-23' },
  { id: 'j4', date: '2023-01-05', description: 'Appel de fonds T1 2023 - Provision', accountCode: '7111', debit: 0, credit: 112500, reference: 'AF-T1-23' },

  // 3. Payments Received
  { id: 'j5', date: '2023-01-10', description: 'Virement M. Alami (Lot A1) - T1', accountCode: '5141', debit: 4500, credit: 0, reference: 'VIR-001' },
  { id: 'j6', date: '2023-01-10', description: 'Virement M. Alami (Lot A1) - T1', accountCode: '3421', debit: 0, credit: 4500, reference: 'VIR-001' },
  
  { id: 'j7', date: '2023-01-12', description: 'Chèque Mme Bennani (Lot A2) - T1', accountCode: '5141', debit: 4800, credit: 0, reference: 'CHQ-889' },
  { id: 'j8', date: '2023-01-12', description: 'Chèque Mme Bennani (Lot A2) - T1', accountCode: '3421', debit: 0, credit: 4800, reference: 'CHQ-889' },

  // 4. Expenses (Charges)
  // Facture Lydec (Eau/Elec)
  { id: 'j9', date: '2023-01-28', description: 'Facture Lydec Janvier', accountCode: '6141', debit: 3200, credit: 0, reference: 'FAC-LYD-01' },
  { id: 'j10', date: '2023-01-28', description: 'Facture Lydec Janvier', accountCode: '4411', debit: 0, credit: 3200, reference: 'FAC-LYD-01' },
  
  // Payment Lydec
  { id: 'j11', date: '2023-01-30', description: 'Paiement Lydec Janvier', accountCode: '4411', debit: 3200, credit: 0, reference: 'VIR-LYD-01' },
  { id: 'j12', date: '2023-01-30', description: 'Paiement Lydec Janvier', accountCode: '5141', debit: 0, credit: 3200, reference: 'VIR-LYD-01' },

  // Gardiennage (Atlas Securité)
  { id: 'j13', date: '2023-01-31', description: 'Prestation Gardiennage Jan', accountCode: '6161', debit: 8000, credit: 0, reference: 'FAC-ATL-01' },
  { id: 'j14', date: '2023-01-31', description: 'Prestation Gardiennage Jan', accountCode: '4411', debit: 0, credit: 8000, reference: 'FAC-ATL-01' },

  // Payment Gardiennage
  { id: 'j15', date: '2023-02-05', description: 'Paiement Atlas Sécurité', accountCode: '4411', debit: 8000, credit: 0, reference: 'VIR-ATL-01' },
  { id: 'j16', date: '2023-02-05', description: 'Paiement Atlas Sécurité', accountCode: '5141', debit: 0, credit: 8000, reference: 'VIR-ATL-01' },

  // Maintenance Ascenseur (Otis)
  { id: 'j17', date: '2023-02-15', description: 'Maintenance Ascenseur T1', accountCode: '6121', debit: 6500, credit: 0, reference: 'FAC-OTI-01' },
  { id: 'j18', date: '2023-02-15', description: 'Maintenance Ascenseur T1', accountCode: '5141', debit: 0, credit: 6500, reference: 'VIR-OTI-01' }, // Direct payment

  // --- TRAVAUX EXCEPTIONNELS (APPEL & DEPENSE) ---
  // Appel Travaux Étanchéité
  { id: 'j19', date: '2023-06-01', description: 'Appel Travaux Étanchéité', accountCode: '3422', debit: 50000, credit: 0, reference: 'AF-TRV-01' },
  { id: 'j20', date: '2023-06-01', description: 'Appel Travaux Étanchéité', accountCode: '7112', debit: 0, credit: 50000, reference: 'AF-TRV-01' },

  // Paiement Prestataire Travaux (Advance)
  { id: 'j21', date: '2023-06-20', description: 'Acompte Travaux Toiture', accountCode: '4411', debit: 25000, credit: 0, reference: 'ACP-TRV' },
  { id: 'j22', date: '2023-06-20', description: 'Acompte Travaux Toiture', accountCode: '5141', debit: 0, credit: 25000, reference: 'ACP-TRV' },
];

// --- USERS ---
export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Cabinet Admin Syndic',
    email: 'contact@betterhouse.ma',
    phone: '+212 600 000 000',
    role: UserRole.SYNDIC,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'u2',
    name: 'M. Karim Alami',
    email: 'karim.alami@email.ma',
    phone: '+212 661 123 456',
    role: UserRole.COPROPRIETAIRE,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lotIds: ['l1', 'l4'],
    isOccupant: true,
    correspondenceAddress: '145 Bd Mohamed V, Apt A1'
  },
  {
    id: 'u3',
    name: 'Mme. Sarah Bennani',
    email: 'sarah.b@email.ma',
    phone: '+212 663 999 888',
    role: UserRole.COPROPRIETAIRE,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lotIds: ['l2', 'l5'],
    isOccupant: false, // Bailleur
    correspondenceAddress: '12 Rue des Fleurs, Rabat'
  },
  {
    id: 'u4',
    name: 'Société Tech Maroc',
    email: 'finance@techmaroc.ma',
    phone: '+212 522 44 44 44',
    role: UserRole.COPROPRIETAIRE,
    avatarUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lotIds: ['l3'],
    isOccupant: true,
    correspondenceAddress: 'Siège Social, Zone Indus'
  }
];

// --- COPROPRIETE ---
export const COPROPRIETE: Copropriete = {
  id: 'copro_1',
  name: 'Résidence Les Jardins de l\'Atlas',
  address: '145 Bd Mohamed V',
  city: 'Casablanca',
  description: 'Résidence de standing sécurisée avec espaces verts.',
  constructionYear: 2015,
  budgetAnnuel: 450000,
  totalLots: 24,
  bankAccount: 'MA64 007 888 1234567890123456',
  fiscalYearStart: '01-01',
  services: ['Gardiennage 24/7', 'Jardinier', 'Ascenseur', 'Parking sous-sol'],
  regulationUrl: '#'
};

// --- BATIMENTS ---
export const BUILDINGS: Building[] = [
  { id: 'b_A', coproprieteId: 'copro_1', name: 'Bloc A', floors: 5, description: 'Bâtiment principal sur rue' },
  { id: 'b_B', coproprieteId: 'copro_1', name: 'Bloc B', floors: 4, description: 'Bâtiment arrière cour' },
  { id: 'b_P', coproprieteId: 'copro_1', name: 'Parking', floors: 1, description: 'Sous-sol commun' }
];

// --- LOTS ---
export const LOTS: Lot[] = [
  { 
    id: 'l1', coproprieteId: 'copro_1', buildingId: 'b_A', ownerId: 'u2', 
    numero: 'A1', type: 'Appartement', usage: 'Habitation', etage: 1, surface: 85, 
    tantiemesGeneraux: 45, tantiemesAscenseur: 50 
  },
  { 
    id: 'l2', coproprieteId: 'copro_1', buildingId: 'b_A', ownerId: 'u3', 
    numero: 'A2', type: 'Appartement', usage: 'Habitation', etage: 1, surface: 90, 
    tantiemesGeneraux: 48, tantiemesAscenseur: 50 
  },
  { 
    id: 'l3', coproprieteId: 'copro_1', buildingId: 'b_B', ownerId: 'u4', 
    numero: 'B1', type: 'Commerce', usage: 'Professionnel', etage: 0, surface: 120, 
    tantiemesGeneraux: 80, tantiemesAscenseur: 10 
  },
  { 
    id: 'l4', coproprieteId: 'copro_1', buildingId: 'b_P', ownerId: 'u2', 
    numero: 'P12', type: 'Garage', usage: 'Habitation', etage: -1, surface: 15, 
    tantiemesGeneraux: 5, tantiemesAscenseur: 0 
  },
  { 
    id: 'l5', coproprieteId: 'copro_1', buildingId: 'b_A', ownerId: 'u3', 
    numero: 'A5', type: 'Appartement', usage: 'Habitation', etage: 3, surface: 100, 
    tantiemesGeneraux: 55, tantiemesAscenseur: 60 
  },
];

// --- DOSSIERS TECHNIQUES ---
export const TECHNICAL_INFOS: TechnicalInfo[] = [
  { id: 't1', category: 'Ascenseur', description: 'Otis Gen2 - Bloc A', lastMaintenance: '2023-11-01', providerId: 'p3', status: 'Bon' },
  { id: 't2', category: 'Sécurité', description: 'Système Incendie Parking', lastMaintenance: '2023-06-15', providerId: 'p1', status: 'Moyen' },
  { id: 't3', category: 'Toiture', description: 'Étanchéité terrasse Bloc B', lastMaintenance: '2020-09-10', status: 'Critique' },
];

// --- BUDGET (PREVISIONNEL) ---
// Based on Annex 5 (Budget Voté)
export const BUDGET_LINES: BudgetLine[] = [
  { id: 'b1', category: 'Sécurité & Gardiennage', estimatedAmount: 120000, spentAmount: 110000, year: 2023 },
  { id: 'b2', category: 'Nettoyage & Entretien', estimatedAmount: 60000, spentAmount: 58000, year: 2023 },
  { id: 'b3', category: 'Eau & Électricité (Commun)', estimatedAmount: 45000, spentAmount: 48000, year: 2023 },
  { id: 'b4', category: 'Maintenance Ascenseur', estimatedAmount: 25000, spentAmount: 25000, year: 2023 },
  { id: 'b5', category: 'Assurance Immeuble', estimatedAmount: 15000, spentAmount: 15000, year: 2023 },
  { id: 'b6', category: 'Frais de Syndic', estimatedAmount: 36000, spentAmount: 36000, year: 2023 },
  { id: 'b7', category: 'Travaux Exceptionnels (Budget)', estimatedAmount: 50000, spentAmount: 12000, year: 2023 },
];

// --- FINANCES (SIMPLE RECORDS FOR LEGACY VIEWS, WILL BE REPLACED BY JOURNAL) ---
export const FINANCE_RECORDS: FinancialRecord[] = [
  { id: 'f1', date: '2023-10-01', description: 'Appel de fonds T4 2023', amount: 120000, type: 'CREDIT', category: 'Appel de fonds', status: PaymentStatus.PENDING },
  { id: 'f2', date: '2023-10-05', description: 'Maintenance Ascenseur (Otis)', amount: 4500, type: 'DEBIT', category: 'Maintenance', status: PaymentStatus.PAID, userReference: 'Otis Maroc' },
  { id: 'f3', date: '2023-10-06', description: 'Nettoyage parties communes', amount: 2800, type: 'DEBIT', category: 'Entretien', status: PaymentStatus.PAID, userReference: 'Clean Service' },
  { id: 'f4', date: '2023-10-10', description: 'Paiement charges - Lot A1', amount: 3500, type: 'CREDIT', category: 'Paiement Charges', status: PaymentStatus.PAID, userReference: 'M. Karim Alami', relatedLotId: 'l1' },
  { id: 'f5', date: '2023-10-12', description: 'Facture Lydec (Eau/Élec)', amount: 1250, type: 'DEBIT', category: 'Charges Communes', status: PaymentStatus.PAID, userReference: 'Lydec' },
  { id: 'f6', date: '2023-10-25', description: 'Réparation Porte Garage', amount: 850, type: 'DEBIT', category: 'Réparation', status: PaymentStatus.PAID, userReference: 'Serrurerie Express' },
  { id: 'f7', date: '2023-11-01', description: 'Paiement charges - Lot B1 (Retard)', amount: 6200, type: 'CREDIT', category: 'Paiement Charges', status: PaymentStatus.LATE, userReference: 'Société Tech', relatedLotId: 'l3' },
  { id: 'f8', date: '2023-11-05', description: 'Paiement charges - Lot A2', amount: 3800, type: 'CREDIT', category: 'Paiement Charges', status: PaymentStatus.PAID, userReference: 'Mme. Sarah Bennani', relatedLotId: 'l2' },
];

// --- PROVIDERS ---
export const PROVIDERS: Provider[] = [
  { id: 'p1', name: 'Atlas Sécurité', serviceType: 'Gardiennage', email: 'contact@atlas-secu.ma', phone: '0522 00 00 00', address: '12 Bd Zerktouni, Casa', rating: 4.5, status: 'Actif', interventionsCount: 12 },
  { id: 'p2', name: 'Clean Service', serviceType: 'Nettoyage', email: 'info@clean.ma', phone: '0522 11 11 11', address: 'ZI Ain Sebaa', rating: 4.0, status: 'Actif', interventionsCount: 45 },
  { id: 'p3', name: 'Otis Maroc', serviceType: 'Ascenseurs', email: 'service@otis.ma', phone: '0522 22 22 22', address: 'Sidi Maarouf', rating: 4.8, status: 'Actif', interventionsCount: 8 },
  { id: 'p4', name: 'SOS Plomberie', serviceType: 'Plomberie', email: 'sos@plombier.ma', phone: '0661 00 00 00', address: 'Maarif', rating: 3.5, status: 'Actif', interventionsCount: 3 },
];

// --- CONTRACTS ---
export const CONTRACTS: Contract[] = [
  { id: 'c1', providerId: 'p1', startDate: '2023-01-01', endDate: '2023-12-31', amount: 120000, description: 'Contrat annuel gardiennage 24/7', status: 'Actif' },
  { id: 'c2', providerId: 'p3', startDate: '2023-01-01', endDate: '2025-01-01', amount: 25000, description: 'Maintenance préventive ascenseur', status: 'Actif' },
];

// --- INTERVENTIONS (LINKED TO TICKETS) ---
export const INTERVENTIONS: Intervention[] = [
  { id: 'i1', ticketId: 't1', providerId: 'p4', datePlanned: '2023-11-11T09:00:00', dateRealized: '2023-11-11T12:00:00', status: InterventionStatus.COMPLETED, costEstimated: 1500, costReal: 1800, description: 'Remplacement tuyauterie PVC' },
  { id: 'i2', ticketId: 't3', providerId: 'p3', datePlanned: '2023-11-09T14:00:00', dateRealized: '2023-11-09T15:00:00', status: InterventionStatus.COMPLETED, costEstimated: 0, costReal: 0, description: 'Graissage câbles (inclus contrat)' },
];

// --- TICKETS ---
export const TICKETS: Ticket[] = [
  { 
    id: 't1', coproprieteId: 'copro_1', title: 'Fuite d\'eau sous-sol', 
    description: 'Une fuite importante détectée niveau -1 près du box 12.', 
    category: 'Plomberie', priority: TicketPriority.URGENT, status: TicketStatus.RESOLVED, 
    authorId: 'u2', authorName: 'M. Karim Alami', dateCreated: '2023-11-10', 
    interventionId: 'i1', isPublic: true
  },
  { 
    id: 't2', coproprieteId: 'copro_1', title: 'Ampoule grillée Hall B', 
    description: 'Lumière clignote puis s\'éteint.', 
    category: 'Électricité', priority: TicketPriority.LOW, status: TicketStatus.RESOLVED, 
    authorId: 'u3', authorName: 'Mme. Sarah Bennani', dateCreated: '2023-11-01', 
    isPublic: false
  },
  { 
    id: 't3', coproprieteId: 'copro_1', title: 'Bruit ascenseur', 
    description: 'Grincement anormal à la montée.', 
    category: 'Ascenseur', priority: TicketPriority.MEDIUM, status: TicketStatus.RESOLVED, 
    authorId: 'u1', authorName: 'Syndic', dateCreated: '2023-11-08', 
    interventionId: 'i2', isPublic: true
  },
  {
    id: 't4', coproprieteId: 'copro_1', title: 'Porte Garage Bloquée',
    description: 'La télécommande ne fonctionne pas, moteur HS ?',
    category: 'Accès', priority: TicketPriority.HIGH, status: TicketStatus.WAITING_PROVIDER,
    authorId: 'u4', authorName: 'Société Tech Maroc', dateCreated: '2023-11-20',
    isPublic: true
  }
];

// --- AG (COMPLEX) ---

const AG_PARTICIPANTS = [
  { id: 'pt1', agId: 'ag1', userId: 'u2', lotIds: ['l1', 'l4'], totalTantiemes: 50, status: PresenceStatus.PRESENT },
  { id: 'pt2', agId: 'ag1', userId: 'u3', lotIds: ['l2', 'l5'], totalTantiemes: 103, status: PresenceStatus.REPRESENTED, proxyName: 'M. Karim Alami' },
  { id: 'pt3', agId: 'ag1', userId: 'u4', lotIds: ['l3'], totalTantiemes: 80, status: PresenceStatus.ABSENT },
  // For Upcoming
  { id: 'pt4', agId: 'ag2', userId: 'u2', lotIds: ['l1', 'l4'], totalTantiemes: 50, status: PresenceStatus.PRESENT },
  { id: 'pt5', agId: 'ag2', userId: 'u3', lotIds: ['l2', 'l5'], totalTantiemes: 103, status: PresenceStatus.ABSENT },
];

export const AG_EVENTS: AGEvent[] = [
  { 
    id: 'ag1', 
    coproprieteId: 'copro_1',
    title: 'Assemblée Générale Ordinaire 2023', 
    type: AGType.ORDINAIRE,
    date: '2023-03-15T18:00:00', 
    location: 'Salle de réunion Hall A', 
    status: AGStatus.CLOSED,
    description: 'Approbation des comptes de l\'exercice 2022 et vote du budget 2023.',
    minutesUrl: '#',
    convocationUrl: '#',
    participants: AG_PARTICIPANTS.filter(p => p.agId === 'ag1'),
    resolutions: [
      {
        id: 'r1', agId: 'ag1', title: 'Approbation des comptes 2022', description: 'Quitus au syndic pour la gestion.',
        type: 'MAJORITE_SIMPLE', status: VoteStatus.ADOPTED,
        votesFor: 18, tantiemesFor: 850, votesAgainst: 0, tantiemesAgainst: 0, votesAbstain: 2, tantiemesAbstain: 50
      },
      {
        id: 'r2', agId: 'ag1', title: 'Budget prévisionnel 2023', description: 'Validation du budget de 450.000 MAD.',
        type: 'MAJORITE_ABSOLUE', status: VoteStatus.ADOPTED,
        votesFor: 15, tantiemesFor: 700, votesAgainst: 3, tantiemesAgainst: 150, votesAbstain: 1, tantiemesAbstain: 50
      }
    ]
  },
  { 
    id: 'ag2', 
    coproprieteId: 'copro_1',
    title: 'AG Extraordinaire (Travaux Façade)', 
    type: AGType.EXTRAORDINAIRE,
    date: '2023-12-20T10:00:00', 
    location: 'Hôtel Ibis Centre Ville', 
    status: AGStatus.PLANNED,
    description: 'Vote des travaux de ravalement de façade suite aux infiltrations.',
    convocationUrl: '#',
    participants: AG_PARTICIPANTS.filter(p => p.agId === 'ag2'),
    resolutions: [
      {
        id: 'r3', agId: 'ag2', title: 'Choix du prestataire Façade', description: 'Sélection entre devis A et B.',
        type: 'MAJORITE_ABSOLUE', status: VoteStatus.PENDING,
        votesFor: 0, tantiemesFor: 0, votesAgainst: 0, tantiemesAgainst: 0, votesAbstain: 0, tantiemesAbstain: 0
      }
    ]
  },
];

// --- DOCUMENTS ---
export const DOCUMENTS: Document[] = [
  // PUBLIC - LEGAL
  { 
    id: 'd1', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.REGLEMENT_COPROPRIETE,
    title: 'Règlement de Copropriété Officiel', description: 'Version signée et enregistrée',
    url: '#', size: '5.2 MB', dateUpload: '2020-01-15', isVisibleToOwners: true
  },
  { 
    id: 'd2', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.NOTE_OFFICIELLE,
    title: 'Note : Horaires Gardiennage', description: 'Changement des plannings nuit',
    url: '#', size: '0.4 MB', dateUpload: '2023-05-10', isVisibleToOwners: true
  },
  
  // PUBLIC - AG
  { 
    id: 'd3', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.PV_AG,
    title: 'PV AG Ordinaire 2023', description: 'Procès-verbal de l\'assemblée du 15 Mars',
    url: '#', size: '2.4 MB', dateUpload: '2023-03-20', dateDocument: '2023-03-15', isVisibleToOwners: true, agId: 'ag1'
  },
  { 
    id: 'd4', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.CONVOCATION_AG,
    title: 'Convocation AGE Déc 2023', description: 'Ordre du jour pour travaux façade',
    url: '#', size: '1.1 MB', dateUpload: '2023-11-20', dateDocument: '2023-11-20', isVisibleToOwners: true, agId: 'ag2'
  },
  
  // PRIVATE - SYNDIC ONLY (Finance & Contracts)
  { 
    id: 'd5', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.FACTURE_PRESTATAIRE,
    title: 'Facture Lydec Octobre', description: 'Eau et électricité parties communes',
    url: '#', size: '0.8 MB', dateUpload: '2023-11-05', isVisibleToOwners: false, providerId: 'p2'
  },
  { 
    id: 'd6', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.CONTRAT_PRESTATAIRE,
    title: 'Contrat Atlas Sécurité 2023', description: 'Contrat annuel signé',
    url: '#', size: '3.5 MB', dateUpload: '2023-01-05', isVisibleToOwners: false, providerId: 'p1'
  },
  { 
    id: 'd7', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.DEVIS,
    title: 'Devis Façade - PeinturePro', description: 'Devis A pour AGE',
    url: '#', size: '1.2 MB', dateUpload: '2023-11-15', isVisibleToOwners: false, interventionId: 'i1'
  },
  
  // PERSONAL - OWNER SPECIFIC
  { 
    id: 'd8', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.RELEVE_COMPTABLE_PERSO,
    title: 'Appel de fonds T4 2023', description: 'Votre avis d\'échéance',
    url: '#', size: '0.3 MB', dateUpload: '2023-10-01', isVisibleToOwners: true, ownerId: 'u2'
  },
  { 
    id: 'd9', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.RECU_PAIEMENT_PERSO,
    title: 'Reçu Paiement Nov 2023', description: 'Quittance pour virement reçu',
    url: '#', size: '0.2 MB', dateUpload: '2023-11-12', isVisibleToOwners: true, ownerId: 'u2'
  },
  { 
    id: 'd10', coproprieteId: 'copro_1', uploadedByUserId: 'u1', type: DocumentType.RELEVE_COMPTABLE_PERSO,
    title: 'Appel de fonds T4 2023', description: 'Votre avis d\'échéance',
    url: '#', size: '0.3 MB', dateUpload: '2023-10-01', isVisibleToOwners: true, ownerId: 'u3'
  },
];

// --- TEMPLATES ---
export const COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  {
    id: 'tpl_1', title: 'Rappel Paiement', subject: 'Rappel : Charges impayées',
    content: 'Bonjour {{nom}},\n\nSauf erreur de notre part, nous n\'avons pas reçu le règlement de vos charges pour le trimestre en cours.\nMontant dû: {{montant_du}} MAD.\n\nCordialement,\nLe Syndic.',
    variables: ['nom', 'montant_du']
  },
  {
    id: 'tpl_2', title: 'Convocation AG', subject: 'Convocation Assemblée Générale',
    content: 'Bonjour,\n\nVous êtes convié à l\'assemblée générale qui se tiendra le {{date}}.\nVotre présence est importante.\n\nLe Syndic.',
    variables: ['date']
  },
  {
    id: 'tpl_3', title: 'Alerte Travaux', subject: 'Travaux en cours : Coupure d\'eau',
    content: 'Bonjour,\n\nDes travaux auront lieu sur le réseau d\'eau le {{date}}.\nMerci de prendre vos dispositions.\n\nLe Syndic.',
    variables: ['date']
  }
];

// --- MESSAGES (RICH) ---
export const MESSAGES: Message[] = [
  { 
    id: 'm1', coproprieteId: 'copro_1', senderUserId: 'u1', type: MessageType.ANNONCE,
    title: 'Rappel : AG le 20 Décembre', content: 'Bonjour à tous, n\'oubliez pas l\'assemblée générale prévue le 20 décembre. Le quorum est essentiel.', 
    dateSent: '2023-12-10T10:00:00', readBy: ['u2', 'u3'], isVisibleToOwners: true
  },
  { 
    id: 'm2', coproprieteId: 'copro_1', senderUserId: 'u2', receiverUserId: 'u1', type: MessageType.MESSAGE_PRIVE,
    title: 'Question sur les charges', content: 'Bonjour M. le Syndic, pourriez-vous m\'expliquer la ligne "Travaux exceptionnels" sur mon dernier appel ?', 
    dateSent: '2023-11-18T14:30:00', readBy: ['u1'], isVisibleToOwners: false
  },
  { 
    id: 'm3', coproprieteId: 'copro_1', senderUserId: 'system', receiverUserId: 'u2', type: MessageType.SYSTEME,
    title: 'Paiement reçu', content: 'Votre paiement de 3500 MAD a bien été enregistré. Merci.', 
    dateSent: '2023-10-10T09:15:00', readBy: ['u2'], isVisibleToOwners: true
  },
  {
    id: 'm4', coproprieteId: 'copro_1', senderUserId: 'u1', type: MessageType.MESSAGE_CIBLE, targetBuildingId: 'b_A',
    title: 'Coupure d\'eau Bloc A', content: 'Une intervention sur la colonne montante du Bloc A aura lieu demain de 10h à 12h.',
    dateSent: '2023-11-25T18:00:00', readBy: ['u2'], isVisibleToOwners: true
  },
  {
    id: 'm5', coproprieteId: 'copro_1', senderUserId: 'u1', receiverUserId: 'u2', type: MessageType.MESSAGE_PRIVE,
    title: 'Re: Question sur les charges', content: 'Bonjour M. Alami, il s\'agit de l\'avance pour l\'étanchéité votée en AG.',
    dateSent: '2023-11-18T16:00:00', readBy: ['u2'], isVisibleToOwners: false
  }
];

// --- HELPER FUNCTIONS ---

export const getFinancialSummary = (userId?: string) => {
  let records = FINANCE_RECORDS;
  
  const totalIncome = records.filter(f => f.type === 'CREDIT' && f.status === PaymentStatus.PAID).reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = records.filter(f => f.type === 'DEBIT').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = records.filter(f => f.type === 'CREDIT' && f.status !== PaymentStatus.PAID).reduce((acc, curr) => acc + curr.amount, 0);
  
  return { totalIncome, totalExpense, totalPending, balance: totalIncome - totalExpense };
};

export const getUserBalance = (userId: string) => {
  const userLots = LOTS.filter(l => l.ownerId === userId).map(l => l.id);
  
  const pendingAmount = FINANCE_RECORDS
    .filter(r => (r.relatedLotId && userLots.includes(r.relatedLotId) && r.status !== PaymentStatus.PAID))
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  return pendingAmount;
};

// --- AGENDA AUTOMATION (MOCK GENERATOR) ---
// This automatically creates calendar events from other data sources

const generateCalendarEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  // 1. AG EVENTS
  AG_EVENTS.forEach(ag => {
    events.push({
      id: `ev_ag_${ag.id}`,
      coproprieteId: ag.coproprieteId,
      category: EventCategory.AG,
      title: ag.title,
      description: ag.description,
      startDate: ag.date, // e.g. "2023-12-20T10:00:00"
      level: EventImportance.IMPORTANT,
      isVisibleToOwners: true,
      linkType: 'AG',
      linkId: ag.id
    });
  });

  // 2. INTERVENTIONS (Work)
  INTERVENTIONS.forEach(inter => {
    // Find ticket to get title
    const ticket = TICKETS.find(t => t.id === inter.ticketId);
    if (!ticket) return;

    events.push({
      id: `ev_int_${inter.id}`,
      coproprieteId: ticket.coproprieteId,
      category: EventCategory.TRAVAUX,
      title: `Intervention: ${ticket.category}`,
      description: inter.description,
      startDate: inter.datePlanned,
      level: EventImportance.NORMAL,
      isVisibleToOwners: true, // Assuming works are public info
      linkType: 'INTERVENTION',
      linkId: inter.id
    });
  });

  // 3. FINANCE (Payments)
  // We use "Appel de fonds" deadlines from FINANCE_RECORDS
  FINANCE_RECORDS.filter(f => f.category === 'Appel de fonds').forEach(rec => {
    events.push({
      id: `ev_fin_${rec.id}`,
      coproprieteId: 'copro_1',
      category: EventCategory.PAIEMENT,
      title: `Échéance: ${rec.description}`,
      description: `Montant total: ${rec.amount} MAD`,
      startDate: `${rec.date}T09:00:00`, // adding time to date string
      level: EventImportance.IMPORTANT,
      isVisibleToOwners: true,
      linkType: 'FINANCE',
      linkId: rec.id
    });
  });

  // 4. MANUAL EVENTS (Mocked)
  events.push({
    id: 'ev_man_1',
    coproprieteId: 'copro_1',
    category: EventCategory.URGENCE,
    title: 'Coupure d\'eau générale',
    description: 'Maintenance ONEE sur le quartier',
    startDate: '2023-11-25T08:00:00',
    endDate: '2023-11-25T14:00:00',
    level: EventImportance.URGENT,
    isVisibleToOwners: true
  });

  return events;
};

export const CALENDAR_EVENTS: CalendarEvent[] = generateCalendarEvents();

// --- NEW SETTINGS MOCK DATA ---

export const SYNDIC_PROFILE: SyndicProfile = {
  id: 'sp_1',
  userId: 'u1',
  companyName: 'Cabinet Expert Immo Maroc',
  address: '12 Avenue des FAR, Casablanca',
  phone: '+212 522 00 11 22',
  email: 'contact@expertimmo.ma',
  rib: '123456789012345678901234',
  logoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  signatureUrl: '#'
};

export const COPRO_SETTINGS: CoproprieteSettings = {
  id: 'cs_1',
  coproprieteId: 'copro_1',
  currency: 'MAD',
  language: 'FR',
  fiscalYearStart: '01-01',
  fiscalYearEnd: '12-31',
  penaltyRate: 5, // 5%
  autoPublishDocuments: false
};

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'dt_1', type: 'PV_AG', title: 'Procès-Verbal Standard', 
    content: '<h1>Procès-Verbal</h1><p>Assemblée tenue le {{date_AG}} à {{adresse_copropriete}}.</p>', 
    variables: ['date_AG', 'adresse_copropriete']
  },
  {
    id: 'dt_2', type: 'RELANCE', title: 'Mise en demeure (Niveau 1)',
    content: 'Monsieur/Madame {{nom_coproprietaire}}, sauf erreur de notre part, le montant de {{montant_du}} reste impayé.',
    variables: ['nom_coproprietaire', 'montant_du']
  }
];

export const SECURITY_LOGS: SecurityLog[] = [
  { id: 'sl_1', date: '2023-11-25 10:23', device: 'Chrome / Windows', ip: '105.155.22.10', status: 'Success' },
  { id: 'sl_2', date: '2023-11-24 18:45', device: 'Safari / iPhone', ip: '41.140.12.8', status: 'Success' },
  { id: 'sl_3', date: '2023-11-20 09:12', device: 'Firefox / Mac', ip: '105.155.22.10', status: 'Failed' },
];