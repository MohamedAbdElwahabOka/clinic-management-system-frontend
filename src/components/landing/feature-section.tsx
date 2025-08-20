"use client";

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: LucideIcon;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
}

interface FeatureSectionProps {
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
  features?: Feature[];
  imageUrl?: string;
  imageAltKey?: string; // Changed from imageAlt
  defaultImageAlt?: string; // Added for fallback
  imageHint?: string;
  cta1Key?: string;
  defaultCta1?: string;
  cta1Href?: string;
  cta2Key?: string;
  defaultCta2?: string;
  cta2Href?: string;
  reverseLayout?: boolean;
  gridCols?: string; // e.g., "md:grid-cols-2" or "md:grid-cols-3"
  sectionId?: string;
}

export function FeatureSection({
  titleKey,
  defaultTitle,
  descriptionKey,
  defaultDescription,
  features,
  imageUrl,
  imageAltKey,        // Changed
  defaultImageAlt,   // Added
  imageHint,
  cta1Key,
  defaultCta1,
  cta1Href = "#",
  cta2Key,
  defaultCta2,
  cta2Href = "#",
  reverseLayout = false,
  gridCols = "md:grid-cols-2",
  sectionId,
}: FeatureSectionProps) {
  const t = useTranslations('Landing');
  const translate = (key: string, fallback?: string) => t(key, { default: fallback ?? "" });

  const content = (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
        {translate(titleKey, defaultTitle)}
      </h2>
      <p className="text-lg text-muted-foreground mb-8">
        {translate(descriptionKey, defaultDescription)}
      </p>
      {features && (
        <div className={`grid gap-6 ${features.length > 2 ? gridCols : 'md:grid-cols-2'} mb-8`}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <feature.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {translate(feature.titleKey, feature.defaultTitle)}
                </h3>
                <p className="text-muted-foreground">
                  {translate(feature.descriptionKey, feature.defaultDescription)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {(cta1Key || cta2Key) && (
        <div className="flex flex-wrap gap-4">
          {cta1Key && (
            <Button size="lg" asChild>
              <Link href={cta1Href}>{translate(cta1Key, defaultCta1)}</Link>
            </Button>
          )}
          {cta2Key && (
            <Button size="lg" variant="outline" asChild>
              <Link href={cta2Href}>{translate(cta2Key, defaultCta2)}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const imageContent = imageUrl && imageAltKey && defaultImageAlt && (
    <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[300px] rounded-lg shadow-xl overflow-hidden border border-border">
      <Image
        src={imageUrl}
        alt={translate(imageAltKey, defaultImageAlt)} // Use key and fallback
        fill
        style={{ objectFit: 'cover' }}
        data-ai-hint={imageHint || "feature illustration"}
      />
    </div>
  );

  return (
    <section id={sectionId} className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {imageUrl ? (
          <div className={cn("grid lg:grid-cols-2 gap-12 lg:gap-16 items-center", reverseLayout && "lg:grid-flow-col-dense")}>
            <div className={cn(reverseLayout && "lg:col-start-2")}>{content}</div>
            <div className={cn(reverseLayout && "lg:col-start-1 lg:row-start-1")}>{imageContent}</div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center lg:text-left rtl:lg:text-right">{content}</div>
        )}
      </div>
    </section>
  );
}
