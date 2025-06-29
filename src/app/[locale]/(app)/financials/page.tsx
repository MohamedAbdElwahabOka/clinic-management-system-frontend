"use client"
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookUser, Tags, Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

function Payments() {
  const locale = useLocale();
  const t = useTranslations('Financial');
  const translate = (key: string, fallback?: string) => {
    const translation = t(key);
    return translation === key && fallback ? fallback : translation;
  };
  const financialModules = [
    {
      titleKey: "servicePricing",
      defaultTitle: "Service Pricing",
      descriptionKey: "servicePricingDescription",
      defaultDescription: "Configure prices for medical services and procedures.",
      href: "/financials/pricing",
      icon: Tags,
    },
    {
      titleKey: "assistantPayouts",
      defaultTitle: "Assistant Payouts",
      descriptionKey: "assistantPayoutsDescription",
      defaultDescription: "Track and manage payouts for assistants.",
      href: "/financials/payouts",
      icon: Wallet,
    },
    {
      titleKey: "incomeExpenseLedger",
      defaultTitle: "Income & Expense Ledger",
      descriptionKey: "incomeExpenseLedgerDescription",
      defaultDescription: "Manage the clinic's financial ledger.",
      href: "/financials/ledger",
      icon: BookUser,
    },
  ];

  return (
    <div className='m-5'>
      <PageHeader
        title={t('financialManagement')}
        description={t('financialManagementDescription')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-5">
        {financialModules.map((mod) => {
          const title = translate(mod.titleKey) || mod.defaultTitle;
          return (
            <Card key={title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <mod.icon className="h-8 w-8 text-accent" />
                  <CardTitle className="text-xl">{title}</CardTitle>
                </div>
                <CardDescription>{translate(mod.descriptionKey) || mod.defaultDescription}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex w-full">
                <Button variant="outline" className="w-full flex" asChild={false}>
                  <Link href={`/${locale}${mod.href}`} className='flex items-center justify-between w-full'>
                    {t('goToModule', { moduleTitle: title })} <ArrowRight className="rtl:mr-2 rtl:ml-0 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}

export default Payments
