
import type { Patient, Appointment, QueueItem, AppointmentStatus,  VisitType, ServicePrice, LedgerCategory, LedgerEntry } from '@/types';

// export const dummyPatients: Patient[] = [
//   {
//     id: 'PAT001',
//     name: 'John Doe',
//     dateOfBirth: '1985-07-20',
//     gender: 'Male',
//     contactPhone: '555-1234',
//     contactEmail: 'john.doe@example.com',
//     address: '123 Main St, Anytown, USA',
//     lastVisit: '2023-10-15',
//     medicalHistory: {
//       allergies: ['Penicillin', 'Peanuts'],
//       conditions: ['Hypertension'],
//       medications: ['Lisinopril 10mg'],
//     },
//     visitNotes: [
//       { id: 'VN001', date: '2023-10-15', doctorName: 'Dr. Smith', notes: 'Routine check-up. Blood pressure slightly elevated.' },
//       { id: 'VN002', date: '2023-05-01', doctorName: 'Dr. Smith', notes: 'Flu symptoms. Prescribed Tamiflu.' },
//     ],
//   },
//   {
//     id: 'PAT002',
//     name: 'Jane Smith',
//     dateOfBirth: '1992-02-10',
//     gender: 'Female',
//     contactPhone: '555-5678',
//     contactEmail: 'jane.smith@example.com',
//     address: '456 Oak Ave, Anytown, USA',
//     lastVisit: '2023-11-01',
//     medicalHistory: {
//       conditions: ['Asthma'],
//       medications: ['Albuterol Inhaler'],
//     },
//   },
//   {
//     id: 'PAT003',
//     name: 'Alice Johnson',
//     dateOfBirth: '1978-12-01',
//     gender: 'Female',
//     contactPhone: '555-8765',
//     contactEmail: 'alice.j@example.com',
//     address: '789 Pine Ln, Anytown, USA',
//     lastVisit: '2023-09-20',
//   },
//   {
//     id: 'PAT004',
//     name: 'Robert Brown',
//     dateOfBirth: '1995-03-15',
//     gender: 'Male',
//     contactPhone: '555-1122',
//     contactEmail: 'robert.b@example.com',
//     address: '101 Maple Dr, Anytown, USA',
//     lastVisit: new Date().toISOString(), // For testing, last visit today
//   },
//   {
//     id: 'PAT005',
//     name: 'Michael Davis',
//     dateOfBirth: '1980-09-25',
//     gender: 'Male',
//     contactPhone: '555-3344',
//     contactEmail: 'michael.d@example.com',
//     address: '202 Birch Rd, Anytown, USA',
//     lastVisit: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // 5 days ago
//   },
// ];

