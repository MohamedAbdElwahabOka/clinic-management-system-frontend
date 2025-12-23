import { SpecialtyPlugin, SpecialtyProps } from './types';
import  DefaultDataView  from './DefaultDataView'; // تأكد أن هذا الملف موجود أو عدل المسار

const plugins: SpecialtyPlugin[] = [];

// دالة لتسجيل تخصص جديد
export function registerSpecialty(plugin: SpecialtyPlugin) {
  plugins.push(plugin);
}

// دالة البحث عن الكومبوننت المناسب
export function resolveSpecialtyView(specialtyName: any): React.ComponentType<SpecialtyProps> {
  // تنظيف النص (Cardiology -> cardiology)
  const key = (typeof specialtyName === 'string' ? specialtyName : specialtyName?.en || specialtyName?.ar || '')
    .toLowerCase()
    .trim();

  const found = plugins.find((p) => p.match(key));
  
  return found ? found.Component : DefaultDataView;
}