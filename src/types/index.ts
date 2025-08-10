
export type UserRole = 'Doctor' | 'Assistant';

export interface User { // Added for conceptual clarity, not deeply integrated yet
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  specialty?: string; // Doctor-specific
  bio?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  contactPhone: string;
  contactEmail: string;
  address: string;
  medicalHistory?: {
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
  };
  visitNotes?: VisitNote[];
  lastVisit?: string; // ISO date string
}

export interface VisitNote {
  id:string;
  date: string; // ISO date string
  doctorName: string;
  notes: string;
}

export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Arrived' | 'No Show';
export type VisitType = 'Examination' | 'Consultation' | 'Follow-up' | 'Procedure' | 'Other';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dateTime: string; // ISO date string
  doctorName: string;
  visitType: VisitType;
  reason: string; // Detailed reason/notes for the visit
  status: AppointmentStatus;
}

export type QueueStatus = 'Waiting' | 'In Consultation' | 'Checked Out' | 'No Show' | 'Notified';

export interface QueueItem {
  id: string; // Usually same as appointment ID
  appointmentId: string;
  patientName: string;
  appointmentTime: string; // Time string e.g., "10:30 AM"
  status: QueueStatus;
  doctorName: string;
}

export type Locale = 'en' | 'ar' | 'de';
export type Direction = 'ltr' | 'rtl';

export interface NavItem {
  title: string; // This might become a key for translation
  titleKey?: string; // Key for translation dictionary
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  roles?: UserRole[]; // Optional: specify which roles can see this item
}

export interface ServicePrice {
  id: string;
  name: string; // e.g., "Examination (كشف)", "Consultation (استشارة)"
  price: number;
  currency: string; // e.g., "EGP"
  description?: string;
}

// Financial Ledger Types
export type LedgerEntryType = 'income' | 'expense';

export interface LedgerCategory {
  id: string;
  name: string;
  type: LedgerEntryType; // To differentiate income categories from expense categories
}

export interface LedgerEntry {
  id: string;
  date: string; // ISO date string
  description: string;
  categoryId: string;
  categoryName: string; // Denormalized for easier display
  amount: number; // Always positive, type determines effect on balance
  type: LedgerEntryType;
  notes?: string; // Optional field for additional details
}

// For simple translation dictionary
export type Translations = {
  [key: string]: string;
};

export type LanguageDictionary = {
  [locale in Locale]: Translations;
};
