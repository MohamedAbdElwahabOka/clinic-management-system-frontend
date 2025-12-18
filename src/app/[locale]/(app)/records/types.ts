// // ============================================
// // أنواع البيانات للسجل الطبي مع دعم التحكم بالوصول
// // ============================================

// export type Gender = "Male" | "Female";;

// // معرف المصدر - محلي أو خارجي
// export type SourceInfo = {
//   doctorId: string;        // معرف الطبيب الذي أدخل البيانات
//   clinicId: string;        // معرف العيادة/المستشفى
//   createdAt: string;       // تاريخ الإدخال
//   isLocal?: boolean;       // هل البيانات محلية (يتم حسابها)
// };

// export type VisitNote = {
//   id?: string;
//   date: string;
//   doctorName: string;
//   notes: string;
//   department: string;
//   type: string;
//   source: SourceInfo;      // مصدر البيانات
// };

// export type LabTest = {
//   id?: string;
//   testName: string;
//   result: string;
//   unit?: string;
//   range?: string;
//   date?: string;
//   category?: string;
//   status?: string;
//   trend?: 'up' | 'down' | 'stable';
//   department?: string;
//   source: SourceInfo;      // مصدر البيانات
// };

// export type RadiologyReport = {
//   id: string;
//   type: string;
//   description: string;
//   date?: string;
//   images?: string[];
//   doctor?: string;
//   department?: string;
//   bodyPart?: string;
//   source: SourceInfo;      // مصدر البيانات
// };

// export type Prescription = {
//   id: string;
//   name: string;
//   dose: string;
//   freq: string;
//   indication: string;
//   startDate?: string;
//   endDate?: string;
//   source: SourceInfo;      // مصدر البيانات
// };

// export type Diagnosis = {
//   id?: string;
//   description: string;
//   code?: string;
//   source: SourceInfo;      // مصدر البيانات
// };

// export type Insurance = {
//   provider: string;
//   policy: string;
//   coverage: string;
// };

// export type VitalTrend = {
//   date: string;
//   heartRate: number;
//   bloodPressureSys: number;
//   bloodPressureDia: number;
//   temperature: number;
//   glucose: number;
//   spo2: number;
//   weight: number;
// };

// export type DrugInteraction = {
//   drug1: string;
//   drug2: string;
//   severity: 'high' | 'moderate' | 'low';
//   description: string;
//   action: string;
// };

// export type Reminder = {
//   id: string;
//   title: string;
//   dueDate: string;
//   priority: 'high' | 'medium' | 'low';
//   type: 'followup' | 'test' | 'medication' | 'appointment';
//   completed: boolean;
//   patientId: string;
//   notes?: string;
// };

// export type Patient = {
//   id: string;
//   name: string;
//   dateOfBirth: string;
//   gender: Gender;
//   contactPhone?: string;
//   contactEmail?: string;
//   address?: string;
//   avatar?: string;
//   bloodType?: string;
//   maritalStatus?: string;
//   occupation?: string;
//   insurance?: Insurance;
//   status?: {
//     code: string;
//     location: string;
//     admissionDate?: string;
//   };
  
//   alerts?: Array<{ type: "critical" | "warning" | "info"; msg: string }>;
  
//   vitalSigns?: {
//     heartRate?: string;
//     bloodPressure?: string;
//     temperature?: string;
//     glucose?: string;
//     spo2?: string;
//     weight?: string;
//     height?: string;
//     bmi?: string;
//     respiratoryRate?: string;
//   };
  
//   personalInfo?: {
//     allergies?: string[];
//     chronicConditions?: string[];
//     familyHistory?: string[];
//     surgeries?: Array<{ procedure: string; year: string; hospital: string }>;
//     vaccinations?: string[];
//   };
  
//   diagnoses?: Diagnosis[];
//   medications?: Prescription[];
//   labTests?: LabTest[];
//   radiology?: RadiologyReport[];
//   visitNotes?: VisitNote[];
  
//   vitalTrends?: VitalTrend[];
//   drugInteractions?: DrugInteraction[];
//   reminders?: Reminder[];
// };

// // الطبيب الحالي المسجل دخوله
// export const CURRENT_DOCTOR_ID = "DOC-CURRENT-001";
// export const CURRENT_CLINIC_ID = "CLINIC-MAIN-001";

// // أطباء خارجيون للمحاكاة
// export const EXTERNAL_DOCTOR_ID = "DOC-OTHER-999";
// export const EXTERNAL_CLINIC_ID = "CLINIC-EXT-999";










// // src/app/records/types.ts

// export const CURRENT_DOCTOR_ID = "DOC-CURRENT-001";