export const dummyPatients: Patient[] = [
  {
    id: "P001",
    name: "أحمد حسن",
    dateOfBirth: "1985-06-12",
    gender: "Male",
    contactPhone: "+20 100 123 4567",
    contactEmail: "ahmed.hassan@example.com",
    address: "القاهرة، مصر",
    avatar: "/avatars/ahmed.jpg",

    personalInfo: {
      chronicConditions: ["السكري النوع الثاني", "ارتفاع ضغط الدم"],
      allergies: ["البنسلين", "الغبار"],
      familyHistory: ["أمراض القلب", "السكري"],
      lifestyle: {
        smoking: false,
        exercise: "مشي 3 مرات أسبوعياً",
        diet: "قليل السكر والملح"
      }
    },

    generalMedicine: {
      diagnoses: [
        { code: "E11", description: "السكري النوع الثاني" },
        { code: "I10", description: "ارتفاع ضغط الدم الأساسي" }
      ],
      symptoms: ["العطش المستمر", "كثرة التبول", "التعب العام"],
      vitalSigns: {
        bloodPressure: "140/90",
        glucose: "180 mg/dL",
        temperature: "36.8°C",
        heartRate: "85 bpm"
      },
      medications: ["ميتفورمين 500 مجم", "انتابريد 5 مجم", "اسبرين 75 مجم"],
      followUpNotes: ["مراقبة السكر يومياً", "قياس الضغط أسبوعياً", "زيارة بعد شهر"]
    },

    cardiology: {
      ecgResults: "انتظام sinus مع عدم استقرار ST",
      echocardiography: "وظيفة البطين الأيسر طبيعية",
      bloodPressure: "140/90",
      cardiacMeds: ["انتابريد 5 مجم", "اسبرين 75 مجم"]
    },

    labTests: [
      {
        testName: "HbA1c",
        code: "4548-4",
        result: "8.2",
        unit: "%",
        range: "4.0-6.0",
        reportFile: "/reports/P001/hba1c.pdf"
      },
      {
        testName: "Glucose Fasting",
        result: "180",
        unit: "mg/dL",
        range: "70-110",
        reportFile: "/reports/P001/glucose.pdf"
      },
      {
        testName: "Cholesterol Total",
        result: "220",
        unit: "mg/dL",
        range: "<200",
        reportFile: "/reports/P001/cholesterol.pdf"
      }
    ],

    visitNotes: [
      {
        id: "VN001",
        date: "2024-02-01",
        doctorName: "د. علي محمد",
        notes: "تم بدء علاج الانسولين، وتحسين النظام الغذائي"
      },
      {
        id: "VN002",
        date: "2024-01-15",
        doctorName: "د. علي محمد",
        notes: "شكوى من زيادة العطش والتبول، تم طلب فحوصات السكر"
      }
    ],
    lastVisit: "2024-02-01"
  }
];


const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

export const dummyAppointments: Appointment[] = [
  {
    id: 'APP001',
    patientId: 'PAT001',
    patientName: 'John Doe',
    dateTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(), // Today at 9 AM
    doctorName: 'Dr. Emily Carter',
    visitType: 'Examination' as VisitType,
    reason: 'Hypertension check',
    status: 'Completed' as AppointmentStatus,
  },
  {
    id: 'APP002',
    patientId: 'PAT002',
    patientName: 'Jane Smith',
    dateTime: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(), // Today at 10:30 AM
    doctorName: 'Dr. Benjamin Lee',
    visitType: 'Consultation' as VisitType,
    reason: 'Asthma Check',
    status: 'Completed' as AppointmentStatus,
  },
  {
    id: 'APP003',
    patientId: 'PAT003',
    patientName: 'Alice Johnson',
    dateTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), // Today at 2 PM
    doctorName: 'Dr. Emily Carter',
    visitType: 'Examination' as VisitType,
    reason: 'Annual Physical Exam',
    status: 'Arrived' as AppointmentStatus,
  },
  {
    id: 'APP004',
    patientName: 'Robert Brown',
    patientId: 'PAT004', 
    dateTime: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(),
    doctorName: 'Dr. Olivia Green',
    visitType: 'Consultation' as VisitType,
    reason: 'Second opinion',
    status: 'Scheduled' as AppointmentStatus,
  },
  {
    id: 'APP005',
    patientName: 'Michael Davis',
    patientId: 'PAT005',
    dateTime: new Date(yesterday.setHours(16, 0, 0, 0)).toISOString(), // Yesterday
    doctorName: 'Dr. Benjamin Lee',
    visitType: 'Examination' as VisitType,
    reason: 'Vaccination follow-up',
    status: 'Completed' as AppointmentStatus,
  },
   {
    id: 'APP006',
    patientId: 'PAT001',
    patientName: 'John Doe',
    dateTime: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(), // Today at 11:30 AM
    doctorName: 'Dr. Emily Carter',
    visitType: 'Follow-up' as VisitType,
    reason: 'Check results',
    status: 'Completed' as AppointmentStatus,
  },
  {
    id: 'APP007',
    patientId: 'PAT002',
    patientName: 'Jane Smith',
    dateTime: new Date(new Date(new Date().setDate(new Date().getDate() - 2)).setHours(10, 0, 0, 0)).toISOString(), // 2 days ago
    doctorName: 'Dr. Benjamin Lee',
    visitType: 'Consultation' as VisitType,
    reason: 'Medication review',
    status: 'Completed' as AppointmentStatus,
  },
];

