
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { ArrowLeft, Coins, CalendarDays, DollarSign, CalendarRange } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dummyAppointments } from "@/lib/dummy-data";
import type { Appointment, VisitType, Locale } from "@/types";
import { format, parseISO, startOfDay, isSameDay, startOfMonth, isSameMonth, isSameYear } from "date-fns";
import { arSA } from 'date-fns/locale/ar-SA';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

interface PayoutDetail {
  appointmentId: string;
  patientName: string;
  appointmentDateTime: string;
  visitType: VisitType;
  payoutAmount: number;
}

interface AssistantPayoutsPageProps {
  params: { locale: Locale };
}

const PAYOUT_AMOUNTS: Partial<Record<VisitType, number>> = {
  Examination: 10, 
  Consultation: 5,   
};

export default function AssistantPayoutsPage({ params }: AssistantPayoutsPageProps) {
  const { translate, locale } = useLanguage();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [dailyPayoutDetails, setDailyPayoutDetails] = React.useState<PayoutDetail[]>([]);
  const [totalDailyPayout, setTotalDailyPayout] = React.useState<number>(0);
  const [totalMonthlyPayout, setTotalMonthlyPayout] = React.useState<number>(0);
  const { toast } = useToast(); 

  React.useEffect(() => {
    if (!selectedDate) {
      setDailyPayoutDetails([]);
      setTotalDailyPayout(0);
      setTotalMonthlyPayout(0);
      return;
    }

    const targetDay = startOfDay(selectedDate);
    
    let currentTotalDailyPayout = 0;
    const currentDailyPayoutDetails: PayoutDetail[] = [];
    let currentTotalMonthlyPayout = 0;

    dummyAppointments.forEach(app => {
      const appointmentDate = parseISO(app.dateTime);
      const isCompleted = app.status === 'Completed';
      const payoutAmount = PAYOUT_AMOUNTS[app.visitType] || 0;

      if (isCompleted && payoutAmount > 0) {
        if (isSameDay(appointmentDate, targetDay)) {
          currentDailyPayoutDetails.push({
            appointmentId: app.id,
            patientName: app.patientName,
            appointmentDateTime: app.dateTime,
            visitType: app.visitType,
            payoutAmount: payoutAmount,
          });
          currentTotalDailyPayout += payoutAmount;
        }

        if (isSameMonth(appointmentDate, selectedDate) && isSameYear(appointmentDate, selectedDate)) {
          currentTotalMonthlyPayout += payoutAmount;
        }
      }
    });

    setDailyPayoutDetails(currentDailyPayoutDetails);
    setTotalDailyPayout(currentTotalDailyPayout);
    setTotalMonthlyPayout(currentTotalMonthlyPayout);

  }, [selectedDate]);

  const visitTypeLabels: Record<VisitType, string> = {
    Examination: translate('visitTypeExamination', "Examination (كشف)"),
    Consultation: translate('visitTypeConsultation', "Consultation (استشارة)"),
    "Follow-up": translate('visitTypeFollowUp', "Follow-up"),
    Procedure: translate('visitTypeProcedure', "Procedure"),
    Other: translate('visitTypeOther', "Other"),
  };

  const formatDate = (date: Date, formatString: string) => {
    return format(date, formatString, { locale: locale === 'ar' ? arSA : undefined });
  };
  
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), "p", { locale: locale === 'ar' ? arSA : undefined });
  }

  return (
    <>
      <PageHeader
        titleKey="assistantPayoutsTitle"
        descriptionKey="assistantPayoutsPageDescription"
      >
        <Button variant="outline" asChild>
          <Link href="/financials">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {translate('backToFinancials', "Back to Financials")}
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-accent" />
                {translate('payoutsSelectDate', "Select Date")}
              </CardTitle>
              <CardDescription>{translate('payoutsSelectDateDesc', "View payouts for a specific day and its month.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                locale={locale === 'ar' ? arSA : undefined}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                 <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                 {translate('payoutsSelectedDay', "Selected Day's Payout")}
              </CardTitle>
               <CardDescription>
                {selectedDate ? translate('payoutsForDate', "For {{date}}", {date: formatDate(selectedDate, "MMMM d, yyyy")}) : translate('selectDate', "No date selected")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                {totalDailyPayout.toLocaleString(locale === 'ar' ? 'ar-EG' : undefined)} {translate('currency', 'EGP')}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {translate('payoutsCalculatedForDay', "Calculated from {{count}} completed services on this day.", { count: dailyPayoutDetails.length})}
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                 <CalendarRange className="mr-2 h-5 w-5 text-blue-500" />
                 {translate('payoutsMonthlySummary', "Monthly Payout Summary")}
              </CardTitle>
               <CardDescription>
                {selectedDate ? translate('payoutsForMonth', "For {{monthYear}}", {monthYear: formatDate(selectedDate, "MMMM yyyy")}) : translate('selectDate', "No date selected")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">
                {totalMonthlyPayout.toLocaleString(locale === 'ar' ? 'ar-EG' : undefined)} {translate('currency', 'EGP')}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {translate('payoutsCalculatedForMonth', "Total payout from completed services in this month.")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="mr-2 h-6 w-6 text-accent" />
                {translate('payoutsDailyBreakdown', "Daily Payout Breakdown")}
              </CardTitle>
              <CardDescription>
                {translate('payoutsDailyBreakdownDesc', "Details of services contributing to the payout for {{date}}.", {date: selectedDate ? formatDate(selectedDate, "MMMM d, yyyy") : translate('selectDate', "the selected date")})}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailyPayoutDetails.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{translate('patient', "Patient")}</TableHead>
                        <TableHead>{translate('payoutsTime', "Time")}</TableHead>
                        <TableHead>{translate('payoutsServiceType', "Service Type")}</TableHead>
                        <TableHead className="text-right rtl:text-left">{translate('payoutsAmountEGP', "Payout (EGP)")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyPayoutDetails.map((detail) => (
                        <TableRow key={detail.appointmentId}>
                          <TableCell className="font-medium">{detail.patientName}</TableCell>
                          <TableCell>{formatTime(detail.appointmentDateTime)}</TableCell>
                          <TableCell>{visitTypeLabels[detail.visitType] || detail.visitType}</TableCell>
                          <TableCell className="text-right rtl:text-left">{detail.payoutAmount.toLocaleString(locale === 'ar' ? 'ar-EG' : undefined)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {translate('payoutsNoServices', "No completed 'Examination' or 'Consultation' services found for this date to calculate daily payouts.")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
