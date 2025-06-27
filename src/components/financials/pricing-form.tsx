"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, PlusCircle, Eraser } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import type { ServicePrice } from "@/types";
import { useTranslations } from 'next-intl';

interface ServicePricingFormProps {
  onSubmitService: (data: ServicePrice) => void;
  initialService?: ServicePrice | null; 
  onClearForm: () => void;
}

export function ServicePricingForm({ onSubmitService, initialService, onClearForm }: ServicePricingFormProps) {
  const { toast } = useToast();
  const t = useTranslations('Financial');

  const getPricingFormSchema = () => z.object({
    id: z.string().optional(),
    name: z.string().min(3, t('errorServiceNameMin')),
    price: z.coerce.number().positive(t('errorAmountPositive')),
    currency: z.string().min(3, t('errorCurrencyRequired')).max(3, t('errorCurrencyMax')),
    description: z.string().optional(),
  });

  type PricingFormValues = z.infer<ReturnType<typeof getPricingFormSchema>>;
  
  const form = useForm<PricingFormValues>({
    resolver: zodResolver(getPricingFormSchema()),
    defaultValues: {
      name: "",
      price: 0,
      currency: "EGP",
      description: "",
      id: undefined,
    },
  });
  
  React.useEffect(() => {
    if (initialService) {
      form.reset(initialService);
    } else {
        form.reset({ name: "", price: 0, currency: "EGP", description: "", id: undefined });
    }
  }, [initialService, form]);

  function onSubmit(data: PricingFormValues) {
    const serviceData: ServicePrice = {
      id: data.id || `SRV${Date.now()}`,
      name: data.name,
      price: data.price,
      currency: data.currency.toUpperCase(),
      description: data.description,
    };
    onSubmitService(serviceData);
    toast({
      title: data.id ? t('serviceUpdatedToast') : t('serviceAddedToast'),
      description: t(data.id ? 'serviceUpdatedDesc' : 'serviceAddedDesc', { name: serviceData.name }),
    });
    handleClearAndReset();
  }

  const handleClearAndReset = () => {
    onClearForm(); 
    form.reset({ name: "", price: 0, currency: "EGP", description: "", id: undefined });
  }

  const isEditing = !!form.watch("id");
  const formTitle = isEditing ? t('editServicePrice') : t('addNewServicePrice');
  const formDescription = isEditing ? t('editServiceDesc') : t('addNewServiceDesc');

  return (
    <Card id="service-pricing-form-card">
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="service-pricing-form">
            <FormField name="id" control={form.control} render={({ field }) => <Input type="hidden" {...field} />} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('serviceName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('serviceNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('price')}</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder={t('pricePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('currency')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('currencyPlaceholder')} {...field} maxLength={3} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('descriptionOptional')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('briefServiceDescription')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                {isEditing && (
                    <Button type="button" variant="outline" onClick={handleClearAndReset}>
                        <Eraser className="mr-2 h-4 w-4" /> {t('cancelEdit')}
                    </Button>
                )}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" /> }
                {form.formState.isSubmitting
                    ? (isEditing ? t('updating') : t('adding'))
                    : (isEditing ? t('updateService') : t('addService'))}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