export const dummyQueueItems: QueueItem[] = [
  // This data is now derived dynamically in queue/page.tsx
];


export const dummyServicePrices: ServicePrice[] = [
  { id: 'SRV001', name: 'Examination (كشف)', price: 150, currency: 'EGP', description: 'Standard patient examination.' },
  { id: 'SRV002', name: 'Consultation (استشارة)', price: 100, currency: 'EGP', description: 'Medical consultation and advice.' },
  { id: 'SRV003', name: 'Follow-up Visit', price: 75, currency: 'EGP', description: 'Follow-up on previous condition or treatment.' },
  { id: 'SRV004', name: 'Standard Vaccination', price: 200, currency: 'EGP', description: 'Includes cost of standard vaccine.' },
  { id: 'SRV005', name: 'Minor Procedure', price: 300, currency: 'EGP', description: 'Pricing for common minor procedures.' },
];

// Dummy data for Ledger
export const dummyLedgerCategories: LedgerCategory[] = [
  { id: 'CAT_INC_001', name: 'Patient Services', type: 'income' },
  { id: 'CAT_INC_002', name: 'Consultation Fees', type: 'income' },
  { id: 'CAT_INC_003', name: 'Procedure Fees', type: 'income' },
  { id: 'CAT_EXP_001', name: 'Rent', type: 'expense' },
  { id: 'CAT_EXP_002', name: 'Utilities (Electricity, Water)', type: 'expense' },
  { id: 'CAT_EXP_003', name: 'Medical Supplies', type: 'expense' },
  { id: 'CAT_EXP_004', name: 'Salaries (Staff)', type: 'expense' },
  { id: 'CAT_EXP_005', name: 'Office Supplies', type: 'expense' },
  { id: 'CAT_EXP_006', name: 'Maintenance', type: 'expense' },
];

const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const dummyLedgerEntries: LedgerEntry[] = [
  { id: 'LDE001', date: getDaysAgo(2), description: 'Patient Consultation - J. Doe', categoryId: 'CAT_INC_002', categoryName: 'Consultation Fees', amount: 100, type: 'income', notes: 'Regular checkup fee' },
  { id: 'LDE002', date: getDaysAgo(2), description: 'Medical Supplies Order', categoryId: 'CAT_EXP_003', categoryName: 'Medical Supplies', amount: 350, type: 'expense', notes: 'Gloves, masks, syringes' },
  { id: 'LDE003', date: getDaysAgo(5), description: 'Office Rent - Current Month', categoryId: 'CAT_EXP_001', categoryName: 'Rent', amount: 2000, type: 'expense' },
  { id: 'LDE004', date: getDaysAgo(1), description: 'Patient Examination - A. Smith', categoryId: 'CAT_INC_001', categoryName: 'Patient Services', amount: 150, type: 'income' },
  { id: 'LDE005', date: getDaysAgo(0), description: 'Electricity Bill', categoryId: 'CAT_EXP_002', categoryName: 'Utilities (Electricity, Water)', amount: 120, type: 'expense' },
  { id: 'LDE006', date: getDaysAgo(7), description: 'Minor Procedure - R. Brown', categoryId: 'CAT_INC_003', categoryName: 'Procedure Fees', amount: 300, type: 'income', notes: 'Wound stitching' },
  { id: 'LDE007', date: getDaysAgo(0), description: 'Stationery Purchase', categoryId: 'CAT_EXP_005', categoryName: 'Office Supplies', amount: 45, type: 'expense', notes: 'Pens, paper, notebooks' },
  { id: 'LDE008', date: getDaysAgo(10), description: 'Assistant Salary - M. Davis', categoryId: 'CAT_EXP_004', categoryName: 'Salaries (Staff)', amount: 1500, type: 'expense' },
];


