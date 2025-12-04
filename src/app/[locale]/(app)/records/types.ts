// ============================================
// أنواع البيانات للسجل الطبي مع دعم التحكم بالوصول
// ============================================

export type Gender = "Male" | "Female";;

// معرف المصدر - محلي أو خارجي
export type SourceInfo = {
  doctorId: string;        // معرف الطبيب الذي أدخل البيانات
  clinicId: string;        // معرف العيادة/المستشفى
  createdAt: string;       // تاريخ الإدخال
  isLocal?: boolean;       // هل البيانات محلية (يتم حسابها)
};

export type VisitNote = {
  id?: string;
  date: string;
  doctorName: string;
  notes: string;
  department: string;
  type: string;
  source: SourceInfo;      // مصدر البيانات
};

export type LabTest = {
  id?: string;
  testName: string;
  result: string;
  unit?: string;
  range?: string;
  date?: string;
  category?: string;
  status?: string;
  trend?: 'up' | 'down' | 'stable';
  department?: string;
  source: SourceInfo;      // مصدر البيانات
};

export type RadiologyReport = {
  id: string;
  type: string;
  description: string;
  date?: string;
  images?: string[];
  doctor?: string;
  department?: string;
  bodyPart?: string;
  source: SourceInfo;      // مصدر البيانات
};

export type Prescription = {
  id: string;
  name: string;
  dose: string;
  freq: string;
  indication: string;
  startDate?: string;
  endDate?: string;
  source: SourceInfo;      // مصدر البيانات
};

export type Diagnosis = {
  id?: string;
  description: string;
  code?: string;
  source: SourceInfo;      // مصدر البيانات
};

export type Insurance = {
  provider: string;
  policy: string;
  coverage: string;
};

export type VitalTrend = {
  date: string;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  temperature: number;
  glucose: number;
  spo2: number;
  weight: number;
};

export type DrugInteraction = {
  drug1: string;
  drug2: string;
  severity: 'high' | 'moderate' | 'low';
  description: string;
  action: string;
};

export type Reminder = {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  type: 'followup' | 'test' | 'medication' | 'appointment';
  completed: boolean;
  patientId: string;
  notes?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  avatar?: string;
  bloodType?: string;
  maritalStatus?: string;
  occupation?: string;
  insurance?: Insurance;
  status?: {
    code: string;
    location: string;
    admissionDate?: string;
  };
  
  alerts?: Array<{ type: "critical" | "warning" | "info"; msg: string }>;
  
  vitalSigns?: {
    heartRate?: string;
    bloodPressure?: string;
    temperature?: string;
    glucose?: string;
    spo2?: string;
    weight?: string;
    height?: string;
    bmi?: string;
    respiratoryRate?: string;
  };
  
  personalInfo?: {
    allergies?: string[];
    chronicConditions?: string[];
    familyHistory?: string[];
    surgeries?: Array<{ procedure: string; year: string; hospital: string }>;
    vaccinations?: string[];
  };
  
  diagnoses?: Diagnosis[];
  medications?: Prescription[];
  labTests?: LabTest[];
  radiology?: RadiologyReport[];
  visitNotes?: VisitNote[];
  
  vitalTrends?: VitalTrend[];
  drugInteractions?: DrugInteraction[];
  reminders?: Reminder[];
};

// الطبيب الحالي المسجل دخوله
export const CURRENT_DOCTOR_ID = "DOC-CURRENT-001";
export const CURRENT_CLINIC_ID = "CLINIC-MAIN-001";

// أطباء خارجيون للمحاكاة
export const EXTERNAL_DOCTOR_ID = "DOC-OTHER-999";
export const EXTERNAL_CLINIC_ID = "CLINIC-EXT-999";
