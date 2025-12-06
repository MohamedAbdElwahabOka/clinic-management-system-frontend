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
  },
  {
    id: "PAT-2025-003",
    name: "مصطفى محمود حسين",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&h=128&q=80",
    dateOfBirth: "1960-08-20",
    gender: "Male",
    bloodType: "A+",
    contactPhone: "01222222222",
    contactEmail: "mustafa.m@example.com",
    address: "المعادي، القاهرة",
    maritalStatus: "متزوج",
    occupation: "لواء متقاعد",
    insurance: {
      provider: "Misr Insurance",
      policy: "EG-10293",
      coverage: "Gold"
    },
    status: {
      code: "Critical",
      location: "العناية المتوسطة"
    },
    alerts: [
      { type: "danger", msg: "حساسية شديدة للبنسلين" },
      { type: "warning", msg: "خطر السقوط (Fall Risk)" }
    ],
    vitalSigns: {
      heartRate: "85",
      bloodPressure: "150/95",
      temperature: "37.0",
      glucose: "180",
      spo2: "96",
      weight: "92",
      height: "178",
      bmi: "29.0",
      respiratoryRate: "18"
    },
    personalInfo: {
      allergies: ["Penicillin", "Sulfonamides"],
      chronicConditions: ["Type 2 Diabetes (السكري النوع الثاني)", "Hypertension (ارتفاع ضغط الدم)"],
      familyHistory: [
        "الأب: جلطة دماغية",
        "الأخ: أمراض القلب"
      ],
    },
    diagnoses: [
      { description: "السكري غير المنضبط", code: "E11", source: createLocalSource("2024-10-10") },
      { description: "ارتفاع ضغط الدم", code: "I10", source: createLocalSource("2024-10-10") },
    ],
    medications: [
      { id: "MED-201", name: "Glucophage XR", dose: "1000mg", freq: "مرتين يومياً", indication: "السكري", startDate: "2015-01-01", source: createExternalSource("2020-01-01") },
      { id: "MED-202", name: "Concor", dose: "5mg", freq: "صباحاً", indication: "الضغط", startDate: "2016-05-20", source: createLocalSource("2024-11-01") },
    ],
    labTests: [
      { id: "LAB-201", testName: "HbA1c", result: "8.2", unit: "%", range: "4.0-5.6", date: "2024-11-20", category: "Chemistry", status: "high", department: "Endocrinology", source: createLocalSource("2024-11-20") },
      { id: "LAB-202", testName: "Lipid Profile", result: "High LDL", unit: "", range: "", date: "2024-11-20", category: "Chemistry", status: "abnormal", department: "Cardiology", source: createLocalSource("2024-11-20") },
    ],
    visitNotes: [
      { id: "VN-201", date: "2024-11-20", doctorName: "د. هاني", notes: "تعديل جرعة الأنسولين ضروري", department: "الباطنة", type: "متابعة", source: createLocalSource("2024-11-20") },
    ],
    radiology: [],
    reminders: []
  },

  // المريض الثاني: طفل (حساسية صدرية)
  {
    id: "PAT-2025-004",
    name: "يوسف كريم سالم",
    avatar: "https://images.unsplash.com/photo-1596962853297-7e6e5a435167?auto=format&fit=crop&w=128&h=128&q=80",
    dateOfBirth: "2016-03-12",
    gender: "Male",
    bloodType: "B-",
    contactPhone: "01111111111", // رقم ولي الأمر
    contactEmail: "karim.salem@parent.com",
    address: "سموحة، الإسكندرية",
    maritalStatus: "أعزب",
    occupation: "طالب",
    insurance: {
      provider: "AXA",
      policy: "EG-KD-442",
      coverage: "Family Plus"
    },
    status: {
      code: "Stable",
      location: "المنزل"
    },
    alerts: [
      { type: "info", msg: "التواصل مع الأم في حالات الطوارئ" }
    ],
    vitalSigns: {
      heartRate: "90",
      bloodPressure: "100/65",
      temperature: "37.2",
      glucose: "88",
      spo2: "99",
      weight: "32",
      height: "135",
      bmi: "17.5",
      respiratoryRate: "22"
    },
    personalInfo: {
      allergies: ["فراولة", "وبر الحيوانات"],
      chronicConditions: ["Bronchial Asthma (حساسية صدرية)"],
      familyHistory: [
        "الأخ: أكزيما جلدية"
      ],
    },
    diagnoses: [
      { description: "نوبة ربو حادة", code: "J45", source: createLocalSource("2024-11-25") },
    ],
    medications: [
      { id: "MED-301", name: "Ventolin Inhaler", dose: "100mcg", freq: "عند اللزوم", indication: "توسيع الشعب", startDate: "2022-02-15", source: createExternalSource("2022-02-15") },
      { id: "MED-302", name: "Zyrtec", dose: "5ml", freq: "مساءً", indication: "الحساسية", startDate: "2024-11-25", source: createLocalSource("2024-11-25") },
    ],
    labTests: [
      { id: "LAB-301", testName: "CBC", result: "Eosinophilia", unit: "", range: "", date: "2024-11-25", category: "Hematology", status: "abnormal", department: "Pediatrics", source: createLocalSource("2024-11-25") },
    ],
    visitNotes: [
      { id: "VN-301", date: "2024-11-25", doctorName: "د. منى", notes: "تحسن ملحوظ في التنفس", department: "الأطفال", type: "كشف مستعجل", source: createLocalSource("2024-11-25") },
    ],
    radiology: [
       { id: "RAD-301", type: "X-Ray", area: "Chest", report: "Hyperinflation", date: "2024-11-25", source: createLocalSource("2024-11-25") }
    ],
    reminders: []
  },

  // المريض الثالث: شابة (إصابة ملاعب / عظام)
  {
    id: "PAT-2025-005",
    name: "رنا إبراهيم الشناوي",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128&q=80",
    dateOfBirth: "1998-11-05",
    gender: "Female",
    bloodType: "O-",
    contactPhone: "01555555555",
    contactEmail: "rana.des@example.com",
    address: "التجمع الخامس، القاهرة",
    maritalStatus: "آنسة",
    occupation: "مصممة جرافيك",
    insurance: {
      provider: "MetLife",
      policy: "EG-88712",
      coverage: "Standard"
    },
    status: {
      code: "Stable",
      location: "العلاج الطبيعي"
    },
    alerts: [],
    vitalSigns: {
      heartRate: "78",
      bloodPressure: "110/70",
      temperature: "36.6",
      glucose: "90",
      spo2: "99",
      weight: "60",
      height: "162",
      bmi: "22.8",
      respiratoryRate: "14"
    },
    personalInfo: {
      allergies: [],
      chronicConditions: [],
      familyHistory: [],
    },
    diagnoses: [
      { description: "تمزق الرباط الصليبي الأمامي", code: "S83", source: createExternalSource("2024-10-01") },
    ],
    medications: [
      { id: "MED-401", name: "Cataflam", dose: "50mg", freq: "عند الألم", indication: "مسكن", startDate: "2024-10-01", source: createExternalSource("2024-10-01") },
      { id: "MED-402", name: "Osteocare", dose: "1 tab", freq: "يومياً", indication: "مكمل غذائي", startDate: "2024-10-05", source: createLocalSource("2024-10-05") },
    ],
    labTests: [],
    visitNotes: [
      { id: "VN-401", date: "2024-12-01", doctorName: "د. ياسر", notes: "بدء جلسات التأهيل الحركي", department: "العلاج الطبيعي", type: "تأهيل", source: createLocalSource("2024-12-01") },
    ],
    radiology: [
      { id: "RAD-401", type: "MRI", area: "Right Knee", report: "Complete ACL Tear", date: "2024-10-01", source: createExternalSource("2024-10-01") }
    ],
    reminders: [
        { id: "REM-401", text: "موعد جلسة العلاج الطبيعي", date: "2024-12-08" }
    ]
  },
  {
    id: "PAT-2025-006",
    name: "فاطمة حسن السيد",
    avatar: "https://images.unsplash.com/photo-1551843021-d7563d0f0f28?auto=format&fit=crop&w=128&h=128&q=80",
    dateOfBirth: "1955-02-14",
    gender: "Female",
    bloodType: "A+",
    contactPhone: "01009988776",
    contactEmail: "fatma.hassan@family.com",
    address: "شبرا، القاهرة",
    maritalStatus: "أرملة",
    occupation: "ربة منزل",
    insurance: {
      provider: "HIO (التأمين الصحي)",
      policy: "GOV-99281",
      coverage: "Full Government Coverage"
    },
    status: {
      code: "Stable",
      location: "العيادات الخارجية - قلب"
    },
    alerts: [
      { type: "danger", msg: "تتعاطى أدوية سيولة (Warfarin) - خطر النزيف" },
      { type: "warning", msg: "ضعف سمع شديد (تحتاج التحدث بصوت عالٍ)" }
    ],
    vitalSigns: {
      heartRate: "65",
      bloodPressure: "135/85",
      temperature: "36.9",
      glucose: "140",
      spo2: "95",
      weight: "85",
      height: "158",
      bmi: "34.0",
      respiratoryRate: "18"
    },
    personalInfo: {
      allergies: ["Sulfa Drugs", "Aspirin (حساسية صدرية)"],
      chronicConditions: ["CHF (فشل عضلة القلب)", "CKD Stage 3 (قصور كلوي مزمن)", "Glaucoma (مياه زرقاء)"],
      familyHistory: ["الوالدة: جلطة بالمخ", "الوالد: سكري"],
    },
    // تشخيصات متراكمة من سجلات خارجية
    diagnoses: [
      { description: "Chronic Heart Failure (CHF)", code: "I50", source: createExternalSource("2018-05-20") },
      { description: "Atrial Fibrillation (رجفان أذيني)", code: "I48", source: createExternalSource("2019-03-15") },
      { description: "Type 2 Diabetes", code: "E11", source: createExternalSource("2010-01-01") },
      { description: "Chronic Kidney Disease - Stage 3", code: "N18.3", source: createExternalSource("2021-11-10") },
      { description: "Glaucoma - Both Eyes", code: "H40", source: createExternalSource("2022-06-05") },
      { description: "Osteoarthritis (خشونة المفاصل)", code: "M17", source: createLocalSource("2024-12-01") } // تشخيص حديث محلي
    ],
    medications: [
      { id: "MED-501", name: "Marevan (Warfarin)", dose: "3mg", freq: "مساءً", indication: "سيولة الدم", startDate: "2019-03-15", source: createExternalSource("2019-03-15") },
      { id: "MED-502", name: "Lasix", dose: "40mg", freq: "صباحاً", indication: "مدر للبول", startDate: "2018-05-20", source: createExternalSource("2018-05-20") },
      { id: "MED-503", name: "Lantus Solostar", dose: "20 Units", freq: "مساءً", indication: "السكري", startDate: "2015-02-10", source: createExternalSource("2015-02-10") },
      { id: "MED-504", name: "Atorvastatin", dose: "20mg", freq: "مساءً", indication: "الدهون", startDate: "2018-05-20", source: createExternalSource("2018-05-20") },
      { id: "MED-505", name: "Alphagan P", dose: "1 drop", freq: "مرتين", indication: "ضغط العين", startDate: "2022-06-05", source: createExternalSource("2022-06-05") },
      { id: "MED-506", name: "One-Alpha", dose: "0.25mcg", freq: "يومياً", indication: "الكلى/العظام", startDate: "2021-11-10", source: createExternalSource("2021-11-10") },
    ],
    labTests: [
      { id: "LAB-501", testName: "INR", result: "2.5", unit: "", range: "2.0-3.0", date: "2024-12-01", category: "Hematology", status: "normal", department: "Cardiology", source: createLocalSource("2024-12-01") },
      { id: "LAB-502", testName: "Creatinine", result: "1.8", unit: "mg/dL", range: "0.6-1.1", date: "2024-11-15", category: "Kidney Function", status: "high", department: "Nephrology", source: createExternalSource("2024-11-15") },
      { id: "LAB-503", testName: "eGFR", result: "45", unit: "mL/min", range: ">90", date: "2024-11-15", category: "Kidney Function", status: "low", department: "Nephrology", source: createExternalSource("2024-11-15") },
      { id: "LAB-504", testName: "HbA1c", result: "7.5", unit: "%", range: "4.0-5.6", date: "2024-10-01", category: "Endocrine", status: "abnormal", department: "Internal Med", source: createExternalSource("2024-10-01") },
    ],
    visitNotes: [
      { id: "VN-501", date: "2024-11-15", doctorName: "د. مغربي (مستشفى الهلال)", notes: "وظائف الكلى مستقرة نسبياً، الاستمرار على نفس الخطة", department: "الكلى", type: "متابعة خارجية", source: createExternalSource("2024-11-15") },
      { id: "VN-502", date: "2024-06-05", doctorName: "د. رمد (معهد الرمد)", notes: "ضغط العين 18 - مقبول", department: "الرمد", type: "فحص دوري", source: createExternalSource("2024-06-05") },
      { id: "VN-503", date: "2019-03-15", doctorName: "طوارئ القصر العيني", notes: "دخول رعابة مركزة - ذبذبة أذينية", department: "Cardiology", type: "Emergency", source: createExternalSource("2019-03-15") },
    ],
    radiology: [
        { id: "RAD-501", type: "Echocardiography", area: "Heart", report: "EF 40%, Dilated cardiomyopathy", date: "2024-01-20", source: createExternalSource("2024-01-20") }
    ],
    reminders: []
},

