'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LocalSwitcher from '@/components/local-switcher';
import { Bell, Sun, Moon, Search } from 'lucide-react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const t = useTranslations('Header');

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
      <div className="flex items-center">
        <h1 className="ml-1 text-md font-semibold text-gray-800 dark:text-gray-200">{t('Dashboard')}</h1>
      </div>

      <div className="relative w-64 hidden md:block">
        <input
          type="text"
          placeholder={t('Search')}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md py-1.5 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="flex items-center space-x-3">
        <div className='p-2'>
          <LocalSwitcher />
        </div>

        <div className="relative border border-blue-500 p-1.5 rounded-full">
          <Bell className="h-5 w-5 text-gray-500 dark:text-gray-300 cursor-pointer" />
          <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
        </div>

        <button onClick={toggleDarkMode} className="flex items-center justify-center rounded-full border border-blue-500 p-1.5">
          {darkMode ? <Moon className="h-5 w-5 text-gray-300" /> : <Sun className="h-5 w-5 text-yellow-400" />}
        </button>
      </div>
    </div>
  );
}