//pricing-db.ts

// 1. محاكاة نوع بيانات JSONB في الـ SQL
type JsonB = {
  [key: string]: string; // ar, en, de, etc.
};

export interface PricingFeature {
  key: string;
  text: JsonB; // النص نفسه (مثلا "عدد المستخدمين")
  value?: JsonB; // قيمة مخصصة لو موجودة (مثلا "5 مستخدمين")
  included: boolean; // هل الميزة دي متاحة في الباقة دي؟
}

export interface PricingPlan {
  id: string;
  name: JsonB;
  description: JsonB;
  monthlyPrice: number;
  yearlyPrice: number;
  discountPercent: number; // خصم خاص بالباقة دي
  isPopular: boolean;
  ctaText: JsonB;
  features: PricingFeature[];
}

// 2. الداتا نفسها (Dummy Data acting as DB)
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: { ar: "مجانية", en: "Free", de: "Kostenlos" },
    description: { 
      ar: "للتجربة والعيادات الناشئة.", 
      en: "Perfect for trial and startups.", 
      de: "Perfekt zum Testen und für Startups." 
    },
    monthlyPrice: 0,
    yearlyPrice: 0,
    discountPercent: 0,
    isPopular: false,
    ctaText: { ar: "جرب مجاناً", en: "Try for Free", de: "Kostenlos testen" },
    features: [
      { key: "users", text: { ar: "عدد المستخدمين", en: "Users", de: "Benutzer" }, value: { ar: "مستخدم واحد", en: "1 User", de: "1 Benutzer" }, included: true },
      { key: "patients", text: { ar: "عدد المرضى", en: "Patients", de: "Patienten" }, value: { ar: "100 مريض", en: "100 Patients", de: "100 Patienten" }, included: true },
      { key: "appt", text: { ar: "إدارة المواعيد", en: "Appointment Mgmt", de: "Terminverwaltung" }, included: true },
      { key: "insurance", text: { ar: "نظام التأمين", en: "Insurance System", de: "Versicherungssystem" }, included: false },
      { key: "sms", text: { ar: "رسائل SMS", en: "SMS Messages", de: "SMS-Nachrichten" }, included: false },
    ]
  },
  {
    id: "starter",
    name: { ar: "الأساسية", en: "Starter", de: "Starter" },
    description: { 
      ar: "للعيادات الصغيرة والدكاترة الجدد.", 
      en: "For small clinics and new doctors.", 
      de: "Für kleine Praxen und neue Ärzte." 
    },
    monthlyPrice: 499,
    yearlyPrice: 4990,
    discountPercent: 0,
    isPopular: false,
    ctaText: { ar: "ابدأ الآن", en: "Get Started", de: "Jetzt loslegen" },
    features: [
      { key: "users", text: { ar: "عدد المستخدمين", en: "Users", de: "Benutzer" }, value: { ar: "2 (دكتور + مساعد)", en: "2 Users", de: "2 Benutzer" }, included: true },
      { key: "patients", text: { ar: "عدد المرضى", en: "Patients", de: "Patienten" }, value: { ar: "2000 مريض", en: "2000 Patients", de: "2000 Patienten" }, included: true },
      { key: "appt", text: { ar: "إدارة المواعيد", en: "Appointment Mgmt", de: "Terminverwaltung" }, included: true },
      { key: "insurance", text: { ar: "نظام التأمين", en: "Insurance System", de: "Versicherungssystem" }, included: false },
      { key: "sms", text: { ar: "رسائل SMS", en: "SMS Messages", de: "SMS-Nachrichten" }, included: false },
    ]
  },
  {
    id: "pro",
    name: { ar: "الاحترافية", en: "Professional", de: "Professional" },
    description: { 
      ar: "للعيادات النشطة التي تبحث عن النمو.", 
      en: "For active clinics seeking growth.", 
      de: "Für aktive Praxen." 
    },
    monthlyPrice: 1299,
    yearlyPrice: 12990,
    discountPercent: 10, // خصم خاص 10% على الباقة دي بس
    isPopular: true,
    ctaText: { ar: "اشترك الآن", en: "Subscribe Now", de: "Jetzt abonnieren" },
    features: [
      { key: "users", text: { ar: "عدد المستخدمين", en: "Users", de: "Benutzer" }, value: { ar: "5 مستخدمين", en: "5 Users", de: "5 Benutzer" }, included: true },
      { key: "patients", text: { ar: "عدد المرضى", en: "Patients", de: "Patienten" }, value: { ar: "غير محدود", en: "Unlimited", de: "Unbegrenzt" }, included: true },
      { key: "appt", text: { ar: "إدارة المواعيد", en: "Appointment Mgmt", de: "Terminverwaltung" }, included: true },
      { key: "insurance", text: { ar: "نظام التأمين", en: "Insurance System", de: "Versicherungssystem" }, included: true },
      { key: "sms", text: { ar: "رسائل SMS", en: "SMS Messages", de: "SMS-Nachrichten" }, value: { ar: "100 رسالة/شهر", en: "100 SMS/mo", de: "100 SMS/Monat" }, included: true },
    ]
  },
  {
    id: "enterprise",
    name: { ar: "المؤسسية", en: "Enterprise", de: "Enterprise" },
    description: { 
      ar: "للمراكز الطبية الكبيرة.", 
      en: "For large medical centers.", 
      de: "Für große medizinische Zentren." 
    },
    monthlyPrice: 3000, // Starting price
    yearlyPrice: 30000,
    discountPercent: 0,
    isPopular: false,
    ctaText: { ar: "تواصل معنا", en: "Contact Us", de: "Kontaktieren" },
    features: [
      { key: "users", text: { ar: "عدد المستخدمين", en: "Users", de: "Benutzer" }, value: { ar: "غير محدود", en: "Unlimited", de: "Unbegrenzt" }, included: true },
      { key: "patients", text: { ar: "عدد المرضى", en: "Patients", de: "Patienten" }, value: { ar: "غير محدود", en: "Unlimited", de: "Unbegrenzt" }, included: true },
      { key: "appt", text: { ar: "إدارة المواعيد", en: "Appointment Mgmt", de: "Terminverwaltung" }, included: true },
      { key: "insurance", text: { ar: "نظام التأمين", en: "Insurance System", de: "Versicherungssystem" }, included: true },
      { key: "sms", text: { ar: "رسائل SMS", en: "SMS Messages", de: "SMS-Nachrichten" }, value: { ar: "باقات مخصصة", en: "Custom bundle", de: "Benutzerdefiniert" }, included: true },
    ]
  }
];

