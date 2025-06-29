"use client"; 

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { ServicePricingTable } from "@/components/financials/pricing-table";
import { ServicePricingForm } from "@/components/financials/pricing-form";
import { dummyServicePrices } from "@/lib/dummy-data";
import type { ServicePrice } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';



export default function ServicePricingPage() {
  const t = useTranslations('Financial');
  const [servicePrices, setServicePrices] = React.useState<ServicePrice[]>(dummyServicePrices);
  const [editingService, setEditingService] = React.useState<ServicePrice | null>(null);

  const handleAddOrUpdateService = (service: ServicePrice) => {
    setServicePrices(prevPrices => {
      const existingIndex = prevPrices.findIndex(s => s.id === service.id);
      if (existingIndex > -1) {
        const updatedPrices = [...prevPrices];
        updatedPrices[existingIndex] = service;
        return updatedPrices;
      }
      return [...prevPrices, { ...service, id: service.id || `SRV${Date.now()}` }];
    });
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    setServicePrices(prevPrices => prevPrices.filter(s => s.id !== serviceId));
    if (editingService?.id === serviceId) {
        setEditingService(null);
    }
  };

  const handleEditService = (service: ServicePrice) => {
    setEditingService(service);
    const formElement = document.getElementById("service-pricing-form-card");
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearForm = () => {
    setEditingService(null);
  }

  return (
    <div className="m-5">
      <PageHeader
        title={t('pricingConfigTitle') || 'Service Pricing'}
        description={t('pricingConfigDescription') || 'Configure prices for medical services and procedures.'}
      >
        <Button variant="outline">
          <Link href="/financials" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToFinancials') || 'Back to Financials'}
          </Link>
        </Button>
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServicePricingTable
            servicePrices={servicePrices}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        </div>
        <div className="lg:col-span-1">
            <ServicePricingForm
                onSubmitService={handleAddOrUpdateService}
                initialService={editingService}
                onClearForm={handleClearForm}
            />
        </div>
      </div>
    </div>
  );
}
