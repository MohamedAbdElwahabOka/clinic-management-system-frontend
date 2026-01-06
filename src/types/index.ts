export type UserRole = "Doctor" | "Assistant";

export interface User {
  // Added for conceptual clarity, not deeply integrated yet
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  specialty?: string; // Doctor-specific
  bio?: string;
}
export interface LabTest {
  testName: string;
  code?: string;
  result: string;
  unit?: string;
  range?: string;
  reportFile?: string;
}
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string; // ISO date
  gender: "Male" | "Female";
  contactPhone: string;
  contactEmail: string;
  address: string;
  avatar?: string;

  // ===================== 1. Patient Info =====================
  personalInfo?: {
    chronicConditions?: string[];
    allergies?: string[];
    familyHistory?: string[];
    lifestyle?: {
      smoking?: boolean;
      exercise?: string;
      diet?: string;
    };
  };

  // ===================== 2. General / Internal Medicine =====================
  generalMedicine?: {
    diagnoses?: { code: string; description: string }[]; // ICD-10
    symptoms?: string[];
    vitalSigns?: {
      bloodPressure?: string;
      glucose?: string;
      temperature?: string;
      heartRate?: string;
    };
    medications?: string[];
    followUpNotes?: string[];
  };

  // ===================== 3. Pediatrics =====================
  pediatrics?: {
    growthChart?: {
      height: string;
      weight: string;
      headCircumference: string;
    }[];
    vaccinationSchedule?: {
      vaccine: string;
      date: string;
      status: "Done" | "Pending";
    }[];
    developmentalMilestones?: {
      age: string;
      milestone: string;
      status: string;
    }[];
  };

  // ===================== 4. Obstetrics & Gynecology =====================
  obstetricsGynecology?: {
    pregnancy?: { weeks: number; ultrasoundFindings?: string };
    delivery?: { type: string; date: string };
    menstrualHistory?: { cycleLength?: string; lastPeriod?: string };
    gynecologicalConditions?: string[];
  };

  // ===================== 5. Cardiology =====================
  cardiology?: {
    ecgResults?: string;
    echocardiography?: string;
    bloodPressure?: string;
    cardiacMeds?: string[];
  };

  // ===================== 6. Pulmonology =====================
  pulmonology?: {
    pulmonaryFunctionTest?: string;
    imagingReports?: { type: "X-ray" | "CT"; result: string }[];
    chronicDiseases?: string[]; // Asthma, COPD
  };

  // ===================== 7. Neurology =====================
  neurology?: {
    eegResults?: string;
    mriReports?: string;
    neuroExamination?: string;
  };

  // ===================== 8. Orthopedics =====================
  orthopedics?: {
    imaging?: { type: "X-ray" | "MRI"; report: string }[];
    fractures?: string[];
    surgeries?: string[];
  };

  // ===================== 9. Dentistry =====================
  dentistry?: {
    dentalChart?: string;
    treatmentPlans?: string[];
    xrayImages?: string[];
  };

  // ===================== 10. Ophthalmology =====================
  ophthalmology?: {
    visualAcuity?: string;
    iop?: string; // Intraocular Pressure
    fundusExam?: string;
    octImages?: string[];
  };

  // ===================== 11. ENT =====================
  ent?: {
    audiogram?: string;
    endoscopyReports?: string[];
    surgeries?: string[];
  };

  // ===================== 12. Dermatology =====================
  dermatology?: {
    skinImages?: string[];
    diagnoses?: string[];
    treatmentPlans?: string[];
  };

  // ===================== 13. Psychiatry / Psychology =====================
  psychiatry?: {
    diagnoses?: { code: string; description: string }[];
    clinicalNotes?: string[];
    assessments?: { phq9?: number; gad7?: number };
    treatmentPlan?: string[];
  };

  // ===================== 14. Oncology =====================
  oncology?: {
    tumorType?: string; // ICD-O Code
    staging?: string;
    grading?: string;
    treatmentPlan?: string[];
    pathologyReports?: string[];
  };

  // ===================== 15. Lab Tests =====================

  labTests?: LabTest[];
  // labTests?: {
  //   testName: string;
  //   code?: string; // LOINC
  //   result: string;
  //   unit?: string;
  //   range?: string;
  //   reportFile?: string; // PDF
  // }[];

  // ===================== 16. Radiology =====================
  radiology?: {
    type: "X-ray" | "CT" | "MRI" | "Ultrasound";
    report: string;
    reportDate?: string; // ISO date
    dicomFiles?: string[];
  }[];

  // ===================== 17. Surgery =====================
  surgery?: {
    type: string;
    description?: string;
    complications?: string[];
    postOpReport?: string;
  }[];

  // ===================== 18. Nutrition & Dietetics =====================
  nutrition?: {
    dietPlan?: string;
    weightEvaluation?: string;
    followUp?: string[];
  };

  // ===================== 19. Physiotherapy & Rehabilitation =====================
  physiotherapy?: {
    exerciseProgram?: string[];
    progressNotes?: string[];
    assistiveDevices?: string[];
  };

  // ===================== 20. Emergency =====================
  emergency?: {
    reason?: string;
    urgentProcedures?: string[];
    emergencyMeds?: string[];
  };

  // ===================== Visits & Notes =====================
  visitNotes?: VisitNote[];
  lastVisit?: string; // ISO date
}

