"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChartBig,
  FlaskConical,
  DollarSign,
  MoreHorizontal,
  Download,
  ChevronDown,
  Search,
  ListFilter,
  CalendarDays,
  BedDouble,
  BriefcaseMedical,
  CheckSquare,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { useTranslations } from 'next-intl';
import type { Appointment } from "@/types";
import { Locale } from "@/types";
import { dummyAppointments } from "@/lib/dummy-data"; // Assuming this provides appointments
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale/ar-SA";
import { cn } from "@/lib/utils";

// Dummy data for charts
const overallPatientsChartData = [
  { name: "Mon", patients: 50 },
  { name: "Tue", patients: 60 },
  { name: "Wed", patients: 55 },
  { name: "Thu", patients: 70 },
  { name: "Fri", patients: 65 },
  { name: "Sat", patients: 75 },
  { name: "Sun", patients: 77 },
];

const revenueChartData = [
  { name: "Jan", revenue: 400 },
  { name: "Feb", revenue: 300 },
  { name: "Mar", revenue: 500 },
  { name: "Apr", revenue: 450 },
  { name: "May", revenue: 522 },
  { name: "Jun", revenue: 600 },
];

const labTestsData = [
  { name: "Complete Blood Count", progress: 70 },
  { name: "Lipid Panel", progress: 50 },
  { name: "Basic Metabolic Panel", progress: 85 },
  { name: "Thyroid Panel", progress: 60 },
];