import { Notification } from "@/types/index";

export const dummyNotifications: Notification[] = [
  { 
    id: 1, 
    message: {
      ar: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا",
      en: "Your appointment with Dr. Ahmed is tomorrow at 10:00 AM",
      de: "Ihr Termin bei Dr. Ahmed ist morgen um 10:00 Uhr"
    },
    date: "2025-08-11", 
    time: "09:30",
    read: false, 
    type: "appointment"
  },
  { 
    id: 2, 
    message: {
      ar: "تم تأكيد الحجز الخاص بك",
      en: "Your booking has been confirmed",
      de: "Ihre Buchung wurde bestätigt"
    },
    date: "2025-08-10", 
    time: "14:15",
    read: true, 
    type: "confirmation"
  },
  { 
    id: 3, 
    message: {
      ar: "تم إلغاء الموعد بناءً على طلبك",
      en: "Appointment cancelled as per your request",
      de: "Termin auf Ihren Wunsch storniert"
    },
    date: "2025-08-09", 
    time: "16:45",
    read: false, 
    type: "cancellation"
  },
  { 
    id: 4, 
    message: {
      ar: "تذكير: موعدك بعد ساعتين مع د. محمد",
      en: "Reminder: Your appointment with Dr. Mohamed is in 2 hours",
      de: "Erinnerung: Ihr Termin bei Dr. Mohamed ist in 2 Stunden"
    },
    date: "2025-08-12", 
    time: "08:00",
    read: false, 
    type: "reminder"
  },
  { 
    id: 5, 
    message: {
      ar: "تم تحويل موعدك مع د. سارة إلى يوم الخميس",
      en: "Your appointment with Dr. Sarah was moved to Thursday",
      de: "Ihr Termin bei Dr. Sarah wurde auf Donnerstag verschoben"
    },
    date: "2025-08-08", 
    time: "11:20",
    read: true, 
    type: "appointment"
  },
];
// data.ts (Update)
import { Clinic, InventoryItem } from "@/types/index";


