'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';



export default function LocalSwitcher() {

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const localeActive = useLocale();
  const t = useTranslations('Header');
  const languages = [
    { code: 'en', label: t('English'), flag: '/flags/uk.png' },
    { code: 'ar', label: t('Arabic'), flag: '/flags/ar.png' }
  ];


  const onSelectChange = (locale: string) => {
    startTransition(() => {
      router.replace(`/${locale}`);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={languages.find((lang) => lang.code === localeActive)?.flag || '/flags/uk.png'}
          alt="flag"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{localeActive.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => onSelectChange(lang.code)}
              disabled={isPending}
            >
              <div className="flex items-center gap-2">
                <img src={lang.flag} alt={lang.label} className="w-5 h-5" />
                <span className="text-sm text-gray-800 dark:text-gray-200">{lang.label}</span>
              </div>
              {localeActive === lang.code && <Check className="w-4 h-4 text-green-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
