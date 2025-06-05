"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface CtaSectionProps {
  titleKey: string;
  defaultTitle: string;
  subtitleKey: string;
  defaultSubtitle: string;
  cta1Key: string;
  defaultCta1: string;
  cta1Href: string;
  cta2Key?: string;
  defaultCta2?: string;
  cta2Href?: string;
}

export function CtaSection({
  titleKey,
  defaultTitle,
  subtitleKey,
  defaultSubtitle,
  cta1Key,
  defaultCta1,
  cta1Href,
  cta2Key,
  defaultCta2,
  cta2Href,
}: CtaSectionProps) {
  const t = useTranslations('Dashboard');
  const translate = (key: string, fallback?: string) => t(key, { default: fallback });

  return (
    <section id="cta" className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {translate(titleKey, defaultTitle)}
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          {translate(subtitleKey, defaultSubtitle)}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link href={cta1Href}>{translate(cta1Key, defaultCta1)}</Link>
          </Button>
          {cta2Key && defaultCta2 && cta2Href && (
             <Button size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href={cta2Href}>{translate(cta2Key, defaultCta2)}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
