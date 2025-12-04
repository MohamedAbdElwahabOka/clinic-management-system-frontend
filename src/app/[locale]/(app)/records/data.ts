import { 
  Patient, 
  CURRENT_DOCTOR_ID, 
  CURRENT_CLINIC_ID, 
  EXTERNAL_DOCTOR_ID, 
  EXTERNAL_CLINIC_ID,
  SourceInfo 
} from './types';

// ============================================
// دوال مساعدة لإنشاء مصدر البيانات
// ============================================

export const createLocalSource = (date: string): SourceInfo => ({
  doctorId: CURRENT_DOCTOR_ID,
  clinicId: CURRENT_CLINIC_ID,
  createdAt: date,
  isLocal: true,
});

export const createExternalSource = (date: string): SourceInfo => ({
  doctorId: EXTERNAL_DOCTOR_ID,
  clinicId: EXTERNAL_CLINIC_ID,
  createdAt: date,
  isLocal: false,
});

// ============================================
// بيانات تجريبية مع التحكم بالوصول
// ============================================

export const dummyPatients: Patient[] = [
  {
    id: "PAT-2025-001",
    name: "الحاج/ أحمد عبد الموجود السيد",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    dateOfBirth: "1958-04-12",
    gender: "Male",
    bloodType: "A+",
    contactPhone: "+20 123 456 7890",
    contactEmail: "ahmed.abdelmawgod@example.com",
    address: "12 شارع البحر، طنطا، الغربية",
    maritalStatus: "متزوج",
    occupation: "مهندس متقاعد",
    insurance: {
      provider: "التأمين الصحي الحكومي",
      policy: "EG-99821",
      coverage: "كامل"
    },
    status: {
      code: "Stable",
      location: "العيادات الخارجية",
      admissionDate: "2024-12-01"
    },
    alerts: [
      { type: "critical", msg: "حساسية مفرطة من البنسلين (Anaphylaxis Risk)" },
      { type: "warning", msg: "سكر الدم غير منتظم" },
      { type: "info", msg: "يحتاج متابعة أسبوعية" }
    ],
    vitalSigns: {
      heartRate: "88",
      bloodPressure: "145/90",
      temperature: "37.1",
      glucose: "185",
      spo2: "96",
      weight: "92",
      height: "175",
      bmi: "30.0",
      respiratoryRate: "18"
    },
    vitalTrends: [
      { date: "2024-10-01", heartRate: 85, bloodPressureSys: 140, bloodPressureDia: 88, temperature: 36.8, glucose: 170, spo2: 97, weight: 94 },
      { date: "2024-10-15", heartRate: 82, bloodPressureSys: 138, bloodPressureDia: 86, temperature: 36.9, glucose: 165, spo2: 97, weight: 93 },
      { date: "2024-11-01", heartRate: 88, bloodPressureSys: 142, bloodPressureDia: 89, temperature: 37.0, glucose: 180, spo2: 96, weight: 92.5 },
      { date: "2024-11-15", heartRate: 90, bloodPressureSys: 145, bloodPressureDia: 90, temperature: 37.1, glucose: 185, spo2: 96, weight: 92 },
    ],
    personalInfo: {
      allergies: ["البنسلين (Penicillin)", "الفراولة", "صبغة الأشعة"],
      chronicConditions: [
        "مرض السكري من النوع الثاني - منذ 15 سنة",
        "ارتفاع ضغط الدم - منذ 10 سنوات",
        "قصور الشريان التاجي",
        "خشونة الركبة"
      ],
      familyHistory: [
        "الأب: توفي بأزمة قلبية في عمر 60",
        "الأم: كانت تعاني من السكري والفشل الكلوي"
      ],
      surgeries: [
        { procedure: "قسطرة قلبية وتركيب دعامة", year: "2018", hospital: "مركز القلب بالمحلة" },
        { procedure: "استئصال الزائدة الدودية", year: "1995", hospital: "مستشفى الجامعة" }
      ],
      vaccinations: ["لقاح الإنفلونزا الموسمية (2024)", "لقاح كورونا (3 جرعات)"],
    },
    
    // التشخيصات - محلية وخارجية
    diagnoses: [
      { description: "ارتفاع ضغط الدم", code: "I10", source: createLocalSource("2024-11-01") },
      { description: "سكري من النوع الثاني", code: "E11", source: createLocalSource("2024-10-15") },
      { description: "قصور الشريان التاجي", code: "I25.1", source: createExternalSource("2023-05-20") }, // خارجي
      { description: "خشونة الركبة", code: "M17", source: createExternalSource("2022-08-10") }, // خارجي
    ],
    
    // الأدوية - محلية وخارجية
    medications: [
      { id: "MED-001", name: "Metformin XR", dose: "1000mg", freq: "مرتين يومياً", indication: "السكري", startDate: "2020-03-15", source: createLocalSource("2024-11-01") },
      { id: "MED-002", name: "Aspirin Protect", dose: "100mg", freq: "مرة يومياً", indication: "سيولة الدم", startDate: "2018-06-20", source: createExternalSource("2018-06-20") }, // خارجي
      { id: "MED-003", name: "Atorvastatin", dose: "40mg", freq: "مساءً", indication: "الكوليسترول", startDate: "2019-11-05", source: createLocalSource("2024-09-01") },
      { id: "MED-004", name: "Bisoprolol", dose: "5mg", freq: "مرة يومياً", indication: "الضغط", startDate: "2021-02-10", source: createExternalSource("2021-02-10") }, // خارجي
    ],
    
    // التحاليل - محلية وخارجية
    labTests: [
      { id: "LAB-001", testName: "HbA1c", result: "8.2", unit: "%", range: "< 5.7", date: "2024-11-28", category: "Chemistry", status: "high", trend: "up", department: "Endocrinology", source: createLocalSource("2024-11-28") },
      { id: "LAB-002", testName: "Fasting Glucose", result: "160", unit: "mg/dL", range: "70-100", date: "2024-11-28", category: "Chemistry", status: "high", trend: "stable", department: "Endocrinology", source: createLocalSource("2024-11-28") },
      { id: "LAB-003", testName: "Total Cholesterol", result: "240", unit: "mg/dL", range: "< 200", date: "2024-11-28", category: "Lipids", status: "high", trend: "up", department: "Cardiology", source: createLocalSource("2024-11-28") },
      { id: "LAB-004", testName: "Hemoglobin", result: "13.5", unit: "g/dL", range: "13-17", date: "2024-11-28", category: "Hematology", status: "normal", trend: "stable", department: "General Medicine", source: createLocalSource("2024-11-28") },
      // تحاليل خارجية (السجل الموحد)
      { id: "LAB-005", testName: "Creatinine", result: "1.2", unit: "mg/dL", range: "0.7-1.3", date: "2024-08-15", category: "Renal", status: "normal", department: "Nephrology", source: createExternalSource("2024-08-15") },
      { id: "LAB-006", testName: "ALT (SGPT)", result: "45", unit: "U/L", range: "7-56", date: "2024-06-20", category: "Liver", status: "normal", department: "Gastroenterology", source: createExternalSource("2024-06-20") },
      { id: "LAB-007", testName: "Troponin I", result: "0.01", unit: "ng/mL", range: "< 0.04", date: "2023-12-05", category: "Cardiac", status: "normal", department: "Cardiology", source: createExternalSource("2023-12-05") },
      { id: "LAB-008", testName: "TSH", result: "2.5", unit: "mIU/L", range: "0.4-4.0", date: "2024-03-10", category: "Endocrine", status: "normal", department: "Endocrinology", source: createExternalSource("2024-03-10") },
    ],
    
    // الأشعة - محلية وخارجية
    radiology: [
      { id: "R001", type: "Chest X-Ray", description: "لا يوجد مرض قلبي رئوي حاد.", date: "2024-11-20", doctor: "د. أحمد سعيد", department: "Pulmonology", bodyPart: "Chest", source: createLocalSource("2024-11-20") },
      { id: "R002", type: "Knee MRI", description: "تمزق الغضروف الهلالي مع تكوينات عظمية.", date: "2024-10-12", doctor: "د. علي العظام", department: "Orthopedics", bodyPart: "Knee", source: createLocalSource("2024-10-12") },
      // أشعة خارجية (السجل الموحد)
      { id: "R003", type: "Abdominal Ultrasound", description: "كبد دهني بسيط، لا حصوات في المرارة.", date: "2024-06-01", doctor: "د. محمد الباطنة", department: "Gastroenterology", bodyPart: "Abdomen", source: createExternalSource("2024-06-01") },
      { id: "R004", type: "Brain CT", description: "لا يوجد نزيف داخل الجمجمة أو كتل.", date: "2023-11-15", doctor: "د. سارة الأعصاب", department: "Neurology", bodyPart: "Brain", source: createExternalSource("2023-11-15") },
      { id: "R005", type: "Echocardiogram", description: "EF: 55%، قصور الصمام الميترالي البسيط", date: "2023-08-22", doctor: "د. إبراهيم القلب", department: "Cardiology", bodyPart: "Heart", source: createExternalSource("2023-08-22") },
    ],
    
    // ملاحظات الزيارات - محلية وخارجية
    visitNotes: [
      { id: "VN-001", date: "2024-11-28", doctorName: "د. أحمد سعيد", notes: "متابعة ضغط وسكر، نصح بتعديل النظام الغذائي.", department: "الباطنة", type: "متابعة", source: createLocalSource("2024-11-28") },
      { id: "VN-002", date: "2024-11-15", doctorName: "د. أحمد سعيد", notes: "فحص دوري، تحاليل مطلوبة", department: "الباطنة", type: "متابعة", source: createLocalSource("2024-11-15") },
      // زيارات خارجية
      { id: "VN-003", date: "2024-06-20", doctorName: "د. محمد الهضمي", notes: "شكوى من آلام المعدة، تم عمل منظار", department: "الجهاز الهضمي", type: "تشخيص", source: createExternalSource("2024-06-20") },
      { id: "VN-004", date: "2023-12-05", doctorName: "د. إبراهيم القلب", notes: "متابعة بعد القسطرة، الحالة مستقرة", department: "القلب", type: "متابعة", source: createExternalSource("2023-12-05") },
      { id: "VN-005", date: "2023-08-10", doctorName: "د. علي العظام", notes: "تشخيص خشونة الركبة، بدء العلاج الطبيعي", department: "العظام", type: "تشخيص", source: createExternalSource("2023-08-10") },
    ],
    
    drugInteractions: [
      {
        drug1: "Metformin",
        drug2: "Contrast Media",
        severity: "high",
        description: "خطر الحماض اللبني مع صبغة الأشعة",
        action: "إيقاف Metformin قبل 48 ساعة من صبغة الأشعة وبعدها"
      },
      {
        drug1: "Aspirin",
        drug2: "Warfarin",
        severity: "high",
        description: "زيادة خطر النزيف",
        action: "مراقبة INR بدقة إذا استخدما معاً"
      },
    ],
    reminders: [
      {
        id: "REM-001",
        title: "متابعة سكر الدم",
        dueDate: "2025-12-15",
        priority: "high",
        type: "followup",
        completed: false,
        patientId: "PAT-2025-001",
        notes: "تحليل HbA1c بعد 3 أشهر"
      },
    ]
  },
  {
    id: "PAT-2025-002",
    name: "مها أحمد محمد علي",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&h=128&q=80",
    dateOfBirth: "1985-05-15",
    gender: "Female",
    bloodType: "O+",
    contactPhone: "01000000000",
    contactEmail: "maha.arch@example.com",
    address: "6 أكتوبر، الجيزة",
    maritalStatus: "متزوجة",
    occupation: "مهندسة معمارية",
    insurance: {
      provider: "Bupa Global",
      policy: "EG-99821",
      coverage: "Platinum"
    },
    status: {
      code: "Stable",
      location: "العيادات الخارجية"
    },
    alerts: [
      { type: "warning", msg: "لم يتم إجراء فحص الماموجرام السنوي" },
      { type: "info", msg: "المريضة تفضل التواصل عبر الواتساب" }
    ],
    vitalSigns: {
      heartRate: "72",
      bloodPressure: "120/80",
      temperature: "36.8",
      glucose: "95",
      spo2: "98",
      weight: "68",
      height: "165",
      bmi: "24.5",
      respiratoryRate: "16"
    },
    personalInfo: {
      allergies: ["عشب اللقاح"],
      chronicConditions: ["Hypothyroidism (قصور الغدة الدرقية)", "Migraine (صداع نصفي مزمن)"],
      familyHistory: [
        "الأم: سرطان الثدي في عمر 55",
        "الأب: ارتفاع ضغط الدم في عمر 60"
      ],
    },
    diagnoses: [
      { description: "قصور الغدة الدرقية", code: "E03", source: createLocalSource("2024-11-01") },
      { description: "صداع نصفي مزمن", code: "G43", source: createExternalSource("2023-03-15") },
    ],
    medications: [
      { id: "MED-101", name: "Eltroxin", dose: "50mcg", freq: "يومياً", indication: "الغدة الدرقية", startDate: "2018-03-10", source: createLocalSource("2024-11-01") },
      { id: "MED-102", name: "Panadol Extra", dose: "500mg", freq: "حسب الحاجة", indication: "الصداع", startDate: "2020-05-15", source: createExternalSource("2020-05-15") },
    ],
    labTests: [
      { id: "LAB-101", testName: "TSH", result: "4.5", unit: "mIU/L", range: "0.4-4.0", date: "2024-11-15", category: "Endocrine", status: "high", department: "Endocrinology", source: createLocalSource("2024-11-15") },
      { id: "LAB-102", testName: "Free T4", result: "1.1", unit: "ng/dL", range: "0.8-1.8", date: "2024-11-15", category: "Endocrine", status: "normal", department: "Endocrinology", source: createLocalSource("2024-11-15") },
      { id: "LAB-103", testName: "CBC", result: "Normal", unit: "", range: "", date: "2024-06-10", category: "Hematology", status: "normal", department: "General", source: createExternalSource("2024-06-10") },
    ],
    visitNotes: [
      { id: "VN-101", date: "2024-11-15", doctorName: "د. سمية", notes: "فحص دوري، متابعة الغدة الدرقية", department: "الغدد الصماء", type: "فحص دوري", source: createLocalSource("2024-11-15") },
      { id: "VN-102", date: "2024-06-10", doctorName: "د. أحمد", notes: "شكوى من صداع متكرر", department: "الباطنة", type: "تشخيص", source: createExternalSource("2024-06-10") },
    ],
    radiology: [],
    reminders: []
  }
];
