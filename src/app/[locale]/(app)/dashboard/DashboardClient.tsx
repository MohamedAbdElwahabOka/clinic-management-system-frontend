"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Search,
  ListFilter,
  BedDouble,
  BriefcaseMedical,
  CheckSquare,
  Settings,
  Star,
  Clock,
  Check,
  User,     // أيقونة للمريض الحالي
  Calendar  // أيقونة للمريض القادم
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from 'next-intl';
import type { Appointment } from "@/types";
import { Locale } from "@/types";
import { dummyAppointments } from "@/lib/dummy-data"; 
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale/ar-SA";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; 

// --- البيانات (لم تتغير) ---
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
  { name: "Mon", revenue: 300 },
  { name: "Tue", revenue: 500 },
  { name: "Wed", revenue: 450 },
  { name: "Thu", revenue: 522 },
  { name: "Fri", revenue: 600 },
  { name: "Sat", revenue: 400 },
];

const labTestsData = [
  { name: "Complete Blood Count", progress: 70 },
  { name: "Lipid Panel", progress: 50 },
  { name: "Basic Metabolic Panel", progress: 85 },
  { name: "Thyroid Panel", progress: 60 },
];

// --- مكون الكارت ---
interface DashboardStatCardProps {
  title: string;
  value: string;
  percentageChange: string;
  percentagePositive: boolean;
  description: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  footerText?: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  percentageChange,
  percentagePositive,
  description,
  icon: Icon,
  children,
  className,
  footerText
}) => {
  return (
    <Card className={cn("shadow-lg flex flex-col h-full transition-all duration-300 animate-in fade-in zoom-in-95", className)}>
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
        <CardDescription className="text-xs line-clamp-1" title={description}>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end pt-0">
        {children}
        {footerText && <p className="text-xs text-muted-foreground text-right mt-1">{footerText}</p>}
      </CardContent>
    </Card>
  );
};

