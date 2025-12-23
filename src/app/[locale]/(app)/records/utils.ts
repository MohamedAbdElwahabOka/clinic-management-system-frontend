import { LocalizedText } from "./types";

export const getLoc = (content: LocalizedText | string | undefined, locale: string) => {
  if (!content) return "";
  if (typeof content === "string") return content;
  
  const priorities: Record<string, string[]> = {
    'en': ['en', 'ar', 'de'],
    'ar': ['ar', 'en', 'de'],
    'de': ['de', 'en', 'ar'],
  };
  
  const searchOrder = priorities[locale] || ['ar', 'en', 'de'];
  
  for (const lang of searchOrder) {
    // @ts-ignore
    const value = content[lang];
    if (value && value.trim() !== "") return value;
  }
  return "";
};