// ============================================
// 1. القاموس الذكي للأصناف (Smart Presets)
// ============================================
export const SPECIALTY_PRESETS = {
  dental: [
    { ar: "بنج (ليدوكائين)", en: "Lidocaine", de: "Lidocain" },
    { ar: "حشوات كومبوزيت", en: "Composite Filling", de: "Kompositfüllung" },
    { ar: "إبر عصب (Files)", en: "Root Canal Files", de: "Wurzelkanalfeilen" },
    { ar: "قطن طبي", en: "Cotton Rolls", de: "Watterollen" }
  ],
  cardio: [
    { ar: "قسطرة تشخيصية 5F", en: "Diagnostic Catheter 5F", de: "Diagnosekatheter" },
    { ar: "بالون توسيع", en: "Angioplasty Balloon", de: "Angioplastie-Ballon" },
    { ar: "هيبارين", en: "Heparin", de: "Heparin" },
    { ar: "سلك توجيه (Guidewire)", en: "Guidewire", de: "Führungsdraht" }
  ],
  eye: [
    { ar: "قطرة توسيع", en: "Mydriatic Drops", de: "Mydriatische Tropfen" },
    { ar: "عدسة IOL", en: "IOL Lens", de: "IOL-Linse" }
  ],
  general: [
    { ar: "شاش معقم", en: "Sterile Gauze", de: "Sterile Gaze" },
    { ar: "سرنجات 5مل", en: "Syringes 5ml", de: "Spritzen 5ml" },
    { ar: "قفازات لاتكس", en: "Latex Gloves", de: "Latexhandschuhe" }
  ]
};

