import { MetadataRoute } from 'next';

const BASE_URL = 'https://clinic-management-system-frontend.vercel.app'; // رابط موقعك

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/login', '/signup'];
  
  // 👇 زودنا 'de' هنا عشان الألماني
  const locales = ['ar', 'en', 'de'];

  return routes.flatMap((route) => {
    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
    }));
  });
}