// export interface LocalizedText {
//   en: string;
//   ar: string;
//   de: string;
// }

// export interface Attachment {
//   id: string;
//   type: 'image' | 'pdf' | 'dicom';
//   title: string;
//   url: string;
// }

// export interface Insurance {
//   provider: LocalizedText;
//   policy: string;
//   coverage: LocalizedText;
// }

// export interface Status {
//   code: LocalizedText;
//   location: LocalizedText;
// }

// export interface Alert {
//   type: 'critical' | 'warning' | 'info';
//   msg: LocalizedText;
// }

// export interface VitalSigns {
//   heartRate: string;
//   bloodPressure: string;
//   temperature: string;
//   glucose: string;
//   spo2: string;
//   weight: string;
//   height: string;
//   bmi: string;
//   // أضفنا هذا الحقل لرسم الرسم البياني
//   history: {
//     heartRate: number[];
//     bloodPressure: number[]; // السيستوليك فقط للتبسيط
//     glucose: number[];
//   };
// }

// export interface SourceInfo {
//   doctorId: string;
//   doctorName: LocalizedText;
//   clinicId: string;
//   clinicName: LocalizedText;
//   createdAt: string;
// }

// export interface MedicalRecordData {
//   id: string;
//   type: string;
//   title: LocalizedText;
//   description: LocalizedText;
//   source: SourceInfo;
//   accessControl: {
//     visibility: string;
//     requiresOTP: boolean;
//     sharedWithDoctorIds: string[];
//     expiresAt: string;
//   };
//   dataPayload: any;
//   attachments?: Attachment[]; // المرفقات المرتبطة بالسجل
//   createdAt: string;
// }

// export interface Visit {
//   id: string;
//   date: string;
//   doctorId: string;
//   doctorName: LocalizedText;
//   specialty: LocalizedText;
//   clinicId: string;
//   clinicName: LocalizedText;
//   notes: LocalizedText;
//   records: MedicalRecordData[];
// }

// export interface Patient {
//   id: string;
//   name: LocalizedText;
//   avatar: string;
//   dateOfBirth: string;
//   gender: LocalizedText;
//   bloodType: string;
//   contactPhone: string;
//   address: LocalizedText;
//   occupation: LocalizedText;
//   insurance: Insurance;
//   status: Status;
//   alerts: Alert[];
//   vitalSigns: VitalSigns;
//   visitsHistory: Visit[];
// }











// src/app/records/types.ts

export const CURRENT_DOCTOR_ID = "DOC-CURRENT-001";

export interface LocalizedText {
  en: string;
  ar: string;
  de: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'dicom';
  title: string;
  url: string;
}

export interface Insurance {
  provider: LocalizedText;
  policy: string;
  coverage: LocalizedText;
}

export interface Status {
  code: LocalizedText;
  location: LocalizedText;
}

export interface Alert {
  type: 'critical' | 'warning' | 'info';
  msg: LocalizedText;
}

export interface VitalSigns {
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  glucose: string;
  spo2: string;
  weight: string;
  height: string;
  bmi: string;
  history: {
    heartRate: number[];
    bloodPressure: number[];
    glucose: number[];
  };
}

export interface SourceInfo {
  doctorId: string;
  doctorName: LocalizedText;
  clinicId: string;
  clinicName: LocalizedText;
  createdAt: string;
}

export interface MedicalRecordData {
  id: string;
  type: string;
  title: LocalizedText;
  description: LocalizedText;
  source: SourceInfo;
  accessControl: {
    visibility: string;
    requiresOTP: boolean;
    sharedWithDoctorIds: string[];
    expiresAt: string;
  };
  dataPayload: any;
  attachments?: Attachment[];
  createdAt: string;
}

export interface Visit {
  id: string;
  date: string;
  doctorId: string;
  doctorName: LocalizedText;
  specialty: LocalizedText;
  clinicId: string;
  clinicName: LocalizedText;
  notes: LocalizedText;
  records: MedicalRecordData[];
}

// إضافة سجل التدقيق (Audit Log)
export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  reason?: string;
}

export interface Patient {
  id: string;
  name: LocalizedText;
  avatar: string;
  dateOfBirth: string;
  gender: LocalizedText;
  bloodType: string;
  contactPhone: string;
  address: LocalizedText;
  occupation: LocalizedText;
  insurance: Insurance;
  status: Status;
  alerts: Alert[];
  // أضفنا الأدوية الحالية للشريط العلوي
  currentMedications: string[]; 
  vitalSigns: VitalSigns;
  visitsHistory: Visit[];
  // أضفنا سجل التدقيق
  auditLogs: AuditLogEntry[];
}