import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const modules: Array<{ namespace: string; path: string }> = [
  { namespace: "Landing", path: "../modules/Landing/locales" },
];

export default getRequestConfig(async ({ requestLocale }) => {
  const localeFromRequest = await requestLocale;

  const isValidLocale = (loc: string): loc is "en" | "ar" | "de" =>
    routing.locales.includes(loc as "en" | "ar" | "de");

  const typedLocale =
    localeFromRequest && isValidLocale(localeFromRequest)
      ? localeFromRequest
      : routing.defaultLocale;

  const baseMessages = (await import(`../../messages/${typedLocale}.json`))
    .default;

  for (const mod of modules) {
    try {
      const moduleMessages = (await import(`${mod.path}/${typedLocale}.json`))
        .default;

      baseMessages[mod.namespace] = {
        ...(baseMessages[mod.namespace] ?? {}),
        ...moduleMessages,
      };
    } catch {
      console.warn(
        `[i18n] Missing module locale: ${mod.path}/${typedLocale}.json`,
      );
    }
  }

  return {
    locale: typedLocale,
    messages: baseMessages,
  };
});
