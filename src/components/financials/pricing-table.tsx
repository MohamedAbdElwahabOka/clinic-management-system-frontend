"use client";

import type { ServicePrice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, Tags } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from 'next-intl';

interface ServicePricingTableProps {
  servicePrices: ServicePrice[];
  onEdit: (service: ServicePrice) => void;
  onDelete: (serviceId: string) => void;
}

export function ServicePricingTable({ servicePrices, onEdit, onDelete }: ServicePricingTableProps) {
  const { toast } = useToast();
  const t = useTranslations('Financial');

  const handleDeleteConfirm = (serviceId: string, serviceName: string) => {
    onDelete(serviceId);
    toast({
      title: t('serviceDeletedToast'),
      description: t('serviceDeletedDesc', { name: serviceName }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('currentServicePrices')}</CardTitle>
        <CardDescription>{t('currentServicePricesDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        {servicePrices.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right ltr:text-left">{t('serviceName')}</TableHead>
                  <TableHead className="text-right ltr:text-left">{t('price')}</TableHead>
                  <TableHead className="text-right ltr:text-left">{t('description')}</TableHead>
                  <TableHead className="text-right rtl:text-left">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicePrices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{`${service.price.toLocaleString()} ${service.currency}`}</TableCell>
                    <TableCell className="max-w-xs truncate">{service.description || t('no')}</TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(service)} className="mr-2 rtl:ml-2 rtl:mr-0" title={`${t('edit')} ${service.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title={`${t('delete')} ${service.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('confirmDeleteServiceTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('confirmDeleteServiceDesc', { name: service.name })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteConfirm(service.id, service.name)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Tags className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">{t('noServicesConfigured')}</p>
            <p className="text-sm text-muted-foreground">{t('noServicesConfiguredDesc')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