// 5. حالة حوادث قديمة (شاب - تاريخ جراحي كبير)
{
    id: "PAT-2025-007",
    name: "إبراهيم كمال العدوي",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=128&h=128&q=80",
    dateOfBirth: "1990-09-09",
    gender: "Male",
    bloodType: "AB+",
    contactPhone: "01122334455",
    contactEmail: "ibrahim.kamel@work.com",
    address: "الدقي، الجيزة",
    maritalStatus: "متزوج",
    occupation: "محاسب قانوني",
    insurance: {
      provider: "Allianz",
      policy: "EG-CORP-551",
      coverage: "Premium"
    },
    status: {
      code: "Stable",
      location: "العيادات الخارجية - عظام"
    },
    alerts: [
      { type: "info", msg: "يوجد شرائح ومسامير بالساق اليمنى (MRI Safety Warning)" },
      { type: "warning", msg: "تاريخ سابق للإدمان (أدوية مسكنة) - يرجى الحذر في وصف المخدرات" }
    ],
    vitalSigns: {
      heartRate: "70",
      bloodPressure: "120/80",
      temperature: "37.0",
      glucose: "95",
      spo2: "99",
      weight: "78",
      height: "175",
      bmi: "25.5",
      respiratoryRate: "16"
    },
    personalInfo: {
      allergies: ["Tramadol"],
      chronicConditions: ["Post-Traumatic Stress Disorder (PTSD)", "Chronic Back Pain (آلام ظهر مزمنة)", "HCV (تم الشفاء - تاريخ سابق)"],
      familyHistory: [],
    },
    diagnoses: [
      { description: "Multiple Fractures (History of RTA)", code: "T02", source: createExternalSource("2015-08-12") },
      { description: "Chronic Osteomyelitis (التهاب عظمي نقي)", code: "M86", source: createExternalSource("2016-02-20") },
      { description: "Hepatitis C (Resolved)", code: "B18.2", source: createExternalSource("2018-01-01") },
      { description: "Lumbar Disc Herniation L4-L5", code: "M51", source: createExternalSource("2020-05-10") },
      { description: "PTSD", code: "F43.1", source: createExternalSource("2016-01-01") }
    ],
    medications: [
      { id: "MED-601", name: "Sovaldi", dose: "400mg", freq: "انتهى الكورس", indication: "فيروس سي", startDate: "2018-01-01", source: createExternalSource("2018-01-01") },
      { id: "MED-602", name: "Gabapentin", dose: "300mg", freq: "مساءً", indication: "التهاب الأعصاب", startDate: "2020-05-10", source: createExternalSource("2020-05-10") },
      { id: "MED-603", name: "Celebrex", dose: "200mg", freq: "عند اللزوم", indication: "مسكن", startDate: "2023-01-01", source: createExternalSource("2023-01-01") },
      { id: "MED-604", name: "Cipralex", dose: "10mg", freq: "صباحاً", indication: "اكتئاب/قلق", startDate: "2016-06-01", source: createExternalSource("2016-06-01") },
    ],
    labTests: [
      { id: "LAB-601", testName: "HCV PCR", result: "Negative", unit: "", range: "", date: "2024-01-01", category: "Virology", status: "normal", department: "Hepatology", source: createExternalSource("2024-01-01") },
      { id: "LAB-602", testName: "ESR", result: "25", unit: "mm/hr", range: "0-15", date: "2024-11-30", category: "Hematology", status: "high", department: "Orthopedics", source: createLocalSource("2024-11-30") },
      { id: "LAB-603", testName: "CRP", result: "6.0", unit: "mg/L", range: "<5", date: "2024-11-30", category: "Hematology", status: "high", department: "Orthopedics", source: createLocalSource("2024-11-30") },
      { id: "LAB-604", testName: "Liver Function Tests", result: "Normal", unit: "", range: "", date: "2024-01-01", category: "Chemistry", status: "normal", department: "Internal Med", source: createExternalSource("2024-01-01") },
    ],
    visitNotes: [
      { id: "VN-601", date: "2015-08-12", doctorName: "مستشفى الطوارئ الجامعي", notes: "حادث سير، كسور متعددة، دخول العمليات فوراً", department: "Trauma Unit", type: "Emergency", source: createExternalSource("2015-08-12") },
      { id: "VN-602", date: "2016-02-20", doctorName: "أ.د عظام (خاص)", notes: "تنظيف جراحي لالتهاب العظام بالساق", department: "Orthopedics", type: "Surgery", source: createExternalSource("2016-02-20") },
      { id: "VN-603", date: "2018-04-01", doctorName: "معهد الكبد", notes: "استجابة ممتازة للعلاج الفيروسي", department: "Hepatology", type: "Follow-up", source: createExternalSource("2018-04-01") },
    ],
    radiology: [
       { id: "RAD-601", type: "CT Scan", area: "Whole Body", report: "Polytrauma CT Protocol", date: "2015-08-12", source: createExternalSource("2015-08-12") },
       { id: "RAD-602", type: "MRI", area: "Lumbar Spine", report: "L4-L5 Disc protrusion pressing on nerve root", date: "2020-05-10", source: createExternalSource("2020-05-10") },
       { id: "RAD-603", type: "X-Ray", area: "Right Tibia", report: "Healed fracture with metalwork in situ", date: "2023-01-15", source: createExternalSource("2023-01-15") }
    ],
    reminders: [
        { id: "REM-601", text: "متابعة دورية للكبد (سنوية)", date: "2025-01-01" }
    ]
}
];
