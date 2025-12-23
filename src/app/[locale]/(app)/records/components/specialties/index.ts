import { registerSpecialty } from './registry';

// 1. Import Components
import  CardiologyDataView  from './CardiologyDataView';
import  OphthalmologyDataView  from './OphthalmologyDataView';
import  GastroenterologyDataView  from './GastroenterologyDataView';
import  UrologyDataView  from './UrologyDataView';
import  ENTDataView  from './ENTDataView';
import  DermatologyDataView  from './DermatologyDataView';
import  InternalMedicineDataView  from './InternalMedicineDataView';
// import  DentistryDataView  from './DentistryDataView'; // أو الملف الجديد الذي أنشأناه مؤقتاً

// 2. Register Plugins
// Cardiology
registerSpecialty({
  key: 'cardiology',
  match: (s) => s.includes('cardio') || s.includes('heart'),
  Component: CardiologyDataView,
});

// Ophthalmology
registerSpecialty({
  key: 'ophthalmology',
  match: (s) => s.includes('ophthalmology') || s.includes('eye') || s.includes('vision'),
  Component: OphthalmologyDataView,
});

// Gastroenterology
registerSpecialty({
  key: 'gastroenterology',
  match: (s) => s.includes('gastro') || s.includes('digestive'),
  Component: GastroenterologyDataView,
});

// Urology
registerSpecialty({
  key: 'urology',
  match: (s) => s.includes('uro') || s.includes('renal') || s.includes('kidney'),
  Component: UrologyDataView,
});

// ENT
registerSpecialty({
  key: 'ent',
  match: (s) => s.includes('ent') || s.includes('ear') || s.includes('nose') || s.includes('throat') || s.includes('sinus'),
  Component: ENTDataView,
});

// Dermatology
registerSpecialty({
  key: 'dermatology',
  match: (s) => s.includes('dermatology') || s.includes('skin'),
  Component: DermatologyDataView,
});

// Internal Medicine
registerSpecialty({
  key: 'internal_medicine',
  match: (s) => s.includes('internal') || s.includes('medicine'),
  Component: InternalMedicineDataView,
});

// // Dentistry
// registerSpecialty({
//   key: 'dentistry',
//   match: (s) => s.includes('dentis') || s.includes('dental') || s.includes('tooth'),
//   Component: DentistryDataView,
// });

// 3. Export Helper to be used in UI
export { resolveSpecialtyView } from './registry';
// export DefaultDataView  from './DefaultDataView';