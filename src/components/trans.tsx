// src/components/trans.tsx
"use client";

import * as React from 'react';
import { useTranslations } from 'next-intl';

interface TransProps {
  k: string; // translation key
  fallback?: string;
  options?: Record<string, string | number>;
  components?: Record<string, React.ReactElement>;
}

export const Trans: React.FC<TransProps> = ({ k, fallback, options, components }) => {
  const t = useTranslations('Patient');
  let translatedString = t(k);
  if (translatedString === k && fallback) translatedString = fallback;

  if (options && translatedString && /\{\w+\}/.test(translatedString)) {
    Object.entries(options).forEach(([key, value]) => {
      translatedString = translatedString.replace(new RegExp(`\{${key}\}`, 'g'), String(value));
    });
  } else if (translatedString && /\{\w+\}/.test(translatedString)) {
    translatedString = translatedString.replace(/\{\w+\}/g, '');
  }

  if (!components) {
    return <>{translatedString}</>;
  }

  const parts = translatedString.split(/(<C\d+>.*?<\/C\d+>)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^<C(\d+)>(.*?)<\/C\1>$/);
        if (match) {
          const componentIndex = match[1];
          const componentContent = match[2];
          const component = components[componentIndex];
          if (component && React.isValidElement(component)) {
            // حدد نوع props على أنه any لتجنب خطأ unknown
            const element = component as React.ReactElement<any>;
            return React.cloneElement(element, { key: index }, componentContent || element.props.children);
          }
        }
        return part;
      })}
    </>
  );
};
