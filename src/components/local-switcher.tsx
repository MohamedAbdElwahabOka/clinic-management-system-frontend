'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState, useTransition } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import Image from 'next/image';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
];

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const localeActive = useLocale();

  const onSelectChange = (locale: string) => {
    startTransition(() => {
      router.replace(`/${locale}`);
      setIsOpen(false);
    });
  };

  return (
    <div className='relative inline-block'>
      <button
        className='flex items-center gap-2 border-2 rounded-lg px-4 py-2 bg-white shadow-md hover:shadow-lg transition'
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* <Image
          src={languages.find((lang) => lang.code === localeActive) || '/flags/uk.png'}
          alt='flag'
          width={20}
          height={20}
        /> */}
        <ChevronDown className='w-4 h-4' />
      </button>
      {isOpen && (
        <div className='absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden'>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className='flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 transition'
              onClick={() => onSelectChange(lang.code)}
              disabled={isPending}
            >
              <div className='flex items-center gap-2'>
                {/* <Image src={lang.flag} alt={lang.label} width={20} height={20} /> */}
                <span>{lang.label}</span>
              </div>
              {localeActive === lang.code && <Check className='w-4 h-4 text-green-500' />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


// 'use client';

// import { useLocale } from 'next-intl';
// import { useRouter } from 'next/navigation';
// import { ChangeEvent, useTransition } from 'react';

// export default function LocalSwitcher() {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const localActive = useLocale();

//   const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const nextLocale = e.target.value;
//     startTransition(() => {
//       router.replace(`/${nextLocale}`);
//     });
//   };
//   return (
//     <label className='border-2 rounded'>
//       <p className='sr-only'>change language</p>
//       <select
//         defaultValue={localActive}
//         className='bg-transparent py-2'
//         onChange={onSelectChange}
//         disabled={isPending}
//       >
//         <option value='en'>English</option>
//         <option value='ar'>Arabic</option>
//       </select>
//     </label>
//   );
// }
