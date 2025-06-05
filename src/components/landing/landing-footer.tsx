"use client";

import * as React from 'react';
import { Link } from '@/i18n/navigation';
import { Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface FooterLink {
  href: string;
  labelKey: string;
  defaultLabel: string;
}

interface FooterLinkGroup {
  titleKey: string;
  defaultTitle: string;
  links: FooterLink[];
}

export function LandingFooter() {
  const t = useTranslations('Landing');
  const tHeader = useTranslations('Header');
  const tGlobal = useTranslations('Global');
  
  const translate = React.useCallback((key: string, defaultValue?: string, values?: Record<string, string | number>) => {
    let translation = t(key);
    if (translation === key && defaultValue) translation = defaultValue;
    // Only interpolate if values are provided and translation contains curly braces
    if (values && translation && /\{\w+\}/.test(translation)) {
      Object.entries(values).forEach(([k, v]) => {
        translation = translation.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    } else if (translation && /\{\w+\}/.test(translation)) {
      // If translation expects a variable but none provided, replace with empty string
      translation = translation.replace(/\{\w+\}/g, '');
    }
    return translation;
  }, [t]);
  const translateHeader = (key: string, fallback?: string) => tHeader(key, { default: fallback });
  const translateGlobal = (key: string, fallback?: string) => tGlobal(key, { default: fallback });
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const linkGroups: FooterLinkGroup[] = [
    {
      titleKey: "landingFooterProduct", defaultTitle: "Product",
      links: [
        { href: "#", labelKey: "landingFooterFeatures", defaultLabel: "Features" },
        { href: "#", labelKey: "landingHeaderNavPricing", defaultLabel: "Pricing" },
        { href: "#", labelKey: "landingFooterIntegrations", defaultLabel: "Integrations" },
        { href: "#", labelKey: "landingFooterUpdates", defaultLabel: "Updates" },
      ],
    },
    {
      titleKey: "landingFooterCompany", defaultTitle: "Company",
      links: [
        { href: "#", labelKey: "landingFooterAboutUs", defaultLabel: "About Us" },
        { href: "#", labelKey: "landingFooterCareers", defaultLabel: "Careers" },
        { href: "#footer-contact", labelKey: "landingFooterContact", defaultLabel: "Contact" },
        { href: "#", labelKey: "landingFooterBlog", defaultLabel: "Blog" },
      ],
    },
    {
      titleKey: "landingFooterResources", defaultTitle: "Resources",
      links: [
        { href: "#", labelKey: "landingFooterHelpCenter", defaultLabel: "Help Center" },
        { href: "#", labelKey: "landingFooterTutorials", defaultLabel: "Tutorials" },
        { href: "#", labelKey: "landingFooterApiDocs", defaultLabel: "API Docs" },
        { href: "#", labelKey: "landingFooterTerms", defaultLabel: "Terms" },
      ],
    },
    {
      titleKey: "landingFooterSocial", defaultTitle: "Social",
      links: [
        { href: "#", labelKey: "landingFooterFacebook", defaultLabel: "Facebook" },
        { href: "#", labelKey: "landingFooterTwitter", defaultLabel: "Twitter" },
        { href: "#", labelKey: "landingFooterLinkedIn", defaultLabel: "LinkedIn" },
        { href: "#", labelKey: "landingFooterInstagram", defaultLabel: "Instagram" },
      ],
    },
  ];

  // Helper for copyright with year
  const copyright = currentYear
    ? translate('landingFooterCopyright')
    : translateGlobal('loading');
  // "{{field}} is required.", { field: translateGlobal('dateOfBirth') }
  return (
    <footer id="footer-contact" className="bg-muted text-muted-foreground py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building className="h-7 w-7 text-primary" />
              <span className="text-xl font-semibold text-primary">
                {translateHeader('name', 'Clinica')}
              </span>
            </Link>
            <p className="text-sm mb-4 max-w-sm">
              {translate('landingFooterNewsletterTitle', 'Stay up to date with our latest news and offers.')}
            </p>
            <form className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder={translate('landingFooterNewsletterPlaceholder', 'Your email address')}
                className="bg-background"
              />
              <Button type="submit" variant="default">
                {translate('landingFooterNewsletterButton', 'Subscribe')}
              </Button>
            </form>
            <p className="text-xs mt-2">
              {translate('landingFooterNewsletterHint', 'By subscribing you agree to our Privacy Policy.')}
            </p>
          </div>
          {linkGroups.map((group) => (
            <div key={group.titleKey}>
              <h4 className="font-semibold text-foreground mb-3">
                {translate(group.titleKey, group.defaultTitle)}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <Button variant="link" asChild className="p-0 h-auto font-normal text-muted-foreground hover:text-primary hover:no-underline">
                      <Link href={link.href}>{translate(link.labelKey, link.defaultLabel)}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>
            {copyright}
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary">
              <Link href="#">{translate('landingFooterPrivacyPolicy', 'Privacy Policy')}</Link>
            </Button>
            <Button variant="link" asChild className="p-0 h-auto text-muted-foreground hover:text-primary">
              <Link href="#">{translate('landingFooterTermsOfService', 'Terms of Service')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
