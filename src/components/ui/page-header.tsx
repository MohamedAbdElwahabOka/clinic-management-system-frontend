"use client"; // Add this directive

import { useTranslations } from "next-intl";

interface PageHeaderProps {
  titleKey?: string; // Explicit key for title
  title?: string; // Fallback or direct title
  descriptionKey?: string; // Explicit key for description
  description?: string; // Fallback or direct description
  descriptionValues?: Record<string, string | number>; // For dynamic values in description
  children?: React.ReactNode; // For action buttons or other elements
}

export function PageHeader({ titleKey, title, descriptionKey, description, children, descriptionValues }: PageHeaderProps) {
  const t = useTranslations('');

  // Helper translate function
  const translate = (key: string, fallback?: string) => t(key, { default: fallback });

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

