"use client"; // Add this directive

import { useTranslations } from 'next-intl';
import * as React from 'react';

interface PageHeaderProps {
  titleKey?: string; // Explicit key for title
  title?: string; // Fallback or direct title
  descriptionKey?: string; // Explicit key for description
  description?: string; // Fallback or direct description
  descriptionValues?: Record<string, string | number>; // For dynamic values in description
  children?: React.ReactNode; // For action buttons or other elements
  translation?: string; // Optional translation namespace
}

export function PageHeader({ titleKey, title, descriptionKey, description, children, descriptionValues,translation }: PageHeaderProps) {
  const t = useTranslations(translation || 'Dashboard');

  const translate = React.useCallback((key: string, defaultValue?: string) => {
    const translation = t(key);
    return translation === key && defaultValue ? defaultValue : translation;
  }, [t]);

  const headerTitle = titleKey ? translate(titleKey, title) : title;
  
  let headerDescription = descriptionKey ? translate(descriptionKey, description) : description;

  if (headerDescription && descriptionValues) {
    Object.keys(descriptionValues).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      headerDescription = headerDescription?.replace(regex, String(descriptionValues[key]));
    });
  }


  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{headerTitle}</h1>
        {headerDescription && (
          <p className="mt-1 text-sm text-muted-foreground">{headerDescription}</p>
        )}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
}

