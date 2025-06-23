"use client";

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation'; // Use next-intl's useRouter
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LogoutPage() {
  const router = useRouter();
  const t = useTranslations('Auth');
  const translate = (key: string, defaultValue?: string) => {
    const translation = t(key);
    return translation === key && defaultValue ? defaultValue : translation;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login'); // Use new path
    }, 1500); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-semibold text-foreground">{translate('loggingYouOut', "Logging you out...")}</h1>
      <p className="text-muted-foreground">{translate('logoutWaitMessage', "Please wait while we securely sign you out.")}</p>
    </div>
  );
}
