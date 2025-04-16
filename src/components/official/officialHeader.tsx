'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LocalSwitcher from '@/components/local-switcher';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

export default function OfficialHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('OfficialHeader');

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-md px-4 py-2">
      <div className="flex items-center justify-between w-full max-w-lg">

        <div className="hidden md:flex gap-7 items-center">
          <div className='flex items-center gap-2'>
            <Image src="/logo/logo.svg" width={20} height={20} alt="Logo" className="h-8 w-8" />
            <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">Clinica</h1>
          </div>
          <div className='flex gap-3'>
            <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">{t('HomePage')}</h1>
            <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">{t('Services')}</h1>
            <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">{t('AboutUs')}</h1>
            <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">{t('ContactUs')}</h1>
          </div>
        </div>

        <button
          className="md:hidden flex items-center justify-center p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className='flex items-center gap-3'>
            <Image src="/logo/logo.svg" width={20} height={20} alt="Logo" className="h-8 w-8" />
            <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">Clinica</h1>

            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="items-start justify-start h-6 w-6" />}
          </div>
        </button>

        {isMenuOpen && (
          <div>

            <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md p-4 md:hidden">
              <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('HomePage')}</h1>
              <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('Services')}</h1>
              <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('AboutUs')}</h1>
              <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">{t('ContactUs')}</h1>
              <div className='flex gap-3 py-3'>
                <Button>{t('Join')}</Button>
                <Button variant={'outline'} >
                  {t('Login')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex flex items-center  gap-3 ">
        <Button>{t('Join')}</Button>
        <Button variant={'outline'} >
          {t('Login')}
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2">
          <LocalSwitcher />
        </div>

        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center rounded-full border border-blue-500 p-1.5"
        >
          {darkMode ? <Moon className="h-5 w-5 text-gray-300" /> : <Sun className="h-5 w-5 text-yellow-400" />}
        </button>
      </div>
    </div>
  );
}