// ============================================
// 2. بيانات العيادات (Updated Dummy Data)
// ============================================
export const dummyClinics: Clinic[] = [
  {
    id: "CL-101",
    name: { ar: "مركز النخبة للقلب", en: "Elite Heart Center", de: "Elite-Herzzentrum" },
    type: { ar: "قلب وأوعية دموية", en: "Cardiology", de: "Kardiologie" },
    specialtyKey: "cardio", // هذا المفتاح يحدد الأصناف المقترحة
    description: { ar: "مركز متخصص...", en: "Specialized center...", de: "Spezialisiertes..." },
    address: { ar: "القاهرة الجديدة", en: "New Cairo", de: "Neu-Kairo" },
    phone: "+20 2 2555 1234",
    email: "heart@telecare.com",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    status: "active",
    rating: 4.9,
    openHours: "24/7",
    stats: { doctors: 15, nurses: 40, dailyCapacity: 120, currentOccupancy: 85, monthlyVisits: 3200 },
    amenities: [],
    // الموظفين والرواتب
    staff: [
      {
        id: "ST-001",
        name: { ar: "د. أحمد سعيد", en: "Dr. Ahmed Saeed", de: "Dr. Ahmed Saeed" },
        role: { ar: "استشاري قلب", en: "Cardiology Consultant", de: "Kardiologie-Berater" },
        roleType: "doctor",
        status: "on-duty",
        avatar: "https://i.pravatar.cc/150?u=ST-001",
        payroll: {
          salary: 35000,
          currency: "EGP",
          frequency: "monthly",
          nextPaymentDate: "2025-12-01",
          status: "pending"
        }
      },
      {
        id: "ST-002",
        name: { ar: "سارة محمد", en: "Sarah Mohamed", de: "Sarah Mohamed" },
        role: { ar: "رئيسة التمريض", en: "Head Nurse", de: "Oberschwester" },
        roleType: "nurse",
        status: "on-duty",
        avatar: "https://i.pravatar.cc/150?u=ST-002",
        payroll: {
          salary: 8000,
          currency: "EGP",
          frequency: "monthly",
          nextPaymentDate: "2025-12-01",
          status: "paid"
        }
      }
    ],
    // المخزون
    inventory: [
      {
        id: "INV-001",
        itemName: { ar: "قسطرة قلبية 5F", en: "Cardiac Catheter 5F", de: "Herzkatheter 5F" },
        category: { ar: "مستهلكات جراحية", en: "Surgical", de: "Chirurgisch" },
        quantity: 12,
        threshold: 20,
        unit: { ar: "وحدة", en: "Units", de: "Einheiten" },
        status: "critical",
        wastedCount: 2,
        consumedCount: 45
      },
      {
        id: "INV-002",
        itemName: { ar: "أدرينالين أمبول", en: "Adrenaline Ampoules", de: "Adrenalin-Ampullen" },
        category: { ar: "أدوية طوارئ", en: "Emergency Meds", de: "Notfallmedikamente" },
        quantity: 150,
        threshold: 50,
        unit: { ar: "علبة", en: "Boxes", de: "Boxen" },
        status: "good",
        wastedCount: 0,
        consumedCount: 10
      }
    ]
  },
  {
    id: "CL-102",
    name: { ar: "عيادات الابتسامة للأسنان", en: "Smile Dental Clinics", de: "Smile Zahnkliniken" },
    type: { ar: "طب الأسنان", en: "Dentistry", de: "Zahnmedizin" },
    specialtyKey: "dental", // سيقترح بنج وحشوات
    description: { ar: "تجميل وزراعة...", en: "Cosmetic...", de: "Kosmetische..." },
    address: { ar: "المهندسين", en: "Mohandessin", de: "Mohandessin" },
    phone: "+20 2 3333 5678",
    email: "dental@telecare.com",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    status: "busy",
    rating: 4.7,
    openHours: "09:00 - 22:00",
    stats: { doctors: 8, nurses: 12, dailyCapacity: 60, currentOccupancy: 95, monthlyVisits: 1500 },
    amenities: [],
    staff: [
      {
        id: "ST-003",
        name: { ar: "د. هشام طلعت", en: "Dr. Hesham Talaat", de: "Dr. Hesham Talaat" },
        role: { ar: "طبيب أسنان", en: "Dentist", de: "Zahnarzt" },
        roleType: "doctor",
        status: "on-duty",
        avatar: "https://i.pravatar.cc/150?u=ST-003",
        payroll: {
          salary: 15000,
          currency: "EGP",
          frequency: "monthly",
          nextPaymentDate: "2025-12-05",
          status: "overdue"
        }
      }
    ],
    inventory: [
      {
        id: "INV-003",
        itemName: { ar: "بنج (ليدوكائين)", en: "Lidocaine", de: "Lidocain" },
        category: { ar: "أدوية", en: "Meds", de: "Medikamente" },
        quantity: 200,
        threshold: 50,
        unit: { ar: "أمبول", en: "Ampoules", de: "Ampullen" },
        status: "good",
        wastedCount: 5,
        consumedCount: 120
      }
    ]
  }
];