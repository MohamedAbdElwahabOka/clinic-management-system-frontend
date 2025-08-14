"use client"; // Add this directive

import { useTranslations, type TranslationValues } from 'next-intl';
import * as React from 'react';

interface PageHeaderProps {
  titleKey?: string; // Explicit key for title
  title?: string; // Fallback or direct title
  titleValues?: TranslationValues; // For dynamic values in title
  descriptionKey?: string; // Explicit key for description
  description?: string; // Fallback or direct description
  descriptionValues?: TranslationValues; // For dynamic values in description
  children?: React.ReactNode; // For action buttons or other elements
  translation?: string; // Optional translation namespace
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
      const translation = t(key, values);
      return translation === key && defaultValue ? defaultValue : translation;
    },
    [t]
  );

  const headerTitle = titleKey ? translate(titleKey, titleValues, title) : title;
  const headerDescription = descriptionKey ? translate(descriptionKey, descriptionValues, description) : description;

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
