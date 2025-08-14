import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const localeFromRequest = await requestLocale;

  // Type guard للتحقق من أن locale صالح
  const isValidLocale = (loc: string): loc is 'en' | 'ar' | 'de' =>
    routing.locales.includes(loc as 'en' | 'ar' | 'de');

  // استخدام type guard لتحديد قيمة locale
  const typedLocale =
    localeFromRequest && isValidLocale(localeFromRequest)
      ? localeFromRequest
      : routing.defaultLocale;

  return {
    locale: typedLocale,
    messages: (await import(`../../messages/${typedLocale}.json`)).default
  };
});
