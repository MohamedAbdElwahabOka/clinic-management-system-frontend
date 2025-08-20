"use client";

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

interface HeroSectionProps {
  titleKey: string;
  defaultTitle: string;
  subtitleKey: string;
  defaultSubtitle: string;
  cta1Key: string;
  defaultCta1: string;
  cta2Key: string;
  defaultCta2: string;
  imageUrl: string;
  imageAltKey: string; // Changed from imageAlt to imageAltKey
  defaultImageAlt: string; // Added for fallback
  imageHint?: string;
}

export function HeroSection({
  titleKey,
  defaultTitle,
  subtitleKey,
  defaultSubtitle,
  cta1Key,
  defaultCta1,
  cta2Key,
  defaultCta2,
  imageUrl,
  imageAltKey,       // Changed
  defaultImageAlt,  // Added
  imageHint
}: HeroSectionProps) {
  const t = useTranslations('Landing');
  const translate = (key: string, fallback?: string) => t(key, { default: fallback ?? "" });
  const locale  = useLocale();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
          {translate(titleKey, defaultTitle)}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          {translate(subtitleKey, defaultSubtitle)}
        </p>
        <div className="flex justify-center gap-4 mb-16">
          <Button size="lg" asChild>
            <Link href={`/${locale}/signup`}>
              {translate(cta1Key, defaultCta1)}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#management-features">{translate(cta2Key, defaultCta2)}</Link>
          </Button>
        </div>
        <div className="relative aspect-video max-w-5xl mx-auto rounded-lg shadow-2xl overflow-hidden border border-border">
          <Image
            src={imageUrl}
            alt={translate(imageAltKey, defaultImageAlt)} // Use key and fallback
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint={imageHint || "software dashboard"}
          />
        </div>
      </div>
    </section>
  );
}
