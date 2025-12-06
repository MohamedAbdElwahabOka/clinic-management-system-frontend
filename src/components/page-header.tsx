"use client"; 

import { useTranslations, type TranslationValues } from 'next-intl';
import * as React from 'react';

interface PageHeaderProps {
  titleKey?: string; 
  title?: string; 
  titleValues?: TranslationValues; 
  descriptionKey?: string; 
  description?: string; 
  descriptionValues?: TranslationValues; 
  children?: React.ReactNode; 
  translation?: string; 
}

export function PageHeader({
  titleKey,
  title,
  titleValues,
  descriptionKey,
  description,
  descriptionValues,
  children,
  translation
}: PageHeaderProps) {
  const t = useTranslations(translation || 'Dashboard');

  const translate = React.useCallback(
    (key: string, values?: TranslationValues, defaultValue?: string) => {
      // التأكد من وجود المفتاح لتجنب عرض المفتاح نفسه
      try {
          const translation = t(key, values);
          return translation === key && defaultValue ? defaultValue : translation;
      } catch (e) {
          return defaultValue || key;
      }
    },
    [t]
  );

  const headerTitle = titleKey ? translate(titleKey, titleValues, title) : title;
  const headerDescription = descriptionKey ? translate(descriptionKey, descriptionValues, description) : description;

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        {/* التعديل هنا: 
            استبدلت text-foreground بـ text-gray-900 dark:text-white
            عشان تضمن إن العنوان يبان في الدارك مود واللايت مود زي الهيدر
        */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {headerTitle}
        </h1>
        
        {headerDescription && (
          /* التعديل هنا:
             استبدلت text-muted-foreground بـ text-gray-500 dark:text-gray-400
          */
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {headerDescription}
          </p>
        )}
      </div>
      
      {/* تعديل بسيط:
          خليت الـ children (الزرار) ياخد العرض كامل في الموبايل (w-full)
          وبعدين يرجع طبيعي في الشاشات الأكبر (sm:w-auto)
          ده بيدي شكل أحسن في الموبايل
      */}
      {children && (
        <div className="flex-shrink-0 w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            {children}
        </div>
      )}
    </div>
  );
}