export interface VisitNote {
  id: string;
  date: string; // ISO date string
  doctorName: string;
  notes: string;
}

export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | "Arrived"
  | "No Show";
export type VisitType =
  | "Examination"
  | "Consultation"
  | "Follow-up"
  | "Procedure"
  | "Other";

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

export type QueueStatus =
  | "Waiting"
  | "In Consultation"
  | "Checked Out"
  | "No Show"
  | "Notified";

export interface QueueItem {
  id: string; // Usually same as appointment ID
  appointmentId: string;
  patientName: string;
  appointmentTime: string; // Time string e.g., "10:30 AM"
  status: QueueStatus;
  doctorName: string;
}

export type Locale = "en" | "ar" | "de";
export type Direction = "ltr" | "rtl";

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
export type LedgerEntryType = "income" | "expense";

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

// أضف هذا للكود الموجود في ملف types.ts أو أنشئ ملف جديد

export type LocalizedText = {
  ar: string;
  en: string;
  de: string;
};

export type NotificationType =
  | "appointment"
  | "confirmation"
  | "cancellation"
  | "reminder";

export interface Notification {
  id: number;
  message: LocalizedText; // هذا هو الحقل الـ JSONB
  date: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

// types.ts

// types.ts
export type ClinicStatus = "active" | "maintenance" | "closed" | "busy";
export type StaffRoleType = "doctor" | "nurse" | "admin" | "technician";
export type StaffStatus = "on-duty" | "off" | "leave";
export type PaymentStatus = "paid" | "pending" | "overdue";
export type ClinicSpecialty = "dental" | "cardio" | "general" | "eye"; // مفتاح التخصص للاقتراحات الذكية
export type InventoryStatus = "good" | "low" | "critical";

// --- HR & Payroll ---
export type PayrollInfo = {
  salary: number;
  currency: string;
  frequency: "monthly" | "weekly";
  nextPaymentDate: string;
  status: PaymentStatus;
};

export type StaffMember = {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  roleType: StaffRoleType;
  status: StaffStatus;
  avatar: string;
  specialty?: LocalizedText;
  payroll: PayrollInfo; // بيانات الراتب
};

// --- Inventory ---
export type InventoryItem = {
  id: string;
  itemName: LocalizedText;
  category: LocalizedText;
  quantity: number;
  threshold: number; // الحد الأدنى لإعادة الطلب
  unit: LocalizedText;
  status: InventoryStatus;
  // عدادات الاستهلاك والهالك
  wastedCount: number;
  consumedCount: number;
};

export type Amenity = {
  id: string;
  name: LocalizedText;
  icon: string;
};

export type ClinicStats = {
  doctors: number;
  nurses: number;
  dailyCapacity: number;
  currentOccupancy: number;
  monthlyVisits: number;
};

export type Clinic = {
  id: string;
  name: LocalizedText;
  type: LocalizedText;
  specialtyKey: ClinicSpecialty; // هام للاقتراحات الذكية
  description: LocalizedText;
  address: LocalizedText;
  phone: string;
  email: string;
  image: string;
  status: ClinicStatus;
  rating: number;
  openHours: string;
  stats: ClinicStats;
  amenities: Amenity[];
  // القوائم الجديدة للإدارة
  staff: StaffMember[];
  inventory: InventoryItem[];
};