interface DashboardStatCardProps {
  title: string;
  value: string;
  percentageChange: string;
  percentagePositive: boolean;
  description: string;
  icon: React.ElementType;
  chart?: React.ReactNode;
  footerText?: string;
  className?: string;
  children?: React.ReactNode;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  percentageChange,
  percentagePositive,
  description,
  icon: Icon,
  chart,
  footerText,
  className,
  children
}) => {
  return (
    <Card className={cn("shadow-lg flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Icon className="h-5 w-5" />
            {title}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-baseline gap-2 pt-2">
          <p className="text-3xl font-bold">{value}</p>
          <Badge variant={percentagePositive ? "default" : "destructive"} className="text-xs">
            {percentagePositive ? '+' : ''}{percentageChange}
          </Badge>
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end pt-0">
        {chart || children}
        {footerText && <p className="text-xs text-muted-foreground text-right mt-1">{footerText}</p>}
      </CardContent>
    </Card>
  );
};


export default function DashboardClient({ locale }: { locale: Locale }) {
  const t = useTranslations("Dashboard");

  const translate = React.useCallback(
    (key: string, defaultValue?: string) => {
      const translation = t(key);
      return translation === key && defaultValue ? defaultValue : translation;
    },
    [t]
  );

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const formatDate = (dateString: string, formatStr: string = "dd/MM/yyyy") => {
    return format(parseISO(dateString), formatStr, { locale: locale === 'ar' ? arSA : undefined });
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), "p", { locale: locale === 'ar' ? arSA : undefined });
  };

  const getStatusBadgeVariant = (status: Appointment['status']): "default" | "destructive" | "outline" => {
    switch (status) {
      case "Scheduled":
      case "Confirmed":
      case "Arrived": // 'Booked' in screenshot, assuming this maps to Arrived or Confirmed
        return "default"; // Blue
      case "Completed": // 'Done' in screenshot
        return "default"; // Use default, apply green class below
      case "Cancelled":
      case "No Show":
        return "destructive"; // Red
      default:
        return "outline";
    }
  };

  // Filter appointments for today or upcoming
  const upcomingAppointmentsToday = dummyAppointments
    .filter(app => new Date(app.dateTime) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 5);


  return (
    <div className="flex flex-col gap-6 p-5">
      <PageHeader
        title={translate("dashboardWelcomeTitle", "Welcome Back, Dr Nabil Deraz")}
        description={translate("dashboardWelcomeSubtitle", "Lets recap your data for the past period")}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline">
            {translate("lastWeek", "Last Week")}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            {translate("export", "Export")}

          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardStatCard
              title={translate("overallPatients", "Overall Patients")}
              value="1,509"
              percentageChange="17.2%"
              percentagePositive={true}
              description={translate("overallPatientsDesc", "This analysis is collected over the last 7 days. An increase in patients is noticed from 212 to 302.")}
              icon={BarChartBig}
              className="bg-primary text-primary-foreground [&_*]:text-primary-foreground"
              footerText={`77 ${translate("patientsTodaySuffix", "today")}`}
            >
              <div className="h-20 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overallPatientsChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <Bar dataKey="patients" fill="hsl(var(--primary-foreground))" radius={[4, 4, 0, 0]} barSize={10} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fillOpacity: 0.7 }} dy={5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardStatCard>

            <DashboardStatCard
              title={translate("labTestRequested", "Lab Test Requested")}
              value="2,002"
              percentageChange="21.4%"
              percentagePositive={true}
              description={translate("labTestRequestedDesc", "Lab tests have been increased by 407 in the last 7 days. With a slight increase in X test for 327 patients.")}
              icon={FlaskConical}
            >
              <div className="space-y-2 mt-2 flex-grow">
                {labTestsData.slice(0, 3).map(test => (
                  <div key={test.name}>
                    <div className="h-2 w-full bg-muted rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${test.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardStatCard>

            <DashboardStatCard
              title={translate("revenueEarned", "Revenue Earned")}
              value={`7,802 ${translate("currencyLE", "L.E")}`}
              percentageChange="14.8%"
              percentagePositive={true}
              description={translate("revenueEarnedDesc", "Total revenue generated in the selected period.")}
              icon={DollarSign}
            >
              <div className="h-24 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dx={-5} />
                    <RechartsTooltip contentStyle={{ fontSize: '12px', padding: '4px 8px', borderRadius: 'var(--radius)' }} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardStatCard>
          </div>

          {/* Upcoming Appointments Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle>{translate("upcomingAppointmentsTitle", "Upcoming Appointments")}</CardTitle>
                  <CardDescription>{translate("upcomingAppointmentsSubtitle", "Appointments booked for the upcoming week")}</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={translate("searchPatientPlaceholder", "Search Patient")} className="pl-8 rtl:pr-8 w-full" />
                  </div>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    {translate("filterButton", "Filter")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right ltr:text-left">{translate("patientIdColumn", "Patient ID")}</TableHead>
                      <TableHead className="text-right ltr:text-left">{translate("patientNameColumn", "Patient Name")}</TableHead>
                      <TableHead className="text-right ltr:text-left">{translate("dateColumn", "Date")}</TableHead>
                      <TableHead className="text-right ltr:text-left">{translate("timeColumn", "Time")}</TableHead>
                      <TableHead className="justify-center items-center flex">{translate("appointmentStatusColumn", "Appointment Status")}</TableHead>
                      <TableHead className="text-right rtl:text-left">{translate("actionColumn", "Action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAppointmentsToday.length > 0 ? upcomingAppointmentsToday.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.patientId}</TableCell>
                        <TableCell>{app.patientName}</TableCell>
                        <TableCell>{formatDate(app.dateTime)}</TableCell>
                        <TableCell>{formatTime(app.dateTime)}</TableCell>
                        <TableCell className="flex items-center justify-center">
                          <Badge variant={getStatusBadgeVariant(app.status)} className={cn(
                            app.status === "Completed"
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : getStatusBadgeVariant(app.status) === 'default' && 'bg-blue-500 hover:bg-blue-600 text-white'
                          )}>
                            {app.status === "Completed" ? translate("statusDone", "Done") :
                              (app.status === "Scheduled" || app.status === "Confirmed" || app.status === "Arrived" ? translate("statusBooked", "Booked") :
                                translate(`status${app.status.replace(/\s+/g, "")}`, app.status))
                            }
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right rtl:text-left">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          {translate("noAppointmentsToday", "No appointments for today.")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {translate("appointmentsTitle", "Appointments")}
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border items-center justify-center w-full"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                locale={locale === 'ar' ? arSA : undefined}

              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5" />
                  {translate("nextPatientTitle", "Next Patient")}
                </CardTitle>
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                  {translate("statusNormal", "Normal")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
                  <AvatarFallback>KO</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base">Khaled Omar</p>
                  <p className="text-xs text-muted-foreground">Patient ID: #654223</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">{translate("patientAgeLabel", "Patient Age")}</p>
                  <p className="font-medium">51</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{translate("patientPhoneLabel", "Patient Phone Number")}</p>
                  <p className="font-medium">+20 1056442728</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">{translate("reservationTypeLabel", "Type of reservation")}</p>
                <p className="font-medium">{translate("revisitLabel", "Revisit")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{translate("medicalRecordLabel", "Medical record")}</p>
                <Button variant="link" className="p-0 h-auto text-primary">{translate("viewButton", "View")}</Button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="w-full">
                  <BriefcaseMedical className="mr-2 h-4 w-4" />{translate("requestNurseButton", "Request Nurse")}
                </Button>
                <Button className="w-full">
                  <CheckSquare className="mr-2 h-4 w-4" />{translate("enterPatientButton", "Enter Patient")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}