export default function DashboardClient({ locale }: { locale: Locale }) {
  const t = useTranslations("Dashboard");
  const translate = React.useCallback((key: string, def?: string) => t(key) === key && def ? def : t(key), [t]);
  const router = useRouter();

  // --- إعدادات الكروت المتاحة ---
  const ALL_CARDS = {
    patients: {
      id: "patients",
      title: translate("overallPatients", "Overall Patients"),
      value: "18",
      change: "12 مريض",
      positive: true,
      desc: translate("overallPatientsDesc", "Patient analysis over last 7 days."),
      icon: BarChartBig,
      className: "bg-primary text-primary-foreground dark:bg-primary/5 dark:text-primary [&_*]:text-primary-foreground dark:[&_*]:text-primary",
      render: () => (
        <div className="h-20 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overallPatientsChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <Bar dataKey="patients" fill="currentColor" radius={[4, 4, 0, 0]} barSize={10} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "currentColor", fillOpacity: 0.7 }} dy={5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    labs: {
      id: "labs",
      title: translate("labTestRequested", "Lab Test Requested"),
      value: "3",
      change: "21.4%",
      positive: true,
      desc: translate("labTestRequestedDesc", "Lab tests statistics."),
      icon: FlaskConical,
      className: "",
      render: () => (
        <div className="space-y-2 mt-2 flex-grow">
          {labTestsData.slice(0, 3).map(test => (
            <div key={test.name}>
              <div className="h-2 w-full bg-muted rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${test.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    revenue: {
      id: "revenue",
      title: translate("revenueEarned", "Revenue Earned"),
      value: `7,802 ${translate("currencyLE", "L.E")}`,
      change: "14.8%",
      positive: true,
      desc: translate("revenueEarnedDesc", "Total revenue generated."),
      icon: DollarSign,
      className: "",
      render: () => (
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
      )
    },
    satisfaction: {
      id: "satisfaction",
      title: translate("patientSatisfaction", "Patient Satisfaction"),
      value: "4.8/5",
      change: "0.2",
      positive: true,
      desc: translate("basedOnReviews", "Based on recent reviews"),
      icon: Star,
      className: "",
      render: () => (
        <div className="flex gap-1 mt-4 justify-center">
          {[1, 2, 3, 4, 5].map(i => (
             <Star key={i} className={cn("h-6 w-6", i < 5 ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
          ))}
        </div>
      )
    },
    efficiency: {
      id: "efficiency",
      title: translate("avgWaitTime", "Avg Wait Time"),
      value: "14 min",
      change: "2 min",
      positive: true,
      desc: translate("waitTimeDesc", "Wait time better than avg"),
      icon: Clock,
      className: "",
      render: () => (
        <div className="mt-4 flex justify-center">
             <Badge variant="outline" className="px-4 py-1 border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
               {translate("optimalRange", "Optimal Range")}
             </Badge>
        </div>
      )
    }
  };

  const [selectedCardIds, setSelectedCardIds] = React.useState<string[]>(["patients", "labs", "revenue"]);

  const toggleCard = (cardId: string) => {
    setSelectedCardIds(current => {
      if (current.includes(cardId)) {
        if (current.length === 1) return current; 
        return current.filter(id => id !== cardId);
      } else {
        if (current.length < 3) {
          return [...current, cardId];
        } else {
          const newArray = [...current];
          newArray.shift(); // remove first
          newArray.push(cardId);
          return newArray;
        }
      }
    });
  };

  const formatDate = (dateString: string) => format(parseISO(dateString), "dd/MM/yyyy", { locale: locale === 'ar' ? arSA : undefined });
  const formatTime = (dateString: string) => format(parseISO(dateString), "p", { locale: locale === 'ar' ? arSA : undefined });

  const getStatusBadgeVariant = (status: Appointment['status']) => {
    return status === "Completed" || status === "Confirmed" ? "default" : status === "Cancelled" ? "destructive" : "outline";
  };

  const upcomingAppointmentsToday = dummyAppointments
    .filter(app => new Date(app.dateTime) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-5 w-full max-w-[100vw] overflow-x-hidden">
      <PageHeader
        title={translate("dashboardWelcomeTitle", "Welcome Back, Dr Nabil Deraz")}
        description={translate("dashboardWelcomeSubtitle", "Lets recap your data for the past period")}
      >
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 border-dashed">
                <Settings className="h-4 w-4" />
                {translate("customizeCards", "Customize Cards")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm leading-none mb-2 text-muted-foreground">{translate("selectUpTo3Cards", "Select up to 3 cards")}</h4>
                {Object.values(ALL_CARDS).map((card) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  return (
                    <div 
                      key={card.id} 
                      onClick={() => toggleCard(card.id)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors",
                        isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                         <card.icon className="h-4 w-4" />
                         <span>{card.title}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon">
             <Download className="h-4 w-4" />
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content (Cards + Table) */}
        <div className="lg:col-span-3 flex flex-col gap-6 w-full min-w-0">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCardIds.map((cardId) => {
              const cardData = ALL_CARDS[cardId as keyof typeof ALL_CARDS];
              if (!cardData) return null;
              
              return (
                <DashboardStatCard
                  key={cardData.id}
                  title={cardData.title}
                  value={cardData.value}
                  percentageChange={cardData.change}
                  percentagePositive={cardData.positive}
                  description={cardData.desc}
                  icon={cardData.icon}
                  className={cardData.className}
                >
                  {cardData.render()}
                </DashboardStatCard>
              );
            })}
            
            {selectedCardIds.length === 0 && (
               <div className="col-span-3 border border-dashed rounded-lg p-8 flex justify-center items-center text-muted-foreground">
                 {translate("selectFromCustomizeMenu", "Select cards from the Customize menu")}
               </div>
            )}
          </div>

          <Card className="shadow-lg w-full overflow-hidden">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>{translate("upcomingAppointmentsTitle", "Upcoming Appointments")}</CardTitle>
                  <CardDescription>{translate("upcomingAppointmentsSubtitle", "Appointments booked for the upcoming week")}</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={translate("searchPatientPlaceholder", "Search Patient")} className="pl-8 rtl:pr-8 w-full" />
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ListFilter className="mr-2 h-4 w-4" />
                    {translate("filterButton", "Filter")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto w-full">
                <Table className="min-w-[600px]">
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
                    {upcomingAppointmentsToday.map((app) => (
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
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right rtl:text-left">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6 w-full min-w-0">
          
          {/* ========================================================= */}
          {/* كارت المريض الحالي (أخضر هادئ) */}
          {/* ========================================================= */}
          <Card className="shadow-lg border-2 border-green-500/30 bg-green-50/50 dark:bg-green-950/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <User className="h-5 w-5" />
                  {translate("currentPatientLabel", "Current Patient")}
                </CardTitle>
                <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white animate-pulse shadow-sm">
                  {translate("statusInRoom", "In Room")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 ring-2 ring-green-600/20 ring-offset-2">
                  <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
                  <AvatarFallback>KO</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg text-green-800 dark:text-green-300">الحاج احمد</p>
                  <p className="text-xs text-muted-foreground">Patient ID: PAT-2025-001</p>
                </div>
              </div>
              <div className="bg-white/60 dark:bg-black/20 p-3 rounded-md space-y-2 border border-green-200/50 dark:border-green-800/30">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{translate("patientAgeLabel", "Patient Age")}</p>
                    <p className="font-semibold">51 Years</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{translate("patientPhoneLabel", "Phone")}</p>
                    <p className="font-semibold" dir="ltr">+20 1056442728</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-dashed border-green-200 dark:border-green-800 pt-2 mt-2">
                   <div>
                    <p className="text-xs text-muted-foreground">{translate("reservationTypeLabel", "Type")}</p>
                    <Badge variant="outline" className="mt-1 font-normal border-green-300 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">{translate("revisitLabel", "Revisit")}</Badge>
                  </div>
                   <div>
                    <p className="text-xs text-muted-foreground">{translate("medicalRecordLabel", "History")}</p>
                    <Button variant="link" className="p-0 h-auto text-green-700 text-xs font-semibold">
                      {translate("viewFullRecord", "Open Full Record")} &rarr;
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="w-full text-xs px-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  <BriefcaseMedical className="mr-2 h-4 w-4" />
                  {translate("endSessionButton", "End Session")}
                </Button>
                <Button
                onClick={() => router.push(`/${locale}/records/PAT-2025-001`)} 
                className="w-full text-xs px-2 bg-green-600 hover:bg-green-700 text-white">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  {translate("addPrescriptionButton", "Prescribe")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ========================================================= */}
          {/* كارت المريض التالي (أزرق هادئ) */}
          {/* ========================================================= */}
          <Card className="shadow-lg border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Calendar className="h-5 w-5" />
                  {translate("nextPatientTitle", "Next Patient")}
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                  {translate("statusNormal", "Waiting")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-blue-600/10">
                  <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
                  <AvatarFallback>KO</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base text-blue-900 dark:text-blue-300">Khaled Omar</p>
                  <p className="text-xs text-muted-foreground">Patient ID: #654223</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-white/60 dark:bg-black/20 p-2 rounded-md border border-blue-200/50 dark:border-blue-800/30">
                <div>
                  <p className="text-muted-foreground text-xs">{translate("patientAgeLabel", "Patient Age")}</p>
                  <p className="font-medium">51</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{translate("patientPhoneLabel", "Phone")}</p>
                  <p className="font-medium">+20 1056442728</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                    <p className="text-muted-foreground text-xs">{translate("reservationTypeLabel", "Type")}</p>
                    <p className="font-medium text-blue-700">{translate("revisitLabel", "Revisit")}</p>
                </div>
                <Button variant="link" className="p-0 h-auto text-blue-600 text-xs">{translate("viewButton", "View Record")}</Button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/50 dark:border-blue-800/30 mt-2">
                <Button variant="ghost" className="w-full text-xs px-2 hover:bg-blue-100/50 hover:text-blue-700">
                  <BriefcaseMedical className="mr-2 h-4 w-4" />{translate("requestNurseButton", "Call Nurse")}
                </Button>
                <Button className="w-full text-xs px-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckSquare className="mr-2 h-4 w-4" />{translate("enterPatientButton", "Call In")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}











// "use client";

// import * as React from "react";
// import { PageHeader } from "@/components/page-header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   BarChartBig,
//   FlaskConical,
//   DollarSign,
//   MoreHorizontal,
//   Download,
//   ChevronDown,
//   Search,
//   ListFilter,
//   CalendarDays,
//   BedDouble,
//   BriefcaseMedical,
//   CheckSquare,
//   LayoutDashboard, // أيقونة جديدة
//   Activity,       // أيقونة جديدة
//   CreditCard      // أيقونة جديدة
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   CartesianGrid,
// } from "recharts";
// // إضافة مكونات القائمة المنسدلة
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useTranslations } from 'next-intl';
// import type { Appointment } from "@/types";
// import { Locale } from "@/types";
// import { dummyAppointments } from "@/lib/dummy-data"; 
// import { format, parseISO } from "date-fns";
// import { arSA } from "date-fns/locale/ar-SA";
// import { cn } from "@/lib/utils";

// // ... (Data Constants remain unchanged) ...
// const overallPatientsChartData = [
//   { name: "Mon", patients: 50 },
//   { name: "Tue", patients: 60 },
//   { name: "Wed", patients: 55 },
//   { name: "Thu", patients: 70 },
//   { name: "Fri", patients: 65 },
//   { name: "Sat", patients: 75 },
//   { name: "Sun", patients: 77 },
// ];

// const revenueChartData = [
//   { name: "Mon", revenue: 300 },
//   { name: "Tue", revenue: 500 },
//   { name: "Wed", revenue: 450 },
//   { name: "Thu", revenue: 522 },
//   { name: "Fri", revenue: 600 },
//   { name: "Sat", revenue: 400 },
// ];

// const labTestsData = [
//   { name: "Complete Blood Count", progress: 70 },
//   { name: "Lipid Panel", progress: 50 },
//   { name: "Basic Metabolic Panel", progress: 85 },
//   { name: "Thyroid Panel", progress: 60 },
// ];

// interface DashboardStatCardProps {
//   title: string;
//   value: string;
//   percentageChange: string;
//   percentagePositive: boolean;
//   description: string;
//   icon: React.ElementType;
//   chart?: React.ReactNode;
//   footerText?: string;
//   className?: string;
//   children?: React.ReactNode;
// }

// const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
//   title,
//   value,
//   percentageChange,
//   percentagePositive,
//   description,
//   icon: Icon,
//   chart,
//   footerText,
//   className,
//   children
// }) => {
//   return (
//     <Card className={cn("shadow-lg flex flex-col h-full transition-all duration-300", className)}>
//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm font-medium">
//             <Icon className="h-5 w-5" />
//             {title}
//           </div>
//           <Button variant="ghost" size="icon" className="h-6 w-6">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex items-baseline gap-2 pt-2">
//           <p className="text-3xl font-bold">{value}</p>
//           <Badge variant={percentagePositive ? "default" : "destructive"} className="text-xs">
//             {percentagePositive ? '+' : ''}{percentageChange}
//           </Badge>
//         </div>
//         <CardDescription className="text-xs">{description}</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-grow flex flex-col justify-end pt-0">
//         {chart || children}
//         {footerText && <p className="text-xs text-muted-foreground text-right mt-1">{footerText}</p>}
//       </CardContent>
//     </Card>
//   );
// };


// export default function DashboardClient({ locale }: { locale: Locale }) {
//   const t = useTranslations("Dashboard");

//   const translate = React.useCallback(
//     (key: string, defaultValue?: string) => {
//       const translation = t(key);
//       return translation === key && defaultValue ? defaultValue : translation;
//     },
//     [t]
//   );

//   // تعريف حالة الفلتر (Overview, Clinical, Financial)
//   const [viewMode, setViewMode] = React.useState("overview");
//   const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

//   const formatDate = (dateString: string, formatStr: string = "dd/MM/yyyy") => {
//     return format(parseISO(dateString), formatStr, { locale: locale === 'ar' ? arSA : undefined });
//   };

//   const formatTime = (dateString: string) => {
//     return format(parseISO(dateString), "p", { locale: locale === 'ar' ? arSA : undefined });
//   };

//   const getStatusBadgeVariant = (status: Appointment['status']): "default" | "destructive" | "outline" => {
//     switch (status) {
//       case "Scheduled":
//       case "Confirmed":
//       case "Arrived": 
//         return "default"; 
//       case "Completed": 
//         return "default"; 
//       case "Cancelled":
//       case "No Show":
//         return "destructive"; 
//       default:
//         return "outline";
//     }
//   };

//   const upcomingAppointmentsToday = dummyAppointments
//     .filter(app => new Date(app.dateTime) >= new Date(new Date().setHours(0, 0, 0, 0)))
//     .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
//     .slice(0, 5);


//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-5 w-full max-w-[100vw] overflow-x-hidden">
//       <PageHeader
//         title={translate("dashboardWelcomeTitle", "Welcome Back, Dr Nabil Deraz")}
//         description={translate("dashboardWelcomeSubtitle", "Lets recap your data for the past period")}
//       >
//         {/* تم استبدال الأزرار القديمة بـ Select Filter */}
//         <div className="flex items-center gap-2 mt-2 md:mt-0">
//           <Select value={viewMode} onValueChange={setViewMode}>
//             <SelectTrigger className="w-[180px] bg-background border-input">
//               <SelectValue placeholder={translate("filterView", "Select View")} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="overview">
//                 <div className="flex items-center gap-2">
//                   <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
//                   <span>{translate("viewAll", "Overview")}</span>
//                 </div>
//               </SelectItem>
//               <SelectItem value="clinical">
//                 <div className="flex items-center gap-2">
//                   <Activity className="h-4 w-4 text-blue-500" />
//                   <span>{translate("viewClinical", "Clinical Data")}</span>
//                 </div>
//               </SelectItem>
//               <SelectItem value="financial">
//                 <div className="flex items-center gap-2">
//                   <CreditCard className="h-4 w-4 text-green-500" />
//                   <span>{translate("viewFinancial", "Financials")}</span>
//                 </div>
//               </SelectItem>
//             </SelectContent>
//           </Select>
          
//           <Button variant="outline" size="icon" title={translate("export", "Export")}>
//              <Download className="h-4 w-4" />
//           </Button>
//         </div>
//       </PageHeader>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Main content area */}
//         <div className="lg:col-span-3 flex flex-col gap-6 w-full min-w-0">
          
//           {/* Summary Cards Row - Dynamic Grid based on viewMode */}
//           <div className={cn(
//             "grid gap-6 transition-all duration-300 ease-in-out",
//             // تغيير عدد الأعمدة بناءً على العرض المختار
//             viewMode === 'overview' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
//             viewMode === 'clinical' ? "grid-cols-1 md:grid-cols-2" : 
//             "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // Financial view
//           )}>
            
//             {/* Card 1: Patients (Shows in Overview & Clinical) */}
//             {(viewMode === 'overview' || viewMode === 'clinical') && (
//               <DashboardStatCard
//                 title={translate("overallPatients", "Overall Patients")}
//                 value="18"
//                 percentageChange="12تم الكشف , 4 في الانتظار "
//                 percentagePositive={true}
//                 description={translate("overallPatientsDesc", "This analysis is collected over the last 7 days. An increase in patients is noticed from 212 to 302.")}
//                 icon={BarChartBig}
//                 className="bg-primary text-primary-foreground [&_*]:text-primary-foreground"
//               >
//                 <div className="h-20 mt-2">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={overallPatientsChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
//                       <Bar dataKey="patients" fill="hsl(var(--primary-foreground))" radius={[4, 4, 0, 0]} barSize={10} />
//                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#ffffff", fillOpacity: 1 }} dy={5} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </DashboardStatCard>
//             )}

//             {/* Card 2: Lab Tests (Shows in Overview & Clinical) */}
//             {(viewMode === 'overview' || viewMode === 'clinical') && (
//               <DashboardStatCard
//                 title={translate("labTestRequested", "Lab Test Requested")}
//                 value="3"
//                 percentageChange="21.4%"
//                 percentagePositive={true}
//                 description={translate("labTestRequestedDesc", "Lab tests have been increased by 407 in the last 7 days. With a slight increase in X test for 327 patients.")}
//                 icon={FlaskConical}
//               >
//                 <div className="space-y-2 mt-2 flex-grow">
//                   {labTestsData.slice(0, 3).map(test => (
//                     <div key={test.name}>
//                       <div className="h-2 w-full bg-muted rounded-full">
//                         <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${test.progress}%` }}></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </DashboardStatCard>
//             )}

//             {/* Card 3: Revenue (Shows in Overview & Financial) */}
//             {(viewMode === 'overview' || viewMode === 'financial') && (
//               <DashboardStatCard
//                 title={translate("revenueEarned", "Revenue Earned")}
//                 value={`7,802 ${translate("currencyLE", "L.E")}`}
//                 percentageChange="14.8%"
//                 percentagePositive={true}
//                 description={translate("revenueEarnedDesc", "Total revenue generated in the selected period.")}
//                 icon={DollarSign}
//                 // تمييز الكارت في حالة العرض المالي فقط
//                 className={viewMode === 'financial' ? "border-primary/40 border-2 shadow-xl" : ""}
//               >
//                 <div className="h-24 mt-2">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={revenueChartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
//                       <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
//                       <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dx={-5} />
//                       <RechartsTooltip contentStyle={{ fontSize: '12px', padding: '4px 8px', borderRadius: 'var(--radius)' }} />
//                       <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </DashboardStatCard>
//             )}
//           </div>

//           {/* Upcoming Appointments Table */}
//           <Card className="shadow-lg w-full overflow-hidden">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <CardTitle>{translate("upcomingAppointmentsTitle", "Upcoming Appointments")}</CardTitle>
//                   <CardDescription>{translate("upcomingAppointmentsSubtitle", "Appointments booked for the upcoming week")}</CardDescription>
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
//                   <div className="relative flex-grow sm:flex-grow-0">
//                     <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input placeholder={translate("searchPatientPlaceholder", "Search Patient")} className="pl-8 rtl:pr-8 w-full" />
//                   </div>
//                   <Button variant="outline" className="w-full sm:w-auto">
//                     <ListFilter className="mr-2 h-4 w-4" />
//                     {translate("filterButton", "Filter")}
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto w-full">
//                 <Table className="min-w-[600px]">
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="text-right ltr:text-left">{translate("patientIdColumn", "Patient ID")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("patientNameColumn", "Patient Name")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("dateColumn", "Date")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("timeColumn", "Time")}</TableHead>
//                       <TableHead className="justify-center items-center flex">{translate("appointmentStatusColumn", "Appointment Status")}</TableHead>
//                       <TableHead className="text-right rtl:text-left">{translate("actionColumn", "Action")}</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {upcomingAppointmentsToday.length > 0 ? upcomingAppointmentsToday.map((app) => (
//                       <TableRow key={app.id}>
//                         <TableCell className="font-medium">{app.patientId}</TableCell>
//                         <TableCell>{app.patientName}</TableCell>
//                         <TableCell>{formatDate(app.dateTime)}</TableCell>
//                         <TableCell>{formatTime(app.dateTime)}</TableCell>
//                         <TableCell className="flex items-center justify-center">
//                           <Badge variant={getStatusBadgeVariant(app.status)} className={cn(
//                             app.status === "Completed"
//                             ? 'bg-green-500 hover:bg-green-600 text-white'
//                             : getStatusBadgeVariant(app.status) === 'default' && 'bg-blue-500 hover:bg-blue-600 text-white'
//                           )}>
//                             {app.status === "Completed" ? translate("statusDone", "Done") :
//                               (app.status === "Scheduled" || app.status === "Confirmed" || app.status === "Arrived" ? translate("statusBooked", "Booked") :
//                                 translate(`status${app.status.replace(/\s+/g, "")}`, app.status))
//                             }
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-right rtl:text-left">
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     )) : (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center h-24">
//                           {translate("noAppointmentsToday", "No appointments for today.")}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Sidebar */}
//         <div className="lg:col-span-1 flex flex-col gap-6 w-full min-w-0">
//           <Card className="shadow-lg border-2 border-primary/20">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                 <CardTitle className="flex items-center gap-2 text-primary">
//                   <BedDouble className="h-5 w-5" />
//                   {translate("currentPatientLabel", "Current Patient")}
//                 </CardTitle>
//                 <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white animate-pulse">
//                   {translate("statusInRoom", "In Room")}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-14 w-14 ring-2 ring-primary ring-offset-2">
//                   <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
//                   <AvatarFallback>KO</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-bold text-lg text-primary">Khaled Omar</p>
//                   <p className="text-xs text-muted-foreground">Patient ID: #654223</p>
//                 </div>
//               </div>
              
//               <div className="bg-muted/30 p-3 rounded-md space-y-2">
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <p className="text-xs text-muted-foreground">{translate("patientAgeLabel", "Patient Age")}</p>
//                     <p className="font-semibold">51 Years</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">{translate("patientPhoneLabel", "Phone")}</p>
//                     <p className="font-semibold" dir="ltr">+20 1056442728</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-2 border-t border-dashed pt-2 mt-2">
//                    <div>
//                     <p className="text-xs text-muted-foreground">{translate("reservationTypeLabel", "Type")}</p>
//                     <Badge variant="outline" className="mt-1 font-normal">{translate("revisitLabel", "Revisit")}</Badge>
//                   </div>
//                    <div>
//                     <p className="text-xs text-muted-foreground">{translate("medicalRecordLabel", "History")}</p>
//                     <Button variant="link" className="p-0 h-auto text-primary text-xs font-semibold">
//                       {translate("viewFullRecord", "Open Full Record")} &rarr;
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-2 pt-2">
//                 <Button variant="outline" className="w-full text-xs px-2 border-destructive text-destructive hover:bg-destructive/10">
//                   <BriefcaseMedical className="mr-2 h-4 w-4" />
//                   {translate("endSessionButton", "End Session")}
//                 </Button>
//                 <Button className="w-full text-xs px-2">
//                   <CheckSquare className="mr-2 h-4 w-4" />
//                   {translate("addPrescriptionButton", "Prescribe")}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="shadow-lg">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                 <CardTitle className="flex items-center gap-2">
//                   <BedDouble className="h-5 w-5" />
//                   {translate("nextPatientTitle", "Next Patient")}
//                 </CardTitle>
//                 <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
//                   {translate("statusNormal", "Normal")}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
//                   <AvatarFallback>KO</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold text-base">Khaled Omar</p>
//                   <p className="text-xs text-muted-foreground">Patient ID: #654223</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <p className="text-muted-foreground">{translate("patientAgeLabel", "Patient Age")}</p>
//                   <p className="font-medium">51</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">{translate("patientPhoneLabel", "Patient Phone Number")}</p>
//                   <p className="font-medium">+20 1056442728</p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">{translate("reservationTypeLabel", "Type of reservation")}</p>
//                 <p className="font-medium">{translate("revisitLabel", "Revisit")}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">{translate("medicalRecordLabel", "Medical record")}</p>
//                 <Button variant="link" className="p-0 h-auto text-primary">{translate("viewButton", "View")}</Button>
//               </div>
//               <div className="grid grid-cols-2 gap-2 pt-2">
//                 <Button variant="outline" className="w-full text-xs px-2">
//                   <BriefcaseMedical className="mr-2 h-4 w-4" />{translate("requestNurseButton", "Request Nurse")}
//                 </Button>
//                 <Button className="w-full text-xs px-2">
//                   <CheckSquare className="mr-2 h-4 w-4" />{translate("enterPatientButton", "Enter Patient")}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }




















// "use client";

// import React, { useState } from "react";
// import {
//   Calendar as CalendarIcon,
//   Clock,
//   Search,
//   Bell,
//   MoreHorizontal,
//   Play,
//   FileText,
//   AlertTriangle,
//   CheckCircle2,
//   XCircle,
//   TrendingUp,
//   CreditCard,
//   UserPlus,
//   Activity,
//   ShieldCheck,
//   Stethoscope,
//   FlaskConical,
//   Pill,
//   ChevronLeft,
//   Timer
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { cn } from "@/lib/utils";

// // --- Dummy Data ---

// const currentPatient = {
//   id: "PAT-8821",
//   name: "خالد عمر",
//   age: 45,
//   gender: "Male",
//   image: "https://i.pravatar.cc/150?u=PAT-8821",
//   visitType: "متابعة (Follow-up)",
//   delay: 15, // minutes
//   chiefComplaint: "ألم مستمر في المعدة وغثيان",
//   lastDiagnosis: "Gastritis (التهاب معدة)",
//   allergies: ["Penicillin"],
//   chronic: ["Hypertension"]
// };

// const queueList = [
//   { id: "P-101", name: "منى أحمد", time: "10:00 ص", type: "كشف جديد", status: "Waiting", waitTime: 45, payment: "Paid", avatar: "https://i.pravatar.cc/150?u=P-101" },
//   { id: "P-102", name: "إبراهيم السيد", time: "10:15 ص", type: "استشارة", status: "With Nurse", waitTime: 30, payment: "Partial", avatar: "https://i.pravatar.cc/150?u=P-102" },
//   { id: "P-103", name: "سارة علي", time: "10:30 ص", type: "متابعة", status: "Arrived", waitTime: 10, payment: "Unpaid", avatar: "https://i.pravatar.cc/150?u=P-103" },
//   { id: "P-104", name: "كريم محمود", time: "10:45 ص", type: "تحليل", status: "Scheduled", waitTime: 0, payment: "Pending Insurance", avatar: "https://i.pravatar.cc/150?u=P-104" },
// ];

// const alerts = [
//   { id: 1, type: "critical", msg: "نتيجة تحليل حرجة: مريض (سامي علي) - HbA1c: 11%" },
//   { id: 2, type: "warning", msg: "المريض (خالد عمر) متأخر عن موعده 15 دقيقة" },
//   { id: 3, type: "info", msg: "تم تأكيد 3 مواعيد جديدة لغدٍ" },
// ];

// // --- Sub-Components ---

// const StatusBadge = ({ status }: { status: string }) => {
//   const styles: Record<string, string> = {
//     "Waiting": "bg-amber-100 text-amber-700 border-amber-200",
//     "With Nurse": "bg-purple-100 text-purple-700 border-purple-200",
//     "Arrived": "bg-blue-100 text-blue-700 border-blue-200",
//     "Scheduled": "bg-gray-100 text-gray-700 border-gray-200",
//   };
//   return <Badge variant="outline" className={cn("font-normal", styles[status] || styles["Scheduled"])}>{status}</Badge>;
// };

// const PaymentBadge = ({ status }: { status: string }) => {
//   const styles: Record<string, string> = {
//     "Paid": "text-green-600 bg-green-50",
//     "Partial": "text-amber-600 bg-amber-50",
//     "Unpaid": "text-red-600 bg-red-50",
//     "Pending Insurance": "text-blue-600 bg-blue-50",
//   };
//   return <span className={cn("text-xs font-bold px-2 py-1 rounded-full", styles[status])}>{status}</span>;
// };

// export default function OperationalDashboard() {
//   const [tab, setTab] = useState("queue");

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 font-sans text-right" dir="rtl">
      
//       {/* 1. Header Section */}
//       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             مرحباً، د. نبيل دراز <span className="text-xl">👋</span>
//           </h1>
//           <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
//             <Clock className="w-4 h-4" />
//             الأربعاء، 16 ديسمبر 2025 | العيادة مفتوحة
//             <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 gap-1 ml-2">
//               <ShieldCheck className="w-3 h-3" /> آمن
//             </Badge>
//           </p>
//         </div>
        
//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <div className="relative flex-1 md:w-64">
//             <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
//             <Input placeholder="بحث سريع (مريض، رقم...)" className="pr-9 bg-white" />
//           </div>
//           <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
//             <UserPlus className="w-4 h-4" />
//             مريض جديد
//           </Button>
//           <Button variant="outline" size="icon" className="relative">
//             <Bell className="w-4 h-4" />
//             <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
//           </Button>
//         </div>
//       </header>

//       {/* 2. Overview Widgets (Operational Metrics) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card className="shadow-sm border-l-4 border-l-blue-500">
//           <CardContent className="p-4 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">مواعيد اليوم</p>
//               <div className="flex items-baseline gap-2 mt-1">
//                 <h3 className="text-2xl font-bold">12</h3>
//                 <span className="text-xs text-gray-400"> (10 مؤكد)</span>
//               </div>
//             </div>
//             <div className="p-2 bg-blue-50 rounded-full text-blue-600"><CalendarIcon className="w-6 h-6" /></div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-l-4 border-l-green-500">
//           <CardContent className="p-4 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">الإيرادات (اليوم)</p>
//               <div className="flex items-baseline gap-2 mt-1">
//                 <h3 className="text-2xl font-bold">7,802</h3>
//                 <span className="text-xs text-green-600 flex items-center font-medium">
//                   <TrendingUp className="w-3 h-3 ml-1" /> +5%
//                 </span>
//               </div>
//             </div>
//             <div className="p-2 bg-green-50 rounded-full text-green-600"><CreditCard className="w-6 h-6" /></div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-l-4 border-l-orange-500">
//           <CardContent className="p-4 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">في الانتظار</p>
//               <div className="flex items-baseline gap-2 mt-1">
//                 <h3 className="text-2xl font-bold">4</h3>
//                 <span className="text-xs text-orange-600 font-medium">متوسط 15د</span>
//               </div>
//             </div>
//             <div className="p-2 bg-orange-50 rounded-full text-orange-600"><Timer className="w-6 h-6" /></div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-l-4 border-l-purple-500">
//           <CardContent className="p-4 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">نتائج للمراجعة</p>
//               <div className="flex items-baseline gap-2 mt-1">
//                 <h3 className="text-2xl font-bold">3</h3>
//                 <span className="text-xs text-red-500 font-bold">1 حرج ⚠</span>
//               </div>
//             </div>
//             <div className="p-2 bg-purple-50 rounded-full text-purple-600"><FlaskConical className="w-6 h-6" /></div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* 3. Main Content (Left Column - 66%) */}
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* (A) The "Now Bar" - Hero Section */}
//           <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-white shadow-md relative overflow-hidden">
//             <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
//               المريض الحالي
//             </div>
//             <CardContent className="p-6">
//               <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-2">
//                 <div className="relative">
//                   <Avatar className="w-20 h-20 border-4 border-white shadow-sm">
//                     <AvatarImage src={currentPatient.image} />
//                     <AvatarFallback>KO</AvatarFallback>
//                   </Avatar>
//                   <span className="absolute -bottom-2 -right-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
//                     +{currentPatient.delay} د تأخير
//                   </span>
//                 </div>
                
//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center gap-2">
//                     <h2 className="text-2xl font-bold text-gray-900">{currentPatient.name}</h2>
//                     <Badge variant="secondary" className="text-gray-600">{currentPatient.age} سنة</Badge>
//                     <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
//                       {currentPatient.visitType}
//                     </Badge>
//                   </div>
//                   <p className="text-gray-600 font-medium flex items-center gap-2">
//                     <Activity className="w-4 h-4 text-orange-500" />
//                     الشكوى: {currentPatient.chiefComplaint}
//                   </p>
                  
//                   {/* Smart Suggestions / Warnings */}
//                   <div className="flex gap-2 mt-3 text-xs">
//                     {currentPatient.allergies.map(a => (
//                       <span key={a} className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">
//                         <AlertTriangle className="w-3 h-3" /> حساسية: {a}
//                       </span>
//                     ))}
//                     {currentPatient.chronic.map(c => (
//                       <span key={c} className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">
//                         <Activity className="w-3 h-3" /> {c}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2 w-full md:w-auto">
//                   <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 gap-2">
//                     <Play className="w-4 h-4 fill-current" /> بدء الكشف
//                   </Button>
//                   <Button variant="outline" className="w-full gap-2 text-gray-600">
//                     <FileText className="w-4 h-4" /> فتح السجل
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* (C) Queue Intelligence Table */}
//           <Card className="shadow-sm">
//             <CardHeader className="pb-3 border-b border-gray-100">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Timer className="w-5 h-5 text-gray-500" />
//                   قائمة الانتظار (Live Queue)
//                 </CardTitle>
//                 <div className="flex gap-2">
//                   <Button variant="ghost" size="sm" className="text-gray-500">
//                     فرز ذكي ⚡
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="p-0">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50/50">
//                     <TableHead className="text-right">وقت الوصول</TableHead>
//                     <TableHead className="text-right">المريض</TableHead>
//                     <TableHead className="text-right">النوع</TableHead>
//                     <TableHead className="text-center">الانتظار</TableHead>
//                     <TableHead className="text-center">الحالة</TableHead>
//                     <TableHead className="text-center">الدفع</TableHead>
//                     <TableHead className="text-left">إجراء</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {queueList.map((patient) => (
//                     <TableRow key={patient.id} className="group hover:bg-blue-50/30 transition-colors">
//                       <TableCell className="font-mono text-gray-500 text-xs">{patient.time}</TableCell>
//                       <TableCell>
//                         <HoverCard>
//                           <HoverCardTrigger asChild>
//                             <div className="flex items-center gap-3 cursor-help">
//                               <Avatar className="w-8 h-8">
//                                 <AvatarImage src={patient.avatar} />
//                                 <AvatarFallback>{patient.name[0]}</AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
//                                   {patient.name}
//                                 </p>
//                                 <p className="text-[10px] text-gray-400">#{patient.id}</p>
//                               </div>
//                             </div>
//                           </HoverCardTrigger>
//                           <HoverCardContent className="w-80" align="start">
//                             <div className="flex justify-between space-x-4">
//                               <div className="space-y-1">
//                                 <h4 className="text-sm font-semibold">{patient.name}</h4>
//                                 <p className="text-sm text-muted-foreground">
//                                   أنثى - 34 سنة - زيارة متابعة
//                                 </p>
//                                 <div className="flex items-center pt-2">
//                                   <AlertTriangle className="mr-2 h-4 w-4 opacity-70" />{" "}
//                                   <span className="text-xs text-muted-foreground">
//                                     حساسية من السلفا
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </HoverCardContent>
//                         </HoverCard>
//                       </TableCell>
//                       <TableCell className="text-sm">{patient.type}</TableCell>
//                       <TableCell className="text-center">
//                         <span className={cn(
//                           "text-xs font-bold px-2 py-1 rounded",
//                           patient.waitTime > 30 ? "bg-red-100 text-red-700" :
//                           patient.waitTime > 15 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
//                         )}>
//                           {patient.waitTime}د
//                         </span>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <StatusBadge status={patient.status} />
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <PaymentBadge status={patient.payment} />
//                       </TableCell>
//                       <TableCell className="text-left">
//                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>

//         </div>

//         {/* 4. Sidebar (Right Column - 33%) */}
//         <div className="lg:col-span-1 space-y-6">
          
//           {/* (B) Alerts & Warnings */}
//           <Card className="shadow-sm border-gray-200">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-bold flex items-center gap-2">
//                 <Bell className="w-4 h-4 text-gray-500" />
//                 تنبيهات الطبيب
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {alerts.map(alert => (
//                 <div key={alert.id} className={cn(
//                   "p-3 rounded-lg border text-sm flex gap-3 items-start",
//                   alert.type === "critical" ? "bg-red-50 border-red-100 text-red-800" :
//                   alert.type === "warning" ? "bg-amber-50 border-amber-100 text-amber-800" :
//                   "bg-blue-50 border-blue-100 text-blue-800"
//                 )}>
//                   {alert.type === "critical" ? <XCircle className="w-5 h-5 shrink-0" /> : 
//                    alert.type === "warning" ? <AlertTriangle className="w-5 h-5 shrink-0" /> :
//                    <CheckCircle2 className="w-5 h-5 shrink-0" />}
//                   <p>{alert.msg}</p>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* (C) Quick Tasks & Templates */}
//           <Card className="shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-bold text-gray-700">أدوات سريعة</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 gap-2">
//                 <Button variant="outline" className="justify-start h-auto py-3 px-3 border-dashed hover:border-blue-300 hover:bg-blue-50">
//                   <div className="flex flex-col items-start gap-1">
//                     <FileText className="w-4 h-4 text-blue-600" />
//                     <span className="text-xs font-medium">وصفة متكررة</span>
//                   </div>
//                 </Button>
//                 <Button variant="outline" className="justify-start h-auto py-3 px-3 border-dashed hover:border-green-300 hover:bg-green-50">
//                   <div className="flex flex-col items-start gap-1">
//                     <FlaskConical className="w-4 h-4 text-green-600" />
//                     <span className="text-xs font-medium">طلب CBC+Lipid</span>
//                   </div>
//                 </Button>
//                 <Button variant="outline" className="justify-start h-auto py-3 px-3 border-dashed hover:border-purple-300 hover:bg-purple-50">
//                   <div className="flex flex-col items-start gap-1">
//                     <Pill className="w-4 h-4 text-purple-600" />
//                     <span className="text-xs font-medium">بروتوكول السكر</span>
//                   </div>
//                 </Button>
//                 <Button variant="outline" className="justify-start h-auto py-3 px-3 border-dashed">
//                   <div className="flex flex-col items-start gap-1">
//                     <CheckCircle2 className="w-4 h-4 text-gray-500" />
//                     <span className="text-xs font-medium">تقرير غياب</span>
//                   </div>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* (D) Daily Financial Snapshot (Detailed) */}
//           <Card className="shadow-sm bg-gray-50 border-0">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base font-bold text-gray-700">المالية اليومية</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-500">الكاش (مدفوع)</span>
//                   <span className="font-bold text-gray-900">3,200 ج.م</span>
//                 </div>
//                 <Progress value={100} className="h-1.5 bg-gray-200" indicatorClassName="bg-green-500" />
//               </div>
              
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-500">تأمين (معلق)</span>
//                   <span className="font-bold text-gray-900">4,100 ج.م</span>
//                 </div>
//                 <Progress value={75} className="h-1.5 bg-gray-200" indicatorClassName="bg-blue-500" />
//               </div>

//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-500">غير مدفوع (ذمم)</span>
//                   <span className="font-bold text-red-600">502 ج.م</span>
//                 </div>
//                 <Progress value={25} className="h-1.5 bg-gray-200" indicatorClassName="bg-red-500" />
//               </div>

//               <div className="pt-2 border-t border-gray-200 mt-2">
//                 <Button variant="link" size="sm" className="w-full text-gray-500 hover:text-gray-900 p-0 h-auto">
//                   عرض التقرير المحاسبي المفصل <ChevronLeft className="w-4 h-4 mr-1" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//         </div>
//       </div>
//     </div>
//   );
// }
























// "use client";

// import * as React from "react";
// import { PageHeader } from "@/components/page-header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Clock,
//   CheckCircle2,
//   FlaskConical,
//   Timer,
//   Play,
//   AlertCircle,
//   Activity,
//   Thermometer,
//   Heart,
//   MoreHorizontal,
//   Stethoscope,
//   StickyNote
// } from "lucide-react";
// import { useTranslations } from 'next-intl';
// import { cn } from "@/lib/utils";

// // --- Dummy Data for Operational Dashboard ---

// // بيانات المريض الحالي (البطل)
// const activePatientData = {
//   id: "PAT-654223",
//   name: "خالد عمر",
//   age: 45,
//   gender: "Male",
//   image: "https://placehold.co/100x100.png?text=KO",
//   chiefComplaint: "ألم حاد في المعدة مع غثيان مستمر منذ يومين.",
//   lastVisit: "استشارة (منذ أسبوعين)",
//   vitals: {
//     bp: "130/85",
//     hr: "88",
//     temp: "37.2",
//     spo2: "98%"
//   }
// };

// // بيانات قائمة الانتظار الحية
// const liveQueueData = [
//   { id: 1, name: "منى أحمد", arrivalTime: "10:00 ص", waitDuration: 45, status: "With Nurse" },
//   { id: 2, name: "إبراهيم السيد", arrivalTime: "10:15 ص", waitDuration: 30, status: "Waiting" },
//   { id: 3, name: "سارة علي", arrivalTime: "10:30 ص", waitDuration: 15, status: "Waiting" },
//   { id: 4, name: "كريم محمود", arrivalTime: "10:40 ص", waitDuration: 5, status: "Arrived" },
// ];

// // بيانات سجل النشاط الحي
// const activityFeed = [
//   { time: "10:05 ص", message: "أحمد وصل العيادة (Check-in)", type: "info" },
//   { time: "10:15 ص", message: "نتيجة تحليل منى جاهزة", type: "success" },
//   { time: "10:20 ص", message: "تم تسجيل العلامات الحيوية لإبراهيم", type: "info" },
//   { time: "10:10 ص", message: "نتيجة أشعة كريم وصلت (Critical)", type: "danger" },
// ];

// // --- Sub-Components ---

// // كارت الإحصائيات العلوية (Operational Metric Card)
// const OperationalMetricCard = ({ 
//   title, 
//   value, 
//   icon: Icon, 
//   subtitle, 
//   variant = "default" 
// }: { 
//   title: string, 
//   value: string | number, 
//   icon: any, 
//   subtitle?: React.ReactNode, 
//   variant?: "default" | "danger" 
// }) => (
//   <Card className="shadow-sm">
//     <CardContent className="p-4 flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
//         <h3 className="text-2xl font-bold">{value}</h3>
//         {subtitle && <div className="mt-1 text-xs">{subtitle}</div>}
//       </div>
//       <div className={cn("p-3 rounded-full", 
//         variant === "danger" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
//       )}>
//         <Icon className="w-6 h-6" />
//       </div>
//     </CardContent>
//   </Card>
// );

// // عنصر في شريط النشاط
// const ActivityItem = ({ time, message, type }: { time: string, message: string, type: string }) => (
//   <div className="flex gap-3 pb-6 relative last:pb-0">
//     {/* Line */}
//     <div className="absolute top-2 right-[9px] bottom-0 w-[2px] bg-border last:hidden"></div>
    
//     <div className={cn(
//       "w-5 h-5 rounded-full border-2 z-10 shrink-0 mt-1",
//       type === "danger" ? "border-red-500 bg-red-50" : 
//       type === "success" ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"
//     )} />
    
//     <div>
//       <p className="text-sm font-medium leading-none">{message}</p>
//       <span className="text-xs text-muted-foreground mt-1 block">{time}</span>
//     </div>
//   </div>
// );

// // شارة وقت الانتظار
// const WaitTimeBadge = ({ minutes }: { minutes: number }) => {
//   let colorClass = "bg-green-100 text-green-700 hover:bg-green-200";
//   if (minutes > 30) colorClass = "bg-red-100 text-red-700 hover:bg-red-200";
//   else if (minutes > 15) colorClass = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";

//   return (
//     <Badge variant="secondary" className={colorClass}>
//       {minutes} دقيقة
//     </Badge>
//   );
// };

// // --- Main Page Component ---

// export default function DashboardClient() {
//   const t = useTranslations("Dashboard");

//   // Mock translations wrapper
//   const translate = (key: string, defaultText: string) => defaultText; 

//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden bg-gray-50/50 min-h-screen">
      
//       {/* Header */}
//       <PageHeader
//         title={translate("welcome", "مرحباً د. نبيل، لنبدأ العمل")}
//         description={translate("desc", "إليك ملخص العمليات الحالية في العيادة")}
//       />

//       {/* 1. Top Operational Metrics Row */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* في الانتظار */}
//         <OperationalMetricCard 
//           title="في الانتظار" 
//           value={4} 
//           icon={Clock} 
//         />
        
//         {/* تم الكشف */}
//         <OperationalMetricCard 
//           title="تم الكشف" 
//           value={12} 
//           icon={CheckCircle2} 
//         />
        
//         {/* نتائج للمراجعة (Critical) */}
//         <OperationalMetricCard 
//           title="نتائج للمراجعة" 
//           value={5} 
//           icon={FlaskConical}
//           variant="danger"
//           subtitle={
//             <span className="text-red-600 font-medium flex items-center gap-1">
//               <AlertCircle className="w-3 h-3" />
//               منهم 2 حالات حرجة
//             </span>
//           } 
//         />
        
//         {/* متوسط وقت الانتظار */}
//         <OperationalMetricCard 
//           title="متوسط وقت الانتظار" 
//           value="15 د" 
//           icon={Timer}
//           subtitle={<span className="text-green-600">معدل ممتاز ✅</span>} 
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* 2. Left Column (Main Operations) - 66% width */}
//         <div className="lg:col-span-2 flex flex-col gap-6">
          
//           {/* A. Hero Section: Active Patient */}
//           <Card className="border-l-4 border-l-blue-600 shadow-md">
//             <CardHeader className="pb-2">
//               <div className="flex justify-between items-start">
//                 <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 animate-pulse">
//                   المريض الحالي (في الغرفة)
//                 </Badge>
//                 <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col md:flex-row gap-6 items-start">
//                 {/* Patient Info */}
//                 <div className="flex items-center gap-4 min-w-[200px]">
//                   <Avatar className="h-20 w-20 border-2 border-blue-100">
//                     <AvatarImage src={activePatientData.image} />
//                     <AvatarFallback>KO</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900">{activePatientData.name}</h2>
//                     <p className="text-muted-foreground">{activePatientData.age} سنة - {activePatientData.gender === "Male" ? "ذكر" : "أنثى"}</p>
//                     <p className="text-xs text-muted-foreground mt-1">ID: {activePatientData.id}</p>
//                   </div>
//                 </div>

//                 {/* Clinical Snapshot */}
//                 <div className="flex-grow space-y-4 w-full">
//                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
//                     <p className="text-sm font-semibold text-slate-500 mb-1">الشكوى الرئيسية:</p>
//                     <p className="font-medium text-slate-900">{activePatientData.chiefComplaint}</p>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-4">
//                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm">
//                       <Heart className="w-4 h-4 text-red-500" />
//                       <span className="text-sm font-bold">{activePatientData.vitals.bp}</span>
//                       <span className="text-[10px] text-muted-foreground">mmHg</span>
//                     </div>
//                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm">
//                       <Activity className="w-4 h-4 text-blue-500" />
//                       <span className="text-sm font-bold">{activePatientData.vitals.hr}</span>
//                       <span className="text-[10px] text-muted-foreground">bpm</span>
//                     </div>
//                     <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm">
//                       <Thermometer className="w-4 h-4 text-orange-500" />
//                       <span className="text-sm font-bold">{activePatientData.vitals.temp}</span>
//                       <span className="text-[10px] text-muted-foreground">°C</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Button */}
//               <div className="mt-6 border-t pt-4 flex justify-end">
//                 <Button size="lg" className="w-full md:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-lg h-12 px-8">
//                   <Stethoscope className="w-5 h-5" />
//                   بدء الكشف وتسجيل الملاحظات
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* B. Live Queue Table */}
//           <Card className="shadow-sm">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Clock className="w-5 h-5 text-gray-500" />
//                   قائمة الانتظار الحية
//                 </CardTitle>
//                 <Badge variant="outline">{liveQueueData.length} في الانتظار</Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-right">اسم المريض</TableHead>
//                     <TableHead className="text-right">وقت الوصول</TableHead>
//                     <TableHead className="text-center">مدة الانتظار</TableHead>
//                     <TableHead className="text-center">الحالة</TableHead>
//                     <TableHead className="text-left">إجراء</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {liveQueueData.map((patient) => (
//                     <TableRow key={patient.id}>
//                       <TableCell className="font-medium">{patient.name}</TableCell>
//                       <TableCell>{patient.arrivalTime}</TableCell>
//                       <TableCell className="text-center">
//                         <WaitTimeBadge minutes={patient.waitDuration} />
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <Badge variant="outline" className={cn(
//                           patient.status === "With Nurse" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-gray-50 text-gray-600"
//                         )}>
//                           {patient.status === "With Nurse" ? "مع الممرضة" : 
//                            patient.status === "Arrived" ? "وصل للتو" : "في الانتظار"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-left">
//                         <Button size="sm" variant="ghost">دخول</Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>

//         {/* 3. Right Column (Sidebar) - 33% width */}
//         <div className="lg:col-span-1 flex flex-col gap-6">
          
//           {/* A. Live Activity Feed */}
//           <Card className="shadow-sm h-[400px] flex flex-col">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Activity className="w-5 h-5 text-blue-500" />
//                 سجل النشاط الحي
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="flex-1 overflow-y-auto pr-2">
//               <div className="mt-4">
//                 {activityFeed.map((item, i) => (
//                   <ActivityItem key={i} {...item} />
//                 ))}
//                 {/* More dummy items to show scrolling */}
//                 <ActivityItem time="09:50 ص" message="د. نبيل بدأ العمل" type="info" />
//                 <ActivityItem time="09:45 ص" message="الممرضة سجلت دخول" type="info" />
//               </div>
//             </CardContent>
//           </Card>

//           {/* B. Sticky Notes */}
//           <Card className="shadow-sm bg-yellow-50/50 border-yellow-200">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
//                 <StickyNote className="w-5 h-5" />
//                 ملاحظات سريعة
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Textarea 
//                 placeholder="اكتب ملاحظاتك هنا..." 
//                 className="bg-transparent border-none resize-none focus-visible:ring-0 text-gray-700 min-h-[150px] text-lg p-0 placeholder:text-yellow-800/40"
//                 defaultValue="كلم دكتور التخدير بخصوص عملية بكرة الساعة 4.
                
// لا تنسى طلب مستلزمات طبية جديدة."
//               />
//             </CardContent>
//           </Card>

//         </div>
//       </div>
//     </div>
//   );
// }









// "use client";

// import * as React from "react";
// import { PageHeader } from "@/components/page-header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   BarChartBig,
//   FlaskConical,
//   DollarSign,
//   MoreHorizontal,
//   Download,
//   ChevronDown,
//   Search,
//   ListFilter,
//   CalendarDays,
//   BedDouble,
//   BriefcaseMedical,
//   CheckSquare,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   CartesianGrid,
// } from "recharts";
// import { useTranslations } from 'next-intl';
// import type { Appointment } from "@/types";
// import { Locale } from "@/types";
// import { dummyAppointments } from "@/lib/dummy-data"; 
// import { format, parseISO } from "date-fns";
// import { arSA } from "date-fns/locale/ar-SA";
// import { cn } from "@/lib/utils";

// // ... (Data Constants remain unchanged) ...
// const overallPatientsChartData = [
//   { name: "Mon", patients: 50 },
//   { name: "Tue", patients: 60 },
//   { name: "Wed", patients: 55 },
//   { name: "Thu", patients: 70 },
//   { name: "Fri", patients: 65 },
//   { name: "Sat", patients: 75 },
//   { name: "Sun", patients: 77 },
// ];

// const revenueChartData = [
//   { name: "Mon", revenue: 300 },
//   { name: "Tue", revenue: 500 },
//   { name: "Wed", revenue: 450 },
//   { name: "Thu", revenue: 522 },
//   { name: "Fri", revenue: 600 },
//   { name: "Sat", revenue: 400 },
// ];

// const labTestsData = [
//   { name: "Complete Blood Count", progress: 70 },
//   { name: "Lipid Panel", progress: 50 },
//   { name: "Basic Metabolic Panel", progress: 85 },
//   { name: "Thyroid Panel", progress: 60 },
// ];

// interface DashboardStatCardProps {
//   title: string;
//   value: string;
//   percentageChange: string;
//   percentagePositive: boolean;
//   description: string;
//   icon: React.ElementType;
//   chart?: React.ReactNode;
//   footerText?: string;
//   className?: string;
//   children?: React.ReactNode;
// }

// const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
//   title,
//   value,
//   percentageChange,
//   percentagePositive,
//   description,
//   icon: Icon,
//   chart,
//   footerText,
//   className,
//   children
// }) => {
//   return (
//     <Card className={cn("shadow-lg flex flex-col h-full", className)}>
//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm font-medium">
//             <Icon className="h-5 w-5" />
//             {title}
//           </div>
//           <Button variant="ghost" size="icon" className="h-6 w-6">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex items-baseline gap-2 pt-2">
//           <p className="text-3xl font-bold">{value}</p>
//           <Badge variant={percentagePositive ? "default" : "destructive"} className="text-xs">
//             {percentagePositive ? '+' : ''}{percentageChange}
//           </Badge>
//         </div>
//         <CardDescription className="text-xs">{description}</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-grow flex flex-col justify-end pt-0">
//         {chart || children}
//         {footerText && <p className="text-xs text-muted-foreground text-right mt-1">{footerText}</p>}
//       </CardContent>
//     </Card>
//   );
// };


// export default function DashboardClient({ locale }: { locale: Locale }) {
//   const t = useTranslations("Dashboard");

//   const translate = React.useCallback(
//     (key: string, defaultValue?: string) => {
//       const translation = t(key);
//       return translation === key && defaultValue ? defaultValue : translation;
//     },
//     [t]
//   );

//   const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

//   const formatDate = (dateString: string, formatStr: string = "dd/MM/yyyy") => {
//     return format(parseISO(dateString), formatStr, { locale: locale === 'ar' ? arSA : undefined });
//   };

//   const formatTime = (dateString: string) => {
//     return format(parseISO(dateString), "p", { locale: locale === 'ar' ? arSA : undefined });
//   };

//   const getStatusBadgeVariant = (status: Appointment['status']): "default" | "destructive" | "outline" => {
//     switch (status) {
//       case "Scheduled":
//       case "Confirmed":
//       case "Arrived": 
//         return "default"; 
//       case "Completed": 
//         return "default"; 
//       case "Cancelled":
//       case "No Show":
//         return "destructive"; 
//       default:
//         return "outline";
//     }
//   };

//   const upcomingAppointmentsToday = dummyAppointments
//     .filter(app => new Date(app.dateTime) >= new Date(new Date().setHours(0, 0, 0, 0)))
//     .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
//     .slice(0, 5);


//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-5 w-full max-w-[100vw] overflow-x-hidden">
//       <PageHeader
//         title={translate("dashboardWelcomeTitle", "Welcome Back, Dr Nabil Deraz")}
//         description={translate("dashboardWelcomeSubtitle", "Lets recap your data for the past period")}
//       >
//         {/* <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
//           <Button variant="outline">
//             {translate("lastWeek", "Last Week")}
//             <ChevronDown className="ml-2 h-4 w-4" />
//           </Button>
//           <Button>
//             <Download className="mr-2 h-4 w-4" />
//             {translate("export", "Export")}
//           </Button>
//         </div> */}
//       </PageHeader>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Main content area */}
//         <div className="lg:col-span-3 flex flex-col gap-6 w-full min-w-0">
//           {/* Summary Cards Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <DashboardStatCard
//               title={translate("overallPatients", "Overall Patients")}
//               value="18"
//               percentageChange="12تم الكشف , 4 في الانتظار "
//               percentagePositive={true}
//               description={translate("overallPatientsDesc", "This analysis is collected over the last 7 days. An increase in patients is noticed from 212 to 302.")}
//               icon={BarChartBig}
//               className="bg-primary text-primary-foreground [&_*]:text-primary-foreground"
//               // footerText={`77 ${translate("patientsTodaySuffix", "today")}`}
//             >
//               <div className="h-20 mt-2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={overallPatientsChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
//                     <Bar dataKey="patients" fill="hsl(var(--primary-foreground))" radius={[4, 4, 0, 0]} barSize={10} />
//                     <XAxis  dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#ffffff", fillOpacity: 1 }} dy={5} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </DashboardStatCard>

//             <DashboardStatCard
//               title={translate("labTestRequested", "Lab Test Requested")}
//               value="3"
//               percentageChange="21.4%"
//               percentagePositive={true}
//               description={translate("labTestRequestedDesc", "Lab tests have been increased by 407 in the last 7 days. With a slight increase in X test for 327 patients.")}
//               icon={FlaskConical}
//             >
//               <div className="space-y-2 mt-2 flex-grow">
//                 {labTestsData.slice(0, 3).map(test => (
//                   <div key={test.name}>
//                     <div className="h-2 w-full bg-muted rounded-full">
//                       <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${test.progress}%` }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </DashboardStatCard>

//             <DashboardStatCard
//               title={translate("revenueEarned", "Revenue Earned")}
//               value={`7,802 ${translate("currencyLE", "L.E")}`}
//               percentageChange="14.8%"
//               percentagePositive={true}
//               description={translate("revenueEarnedDesc", "Total revenue generated in the selected period.")}
//               icon={DollarSign}
//             >
//               <div className="h-24 mt-2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={revenueChartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
//                     <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
//                     <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dx={-5} />
//                     <RechartsTooltip contentStyle={{ fontSize: '12px', padding: '4px 8px', borderRadius: 'var(--radius)' }} />
//                     <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </DashboardStatCard>
//           </div>

//           {/* Upcoming Appointments Table */}
//           <Card className="shadow-lg w-full overflow-hidden">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <CardTitle>{translate("upcomingAppointmentsTitle", "Upcoming Appointments")}</CardTitle>
//                   <CardDescription>{translate("upcomingAppointmentsSubtitle", "Appointments booked for the upcoming week")}</CardDescription>
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
//                   <div className="relative flex-grow sm:flex-grow-0">
//                     <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input placeholder={translate("searchPatientPlaceholder", "Search Patient")} className="pl-8 rtl:pr-8 w-full" />
//                   </div>
//                   <Button variant="outline" className="w-full sm:w-auto">
//                     <ListFilter className="mr-2 h-4 w-4" />
//                     {translate("filterButton", "Filter")}
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto w-full">
//                 <Table className="min-w-[600px]">
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="text-right ltr:text-left">{translate("patientIdColumn", "Patient ID")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("patientNameColumn", "Patient Name")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("dateColumn", "Date")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("timeColumn", "Time")}</TableHead>
//                       <TableHead className="justify-center items-center flex">{translate("appointmentStatusColumn", "Appointment Status")}</TableHead>
//                       <TableHead className="text-right rtl:text-left">{translate("actionColumn", "Action")}</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {upcomingAppointmentsToday.length > 0 ? upcomingAppointmentsToday.map((app) => (
//                       <TableRow key={app.id}>
//                         <TableCell className="font-medium">{app.patientId}</TableCell>
//                         <TableCell>{app.patientName}</TableCell>
//                         <TableCell>{formatDate(app.dateTime)}</TableCell>
//                         <TableCell>{formatTime(app.dateTime)}</TableCell>
//                         <TableCell className="flex items-center justify-center">
//                           <Badge variant={getStatusBadgeVariant(app.status)} className={cn(
//                             app.status === "Completed"
//                               ? 'bg-green-500 hover:bg-green-600 text-white'
//                               : getStatusBadgeVariant(app.status) === 'default' && 'bg-blue-500 hover:bg-blue-600 text-white'
//                           )}>
//                             {app.status === "Completed" ? translate("statusDone", "Done") :
//                               (app.status === "Scheduled" || app.status === "Confirmed" || app.status === "Arrived" ? translate("statusBooked", "Booked") :
//                                 translate(`status${app.status.replace(/\s+/g, "")}`, app.status))
//                             }
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-right rtl:text-left">
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     )) : (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center h-24">
//                           {translate("noAppointmentsToday", "No appointments for today.")}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Sidebar */}
//         <div className="lg:col-span-1 flex flex-col gap-6 w-full min-w-0">
//           {/* <Card className="shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CalendarDays className="h-5 w-5" />
//                 {translate("appointmentsTitle", "Appointments")}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="">
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={setSelectedDate}
//                 className="rounded-md border flex items-center justify-center w-full p-0"
//                 classNames={{
//                     month: "w-full space-y-4",
//                     table: "w-full border-collapse space-y-1",
//                     head_row: "flex w-full justify-between",
//                     row: "flex w-full mt-2 justify-between",
//                     cell: "w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
//                 }}
//                 dir={locale === 'ar' ? 'rtl' : 'ltr'}
//                 locale={locale === 'ar' ? arSA : undefined}
//               />
//             </CardContent>
//           </Card> */}
//  <Card className="shadow-lg border-2 border-primary/20">
//   <CardHeader>
//     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//       <CardTitle className="flex items-center gap-2 text-primary">
//         <BedDouble className="h-5 w-5" />
//         {translate("currentPatientLabel", "Current Patient")} {/* تم تعديل التسمية */}
//       </CardTitle>
//       <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white animate-pulse"> {/* إضافة تأثير النبض */}
//         {translate("statusInRoom", "In Room")} {/* تم تعديل الحالة */}
//       </Badge>
//     </div>
//   </CardHeader>
//   <CardContent className="space-y-3 text-sm">
//     <div className="flex items-center gap-3">
//       <Avatar className="h-14 w-14 ring-2 ring-primary ring-offset-2"> {/* تمييز الصورة */}
//         <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
//         <AvatarFallback>KO</AvatarFallback>
//       </Avatar>
//       <div>
//         <p className="font-bold text-lg text-primary">Khaled Omar</p> {/* تكبير الاسم وتمييزه */}
//         <p className="text-xs text-muted-foreground">Patient ID: #654223</p>
//       </div>
//     </div>
    
//     <div className="bg-muted/30 p-3 rounded-md space-y-2"> {/* تجميع البيانات في خلفية مميزة */}
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <p className="text-xs text-muted-foreground">{translate("patientAgeLabel", "Patient Age")}</p>
//           <p className="font-semibold">51 Years</p>
//         </div>
//         <div>
//           <p className="text-xs text-muted-foreground">{translate("patientPhoneLabel", "Phone")}</p>
//           <p className="font-semibold" dir="ltr">+20 1056442728</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-2 gap-2 border-t border-dashed pt-2 mt-2">
//          <div>
//           <p className="text-xs text-muted-foreground">{translate("reservationTypeLabel", "Type")}</p>
//           <Badge variant="outline" className="mt-1 font-normal">{translate("revisitLabel", "Revisit")}</Badge>
//         </div>
//          <div>
//           <p className="text-xs text-muted-foreground">{translate("medicalRecordLabel", "History")}</p>
//           <Button variant="link" className="p-0 h-auto text-primary text-xs font-semibold">
//             {translate("viewFullRecord", "Open Full Record")} &rarr;
//           </Button>
//         </div>
//       </div>
//     </div>

//     <div className="grid grid-cols-2 gap-2 pt-2">
//       <Button variant="outline" className="w-full text-xs px-2 border-destructive text-destructive hover:bg-destructive/10">
//         <BriefcaseMedical className="mr-2 h-4 w-4" />
//         {translate("endSessionButton", "End Session")} {/* زر إنهاء الجلسة */}
//       </Button>
//       <Button className="w-full text-xs px-2">
//         <CheckSquare className="mr-2 h-4 w-4" />
//         {translate("addPrescriptionButton", "Prescribe")} {/* زر كتابة روشتة */}
//       </Button>
//     </div>
//   </CardContent>
// </Card>
          

//           <Card className="shadow-lg">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                 <CardTitle className="flex items-center gap-2">
//                   <BedDouble className="h-5 w-5" />
//                   {translate("nextPatientTitle", "Next Patient")}
//                 </CardTitle>
//                 <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
//                   {translate("statusNormal", "Normal")}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
//                   <AvatarFallback>KO</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold text-base">Khaled Omar</p>
//                   <p className="text-xs text-muted-foreground">Patient ID: #654223</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <p className="text-muted-foreground">{translate("patientAgeLabel", "Patient Age")}</p>
//                   <p className="font-medium">51</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">{translate("patientPhoneLabel", "Patient Phone Number")}</p>
//                   <p className="font-medium">+20 1056442728</p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">{translate("reservationTypeLabel", "Type of reservation")}</p>
//                 <p className="font-medium">{translate("revisitLabel", "Revisit")}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">{translate("medicalRecordLabel", "Medical record")}</p>
//                 <Button variant="link" className="p-0 h-auto text-primary">{translate("viewButton", "View")}</Button>
//               </div>
//               <div className="grid grid-cols-2 gap-2 pt-2">
//                 <Button variant="outline" className="w-full text-xs px-2">
//                   <BriefcaseMedical className="mr-2 h-4 w-4" />{translate("requestNurseButton", "Request Nurse")}
//                 </Button>
//                 <Button className="w-full text-xs px-2">
//                   <CheckSquare className="mr-2 h-4 w-4" />{translate("enterPatientButton", "Enter Patient")}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
















//Old not responcive version

// "use client";

// import * as React from "react";
// import { PageHeader } from "@/components/page-header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   BarChartBig,
//   FlaskConical,
//   DollarSign,
//   MoreHorizontal,
//   Download,
//   ChevronDown,
//   Search,
//   ListFilter,
//   CalendarDays,
//   BedDouble,
//   BriefcaseMedical,
//   CheckSquare,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   CartesianGrid,
// } from "recharts";
// import { useTranslations } from 'next-intl';
// import type { Appointment } from "@/types";
// import { Locale } from "@/types";
// import { dummyAppointments } from "@/lib/dummy-data"; // Assuming this provides appointments
// import { format, parseISO } from "date-fns";
// import { arSA } from "date-fns/locale/ar-SA";
// import { cn } from "@/lib/utils";

// // Dummy data for charts
// const overallPatientsChartData = [
//   { name: "Mon", patients: 50 },
//   { name: "Tue", patients: 60 },
//   { name: "Wed", patients: 55 },
//   { name: "Thu", patients: 70 },
//   { name: "Fri", patients: 65 },
//   { name: "Sat", patients: 75 },
//   { name: "Sun", patients: 77 },
// ];

// const revenueChartData = [
//   { name: "Jan", revenue: 400 },
//   { name: "Feb", revenue: 300 },
//   { name: "Mar", revenue: 500 },
//   { name: "Apr", revenue: 450 },
//   { name: "May", revenue: 522 },
//   { name: "Jun", revenue: 600 },
// ];

// const labTestsData = [
//   { name: "Complete Blood Count", progress: 70 },
//   { name: "Lipid Panel", progress: 50 },
//   { name: "Basic Metabolic Panel", progress: 85 },
//   { name: "Thyroid Panel", progress: 60 },
// ];

// interface DashboardStatCardProps {
//   title: string;
//   value: string;
//   percentageChange: string;
//   percentagePositive: boolean;
//   description: string;
//   icon: React.ElementType;
//   chart?: React.ReactNode;
//   footerText?: string;
//   className?: string;
//   children?: React.ReactNode;
// }

// const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
//   title,
//   value,
//   percentageChange,
//   percentagePositive,
//   description,
//   icon: Icon,
//   chart,
//   footerText,
//   className,
//   children
// }) => {
//   return (
//     <Card className={cn("shadow-lg flex flex-col", className)}>
//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm font-medium">
//             <Icon className="h-5 w-5" />
//             {title}
//           </div>
//           <Button variant="ghost" size="icon" className="h-6 w-6">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex items-baseline gap-2 pt-2">
//           <p className="text-3xl font-bold">{value}</p>
//           <Badge variant={percentagePositive ? "default" : "destructive"} className="text-xs">
//             {percentagePositive ? '+' : ''}{percentageChange}
//           </Badge>
//         </div>
//         <CardDescription className="text-xs">{description}</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-grow flex flex-col justify-end pt-0">
//         {chart || children}
//         {footerText && <p className="text-xs text-muted-foreground text-right mt-1">{footerText}</p>}
//       </CardContent>
//     </Card>
//   );
// };


// export default function DashboardClient({ locale }: { locale: Locale }) {
//   const t = useTranslations("Dashboard");

//   const translate = React.useCallback(
//     (key: string, defaultValue?: string) => {
//       const translation = t(key);
//       return translation === key && defaultValue ? defaultValue : translation;
//     },
//     [t]
//   );

//   const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

//   const formatDate = (dateString: string, formatStr: string = "dd/MM/yyyy") => {
//     return format(parseISO(dateString), formatStr, { locale: locale === 'ar' ? arSA : undefined });
//   };

//   const formatTime = (dateString: string) => {
//     return format(parseISO(dateString), "p", { locale: locale === 'ar' ? arSA : undefined });
//   };

//   const getStatusBadgeVariant = (status: Appointment['status']): "default" | "destructive" | "outline" => {
//     switch (status) {
//       case "Scheduled":
//       case "Confirmed":
//       case "Arrived": // 'Booked' in screenshot, assuming this maps to Arrived or Confirmed
//         return "default"; // Blue
//       case "Completed": // 'Done' in screenshot
//         return "default"; // Use default, apply green class below
//       case "Cancelled":
//       case "No Show":
//         return "destructive"; // Red
//       default:
//         return "outline";
//     }
//   };

//   // Filter appointments for today or upcoming
//   const upcomingAppointmentsToday = dummyAppointments
//     .filter(app => new Date(app.dateTime) >= new Date(new Date().setHours(0, 0, 0, 0)))
//     .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
//     .slice(0, 5);


//   return (
//     <div className="flex flex-col gap-6 p-5">
//       <PageHeader
//         title={translate("dashboardWelcomeTitle", "Welcome Back, Dr Nabil Deraz")}
//         description={translate("dashboardWelcomeSubtitle", "Lets recap your data for the past period")}
//       >
//         <div className="flex items-center gap-2">
//           <Button variant="outline">
//             {translate("lastWeek", "Last Week")}
//             <ChevronDown className="ml-2 h-4 w-4" />
//           </Button>
//           <Button>
//             <Download className="mr-2 h-4 w-4" />
//             {translate("export", "Export")}

//           </Button>
//         </div>
//       </PageHeader>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Main content area */}
//         <div className="lg:col-span-3 flex flex-col gap-6">
//           {/* Summary Cards Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <DashboardStatCard
//               title={translate("overallPatients", "Overall Patients")}
//               value="1,509"
//               percentageChange="17.2%"
//               percentagePositive={true}
//               description={translate("overallPatientsDesc", "This analysis is collected over the last 7 days. An increase in patients is noticed from 212 to 302.")}
//               icon={BarChartBig}
//               className="bg-primary text-primary-foreground [&_*]:text-primary-foreground"
//               footerText={`77 ${translate("patientsTodaySuffix", "today")}`}
//             >
//               <div className="h-20 mt-2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={overallPatientsChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
//                     <Bar dataKey="patients" fill="hsl(var(--primary-foreground))" radius={[4, 4, 0, 0]} barSize={10} />
//                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fillOpacity: 0.7 }} dy={5} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </DashboardStatCard>

//             <DashboardStatCard
//               title={translate("labTestRequested", "Lab Test Requested")}
//               value="2,002"
//               percentageChange="21.4%"
//               percentagePositive={true}
//               description={translate("labTestRequestedDesc", "Lab tests have been increased by 407 in the last 7 days. With a slight increase in X test for 327 patients.")}
//               icon={FlaskConical}
//             >
//               <div className="space-y-2 mt-2 flex-grow">
//                 {labTestsData.slice(0, 3).map(test => (
//                   <div key={test.name}>
//                     <div className="h-2 w-full bg-muted rounded-full">
//                       <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${test.progress}%` }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </DashboardStatCard>

//             <DashboardStatCard
//               title={translate("revenueEarned", "Revenue Earned")}
//               value={`7,802 ${translate("currencyLE", "L.E")}`}
//               percentageChange="14.8%"
//               percentagePositive={true}
//               description={translate("revenueEarnedDesc", "Total revenue generated in the selected period.")}
//               icon={DollarSign}
//             >
//               <div className="h-24 mt-2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={revenueChartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
//                     <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={5} />
//                     <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dx={-5} />
//                     <RechartsTooltip contentStyle={{ fontSize: '12px', padding: '4px 8px', borderRadius: 'var(--radius)' }} />
//                     <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </DashboardStatCard>
//           </div>

//           {/* Upcoming Appointments Table */}
//           <Card className="shadow-lg">
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                 <div>
//                   <CardTitle>{translate("upcomingAppointmentsTitle", "Upcoming Appointments")}</CardTitle>
//                   <CardDescription>{translate("upcomingAppointmentsSubtitle", "Appointments booked for the upcoming week")}</CardDescription>
//                 </div>
//                 <div className="flex items-center gap-2 w-full sm:w-auto">
//                   <div className="relative flex-grow sm:flex-grow-0">
//                     <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input placeholder={translate("searchPatientPlaceholder", "Search Patient")} className="pl-8 rtl:pr-8 w-full" />
//                   </div>
//                   <Button variant="outline">
//                     <ListFilter className="mr-2 h-4 w-4" />
//                     {translate("filterButton", "Filter")}
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="text-right ltr:text-left">{translate("patientIdColumn", "Patient ID")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("patientNameColumn", "Patient Name")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("dateColumn", "Date")}</TableHead>
//                       <TableHead className="text-right ltr:text-left">{translate("timeColumn", "Time")}</TableHead>
//                       <TableHead className="justify-center items-center flex">{translate("appointmentStatusColumn", "Appointment Status")}</TableHead>
//                       <TableHead className="text-right rtl:text-left">{translate("actionColumn", "Action")}</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {upcomingAppointmentsToday.length > 0 ? upcomingAppointmentsToday.map((app) => (
//                       <TableRow key={app.id}>
//                         <TableCell className="font-medium">{app.patientId}</TableCell>
//                         <TableCell>{app.patientName}</TableCell>
//                         <TableCell>{formatDate(app.dateTime)}</TableCell>
//                         <TableCell>{formatTime(app.dateTime)}</TableCell>
//                         <TableCell className="flex items-center justify-center">
//                           <Badge variant={getStatusBadgeVariant(app.status)} className={cn(
//                             app.status === "Completed"
//                               ? 'bg-green-500 hover:bg-green-600 text-white'
//                               : getStatusBadgeVariant(app.status) === 'default' && 'bg-blue-500 hover:bg-blue-600 text-white'
//                           )}>
//                             {app.status === "Completed" ? translate("statusDone", "Done") :
//                               (app.status === "Scheduled" || app.status === "Confirmed" || app.status === "Arrived" ? translate("statusBooked", "Booked") :
//                                 translate(`status${app.status.replace(/\s+/g, "")}`, app.status))
//                             }
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-right rtl:text-left">
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     )) : (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center h-24">
//                           {translate("noAppointmentsToday", "No appointments for today.")}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Sidebar */}
//         <div className="lg:col-span-1 flex flex-col gap-6">
//           <Card className="shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CalendarDays className="h-5 w-5" />
//                 {translate("appointmentsTitle", "Appointments")}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="">
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={setSelectedDate}
//                 className="rounded-md border items-center justify-center w-full"
//                 dir={locale === 'ar' ? 'rtl' : 'ltr'}
//                 locale={locale === 'ar' ? arSA : undefined}

//               />
//             </CardContent>
//           </Card>

//           <Card className="shadow-lg">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="flex items-center gap-2">
//                   <BedDouble className="h-5 w-5" />
//                   {translate("nextPatientTitle", "Next Patient")}
//                 </CardTitle>
//                 <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
//                   {translate("statusNormal", "Normal")}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage src="https://placehold.co/100x100.png?text=KO" alt="Khaled Omar" data-ai-hint="person avatar" />
//                   <AvatarFallback>KO</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold text-base">Khaled Omar</p>
//                   <p className="text-xs text-muted-foreground">Patient ID: #654223</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <p className="text-muted-foreground">{translate("patientAgeLabel", "Patient Age")}</p>
//                   <p className="font-medium">51</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">{translate("patientPhoneLabel", "Patient Phone Number")}</p>
//                   <p className="font-medium">+20 1056442728</p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">{translate("reservationTypeLabel", "Type of reservation")}</p>
//                 <p className="font-medium">{translate("revisitLabel", "Revisit")}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">{translate("medicalRecordLabel", "Medical record")}</p>
//                 <Button variant="link" className="p-0 h-auto text-primary">{translate("viewButton", "View")}</Button>
//               </div>
//               <div className="grid grid-cols-2 gap-2 pt-2">
//                 <Button variant="outline" className="w-full">
//                   <BriefcaseMedical className="mr-2 h-4 w-4" />{translate("requestNurseButton", "Request Nurse")}
//                 </Button>
//                 <Button className="w-full">
//                   <CheckSquare className="mr-2 h-4 w-4" />{translate("enterPatientButton", "Enter Patient")}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }