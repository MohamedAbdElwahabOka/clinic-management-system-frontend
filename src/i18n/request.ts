import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // تحقق من أن locale هو أحد القيم المسموح بها
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // الآن نعرف أن locale صالح
  const typedLocale = routing.locales.includes(locale as any)
    ? (locale as 'en' | 'ar' | 'de')
    : routing.defaultLocale;

  return {
    locale: typedLocale,
    messages: (await import(`../../messages/${typedLocale}.json`)).default
  };
});
