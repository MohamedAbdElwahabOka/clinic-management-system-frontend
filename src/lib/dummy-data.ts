
import type { Patient, Appointment, QueueItem, AppointmentStatus,  VisitType, ServicePrice, LedgerCategory, LedgerEntry } from '@/types';

export const dummyPatients: Patient[] = [
  {
    id: 'PAT001',
    name: 'John Doe',
    dateOfBirth: '1985-07-20',
    gender: 'Male',
    contactPhone: '555-1234',
    contactEmail: 'john.doe@example.com',
    address: '123 Main St, Anytown, USA',
    lastVisit: '2023-10-15',
    medicalHistory: {
      allergies: ['Penicillin', 'Peanuts'],
      conditions: ['Hypertension'],
      medications: ['Lisinopril 10mg'],
    },
    visitNotes: [
      { id: 'VN001', date: '2023-10-15', doctorName: 'Dr. Smith', notes: 'Routine check-up. Blood pressure slightly elevated.' },
      { id: 'VN002', date: '2023-05-01', doctorName: 'Dr. Smith', notes: 'Flu symptoms. Prescribed Tamiflu.' },
    ],
  },
  {
    id: 'PAT002',
    name: 'Jane Smith',
    dateOfBirth: '1992-02-10',
    gender: 'Female',
    contactPhone: '555-5678',
    contactEmail: 'jane.smith@example.com',
    address: '456 Oak Ave, Anytown, USA',
    lastVisit: '2023-11-01',
    medicalHistory: {
      conditions: ['Asthma'],
      medications: ['Albuterol Inhaler'],
    },
  },
  {
    id: 'PAT003',
    name: 'Alice Johnson',
    dateOfBirth: '1978-12-01',
    gender: 'Female',
    contactPhone: '555-8765',
    contactEmail: 'alice.j@example.com',
    address: '789 Pine Ln, Anytown, USA',
    lastVisit: '2023-09-20',
  },
  {
    id: 'PAT004',
    name: 'Robert Brown',
    dateOfBirth: '1995-03-15',
    gender: 'Male',
    contactPhone: '555-1122',
    contactEmail: 'robert.b@example.com',
    address: '101 Maple Dr, Anytown, USA',
    lastVisit: new Date().toISOString(), // For testing, last visit today
  },
  {
    id: 'PAT005',
    name: 'Michael Davis',
    dateOfBirth: '1980-09-25',
    gender: 'Male',
    contactPhone: '555-3344',
    contactEmail: 'michael.d@example.com',
    address: '202 Birch Rd, Anytown, USA',
    lastVisit: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // 5 days ago
  },
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
