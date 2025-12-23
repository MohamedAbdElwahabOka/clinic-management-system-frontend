import { ComponentType } from 'react';

export type SpecialtyProps = {
  data: any;
  locale: string;
};

export type SpecialtyPlugin = {
  key: string;
  // دالة تحدد هل هذا البلوجن مسؤول عن هذا التخصص أم لا
  match: (specialtyName: string) => boolean;
  // الكومبوننت الذي سيتم عرضه
  Component: ComponentType<SpecialtyProps>;
};