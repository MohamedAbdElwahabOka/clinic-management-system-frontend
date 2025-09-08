import { useTranslations } from "next-intl";

export default function ClinicsPage() {
    const t = useTranslations('Clinics');
  return (
    <div className="p-5">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
