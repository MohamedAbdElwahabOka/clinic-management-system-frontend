'use client';

import { useLocale } from 'next-intl';
import { useState, useTransition, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const localeActive = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null); // ريفيرنس للقائمة عشان نقفلها لما نضغط برا
  
  const t = useTranslations('Header');
  
  const languages = [
    { code: 'en', label: t('English'), flag: '/flags/uk.png' },
    { code: 'ar', label: t('Arabic'), flag: '/flags/ar.png' },
    { code: 'de', label: t('German'), flag: '/flags/de.png' }
  ];

  // قفل القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelectChange = (locale: string) => {
    startTransition(() => {
      const currentPath = pathname.replace(`/${localeActive}`, `/${locale}`);
      // الحفاظ على الـ query params زي ما هي
      const currentQuery = searchParams.toString();
      const finalUrl = currentQuery ? `${currentPath}?${currentQuery}` : currentPath;
      
      router.replace(finalUrl);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-1.5 rounded-full sm:rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={languages.find((lang) => lang.code === localeActive)?.flag || '/flags/uk.png'}
          alt="flag"
          className="w-5 h-5 rounded-full object-cover"
        />
        {/* إخفاء النص في الموبايل الضيق جداً وإظهاره في الشاشات الأكبر */}
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
            {localeActive.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div 
            /* التعديل المهم هنا:
               1. end-0: عشان القائمة تفتح للداخل مش لبره الشاشة
               2. z-[100]: عشان تظهر فوق أي حاجة تانية
            */
            className="absolute end-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-[100]"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-start"
              onClick={() => onSelectChange(lang.code)}
              disabled={isPending}
            >
              <div className="flex items-center gap-3">
                <img src={lang.flag} alt={lang.label} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{lang.label}</span>
              </div>
              {localeActive === lang.code && <Check className="w-4 h-4 text-[#0582EB]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}