// كل كومنت شكل ديزاين مختلف 
"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  Search,
  Activity,
  Heart,
  Thermometer,
  Droplet,
  User,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
  FileText,
  Pill,
  Stethoscope,
  Users,
  Shield,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  Clock,
  TrendingUp,
  FlaskRound,
  Scan,
  Briefcase,
  Lock,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient, CURRENT_DOCTOR_ID, SourceInfo } from "./types";
import { dummyPatients } from "./data";
import { OTPModal } from "./OTPModal";
import { SourceBadge, LockedOverlay, AccessControlCard } from "./AccessControl";



function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const getAlertColor = (type: string) => {
  switch (type) {
    case "critical":
      return "bg-red-100 text-red-800 border border-red-200";
    case "warning":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    default:
      return "bg-blue-100 text-blue-800 border border-blue-200";
  }
};

const isLocalRecord = (source: SourceInfo): boolean => {
  return source.doctorId === CURRENT_DOCTOR_ID;
};

// ============================================
// Sub Components
// ============================================

const VitalCard = React.memo(function VitalCard({
  title,
  value,
  unit,
  icon,
}: {
  title: string;
  value?: string;
  unit?: string;
  icon: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="p-3 sm:p-4 rounded-xl border bg-card shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs text-muted-foreground mb-1 font-medium">{title}</p>
        <div className="flex items-end gap-1">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground mb-1">{unit}</span>
        </div>
      </div>
      <div className="p-2 rounded-full bg-muted">{icon}</div>
    </div>
  );
});

const SectionHeader = ({
  icon,
  title,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-md bg-muted">{icon}</div>
      <h3 className="text-base sm:text-lg font-bold text-foreground">{title}</h3>
    </div>
    {action}
  </div>
);

// ============================================
// Main Component
// ============================================

export default function MedicalRecordSystem() {
  const patients = useMemo(() => dummyPatients, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // ============================================
  // حالة التحكم بالوصول - Local vs Global
  // ============================================
  const [isGlobalAccessUnlocked, setIsGlobalAccessUnlocked] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showGlobalRecords, setShowGlobalRecords] = useState(false);

  // إعادة تعيين الوصول عند إغلاق النافذة المنبثقة (نهاية الجلسة)
  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setSelectedPatient(null);
    setIsGlobalAccessUnlocked(false); // إعادة تعيين الوصول
    setShowGlobalRecords(false);
    setActiveTab("overview");
  }, []);

  const handleOTPSuccess = useCallback(() => {
    setIsGlobalAccessUnlocked(true);
    setShowOTPModal(false);
  }, []);

  const requestGlobalAccess = useCallback(() => {
    setShowOTPModal(true);
  }, []);

  const filteredPatients = useMemo(() => {
    let filtered = patients.filter((p) =>
      [p.name, p.contactPhone, p.contactEmail, p.id, p.address]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "name") {
          return sortConfig.direction === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortConfig.key === "age") {
          const ageA = calculateAge(a.dateOfBirth);
          const ageB = calculateAge(b.dateOfBirth);
          return sortConfig.direction === "asc" ? ageA - ageB : ageB - ageA;
        }
        return 0;
      });
    }

    return filtered;
  }, [patients, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openModalWithPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    setOpen(true);
    setActiveTab("overview");
    setIsGlobalAccessUnlocked(false); // إعادة تعيين عند فتح ملف جديد
    setShowGlobalRecords(false);
  }, []);

  // فصل السجلات المحلية والخارجية
  const getLocalRecords = useCallback(
    <T extends { source: SourceInfo }>(records: T[] | undefined): T[] => {
      return (records || []).filter((r) => isLocalRecord(r.source));
    },
    []
  );

  const getGlobalRecords = useCallback(
    <T extends { source: SourceInfo }>(records: T[] | undefined): T[] => {
      return (records || []).filter((r) => !isLocalRecord(r.source));
    },
    []
  );

  // ============================================
  // Render Tab Content
  // ============================================

  const renderOverviewTab = () => {
    if (!selectedPatient) return null;

    const localDiagnoses = getLocalRecords(selectedPatient.diagnoses);
    const globalDiagnoses = getGlobalRecords(selectedPatient.diagnoses);
    const localMedications = getLocalRecords(selectedPatient.medications);
    const globalMedications = getGlobalRecords(selectedPatient.medications);
    const localVisits = getLocalRecords(selectedPatient.visitNotes);
    const globalVisits = getGlobalRecords(selectedPatient.visitNotes);

    return (
      <div className="space-y-6">
        {/* Toggle بين العرض المحلي والموحد */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg">
              {showGlobalRecords ? (
                <Globe className="h-5 w-5 text-primary" />
              ) : (
                <User className="h-5 w-5 text-[hsl(var(--medical-local))]" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {showGlobalRecords ? "السجل الطبي الموحد" : "سجلاتي المحلية"}
              </p>
              <p className="text-sm text-muted-foreground">
                {showGlobalRecords
                  ? "عرض جميع السجلات من كافة المصادر"
                  : "السجلات التي أدخلتها أنا فقط"}
              </p>
            </div>
          </div>
          <Button
            variant={showGlobalRecords ? "default" : "outline"}
            onClick={() => {
              if (!showGlobalRecords && !isGlobalAccessUnlocked) {
                requestGlobalAccess();
              } else {
                setShowGlobalRecords(!showGlobalRecords);
              }
            }}
            className="gap-2 w-full sm:w-auto"
          >
            {showGlobalRecords ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden sm:inline">إخفاء السجل الموحد</span>
                <span className="sm:hidden">إخفاء</span>
              </>
            ) : (
              <>
                {isGlobalAccessUnlocked ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">عرض السجل الموحد</span>
                <span className="sm:hidden">عرض</span>
              </>
            )}
          </Button>
        </div>

        {/* التشخيصات */}
        <section>
          <SectionHeader icon={<FileText size={18} />} title="التشخيصات النشطة" />

          {/* السجلات المحلية */}
          <div className="space-y-2 mb-4">
            {localDiagnoses.map((diag, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-xl access-card-local gap-3"
              >
                <div className="flex items-center gap-3">
                  <SourceBadge isLocal={true} />
                  <div>
                    <p className="font-semibold">{diag.description}</p>
                    <p className="text-xs text-muted-foreground">
                      كود: {diag.code || "-"}
                    </p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-green-500 self-start sm:self-auto" />
              </div>
            ))}
          </div>

          {/* السجلات الخارجية */}
          {showGlobalRecords && globalDiagnoses.length > 0 && (
            <div className="space-y-2">
              {globalDiagnoses.map((diag, i) => (
                <AccessControlCard
                  key={i}
                  isLocal={false}
                  isGlobalUnlocked={isGlobalAccessUnlocked}
                  onRequestAccess={requestGlobalAccess}
                  className="flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <SourceBadge isLocal={false} />
                    <div>
                      <p className="font-semibold">{diag.description}</p>
                      <p className="text-xs text-muted-foreground">
                        كود: {diag.code || "-"} | {diag.source.createdAt}
                      </p>
                    </div>
                  </div>
                </AccessControlCard>
              ))}
            </div>
          )}

          {!showGlobalRecords && globalDiagnoses.length > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
              <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                يوجد {globalDiagnoses.length} تشخيص إضافي في السجل الموحد
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={requestGlobalAccess}
                className="mt-1"
              >
                طلب الوصول
              </Button>
            </div>
          )}
        </section>

        {/* الأدوية */}
        <section>
          <SectionHeader icon={<Pill size={18} />} title="الأدوية الحالية" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {localMedications.map((med, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border access-card-local bg-card"
              >
                <div className="bg-muted p-2 rounded-lg text-primary">
                  <Pill size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{med.name}</p>
                      <SourceBadge isLocal={true} />
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                      {med.dose}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {med.freq} - {med.indication}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {showGlobalRecords && globalMedications.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {globalMedications.map((med, i) => (
                <AccessControlCard
                  key={i}
                  isLocal={false}
                  isGlobalUnlocked={isGlobalAccessUnlocked}
                  onRequestAccess={requestGlobalAccess}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-lg text-muted-foreground">
                      <Pill size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{med.name}</p>
                          <SourceBadge isLocal={false} />
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                          {med.dose}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {med.freq} - {med.indication}
                      </p>
                    </div>
                  </div>
                </AccessControlCard>
              ))}
            </div>
          )}

          {!showGlobalRecords && globalMedications.length > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
              <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                يوجد {globalMedications.length} دواء إضافي في السجل الموحد
              </p>
            </div>
          )}
        </section>

        {/* آخر الزيارات */}
        <section>
          <SectionHeader icon={<Clock size={18} />} title="آخر الزيارات" />

          <div className="space-y-2">
            {localVisits.slice(0, 3).map((visit, i) => (
              <div
                key={i}
                className="p-4 bg-card border rounded-lg access-card-local"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{visit.date}</Badge>
                    <SourceBadge isLocal={true} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {visit.doctorName}
                  </span>
                </div>
                <p className="text-sm">{visit.notes}</p>
              </div>
            ))}
          </div>

          {showGlobalRecords && globalVisits.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                زيارات من السجل الموحد:
              </p>
              {globalVisits.map((visit, i) => (
                <AccessControlCard
                  key={i}
                  isLocal={false}
                  isGlobalUnlocked={isGlobalAccessUnlocked}
                  onRequestAccess={requestGlobalAccess}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{visit.date}</Badge>
                      <SourceBadge isLocal={false} />
                      <Badge variant="outline">{visit.department}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {visit.doctorName}
                    </span>
                  </div>
                  <p className="text-sm">{visit.notes}</p>
                </AccessControlCard>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  };

  const renderLabsTab = () => {
    if (!selectedPatient) return null;

    const localLabs = getLocalRecords(selectedPatient.labTests);
    const globalLabs = getGlobalRecords(selectedPatient.labTests);

    return (
      <div className="space-y-6">
        <SectionHeader
          icon={<FlaskRound size={18} />}
          title="نتائج المختبر"
          action={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="badge-local border">
                محلي: {localLabs.length}
              </Badge>
              <Badge variant="outline" className="badge-global border">
                خارجي: {globalLabs.length}
              </Badge>
            </div>
          }
        />

        {/* التحاليل المحلية */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--medical-local))]" />
            تحاليلي
          </h4>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-right text-sm min-w-[600px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-2 sm:p-3">الفحص</th>
                  <th className="p-2 sm:p-3">النتيجة</th>
                  <th className="p-2 sm:p-3">المعدل</th>
                  <th className="p-2 sm:p-3">الحالة</th>
                  <th className="p-2 sm:p-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {localLabs.map((test, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="p-2 sm:p-3 font-medium">{test.testName}</td>
                    <td className="p-2 sm:p-3 font-mono">
                      {test.result} {test.unit}
                    </td>
                    <td className="p-2 sm:p-3 text-muted-foreground">{test.range}</td>
                    <td className="p-2 sm:p-3">
                      <Badge
                        variant={
                          test.status === "high"
                            ? "destructive"
                            : test.status === "low"
                            ? "secondary"
                            : "default"
                        }
                        className="whitespace-nowrap"
                      >
                        {test.status === "high"
                          ? "مرتفع"
                          : test.status === "low"
                          ? "منخفض"
                          : "طبيعي"}
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3 text-muted-foreground">{test.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* التحاليل الخارجية */}
        {globalLabs.length > 0 && (
          <div className="relative">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--medical-global))]" />
              تحاليل السجل الموحد
              {!isGlobalAccessUnlocked && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </h4>

            {isGlobalAccessUnlocked ? (
              <div className="overflow-x-auto rounded-xl border animate-unlock">
                <table className="w-full text-right text-sm min-w-[700px]">
                  <thead className="bg-primary/5 text-muted-foreground">
                    <tr>
                      <th className="p-2 sm:p-3">الفحص</th>
                      <th className="p-2 sm:p-3">النتيجة</th>
                      <th className="p-2 sm:p-3">المعدل</th>
                      <th className="p-2 sm:p-3">الحالة</th>
                      <th className="p-2 sm:p-3">التاريخ</th>
                      <th className="p-2 sm:p-3">المصدر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {globalLabs.map((test, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="p-2 sm:p-3 font-medium">{test.testName}</td>
                        <td className="p-2 sm:p-3 font-mono">
                          {test.result} {test.unit}
                        </td>
                        <td className="p-2 sm:p-3 text-muted-foreground">{test.range}</td>
                        <td className="p-2 sm:p-3">
                          <Badge
                            variant={
                              test.status === "high"
                                ? "destructive"
                                : test.status === "low"
                                ? "secondary"
                                : "default"
                            }
                            className="whitespace-nowrap"
                          >
                            {test.status === "high"
                              ? "مرتفع"
                              : test.status === "low"
                              ? "منخفض"
                              : "طبيعي"}
                          </Badge>
                        </td>
                        <td className="p-2 sm:p-3 text-muted-foreground">{test.date}</td>
                        <td className="p-2 sm:p-3">
                          <SourceBadge isLocal={false} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="relative rounded-xl border overflow-hidden">
                <div className="blur-content p-4 sm:p-8 bg-muted/20">
                  <div className="h-24 sm:h-32" />
                </div>
                <LockedOverlay onRequestAccess={requestGlobalAccess} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRadiologyTab = () => {
    if (!selectedPatient) return null;

    const localRadiology = getLocalRecords(selectedPatient.radiology);
    const globalRadiology = getGlobalRecords(selectedPatient.radiology);

    return (
      <div className="space-y-6">
        <SectionHeader icon={<Scan size={18} />} title="تقارير الأشعة" />

        {/* الأشعة المحلية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localRadiology.map((r, i) => (
            <Card key={i} className="access-card-local">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div>
                    <CardTitle className="text-base">{r.type}</CardTitle>
                    <p className="text-sm text-muted-foreground">{r.doctor}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary">{r.date}</Badge>
                    <SourceBadge isLocal={true} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{r.description}</p>
                {r.bodyPart && (
                  <Badge variant="outline" className="mt-2">
                    {r.bodyPart}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* الأشعة الخارجية */}
        {globalRadiology.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              أشعة السجل الموحد
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {globalRadiology.map((r, i) => (
                <AccessControlCard
                  key={i}
                  isLocal={false}
                  isGlobalUnlocked={isGlobalAccessUnlocked}
                  onRequestAccess={requestGlobalAccess}
                  className="p-0"
                >
                  <Card className="border-0 shadow-none">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div>
                          <CardTitle className="text-base">{r.type}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {r.doctor}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary">{r.date}</Badge>
                          <SourceBadge isLocal={false} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{r.description}</p>
                      {r.bodyPart && (
                        <Badge variant="outline" className="mt-2">
                          {r.bodyPart}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </AccessControlCard>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGlobalRecordTab = () => {
    if (!selectedPatient) return null;

    const globalDiagnoses = getGlobalRecords(selectedPatient.diagnoses);
    const globalMedications = getGlobalRecords(selectedPatient.medications);
    const globalLabs = getGlobalRecords(selectedPatient.labTests);
    const globalRadiology = getGlobalRecords(selectedPatient.radiology);
    const globalVisits = getGlobalRecords(selectedPatient.visitNotes);

    const totalGlobal =
      globalDiagnoses.length +
      globalMedications.length +
      globalLabs.length +
      globalRadiology.length +
      globalVisits.length;

    if (!isGlobalAccessUnlocked) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-6">
            <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">الوصول مقيد</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4 sm:mb-6 text-sm sm:text-base">
            السجل الطبي الموحد يحتوي على {totalGlobal} سجل من مصادر خارجية.
            للوصول إليها، يجب الحصول على موافقة المريض عبر رمز OTP.
          </p>
          <Button onClick={requestGlobalAccess} size="lg" className="gap-2 w-full sm:w-auto">
            <Shield className="h-5 w-5" />
            طلب الوصول عبر OTP
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-unlock">
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <div>
              <p className="font-medium text-primary text-sm sm:text-base">تم فتح السجل الموحد</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                الوصول متاح لهذه الجلسة فقط
              </p>
            </div>
          </div>
        </div>

        {/* ملخص */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{globalDiagnoses.length}</p>
            <p className="text-xs text-muted-foreground">تشخيصات</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{globalMedications.length}</p>
            <p className="text-xs text-muted-foreground">أدوية</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{globalLabs.length}</p>
            <p className="text-xs text-muted-foreground">تحاليل</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{globalRadiology.length}</p>
            <p className="text-xs text-muted-foreground">أشعة</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold">{globalVisits.length}</p>
            <p className="text-xs text-muted-foreground">زيارات</p>
          </Card>
        </div>

        {/* التفاصيل */}
        {globalVisits.length > 0 && (
          <section>
            <h4 className="font-medium mb-3 text-sm sm:text-base">تاريخ الزيارات الخارجية</h4>
            <div className="space-y-2">
              {globalVisits.map((visit, i) => (
                <Card key={i} className="p-4 access-card-global">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{visit.department}</Badge>
                      <SourceBadge isLocal={false} />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {visit.date}
                    </span>
                  </div>
                  <p className="font-medium text-sm sm:text-base">{visit.doctorName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {visit.notes}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "labs":
        return renderLabsTab();
      case "radiology":
        return renderRadiologyTab();
      case "global":
        return renderGlobalRecordTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div
      className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 min-h-screen bg-background"
      dir="rtl"
    >
      {/* Header */}
      <div className="grid grid-cols-1 gap-4 w-full sm:px-4 md:px-0">

      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            نظام السجلات الطبية
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            🔒 التحكم بالوصول: السجل المحلي vs السجل الموحد
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 md:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="بحث (اسم، هاتف، رقم ملف)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 h-10 sm:h-11"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto"
          >
            <Filter size={16} className="ml-2" />
            فلتر
          </Button>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">إجمالي المرضى</p>
              <p className="text-xl sm:text-2xl font-bold">{patients.length}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="text-primary" size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">سجلاتي المحلية</p>
              <p className="text-xl sm:text-2xl font-bold text-[hsl(var(--medical-local))]">
                {patients.reduce(
                  (acc, p) =>
                    acc + getLocalRecords(p.labTests).length,
                  0
                )}
              </p>
            </div>
            <div className="p-2 bg-[hsl(var(--medical-local-light))] rounded-lg">
              <User className="text-[hsl(var(--medical-local))]" size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">السجل الموحد</p>
              <p className="text-xl sm:text-2xl font-bold text-[hsl(var(--medical-global))]">
                {patients.reduce(
                  (acc, p) =>
                    acc + getGlobalRecords(p.labTests).length,
                  0
                )}
              </p>
            </div>
            <div className="p-2 bg-[hsl(var(--medical-global-light))] rounded-lg">
              <Globe className="text-[hsl(var(--medical-global))]" size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">تنبيهات</p>
              <p className="text-xl sm:text-2xl font-bold text-destructive">
                {patients.reduce(
                  (acc, p) =>
                    acc + (p.alerts?.filter((a) => a.type === "critical").length || 0),
                  0
                )}
              </p>
            </div>
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertCircle className="text-destructive" size={18} />
            </div>
          </div>
        </Card>
      </div> */}

      {/* Patients Table */}
      <Card>
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="font-semibold text-sm sm:text-base">قائمة المرضى</h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            عرض {filteredPatients.length} من {patients.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-right cursor-pointer p-2 sm:p-3"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center gap-1">
                    المريض
                    {sortConfig?.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer p-2 sm:p-3"
                  onClick={() => requestSort("age")}
                >
                  العمر / الجنس
                </TableHead>
                <TableHead className="text-right p-2 sm:p-3">رقم الهاتف</TableHead>
                <TableHead className="text-right p-2 sm:p-3">الحالة</TableHead>
                <TableHead className="text-right p-2 sm:p-3">السجلات</TableHead>
                <TableHead className="text-right p-2 sm:p-3">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((p) => {
                const localCount = getLocalRecords(p.labTests).length;
                const globalCount = getGlobalRecords(p.labTests).length;

                return (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openModalWithPatient(p)}
                  >
                    <TableCell className="p-2 sm:p-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm sm:text-base">
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            #{p.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <p className="font-medium text-sm sm:text-base">
                        {calculateAge(p.dateOfBirth)} سنة
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.gender === "Male" ? "ذكر" : "أنثى"}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-sm p-2 sm:p-3">
                      {p.contactPhone}
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <Badge
                        variant={
                          p.status?.code === "Critical"
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {p.status?.code || "غير محدد"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs badge-local border px-2 py-0.5 rounded-full">
                          {localCount} محلي
                        </span>
                        <span className="text-xs badge-global border px-2 py-0.5 rounded-full">
                          {globalCount} خارجي
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModalWithPatient(p);
                        }}
                        className="w-full sm:w-auto"
                      >
                        فتح الملف
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      </div>

      {/* Patient Modal */}
      {open && selectedPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
          onClick={handleCloseModal}
        >
          <div
            className={`bg-background rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              maximized
                ? "w-screen h-screen rounded-none"
                : "w-full max-w-6xl max-h-[90vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-card border-b px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                <img
                  src={
                    selectedPatient.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedPatient.name
                    )}&background=3b82f6&color=fff`
                  }
                  alt="avatar"
                  className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full border-2 sm:border-4 border-background shadow"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold truncate">
                      {selectedPatient.name}
                    </h2>
                    <Badge variant="secondary" className="self-start sm:self-auto">
                      {calculateAge(selectedPatient.dateOfBirth)} سنة
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span>
                      {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}
                    </span>
                    <span className="text-muted hidden sm:inline">|</span>
                    <span className="font-mono truncate">{selectedPatient.id}</span>
                    {selectedPatient.bloodType && (
                      <>
                        <span className="text-muted hidden sm:inline">|</span>
                        <span className="flex items-center gap-1">
                          <Droplet size={12} />
                          {selectedPatient.bloodType}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 w-full sm:w-auto">
                {isGlobalAccessUnlocked && (
                  <Badge
                    variant="outline"
                    className="mr-2 badge-global border text-xs hidden sm:flex"
                  >
                    <Shield className="h-3 w-3 ml-1" />
                    السجل الموحد مفتوح
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMaximized(!maximized)}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <Printer size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <Download size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseModal}
                  className="text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Alerts */}
            {selectedPatient.alerts && selectedPatient.alerts.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border-b px-3 py-2">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {selectedPatient.alerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getAlertColor(
                        alert.type
                      )}`}
                    >
                      <AlertTriangle size={12} />
                      {alert.msg}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
              <div ref={contentRef} className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Vitals */}
                {selectedPatient.vitalSigns && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <VitalCard
                      title="معدل النبض"
                      value={selectedPatient.vitalSigns.heartRate}
                      unit="bpm"
                      icon={<Activity className="text-rose-500" size={18} />}
                    />
                    <VitalCard
                      title="ضغط الدم"
                      value={selectedPatient.vitalSigns.bloodPressure}
                      unit="mmHg"
                      icon={<Heart className="text-blue-500" size={18} />}
                    />
                    <VitalCard
                      title="الحرارة"
                      value={selectedPatient.vitalSigns.temperature}
                      unit="°C"
                      icon={<Thermometer className="text-orange-500" size={18} />}
                    />
                    <VitalCard
                      title="سكر الدم"
                      value={selectedPatient.vitalSigns.glucose}
                      unit="mg/dL"
                      icon={<Droplet className="text-purple-500" size={18} />}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                  {/* Sidebar */}
                  <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                    {/* Contact */}
                    <Card className="p-4 sm:p-5">
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 border-b pb-2">
                        بيانات الاتصال
                      </h3>
                      <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg text-primary">
                            <Phone size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-muted-foreground text-xs">
                              الهاتف
                            </p>
                            <p className="font-medium font-mono truncate">
                              {selectedPatient.contactPhone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg text-primary">
                            <Mail size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-muted-foreground text-xs">
                              البريد
                            </p>
                            <p className="font-medium truncate">
                              {selectedPatient.contactEmail}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg text-primary">
                            <MapPin size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-muted-foreground text-xs">
                              العنوان
                            </p>
                            <p className="font-medium truncate">
                              {selectedPatient.address}
                            </p>
                          </div>
                        </div>
                        {selectedPatient.occupation && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg text-primary">
                              <Briefcase size={14} />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">
                                المهنة
                              </p>
                              <p className="font-medium truncate">
                                {selectedPatient.occupation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Allergies */}
                    {selectedPatient.personalInfo?.allergies &&
                      selectedPatient.personalInfo.allergies.length > 0 && (
                        <Card className="p-4 sm:p-5">
                          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 border-b pb-2">
                            الحساسية
                          </h3>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {selectedPatient.personalInfo.allergies.map(
                              (alg, i) => (
                                <Badge
                                  key={i}
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {alg}
                                </Badge>
                              )
                            )}
                          </div>
                        </Card>
                      )}
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-8">
                    {/* Tabs */}
                    <Card className="p-1 mb-4 sm:mb-6">
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full justify-start overflow-x-auto">
                          <TabsTrigger
                            value="overview"
                            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            <Stethoscope size={12} />
                            نظرة عامة
                          </TabsTrigger>
                          <TabsTrigger
                            value="labs"
                            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            <FlaskRound size={12} />
                            التحاليل
                          </TabsTrigger>
                          <TabsTrigger
                            value="radiology"
                            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            <Scan size={12} />
                            الأشعة
                          </TabsTrigger>
                          <TabsTrigger
                            value="global"
                            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            {isGlobalAccessUnlocked ? (
                              <Globe size={12} />
                            ) : (
                              <Lock size={12} />
                            )}
                            السجل الموحد
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </Card>

                    {/* Tab Content */}
                    <Card className="min-h-[300px] sm:min-h-[400px] p-4 sm:p-6">
                      {renderTabContent()}
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      <OTPModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        onSuccess={handleOTPSuccess}
        patientName={selectedPatient?.name}
      />
    </div>
  );
}





























// "use client";

// import React, { useCallback, useMemo, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   X,
//   Maximize2,
//   Minimize2,
//   Download,
//   Printer,
//   Search,
//   Activity,
//   Heart,
//   Thermometer,
//   Droplet,
//   User,
//   Calendar,
//   Phone,
//   MapPin,
//   Mail,
//   AlertCircle,
//   FileText,
//   Pill,
//   FileImage,
//   Stethoscope,
//   Users,
//   Eye,
//   Bone,
//   Brain,
//   Syringe,
//   Scan,
//   Smile,
//   Briefcase,
//   Cigarette,
//   Baby,
//   Info,
//   ClipboardList,
//   AlertTriangle,
//   ChevronDown,
//   ChevronUp,
//   Filter,
//   Menu,
//   BarChart3,
//   Clock,
//   Star,
//   Shield,
//   Zap,
//   ThermometerSun,
//   Weight,
//   Ruler,
//   Bell,
//   TrendingUp,
//   FilePlus,
//   CalendarDays,
//   AlertOctagon,
//   FlaskRound,
//   Calculator,
//   // Lungs,
//   HeartPulse,
//   Scale,
//   Sparkles,
//   RotateCcw,
//   Send,
//   ClipboardCheck,
//   CheckCircle,
//   XCircle,
//   BellRing,
//   CalendarCheck,
//   ArrowUpDown,
//   LineChart,
//   PieChart,
//   DownloadCloud,
//   Upload,
//   Share2,
//   FileSearch,
//   CalendarRange,
//   BellDot,
//   TestTube,
//   Microscope,
//   FileBarChart,
//   FileSpreadsheet,
//   ClipboardPen,
//   // Prescription,
//   ShieldAlert,
//   CalendarClock,
//   History,
//   SearchCheck,
//   Timer,
//   TimerReset,
//   NotebookPen,
//   ClipboardX,
//   ClipboardPlus,
//   BarChart,
//   ChartLine,
//   ChartPie,
//   ChartArea,
//   Clock3,
//   Clock5,
//   Clock8,
//   Clock10,
//   BellOff,
//   BellPlus,
//   BellMinus,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useLocale } from "next-intl";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Progress } from "@/components/ui/progress";
// import { Slider } from "@/components/ui/slider";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";

// // تعريف الأيقونات البديلة
// const KidneyIcon = Droplet;
// const ScanEyeIcon = Eye;
// const ChartNoAxesCombinedIcon = BarChart3;
// const ChartBarIncreasingIcon = TrendingUp;
// const ChartCandlestickIcon = BarChart;
// const ChartColumnIncreasingIcon = TrendingUp;
// const ChartBarBigIcon = BarChart;
// const ChartBarIcon = BarChart;
// const ChartColumnIcon = BarChart;
// const ChartNoAxesColumnIcon = BarChart;
// const ChartNoAxesLineIcon = TrendingUp;
// const ChartCombinedIcon = BarChart3;
// const ChartNoAxesGanttIcon = Calendar;
// const ChartScatterIcon = BarChart;
// const ChartSplineIcon = TrendingUp;
// const Clock4Icon = Clock;
// const Clock6Icon = Clock;
// const Clock7Icon = Clock;
// const Clock9Icon = Clock;
// const Clock11Icon = Clock;
// const Clock12Icon = Clock;

// // ----------------------------
// // Types
// // ----------------------------

// type Gender = "Male" | "Female" | "Other";

// type VisitNote = {
//   date: string;
//   doctorName: string;
//   notes: string;
//   department: string;
//   type: string;
// };

// type LabTest = {
//   testName: string;
//   result: string;
//   unit?: string;
//   range?: string;
//   date?: string;
//   category?: string;
//   status?: string;
//   trend?: 'up' | 'down' | 'stable';
//   department?: string;
// };

// type RadiologyReport = {
//   id?: string;
//   type: string;
//   description: string;
//   date?: string;
//   images?: string[];
//   doctor?: string;
//   department?: string;
//   bodyPart?: string;
// };

// type DentalRecord = {
//   lastCheckup?: string;
//   treatments?: string[];
//   orthodontics?: string | null;
//   notes?: string;
//   doctor?: string;
//   gingivalHealth?: string;
//   teeth?: Record<number, any>;
// };

// type CardioRecord = {
//   ekg?: string;
//   echocardiogram?: string;
//   medications?: string[];
//   notes?: string;
//   doctor?: string;
//   diagnosis?: string[];
//   stressTest?: string;
//   holterMonitor?: string;
// };

// type OphthalmologyRecord = {
//   lastVisit?: string;
//   doctor?: string;
//   visualAcuity?: { od: string; os: string };
//   iop?: { od: string; os: string };
//   diagnosis?: string;
//   prescription?: string;
//   fundusExam?: string;
// };

// type DermatologyRecord = {
//   lastVisit?: string;
//   doctor?: string;
//   skinType?: string;
//   conditions?: Array<{ site: string; type: string; status: string }>;
// };

// type OrthopedicsRecord = {
//   lastVisit?: string;
//   doctor?: string;
//   complaint?: string;
//   mriResult?: string;
//   plan?: string;
//   fractures?: Array<{ bone: string; date: string; treatment: string }>;
// };

// type NeurologyRecord = {
//   diagnosis?: string[];
//   symptoms?: string;
//   reflexes?: string;
//   doctor?: string;
//   eeg?: string;
//   emg?: string;
// };

// type OBGYNRecord = {
//   para?: string;
//   gravida?: string;
//   lmp?: string;
//   cycle?: string;
//   lastVisit?: string;
//   pregnancyWeeks?: number;
//   usFindings?: string;
// };

// type GastroRecord = {
//   endoscopy?: string;
//   colonoscopy?: string;
//   usAbdomen?: string;
//   hPylori?: string;
//   liverStatus?: string;
// };

// type UrologyRecord = {
//   urineAnalysis?: string;
//   psa?: string;
//   usKUB?: string;
//   stones?: Array<{ location: string; size: string }>;
// };

// type EndocrinologyRecord = {
//   thyroidProfile?: { tsh: string; t3: string; t4: string };
//   hba1c?: string;
//   cortisol?: string;
//   usThyroid?: string;
// };

// type PulmonologyRecord = {
//   chestXray?: string;
//   ctChest?: string;
//   spirometry?: string;
//   abg?: { ph: string; pco2: string; po2: string; hco3: string };
// };

// type SocialHistory = {
//   smoking?: string;
//   alcohol?: string;
//   living?: string;
//   exercise?: string;
//   diet?: string;
// };

// type Insurance = {
//   provider: string;
//   policy: string;
//   coverage: string;
// };

// type VitalTrend = {
//   date: string;
//   heartRate: number;
//   bloodPressureSys: number;
//   bloodPressureDia: number;
//   temperature: number;
//   glucose: number;
//   spo2: number;
//   weight: number;
// };

// type TestRequestTemplate = {
//   id: string;
//   name: string;
//   department: string;
//   tests: string[];
//   notes?: string;
// };

// type DrugInteraction = {
//   drug1: string;
//   drug2: string;
//   severity: 'high' | 'moderate' | 'low';
//   description: string;
//   action: string;
// };

// type Reminder = {
//   id: string;
//   title: string;
//   dueDate: string;
//   priority: 'high' | 'medium' | 'low';
//   type: 'followup' | 'test' | 'medication' | 'appointment';
//   completed: boolean;
//   patientId: string;
//   notes?: string;
// };

// type QuickAction = {
//   id: string;
//   name: string;
//   icon: React.ReactNode;
//   description: string;
//   action: () => void;
// };

// type Patient = {
//   id: string;
//   name: string;
//   dateOfBirth: string;
//   gender: Gender;
//   contactPhone?: string;
//   contactEmail?: string;
//   address?: string;
//   avatar?: string;
//   bloodType?: string;
//   maritalStatus?: string;
//   occupation?: string;
//   insurance?: Insurance;
//   status?: {
//     code: string;
//     location: string;
//     admissionDate?: string;
//   };
  
//   // Clinical Decision Support (Alerts)
//   alerts?: Array<{ type: "critical" | "warning" | "info"; msg: string }>;
  
//   // Vitals Trend
//   vitalSigns?: {
//     heartRate?: string;
//     bloodPressure?: string;
//     temperature?: string;
//     glucose?: string;
//     spo2?: string;
//     weight?: string;
//     height?: string;
//     bmi?: string;
//     respiratoryRate?: string;
//   };
  
//   // Detailed History
//   personalInfo?: {
//     allergies?: string[];
//     chronicConditions?: string[];
//     familyHistory?: string[];
//     surgeries?: Array<{ procedure: string; year: string; hospital: string }>;
//     vaccinations?: string[];
//     lifestyle?: SocialHistory;
//   };
  
//   generalMedicine?: {
//     diagnoses?: { description: string; code?: string }[];
//     medications?: Array<{ name: string; dose: string; freq: string; indication: string, startDate?: string }>;
//     symptoms?: string[];
//   };
  
//   labTests?: LabTest[];
//   radiology?: RadiologyReport[];
//   dental?: DentalRecord | null;
//   cardio?: CardioRecord | null;
//   ophthalmology?: OphthalmologyRecord | null;
//   dermatology?: DermatologyRecord | null;
//   orthopedics?: OrthopedicsRecord | null;
//   neurology?: NeurologyRecord | null;
//   obgyn?: OBGYNRecord | null;
//   gastro?: GastroRecord | null;
//   urology?: UrologyRecord | null;
//   endocrinology?: EndocrinologyRecord | null;
//   pulmonology?: PulmonologyRecord | null;
//   visitNotes?: VisitNote[];
  
//   // New features
//   vitalTrends?: VitalTrend[];
//   drugInteractions?: DrugInteraction[];
//   reminders?: Reminder[];
  
//   // Epic-style data
//   specialties?: Record<string, any>;
// };

// // ----------------------------
// // Dummy Data (Enhanced)
// // ----------------------------

// const dummyPatients: Patient[] = [
//   {
//     id: "PAT-2025-001",
//     name: "الحاج/ أحمد عبد الموجود السيد",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     dateOfBirth: "1958-04-12",
//     gender: "Male",
//     bloodType: "A+",
//     contactPhone: "+20 123 456 7890",
//     contactEmail: "ahmed.abdelmawgod@example.com",
//     address: "12 شارع البحر، طنطا، الغربية",
//     maritalStatus: "متزوج",
//     occupation: "مهندس متقاعد",
//     insurance: {
//       provider: "التأمين الصحي الحكومي",
//       policy: "EG-99821",
//       coverage: "كامل"
//     },
//     status: {
//       code: "Stable",
//       location: "العيادات الخارجية",
//       admissionDate: "2024-12-01"
//     },
//     alerts: [
//       { type: "critical", msg: "حساسية مفرطة من البنسلين (Anaphylaxis Risk)" },
//       { type: "warning", msg: "سكر الدم غير منتظم" },
//       { type: "info", msg: "يحتاج متابعة أسبوعية" }
//     ],
//     vitalSigns: {
//       heartRate: "88",
//       bloodPressure: "145/90",
//       temperature: "37.1",
//       glucose: "185",
//       spo2: "96",
//       weight: "92",
//       height: "175",
//       bmi: "30.0",
//       respiratoryRate: "18"
//     },
//     vitalTrends: [
//       { date: "2024-10-01", heartRate: 85, bloodPressureSys: 140, bloodPressureDia: 88, temperature: 36.8, glucose: 170, spo2: 97, weight: 94 },
//       { date: "2024-10-15", heartRate: 82, bloodPressureSys: 138, bloodPressureDia: 86, temperature: 36.9, glucose: 165, spo2: 97, weight: 93 },
//       { date: "2024-11-01", heartRate: 88, bloodPressureSys: 142, bloodPressureDia: 89, temperature: 37.0, glucose: 180, spo2: 96, weight: 92.5 },
//       { date: "2024-11-15", heartRate: 90, bloodPressureSys: 145, bloodPressureDia: 90, temperature: 37.1, glucose: 185, spo2: 96, weight: 92 },
//     ],
//     personalInfo: {
//       allergies: ["البنسلين (Penicillin)", "الفراولة", "صبغة الأشعة"],
//       chronicConditions: [
//         "مرض السكري من النوع الثاني - منذ 15 سنة",
//         "ارتفاع ضغط الدم - منذ 10 سنوات",
//         "قصور الشريان التاجي",
//         "خشونة الركبة"
//       ],
//       familyHistory: [
//         "الأب: توفي بأزمة قلبية في عمر 60",
//         "الأم: كانت تعاني من السكري والفشل الكلوي"
//       ],
//       surgeries: [
//         { procedure: "قسطرة قلبية وتركيب دعامة", year: "2018", hospital: "مركز القلب بالمحلة" },
//         { procedure: "استئصال الزائدة الدودية", year: "1995", hospital: "مستشفى الجامعة" }
//       ],
//       vaccinations: ["لقاح الإنفلونزا الموسمية (2024)", "لقاح كورونا (3 جرعات)"],
//       lifestyle: {
//         smoking: "مدخن سابق (أقلع منذ 2018)",
//         alcohol: "لا يتعاطى",
//         living: "يعيش مع الزوجة والأولاد",
//         exercise: "نشاط بدني محدود بسبب آلام الركبة",
//         diet: "نظام غذائي لمرضى السكري"
//       }
//     },
//     generalMedicine: {
//       diagnoses: [
//         { description: "ارتفاع ضغط الدم", code: "I10" },
//         { description: "سكري من النوع الثاني", code: "E11" },
//         { description: "قصور الشريان التاجي", code: "I25.1" }
//       ],
//       medications: [
//         { name: "Metformin XR", dose: "1000mg", freq: "مرتين يومياً", indication: "السكري", startDate: "2020-03-15" },
//         { name: "Aspirin Protect", dose: "100mg", freq: "مرة يومياً", indication: "سيولة الدم", startDate: "2018-06-20" },
//         { name: "Atorvastatin", dose: "40mg", freq: "مساءً", indication: "الكوليسترول", startDate: "2019-11-05" },
//         { name: "Bisoprolol", dose: "5mg", freq: "مرة يومياً", indication: "الضغط", startDate: "2021-02-10" }
//       ],
//       symptoms: ["تنميل في القدمين", "دوخة عند الوقوف", "آلام في الصدر أحياناً"]
//     },
//     labTests: [
//       { testName: "HbA1c", result: "8.2", unit: "%", range: "< 5.7", date: "2024-11-28", category: "Chemistry", status: "high", trend: "up", department: "Endocrinology" },
//       { testName: "Fasting Glucose", result: "160", unit: "mg/dL", range: "70-100", date: "2024-11-28", category: "Chemistry", status: "high", trend: "stable", department: "Endocrinology" },
//       { testName: "Total Cholesterol", result: "240", unit: "mg/dL", range: "< 200", date: "2024-11-28", category: "Lipids", status: "high", trend: "up", department: "Cardiology" },
//       { testName: "Hemoglobin", result: "13.5", unit: "g/dL", range: "13-17", date: "2024-11-28", category: "Hematology", status: "normal", trend: "stable", department: "General Medicine" },
//       { testName: "Creatinine", result: "1.2", unit: "mg/dL", range: "0.7-1.3", date: "2024-11-28", category: "Renal", status: "normal", department: "Nephrology" },
//       { testName: "ALT", result: "45", unit: "U/L", range: "7-56", date: "2024-11-28", category: "Liver", status: "normal", department: "Gastroenterology" },
//       { testName: "Troponin", result: "0.01", unit: "ng/mL", range: "< 0.04", date: "2024-11-28", category: "Cardiac", status: "normal", department: "Cardiology" },
//       { testName: "Calcium", result: "9.5", unit: "mg/dL", range: "8.5-10.2", date: "2024-10-15", category: "Metabolic", status: "normal", department: "Orthopedics" },
//       { testName: "Vitamin D", result: "18", unit: "ng/mL", range: "30-100", date: "2024-10-15", category: "Metabolic", status: "low", trend: "down", department: "Orthopedics" },
//       { testName: "PSA", result: "2.1", unit: "ng/mL", range: "< 4.0", date: "2024-09-20", category: "Urology", status: "normal", department: "Urology" },
//       { testName: "TSH", result: "2.5", unit: "mIU/L", range: "0.4-4.0", date: "2024-11-28", category: "Endocrine", status: "normal", department: "Endocrinology" },
//     ],
//     radiology: [
//       { id: "R001", type: "Chest X-Ray", description: "No acute cardiopulmonary disease.", date: "2025-09-20", doctor: "د. أحمد سعيد", department: "Pulmonology", bodyPart: "Chest" },
//       { id: "R002", type: "Knee MRI", description: "Medial meniscus tear with osteophytes.", date: "2025-08-12", doctor: "د. علي العظام", department: "Orthopedics", bodyPart: "Knee" },
//       { id: "R003", type: "Abdominal Ultrasound", description: "Mild fatty liver, no stones in gallbladder.", date: "2024-12-01", doctor: "د. محمد الجهاز الهضمي", department: "Gastroenterology", bodyPart: "Abdomen" },
//       { id: "R004", type: "Brain CT", description: "No acute intracranial hemorrhage or mass.", date: "2023-11-15", doctor: "د. سارة الأعصاب", department: "Neurology", bodyPart: "Brain" },
//     ],
//     dental: {
//       lastCheckup: "2025-10-15",
//       treatments: ["Filling #12", "Scaling"],
//       orthodontics: "Braces removed 2023",
//       notes: "المريض فقد ضرسين خلفيين واستبدلوا بجسر.",
//       doctor: "د. تامر الأسنان",
//       gingivalHealth: "Mild Gingivitis",
//       teeth: {
//         18: { status: "missing", note: "Extracted" },
//         19: { status: "filling", type: "Amalgam", surfaces: "MOD" },
//         30: { status: "caries", note: "Deep decay, needs RCT" }
//       }
//     },
//     cardio: {
//       ekg: "Sinus Rhythm with LVH criteria",
//       echocardiogram: "EF: 55%, Mild MR, Grade 1 Diastolic Dysfunction",
//       medications: ["Bisoprolol 5mg", "Aspirin 100mg"],
//       notes: "Mild LV hypertrophy, stable condition",
//       doctor: "د. إبراهيم القلب",
//       diagnosis: ["Ischemic Heart Disease", "Left Ventricular Hypertrophy"],
//       stressTest: "Positive for ischemia at 7 METs",
//       holterMonitor: "Occasional PVCs, no sustained arrhythmias"
//     },
//     ophthalmology: {
//       lastVisit: "2024-11-02",
//       doctor: "د. سلمى الرمد",
//       visualAcuity: { od: "6/6", os: "6/9" },
//       iop: { od: "14 mmHg", os: "15 mmHg" },
//       diagnosis: "Myopia (قصر نظر بسيط) في العين اليسرى",
//       prescription: "نظارة للقراءة فقط",
//       fundusExam: "Normal optic disc, no retinopathy"
//     },
//     dermatology: {
//       lastVisit: "2025-01-15",
//       doctor: "د. كريم الجلدية",
//       skinType: "Type III (Fitzpatrick)",
//       conditions: [
//         { site: "Face", type: "Acne Vulgaris", status: "Improved" },
//         { site: "Left Arm", type: "Eczema", status: "Active flare-up" }
//       ]
//     },
//     orthopedics: {
//       lastVisit: "2023-05-20",
//       doctor: "د. عظام",
//       complaint: "Lower Back Pain",
//       mriResult: "L4-L5 Mild Disc Bulge",
//       plan: "Physical Therapy and NSAIDs",
//       fractures: [
//         { bone: "Right Radius", date: "2010", treatment: "Cast for 6 weeks" }
//       ]
//     },
//     neurology: {
//       diagnosis: ["Diabetic Neuropathy (Peripheral)"],
//       symptoms: "تنميل وحرقة في القدمين (Glove and Stocking sensation)",
//       reflexes: "Ankle jerk reflex: Absent bilateral",
//       doctor: "د. محمود الأعصاب",
//       eeg: "Normal awake and sleep patterns",
//       emg: "Reduced conduction velocity in peroneal nerves"
//     },
//     gastro: {
//       endoscopy: "Mild gastritis, no ulcers, H. pylori negative",
//       colonoscopy: "Diverticulosis in sigmoid colon, no polyps",
//       usAbdomen: "Mild fatty liver, normal pancreas and spleen",
//       hPylori: "Negative",
//       liverStatus: "Mild fatty liver, no cirrhosis"
//     },
//     urology: {
//       urineAnalysis: "Clear, yellow, pH 6.0, no blood, no protein",
//       psa: "2.1 ng/mL",
//       usKUB: "No hydronephrosis, small 3mm stone in right kidney",
//       stones: [
//         { location: "Right Kidney", size: "3mm" }
//       ]
//     },
//     endocrinology: {
//       thyroidProfile: { tsh: "2.5", t3: "1.2", t4: "8.4" },
//       hba1c: "8.2%",
//       cortisol: "15.2 mcg/dL",
//       usThyroid: "Normal sized thyroid, no nodules"
//     },
//     pulmonology: {
//       chestXray: "Cardiomegaly, clear lung fields",
//       ctChest: "Mild emphysematous changes, no pulmonary nodules",
//       spirometry: "FEV1/FVC 68%, mild obstructive pattern",
//       abg: { ph: "7.38", pco2: "42", po2: "88", hco3: "24" }
//     },
//     obgyn: null,
//     visitNotes: [
//       { date: "2025-11-01", doctorName: "د. أحمد سعيد", notes: "متابعة ضغط وسكر، نصح بتعديل النظام الغذائي.", department: "الباطنة", type: "متابعة" },
//       { date: "2025-09-20", doctorName: "د. سارة", notes: "أشعة صدر عادية، متابعة", department: "الأشعة", type: "تشخيص" },
//       { date: "2025-08-15", doctorName: "د. إبراهيم", notes: "تخطيط قلب طبيعي، متابعة الأدوية", department: "القلب", type: "متابعة" }
//     ],
//     drugInteractions: [
//       {
//         drug1: "Metformin",
//         drug2: "Contrast Media",
//         severity: "high",
//         description: "Risk of lactic acidosis with iodinated contrast",
//         action: "Withhold Metformin 48 hours before and after contrast study"
//       },
//       {
//         drug1: "Aspirin",
//         drug2: "Warfarin",
//         severity: "high",
//         description: "Increased bleeding risk",
//         action: "Monitor INR closely if used together"
//       },
//       {
//         drug1: "Atorvastatin",
//         drug2: "Clarithromycin",
//         severity: "moderate",
//         description: "Increased risk of myopathy",
//         action: "Monitor for muscle pain, consider temporary statin discontinuation"
//       }
//     ],
//     reminders: [
//       {
//         id: "REM-001",
//         title: "متابعة سكر الدم",
//         dueDate: "2025-12-15",
//         priority: "high",
//         type: "followup",
//         completed: false,
//         patientId: "PAT-2025-001",
//         notes: "تحليل HbA1c بعد 3 أشهر"
//       },
//       {
//         id: "REM-002",
//         title: "فحص العيون السنوي",
//         dueDate: "2025-12-30",
//         priority: "medium",
//         type: "appointment",
//         completed: false,
//         patientId: "PAT-2025-001",
//         notes: "فحص قاع عين لمرضى السكري"
//       },
//       {
//         id: "REM-003",
//         title: "تجديد وصفة Metformin",
//         dueDate: "2025-12-10",
//         priority: "high",
//         type: "medication",
//         completed: true,
//         patientId: "PAT-2025-001",
//         notes: "يحتاج 3 شهور إضافية"
//       }
//     ]
//   },
//   {
//     id: "PAT-2025-002",
//     name: "مها أحمد محمد علي",
//     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&h=128&q=80",
//     dateOfBirth: "1985-05-15",
//     gender: "Female",
//     bloodType: "O+",
//     contactPhone: "01000000000",
//     contactEmail: "maha.arch@example.com",
//     address: "6 أكتوبر، الجيزة",
//     maritalStatus: "متزوجة",
//     occupation: "مهندسة معمارية",
//     insurance: {
//       provider: "Bupa Global",
//       policy: "EG-99821",
//       coverage: "Platinum"
//     },
//     status: {
//       code: "Stable",
//       location: "العيادات الخارجية"
//     },
//     alerts: [
//       { type: "warning", msg: "لم يتم إجراء فحص الماموجرام السنوي" },
//       { type: "info", msg: "المريضة تفضل التواصل عبر الواتساب" }
//     ],
//     vitalSigns: {
//       heartRate: "72",
//       bloodPressure: "120/80",
//       temperature: "36.8",
//       glucose: "95",
//       spo2: "98",
//       weight: "68",
//       height: "165",
//       bmi: "24.5",
//       respiratoryRate: "16"
//     },
//     vitalTrends: [
//       { date: "2024-11-01", heartRate: 70, bloodPressureSys: 118, bloodPressureDia: 78, temperature: 36.7, glucose: 92, spo2: 98, weight: 67.5 },
//       { date: "2024-11-15", heartRate: 72, bloodPressureSys: 120, bloodPressureDia: 80, temperature: 36.8, glucose: 95, spo2: 98, weight: 68 },
//     ],
//     personalInfo: {
//       allergies: ["عشب اللقاح"],
//       chronicConditions: ["Hypothyroidism (قصور الغدة الدرقية)", "Migraine (صداع نصفي مزمن)"],
//       familyHistory: [
//         "الأم: سرطان الثدي في عمر 55",
//         "الأب: ارتفاع ضغط الدم في عمر 60"
//       ],
//       surgeries: [
//         { procedure: "Caesarean Section", year: "2015", hospital: "مستشفى النساء والولادة" },
//         { procedure: "Tonsillectomy", year: "1995", hospital: "مستشفى الأطفال" }
//       ],
//       vaccinations: ["لقاح الإنفلونزا (2024)", "لقاح HPV"],
//       lifestyle: {
//         smoking: "Non-smoker",
//         alcohol: "Socially (Rare)",
//         living: "تعيش مع الزوج وطفلين",
//         exercise: "Gym 2x/week",
//         diet: "نظام غذائي متوازن"
//       }
//     },
//     generalMedicine: {
//       diagnoses: [
//         { description: "قصور الغدة الدرقية", code: "E03" },
//         { description: "صداع نصفي مزمن", code: "G43" }
//       ],
//       medications: [
//         { name: "Eltroxin", dose: "50mcg", freq: "يومياً", indication: "الغدة الدرقية", startDate: "2018-03-10" },
//         { name: "Panadol Extra", dose: "500mg", freq: "حسب الحاجة", indication: "الصداع", startDate: "2020-05-15" }
//       ],
//       symptoms: ["إرهاق مستمر", "زيادة في الوزن", "نوبات صداع متكررة"]
//     },
//     obgyn: {
//       para: "2",
//       gravida: "2",
//       lmp: "2025-09-20",
//       cycle: "Regular",
//       lastVisit: "2024-12-01",
//       pregnancyWeeks: 12,
//       usFindings: "Single intrauterine pregnancy, fetal heart rate 155 bpm"
//     },
//     endocrinology: {
//       thyroidProfile: { tsh: "4.5", t3: "1.1", t4: "7.8" },
//       hba1c: "5.4%",
//       cortisol: "18.3 mcg/dL",
//       usThyroid: "Mild diffuse enlargement, no nodules"
//     },
//     visitNotes: [
//       { date: "2024-12-01", doctorName: "د. سمية", notes: "فحص دوري، كل المؤشرات طبيعية", department: "النساء", type: "فحص دوري" },
//       { date: "2024-11-15", doctorName: "د. أحمد", notes: "شكوى من صداع متكرر، تم وصف مسكنات", department: "الباطنة", type: "تشخيص" }
//     ],
//     reminders: [
//       {
//         id: "REM-004",
//         title: "موعد السونار الشهري",
//         dueDate: "2025-12-20",
//         priority: "high",
//         type: "appointment",
//         completed: false,
//         patientId: "PAT-2025-002",
//         notes: "فحص متابعة الحمل في الأسبوع 16"
//       }
//     ]
//   }
// ];

// // ----------------------------
// // Test Request Templates
// // ----------------------------

// const testRequestTemplates: TestRequestTemplate[] = [
//   {
//     id: "TEMP-001",
//     name: "فحص الباطنة العامة",
//     department: "General Medicine",
//     tests: [
//       "صورة دم كاملة (CBC)",
//       "وظائف كبد (Liver Profile)",
//       "وظائف كلى (Renal Function)",
//       "سكر صائم وفاطر",
//       "HbA1c",
//       "تحليل بول كامل"
//     ],
//     notes: "الفحوصات الأساسية للمرضى الباطنة"
//   },
//   {
//     id: "TEMP-002",
//     name: "فحص القلب الشامل",
//     department: "Cardiology",
//     tests: [
//       "صورة دم كاملة",
//       "إنزيمات القلب (Troponin, CPK-MB)",
//       "دهون الدم الكامل (Lipid Profile)",
//       "ECG",
//       "Echocardiogram"
//     ],
//     notes: "فحص مرضى القلب والأوعية الدموية"
//   },
//   {
//     id: "TEMP-003",
//     name: "فحص العظام والمفاصل",
//     department: "Orthopedics",
//     tests: [
//       "كالسيوم",
//       "فيتامين د",
//       "ESR",
//       "CRP",
//       "Uric Acid",
//       "Rheumatoid Factor"
//     ],
//     notes: "فحص مرضى العظام والروماتيزم"
//   },
//   {
//     id: "TEMP-004",
//     name: "فحص المسالك البولية",
//     department: "Urology",
//     tests: [
//       "تحليل بول كامل",
//       "مزرعة بول",
//       "وظائف كلى",
//       "PSA",
//       "أملاح الدم"
//     ],
//     notes: "فحص مرضى الكلى والمسالك البولية"
//   },
//   {
//     id: "TEMP-005",
//     name: "فحص الغدد الصماء",
//     department: "Endocrinology",
//     tests: [
//       "سكر صائم وفاطر",
//       "HbA1c",
//       "وظائف الغدة الدرقية",
//       "كورتيزول",
//       "أنسولين"
//     ],
//     notes: "فحص مرضى السكري والغدد"
//   },
//   {
//     id: "TEMP-006",
//     name: "فحص الجهاز الهضمي",
//     department: "Gastroenterology",
//     tests: [
//       "صورة دم كاملة",
//       "وظائف كبد كاملة",
//       "جرثومة المعدة (H. Pylori)",
//       "تحليل براز",
//       "ألبيومين"
//     ],
//     notes: "فحص مرضى الكبد والجهاز الهضمي"
//   }
// ];

// // ----------------------------
// // Quick Actions
// // ----------------------------

// const quickActions: QuickAction[] = [
//   {
//     id: "QA-001",
//     name: "طلب تحاليل",
//     icon: <FlaskRound size={20} />,
//     description: "إنشاء طلب تحاليل جديدة للمريض",
//     action: () => console.log("Request labs")
//   },
//   {
//     id: "QA-002",
//     name: "طلب أشعة",
//     icon: <Scan size={20} />,
//     description: "إنشاء طلب أشعة جديدة",
//     action: () => console.log("Request imaging")
//   },
//   {
//     id: "QA-003",
//     name: "إضافة دواء",
//     icon: <Pill size={20} />,
//     description: "إضافة دواء جديد للعلاج",
//     action: () => console.log("Add medication")
//   },
//   {
//     id: "QA-004",
//     name: "حجز موعد",
//     icon: <CalendarDays size={20} />,
//     description: "حجز موعد متابعة",
//     action: () => console.log("Schedule appointment")
//   },
//   {
//     id: "QA-005",
//     name: "إنشاء تقرير",
//     icon: <FileText size={20} />,
//     description: "إنشاء تقرير طبي مفصل",
//     action: () => console.log("Create report")
//   },
//   {
//     id: "QA-006",
//     name: "فحص تفاعلات",
//     icon: <AlertOctagon size={20} />,
//     description: "فحص التفاعلات الدوائية",
//     action: () => console.log("Check interactions")
//   }
// ];

// // ----------------------------
// // Helper Functions
// // ----------------------------

// function calculateAge(dateOfBirth: string): number {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// const parseVal = (str?: string) => {
//   if (!str) return 0;
//   const matches = str.match(/\d+(\.\d+)?/);
//   return matches ? parseFloat(matches[0]) : 0;
// };

// const getStatusColor = (val: number, min: number, max: number) => {
//   if (val < min || val > max) return "text-red-600 bg-red-50 border-red-100";
//   return "text-emerald-600 bg-emerald-50 border-emerald-100";
// };

// const getAlertColor = (type: string) => {
//   switch (type) {
//     case 'critical': return 'bg-red-100 text-red-800 border-red-200';
//     case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
//     case 'info': return 'bg-blue-50 text-blue-700 border-blue-100';
//     default: return 'bg-gray-100 text-gray-800 border-gray-200';
//   }
// };

// // ----------------------------
// // Chart Components
// // ----------------------------

// const VitalTrendChart = ({ data, title, color = "blue" }: { data: VitalTrend[], title: string, color?: string }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="h-64 flex items-center justify-center text-gray-400">
//         لا توجد بيانات كافية للرسم البياني
//       </div>
//     );
//   }

//   const colors = {
//     blue: "bg-blue-500",
//     green: "bg-green-500",
//     red: "bg-red-500",
//     purple: "bg-purple-500",
//     orange: "bg-orange-500"
//   };

//   return (
//     <div className="p-4">
//       <h4 className="font-medium text-gray-700 mb-4">{title}</h4>
//       <div className="flex items-end h-48 gap-2 border-b border-l border-gray-200 pb-4 pl-4">
//         {data.map((point, index) => (
//           <div key={index} className="flex-1 flex flex-col items-center">
//             <div
//               className={`w-full ${colors[color as keyof typeof colors]} rounded-t-lg transition-all hover:opacity-80`}
//               style={{ height: `${(point.heartRate / 120) * 100}%` }}
//               title={`${point.heartRate} bpm`}
//             />
//             <div className="text-xs text-gray-500 mt-2">{point.date.split('-')[2]}/{point.date.split('-')[1]}</div>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-between mt-2 text-xs text-gray-500">
//         <span>قبل {data.length} أسبوع</span>
//         <span>الآن</span>
//       </div>
//     </div>
//   );
// };

// const LabTrendChart = ({ tests, testName }: { tests: LabTest[], testName: string }) => {
//   const relevantTests = tests.filter(t => t.testName === testName).slice(-5);
  
//   if (relevantTests.length < 2) {
//     return (
//       <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
//         لا توجد بيانات كافية للرسم البياني
//       </div>
//     );
//   }

//   const values = relevantTests.map(t => parseFloat(t.result));
//   const maxVal = Math.max(...values);
//   const minVal = Math.min(...values);

//   return (
//     <div className="p-4">
//       <h4 className="font-medium text-gray-700 mb-4">تطور {testName}</h4>
//       <div className="flex items-end h-40 gap-3 border-b border-l border-gray-200 pb-4 pl-4">
//         {relevantTests.map((test, index) => {
//           const height = ((parseFloat(test.result) - minVal) / (maxVal - minVal)) * 100;
//           return (
//             <div key={index} className="flex-1 flex flex-col items-center">
//               <div
//                 className={`w-full ${test.status === 'high' ? 'bg-red-500' : test.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'} rounded-t-lg transition-all hover:opacity-80`}
//                 style={{ height: `${Math.max(10, height)}%` }}
//                 title={`${test.result} ${test.unit}`}
//               />
//               <div className="text-xs text-gray-500 mt-2">
//                 {test.date ? new Date(test.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : 'N/A'}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <div className="flex justify-between mt-2 text-xs text-gray-500">
//         <span>القيمة الدنيا: {minVal}</span>
//         <span>القيمة القصوى: {maxVal}</span>
//       </div>
//     </div>
//   );
// };

// // ----------------------------
// // Template Components
// // ----------------------------

// const TestRequestTemplateCard = ({ template, onSelect }: { template: TestRequestTemplate, onSelect: () => void }) => {
//   return (
//     <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
//       <CardHeader className="pb-3">
//         <div className="flex justify-between items-start">
//           <CardTitle className="text-base">{template.name}</CardTitle>
//           <Badge variant="outline">{template.department}</Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <ul className="space-y-1 mb-3">
//           {template.tests.slice(0, 3).map((test, idx) => (
//             <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
//               <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
//               {test}
//             </li>
//           ))}
//           {template.tests.length > 3 && (
//             <li className="text-sm text-gray-500">+ {template.tests.length - 3} فحوصات إضافية</li>
//           )}
//         </ul>
//         {template.notes && (
//           <p className="text-xs text-gray-500 border-t pt-2">{template.notes}</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// // ----------------------------
// // Drug Interaction Component
// // ----------------------------

// const DrugInteractionCard = ({ interaction }: { interaction: DrugInteraction }) => {
//   const severityColors = {
//     high: "bg-red-100 text-red-800 border-red-200",
//     moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
//     low: "bg-blue-100 text-blue-800 border-blue-200"
//   };

//   return (
//     <div className={`p-4 rounded-xl border ${severityColors[interaction.severity]}`}>
//       <div className="flex justify-between items-start mb-2">
//         <div className="flex items-center gap-2">
//           <AlertOctagon size={16} />
//           <span className="font-bold">{interaction.drug1} + {interaction.drug2}</span>
//         </div>
//         <Badge className={
//           interaction.severity === 'high' ? 'bg-red-600' :
//           interaction.severity === 'moderate' ? 'bg-yellow-600' :
//           'bg-blue-600'
//         }>
//           {interaction.severity === 'high' ? 'عالية' : interaction.severity === 'moderate' ? 'متوسطة' : 'منخفضة'}
//         </Badge>
//       </div>
//       <p className="text-sm mb-2">{interaction.description}</p>
//       <div className="text-sm font-medium bg-white/50 p-2 rounded-lg">
//         📝 الإجراء: {interaction.action}
//       </div>
//     </div>
//   );
// };

// // ----------------------------
// // Reminder Component
// // ----------------------------

// const ReminderItem = ({ reminder, onToggle }: { reminder: Reminder, onToggle: (id: string) => void }) => {
//   const priorityColors = {
//     high: "border-red-200 bg-red-50",
//     medium: "border-yellow-200 bg-yellow-50",
//     low: "border-blue-200 bg-blue-50"
//   };

//   const typeIcons = {
//     followup: <CalendarDays size={16} />,
//     test: <FlaskRound size={16} />,
//     medication: <Pill size={16} />,
//     appointment: <Clock size={16} />
//   };

//   const isOverdue = new Date(reminder.dueDate) < new Date() && !reminder.completed;

//   return (
//     <div className={`flex items-center gap-3 p-3 rounded-lg border ${priorityColors[reminder.priority]} ${reminder.completed ? 'opacity-60' : ''}`}>
//       <div className="flex items-center gap-2">
//         <Checkbox 
//           checked={reminder.completed}
//           onCheckedChange={() => onToggle(reminder.id)}
//           className="data-[state=checked]:bg-green-600"
//         />
//         <div className={`h-8 w-8 rounded-full flex items-center justify-center ${reminder.completed ? 'bg-green-100 text-green-600' : 'bg-white border'}`}>
//           {typeIcons[reminder.type]}
//         </div>
//       </div>
//       <div className="flex-1">
//         <div className="flex justify-between items-center">
//           <p className={`font-medium ${reminder.completed ? 'line-through text-gray-500' : ''}`}>
//             {reminder.title}
//           </p>
//           <span className="text-xs text-gray-500">
//             {new Date(reminder.dueDate).toLocaleDateString('ar-EG')}
//           </span>
//         </div>
//         {reminder.notes && (
//           <p className="text-sm text-gray-600 mt-1">{reminder.notes}</p>
//         )}
//         {isOverdue && !reminder.completed && (
//           <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
//             <Clock size={12} /> متأخر
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // ----------------------------
// // Advanced Search Component
// // ----------------------------

// const AdvancedSearch = ({ onSearch }: { onSearch: (filters: any) => void }) => {
//   const [filters, setFilters] = useState({
//     testName: "",
//     department: "",
//     dateFrom: "",
//     dateTo: "",
//     status: "",
//     valueRange: [0, 1000]
//   });

//   const departments = Array.from(new Set(dummyPatients.flatMap(p => 
//     p.labTests?.map(t => t.department) || []
//   ))).filter(Boolean);

//   return (
//     <Card className="p-4">
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg">بحث متقدم في التحاليل</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="testName">اسم الفحص</Label>
//             <Input
//               id="testName"
//               placeholder="مثال: HbA1c, Creatinine..."
//               value={filters.testName}
//               onChange={(e) => setFilters({...filters, testName: e.target.value})}
//             />
//           </div>
//           <div>
//             <Label htmlFor="department">القسم</Label>
//             <Select value={filters.department} onValueChange={(value) => setFilters({...filters, department: value})}>
//               <SelectTrigger>
//                 <SelectValue placeholder="جميع الأقسام" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">جميع الأقسام</SelectItem>
//                 {/* {departments.map(dept => (
//                   <SelectItem key={dept} value={dept}>{dept}</SelectItem>
//                 ))} */}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="dateFrom">من تاريخ</Label>
//             <Input
//               id="dateFrom"
//               type="date"
//               value={filters.dateFrom}
//               onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
//             />
//           </div>
//           <div>
//             <Label htmlFor="dateTo">إلى تاريخ</Label>
//             <Input
//               id="dateTo"
//               type="date"
//               value={filters.dateTo}
//               onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
//             />
//           </div>
//         </div>

//         <div>
//           <Label className="mb-2 block">نطاق القيمة</Label>
//           <Slider
//             defaultValue={[0, 1000]}
//             max={1000}
//             step={10}
//             value={filters.valueRange}
//             onValueChange={(value) => setFilters({...filters, valueRange: value})}
//             className="my-4"
//           />
//           <div className="flex justify-between text-sm text-gray-500">
//             <span>{filters.valueRange[0]}</span>
//             <span>{filters.valueRange[1]}</span>
//           </div>
//         </div>

//         <div className="flex gap-2 pt-2">
//           <Button onClick={() => onSearch(filters)} className="flex-1">
//             <Search size={16} className="ml-2" />
//             بحث
//           </Button>
//           <Button variant="outline" onClick={() => {
//             setFilters({
//               testName: "",
//               department: "",
//               dateFrom: "",
//               dateTo: "",
//               status: "",
//               valueRange: [0, 1000]
//             });
//             onSearch({});
//           }}>
//             مسح
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // ----------------------------
// // Subcomponents
// // ----------------------------

// const VitalCard = React.memo(function VitalCard({
//   title,
//   value,
//   unit,
//   icon,
//   min = 0,
//   max = 1000,
//   customCheck,
// }: {
//   title: string;
//   value?: string;
//   unit?: string;
//   icon: React.ReactNode;
//   min?: number;
//   max?: number;
//   customCheck?: (val: string) => string;
// }) {
//   if (!value) return null;
//   const numVal = parseVal(value);
//   let statusClass = "text-gray-600 bg-gray-50 border-gray-100";

//   if (customCheck) {
//     const status = customCheck(value);
//     statusClass = status === "high" ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100";
//   } else {
//     statusClass = getStatusColor(numVal, min, max);
//   }

//   const textColor = statusClass.split(" ")[0];
//   const bg = statusClass.split(" ")[1];
//   const border = statusClass.split(" ")[2];

//   return (
//     <div className={`p-4 rounded-xl border ${border} ${bg} flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02]`}>
//       <div>
//         <p className="text-xs text-gray-500 mb-1 font-medium">{title}</p>
//         <div className="flex items-end gap-1">
//           <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
//           <span className="text-xs text-gray-400 mb-1">{unit}</span>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full bg-white bg-opacity-60 shadow-sm`}>{icon}</div>
//     </div>
//   );
// });

// const SectionHeader = ({ icon, title, action }: { icon?: React.ReactNode; title: string; action?: React.ReactNode }) => (
//   <div className="flex items-center justify-between mb-4">
//     <div className="flex items-center gap-2">
//       <div className="p-2 rounded-md bg-gray-100">{icon}</div>
//       <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//     </div>
//     {action}
//   </div>
// );

// const NavButton = ({ active, onClick, icon, label }: any) => (
//   <button 
//     onClick={onClick} 
//     className={`flex items-center gap-3 p-3 text-sm font-medium transition-all rounded-lg mb-1
//       ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}
//     `}
//   >
//     {icon}
//     {label}
//   </button>
// );

// const Tooth = ({ number, data }: { number: number, data: any }) => {
//   let color = "bg-white border-gray-300";
//   if (data?.status === "missing") color = "bg-gray-200 border-gray-400 opacity-50";
//   if (data?.status === "filling") color = "bg-blue-100 border-blue-400";
//   if (data?.status === "caries") color = "bg-red-100 border-red-400";
//   if (data?.status === "crown") color = "bg-yellow-100 border-yellow-400";

//   return (
//     <div className="flex flex-col items-center gap-1 group cursor-pointer">
//       <div className={`w-8 h-10 rounded-t-lg rounded-b-md border-2 ${color} shadow-sm flex items-center justify-center transition-all hover:scale-110 relative`}>
//         {data?.status === "caries" && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
//         {data?.status === "filling" && <div className="w-3 h-3 bg-blue-500/50 rounded-sm"></div>}
//       </div>
//       <span className="text-xs font-bold text-gray-500">{number}</span>
      
//       {data && (
//         <div className="absolute bottom-12 hidden group-hover:block bg-black/80 text-white text-xs p-2 rounded z-50 whitespace-nowrap">
//           {data.status} - {data.note || data.type}
//         </div>
//       )}
//     </div>
//   );
// };

// const EmptyTab = ({ message, icon: Icon = FileText }: { message: string; icon?: React.ComponentType<any> }) => (
//   <div className="flex flex-col items-center justify-center h-64 text-center">
//     <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
//       <Icon size={32} />
//     </div>
//     <h3 className="text-lg font-medium text-gray-900">لا توجد بيانات</h3>
//     <p className="text-gray-500 max-w-sm mt-2">{message}</p>
//   </div>
// );

// // ----------------------------
// // Department Specific Components
// // ----------------------------

// const DepartmentSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
//   <div className="mb-8">
//     <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
//       <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
//       <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//     </div>
//     {children}
//   </div>
// );

// const TestItem = ({ name, value, unit, range, status }: { name: string, value: string, unit?: string, range?: string, status?: string }) => (
//   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//     <div>
//       <p className="font-medium text-gray-900">{name}</p>
//       <p className="text-sm text-gray-500">{range}</p>
//     </div>
//     <div className="text-right">
//       <p className="font-bold text-lg">
//         {value} <span className="text-sm text-gray-500">{unit}</span>
//       </p>
//       <p className={`text-xs font-medium ${status === 'high' ? 'text-red-600' : status === 'low' ? 'text-yellow-600' : 'text-green-600'}`}>
//         {status === 'high' ? 'مرتفع' : status === 'low' ? 'منخفض' : 'طبيعي'}
//       </p>
//     </div>
//   </div>
// );

// // ----------------------------
// // Main Component
// // ----------------------------

// export default function ComprehensiveMedicalRecordSystem() {
//   const patients = useMemo(() => dummyPatients, []);
//   const locale = useLocale();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<string>("overview");
//   const [open, setOpen] = useState(false);
//   const [maximized, setMaximized] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const [loadingPdf, setLoadingPdf] = useState(false);
//   const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [departmentFilter, setDepartmentFilter] = useState<string>("all");
//   const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
//   const [searchResults, setSearchResults] = useState<LabTest[]>([]);
//   const [selectedTemplate, setSelectedTemplate] = useState<TestRequestTemplate | null>(null);
//   const [showTemplateModal, setShowTemplateModal] = useState(false);
//   const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
//   const [reminders, setReminders] = useState<Reminder[]>(() => 
//     dummyPatients.flatMap(p => p.reminders || [])
//   );

//   const filteredPatients = useMemo(() => {
//     let filtered = patients.filter((p) =>
//       [p.name, p.contactPhone, p.contactEmail, p.id, p.address]
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(p => p.status?.code === statusFilter);
//     }

//     // Apply department filter (based on last visit)
//     if (departmentFilter !== "all") {
//       filtered = filtered.filter(p => 
//         p.visitNotes?.some(v => v.department === departmentFilter)
//       );
//     }

//     // Apply sorting
//     if (sortConfig !== null) {
//       filtered.sort((a, b) => {
//         if (sortConfig.key === 'name') {
//           return sortConfig.direction === 'asc' 
//             ? a.name.localeCompare(b.name)
//             : b.name.localeCompare(a.name);
//         }
//         if (sortConfig.key === 'age') {
//           const ageA = calculateAge(a.dateOfBirth);
//           const ageB = calculateAge(b.dateOfBirth);
//           return sortConfig.direction === 'asc' ? ageA - ageB : ageB - ageA;
//         }
//         if (sortConfig.key === 'lastVisit') {
//           const dateA = a.visitNotes?.[0]?.date || "";
//           const dateB = b.visitNotes?.[0]?.date || "";
//           return sortConfig.direction === 'asc' 
//             ? dateA.localeCompare(dateB)
//             : dateB.localeCompare(dateA);
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [patients, searchTerm, sortConfig, statusFilter, departmentFilter]);

//   const requestSort = (key: string) => {
//     let direction: 'asc' | 'desc' = 'asc';
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const openModalWithPatient = useCallback((patient: Patient) => {
//     setSelectedPatient(patient);
//     setOpen(true);
//     setActiveTab("overview");
//   }, []);

//   const handleAdvancedSearch = useCallback((filters: any) => {
//     if (!selectedPatient?.labTests) return;
    
//     let results = selectedPatient.labTests;
    
//     if (filters.testName) {
//       results = results.filter(t => 
//         t.testName.toLowerCase().includes(filters.testName.toLowerCase())
//       );
//     }
    
//     if (filters.department) {
//       results = results.filter(t => t.department === filters.department);
//     }
    
//     if (filters.dateFrom) {
//       results = results.filter(t => t.date && t.date >= filters.dateFrom);
//     }
    
//     if (filters.dateTo) {
//       results = results.filter(t => t.date && t.date <= filters.dateTo);
//     }
    
//     if (filters.valueRange) {
//       results = results.filter(t => {
//         const val = parseFloat(t.result);
//         return val >= filters.valueRange[0] && val <= filters.valueRange[1];
//       });
//     }
    
//     setSearchResults(results);
//     setActiveTab("labs");
//   }, [selectedPatient]);

//   const handleTemplateSelect = useCallback((template: TestRequestTemplate) => {
//     setSelectedTemplate(template);
//     setShowTemplateModal(true);
//   }, []);

//   const handleReminderToggle = useCallback((reminderId: string) => {
//     setReminders(prev => prev.map(reminder => 
//       reminder.id === reminderId 
//         ? { ...reminder, completed: !reminder.completed }
//         : reminder
//     ));
//   }, []);

//   const handleQuickAction = useCallback((actionId: string) => {
//     setActiveQuickAction(actionId);
//     const action = quickActions.find(a => a.id === actionId);
//     if (action) {
//       action.action();
      
//       // Show success message
//       setTimeout(() => {
//         setActiveQuickAction(null);
//       }, 2000);
//     }
//   }, []);

//   // Print & Export Functions
//   const handlePrint = useCallback(() => {
//     if (!contentRef.current || !selectedPatient) return;
//     const html = contentRef.current.outerHTML;
//     const newWin = window.open("", "_blank", "width=900,height=700");
//     if (!newWin) return;
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>تقرير طبي - ${selectedPatient.name}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
//             body { font-family: 'Cairo', sans-serif; direction: rtl; background: white; }
//             @media print {
//               .no-print { display: none !important; }
//             }
//           </style>
//         </head>
//         <body class="p-8">
//           ${html}
//           <script>
//             setTimeout(() => { window.print(); window.close(); }, 600);
//           </script>
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//   }, [selectedPatient]);

//   const handleExportPDF = useCallback(async () => {
//     if (!contentRef.current || !selectedPatient) return;
//     setLoadingPdf(true);
//     try {
//       const element = contentRef.current;
//       // Temporarily tweak classes for a cleaner PDF
//       element.classList.remove("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.add("bg-white");

//       const canvas = await html2canvas(element, { 
//         scale: 2, 
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff'
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({ 
//         orientation: "portrait", 
//         unit: "mm", 
//         format: "a4",
//         compress: true
//       });

//       const imgWidth = 190;
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
//       let heightLeft = imgHeight;
//       let position = 0;
      
//       pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
      
//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
      
//       pdf.save(`Medical_Record_${selectedPatient.id}_${new Date().toISOString().split('T')[0]}.pdf`);

//       // Restore classes
//       element.classList.add("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.remove("bg-white");
//     } catch (err) {
//       console.error("PDF Error", err);
//       alert("حدث خطأ أثناء إنشاء PDF");
//     } finally {
//       setLoadingPdf(false);
//     }
//   }, [selectedPatient]);

//   // Render Content for Active Tab
//   const renderTabContent = useMemo(() => {
//     if (!selectedPatient) return {};

//     const vitals = selectedPatient.vitalSigns;
//     const dentalTeeth = selectedPatient.dental?.teeth || {};

//     // 1. الباطنة العامة والجهاز الهضمي
//     const internalMedicine = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="الباطنة العامة والجهاز الهضمي" 
//           icon={<Stethoscope size={20} />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">وظائف الكبد</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {selectedPatient.labTests?.filter(t => 
//                   t.category === 'Liver' || t.testName.includes('ALT') || t.testName.includes('AST') || t.testName.includes('Bilirubin')
//                 ).map((test, i) => (
//                   <TestItem key={i} {...test} />
//                 ))}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">وظائف الكلى</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {selectedPatient.labTests?.filter(t => 
//                   t.category === 'Renal' || t.testName.includes('Creatinine') || t.testName.includes('Urea')
//                 ).map((test, i) => (
//                   <TestItem key={i} {...test} />
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
          
//           {selectedPatient.gastro && (
//             <Card className="mt-4">
//               <CardHeader>
//                 <CardTitle className="text-base">فحوصات الجهاز الهضمي</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">جرثومة المعدة</p>
//                     <p className="font-medium">{selectedPatient.gastro.hPylori}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">حالة الكبد</p>
//                     <p className="font-medium">{selectedPatient.gastro.liverStatus}</p>
//                   </div>
//                 </div>
//                 {selectedPatient.gastro.endoscopy && (
//                   <div>
//                     <p className="text-sm text-gray-500">نتيجة المنظار</p>
//                     <p className="text-sm text-gray-700">{selectedPatient.gastro.endoscopy}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           )}
//         </DepartmentSection>
//       </div>
//     );

//     // 2. القلب والأوعية الدموية
//     const cardiology = selectedPatient.cardio && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="القلب والأوعية الدموية" 
//           icon={<HeartPulse size={20} />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">إنزيمات القلب</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {selectedPatient.labTests?.filter(t => 
//                   t.category === 'Cardiac' || t.testName.includes('Troponin') || t.testName.includes('CPK')
//                 ).map((test, i) => (
//                   <TestItem key={i} {...test} />
//                 ))}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">دهون الدم</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {selectedPatient.labTests?.filter(t => 
//                   t.category === 'Lipids' || t.testName.includes('Cholesterol') || t.testName.includes('Triglyceride')
//                 ).map((test, i) => (
//                   <TestItem key={i} {...test} />
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">فحوصات القلب</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">تخطيط القلب (EKG)</p>
//                   <p className="font-medium">{selectedPatient.cardio.ekg}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">إيكو القلب</p>
//                   <p className="font-medium">{selectedPatient.cardio.echocardiogram}</p>
//                 </div>
//               </div>
//               {selectedPatient.cardio.stressTest && (
//                 <div>
//                   <p className="text-sm text-gray-500">اختبار الجهد</p>
//                   <p className="font-medium">{selectedPatient.cardio.stressTest}</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </DepartmentSection>
//       </div>
//     );

//     // 3. العظام
//     const orthopedics = selectedPatient.orthopedics && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="العظام والمفاصل" 
//           icon={<Bone size={20} />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">الكالسيوم وفيتامين د</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {selectedPatient.labTests?.filter(t => 
//                   t.category === 'Metabolic' || t.testName.includes('Calcium') || t.testName.includes('Vitamin D')
//                 ).map((test, i) => (
//                   <TestItem key={i} {...test} />
//                 ))}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">مؤشرات الالتهاب</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {selectedPatient.labTests?.filter(t => 
//                   t.testName.includes('ESR') || t.testName.includes('CRP') || t.testName.includes('Uric Acid')
//                 ).map((test, i) => (
//                   <TestItem key={i} {...test} />
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
          
//           {selectedPatient.orthopedics && (
//             <Card className="mt-4">
//               <CardHeader>
//                 <CardTitle className="text-base">نتائج الأشعة</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-700">{selectedPatient.orthopedics.mriResult}</p>
//               </CardContent>
//             </Card>
//           )}
//         </DepartmentSection>
//       </div>
//     );

//     // 4. المسالك البولية
//     const urology = selectedPatient.urology && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="المسالك البولية" 
//           icon={<KidneyIcon size={20} />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">تحاليل البول</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-700 mb-3">{selectedPatient.urology.urineAnalysis}</p>
//                 <div className="mt-4">
//                   <p className="text-sm text-gray-500">مستوى PSA</p>
//                   <p className="font-medium">{selectedPatient.urology.psa}</p>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">الأشعة والفحوصات</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-700 mb-3">{selectedPatient.urology.usKUB}</p>
//                 {selectedPatient.urology.stones && selectedPatient.urology.stones.length > 0 && (
//                   <div className="mt-4">
//                     <p className="text-sm font-medium text-gray-700 mb-2">حصوات الكلى</p>
//                     <ul className="space-y-2">
//                       {selectedPatient.urology.stones.map((stone, i) => (
//                         <li key={i} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
//                           <span className="text-sm">{stone.location}</span>
//                           <Badge variant="outline">{stone.size}</Badge>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </DepartmentSection>
//       </div>
//     );

//     // 5. النساء والتوليد
//     const obgyn = selectedPatient.obgyn && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="النساء والتوليد" 
//           icon={<Baby size={20} />}
//         >
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <Card className="bg-pink-50 border-pink-100">
//               <CardContent className="p-4 text-center">
//                 <div className="text-sm text-pink-600 font-bold">عدد الحمل (Gravida)</div>
//                 <div className="text-2xl font-bold text-pink-900">{selectedPatient.obgyn.gravida}</div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-pink-50 border-pink-100">
//               <CardContent className="p-4 text-center">
//                 <div className="text-sm text-pink-600 font-bold">الولادة (Para)</div>
//                 <div className="text-2xl font-bold text-pink-900">{selectedPatient.obgyn.para}</div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-pink-50 border-pink-100">
//               <CardContent className="p-4 text-center">
//                 <div className="text-sm text-pink-600 font-bold">آخر دورة (LMP)</div>
//                 <div className="text-lg font-bold text-pink-900">{selectedPatient.obgyn.lmp}</div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-pink-50 border-pink-100">
//               <CardContent className="p-4 text-center">
//                 <div className="text-sm text-pink-600 font-bold">أسابيع الحمل</div>
//                 <div className="text-2xl font-bold text-pink-900">{selectedPatient.obgyn.pregnancyWeeks || "-"}</div>
//               </CardContent>
//             </Card>
//           </div>
          
//           {selectedPatient.obgyn.usFindings && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">نتائج السونار</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-700">{selectedPatient.obgyn.usFindings}</p>
//               </CardContent>
//             </Card>
//           )}
//         </DepartmentSection>
//       </div>
//     );

//     // 6. المخ والأعصاب
//     const neurology = selectedPatient.neurology && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="المخ والأعصاب" 
//           icon={<Brain size={20} />}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">الفحوصات العصبية</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">الأعراض</p>
//                   <p className="font-medium">{selectedPatient.neurology.symptoms}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">المنعكسات</p>
//                   <p className="font-medium">{selectedPatient.neurology.reflexes}</p>
//                 </div>
//               </div>
//               {selectedPatient.neurology.eeg && (
//                 <div>
//                   <p className="text-sm text-gray-500">رسم المخ (EEG)</p>
//                   <p className="font-medium">{selectedPatient.neurology.eeg}</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </DepartmentSection>
//       </div>
//     );

//     // 7. الغدد الصماء
//     const endocrinology = selectedPatient.endocrinology && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="الغدد الصماء" 
//           icon={<Scale size={20} />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">الغدة الدرقية</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {selectedPatient.endocrinology.thyroidProfile && (
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">TSH</span>
//                       <span className="font-medium">{selectedPatient.endocrinology.thyroidProfile.tsh} mIU/L</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">T3</span>
//                       <span className="font-medium">{selectedPatient.endocrinology.thyroidProfile.t3} ng/dL</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">T4</span>
//                       <span className="font-medium">{selectedPatient.endocrinology.thyroidProfile.t4} mcg/dL</span>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">السكري والهرمونات</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500">السكر التراكمي (HbA1c)</p>
//                   <p className="text-2xl font-bold">{selectedPatient.endocrinology.hba1c}</p>
//                 </div>
//                 {selectedPatient.endocrinology.cortisol && (
//                   <div>
//                     <p className="text-sm text-gray-500">الكورتيزول</p>
//                     <p className="font-medium">{selectedPatient.endocrinology.cortisol}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </DepartmentSection>
//       </div>
//     );

//     // 8. الصدرية
//     const pulmonology = selectedPatient.pulmonology && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="الصدرية والجهاز التنفسي" 
//           // icon={<Lungs size={20} />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">أشعة الصدر</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-700 mb-3">{selectedPatient.pulmonology.chestXray}</p>
//                 {selectedPatient.pulmonology.ctChest && (
//                   <div className="mt-4">
//                     <p className="text-sm text-gray-500">الأشعة المقطعية</p>
//                     <p className="text-sm text-gray-700">{selectedPatient.pulmonology.ctChest}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">وظائف الرئة</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-700 mb-3">{selectedPatient.pulmonology.spirometry}</p>
//                 {selectedPatient.pulmonology.abg && (
//                   <div className="mt-4">
//                     <p className="text-sm font-medium text-gray-700 mb-2">غازات الدم (ABG)</p>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <p className="text-xs text-gray-500">pH</p>
//                         <p className="font-medium">{selectedPatient.pulmonology.abg.ph}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">pCO2</p>
//                         <p className="font-medium">{selectedPatient.pulmonology.abg.pco2}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">pO2</p>
//                         <p className="font-medium">{selectedPatient.pulmonology.abg.po2}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">HCO3</p>
//                         <p className="font-medium">{selectedPatient.pulmonology.abg.hco3}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </DepartmentSection>
//       </div>
//     );

//     // Overview Tab
//     const overview = (
//       <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
//         {/* Charts Section */}
//         <section>
//           <SectionHeader 
//             icon={<TrendingUp size={18} />} 
//             title="رسوم بيانية لتطور العلامات الحيوية"
//             action={
//               <Button variant="outline" size="sm">
//                 <CalendarRange size={14} className="ml-2" />
//                 تحديد الفترة
//               </Button>
//             }
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">تطور نبض القلب</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {selectedPatient.vitalTrends && selectedPatient.vitalTrends.length > 0 ? (
//                   <VitalTrendChart data={selectedPatient.vitalTrends} title="نبض القلب (bpm)" color="red" />
//                 ) : (
//                   <div className="h-48 flex items-center justify-center text-gray-400">
//                     لا توجد بيانات كافية
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">تطور ضغط الدم</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {selectedPatient.vitalTrends && selectedPatient.vitalTrends.length > 0 ? (
//                   <div className="p-4">
//                     <div className="flex items-end h-48 gap-2 border-b border-l border-gray-200 pb-4 pl-4">
//                       {selectedPatient.vitalTrends.map((point, index) => (
//                         <div key={index} className="flex-1 flex flex-col items-center">
//                           <div className="flex w-full h-full items-end gap-1">
//                             <div
//                               className="flex-1 bg-blue-500 rounded-t-lg"
//                               style={{ height: `${(point.bloodPressureSys / 200) * 100}%` }}
//                               title={`${point.bloodPressureSys} mmHg`}
//                             />
//                             <div
//                               className="flex-1 bg-blue-300 rounded-t-lg"
//                               style={{ height: `${(point.bloodPressureDia / 120) * 100}%` }}
//                               title={`${point.bloodPressureDia} mmHg`}
//                             />
//                           </div>
//                           <div className="text-xs text-gray-500 mt-2">
//                             {point.date.split('-')[2]}/{point.date.split('-')[1]}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="flex gap-4 mt-4 text-xs">
//                       <div className="flex items-center gap-1">
//                         <div className="h-3 w-3 bg-blue-500 rounded"></div>
//                         <span className="text-gray-500">الانقباضي</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <div className="h-3 w-3 bg-blue-300 rounded"></div>
//                         <span className="text-gray-500">الانبساطي</span>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-48 flex items-center justify-center text-gray-400">
//                     لا توجد بيانات كافية
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">تطور السكر في الدم</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <LabTrendChart tests={selectedPatient.labTests || []} testName="Glucose" />
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">تطور الكوليسترول</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <LabTrendChart tests={selectedPatient.labTests || []} testName="Cholesterol" />
//               </CardContent>
//             </Card>
//           </div>
//         </section>

//         <section>
//           <SectionHeader icon={<FileText size={18} />} title="التشخيصات النشطة" />
//           <div className="grid gap-3">
//             {selectedPatient.generalMedicine?.diagnoses?.map((diag, i) => (
//               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
//                 <div>
//                   <p className="font-semibold text-gray-900">{diag.description}</p>
//                   <p className="text-xs text-gray-500 mt-1">كود: {diag.code || "-"}</p>
//                 </div>
//                 <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section>
//           <SectionHeader icon={<Pill size={18} />} title="الأدوية الحالية" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {selectedPatient.generalMedicine?.medications?.map((med, i) => (
//               <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/30 transition-colors">
//                 <div className="bg-white p-2 rounded-lg shadow-sm text-purple-600">
//                   <Pill size={16} />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start">
//                     <p className="font-medium text-gray-900">{med.name}</p>
//                     <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{med.dose}</span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">{med.freq} - {med.indication}</p>
//                   {med.startDate && (
//                     <p className="text-xs text-gray-400 mt-1">بدأ منذ: {med.startDate}</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     );

//     const labs = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <div className="flex justify-between items-center mb-4">
//           <h4 className="font-bold text-gray-800 text-lg">نتائج المختبر</h4>
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
//               <SearchCheck size={14} className="ml-2" />
//               بحث متقدم
//             </Button>
//             <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
//               <FilePlus size={14} className="ml-2" />
//               قالب طلب
//             </Button>
//           </div>
//         </div>

//         {showAdvancedSearch && (
//           <div className="mb-6">
//             <AdvancedSearch onSearch={handleAdvancedSearch} />
//           </div>
//         )}

//         <div className="overflow-x-auto rounded-xl border border-gray-200">
//           <table className="w-full text-right text-sm">
//             <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
//               <tr>
//                 <th className="p-4">الفئة</th>
//                 <th className="p-4">اسم الفحص</th>
//                 <th className="p-4">النتيجة</th>
//                 <th className="p-4">المعدل الطبيعي</th>
//                 <th className="p-4">الحالة</th>
//                 <th className="p-4">التاريخ</th>
//                 <th className="p-4">القسم</th>
//                 <th className="p-4">الاتجاه</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {(searchResults.length > 0 ? searchResults : selectedPatient.labTests || []).map((test, i) => {
//                 const isHigh = test.status === 'high';
//                 const isLow = test.status === 'low';
//                 return (
//                   <tr key={i} className="hover:bg-gray-50/80">
//                     <td className="p-4 text-gray-500 text-xs uppercase">{test.category}</td>
//                     <td className="p-4 font-medium text-gray-900">{test.testName}</td>
//                     <td className="p-4 font-mono">
//                       {test.result} <span className="text-gray-400">{test.unit}</span>
//                     </td>
//                     <td className="p-4 text-gray-500">{test.range || "-"}</td>
//                     <td className="p-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         isHigh ? 'bg-red-100 text-red-800 border border-red-200' :
//                         isLow ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
//                         'bg-green-100 text-green-800 border border-green-200'
//                       }`}>
//                         {isHigh ? 'مرتفع' : isLow ? 'منخفض' : 'طبيعي'}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-400 text-sm">{test.date || "-"}</td>
//                     <td className="p-4">
//                       <Badge variant="outline" className="text-xs">{test.department || "-"}</Badge>
//                     </td>
//                     <td className="p-4">
//                       {test.trend === 'up' && <TrendingUp size={16} className="text-red-500" />}
//                       {test.trend === 'down' && <TrendingUp size={16} className="text-green-500 transform rotate-180" />}
//                       {test.trend === 'stable' && <div className="h-2 w-6 bg-gray-300 rounded"></div>}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );

//     const radiology = (
//       <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Scan size={18} />} title="تقارير الأشعة" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {selectedPatient.radiology?.map((r, i) => (
//             <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-lg">{r.type}</CardTitle>
//                   <Badge variant="secondary">{r.date}</Badge>
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <p className="text-sm text-gray-500">د. {r.doctor}</p>
//                   <Badge variant="outline" className="text-xs">{r.department}</Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-600 mb-4">{r.description}</p>
//                 {r.bodyPart && (
//                   <div className="mb-3">
//                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                       {r.bodyPart}
//                     </span>
//                   </div>
//                 )}
//                 {r.images && r.images.length > 0 && (
//                   <div className="grid grid-cols-2 gap-2">
//                     {r.images.map((img, idx) => (
//                       <img key={idx} src={img} alt={`${r.type}-${idx}`} 
//                         className="h-24 w-full object-cover rounded-lg border border-gray-200" />
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );

//     const cardio = selectedPatient.cardio ? cardiology : <EmptyTab message="لا توجد بيانات للقلب" icon={Heart} />;
    
//     const dental = selectedPatient.dental ? (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Smile size={18} />} title="سجل الأسنان (Odontogram)" />
        
//         {/* Dental Chart */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-4">
//           {/* Upper Jaw (1-16) */}
//           <div className="flex justify-center gap-2 mb-8">
//             {Array.from({length: 16}, (_, i) => i + 1).map(num => (
//               <Tooth key={num} number={num} data={dentalTeeth[num]} />
//             ))}
//           </div>
          
//           <div className="text-center text-gray-400 font-medium mb-8">--- الفك العلوي / الفك السفلي ---</div>
          
//           {/* Lower Jaw (17-32) */}
//           <div className="flex justify-center gap-2">
//             {Array.from({length: 16}, (_, i) => 32 - i).map(num => (
//               <Tooth key={num} number={num} data={dentalTeeth[num]} />
//             ))}
//           </div>
//         </div>
        
//         {/* Legend */}
//         <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600 mb-6">
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-400"></div> سليم</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-400"></div> تسوس</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-400"></div> حشو</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-400"></div> طربوش</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 border border-gray-400 opacity-50"></div> مخلوع</span>
//         </div>
        
//         {/* Dental Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">معلومات الفحص</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-500">آخر فحص</p>
//                 <p className="font-medium">{selectedPatient.dental.lastCheckup}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">صحة اللثة</p>
//                 <Badge className="bg-blue-100 text-blue-800">{selectedPatient.dental.gingivalHealth}</Badge>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">العلاجات السابقة</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//                 {selectedPatient.dental.treatments?.map((t, i) => (
//                   <li key={i}>{t}</li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
        
//         {selectedPatient.dental.notes && (
//           <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
//             <p className="text-yellow-800"><strong>ملاحظات الطبيب:</strong> {selectedPatient.dental.notes}</p>
//           </div>
//         )}
//       </div>
//     ) : <EmptyTab message="لا توجد بيانات للأسنان" icon={Smile} />;

//     const eyes = selectedPatient.ophthalmology ? (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <DepartmentSection 
//           title="فحص العيون" 
//           icon={<ScanEyeIcon size={20} />}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Right Eye */}
//             <Card className="border-t-4 border-t-blue-500">
//               <CardHeader>
//                 <CardTitle className="text-center text-blue-700">العين اليمنى (OD)</CardTitle>
//               </CardHeader>
//               <CardContent className="text-center space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500">حدّة البصر</p>
//                   <p className="text-3xl font-bold text-gray-800">{selectedPatient.ophthalmology.visualAcuity?.od}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">ضغط العين (IOP)</p>
//                   <p className="text-xl font-bold text-gray-800">{selectedPatient.ophthalmology.iop?.od}</p>
//                 </div>
//               </CardContent>
//             </Card>
            
//             {/* Left Eye */}
//             <Card className="border-t-4 border-t-green-500">
//               <CardHeader>
//                 <CardTitle className="text-center text-green-700">العين اليسرى (OS)</CardTitle>
//               </CardHeader>
//               <CardContent className="text-center space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500">حدّة البصر</p>
//                   <p className="text-3xl font-bold text-gray-800">{selectedPatient.ophthalmology.visualAcuity?.os}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">ضغط العين (IOP)</p>
//                   <p className="text-xl font-bold text-gray-800">{selectedPatient.ophthalmology.iop?.os}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">التشخيص والعلاج</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-500">التشخيص</p>
//                 <p className="text-gray-700">{selectedPatient.ophthalmology.diagnosis}</p>
//               </div>
//               {selectedPatient.ophthalmology.prescription && (
//                 <div>
//                   <p className="text-sm text-gray-500">الوصفة الطبية</p>
//                   <p className="text-gray-700">{selectedPatient.ophthalmology.prescription}</p>
//                 </div>
//               )}
//               {selectedPatient.ophthalmology.fundusExam && (
//                 <div>
//                   <p className="text-sm text-gray-500">فحص قاع العين</p>
//                   <p className="text-gray-700">{selectedPatient.ophthalmology.fundusExam}</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </DepartmentSection>
//       </div>
//     ) : <EmptyTab message="لا توجد بيانات للعيون" icon={Eye} />;

//     const obgynSection = selectedPatient.obgyn ? obgyn : <EmptyTab message="لا توجد بيانات للنساء والولادة" icon={Baby} />;
    
//     const allergies = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<AlertCircle size={18} />} title="الحساسية والأمراض المزمنة" />
        
//         <div className="space-y-4">
//           {selectedPatient.personalInfo?.allergies && selectedPatient.personalInfo.allergies.length > 0 && (
//             <div>
//               <h4 className="font-medium text-gray-800 mb-3">الحساسيات</h4>
//               <div className="flex flex-wrap gap-2">
//                 {selectedPatient.personalInfo.allergies.map((a, i) => (
//                   <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-medium">
//                     {a}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {selectedPatient.personalInfo?.chronicConditions && selectedPatient.personalInfo.chronicConditions.length > 0 && (
//             <div>
//               <h4 className="font-medium text-gray-800 mb-3">الأمراض المزمنة</h4>
//               <div className="flex flex-wrap gap-2">
//                 {selectedPatient.personalInfo.chronicConditions.map((c, i) => (
//                   <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-sm font-medium">
//                     {c}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {selectedPatient.personalInfo?.vaccinations && selectedPatient.personalInfo.vaccinations.length > 0 && (
//             <div>
//               <h4 className="font-medium text-gray-800 mb-3">التطعيمات</h4>
//               <div className="flex flex-wrap gap-2">
//                 {selectedPatient.personalInfo.vaccinations.map((v, i) => (
//                   <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm font-medium">
//                     {v}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );

//     const familyHistory = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Users size={18} />} title="التاريخ العائلي والاجتماعي" />
        
//         {selectedPatient.personalInfo?.familyHistory && selectedPatient.personalInfo.familyHistory.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">التاريخ المرضي العائلي</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2">
//                 {selectedPatient.personalInfo.familyHistory.map((f, i) => (
//                   <li key={i} className="flex items-start gap-2 text-gray-700">
//                     <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         )}
        
//         {selectedPatient.personalInfo?.lifestyle && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">نمط الحياة</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {selectedPatient.personalInfo.lifestyle.smoking && (
//                 <div className="flex items-center gap-2">
//                   <Cigarette size={16} className="text-gray-400" />
//                   <span className="text-gray-700">التدخين: {selectedPatient.personalInfo.lifestyle.smoking}</span>
//                 </div>
//               )}
//               {selectedPatient.personalInfo.lifestyle.exercise && (
//                 <div className="flex items-center gap-2">
//                   <Activity size={16} className="text-gray-400" />
//                   <span className="text-gray-700">التمارين: {selectedPatient.personalInfo.lifestyle.exercise}</span>
//                 </div>
//               )}
//               {selectedPatient.personalInfo.lifestyle.diet && (
//                 <div className="flex items-center gap-2">
//                   <Weight size={16} className="text-gray-400" />
//                   <span className="text-gray-700">النظام الغذائي: {selectedPatient.personalInfo.lifestyle.diet}</span>
//                 </div>
//               )}
//               {selectedPatient.personalInfo.lifestyle.living && (
//                 <div className="flex items-center gap-2">
//                   <Users size={16} className="text-gray-400" />
//                   <span className="text-gray-700">الظروف المعيشية: {selectedPatient.personalInfo.lifestyle.living}</span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     );

//     // Drug Interactions Tab
//     const drugInteractionsTab = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader 
//           icon={<AlertOctagon size={18} />} 
//           title="تفاعلات دوائية وتحذيرات"
//           action={
//             <Button variant="outline" size="sm">
//               <Calculator size={14} className="ml-2" />
//               فحص تفاعلات جديدة
//             </Button>
//           }
//         />
        
//         <div className="space-y-4">
//           {selectedPatient.drugInteractions && selectedPatient.drugInteractions.length > 0 ? (
//             selectedPatient.drugInteractions.map((interaction, i) => (
//               <DrugInteractionCard key={i} interaction={interaction} />
//             ))
//           ) : (
//             <EmptyTab message="لا توجد تفاعلات دوائية مسجلة" icon={AlertOctagon} />
//           )}
//         </div>
        
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">الأدوية الحالية</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               {selectedPatient.generalMedicine?.medications?.map((med, i) => (
//                 <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
//                   {med.name} {med.dose}
//                 </span>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );

//     // Reminders Tab
//     const remindersTab = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader 
//           icon={<BellRing size={18} />} 
//           title="نظام تذكير بالمتابعات والمواعيد"
//           action={
//             <Button variant="outline" size="sm">
//               <BellPlus size={14} className="ml-2" />
//               إضافة تذكير
//             </Button>
//           }
//         />
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-blue-600 font-medium">التذكيرات النشطة</p>
//                   <p className="text-2xl font-bold text-blue-900">
//                     {reminders.filter(r => !r.completed && r.patientId === selectedPatient.id).length}
//                   </p>
//                 </div>
//                 <Bell size={20} className="text-blue-500" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-amber-600 font-medium">متأخرة</p>
//                   <p className="text-2xl font-bold text-amber-900">
//                     {reminders.filter(r => 
//                       !r.completed && 
//                       r.patientId === selectedPatient.id &&
//                       new Date(r.dueDate) < new Date()
//                     ).length}
//                   </p>
//                 </div>
//                 <Clock size={20} className="text-amber-500" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-green-600 font-medium">مكتملة</p>
//                   <p className="text-2xl font-bold text-green-900">
//                     {reminders.filter(r => r.completed && r.patientId === selectedPatient.id).length}
//                   </p>
//                 </div>
//                 <CheckCircle size={20} className="text-green-500" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
        
//         <div className="space-y-3">
//           <h4 className="font-medium text-gray-700">التذكيرات النشطة</h4>
//           {reminders.filter(r => !r.completed && r.patientId === selectedPatient.id).length > 0 ? (
//             reminders
//               .filter(r => !r.completed && r.patientId === selectedPatient.id)
//               .map(reminder => (
//                 <ReminderItem 
//                   key={reminder.id} 
//                   reminder={reminder} 
//                   onToggle={handleReminderToggle}
//                 />
//               ))
//           ) : (
//             <div className="text-center py-8 text-gray-400">
//               <Bell size={48} className="mx-auto mb-4 opacity-30" />
//               <p>لا توجد تذكيرات نشطة</p>
//             </div>
//           )}
//         </div>
        
//         {reminders.filter(r => r.completed && r.patientId === selectedPatient.id).length > 0 && (
//           <div className="space-y-3 mt-8">
//             <h4 className="font-medium text-gray-700">التذكيرات المكتملة</h4>
//             {reminders
//               .filter(r => r.completed && r.patientId === selectedPatient.id)
//               .map(reminder => (
//                 <ReminderItem 
//                   key={reminder.id} 
//                   reminder={reminder} 
//                   onToggle={handleReminderToggle}
//                 />
//               ))
//             }
//           </div>
//         )}
//       </div>
//     );

//     // Test Templates Tab
//     const templatesTab = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader 
//           icon={<ClipboardList size={18} />} 
//           title="قوالب طلبات جاهزة للتحاليل والأشعة"
//           action={
//             <Button variant="outline" size="sm">
//               <ClipboardPlus size={14} className="ml-2" />
//               إنشاء قالب جديد
//             </Button>
//           }
//         />
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {testRequestTemplates.map(template => (
//             <TestRequestTemplateCard 
//               key={template.id} 
//               template={template} 
//               onSelect={() => handleTemplateSelect(template)}
//             />
//           ))}
//         </div>
//       </div>
//     );

//     // Department Overview Tab
//     const departmentOverview = (
//       <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
//         {selectedPatient.gender === "Female" && selectedPatient.obgyn && obgyn}
//         {selectedPatient.gastro && internalMedicine}
//         {selectedPatient.cardio && cardiology}
//         {selectedPatient.orthopedics && orthopedics}
//         {selectedPatient.urology && urology}
//         {selectedPatient.neurology && neurology}
//         {selectedPatient.endocrinology && endocrinology}
//         {selectedPatient.pulmonology && pulmonology}
//       </div>
//     );

//     const mapTabToContent: Record<string, React.ReactNode> = {
//       overview,
//       departmentOverview,
//       labs,
//       radiology,
//       cardio,
//       dental,
//       eyes,
//       obgyn: obgynSection,
//       allergies,
//       familyHistory,
//       drugInteractions: drugInteractionsTab,
//       reminders: remindersTab,
//       templates: templatesTab,
//     };

//     return mapTabToContent;
//   }, [selectedPatient, searchResults, showAdvancedSearch, reminders, handleReminderToggle, handleTemplateSelect, handleAdvancedSearch]);

//   // Quick Actions Bar
//   const QuickActionsBar = () => (
//     <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4">
//       <div className="flex items-center justify-between mb-3">
//         <h4 className="font-medium text-gray-900">إجراءات سريعة</h4>
//         <Badge variant="outline" className="text-xs">
//           {quickActions.length} إجراء
//         </Badge>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
//         {quickActions.map(action => (
//           <TooltipProvider key={action.id}>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className={`flex flex-col h-auto py-3 px-2 transition-all ${
//                     activeQuickAction === action.id 
//                       ? 'border-blue-500 bg-blue-50 text-blue-700' 
//                       : 'hover:border-blue-300'
//                   }`}
//                   onClick={() => handleQuickAction(action.id)}
//                 >
//                   <div className={`p-2 rounded-lg mb-2 ${
//                     activeQuickAction === action.id 
//                       ? 'bg-blue-100 text-blue-600' 
//                       : 'bg-gray-100 text-gray-600'
//                   }`}>
//                     {action.icon}
//                   </div>
//                   <span className="text-xs font-medium">{action.name}</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>{action.description}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-6 space-y-6 font-sans bg-gray-50/50 min-h-screen" dir="rtl">
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
//             نظام السجلات الطبية المتكامل
//             <span className="block text-sm font-normal text-blue-600 mt-1">
//               📊 الرسوم البيانية • 📝 القوالب الجاهزة • ⏰ نظام التذكيرات • 💊 التفاعلات الدوائية
//             </span>
//           </h1>
//         </div>
//         <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
//           <div className="relative w-full md:w-96 group">
//             <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
//             <Input
//               type="search"
//               placeholder="بحث سريع (اسم، هاتف، رقم ملف، نوع فحص)..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pr-10 h-11 bg-white border-gray-200 focus:border-blue-500 rounded-xl shadow-sm transition-all"
//             />
//           </div>
//           <Button 
//             variant="outline" 
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2"
//           >
//             <Filter size={16} />
//             فلتر
//           </Button>
//         </div>
//       </div>

//       {/* Quick Actions Bar */}
//       <QuickActionsBar />

//       {/* Filters Panel */}
//       {showFilters && (
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-in slide-in-from-top duration-200">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-medium text-gray-900">فلاتر البحث المتقدمة</h3>
//             <Button variant="ghost" size="sm" onClick={() => {
//               setStatusFilter("all");
//               setDepartmentFilter("all");
//             }}>
//               إعادة تعيين
//             </Button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block">الحالة</label>
//               <select 
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               >
//                 <option value="all">جميع الحالات</option>
//                 <option value="Stable">مستقر</option>
//                 <option value="Critical">حرج</option>
//                 <option value="Improving">في تحسن</option>
//               </select>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block">القسم</label>
//               <select 
//                 value={departmentFilter}
//                 onChange={(e) => setDepartmentFilter(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               >
//                 <option value="all">جميع الأقسام</option>
//                 <option value="الباطنة">الباطنة</option>
//                 <option value="القلب">القلب</option>
//                 <option value="الأشعة">الأشعة</option>
//                 <option value="النساء">النساء</option>
//                 <option value="العظام">العظام</option>
//                 <option value="المسالك">المسالك البولية</option>
//                 <option value="الأعصاب">الأعصاب</option>
//                 <option value="الغدد">الغدد الصماء</option>
//                 <option value="الصدرية">الصدرية</option>
//               </select>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block">نوع البيانات</label>
//               <select 
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 onChange={(e) => {
//                   if (e.target.value === "withLabs") {
//                     const patientsWithLabs = patients.filter(p => p.labTests && p.labTests.length > 0);
//                     // يمكن تطبيق هذا الفلتر في الواقع العملي
//                   }
//                 }}
//               >
//                 <option value="all">جميع البيانات</option>
//                 <option value="withLabs">مرضى لديهم تحاليل</option>
//                 <option value="withRadiology">مرضى لديهم أشعة</option>
//                 <option value="withReminders">مرضى لديهم تذكيرات</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">إجمالي المرضى</p>
//               <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
//             </div>
//             <div className="p-2 bg-blue-50 rounded-lg">
//               <Users className="text-blue-600" size={20} />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">التحاليل اليوم</p>
//               <p className="text-2xl font-bold text-gray-900">24</p>
//             </div>
//             <div className="p-2 bg-green-50 rounded-lg">
//               <FlaskRound className="text-green-600" size={20} />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">تذكيرات نشطة</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {reminders.filter(r => !r.completed).length}
//               </p>
//             </div>
//             <div className="p-2 bg-red-50 rounded-lg">
//               <Bell className="text-red-600" size={20} />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">تفاعلات دوائية</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {patients.flatMap(p => p.drugInteractions || []).length}
//               </p>
//             </div>
//             <div className="p-2 bg-purple-50 rounded-lg">
//               <AlertOctagon className="text-purple-600" size={20} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Table Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">قائمة المرضى</h3>
//           <div className="text-sm text-gray-500">
//             عرض {filteredPatients.length} من {patients.length} مريض
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader className="bg-gray-50/80">
//               <TableRow>
//                 <TableHead className="text-right font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('name')}>
//                   <div className="flex items-center gap-1">
//                     المريض
//                     {sortConfig?.key === 'name' && (
//                       sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('age')}>
//                   <div className="flex items-center gap-1">
//                     العمر / الجنس
//                     {sortConfig?.key === 'age' && (
//                       sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700">رقم الهاتف</TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('lastVisit')}>
//                   <div className="flex items-center gap-1">
//                     آخر زيارة
//                     {sortConfig?.key === 'lastVisit' && (
//                       sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700">الحالة</TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700">الإجراءات</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredPatients.length > 0 ? (
//                 filteredPatients.map((p) => (
//                   <TableRow key={p.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => openModalWithPatient(p)}>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
//                           {p.name.charAt(0)}
//                         </div>
//                         <div>
//                           <div className="font-semibold text-gray-900">{p.name}</div>
//                           <div className="text-xs text-gray-500">#{p.id}</div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <span className="font-medium">{calculateAge(p.dateOfBirth)} سنة</span>
//                         <span className="text-xs text-gray-500">{p.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-mono text-gray-600">{p.contactPhone}</TableCell>
//                     <TableCell>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                         {p.visitNotes?.[0]?.date || "جديد"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         p.status?.code === "Critical" ? "bg-red-100 text-red-800" :
//                         p.status?.code === "Stable" ? "bg-green-100 text-green-800" :
//                         "bg-yellow-100 text-yellow-800"
//                       }`}>
//                         {p.status?.code || "غير محدد"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openModalWithPatient(p);
//                         }}
//                         variant="outline"
//                         size="sm"
//                         className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         فتح الملف
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-32 text-center text-gray-500">
//                     لا توجد نتائج مطابقة للبحث
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Template Modal */}
//       <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>طلب تحاليل باستخدام قالب</DialogTitle>
//             <DialogDescription>
//               {selectedTemplate?.name} - {selectedTemplate?.department}
//             </DialogDescription>
//           </DialogHeader>
//           {selectedTemplate && (
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium mb-2">الفحوصات المدرجة:</h4>
//                 <ul className="space-y-1 bg-gray-50 p-3 rounded-lg">
//                   {selectedTemplate.tests.map((test, idx) => (
//                     <li key={idx} className="flex items-center gap-2 text-sm">
//                       <CheckCircle size={14} className="text-green-500" />
//                       {test}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               {selectedTemplate.notes && (
//                 <div className="bg-blue-50 p-3 rounded-lg">
//                   <p className="text-sm text-blue-800">{selectedTemplate.notes}</p>
//                 </div>
//               )}
//               <div>
//                 <Label htmlFor="additionalNotes">ملاحظات إضافية</Label>
//                 <Textarea id="additionalNotes" placeholder="أضف أي ملاحظات أو تعليمات إضافية..." />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
//               إلغاء
//             </Button>
//             <Button onClick={() => {
//               // Handle template submission
//               setShowTemplateModal(false);
//               alert(`تم إنشاء طلب تحاليل باستخدام قالب ${selectedTemplate?.name}`);
//             }}>
//               <Send size={16} className="ml-2" />
//               إرسال الطلب
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Modal */}
//       {open && selectedPatient && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4" onClick={() => setOpen(false)}>
//           <div
//             className={`bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
//               maximized ? "w-screen h-screen rounded-none" : "w-full max-w-6xl max-h-[90vh]"
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//               <div className="flex items-center gap-3 md:gap-4">
//                 <div className="relative">
//                   <img
//                     src={selectedPatient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPatient.name)}&background=0D8ABC&color=fff`}
//                     alt="avatar"
//                     className="h-12 w-12 md:h-14 md:w-14 rounded-full border-4 border-white shadow-sm"
//                   />
//                   <span className="absolute bottom-0 right-0 h-3 w-3 md:h-4 md:w-4 bg-emerald-500 border-2 border-white rounded-full"></span>
//                 </div>
//                 <div>
//                   <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
//                     {selectedPatient.name}
//                     <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200 font-normal">
//                       {calculateAge(selectedPatient.dateOfBirth)} سنة
//                     </span>
//                   </h2>
//                   <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
//                     <span className="flex items-center gap-1"><User size={14} /> {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                     <span className="text-gray-300 hidden md:inline">|</span>
//                     <span className="font-mono text-gray-400">ID: {selectedPatient.id}</span>
//                     {selectedPatient.bloodType && (
//                       <>
//                         <span className="text-gray-300 hidden md:inline">|</span>
//                         <span className="flex items-center gap-1"><Droplet size={14} /> {selectedPatient.bloodType}</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-1 md:gap-2">
//                 <Button variant="ghost" size="icon" onClick={() => setMaximized(!maximized)} className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8">
//                   {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handlePrint} className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8">
//                   <Printer size={16} />
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handleExportPDF} className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8">
//                   {loadingPdf ? <span className="animate-spin text-xs">⌛</span> : <Download size={16} />}
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-red-500 hover:bg-red-50 rounded-full h-8 w-8">
//                   <X size={18} />
//                 </Button>
//               </div>
//             </div>

//             {/* Alerts Bar */}
//             {selectedPatient.alerts && selectedPatient.alerts.length > 0 && (
//               <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2">
//                 <div className="flex items-center gap-2 overflow-x-auto">
//                   {selectedPatient.alerts.map((alert, i) => (
//                     <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${getAlertColor(alert.type)}`}>
//                       <AlertTriangle size={14} />
//                       {alert.msg}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-6" dir="rtl">
//               <div ref={contentRef} className="max-w-6xl mx-auto space-y-6">
//                 {/* Vitals Grid */}
//                 {selectedPatient.vitalSigns && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//                     <VitalCard
//                       title="معدل النبض"
//                       value={selectedPatient.vitalSigns.heartRate}
//                       unit="bpm"
//                       icon={<Activity className="text-rose-500" />}
//                       min={60}
//                       max={100}
//                     />
//                     <VitalCard
//                       title="ضغط الدم"
//                       value={selectedPatient.vitalSigns.bloodPressure}
//                       unit="mmHg"
//                       icon={<Heart className="text-blue-500" />}
//                       customCheck={(val) => {
//                         const sys = parseInt(val.split("/")[0]);
//                         return sys > 130 ? "high" : "normal";
//                       }}
//                     />
//                     <VitalCard
//                       title="الحرارة"
//                       value={selectedPatient.vitalSigns.temperature}
//                       unit="°C"
//                       icon={<Thermometer className="text-orange-500" />}
//                       min={36}
//                       max={37.5}
//                     />
//                     <VitalCard
//                       title="سكر الدم"
//                       value={selectedPatient.vitalSigns.glucose}
//                       unit="mg/dL"
//                       icon={<Droplet className="text-purple-500" />}
//                       min={70}
//                       max={140}
//                     />
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
//                   {/* Left Sidebar */}
//                   <div className="lg:col-span-4 space-y-4 md:space-y-6">
//                     {/* Contact Info Card */}
//                     <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">
//                         بيانات الاتصال والمعلومات
//                       </h3>
//                       <div className="space-y-3 md:space-y-4 text-sm">
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                             <Phone size={16} />
//                           </div>
//                           <div>
//                             <p className="text-gray-500 text-xs">رقم الهاتف</p>
//                             <p className="font-medium font-mono dir-ltr text-right">{selectedPatient.contactPhone}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                             <Mail size={16} />
//                           </div>
//                           <div>
//                             <p className="text-gray-500 text-xs">البريد الإلكتروني</p>
//                             <p className="font-medium">{selectedPatient.contactEmail}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                             <MapPin size={16} />
//                           </div>
//                           <div>
//                             <p className="text-gray-500 text-xs">العنوان</p>
//                             <p className="font-medium">{selectedPatient.address}</p>
//                           </div>
//                         </div>
//                         {selectedPatient.occupation && (
//                           <div className="flex items-start gap-3">
//                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                               <Briefcase size={16} />
//                             </div>
//                             <div>
//                               <p className="text-gray-500 text-xs">المهنة</p>
//                               <p className="font-medium">{selectedPatient.occupation}</p>
//                             </div>
//                           </div>
//                         )}
//                         {selectedPatient.insurance && (
//                           <div className="flex items-start gap-3">
//                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                               <Shield size={16} />
//                             </div>
//                             <div>
//                               <p className="text-gray-500 text-xs">التأمين الصحي</p>
//                               <p className="font-medium">{selectedPatient.insurance.provider}</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Medical Alerts Card */}
//                     <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">
//                         تنبيهات طبية
//                       </h3>
//                       <div className="space-y-3 md:space-y-4">
//                         {selectedPatient.personalInfo?.allergies &&
//                           selectedPatient.personalInfo.allergies.length > 0 && (
//                             <div>
//                               <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
//                                 <AlertCircle size={12} /> الحساسية
//                               </p>
//                               <div className="flex flex-wrap gap-2">
//                                 {selectedPatient.personalInfo.allergies.map((alg, i) => (
//                                   <span
//                                     key={i}
//                                     className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium"
//                                   >
//                                     {alg}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                         {selectedPatient.personalInfo?.chronicConditions &&
//                           selectedPatient.personalInfo.chronicConditions.length > 0 && (
//                             <div>
//                               <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
//                                 <Activity size={12} /> الأمراض المزمنة
//                               </p>
//                               <div className="flex flex-wrap gap-2">
//                                 {selectedPatient.personalInfo.chronicConditions.map((cond, i) => (
//                                   <span
//                                     key={i}
//                                     className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium"
//                                   >
//                                     {cond}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                       </div>
//                     </div>

//                     {/* Additional Vitals */}
//                     {selectedPatient.vitalSigns && (
//                       <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
//                         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">
//                           مؤشرات إضافية
//                         </h3>
//                         <div className="grid grid-cols-2 gap-3">
//                           {selectedPatient.vitalSigns.spo2 && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">الأكسجين</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.spo2}%</p>
//                             </div>
//                           )}
//                           {selectedPatient.vitalSigns.weight && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">الوزن</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.weight}kg</p>
//                             </div>
//                           )}
//                           {selectedPatient.vitalSigns.height && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">الطول</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.height}cm</p>
//                             </div>
//                           )}
//                           {selectedPatient.vitalSigns.bmi && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">مؤشر كتلة الجسم</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.bmi}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Right Content Area */}
//                   <div className="lg:col-span-8">
//                     {/* Tabs Navigation */}
//                     <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-4 md:mb-6 overflow-x-auto">
//                       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                         <TabsList className="flex flex-nowrap">
//                           <TabsTrigger value="overview" className="flex items-center gap-2 whitespace-nowrap">
//                             <ClipboardList size={14} />
//                             نظرة عامة
//                           </TabsTrigger>
//                           <TabsTrigger value="departmentOverview" className="flex items-center gap-2 whitespace-nowrap">
//                             <Stethoscope size={14} />
//                             التخصصات
//                           </TabsTrigger>
//                           <TabsTrigger value="labs" className="flex items-center gap-2 whitespace-nowrap">
//                             <FlaskRound size={14} />
//                             التحاليل
//                           </TabsTrigger>
//                           <TabsTrigger value="radiology" className="flex items-center gap-2 whitespace-nowrap">
//                             <Scan size={14} />
//                             الأشعة
//                           </TabsTrigger>
//                           <TabsTrigger value="cardio" className="flex items-center gap-2 whitespace-nowrap">
//                             <Heart size={14} />
//                             القلب
//                           </TabsTrigger>
//                           <TabsTrigger value="dental" className="flex items-center gap-2 whitespace-nowrap">
//                             <Smile size={14} />
//                             الأسنان
//                           </TabsTrigger>
//                           <TabsTrigger value="eyes" className="flex items-center gap-2 whitespace-nowrap">
//                             <Eye size={14} />
//                             العيون
//                           </TabsTrigger>
//                           {selectedPatient.gender === "Female" && (
//                             <TabsTrigger value="obgyn" className="flex items-center gap-2 whitespace-nowrap">
//                               <Baby size={14} />
//                               النساء
//                             </TabsTrigger>
//                           )}
//                           <TabsTrigger value="drugInteractions" className="flex items-center gap-2 whitespace-nowrap">
//                             <AlertOctagon size={14} />
//                             التفاعلات
//                           </TabsTrigger>
//                           <TabsTrigger value="reminders" className="flex items-center gap-2 whitespace-nowrap">
//                             <BellRing size={14} />
//                             التذكيرات
//                           </TabsTrigger>
//                           <TabsTrigger value="templates" className="flex items-center gap-2 whitespace-nowrap">
//                             <ClipboardList size={14} />
//                             القوالب
//                           </TabsTrigger>
//                         </TabsList>
//                       </Tabs>
//                     </div>

//                     {/* Tab Content */}
//                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] p-4 md:p-6">
//                       {selectedPatient && (renderTabContent || {})[activeTab]}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















// "use client";

// import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   X,
//   Maximize2,
//   Minimize2,
//   Download,
//   Printer,
//   Search,
//   Activity,
//   Heart,
//   Thermometer,
//   Droplet,
//   User,
//   Calendar,
//   Phone,
//   MapPin,
//   Mail,
//   AlertCircle,
//   FileText,
//   Pill,
//   Stethoscope,
//   Users,
//   Eye,
//   Bone,
//   Brain,
//   Scan,
//   Smile,
//   Briefcase,
//   Cigarette,
//   Baby,
//   ClipboardList,
//   AlertTriangle,
//   ChevronDown,
//   ChevronUp,
//   Filter,
//   BarChart3,
//   Clock,
//   Shield,
//   TrendingUp,
//   FilePlus,
//   CalendarDays,
//   AlertOctagon,
//   FlaskRound,
//   Calculator,
//   HeartPulse,
//   Scale,
//   BellRing,
//   SearchCheck,
//   Bell,
//   CheckCircle,
//   BellPlus,
//   Lock,      // New
//   Unlock,    // New
//   KeyRound,  // New
//   ShieldAlert // New
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useLocale } from "next-intl";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Checkbox } from "@/components/ui/checkbox";

// // ----------------------------
// // Constants & Configuration
// // ----------------------------

// // محاكاة لمعرف الطبيب الحالي المسجل دخوله
// const CURRENT_DOCTOR_ID = "DOC-CURRENT";

// // أيقونات بديلة
// const KidneyIcon = Droplet;
// const ScanEyeIcon = Eye;

// // ----------------------------
// // Types
// // ----------------------------

// type RecordSource = 'local' | 'external'; // تحديد مصدر البيانات

// type BaseRecord = {
//   source?: RecordSource; // هل هذا السجل تم إنشاؤه بواسطة عيادتنا أم جهة خارجية؟
//   doctorId?: string;     // معرف الطبيب الذي أنشأ السجل
// };

// type Gender = "Male" | "Female" | "Other";

// type VisitNote = BaseRecord & {
//   date: string;
//   doctorName: string;
//   notes: string;
//   department: string;
//   type: string;
// };

// type LabTest = BaseRecord & {
//   testName: string;
//   result: string;
//   unit?: string;
//   range?: string;
//   date?: string;
//   category?: string;
//   status?: string;
//   trend?: 'up' | 'down' | 'stable';
//   department?: string;
// };

// type RadiologyReport = BaseRecord & {
//   id?: string;
//   type: string;
//   description: string;
//   date?: string;
//   images?: string[];
//   doctor?: string;
//   department?: string;
//   bodyPart?: string;
// };

// type DentalRecord = BaseRecord & {
//   lastCheckup?: string;
//   treatments?: string[];
//   orthodontics?: string | null;
//   notes?: string;
//   doctor?: string;
//   gingivalHealth?: string;
//   teeth?: Record<number, any>;
// };

// type CardioRecord = BaseRecord & {
//   ekg?: string;
//   echocardiogram?: string;
//   medications?: string[];
//   notes?: string;
//   doctor?: string;
//   diagnosis?: string[];
//   stressTest?: string;
//   holterMonitor?: string;
// };

// type OphthalmologyRecord = BaseRecord & {
//   lastVisit?: string;
//   doctor?: string;
//   visualAcuity?: { od: string; os: string };
//   iop?: { od: string; os: string };
//   diagnosis?: string;
//   prescription?: string;
//   fundusExam?: string;
// };

// type DermatologyRecord = BaseRecord & {
//   lastVisit?: string;
//   doctor?: string;
//   skinType?: string;
//   conditions?: Array<{ site: string; type: string; status: string }>;
// };

// type OrthopedicsRecord = BaseRecord & {
//   lastVisit?: string;
//   doctor?: string;
//   complaint?: string;
//   mriResult?: string;
//   plan?: string;
//   fractures?: Array<{ bone: string; date: string; treatment: string }>;
// };

// type NeurologyRecord = BaseRecord & {
//   diagnosis?: string[];
//   symptoms?: string;
//   reflexes?: string;
//   doctor?: string;
//   eeg?: string;
//   emg?: string;
// };

// type OBGYNRecord = BaseRecord & {
//   para?: string;
//   gravida?: string;
//   lmp?: string;
//   cycle?: string;
//   lastVisit?: string;
//   pregnancyWeeks?: number;
//   usFindings?: string;
// };

// type GastroRecord = BaseRecord & {
//   endoscopy?: string;
//   colonoscopy?: string;
//   usAbdomen?: string;
//   hPylori?: string;
//   liverStatus?: string;
// };

// type UrologyRecord = BaseRecord & {
//   urineAnalysis?: string;
//   psa?: string;
//   usKUB?: string;
//   stones?: Array<{ location: string; size: string }>;
// };

// type EndocrinologyRecord = BaseRecord & {
//   thyroidProfile?: { tsh: string; t3: string; t4: string };
//   hba1c?: string;
//   cortisol?: string;
//   usThyroid?: string;
// };

// type PulmonologyRecord = BaseRecord & {
//   chestXray?: string;
//   ctChest?: string;
//   spirometry?: string;
//   abg?: { ph: string; pco2: string; po2: string; hco3: string };
// };

// type SocialHistory = {
//   smoking?: string;
//   alcohol?: string;
//   living?: string;
//   exercise?: string;
//   diet?: string;
// };

// type Insurance = {
//   provider: string;
//   policy: string;
//   coverage: string;
// };

// type VitalTrend = {
//   date: string;
//   heartRate: number;
//   bloodPressureSys: number;
//   bloodPressureDia: number;
//   temperature: number;
//   glucose: number;
//   spo2: number;
//   weight: number;
// };

// type TestRequestTemplate = {
//   id: string;
//   name: string;
//   department: string;
//   tests: string[];
//   notes?: string;
// };

// type DrugInteraction = {
//   drug1: string;
//   drug2: string;
//   severity: 'high' | 'moderate' | 'low';
//   description: string;
//   action: string;
// };

// type Reminder = {
//   id: string;
//   title: string;
//   dueDate: string;
//   priority: 'high' | 'medium' | 'low';
//   type: 'followup' | 'test' | 'medication' | 'appointment';
//   completed: boolean;
//   patientId: string;
//   notes?: string;
// };

// type QuickAction = {
//   id: string;
//   name: string;
//   icon: React.ReactNode;
//   description: string;
//   action: () => void;
// };

// type Patient = {
//   id: string;
//   name: string;
//   dateOfBirth: string;
//   gender: Gender;
//   contactPhone?: string;
//   contactEmail?: string;
//   address?: string;
//   avatar?: string;
//   bloodType?: string;
//   maritalStatus?: string;
//   occupation?: string;
//   insurance?: Insurance;
//   status?: {
//     code: string;
//     location: string;
//     admissionDate?: string;
//   };
  
//   alerts?: Array<{ type: "critical" | "warning" | "info"; msg: string }>;
  
//   vitalSigns?: {
//     heartRate?: string;
//     bloodPressure?: string;
//     temperature?: string;
//     glucose?: string;
//     spo2?: string;
//     weight?: string;
//     height?: string;
//     bmi?: string;
//     respiratoryRate?: string;
//   };
  
//   personalInfo?: {
//     allergies?: string[];
//     chronicConditions?: string[];
//     familyHistory?: string[];
//     surgeries?: Array<{ procedure: string; year: string; hospital: string }>;
//     vaccinations?: string[];
//     lifestyle?: SocialHistory;
//   };
  
//   generalMedicine?: {
//     diagnoses?: { description: string; code?: string }[];
//     medications?: Array<{ name: string; dose: string; freq: string; indication: string, startDate?: string }>;
//     symptoms?: string[];
//   };
  
//   labTests?: LabTest[];
//   radiology?: RadiologyReport[];
//   dental?: DentalRecord | null;
//   cardio?: CardioRecord | null;
//   ophthalmology?: OphthalmologyRecord | null;
//   dermatology?: DermatologyRecord | null;
//   orthopedics?: OrthopedicsRecord | null;
//   neurology?: NeurologyRecord | null;
//   obgyn?: OBGYNRecord | null;
//   gastro?: GastroRecord | null;
//   urology?: UrologyRecord | null;
//   endocrinology?: EndocrinologyRecord | null;
//   pulmonology?: PulmonologyRecord | null;
//   visitNotes?: VisitNote[];
  
//   vitalTrends?: VitalTrend[];
//   drugInteractions?: DrugInteraction[];
//   reminders?: Reminder[];
  
//   specialties?: Record<string, any>;
// };

// // ----------------------------
// // Dummy Data (Modified with Sources)
// // ----------------------------

// const dummyPatients: Patient[] = [
//   {
//     id: "PAT-2025-001",
//     name: "الحاج/ أحمد عبد الموجود السيد",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     dateOfBirth: "1958-04-12",
//     gender: "Male",
//     bloodType: "A+",
//     contactPhone: "+20 123 456 7890",
//     contactEmail: "ahmed.abdelmawgod@example.com",
//     address: "12 شارع البحر، طنطا، الغربية",
//     maritalStatus: "متزوج",
//     occupation: "مهندس متقاعد",
//     insurance: {
//       provider: "التأمين الصحي الحكومي",
//       policy: "EG-99821",
//       coverage: "كامل"
//     },
//     status: {
//       code: "Stable",
//       location: "العيادات الخارجية",
//       admissionDate: "2024-12-01"
//     },
//     alerts: [
//       { type: "critical", msg: "حساسية مفرطة من البنسلين (Anaphylaxis Risk)" },
//     ],
//     vitalSigns: {
//       heartRate: "88",
//       bloodPressure: "145/90",
//       temperature: "37.1",
//       glucose: "185",
//       spo2: "96",
//       weight: "92",
//       height: "175",
//       bmi: "30.0",
//       respiratoryRate: "18"
//     },
//     labTests: [
//       // تحاليل تمت في عيادتنا (Local)
//       { 
//         testName: "HbA1c", result: "8.2", unit: "%", range: "< 5.7", date: "2024-11-28", 
//         category: "Chemistry", status: "high", trend: "up", department: "Endocrinology",
//         source: "local", doctorId: CURRENT_DOCTOR_ID
//       },
//       { 
//         testName: "Fasting Glucose", result: "160", unit: "mg/dL", range: "70-100", date: "2024-11-28", 
//         category: "Chemistry", status: "high", trend: "stable", department: "Endocrinology",
//         source: "local", doctorId: CURRENT_DOCTOR_ID
//       },
//       // تحاليل خارجية (External) - ستكون مقفولة افتراضياً
//       { 
//         testName: "Total Cholesterol", result: "240", unit: "mg/dL", range: "< 200", date: "2024-10-01", 
//         category: "Lipids", status: "high", trend: "up", department: "Cardiology",
//         source: "external", doctorId: "DOC-EXT-99"
//       },
//       { 
//         testName: "Creatinine", result: "1.2", unit: "mg/dL", range: "0.7-1.3", date: "2024-10-01", 
//         category: "Renal", status: "normal", department: "Nephrology",
//         source: "external", doctorId: "DOC-EXT-99"
//       },
//     ],
//     radiology: [
//       // أشعة خارجية
//       { 
//         id: "R001", type: "Chest X-Ray", description: "No acute cardiopulmonary disease.", date: "2025-09-20", 
//         doctor: "د. أحمد سعيد", department: "Pulmonology", bodyPart: "Chest",
//         source: "external", doctorId: "DOC-EXT-99"
//       },
//       // أشعة داخلية
//       { 
//         id: "R002", type: "Knee MRI", description: "Medial meniscus tear with osteophytes.", date: "2025-08-12", 
//         doctor: "د. علي العظام", department: "Orthopedics", bodyPart: "Knee",
//         source: "local", doctorId: CURRENT_DOCTOR_ID
//       },
//     ],
//     dental: {
//       source: "external", // سجل الأسنان خارجي بالكامل
//       lastCheckup: "2025-10-15",
//       treatments: ["Filling #12", "Scaling"],
//       orthodontics: "Braces removed 2023",
//       notes: "المريض فقد ضرسين خلفيين واستبدلوا بجسر.",
//       doctor: "د. تامر الأسنان",
//       gingivalHealth: "Mild Gingivitis",
//       teeth: {
//         18: { status: "missing", note: "Extracted" },
//         19: { status: "filling", type: "Amalgam", surfaces: "MOD" },
//         30: { status: "caries", note: "Deep decay, needs RCT" }
//       }
//     },
//     cardio: {
//       source: "local", // سجل القلب داخلي
//       ekg: "Sinus Rhythm with LVH criteria",
//       echocardiogram: "EF: 55%, Mild MR, Grade 1 Diastolic Dysfunction",
//       medications: ["Bisoprolol 5mg", "Aspirin 100mg"],
//       notes: "Mild LV hypertrophy, stable condition",
//       doctor: "د. إبراهيم القلب",
//       diagnosis: ["Ischemic Heart Disease", "Left Ventricular Hypertrophy"],
//       stressTest: "Positive for ischemia at 7 METs",
//       holterMonitor: "Occasional PVCs, no sustained arrhythmias"
//     },
//     visitNotes: [
//       { 
//         date: "2025-11-01", doctorName: "د. أحمد (أنا)", notes: "متابعة ضغط وسكر، نصح بتعديل النظام الغذائي.", 
//         department: "الباطنة", type: "متابعة", source: "local", doctorId: CURRENT_DOCTOR_ID
//       },
//       { 
//         date: "2025-09-20", doctorName: "د. سارة (مستشفى آخر)", notes: "أشعة صدر عادية، متابعة", 
//         department: "الأشعة", type: "تشخيص", source: "external", doctorId: "DOC-EXT-99"
//       },
//     ],
//     // ... rest of patient data (abbreviated for brevity)
//     drugInteractions: [],
//     reminders: [],
//     personalInfo: {
//         allergies: ["البنسلين"],
//         chronicConditions: ["ضغط", "سكر"],
//         familyHistory: ["والد: سكري"],
//         surgeries: [],
//         vaccinations: [],
//         lifestyle: { smoking: "No" }
//     }
//   },
//   // Patient 2 (Simplified)
//   {
//     id: "PAT-2025-002",
//     name: "مها أحمد محمد علي",
//     dateOfBirth: "1985-05-15",
//     gender: "Female",
//     bloodType: "O+",
//     contactPhone: "01000000000",
//     status: { code: "Stable", location: "العيادات" },
//     labTests: [],
//     visitNotes: [],
//     // ...
//   }
// ];

// // ----------------------------
// // UI Components for Security
// // ----------------------------

// // مكون القفل الذي يظهر عندما يكون المحتوى محمياً
// const LockedContentOverlay = ({ onUnlockRequest, title = "سجل طبي خارجي" }: { onUnlockRequest: () => void, title?: string }) => (
//   <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 p-6 flex flex-col items-center justify-center min-h-[200px] text-center group transition-all hover:bg-gray-100/80">
//     <div className="absolute inset-0 bg-grid-slate-200/[0.2] -z-10" />
//     <div className="p-4 bg-white shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
//       <Lock size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//     </div>
//     <h3 className="text-lg font-bold text-gray-700 mb-1">{title}</h3>
//     <p className="text-sm text-gray-500 max-w-sm mb-4">
//       هذا السجل تم إنشاؤه في عيادة أخرى أو بواسطة طبيب آخر. لحماية خصوصية المريض، يتطلب العرض رمز تحقق (OTP).
//     </p>
//     <Button onClick={onUnlockRequest} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
//       <KeyRound size={16} className="ml-2" />
//       طلب رمز الوصول
//     </Button>
//   </div>
// );

// // شارة لتمييز السجلات الخارجية
// const ExternalBadge = () => (
//   <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 text-[10px] px-1.5 py-0">
//     <ShieldAlert size={10} />
//     خارجي
//   </Badge>
// );

// const LocalBadge = () => (
//   <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 text-[10px] px-1.5 py-0">
//     <CheckCircle size={10} />
//     عيادتنا
//   </Badge>
// );

// // ----------------------------
// // Helper Functions
// // ----------------------------

// function calculateAge(dateOfBirth: string): number {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// const getStatusColor = (val: number, min: number, max: number) => {
//   if (val < min || val > max) return "text-red-600 bg-red-50 border-red-100";
//   return "text-emerald-600 bg-emerald-50 border-emerald-100";
// };

// // ----------------------------
// // Subcomponents
// // ----------------------------

// const VitalCard = React.memo(function VitalCard({
//   title,
//   value,
//   unit,
//   icon,
//   min = 0,
//   max = 1000,
//   customCheck,
// }: {
//   title: string;
//   value?: string;
//   unit?: string;
//   icon: React.ReactNode;
//   min?: number;
//   max?: number;
//   customCheck?: (val: string) => string;
// }) {
//   if (!value) return null;
//   // Simple Parsing logic
//   const matches = value.match(/\d+(\.\d+)?/);
//   const numVal = matches ? parseFloat(matches[0]) : 0;
  
//   let statusClass = "text-gray-600 bg-gray-50 border-gray-100";
//   if (customCheck) {
//     const status = customCheck(value);
//     statusClass = status === "high" ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100";
//   } else {
//     statusClass = getStatusColor(numVal, min, max);
//   }

//   const textColor = statusClass.split(" ")[0];
//   const bg = statusClass.split(" ")[1];
//   const border = statusClass.split(" ")[2];

//   return (
//     <div className={`p-4 rounded-xl border ${border} ${bg} flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02]`}>
//       <div>
//         <p className="text-xs text-gray-500 mb-1 font-medium">{title}</p>
//         <div className="flex items-end gap-1">
//           <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
//           <span className="text-xs text-gray-400 mb-1">{unit}</span>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full bg-white bg-opacity-60 shadow-sm`}>{icon}</div>
//     </div>
//   );
// });

// const SectionHeader = ({ icon, title, action }: { icon?: React.ReactNode; title: string; action?: React.ReactNode }) => (
//   <div className="flex items-center justify-between mb-4">
//     <div className="flex items-center gap-2">
//       <div className="p-2 rounded-md bg-gray-100">{icon}</div>
//       <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//     </div>
//     {action}
//   </div>
// );

// // ----------------------------
// // Main Component
// // ----------------------------

// export default function ComprehensiveMedicalRecordSystem() {
//   const patients = useMemo(() => dummyPatients, []);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<string>("overview");
//   const [open, setOpen] = useState(false);
//   const [maximized, setMaximized] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
//   // Security States
//   const [isGlobalUnlocked, setIsGlobalUnlocked] = useState(false); // حالة القفل
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otpInput, setOtpInput] = useState("");
//   const [otpError, setOtpError] = useState(false);

//   const contentRef = useRef<HTMLDivElement | null>(null);

//   // Filter patients logic
//   const filteredPatients = useMemo(() => {
//     return patients.filter((p) =>
//       [p.name, p.contactPhone, p.id].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [patients, searchTerm]);

//   // Open Patient Modal
//   const openModalWithPatient = useCallback((patient: Patient) => {
//     setSelectedPatient(patient);
//     setOpen(true);
//     setActiveTab("overview");
//     // Reset security state when opening a new patient
//     setIsGlobalUnlocked(false);
//     setOtpInput("");
//     setOtpError(false);
//   }, []);

//   // Handle OTP Submission
//   const handleUnlockGlobal = () => {
//     // For prototype: any 4 digits work. In real app, verify against backend.
//     if (otpInput.length === 4) {
//       setIsGlobalUnlocked(true);
//       setShowOtpModal(false);
//       setOtpInput("");
//       setOtpError(false);
//     } else {
//       setOtpError(true);
//     }
//   };

//   // Helper to check if a record is visible
//   const isRecordVisible = (record: BaseRecord) => {
//     if (record.source === 'external' && !isGlobalUnlocked) return false;
//     return true;
//   };

//   // Render Content for Active Tab
//   const renderTabContent = useMemo(() => {
//     if (!selectedPatient) return {};

//     // 1. Overview Tab (Smart Filtering)
//     const overview = (
//       <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
//         {/* Status Banner */}
//         <div className={`rounded-lg p-4 flex items-center justify-between ${isGlobalUnlocked ? 'bg-emerald-50 border border-emerald-200' : 'bg-blue-50 border border-blue-200'}`}>
//           <div className="flex items-center gap-3">
//             <div className={`p-2 rounded-full ${isGlobalUnlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
//               {isGlobalUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
//             </div>
//             <div>
//               <h4 className={`font-bold ${isGlobalUnlocked ? 'text-emerald-800' : 'text-blue-800'}`}>
//                 {isGlobalUnlocked ? 'وصول كامل للسجل الطبي' : 'عرض السجلات المحلية فقط'}
//               </h4>
//               <p className="text-xs text-gray-500">
//                 {isGlobalUnlocked 
//                   ? 'يمكنك الآن رؤية السجلات من العيادات الأخرى لهذه الجلسة.' 
//                   : 'السجلات الخارجية مخفية. اطلب رمز التحقق من المريض للعرض.'}
//               </p>
//             </div>
//           </div>
//           {!isGlobalUnlocked && (
//             <Button size="sm" onClick={() => setShowOtpModal(true)} className="bg-blue-600 hover:bg-blue-700">
//               فك القفل (OTP)
//             </Button>
//           )}
//         </div>

//         {/* Visit Notes - Mixed with Blurs */}
//         <section>
//           <SectionHeader icon={<FileText size={18} />} title="سجل الزيارات" />
//           <div className="space-y-3">
//             {selectedPatient.visitNotes?.map((note, i) => {
//               const isLocked = !isRecordVisible(note);
              
//               if (isLocked) {
//                 return (
//                   <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl opacity-70">
//                     <div className="flex items-center gap-3">
//                       <Lock size={16} className="text-gray-400" />
//                       <div>
//                         <p className="font-semibold text-gray-500 blur-[4px]">زيارة خارجية بتاريخ 2024</p>
//                         <p className="text-xs text-gray-400">سجل محمي</p>
//                       </div>
//                     </div>
//                     <Badge variant="outline" className="bg-gray-100 text-gray-500">مغلق</Badge>
//                   </div>
//                 );
//               }

//               return (
//                 <div key={i} className={`p-4 rounded-xl border transition-colors ${note.source === 'local' ? 'bg-white border-blue-100 hover:border-blue-300' : 'bg-amber-50/30 border-amber-100'}`}>
//                   <div className="flex justify-between items-start mb-2">
//                     <div className="flex items-center gap-2">
//                       <p className="font-bold text-gray-800">{note.doctorName}</p>
//                       {note.source === 'external' ? <ExternalBadge /> : <LocalBadge />}
//                     </div>
//                     <span className="text-xs text-gray-500">{note.date}</span>
//                   </div>
//                   <p className="text-gray-700 text-sm leading-relaxed">{note.notes}</p>
//                   <div className="mt-2 flex gap-2">
//                     <Badge variant="secondary" className="text-xs">{note.department}</Badge>
//                     <Badge variant="outline" className="text-xs">{note.type}</Badge>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* Vital Trends Chart */}
//         <section>
//            <SectionHeader icon={<TrendingUp size={18} />} title="تطور العلامات الحيوية" />
//            <Card>
//              <CardContent className="pt-6">
//                 {/* Chart logic here - usually standard */}
//                 <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
//                   مساحة الرسم البياني (بيانات محلية)
//                 </div>
//              </CardContent>
//            </Card>
//         </section>
//       </div>
//     );

//     // 2. Labs Tab
//     const labs = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <div className="flex justify-between items-center mb-4">
//           <h4 className="font-bold text-gray-800 text-lg">نتائج المختبر</h4>
//           {!isGlobalUnlocked && (
//              <Button variant="outline" size="sm" onClick={() => setShowOtpModal(true)} className="text-amber-600 border-amber-200 bg-amber-50">
//                <Lock size={14} className="ml-2" />
//                إظهار التحاليل الخارجية ({selectedPatient.labTests?.filter(t => t.source === 'external').length})
//              </Button>
//           )}
//         </div>

//         <div className="overflow-x-auto rounded-xl border border-gray-200">
//           <table className="w-full text-right text-sm">
//             <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
//               <tr>
//                 <th className="p-4">الفحص</th>
//                 <th className="p-4">النتيجة</th>
//                 <th className="p-4">الحالة</th>
//                 <th className="p-4">التاريخ</th>
//                 <th className="p-4">المصدر</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {selectedPatient.labTests?.map((test, i) => {
//                 const isLocked = !isRecordVisible(test);
                
//                 if (isLocked) {
//                     return (
//                         <tr key={i} className="bg-gray-50/50">
//                             <td className="p-4 flex items-center gap-2">
//                                 <Lock size={14} className="text-gray-400" />
//                                 <span className="text-gray-500 font-medium">{test.testName}</span>
//                             </td>
//                             <td className="p-4 filter blur-sm select-none text-gray-400">123.45</td>
//                             <td className="p-4 filter blur-sm select-none text-gray-400">High</td>
//                             <td className="p-4 text-gray-400">{test.date}</td>
//                             <td className="p-4"><ExternalBadge /></td>
//                         </tr>
//                     )
//                 }

//                 const isHigh = test.status === 'high';
//                 return (
//                   <tr key={i} className="hover:bg-gray-50/80">
//                     <td className="p-4 font-medium text-gray-900">{test.testName}</td>
//                     <td className="p-4 font-mono">
//                       {test.result} <span className="text-gray-400">{test.unit}</span>
//                     </td>
//                     <td className="p-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isHigh ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//                         {isHigh ? 'مرتفع' : 'طبيعي'}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-400 text-sm">{test.date}</td>
//                     <td className="p-4">{test.source === 'external' ? <ExternalBadge /> : <LocalBadge />}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );

//     // 3. Radiology Tab
//     const radiology = (
//       <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Scan size={18} />} title="تقارير الأشعة" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {selectedPatient.radiology?.map((r, i) => {
//              const isLocked = !isRecordVisible(r);
//              if (isLocked) {
//                  return (
//                      <Card key={i} className="border-dashed bg-gray-50 flex items-center justify-center h-40">
//                          <div className="text-center">
//                              <Lock className="mx-auto text-gray-300 mb-2" />
//                              <p className="text-gray-400 font-medium">{r.type}</p>
//                              <Badge variant="outline" className="mt-2 text-xs">خارجي (مغلق)</Badge>
//                          </div>
//                      </Card>
//                  )
//              }
//              return (
//                 <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
//                     <CardHeader className="pb-3">
//                         <div className="flex justify-between items-center">
//                         <CardTitle className="text-lg">{r.type}</CardTitle>
//                         <div className="flex gap-2">
//                              {r.source === 'external' ? <ExternalBadge /> : <LocalBadge />}
//                              <Badge variant="secondary">{r.date}</Badge>
//                         </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-sm text-gray-600 mb-4">{r.description}</p>
//                         {r.department && <Badge variant="outline">{r.department}</Badge>}
//                     </CardContent>
//                 </Card>
//              );
//           })}
//         </div>
//         {!isGlobalUnlocked && selectedPatient.radiology?.some(r => r.source === 'external') && (
//             <div className="text-center mt-4">
//                 <Button variant="ghost" onClick={() => setShowOtpModal(true)} className="text-blue-600">
//                     عرض باقي التقارير المخفية...
//                 </Button>
//             </div>
//         )}
//       </div>
//     );

//     // 4. Dental Tab (Example of fully external)
//     const dental = (
//         <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//             {selectedPatient.dental?.source === 'external' && !isGlobalUnlocked ? (
//                 <LockedContentOverlay onUnlockRequest={() => setShowOtpModal(true)} title="سجل الأسنان الكامل" />
//             ) : selectedPatient.dental ? (
//                 <>
//                 <SectionHeader icon={<Smile size={18} />} title="سجل الأسنان (Odontogram)" />
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-4">
//                     {/* Dummy Visual Representation */}
//                     <div className="flex justify-center gap-2 mb-4">
//                         {Array.from({length: 16}).map((_, i) => (
//                             <div key={i} className="w-6 h-8 bg-white border border-gray-300 rounded-sm" />
//                         ))}
//                     </div>
//                     <div className="text-center text-gray-400 text-sm">تم فتح السجل للعرض</div>
//                 </div>
//                 <Card>
//                     <CardContent className="pt-6">
//                         <p className="font-bold">ملاحظات الطبيب:</p>
//                         <p className="text-gray-600">{selectedPatient.dental.notes}</p>
//                     </CardContent>
//                 </Card>
//                 </>
//             ) : <div className="text-center text-gray-500 py-10">لا توجد سجلات أسنان</div>}
//         </div>
//     );

//     // 5. Cardio Tab
//     const cardio = (
//         <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//              {selectedPatient.cardio?.source === 'external' && !isGlobalUnlocked ? (
//                 <LockedContentOverlay onUnlockRequest={() => setShowOtpModal(true)} title="سجل القلب" />
//             ) : selectedPatient.cardio ? (
//                  <DepartmentSection title="القلب والأوعية الدموية" icon={<HeartPulse size={20} />}>
//                     <Card>
//                         <CardHeader><CardTitle>بيانات الفحص</CardTitle></CardHeader>
//                         <CardContent className="space-y-2">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <Label className="text-gray-500">EKG</Label>
//                                     <p>{selectedPatient.cardio.ekg}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-gray-500">Diagnosis</Label>
//                                     <p>{selectedPatient.cardio.diagnosis?.join(", ")}</p>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                  </DepartmentSection>
//             ) : <div className="text-center py-10">لا توجد بيانات</div>}
//         </div>
//     );

//     return { overview, labs, radiology, dental, cardio };
//   }, [selectedPatient, activeTab, isGlobalUnlocked]);

//   // Department Section Helper
//   const DepartmentSection = ({ title, icon, children }: any) => (
//     <div className="mb-8">
//       <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
//         <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
//         <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//       </div>
//       {children}
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-6 space-y-6 font-sans bg-gray-50/50 min-h-screen" dir="rtl">
      
//       {/* 1. Header & Search (Same as before) */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
//             نظام السجلات الطبية
//             <span className="block text-sm font-normal text-blue-600 mt-1">
//               الخصوصية أولاً • الوصول الآمن (OTP)
//             </span>
//           </h1>
//         </div>
//         <div className="relative w-full md:w-96 group">
//             <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
//             <Input
//               type="search"
//               placeholder="بحث عن مريض..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pr-10 bg-white"
//             />
//         </div>
//       </div>

//       {/* 2. Patient Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <Table>
//             <TableHeader className="bg-gray-50">
//               <TableRow>
//                 <TableHead className="text-right">المريض</TableHead>
//                 <TableHead className="text-right">العمر/الجنس</TableHead>
//                 <TableHead className="text-right">الهاتف</TableHead>
//                 <TableHead className="text-right">الإجراء</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredPatients.map((p) => (
//                   <TableRow key={p.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openModalWithPatient(p)}>
//                     <TableCell className="font-medium">{p.name}</TableCell>
//                     <TableCell>{calculateAge(p.dateOfBirth)} / {p.gender}</TableCell>
//                     <TableCell>{p.contactPhone}</TableCell>
//                     <TableCell>
//                         <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openModalWithPatient(p); }}>
//                             فتح الملف
//                         </Button>
//                     </TableCell>
//                   </TableRow>
//               ))}
//             </TableBody>
//         </Table>
//       </div>

//       {/* 3. Patient Modal */}
//       {open && selectedPatient && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4" onClick={() => setOpen(false)}>
//           <div
//             className={`bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${maximized ? "w-screen h-screen rounded-none" : "w-full max-w-6xl max-h-[90vh]"}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
//                <div className="flex items-center gap-3">
//                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
//                        {selectedPatient.name.charAt(0)}
//                    </div>
//                    <div>
//                        <h2 className="text-lg font-bold">{selectedPatient.name}</h2>
//                        <p className="text-xs text-gray-500">ID: {selectedPatient.id}</p>
//                    </div>
//                </div>
//                <div className="flex gap-2">
//                    <Button variant="ghost" size="icon" onClick={() => setMaximized(!maximized)}>
//                        {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//                    </Button>
//                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-red-500">
//                        <X size={18} />
//                    </Button>
//                </div>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-6" dir="rtl">
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                     {/* Sidebar: Vitals & Info */}
//                     <div className="lg:col-span-3 space-y-4">
//                         <Card>
//                             <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">العلامات الحيوية</CardTitle></CardHeader>
//                             <CardContent className="space-y-3">
//                                 <div className="flex justify-between">
//                                     <span>الضغط</span>
//                                     <span className="font-bold">{selectedPatient.vitalSigns?.bloodPressure}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>النبض</span>
//                                     <span className="font-bold">{selectedPatient.vitalSigns?.heartRate}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>السكر</span>
//                                     <span className="font-bold">{selectedPatient.vitalSigns?.glucose}</span>
//                                 </div>
//                             </CardContent>
//                         </Card>
                        
//                         {!isGlobalUnlocked && (
//                             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
//                                 <ShieldAlert className="mx-auto text-amber-500 mb-2" size={24} />
//                                 <h4 className="font-bold text-amber-800 text-sm mb-1">الوضع المقيد</h4>
//                                 <p className="text-xs text-amber-600 mb-3">أنت تشاهد فقط السجلات التي تم إنشاؤها في هذه العيادة.</p>
//                                 <Button size="sm" onClick={() => setShowOtpModal(true)} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
//                                     طلب الوصول الكامل
//                                 </Button>
//                             </div>
//                         )}
//                     </div>

//                     {/* Main Content: Tabs */}
//                     <div className="lg:col-span-9">
//                         <Tabs value={activeTab} onValueChange={setActiveTab}>
//                             <TabsList className="w-full justify-start bg-white p-1 mb-4 border border-gray-200 rounded-lg overflow-x-auto">
//                                 <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
//                                 <TabsTrigger value="labs">التحاليل</TabsTrigger>
//                                 <TabsTrigger value="radiology">الأشعة</TabsTrigger>
//                                 <TabsTrigger value="cardio">القلب</TabsTrigger>
//                                 <TabsTrigger value="dental">الأسنان</TabsTrigger>
//                             </TabsList>
                            
//                             {/* Render Active Tab */}
//                             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 min-h-[400px]">
//                                 {(renderTabContent as any)[activeTab]}
//                             </div>
//                         </Tabs>
//                     </div>
//                 </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 4. OTP Modal */}
//       <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
//         <DialogContent className="sm:max-w-md" dir="rtl">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//                 <Shield className="text-blue-600" />
//                 التحقق من الوصول (OTP)
//             </DialogTitle>
//             <DialogDescription>
//               للوصول إلى السجل الطبي الموحد (السجلات الخارجية)، يرجى إدخال الرمز المرسل لهاتف المريض.
//               <br />
//               <span className="text-xs text-gray-400 mt-2 block">ملحوظة للتجربة: أدخل أي 4 أرقام (مثال: 1234)</span>
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4 flex justify-center">
//              <div className="w-full max-w-xs space-y-4">
//                  <Label className="text-center block">رمز التحقق</Label>
//                  <Input 
//                     type="text" 
//                     placeholder="X X X X" 
//                     className={`text-center text-2xl tracking-[0.5em] font-mono h-14 ${otpError ? 'border-red-500' : ''}`}
//                     maxLength={4}
//                     value={otpInput}
//                     onChange={(e) => {
//                         setOtpInput(e.target.value);
//                         setOtpError(false);
//                     }}
//                  />
//                  {otpError && <p className="text-red-500 text-xs text-center">الرمز غير صحيح</p>}
//              </div>
//           </div>
//           <DialogFooter className="sm:justify-start gap-2">
//             <Button type="button" onClick={handleUnlockGlobal} className="w-full bg-blue-600 hover:bg-blue-700">
//                 تأكيد الرمز
//             </Button>
//             <Button type="button" variant="outline" onClick={() => setShowOtpModal(false)} className="w-full">
//                 إلغاء
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


























// "use client";

// import React, { useCallback, useMemo, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   X,
//   Maximize2,
//   Minimize2,
//   Download,
//   Printer,
//   Search,
//   Activity,
//   Heart,
//   Thermometer,
//   Droplet,
//   User,
//   Calendar,
//   Phone,
//   MapPin,
//   Mail,
//   AlertCircle,
//   FileText,
//   Pill,
//   FileImage,
//   Stethoscope,
//   Users,
//   Eye,
//   Bone,
//   Brain,
//   Syringe,
//   Scan,
//   Smile,
//   Briefcase,
//   Cigarette,
//   Baby,
//   Info,
//   ClipboardList,
//   AlertTriangle,
//   ChevronDown,
//   ChevronUp,
//   Filter,
//   Menu,
//   BarChart3,
//   Clock,
//   Star,
//   Shield,
//   Zap,
//   ThermometerSun,
//   Weight,
//   Ruler,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useLocale } from "next-intl";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// // ----------------------------
// // Types
// // ----------------------------

// type Gender = "Male" | "Female" | "Other";

// type VisitNote = {
//   date: string;
//   doctorName: string;
//   notes: string;
//   department: string;
//   type: string;
// };

// type LabTest = {
//   testName: string;
//   result: string;
//   unit?: string;
//   range?: string;
//   date?: string;
//   category?: string;
//   status?: string;
// };

// type RadiologyReport = {
//   id?: string;
//   type: string;
//   description: string;
//   date?: string;
//   images?: string[];
//   doctor?: string;
// };

// type DentalRecord = {
//   lastCheckup?: string;
//   treatments?: string[];
//   orthodontics?: string | null;
//   notes?: string;
//   doctor?: string;
//   gingivalHealth?: string;
//   teeth?: Record<number, any>;
// };

// type CardioRecord = {
//   ekg?: string;
//   echocardiogram?: string;
//   medications?: string[];
//   notes?: string;
//   doctor?: string;
//   diagnosis?: string[];
// };

// type OphthalmologyRecord = {
//   lastVisit?: string;
//   doctor?: string;
//   visualAcuity?: { od: string; os: string };
//   iop?: { od: string; os: string };
//   diagnosis?: string;
//   prescription?: string;
// };

// type DermatologyRecord = {
//   lastVisit?: string;
//   doctor?: string;
//   skinType?: string;
//   conditions?: Array<{ site: string; type: string; status: string }>;
// };

// type OrthopedicsRecord = {
//   lastVisit?: string;
//   doctor?: string;
//   complaint?: string;
//   mriResult?: string;
//   plan?: string;
// };

// type NeurologyRecord = {
//   diagnosis?: string[];
//   symptoms?: string;
//   reflexes?: string;
//   doctor?: string;
// };

// type OBGYNRecord = {
//   para?: string;
//   gravida?: string;
//   lmp?: string;
//   cycle?: string;
//   lastVisit?: string;
// };

// type SocialHistory = {
//   smoking?: string;
//   alcohol?: string;
//   living?: string;
//   exercise?: string;
//   diet?: string;
// };

// type Insurance = {
//   provider: string;
//   policy: string;
//   coverage: string;
// };

// type Patient = {
//   id: string;
//   name: string;
//   dateOfBirth: string;
//   gender: Gender;
//   contactPhone?: string;
//   contactEmail?: string;
//   address?: string;
//   avatar?: string;
//   bloodType?: string;
//   maritalStatus?: string;
//   occupation?: string;
//   insurance?: Insurance;
//   status?: {
//     code: string;
//     location: string;
//     admissionDate?: string;
//   };
  
//   // Clinical Decision Support (Alerts)
//   alerts?: Array<{ type: "critical" | "warning" | "info"; msg: string }>;
  
//   // Vitals Trend
//   vitalSigns?: {
//     heartRate?: string;
//     bloodPressure?: string;
//     temperature?: string;
//     glucose?: string;
//     spo2?: string;
//     weight?: string;
//     height?: string;
//     bmi?: string;
//     respiratoryRate?: string;
//   };
  
//   // Detailed History
//   personalInfo?: {
//     allergies?: string[];
//     chronicConditions?: string[];
//     familyHistory?: string[];
//     surgeries?: Array<{ procedure: string; year: string; hospital: string }>;
//     vaccinations?: string[];
//     lifestyle?: SocialHistory;
//   };
  
//   generalMedicine?: {
//     diagnoses?: { description: string; code?: string }[];
//     medications?: Array<{ name: string; dose: string; freq: string; indication: string }>;
//     symptoms?: string[];
//   };
  
//   labTests?: LabTest[];
//   radiology?: RadiologyReport[];
//   dental?: DentalRecord | null;
//   cardio?: CardioRecord | null;
//   ophthalmology?: OphthalmologyRecord | null;
//   dermatology?: DermatologyRecord | null;
//   orthopedics?: OrthopedicsRecord | null;
//   neurology?: NeurologyRecord | null;
//   obgyn?: OBGYNRecord | null;
//   visitNotes?: VisitNote[];
  
//   // Epic-style data
//   specialties?: Record<string, any>;
// };

// // ----------------------------
// // Dummy Data (Comprehensive)
// // ----------------------------

// const dummyPatients: Patient[] = [
//   {
//     id: "PAT-2025-001",
//     name: "الحاج/ أحمد عبد الموجود السيد",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     dateOfBirth: "1958-04-12",
//     gender: "Male",
//     bloodType: "A+",
//     contactPhone: "+20 123 456 7890",
//     contactEmail: "ahmed.abdelmawgod@example.com",
//     address: "12 شارع البحر، طنطا، الغربية",
//     maritalStatus: "متزوج",
//     occupation: "مهندس متقاعد",
//     insurance: {
//       provider: "التأمين الصحي الحكومي",
//       policy: "EG-99821",
//       coverage: "كامل"
//     },
//     status: {
//       code: "Stable",
//       location: "العيادات الخارجية",
//       admissionDate: "2024-12-01"
//     },
//     alerts: [
//       { type: "critical", msg: "حساسية مفرطة من البنسلين (Anaphylaxis Risk)" },
//       { type: "warning", msg: "سكر الدم غير منتظم" },
//       { type: "info", msg: "يحتاج متابعة أسبوعية" }
//     ],
//     vitalSigns: {
//       heartRate: "88",
//       bloodPressure: "145/90",
//       temperature: "37.1",
//       glucose: "185",
//       spo2: "96",
//       weight: "92",
//       height: "175",
//       bmi: "30.0",
//       respiratoryRate: "18"
//     },
//     personalInfo: {
//       allergies: ["البنسلين (Penicillin)", "الفراولة", "صبغة الأشعة"],
//       chronicConditions: [
//         "مرض السكري من النوع الثاني - منذ 15 سنة",
//         "ارتفاع ضغط الدم - منذ 10 سنوات",
//         "قصور الشريان التاجي",
//         "خشونة الركبة"
//       ],
//       familyHistory: [
//         "الأب: توفي بأزمة قلبية في عمر 60",
//         "الأم: كانت تعاني من السكري والفشل الكلوي"
//       ],
//       surgeries: [
//         { procedure: "قسطرة قلبية وتركيب دعامة", year: "2018", hospital: "مركز القلب بالمحلة" },
//         { procedure: "استئصال الزائدة الدودية", year: "1995", hospital: "مستشفى الجامعة" }
//       ],
//       vaccinations: ["لقاح الإنفلونزا الموسمية (2024)", "لقاح كورونا (3 جرعات)"],
//       lifestyle: {
//         smoking: "مدخن سابق (أقلع منذ 2018)",
//         alcohol: "لا يتعاطى",
//         living: "يعيش مع الزوجة والأولاد",
//         exercise: "نشاط بدني محدود بسبب آلام الركبة",
//         diet: "نظام غذائي لمرضى السكري"
//       }
//     },
//     generalMedicine: {
//       diagnoses: [
//         { description: "ارتفاع ضغط الدم", code: "I10" },
//         { description: "سكري من النوع الثاني", code: "E11" },
//         { description: "قصور الشريان التاجي", code: "I25.1" }
//       ],
//       medications: [
//         { name: "Metformin XR", dose: "1000mg", freq: "مرتين يومياً", indication: "السكري" },
//         { name: "Aspirin Protect", dose: "100mg", freq: "مرة يومياً", indication: "سيولة الدم" },
//         { name: "Atorvastatin", dose: "40mg", freq: "مساءً", indication: "الكوليسترول" }
//       ],
//       symptoms: ["تنميل في القدمين", "دوخة عند الوقوف", "آلام في الصدر أحياناً"]
//     },
//     labTests: [
//       { testName: "HbA1c", result: "8.2", unit: "%", range: "< 5.7", date: "2024-11-28", category: "Chemistry", status: "high" },
//       { testName: "Fasting Glucose", result: "160", unit: "mg/dL", range: "70-100", date: "2024-11-28", category: "Chemistry", status: "high" },
//       { testName: "Total Cholesterol", result: "240", unit: "mg/dL", range: "< 200", date: "2024-11-28", category: "Lipids", status: "high" },
//       { testName: "Hemoglobin", result: "13.5", unit: "g/dL", range: "13-17", date: "2024-11-28", category: "Hematology", status: "normal" }
//     ],
//     radiology: [
//       { id: "R001", type: "Chest X-Ray", description: "No acute cardiopulmonary disease.", date: "2025-09-20", doctor: "د. أحمد سعيد" },
//       { id: "R002", type: "Knee MRI", description: "Medial meniscus tear with osteophytes.", date: "2025-08-12", doctor: "د. علي العظام" }
//     ],
//     dental: {
//       lastCheckup: "2025-10-15",
//       treatments: ["Filling #12", "Scaling"],
//       orthodontics: "Braces removed 2023",
//       notes: "المريض فقد ضرسين خلفيين واستبدلوا بجسر.",
//       doctor: "د. تامر الأسنان",
//       gingivalHealth: "Mild Gingivitis",
//       teeth: {
//         18: { status: "missing", note: "Extracted" },
//         19: { status: "filling", type: "Amalgam", surfaces: "MOD" },
//         30: { status: "caries", note: "Deep decay, needs RCT" }
//       }
//     },
//     cardio: {
//       ekg: "Sinus Rhythm with LVH criteria",
//       echocardiogram: "EF: 55%, Mild MR, Grade 1 Diastolic Dysfunction",
//       medications: ["Bisoprolol 5mg", "Aspirin 100mg"],
//       notes: "Mild LV hypertrophy, stable condition",
//       doctor: "د. إبراهيم القلب",
//       diagnosis: ["Ischemic Heart Disease", "Left Ventricular Hypertrophy"]
//     },
//     ophthalmology: {
//       lastVisit: "2024-11-02",
//       doctor: "د. سلمى الرمد",
//       visualAcuity: { od: "6/6", os: "6/9" },
//       iop: { od: "14 mmHg", os: "15 mmHg" },
//       diagnosis: "Myopia (قصر نظر بسيط) في العين اليسرى",
//       prescription: "نظارة للقراءة فقط"
//     },
//     dermatology: {
//       lastVisit: "2025-01-15",
//       doctor: "د. كريم الجلدية",
//       skinType: "Type III (Fitzpatrick)",
//       conditions: [
//         { site: "Face", type: "Acne Vulgaris", status: "Improved" },
//         { site: "Left Arm", type: "Eczema", status: "Active flare-up" }
//       ]
//     },
//     orthopedics: {
//       lastVisit: "2023-05-20",
//       doctor: "د. عظام",
//       complaint: "Lower Back Pain",
//       mriResult: "L4-L5 Mild Disc Bulge",
//       plan: "Physical Therapy and NSAIDs"
//     },
//     neurology: {
//       diagnosis: ["Diabetic Neuropathy (Peripheral)"],
//       symptoms: "تنميل وحرقة في القدمين (Glove and Stocking sensation)",
//       reflexes: "Ankle jerk reflex: Absent bilateral",
//       doctor: "د. محمود الأعصاب"
//     },
//     obgyn: null, // Not applicable for male patient
//     visitNotes: [
//       { date: "2025-11-01", doctorName: "د. أحمد سعيد", notes: "متابعة ضغط وسكر، نصح بتعديل النظام الغذائي.", department: "الباطنة", type: "متابعة" },
//       { date: "2025-09-20", doctorName: "د. سارة", notes: "أشعة صدر عادية، متابعة", department: "الأشعة", type: "تشخيص" },
//       { date: "2025-08-15", doctorName: "د. إبراهيم", notes: "تخطيط قلب طبيعي، متابعة الأدوية", department: "القلب", type: "متابعة" }
//     ]
//   },
//   {
//     id: "PAT-2025-002",
//     name: "مها أحمد محمد علي",
//     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&h=128&q=80",
//     dateOfBirth: "1985-05-15",
//     gender: "Female",
//     bloodType: "O+",
//     contactPhone: "01000000000",
//     contactEmail: "maha.arch@example.com",
//     address: "6 أكتوبر، الجيزة",
//     maritalStatus: "متزوجة",
//     occupation: "مهندسة معمارية",
//     insurance: {
//       provider: "Bupa Global",
//       policy: "EG-99821",
//       coverage: "Platinum"
//     },
//     status: {
//       code: "Stable",
//       location: "العيادات الخارجية"
//     },
//     alerts: [
//       { type: "warning", msg: "لم يتم إجراء فحص الماموجرام السنوي" },
//       { type: "info", msg: "المريضة تفضل التواصل عبر الواتساب" }
//     ],
//     vitalSigns: {
//       heartRate: "72",
//       bloodPressure: "120/80",
//       temperature: "36.8",
//       glucose: "95",
//       spo2: "98",
//       weight: "68",
//       height: "165",
//       bmi: "24.5",
//       respiratoryRate: "16"
//     },
//     personalInfo: {
//       allergies: ["عشب اللقاح"],
//       chronicConditions: ["Hypothyroidism (قصور الغدة الدرقية)", "Migraine (صداع نصفي مزمن)"],
//       familyHistory: [
//         "الأم: سرطان الثدي في عمر 55",
//         "الأب: ارتفاع ضغط الدم في عمر 60"
//       ],
//       surgeries: [
//         { procedure: "Caesarean Section", year: "2015", hospital: "مستشفى النساء والولادة" },
//         { procedure: "Tonsillectomy", year: "1995", hospital: "مستشفى الأطفال" }
//       ],
//       vaccinations: ["لقاح الإنفلونزا (2024)", "لقاح HPV"],
//       lifestyle: {
//         smoking: "Non-smoker",
//         alcohol: "Socially (Rare)",
//         living: "تعيش مع الزوج وطفلين",
//         exercise: "Gym 2x/week",
//         diet: "نظام غذائي متوازن"
//       }
//     },
//     generalMedicine: {
//       diagnoses: [
//         { description: "قصور الغدة الدرقية", code: "E03" },
//         { description: "صداع نصفي مزمن", code: "G43" }
//       ],
//       medications: [
//         { name: "Eltroxin", dose: "50mcg", freq: "يومياً", indication: "الغدة الدرقية" },
//         { name: "Panadol Extra", dose: "500mg", freq: "حسب الحاجة", indication: "الصداع" }
//       ],
//       symptoms: ["إرهاق مستمر", "زيادة في الوزن", "نوبات صداع متكررة"]
//     },
//     obgyn: {
//       para: "2",
//       gravida: "2",
//       lmp: "2025-09-20",
//       cycle: "Regular",
//       lastVisit: "2024-12-01"
//     },
//     visitNotes: [
//       { date: "2024-12-01", doctorName: "د. سمية", notes: "فحص دوري، كل المؤشرات طبيعية", department: "النساء", type: "فحص دوري" },
//       { date: "2024-11-15", doctorName: "د. أحمد", notes: "شكوى من صداع متكرر، تم وصف مسكنات", department: "الباطنة", type: "تشخيص" }
//     ]
//   }
// ];

// // ----------------------------
// // Helper Functions
// // ----------------------------

// function calculateAge(dateOfBirth: string): number {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// const parseVal = (str?: string) => {
//   if (!str) return 0;
//   const matches = str.match(/\d+(\.\d+)?/);
//   return matches ? parseFloat(matches[0]) : 0;
// };

// const getStatusColor = (val: number, min: number, max: number) => {
//   if (val < min || val > max) return "text-red-600 bg-red-50 border-red-100";
//   return "text-emerald-600 bg-emerald-50 border-emerald-100";
// };

// const getAlertColor = (type: string) => {
//   switch (type) {
//     case 'critical': return 'bg-red-100 text-red-800 border-red-200';
//     case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
//     case 'info': return 'bg-blue-50 text-blue-700 border-blue-100';
//     default: return 'bg-gray-100 text-gray-800 border-gray-200';
//   }
// };

// // ----------------------------
// // Subcomponents
// // ----------------------------

// const VitalCard = React.memo(function VitalCard({
//   title,
//   value,
//   unit,
//   icon,
//   min = 0,
//   max = 1000,
//   customCheck,
// }: {
//   title: string;
//   value?: string;
//   unit?: string;
//   icon: React.ReactNode;
//   min?: number;
//   max?: number;
//   customCheck?: (val: string) => string;
// }) {
//   if (!value) return null;
//   const numVal = parseVal(value);
//   let statusClass = "text-gray-600 bg-gray-50 border-gray-100";

//   if (customCheck) {
//     const status = customCheck(value);
//     statusClass = status === "high" ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100";
//   } else {
//     statusClass = getStatusColor(numVal, min, max);
//   }

//   const textColor = statusClass.split(" ")[0];
//   const bg = statusClass.split(" ")[1];
//   const border = statusClass.split(" ")[2];

//   return (
//     <div className={`p-4 rounded-xl border ${border} ${bg} flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02]`}>
//       <div>
//         <p className="text-xs text-gray-500 mb-1 font-medium">{title}</p>
//         <div className="flex items-end gap-1">
//           <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
//           <span className="text-xs text-gray-400 mb-1">{unit}</span>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full bg-white bg-opacity-60 shadow-sm`}>{icon}</div>
//     </div>
//   );
// });

// const SectionHeader = ({ icon, title }: { icon?: React.ReactNode; title: string }) => (
//   <div className="flex items-center gap-2 mb-4">
//     <div className="p-2 rounded-md bg-gray-100">{icon}</div>
//     <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//   </div>
// );

// const NavButton = ({ active, onClick, icon, label }: any) => (
//   <button 
//     onClick={onClick} 
//     className={`flex items-center gap-3 p-3 text-sm font-medium transition-all rounded-lg mb-1
//       ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}
//     `}
//   >
//     {icon}
//     {label}
//   </button>
// );

// const Tooth = ({ number, data }: { number: number, data: any }) => {
//   let color = "bg-white border-gray-300";
//   if (data?.status === "missing") color = "bg-gray-200 border-gray-400 opacity-50";
//   if (data?.status === "filling") color = "bg-blue-100 border-blue-400";
//   if (data?.status === "caries") color = "bg-red-100 border-red-400";
//   if (data?.status === "crown") color = "bg-yellow-100 border-yellow-400";

//   return (
//     <div className="flex flex-col items-center gap-1 group cursor-pointer">
//       <div className={`w-8 h-10 rounded-t-lg rounded-b-md border-2 ${color} shadow-sm flex items-center justify-center transition-all hover:scale-110 relative`}>
//         {data?.status === "caries" && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
//         {data?.status === "filling" && <div className="w-3 h-3 bg-blue-500/50 rounded-sm"></div>}
//       </div>
//       <span className="text-xs font-bold text-gray-500">{number}</span>
      
//       {data && (
//         <div className="absolute bottom-12 hidden group-hover:block bg-black/80 text-white text-xs p-2 rounded z-50 whitespace-nowrap">
//           {data.status} - {data.note || data.type}
//         </div>
//       )}
//     </div>
//   );
// };

// // تعريف EmptyTab كمكون منفصل
// const EmptyTab = ({ message, icon: Icon = FileText }: { message: string; icon?: React.ComponentType<any> }) => (
//   <div className="flex flex-col items-center justify-center h-64 text-center">
//     <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
//       <Icon size={32} />
//     </div>
//     <h3 className="text-lg font-medium text-gray-900">لا توجد بيانات</h3>
//     <p className="text-gray-500 max-w-sm mt-2">{message}</p>
//   </div>
// );

// // ----------------------------
// // Main Component
// // ----------------------------

// export default function ComprehensiveMedicalRecordSystem() {
//   const patients = useMemo(() => dummyPatients, []);
//   const locale = useLocale();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<string>("overview");
//   const [open, setOpen] = useState(false);
//   const [maximized, setMaximized] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const [loadingPdf, setLoadingPdf] = useState(false);
//   const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [departmentFilter, setDepartmentFilter] = useState<string>("all");

//   const filteredPatients = useMemo(() => {
//     let filtered = patients.filter((p) =>
//       [p.name, p.contactPhone, p.contactEmail, p.id, p.address]
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(p => p.status?.code === statusFilter);
//     }

//     // Apply department filter (based on last visit)
//     if (departmentFilter !== "all") {
//       filtered = filtered.filter(p => 
//         p.visitNotes?.some(v => v.department === departmentFilter)
//       );
//     }

//     // Apply sorting
//     if (sortConfig !== null) {
//       filtered.sort((a, b) => {
//         if (sortConfig.key === 'name') {
//           return sortConfig.direction === 'asc' 
//             ? a.name.localeCompare(b.name)
//             : b.name.localeCompare(a.name);
//         }
//         if (sortConfig.key === 'age') {
//           const ageA = calculateAge(a.dateOfBirth);
//           const ageB = calculateAge(b.dateOfBirth);
//           return sortConfig.direction === 'asc' ? ageA - ageB : ageB - ageA;
//         }
//         if (sortConfig.key === 'lastVisit') {
//           const dateA = a.visitNotes?.[0]?.date || "";
//           const dateB = b.visitNotes?.[0]?.date || "";
//           return sortConfig.direction === 'asc' 
//             ? dateA.localeCompare(dateB)
//             : dateB.localeCompare(dateA);
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [patients, searchTerm, sortConfig, statusFilter, departmentFilter]);

//   const requestSort = (key: string) => {
//     let direction: 'asc' | 'desc' = 'asc';
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const openModalWithPatient = useCallback((patient: Patient) => {
//     setSelectedPatient(patient);
//     setOpen(true);
//     setActiveTab("overview");
//   }, []);

//   // Print & Export Functions
//   const handlePrint = useCallback(() => {
//     if (!contentRef.current || !selectedPatient) return;
//     const html = contentRef.current.outerHTML;
//     const newWin = window.open("", "_blank", "width=900,height=700");
//     if (!newWin) return;
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>تقرير طبي - ${selectedPatient.name}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
//             body { font-family: 'Cairo', sans-serif; direction: rtl; background: white; }
//             @media print {
//               .no-print { display: none !important; }
//             }
//           </style>
//         </head>
//         <body class="p-8">
//           ${html}
//           <script>
//             setTimeout(() => { window.print(); window.close(); }, 600);
//           </script>
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//   }, [selectedPatient]);

//   const handleExportPDF = useCallback(async () => {
//     if (!contentRef.current || !selectedPatient) return;
//     setLoadingPdf(true);
//     try {
//       const element = contentRef.current;
//       // Temporarily tweak classes for a cleaner PDF
//       element.classList.remove("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.add("bg-white");

//       const canvas = await html2canvas(element, { 
//         scale: 2, 
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff'
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({ 
//         orientation: "portrait", 
//         unit: "mm", 
//         format: "a4",
//         compress: true
//       });

//       const imgWidth = 190;
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
//       let heightLeft = imgHeight;
//       let position = 0;
      
//       pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
      
//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
      
//       pdf.save(`Medical_Record_${selectedPatient.id}_${new Date().toISOString().split('T')[0]}.pdf`);

//       // Restore classes
//       element.classList.add("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.remove("bg-white");
//     } catch (err) {
//       console.error("PDF Error", err);
//       alert("حدث خطأ أثناء إنشاء PDF");
//     } finally {
//       setLoadingPdf(false);
//     }
//   }, [selectedPatient]);

//   // Render Content for Active Tab
//   const renderTabContent = useMemo(() => {
//     if (!selectedPatient) return null;

//     const vitals = selectedPatient.vitalSigns;
//     const dentalTeeth = selectedPatient.dental?.teeth || {};

//     const overview = (
//       <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
//         <section>
//           <SectionHeader icon={<FileText size={18} />} title="التشخيصات النشطة" />
//           <div className="grid gap-3">
//             {selectedPatient.generalMedicine?.diagnoses?.map((diag, i) => (
//               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
//                 <div>
//                   <p className="font-semibold text-gray-900">{diag.description}</p>
//                   <p className="text-xs text-gray-500 mt-1">كود: {diag.code || "-"}</p>
//                 </div>
//                 <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section>
//           <SectionHeader icon={<Pill size={18} />} title="الأدوية الحالية" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {selectedPatient.generalMedicine?.medications?.map((med, i) => (
//               <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/30 transition-colors">
//                 <div className="bg-white p-2 rounded-lg shadow-sm text-purple-600">
//                   <Pill size={16} />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start">
//                     <p className="font-medium text-gray-900">{med.name}</p>
//                     <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{med.dose}</span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">{med.freq} - {med.indication}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section>
//           <SectionHeader icon={<Calendar size={18} />} title="سجل الزيارات" />
//           <div className="relative border-r border-gray-200 mr-3 space-y-6 pr-6">
//             {selectedPatient.visitNotes?.map((visit, i) => (
//               <div key={i} className="relative">
//                 <div className="absolute -right-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
//                   <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{visit.date}</span>
//                   <div className="flex gap-2 items-center mt-1 sm:mt-0">
//                     <span className="text-xs text-gray-500">د. {visit.doctorName}</span>
//                     <Badge variant="outline" className="text-xs">{visit.department}</Badge>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600 leading-relaxed">
//                   {visit.notes}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     );

//     const labs = (
//       <div className="animate-in fade-in zoom-in-95 duration-300">
//         <h4 className="font-bold text-gray-800 text-lg mb-6">نتائج المختبر</h4>
//         <div className="overflow-x-auto rounded-xl border border-gray-200">
//           <table className="w-full text-right text-sm">
//             <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
//               <tr>
//                 <th className="p-4">الفئة</th>
//                 <th className="p-4">اسم الفحص</th>
//                 <th className="p-4">النتيجة</th>
//                 <th className="p-4">المعدل الطبيعي</th>
//                 <th className="p-4">الحالة</th>
//                 <th className="p-4">التاريخ</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {selectedPatient.labTests?.map((test, i) => {
//                 const isHigh = test.status === 'high';
//                 const isLow = test.status === 'low';
//                 return (
//                   <tr key={i} className="hover:bg-gray-50/80">
//                     <td className="p-4 text-gray-500 text-xs uppercase">{test.category}</td>
//                     <td className="p-4 font-medium text-gray-900">{test.testName}</td>
//                     <td className="p-4 font-mono">
//                       {test.result} <span className="text-gray-400">{test.unit}</span>
//                     </td>
//                     <td className="p-4 text-gray-500">{test.range || "-"}</td>
//                     <td className="p-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         isHigh ? 'bg-red-100 text-red-800 border border-red-200' :
//                         isLow ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
//                         'bg-green-100 text-green-800 border border-green-200'
//                       }`}>
//                         {isHigh ? 'مرتفع' : isLow ? 'منخفض' : 'طبيعي'}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-400 text-sm">{test.date || "-"}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );

//     const radiology = (
//       <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Scan size={18} />} title="تقارير الأشعة" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {selectedPatient.radiology?.map((r, i) => (
//             <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-lg">{r.type}</CardTitle>
//                   <Badge variant="secondary">{r.date}</Badge>
//                 </div>
//                 <p className="text-sm text-gray-500">د. {r.doctor}</p>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-600 mb-4">{r.description}</p>
//                 {r.images && r.images.length > 0 && (
//                   <div className="grid grid-cols-2 gap-2">
//                     {r.images.map((img, idx) => (
//                       <img key={idx} src={img} alt={`${r.type}-${idx}`} 
//                         className="h-24 w-full object-cover rounded-lg border border-gray-200" />
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );

//     const cardio = selectedPatient.cardio && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Heart size={18} />} title="معلومات القلب" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">تخطيط القلب الكهربائي (EKG)</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-700">{selectedPatient.cardio.ekg}</p>
//               {selectedPatient.cardio.diagnosis && (
//                 <div className="mt-4">
//                   <h4 className="text-sm font-medium text-gray-700 mb-2">التشخيص</h4>
//                   <ul className="list-disc list-inside text-sm text-gray-600">
//                     {selectedPatient.cardio.diagnosis.map((d, i) => (
//                       <li key={i}>{d}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">تصوير صدى القلب (Echo)</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-700">{selectedPatient.cardio.echocardiogram}</p>
//               {selectedPatient.cardio.notes && (
//                 <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
//                   <p className="text-sm text-blue-800">{selectedPatient.cardio.notes}</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
        
//         {selectedPatient.cardio.medications && selectedPatient.cardio.medications.length > 0 && (
//           <div className="mt-6">
//             <h4 className="font-medium text-gray-800 mb-3">أدوية القلب</h4>
//             <div className="flex flex-wrap gap-2">
//               {selectedPatient.cardio.medications.map((med, i) => (
//                 <span key={i} className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
//                   {med}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );

//     const dental = selectedPatient.dental && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Smile size={18} />} title="سجل الأسنان (Odontogram)" />
        
//         {/* Dental Chart */}
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-4">
//           {/* Upper Jaw (1-16) */}
//           <div className="flex justify-center gap-2 mb-8">
//             {Array.from({length: 16}, (_, i) => i + 1).map(num => (
//               <Tooth key={num} number={num} data={dentalTeeth[num]} />
//             ))}
//           </div>
          
//           <div className="text-center text-gray-400 font-medium mb-8">--- الفك العلوي / الفك السفلي ---</div>
          
//           {/* Lower Jaw (17-32) */}
//           <div className="flex justify-center gap-2">
//             {Array.from({length: 16}, (_, i) => 32 - i).map(num => (
//               <Tooth key={num} number={num} data={dentalTeeth[num]} />
//             ))}
//           </div>
//         </div>
        
//         {/* Legend */}
//         <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600 mb-6">
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-400"></div> سليم</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-400"></div> تسوس</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-400"></div> حشو</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-400"></div> طربوش</span>
//           <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 border border-gray-400 opacity-50"></div> مخلوع</span>
//         </div>
        
//         {/* Dental Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">معلومات الفحص</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-500">آخر فحص</p>
//                 <p className="font-medium">{selectedPatient.dental.lastCheckup}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">صحة اللثة</p>
//                 <Badge className="bg-blue-100 text-blue-800">{selectedPatient.dental.gingivalHealth}</Badge>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">العلاجات السابقة</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//                 {selectedPatient.dental.treatments?.map((t, i) => (
//                   <li key={i}>{t}</li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
        
//         {selectedPatient.dental.notes && (
//           <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
//             <p className="text-yellow-800"><strong>ملاحظات الطبيب:</strong> {selectedPatient.dental.notes}</p>
//           </div>
//         )}
//       </div>
//     );

//     const eyes = selectedPatient.ophthalmology && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Eye size={18} />} title="فحص العيون" />
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Right Eye */}
//           <Card className="border-t-4 border-t-blue-500">
//             <CardHeader>
//               <CardTitle className="text-center text-blue-700">العين اليمنى (OD)</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500">حدّة البصر</p>
//                 <p className="text-3xl font-bold text-gray-800">{selectedPatient.ophthalmology.visualAcuity?.od}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">ضغط العين (IOP)</p>
//                 <p className="text-xl font-bold text-gray-800">{selectedPatient.ophthalmology.iop?.od}</p>
//               </div>
//             </CardContent>
//           </Card>
          
//           {/* Left Eye */}
//           <Card className="border-t-4 border-t-green-500">
//             <CardHeader>
//               <CardTitle className="text-center text-green-700">العين اليسرى (OS)</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500">حدّة البصر</p>
//                 <p className="text-3xl font-bold text-gray-800">{selectedPatient.ophthalmology.visualAcuity?.os}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">ضغط العين (IOP)</p>
//                 <p className="text-xl font-bold text-gray-800">{selectedPatient.ophthalmology.iop?.os}</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
        
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">التشخيص والعلاج</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div>
//               <p className="text-sm text-gray-500">التشخيص</p>
//               <p className="text-gray-700">{selectedPatient.ophthalmology.diagnosis}</p>
//             </div>
//             {selectedPatient.ophthalmology.prescription && (
//               <div>
//                 <p className="text-sm text-gray-500">الوصفة الطبية</p>
//                 <p className="text-gray-700">{selectedPatient.ophthalmology.prescription}</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     );

//     const obgyn = selectedPatient.obgyn && (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Baby size={18} />} title="صحة المرأة (OB/GYN)" />
        
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Card className="bg-pink-50 border-pink-100">
//             <CardContent className="p-4 text-center">
//               <div className="text-sm text-pink-600 font-bold">عدد الحمل (Gravida)</div>
//               <div className="text-2xl font-bold text-pink-900">{selectedPatient.obgyn.gravida}</div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-pink-50 border-pink-100">
//             <CardContent className="p-4 text-center">
//               <div className="text-sm text-pink-600 font-bold">الولادة (Para)</div>
//               <div className="text-2xl font-bold text-pink-900">{selectedPatient.obgyn.para}</div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-pink-50 border-pink-100">
//             <CardContent className="p-4 text-center">
//               <div className="text-sm text-pink-600 font-bold">آخر دورة (LMP)</div>
//               <div className="text-lg font-bold text-pink-900">{selectedPatient.obgyn.lmp}</div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-pink-50 border-pink-100">
//             <CardContent className="p-4 text-center">
//               <div className="text-sm text-pink-600 font-bold">الدورة الشهرية</div>
//               <div className="text-lg font-bold text-pink-900">{selectedPatient.obgyn.cycle}</div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );

//     const allergies = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<AlertCircle size={18} />} title="الحساسية والأمراض المزمنة" />
        
//         <div className="space-y-4">
//           {selectedPatient.personalInfo?.allergies && selectedPatient.personalInfo.allergies.length > 0 && (
//             <div>
//               <h4 className="font-medium text-gray-800 mb-3">الحساسيات</h4>
//               <div className="flex flex-wrap gap-2">
//                 {selectedPatient.personalInfo.allergies.map((a, i) => (
//                   <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-medium">
//                     {a}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {selectedPatient.personalInfo?.chronicConditions && selectedPatient.personalInfo.chronicConditions.length > 0 && (
//             <div>
//               <h4 className="font-medium text-gray-800 mb-3">الأمراض المزمنة</h4>
//               <div className="flex flex-wrap gap-2">
//                 {selectedPatient.personalInfo.chronicConditions.map((c, i) => (
//                   <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-sm font-medium">
//                     {c}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {selectedPatient.personalInfo?.vaccinations && selectedPatient.personalInfo.vaccinations.length > 0 && (
//             <div>
//               <h4 className="font-medium text-gray-800 mb-3">التطعيمات</h4>
//               <div className="flex flex-wrap gap-2">
//                 {selectedPatient.personalInfo.vaccinations.map((v, i) => (
//                   <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm font-medium">
//                     {v}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );

//     const familyHistory = (
//       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
//         <SectionHeader icon={<Users size={18} />} title="التاريخ العائلي والاجتماعي" />
        
//         {selectedPatient.personalInfo?.familyHistory && selectedPatient.personalInfo.familyHistory.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">التاريخ المرضي العائلي</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2">
//                 {selectedPatient.personalInfo.familyHistory.map((f, i) => (
//                   <li key={i} className="flex items-start gap-2 text-gray-700">
//                     <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         )}
        
//         {selectedPatient.personalInfo?.lifestyle && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">نمط الحياة</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {selectedPatient.personalInfo.lifestyle.smoking && (
//                 <div className="flex items-center gap-2">
//                   <Cigarette size={16} className="text-gray-400" />
//                   <span className="text-gray-700">التدخين: {selectedPatient.personalInfo.lifestyle.smoking}</span>
//                 </div>
//               )}
//               {selectedPatient.personalInfo.lifestyle.exercise && (
//                 <div className="flex items-center gap-2">
//                   <Activity size={16} className="text-gray-400" />
//                   <span className="text-gray-700">التمارين: {selectedPatient.personalInfo.lifestyle.exercise}</span>
//                 </div>
//               )}
//               {selectedPatient.personalInfo.lifestyle.diet && (
//                 <div className="flex items-center gap-2">
//                   <Weight size={16} className="text-gray-400" />
//                   <span className="text-gray-700">النظام الغذائي: {selectedPatient.personalInfo.lifestyle.diet}</span>
//                 </div>
//               )}
//               {selectedPatient.personalInfo.lifestyle.living && (
//                 <div className="flex items-center gap-2">
//                   <Users size={16} className="text-gray-400" />
//                   <span className="text-gray-700">الظروف المعيشية: {selectedPatient.personalInfo.lifestyle.living}</span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     );

//     const mapTabToContent: Record<string, React.ReactNode> = {
//       overview,
//       labs,
//       radiology,
//       cardio: selectedPatient.cardio ? cardio : <EmptyTab message="لا توجد بيانات للقلب" icon={Heart} />,
//       dental: selectedPatient.dental ? dental : <EmptyTab message="لا توجد بيانات للأسنان" icon={Smile} />,
//       eyes: selectedPatient.ophthalmology ? eyes : <EmptyTab message="لا توجد بيانات للعيون" icon={Eye} />,
//       obgyn: selectedPatient.obgyn ? obgyn : <EmptyTab message="لا توجد بيانات للنساء والولادة" icon={Baby} />,
//       allergies,
//       familyHistory,
//     };

//     return mapTabToContent;
//   }, [selectedPatient]);

//   return (
//     <div className="p-4 md:p-6 space-y-6 font-sans bg-gray-50/50 min-h-screen" dir="rtl">
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">نظام السجلات الطبية الموحد</h1>
//           <p className="text-gray-500 text-sm mt-1">إدارة الملفات الطبية ومتابعة الحالات — النسخة الشاملة</p>
//         </div>
//         <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
//           <div className="relative w-full md:w-96 group">
//             <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
//             <Input
//               type="search"
//               placeholder="بحث سريع (اسم، هاتف، رقم ملف)..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pr-10 h-11 bg-white border-gray-200 focus:border-blue-500 rounded-xl shadow-sm transition-all"
//             />
//           </div>
//           <Button 
//             variant="outline" 
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2"
//           >
//             <Filter size={16} />
//             فلتر
//           </Button>
//         </div>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-in slide-in-from-top duration-200">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-medium text-gray-900">فلاتر البحث</h3>
//             <Button variant="ghost" size="sm" onClick={() => {
//               setStatusFilter("all");
//               setDepartmentFilter("all");
//             }}>
//               إعادة تعيين
//             </Button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block">الحالة</label>
//               <select 
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               >
//                 <option value="all">جميع الحالات</option>
//                 <option value="Stable">مستقر</option>
//                 <option value="Critical">حرج</option>
//                 <option value="Improving">في تحسن</option>
//               </select>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block">القسم</label>
//               <select 
//                 value={departmentFilter}
//                 onChange={(e) => setDepartmentFilter(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               >
//                 <option value="all">جميع الأقسام</option>
//                 <option value="الباطنة">الباطنة</option>
//                 <option value="القلب">القلب</option>
//                 <option value="الأشعة">الأشعة</option>
//                 <option value="النساء">النساء</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">إجمالي المرضى</p>
//               <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
//             </div>
//             <div className="p-2 bg-blue-50 rounded-lg">
//               <Users className="text-blue-600" size={20} />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">الزيارات اليوم</p>
//               <p className="text-2xl font-bold text-gray-900">12</p>
//             </div>
//             <div className="p-2 bg-green-50 rounded-lg">
//               <Calendar className="text-green-600" size={20} />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">حالات حرجة</p>
//               <p className="text-2xl font-bold text-gray-900">2</p>
//             </div>
//             <div className="p-2 bg-red-50 rounded-lg">
//               <AlertTriangle className="text-red-600" size={20} />
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">متوسط العمر</p>
//               <p className="text-2xl font-bold text-gray-900">48</p>
//             </div>
//             <div className="p-2 bg-purple-50 rounded-lg">
//               <User className="text-purple-600" size={20} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Table Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">قائمة المرضى</h3>
//           <div className="text-sm text-gray-500">
//             عرض {filteredPatients.length} من {patients.length} مريض
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader className="bg-gray-50/80">
//               <TableRow>
//                 <TableHead className="text-right font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('name')}>
//                   <div className="flex items-center gap-1">
//                     المريض
//                     {sortConfig?.key === 'name' && (
//                       sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('age')}>
//                   <div className="flex items-center gap-1">
//                     العمر / الجنس
//                     {sortConfig?.key === 'age' && (
//                       sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700">رقم الهاتف</TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('lastVisit')}>
//                   <div className="flex items-center gap-1">
//                     آخر زيارة
//                     {sortConfig?.key === 'lastVisit' && (
//                       sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                     )}
//                   </div>
//                 </TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700">الحالة</TableHead>
//                 <TableHead className="text-right font-semibold text-gray-700">الإجراءات</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredPatients.length > 0 ? (
//                 filteredPatients.map((p) => (
//                   <TableRow key={p.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => openModalWithPatient(p)}>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
//                           {p.name.charAt(0)}
//                                                </div>
//                         <div>
//                           <div className="font-semibold text-gray-900">{p.name}</div>
//                           <div className="text-xs text-gray-500">#{p.id}</div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <span className="font-medium">{calculateAge(p.dateOfBirth)} سنة</span>
//                         <span className="text-xs text-gray-500">{p.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-mono text-gray-600">{p.contactPhone}</TableCell>
//                     <TableCell>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                         {p.visitNotes?.[0]?.date || "جديد"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         p.status?.code === "Critical" ? "bg-red-100 text-red-800" :
//                         p.status?.code === "Stable" ? "bg-green-100 text-green-800" :
//                         "bg-yellow-100 text-yellow-800"
//                       }`}>
//                         {p.status?.code || "غير محدد"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openModalWithPatient(p);
//                         }}
//                         variant="outline"
//                         size="sm"
//                         className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         فتح الملف
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} className="h-32 text-center text-gray-500">
//                     لا توجد نتائج مطابقة للبحث
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Modal */}
//       {open && selectedPatient && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4" onClick={() => setOpen(false)}>
//           <div
//             className={`bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
//               maximized ? "w-screen h-screen rounded-none" : "w-full max-w-6xl max-h-[90vh]"
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//               <div className="flex items-center gap-3 md:gap-4">
//                 <div className="relative">
//                   <img
//                     src={selectedPatient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPatient.name)}&background=0D8ABC&color=fff`}
//                     alt="avatar"
//                     className="h-12 w-12 md:h-14 md:w-14 rounded-full border-4 border-white shadow-sm"
//                   />
//                   <span className="absolute bottom-0 right-0 h-3 w-3 md:h-4 md:w-4 bg-emerald-500 border-2 border-white rounded-full"></span>
//                 </div>
//                 <div>
//                   <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
//                     {selectedPatient.name}
//                     <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200 font-normal">
//                       {calculateAge(selectedPatient.dateOfBirth)} سنة
//                     </span>
//                   </h2>
//                   <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
//                     <span className="flex items-center gap-1"><User size={14} /> {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                     <span className="text-gray-300 hidden md:inline">|</span>
//                     <span className="font-mono text-gray-400">ID: {selectedPatient.id}</span>
//                     {selectedPatient.bloodType && (
//                       <>
//                         <span className="text-gray-300 hidden md:inline">|</span>
//                         <span className="flex items-center gap-1"><Droplet size={14} /> {selectedPatient.bloodType}</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-1 md:gap-2">
//                 <Button variant="ghost" size="icon" onClick={() => setMaximized(!maximized)} className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8">
//                   {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handlePrint} className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8">
//                   <Printer size={16} />
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handleExportPDF} className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8">
//                   {loadingPdf ? <span className="animate-spin text-xs">⌛</span> : <Download size={16} />}
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-red-500 hover:bg-red-50 rounded-full h-8 w-8">
//                   <X size={18} />
//                 </Button>
//               </div>
//             </div>

//             {/* Alerts Bar */}
//             {selectedPatient.alerts && selectedPatient.alerts.length > 0 && (
//               <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2">
//                 <div className="flex items-center gap-2 overflow-x-auto">
//                   {selectedPatient.alerts.map((alert, i) => (
//                     <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${getAlertColor(alert.type)}`}>
//                       <AlertTriangle size={14} />
//                       {alert.msg}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-6" dir="rtl">
//               <div ref={contentRef} className="max-w-6xl mx-auto space-y-6">
//                 {/* Vitals Grid */}
//                 {selectedPatient.vitalSigns && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//                     <VitalCard
//                       title="معدل النبض"
//                       value={selectedPatient.vitalSigns.heartRate}
//                       unit="bpm"
//                       icon={<Activity className="text-rose-500" />}
//                       min={60}
//                       max={100}
//                     />
//                     <VitalCard
//                       title="ضغط الدم"
//                       value={selectedPatient.vitalSigns.bloodPressure}
//                       unit="mmHg"
//                       icon={<Heart className="text-blue-500" />}
//                       customCheck={(val) => {
//                         const sys = parseInt(val.split("/")[0]);
//                         return sys > 130 ? "high" : "normal";
//                       }}
//                     />
//                     <VitalCard
//                       title="الحرارة"
//                       value={selectedPatient.vitalSigns.temperature}
//                       unit="°C"
//                       icon={<Thermometer className="text-orange-500" />}
//                       min={36}
//                       max={37.5}
//                     />
//                     <VitalCard
//                       title="سكر الدم"
//                       value={selectedPatient.vitalSigns.glucose}
//                       unit="mg/dL"
//                       icon={<Droplet className="text-purple-500" />}
//                       min={70}
//                       max={140}
//                     />
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
//                   {/* Left Sidebar */}
//                   <div className="lg:col-span-4 space-y-4 md:space-y-6">
//                     {/* Contact Info Card */}
//                     <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">
//                         بيانات الاتصال والمعلومات
//                       </h3>
//                       <div className="space-y-3 md:space-y-4 text-sm">
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                             <Phone size={16} />
//                           </div>
//                           <div>
//                             <p className="text-gray-500 text-xs">رقم الهاتف</p>
//                             <p className="font-medium font-mono dir-ltr text-right">{selectedPatient.contactPhone}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                             <Mail size={16} />
//                           </div>
//                           <div>
//                             <p className="text-gray-500 text-xs">البريد الإلكتروني</p>
//                             <p className="font-medium">{selectedPatient.contactEmail}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                             <MapPin size={16} />
//                           </div>
//                           <div>
//                             <p className="text-gray-500 text-xs">العنوان</p>
//                             <p className="font-medium">{selectedPatient.address}</p>
//                           </div>
//                         </div>
//                         {selectedPatient.occupation && (
//                           <div className="flex items-start gap-3">
//                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                               <Briefcase size={16} />
//                             </div>
//                             <div>
//                               <p className="text-gray-500 text-xs">المهنة</p>
//                               <p className="font-medium">{selectedPatient.occupation}</p>
//                             </div>
//                           </div>
//                         )}
//                         {selectedPatient.insurance && (
//                           <div className="flex items-start gap-3">
//                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
//                               <Shield size={16} />
//                             </div>
//                             <div>
//                               <p className="text-gray-500 text-xs">التأمين الصحي</p>
//                               <p className="font-medium">{selectedPatient.insurance.provider}</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Medical Alerts Card */}
//                     <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">
//                         تنبيهات طبية
//                       </h3>
//                       <div className="space-y-3 md:space-y-4">
//                         {selectedPatient.personalInfo?.allergies &&
//                           selectedPatient.personalInfo.allergies.length > 0 && (
//                             <div>
//                               <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
//                                 <AlertCircle size={12} /> الحساسية
//                               </p>
//                               <div className="flex flex-wrap gap-2">
//                                 {selectedPatient.personalInfo.allergies.map((alg, i) => (
//                                   <span
//                                     key={i}
//                                     className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium"
//                                   >
//                                     {alg}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                         {selectedPatient.personalInfo?.chronicConditions &&
//                           selectedPatient.personalInfo.chronicConditions.length > 0 && (
//                             <div>
//                               <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
//                                 <Activity size={12} /> الأمراض المزمنة
//                               </p>
//                               <div className="flex flex-wrap gap-2">
//                                 {selectedPatient.personalInfo.chronicConditions.map((cond, i) => (
//                                   <span
//                                     key={i}
//                                     className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium"
//                                   >
//                                     {cond}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                       </div>
//                     </div>

//                     {/* Additional Vitals */}
//                     {selectedPatient.vitalSigns && (
//                       <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
//                         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">
//                           مؤشرات إضافية
//                         </h3>
//                         <div className="grid grid-cols-2 gap-3">
//                           {selectedPatient.vitalSigns.spO2 && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">الأكسجين</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.spO2}%</p>
//                             </div>
//                           )}
//                           {selectedPatient.vitalSigns.weight && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">الوزن</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.weight}kg</p>
//                             </div>
//                           )}
//                           {selectedPatient.vitalSigns.height && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">الطول</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.height}cm</p>
//                             </div>
//                           )}
//                           {selectedPatient.vitalSigns.bmi && (
//                             <div className="text-center">
//                               <p className="text-xs text-gray-500">مؤشر كتلة الجسم</p>
//                               <p className="text-lg font-bold text-gray-900">{selectedPatient.vitalSigns.bmi}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Right Content Area */}
//                   <div className="lg:col-span-8">
//                     {/* Tabs Navigation */}
//                     <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-4 md:mb-6 flex overflow-x-auto gap-1">
//                       {[
//                         { id: "overview", label: "نظرة عامة", icon: <ClipboardList size={16} /> },
//                         { id: "labs", label: "التحاليل", icon: <Syringe size={16} /> },
//                         { id: "radiology", label: "الأشعة", icon: <Scan size={16} /> },
//                         { id: "cardio", label: "القلب", icon: <Heart size={16} /> },
//                         { id: "dental", label: "الأسنان", icon: <Smile size={16} /> },
//                         { id: "eyes", label: "العيون", icon: <Eye size={16} /> },
//                         { id: "obgyn", label: "النساء", icon: <Baby size={16} /> },
//                         { id: "allergies", label: "الحساسية", icon: <AlertCircle size={16} /> },
//                         { id: "familyHistory", label: "التاريخ العائلي", icon: <Users size={16} /> },
//                       ].map((tab) => {
//                         const isActive = activeTab === tab.id;
//                         const hasData = !(
//                           (tab.id === "cardio" && !selectedPatient.cardio) ||
//                           (tab.id === "dental" && !selectedPatient.dental) ||
//                           (tab.id === "eyes" && !selectedPatient.ophthalmology) ||
//                           (tab.id === "obgyn" && !selectedPatient.obgyn)
//                         );
                        
//                         return hasData ? (
//                           <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
//                               isActive
//                                 ? "bg-blue-600 text-white shadow-md"
//                                 : "text-gray-600 hover:bg-gray-100"
//                             }`}
//                           >
//                             {tab.icon}
//                             {tab.label}
//                           </button>
//                         ) : null;
//                       })}
//                     </div>

//                     {/* Tab Content */}
//                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] p-4 md:p-6">
//                       {selectedPatient && (renderTabContent || {})[activeTab]}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





















// "use client";

// import React, { useRef, useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   X, Maximize2, Minimize2, Download, Printer, Search,
//   Activity, Heart, Thermometer, Droplet, User,
//   Calendar, Phone, MapPin, Mail, AlertTriangle, FileText, Pill,
//   Stethoscope, Eye, Bone, Brain, Syringe, Scan, Smile, Briefcase,
//   Cigarette, Baby, Info, ClipboardList, AlertCircle
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// // --- TYPES & INTERFACES ---

// type ToothStatus = "healthy" | "caries" | "filling" | "crown" | "missing" | "rct";

// interface Patient {
//   id: string;
//   name: string;
//   avatar: string;
//   dob: string;
//   gender: "Male" | "Female";
//   bloodType: string;
//   contact: { phone: string; email: string; address: string };
//   insurance: { provider: string; policy: string };
//   occupation: string;
  
//   // Clinical Alerts (BPA)
//   alerts: { type: "critical" | "warning" | "info"; msg: string }[];

//   // Vitals
//   vitals: {
//     bp: string; hr: string; temp: string; rr: string; spo2: string;
//     bmi: string; weight: string; height: string; glucose: string;
//   };

//   // General History
//   history: {
//     medical: string[];
//     surgical: { proc: string; date: string; note?: string }[];
//     social: { smoking: string; exercise: string; marital: string };
//     family: string[];
//     allergies: string[];
//     obgyn?: { gravida: string; para: string; lmp: string; cycle: string };
//   };

//   // Medications
//   medications: { name: string; dose: string; freq: string; route: string; status: "Active" | "Stopped" }[];

//   // Specialty Modules
//   specialties: {
//     dentistry?: {
//       gingivalHealth: string;
//       notes: string;
//       teeth: Record<number, { status: ToothStatus; type?: string }>;
//     };
//     ophthalmology?: {
//       visualAcuity: { od: string; os: string };
//       iop: { od: string; os: string };
//       diagnosis: string;
//     };
//     cardiology?: {
//       echo: string;
//       ecg: string;
//       riskFactors: string[];
//     };
//   };

//   // Labs & Radiology
//   labs: { name: string; value: string; unit: string; flag: "High" | "Low" | "Normal"; date: string }[];
//   radiology: { type: string; date: string; report: string; images?: string[] }[];
  
//   // Visits
//   visits: { date: string; dept: string; doctor: string; note: string }[];
// }

// // --- DUMMY DATA (The "Super Patient") ---
// const dummyPatients: Patient[] = [
//   {
//     id: "MRN-2025-001",
//     name: "مها أحمد محمد علي",
//     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&h=128&q=80",
//     dob: "1985-05-15",
//     gender: "Female",
//     bloodType: "O+",
//     occupation: "مهندسة معمارية",
//     contact: { phone: "01099988877", email: "maha.arch@example.com", address: "6 أكتوبر، الجيزة" },
//     insurance: { provider: "Bupa Global", policy: "EG-99821" },

//     alerts: [
//       { type: "critical", msg: "حساسية مفرطة من البنسلين (Anaphylaxis)" },
//       { type: "warning", msg: "مريضة سكر - تحتاج فحص قاع عين" },
//     ],

//     vitals: {
//       bp: "130/85", hr: "78", temp: "36.8", rr: "16", spo2: "98%",
//       bmi: "28.5", weight: "75kg", height: "162cm", glucose: "145 mg/dL"
//     },

//     history: {
//       medical: ["Type 2 Diabetes", "Hypothyroidism", "Migraine"],
//       surgical: [
//         { proc: "C-Section", date: "2015", note: "Lower segment" },
//         { proc: "Tonsillectomy", date: "1995" }
//       ],
//       social: { smoking: "Non-smoker", exercise: "Gym 1x/week", marital: "Married" },
//       family: ["Mother: Breast Cancer", "Father: HTN"],
//       allergies: ["Penicillin", "Sulfa Drugs"],
//       obgyn: { gravida: "3", para: "2", lmp: "2025-10-01", cycle: "Regular" }
//     },

//     medications: [
//       { name: "Metformin XR", dose: "1000mg", freq: "Daily", route: "PO", status: "Active" },
//       { name: "Eltroxin", dose: "50mcg", freq: "Daily", route: "PO", status: "Active" }
//     ],

//     specialties: {
//       dentistry: {
//         gingivalHealth: "Mild Gingivitis",
//         notes: "Sensitivity in lower left quadrant.",
//         teeth: {
//           18: { status: "missing" },
//           19: { status: "filling", type: "Amalgam" },
//           30: { status: "caries", type: "Deep" },
//           14: { status: "crown", type: "Zirconia" }
//         }
//       },
//       ophthalmology: {
//         visualAcuity: { od: "6/6", os: "6/9" },
//         iop: { od: "14 mmHg", os: "15 mmHg" },
//         diagnosis: "Mild Myopia OS, Diabetic Background Retinopathy"
//       },
//       cardiology: {
//         echo: "EF 60%, Normal LV function",
//         ecg: "NSR, No acute changes",
//         riskFactors: ["Diabetes", "Obesity"]
//       }
//     },

//     labs: [
//       { name: "HbA1c", value: "7.2", unit: "%", flag: "High", date: "2025-11-01" },
//       { name: "TSH", value: "2.5", unit: "mIU/L", flag: "Normal", date: "2025-11-01" },
//       { name: "LDL", value: "110", unit: "mg/dL", flag: "High", date: "2025-11-01" }
//     ],

//     radiology: [
//       { type: "Chest X-Ray", date: "2024-05-10", report: "Clear fields, no cardiomegaly." },
//       { type: "Dental Panorama", date: "2025-08-10", report: "Impacted wisdom tooth #32." }
//     ],

//     visits: [
//       { date: "2025-11-01", dept: "Endocrinology", doctor: "Dr. Samy", note: "Increased Metformin dose." },
//       { date: "2025-08-10", dept: "Dental", doctor: "Dr. Tamer", note: "Routine cleaning and checkup." }
//     ]
//   },
//   // Add more patients...
// ];

// // --- HELPER FUNCTIONS ---

// function calculateAge(dob: string) {
//   return new Date().getFullYear() - new Date(dob).getFullYear();
// }

// // --- SUB-COMPONENTS ---

// const Tooth = ({ number, data }: { number: number, data?: { status: ToothStatus; type?: string } }) => {
//   let color = "bg-white border-gray-300"; // Healthy
//   if (data?.status === "missing") color = "bg-gray-200 border-gray-400 opacity-30";
//   if (data?.status === "filling") color = "bg-blue-100 border-blue-400";
//   if (data?.status === "caries") color = "bg-red-100 border-red-400";
//   if (data?.status === "crown") color = "bg-yellow-100 border-yellow-400";
//   if (data?.status === "rct") color = "bg-purple-100 border-purple-400";

//   return (
//     <div className="flex flex-col items-center gap-1 group cursor-pointer relative">
//       <div className={`w-8 h-10 rounded-t-lg rounded-b-md border-2 ${color} shadow-sm flex items-center justify-center transition-all hover:scale-110`}>
//         {data?.status === "caries" && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
//         <span className="text-[10px] text-gray-400 absolute bottom-0.5">{number}</span>
//       </div>
//       {data && (
//         <div className="absolute -bottom-8 hidden group-hover:block bg-black/90 text-white text-[10px] p-1.5 rounded z-50 whitespace-nowrap shadow-lg">
//           {data.status.toUpperCase()} {data.type ? `(${data.type})` : ""}
//         </div>
//       )}
//     </div>
//   );
// };

// const VitalsRibbon = ({ vitals }: { vitals: Patient['vitals'] }) => (
//   <div className="flex gap-4 overflow-x-auto py-3 px-4 bg-slate-50 border-b border-slate-200 scrollbar-hide">
//     <VitalItem label="ضغط الدم" value={vitals.bp} unit="mmHg" icon={<Activity className="text-blue-500"/>} />
//     <VitalItem label="النبض" value={vitals.hr} unit="bpm" icon={<Heart className="text-red-500"/>} />
//     <VitalItem label="الحرارة" value={vitals.temp} unit="°C" icon={<Thermometer className="text-orange-500"/>} />
//     <VitalItem label="الأكسجين" value={vitals.spo2} unit="%" icon={<Activity className="text-green-500"/>} />
//     <VitalItem label="السكر" value={vitals.glucose} unit="mg/dL" icon={<Droplet className="text-purple-500"/>} isAlert={parseInt(vitals.glucose) > 140} />
//     <VitalItem label="BMI" value={vitals.bmi} unit="" icon={<User className="text-gray-500"/>} isAlert={parseFloat(vitals.bmi) > 25} />
//   </div>
// );

// const VitalItem = ({ label, value, unit, icon, isAlert }: any) => (
//   <div className="flex flex-col items-center min-w-[80px] px-2 border-l last:border-l-0 border-gray-200">
//     <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 flex gap-1">{icon} {label}</span>
//     <span className={`font-bold text-lg ${isAlert ? 'text-red-600' : 'text-slate-700'}`}>{value} <span className="text-[10px] font-normal text-gray-400">{unit}</span></span>
//   </div>
// );

// const SidebarBtn = ({ active, onClick, icon, label }: any) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all mb-1
//       ${active ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}
//     `}
//   >
//     {icon}
//     {label}
//   </button>
// );

// // --- MAIN COMPONENT ---

// export default function UnifiedMedicalRecord() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [open, setOpen] = useState(false);
//   const [maximized, setMaximized] = useState(false);
//   const [activeTab, setActiveTab] = useState("summary");
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const [loadingPdf, setLoadingPdf] = useState(false);

//   const filteredPatients = dummyPatients.filter(p => 
//     p.name.includes(searchTerm) || p.contact.phone.includes(searchTerm)
//   );

//   const handlePrint = () => {
//     if (!contentRef.current) return;
//     const content = contentRef.current.innerHTML;
//     const win = window.open("", "", "width=900,height=700");
//     win?.document.write(`
//       <html dir="rtl">
//         <head><title>Print Record</title><script src="https://cdn.tailwindcss.com"></script></head>
//         <body class="p-8 font-sans">${content}</body>
//       </html>
//     `);
//     win?.document.close();
//     setTimeout(() => win?.print(), 500);
//   };

//   const handleExportPDF = async () => {
//     if (!contentRef.current) return;
//     setLoadingPdf(true);
//     try {
//       const element = contentRef.current;
//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`${selectedPatient?.id}.pdf`);
//     } finally {
//       setLoadingPdf(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      
//       {/* 1. DASHBOARD HEADER & SEARCH */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">السجل الطبي الموحد</h1>
//           <p className="text-gray-500">نظام إدارة شامل (عيادات، أسنان، رمد، نساء)</p>
//         </div>
//         <div className="relative w-96">
//           <Search className="absolute right-3 top-3 text-gray-400" size={18}/>
//           <Input 
//             className="pr-10" 
//             placeholder="بحث عن مريض..." 
//             value={searchTerm} 
//             onChange={e => setSearchTerm(e.target.value)} 
//           />
//         </div>
//       </div>

//       {/* 2. PATIENTS TABLE */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//         <Table>
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="text-right">المريض</TableHead>
//               <TableHead className="text-right">العمر / الجنس</TableHead>
//               <TableHead className="text-right">التشخيص الرئيسي</TableHead>
//               <TableHead className="text-right">آخر زيارة</TableHead>
//               <TableHead className="text-right">الإجراء</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredPatients.map(patient => (
//               <TableRow key={patient.id} className="cursor-pointer hover:bg-blue-50" onClick={() => { setSelectedPatient(patient); setOpen(true); setActiveTab('summary'); }}>
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
//                       {patient.name.charAt(0)}
//                     </div>
//                     <div>
//                       <div className="font-bold">{patient.name}</div>
//                       <div className="text-xs text-gray-500">{patient.id}</div>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>{calculateAge(patient.dob)} سنة / {patient.gender === 'Male' ? 'ذكر' : 'أنثى'}</TableCell>
//                 <TableCell>
//                   <Badge variant="secondary">{patient.history.medical[0]}</Badge>
//                 </TableCell>
//                 <TableCell>{patient.visits[0]?.date}</TableCell>
//                 <TableCell><Button size="sm" variant="outline">فتح الملف</Button></TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* 3. THE "SUPER MODAL" */}
//       {open && selectedPatient && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setOpen(false)}>
//           <div 
//             className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${maximized ? "w-screen h-screen rounded-none" : "w-full max-w-7xl h-[90vh]"}`}
//             onClick={e => e.stopPropagation()}
//           >
//             {/* A. MODAL HEADER (Epic Style) */}
//             <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
//               <div className="flex items-center gap-4">
//                 <img src={selectedPatient.avatar} className="w-16 h-16 rounded-lg border-2 border-white/20" alt="avatar"/>
//                 <div>
//                   <h2 className="text-2xl font-bold flex items-center gap-2">
//                     {selectedPatient.name}
//                     <span className="text-sm font-normal bg-slate-700 px-2 py-0.5 rounded text-slate-300">{selectedPatient.id}</span>
//                   </h2>
//                   <div className="flex gap-4 text-sm text-slate-400 mt-1">
//                     <span className="flex items-center gap-1"><User size={14}/> {calculateAge(selectedPatient.dob)} سنة ({selectedPatient.gender})</span>
//                     <span className="flex items-center gap-1"><Droplet size={14}/> {selectedPatient.bloodType}</span>
//                     <span className="flex items-center gap-1"><Briefcase size={14}/> {selectedPatient.occupation}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button variant="ghost" size="icon" onClick={() => setMaximized(!maximized)} className="text-white hover:bg-slate-800">
//                   {maximized ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handlePrint} className="text-white hover:bg-slate-800"><Printer size={18}/></Button>
//                 <Button variant="ghost" size="icon" onClick={handleExportPDF} className="text-white hover:bg-slate-800"><Download size={18}/></Button>
//                 <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-red-400 hover:bg-slate-800 hover:text-red-500"><X size={20}/></Button>
//               </div>
//             </div>

//             {/* B. VITALS RIBBON & ALERTS */}
//             <div className="shrink-0 bg-white">
//               {selectedPatient.alerts.length > 0 && (
//                 <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex gap-4 overflow-x-auto">
//                   {selectedPatient.alerts.map((alert, i) => (
//                     <div key={i} className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${alert.type === 'critical' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
//                       <AlertTriangle size={14}/> {alert.msg}
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <VitalsRibbon vitals={selectedPatient.vitals} />
//             </div>

//             {/* C. MAIN CONTENT AREA */}
//             <div className="flex flex-1 overflow-hidden">
              
//               {/* SIDEBAR NAVIGATION */}
//               <div className="w-64 bg-slate-50 border-l border-gray-200 p-2 overflow-y-auto shrink-0 hidden md:block">
//                 <div className="space-y-1">
//                   <p className="text-xs font-bold text-gray-400 uppercase px-3 py-2">عام</p>
//                   <SidebarBtn active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<ClipboardList size={18}/>} label="الملخص (Summary)" />
//                   <SidebarBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<FileText size={18}/>} label="التاريخ الطبي" />
//                   <SidebarBtn active={activeTab === 'meds'} onClick={() => setActiveTab('meds')} icon={<Pill size={18}/>} label="الأدوية" />
                  
//                   <div className="my-2 border-t border-gray-200"></div>
//                   <p className="text-xs font-bold text-gray-400 uppercase px-3 py-2">التخصصات</p>
//                   <SidebarBtn active={activeTab === 'dental'} onClick={() => setActiveTab('dental')} icon={<Smile size={18}/>} label="الأسنان (Dental)" />
//                   <SidebarBtn active={activeTab === 'eyes'} onClick={() => setActiveTab('eyes')} icon={<Eye size={18}/>} label="الرمد (Eyes)" />
//                   <SidebarBtn active={activeTab === 'obgyn'} onClick={() => setActiveTab('obgyn')} icon={<Baby size={18}/>} label="النساء (OB/GYN)" />
//                   <SidebarBtn active={activeTab === 'cardio'} onClick={() => setActiveTab('cardio')} icon={<Heart size={18}/>} label="القلب (Cardio)" />
                  
//                   <div className="my-2 border-t border-gray-200"></div>
//                   <SidebarBtn active={activeTab === 'labs'} onClick={() => setActiveTab('labs')} icon={<Syringe size={18}/>} label="التحاليل (Labs)" />
//                   <SidebarBtn active={activeTab === 'radio'} onClick={() => setActiveTab('radio')} icon={<Scan size={18}/>} label="الأشعة (Radiology)" />
//                 </div>
//               </div>

//               {/* DYNAMIC CONTENT */}
//               <div className="flex-1 overflow-y-auto p-6 bg-white" ref={contentRef}>
                
//                 {/* --- TAB: SUMMARY --- */}
//                 {activeTab === 'summary' && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    
//                     {/* Active Problems */}
//                     <Card>
//                       <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Activity className="text-blue-500"/> المشاكل الحالية</CardTitle></CardHeader>
//                       <CardContent>
//                         <ul className="space-y-2">
//                           {selectedPatient.history.medical.map((m, i) => (
//                             <li key={i} className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
//                               <span className="font-medium text-slate-700">{m}</span>
//                               <Badge variant="outline" className="bg-white">نشط</Badge>
//                             </li>
//                           ))}
//                         </ul>
//                       </CardContent>
//                     </Card>

//                     {/* Medications */}
//                     <Card>
//                       <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Pill className="text-purple-500"/> الأدوية</CardTitle></CardHeader>
//                       <CardContent>
//                         <ul className="space-y-2">
//                           {selectedPatient.medications.map((m, i) => (
//                             <li key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
//                               <div>
//                                 <div className="font-bold text-slate-800">{m.name}</div>
//                                 <div className="text-xs text-slate-500">{m.dose} - {m.freq}</div>
//                               </div>
//                               <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{m.status}</Badge>
//                             </li>
//                           ))}
//                         </ul>
//                       </CardContent>
//                     </Card>

//                     {/* Social History (Epic Style) */}
//                     <div className="md:col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-wrap gap-6 items-center">
//                        <span className="font-bold text-indigo-900 flex items-center gap-2"><Info size={18}/> التاريخ الاجتماعي:</span>
//                        <div className="flex items-center gap-2 text-sm text-indigo-800"><Cigarette size={16}/> {selectedPatient.history.social.smoking}</div>
//                        <div className="w-px h-4 bg-indigo-200"></div>
//                        <div className="flex items-center gap-2 text-sm text-indigo-800"><Activity size={16}/> {selectedPatient.history.social.exercise}</div>
//                        <div className="w-px h-4 bg-indigo-200"></div>
//                        <div className="flex items-center gap-2 text-sm text-indigo-800"><User size={16}/> {selectedPatient.history.social.marital}</div>
//                     </div>

//                     {/* Recent Visits Timeline */}
//                     <div className="md:col-span-2">
//                       <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Calendar className="text-orange-500"/> الزيارات الأخيرة</h3>
//                       <div className="relative border-r border-gray-200 mr-3 space-y-6 pr-6">
//                         {selectedPatient.visits.map((visit, i) => (
//                           <div key={i} className="relative">
//                             <div className="absolute -right-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
//                             <div className="flex items-center justify-between mb-1">
//                               <span className="font-bold text-gray-900">{visit.dept}</span>
//                               <span className="text-sm text-gray-500">{visit.date}</span>
//                             </div>
//                             <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">{visit.note} <span className="text-xs font-bold text-blue-600 block mt-1">- {visit.doctor}</span></p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* --- TAB: DENTAL (Odontogram) --- */}
//                 {activeTab === 'dental' && selectedPatient.specialties.dentistry && (
//                   <div className="animate-in fade-in">
//                     <div className="flex justify-between items-center mb-6">
//                        <h2 className="text-xl font-bold flex items-center gap-2"><Smile className="text-blue-500"/> سجل الأسنان</h2>
//                        <Badge className="bg-blue-100 text-blue-800">{selectedPatient.specialties.dentistry.gingivalHealth}</Badge>
//                     </div>
                    
//                     <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 shadow-inner overflow-x-auto">
//                        <div className="flex justify-center gap-2 mb-8 border-b border-dashed pb-4">
//                           {Array.from({length: 16}, (_, i) => i + 1).map(num => (
//                              <Tooth key={num} number={num} data={selectedPatient.specialties.dentistry?.teeth[num]} />
//                           ))}
//                        </div>
//                        <div className="flex justify-center gap-2 pt-4">
//                           {Array.from({length: 16}, (_, i) => 32 - i).map(num => (
//                              <Tooth key={num} number={num} data={selectedPatient.specialties.dentistry?.teeth[num]} />
//                           ))}
//                        </div>
//                     </div>
//                     <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
//                        <strong>ملاحظات:</strong> {selectedPatient.specialties.dentistry.notes}
//                     </div>
//                   </div>
//                 )}

//                 {/* --- TAB: EYES (Ophthalmology) --- */}
//                 {activeTab === 'eyes' && selectedPatient.specialties.ophthalmology && (
//                   <div className="animate-in fade-in">
//                     <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Eye className="text-teal-500"/> فحص الرمد</h2>
//                     <div className="grid md:grid-cols-2 gap-6">
//                       <Card className="border-t-4 border-t-blue-500 shadow-sm">
//                         <CardHeader className="pb-2"><CardTitle className="text-center text-blue-700">العين اليمنى (OD)</CardTitle></CardHeader>
//                         <CardContent className="text-center space-y-4">
//                           <div>
//                             <span className="text-xs text-gray-500 uppercase">Visual Acuity</span>
//                             <div className="text-3xl font-mono font-bold">{selectedPatient.specialties.ophthalmology.visualAcuity.od}</div>
//                           </div>
//                           <div className="w-full h-px bg-gray-100"></div>
//                           <div>
//                             <span className="text-xs text-gray-500 uppercase">Intraocular Pressure</span>
//                             <div className="text-xl font-bold">{selectedPatient.specialties.ophthalmology.iop.od}</div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card className="border-t-4 border-t-green-500 shadow-sm">
//                         <CardHeader className="pb-2"><CardTitle className="text-center text-green-700">العين اليسرى (OS)</CardTitle></CardHeader>
//                         <CardContent className="text-center space-y-4">
//                           <div>
//                             <span className="text-xs text-gray-500 uppercase">Visual Acuity</span>
//                             <div className="text-3xl font-mono font-bold">{selectedPatient.specialties.ophthalmology.visualAcuity.os}</div>
//                           </div>
//                           <div className="w-full h-px bg-gray-100"></div>
//                           <div>
//                             <span className="text-xs text-gray-500 uppercase">Intraocular Pressure</span>
//                             <div className="text-xl font-bold">{selectedPatient.specialties.ophthalmology.iop.os}</div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                     <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
//                       <strong>التشخيص:</strong> {selectedPatient.specialties.ophthalmology.diagnosis}
//                     </div>
//                   </div>
//                 )}

//                 {/* --- TAB: OB/GYN --- */}
//                 {activeTab === 'obgyn' && selectedPatient.history.obgyn && (
//                    <div className="animate-in fade-in space-y-6">
//                       <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Baby className="text-pink-500"/> صحة المرأة</h2>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                          <Card className="bg-pink-50 border-pink-100"><CardContent className="p-4 text-center"><div className="text-sm text-pink-600 font-bold">Gravida</div><div className="text-2xl font-bold text-pink-900">{selectedPatient.history.obgyn.gravida}</div></CardContent></Card>
//                          <Card className="bg-pink-50 border-pink-100"><CardContent className="p-4 text-center"><div className="text-sm text-pink-600 font-bold">Para</div><div className="text-2xl font-bold text-pink-900">{selectedPatient.history.obgyn.para}</div></CardContent></Card>
//                          <Card className="bg-pink-50 border-pink-100"><CardContent className="p-4 text-center"><div className="text-sm text-pink-600 font-bold">LMP</div><div className="text-lg font-bold text-pink-900">{selectedPatient.history.obgyn.lmp}</div></CardContent></Card>
//                          <Card className="bg-pink-50 border-pink-100"><CardContent className="p-4 text-center"><div className="text-sm text-pink-600 font-bold">Cycle</div><div className="text-lg font-bold text-pink-900">{selectedPatient.history.obgyn.cycle}</div></CardContent></Card>
//                       </div>
//                    </div>
//                 )}

//                 {/* --- TAB: LABS --- */}
//                 {activeTab === 'labs' && (
//                   <div className="animate-in fade-in">
//                     <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Syringe className="text-indigo-500"/> نتائج التحاليل</h2>
//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                       <Table>
//                         <TableHeader className="bg-gray-50">
//                           <TableRow>
//                             <TableHead className="text-right">الفحص</TableHead>
//                             <TableHead className="text-center">النتيجة</TableHead>
//                             <TableHead className="text-center">الوحدة</TableHead>
//                             <TableHead className="text-center">الحالة</TableHead>
//                             <TableHead className="text-left">التاريخ</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {selectedPatient.labs.map((lab, i) => (
//                             <TableRow key={i}>
//                               <TableCell className="font-medium">{lab.name}</TableCell>
//                               <TableCell className="text-center font-bold text-lg">{lab.value}</TableCell>
//                               <TableCell className="text-center text-gray-500 text-sm">{lab.unit}</TableCell>
//                               <TableCell className="text-center">
//                                 <Badge variant="outline" className={lab.flag === 'High' ? 'bg-red-50 text-red-700 border-red-200' : lab.flag === 'Low' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}>
//                                   {lab.flag}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell className="text-left text-gray-500">{lab.date}</TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
//                 )}

//                 {/* --- OTHER TABS (Placeholder logic for brevity in this merged view) --- */}
//                 {['history', 'cardio', 'radio', 'meds'].includes(activeTab) && activeTab !== 'summary' && activeTab !== 'meds' && (
//                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//                       <FileText size={48} className="mb-4 opacity-20"/>
//                       <p>محتوى تفصيلي لهذا القسم ({activeTab}) متاح في البيانات...</p>
//                    </div>
//                 )}

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















// "use client";

// import React, { useCallback, useMemo, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   X,
//   Maximize2,
//   Minimize2,
//   Download,
//   Printer,
//   Search,
//   Activity,
//   Heart,
//   Thermometer,
//   Droplet,
//   User,
//   Calendar,
//   Phone,
//   MapPin,
//   Mail,
//   AlertCircle,
//   FileText,
//   Pill,
//   FileImage,
//   Stethoscope,
//   Users,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useLocale } from "next-intl";

// // ----------------------------
// // Types
// // ----------------------------

// type Gender = "Male" | "Female" | "Other";

// type VisitNote = {
//   date: string;
//   doctorName: string;
//   notes: string;
// };

// type LabTest = {
//   testName: string;
//   result: string;
//   unit?: string;
//   range?: string;
//   date?: string;
// };

// type RadiologyReport = {
//   id?: string;
//   type: string;
//   description: string;
//   date?: string;
//   images?: string[]; // URLs
// };

// type DentalRecord = {
//   lastCheckup?: string;
//   treatments?: string[];
//   orthodontics?: string | null;
//   notes?: string;
// };

// type CardioRecord = {
//   ekg?: string;
//   echocardiogram?: string;
//   medications?: string[];
//   notes?: string;
// };

// type Patient = {
//   id: string;
//   name: string;
//   dateOfBirth: string; // ISO
//   gender: Gender;
//   contactPhone?: string;
//   contactEmail?: string;
//   address?: string;
//   avatar?: string;
//   bloodType?: string;
//   personalInfo?: {
//     allergies?: string[];
//     chronicConditions?: string[];
//     familyHistory?: string[];
//     surgeries?: string[];
//   };
//   generalMedicine?: {
//     diagnoses?: { description: string; code?: string }[];
//     medications?: string[];
//     vitalSigns?: {
//       heartRate?: string;
//       bloodPressure?: string;
//       temperature?: string;
//       glucose?: string;
//       spo2?: string;
//       weight?: string;
//       height?: string;
//     };
//   };
//   labTests?: LabTest[];
//   radiology?: RadiologyReport[];
//   dental?: DentalRecord | null;
//   cardio?: CardioRecord | null;
//   visitNotes?: VisitNote[];
// };

// // ----------------------------
// // Dummy Data (expanded)
// // ----------------------------

// const dummyPatients: Patient[] = [
//   {
//     id: "P001",
//     name: "محمد أحمد",
//     dateOfBirth: "1985-03-21",
//     gender: "Male",
//     contactPhone: "+201234567890",
//     contactEmail: "m.ahmed@example.com",
//     address: "القاهرة، مصر",
//     avatar: "",
//     bloodType: "O+",
//     personalInfo: {
//       allergies: ["عشب اللقاح", "مضادات حيوية (Penicillin)"],
//       chronicConditions: ["Diabetes", "Hypertension"],
//       familyHistory: ["Heart Disease (Father)"] ,
//       surgeries: ["Appendectomy 2015"],
//     },
//     generalMedicine: {
//       diagnoses: [
//         { description: "ارتفاع ضغط الدم", code: "I10" },
//         { description: "سكري من النوع الثاني", code: "E11" },
//       ],
//       medications: ["Amlodipine 5mg", "Metformin 500mg"],
//       vitalSigns: {
//         heartRate: "78",
//         bloodPressure: "128/82",
//         temperature: "36.6",
//         glucose: "95",
//         spo2: "98%",
//         weight: "82 kg",
//         height: "175 cm",
//       },
//     },
//     labTests: [
//       { testName: "HbA1c", result: "6.5", unit: "%", range: "4.0-6.0", date: "2025-11-30" },
//       { testName: "CBC - WBC", result: "7.2", unit: "x10^9/L", range: "4-11", date: "2025-11-01" },
//     ],
//     radiology: [
//       { id: "R001", type: "Chest X-Ray", description: "No acute cardiopulmonary disease.", date: "2025-09-20", images: [] },
//       { id: "R002", type: "Knee MRI", description: "Medial meniscus tear.", date: "2025-08-12", images: [] },
//     ],
//     dental: {
//       lastCheckup: "2025-10-15",
//       treatments: ["Filling #12", "Scaling"],
//       orthodontics: "Braces removed 2023",
//       notes: "Patient lost 2 posterior teeth replaced with bridge.",
//     },
//     cardio: {
//       ekg: "Sinus Rhythm",
//       echocardiogram: "Normal LV function",
//       medications: ["Beta Blocker"],
//       notes: "Mild LV hypertrophy",
//     },
//     visitNotes: [
//       { date: "2025-11-01", doctorName: "د. أحمد سعيد", notes: "متابعة ضغط وسكر، نصح بتعديل النظام الغذائي." },
//       { date: "2025-09-20", doctorName: "د. سارة", notes: "أشعة صدر عادية، متابعة" },
//     ],
//   },
//   // You can add more patients here...
// ];

// // ----------------------------
// // Helpers
// // ----------------------------

// function calculateAge(dateOfBirth: string): number {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// const parseVal = (str?: string) => {
//   if (!str) return 0;
//   const matches = str.match(/\d+(\.\d+)?/);
//   return matches ? parseFloat(matches[0]) : 0;
// };

// const getStatusColor = (val: number, min: number, max: number) => {
//   if (val < min || val > max) return "text-red-600 bg-red-50 border-red-100";
//   return "text-emerald-600 bg-emerald-50 border-emerald-100";
// };

// // ----------------------------
// // Subcomponents (kept inside file for single-file delivery)
// // ----------------------------

// const VitalCard = React.memo(function VitalCard({
//   title,
//   value,
//   unit,
//   icon,
//   min = 0,
//   max = 1000,
//   customCheck,
// }: {
//   title: string;
//   value?: string;
//   unit?: string;
//   icon: React.ReactNode;
//   min?: number;
//   max?: number;
//   customCheck?: (val: string) => string;
// }) {
//   if (!value) return null;
//   const numVal = parseVal(value);
//   let statusClass = "text-gray-600 bg-gray-50 border-gray-100";

//   if (customCheck) {
//     const status = customCheck(value);
//     statusClass = status === "high" ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100";
//   } else {
//     statusClass = getStatusColor(numVal, min, max);
//   }

//   const textColor = statusClass.split(" ")[0];
//   const bg = statusClass.split(" ")[1];
//   const border = statusClass.split(" ")[2];

//   return (
//     <div className={`p-4 rounded-xl border ${border} ${bg} flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02]`}>
//       <div>
//         <p className="text-xs text-gray-500 mb-1 font-medium">{title}</p>
//         <div className="flex items-end gap-1">
//           <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
//           <span className="text-xs text-gray-400 mb-1">{unit}</span>
//         </div>
//       </div>
//       <div className={`p-2 rounded-full bg-white bg-opacity-60 shadow-sm`}>{icon}</div>
//     </div>
//   );
// });

// const SectionHeader = ({ icon, title }: { icon?: React.ReactNode; title: string }) => (
//   <div className="flex items-center gap-2 mb-4">
//     <div className="p-2 rounded-md bg-gray-100">{icon}</div>
//     <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//   </div>
// );

// // ----------------------------
// // Main Component
// // ----------------------------

// export default function MedicalRecordModalModernSingleFile() {
//   const patients = useMemo(() => dummyPatients, []);
//   const locale = useLocale();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<string>("overview");
//   const [open, setOpen] = useState(false);
//   const [maximized, setMaximized] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const [loadingPdf, setLoadingPdf] = useState(false);

//   const filteredPatients = useMemo(
//     () =>
//       patients.filter((p) =>
//         [p.name, p.contactPhone, p.contactEmail, p.id]
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       ),
//     [patients, searchTerm]
//   );

//   const openModalWithPatient = useCallback((patient: Patient) => {
//     setSelectedPatient(patient);
//     setOpen(true);
//     setActiveTab("overview");
//   }, []);

//   // Print & Export
//   const handlePrint = useCallback(() => {
//     if (!contentRef.current || !selectedPatient) return;
//     const html = contentRef.current.outerHTML;
//     const newWin = window.open("", "_blank", "width=900,height=700");
//     if (!newWin) return;
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>تقرير طبي - ${selectedPatient.name}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
//             body { font-family: 'Cairo', sans-serif; direction: rtl; background: white; }
//           </style>
//         </head>
//         <body class="p-8">
//           ${html}
//           <script>
//             setTimeout(() => { window.print(); window.close(); }, 600);
//           </script>
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//   }, [selectedPatient]);

//   const handleExportPDF = useCallback(async () => {
//     if (!contentRef.current || !selectedPatient) return;
//     setLoadingPdf(true);
//     try {
//       const element = contentRef.current;
//       // Temporarily tweak classes for a cleaner PDF
//       element.classList.remove("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.add("bg-white");

//       const canvas = await html2canvas(element, { scale: 2, useCORS: true });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`Medical_Record_${selectedPatient.id}.pdf`);

//       // Restore classes
//       element.classList.add("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.remove("bg-white");
//     } catch (err) {
//       console.error("PDF Error", err);
//     } finally {
//       setLoadingPdf(false);
//     }
//   }, [selectedPatient]);

//   // Memoized tab content generator
//   const renderTabContent = useMemo(() => {
//     if (!selectedPatient) return null;

//     const vitals = selectedPatient.generalMedicine?.vitalSigns;

//     const overview = (
//       <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
//         <section>
//           <SectionHeader icon={<FileText size={18} />} title="التشخيصات النشطة" />
//           <div className="grid gap-3">
//             {selectedPatient.generalMedicine?.diagnoses?.map((diag, i) => (
//               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
//                 <div>
//                   <p className="font-semibold text-gray-900">{diag.description}</p>
//                   <p className="text-xs text-gray-500 mt-1">Code: {diag.code || "-"}</p>
//                 </div>
//                 <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section>
//           <SectionHeader icon={<Pill size={18} />} title="الأدوية الحالية" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {selectedPatient.generalMedicine?.medications?.map((med, i) => (
//               <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/50">
//                 <div className="bg-white p-2 rounded-lg shadow-sm text-purple-600">
//                   <Pill size={16} />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">{med}</p>
//                   <p className="text-xs text-gray-500">تعليمات: حبة واحدة يومياً بعد الأكل</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section>
//           <SectionHeader icon={<Calendar size={18} />} title="سجل الزيارات" />
//           <div className="relative border-r border-gray-200 mr-3 space-y-6 pr-6">
//             {selectedPatient.visitNotes?.map((visit, i) => (
//               <div key={i} className="relative">
//                 <div className="absolute -right-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
//                   <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{visit.date}</span>
//                   <span className="text-xs text-gray-500 mt-1 sm:mt-0">د. {visit.doctorName}</span>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600 leading-relaxed">{visit.notes}</div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     );

//     const labs = (
//       <div className="animate-in fade-in zoom-in-95 duration-300">
//         <h4 className="font-bold text-gray-800 text-lg mb-6">نتائج المختبر</h4>
//         <div className="overflow-x-auto rounded-xl border border-gray-200">
//           <table className="w-full text-right text-sm">
//             <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
//               <tr>
//                 <th className="p-4">اسم الفحص</th>
//                 <th className="p-4">النتيجة</th>
//                 <th className="p-4">المعدل الطبيعي</th>
//                 <th className="p-4">التاريخ</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {selectedPatient.labTests?.map((test, i) => {
//                 const val = parseVal(test.result);
//                 const isHigh = val > 100; // simplified
//                 return (
//                   <tr key={i} className="hover:bg-gray-50/80">
//                     <td className="p-4 font-medium text-gray-900">{test.testName}</td>
//                     <td className="p-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isHigh ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//                         {test.result} {test.unit}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-500">{test.range || "-"}</td>
//                     <td className="p-4 text-gray-400">{test.date || "-"}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );

//     const radiology = (
//       <div className="space-y-4">
//         <h4 className="font-bold text-gray-800 text-lg">تقارير الأشعة</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {selectedPatient.radiology?.map((r, i) => (
//             <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="font-semibold">{r.type}</div>
//                 <div className="text-xs text-gray-500">{r.date}</div>
//               </div>
//               <p className="text-sm text-gray-600">{r.description}</p>
//               {r.images && r.images.length > 0 && (
//                 <div className="mt-3 grid grid-cols-3 gap-2">
//                   {r.images.map((img, idx) => (
//                     <img key={idx} src={img} alt={`${r.type}-${idx}`} className="h-24 w-full object-cover rounded" />
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );

//     const cardio = (
//       <div className="space-y-4">
//         <SectionHeader icon={<Stethoscope size={18} />} title="معلومات القلب" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div className="p-4 bg-white rounded-xl border border-gray-200">
//             <p className="font-medium">EKG: {selectedPatient.cardio?.ekg || "-"}</p>
//             <p className="text-sm text-gray-500 mt-2">{selectedPatient.cardio?.notes}</p>
//           </div>
//           <div className="p-4 bg-white rounded-xl border border-gray-200">
//             <p className="font-medium">Echo: {selectedPatient.cardio?.echocardiogram || "-"}</p>
//             <p className="text-sm text-gray-500 mt-2">الأدوية: {(selectedPatient.cardio?.medications || []).join(", ")}</p>
//           </div>
//         </div>
//       </div>
//     );

//     const dental = (
//       <div className="space-y-4">
//         <SectionHeader icon={<FileImage size={18} />} title="سجل الأسنان" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div className="p-4 bg-white rounded-xl border border-gray-200">
//             <p className="font-medium">آخر فحص: {selectedPatient.dental?.lastCheckup || "-"}</p>
//             <p className="text-sm text-gray-500 mt-2">{selectedPatient.dental?.notes}</p>
//           </div>
//           <div className="p-4 bg-white rounded-xl border border-gray-200">
//             <p className="font-medium">العلاجات:</p>
//             <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
//               {selectedPatient.dental?.treatments?.map((t, i) => (
//                 <li key={i}>{t}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     );

//     const gynecology = (
//       <div className="space-y-3">
//         <SectionHeader icon={<Users size={18} />} title="نساء وولادة" />
//         <p className="text-sm text-gray-500">لا توجد بيانات متاحة حالياً لهذا القسم.</p>
//       </div>
//     );

//     const pediatrics = (
//       <div className="space-y-3">
//         <SectionHeader icon={<Users size={18} />} title="طب الأطفال" />
//         <p className="text-sm text-gray-500">لا توجد بيانات متاحة حالياً لهذا القسم.</p>
//       </div>
//     );

//     const allergies = (
//       <div className="space-y-3">
//         <SectionHeader icon={<AlertCircle size={18} />} title="الحساسية والأمراض المزمنة" />
//         <div className="flex flex-wrap gap-2">
//           {(selectedPatient.personalInfo?.allergies || []).map((a, i) => (
//             <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium">{a}</span>
//           ))}
//           {(selectedPatient.personalInfo?.chronicConditions || []).map((c, i) => (
//             <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium">{c}</span>
//           ))}
//         </div>
//       </div>
//     );

//     const family = (
//       <div className="space-y-3">
//         <SectionHeader icon={<Users size={18} />} title="تاريخ العائلة المرضي" />
//         <ul className="list-disc list-inside text-sm text-gray-600">
//           {(selectedPatient.personalInfo?.familyHistory || []).map((f, i) => (
//             <li key={i}>{f}</li>
//           ))}
//         </ul>
//       </div>
//     );

//     const mapTabToContent: Record<string, React.ReactNode> = {
//       overview,
//       labs,
//       radiology,
//       cardio,
//       dental,
//       gynecology,
//       pediatrics,
//       allergies,
//       family,
//     };

//     return mapTabToContent;
//   }, [selectedPatient]);

//   return (
//     <div className="p-6 space-y-6 font-sans bg-gray-50/50 min-h-screen" dir="rtl">
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">سجلات المرضى</h1>
//           <p className="text-gray-500 text-sm mt-1">إدارة الملفات الطبية ومتابعة الحالات — Expanded (Epic-like)</p>
//         </div>
//         <div className="relative w-full md:w-96 group">
//           <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
//           <Input
//             type="search"
//             placeholder="بحث سريع (اسم، هاتف، رقم ملف)..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pr-10 h-11 bg-white border-gray-200 focus:border-blue-500 rounded-xl shadow-sm transition-all"
//           />
//         </div>
//       </div>

//       {/* Main Table Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <Table>
//           <TableHeader className="bg-gray-50/80">
//             <TableRow>
//               <TableHead className="text-right font-semibold text-gray-700">المريض</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">العمر / الجنس</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">رقم الهاتف</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">آخر زيارة</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">الإجراءات</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((p) => (
//                 <TableRow key={p.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => openModalWithPatient(p)}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">{p.name.charAt(0)}</div>
//                       <div>
//                         <div className="font-semibold text-gray-900">{p.name}</div>
//                         <div className="text-xs text-gray-500">#{p.id}</div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col">
//                       <span className="font-medium">{calculateAge(p.dateOfBirth)} سنة</span>
//                       <span className="text-xs text-gray-500">{p.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="font-mono text-gray-600">{p.contactPhone}</TableCell>
//                   <TableCell>
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{p.visitNotes?.[0]?.date || "جديد"}</span>
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         openModalWithPatient(p);
//                       }}
//                       variant="outline"
//                       size="sm"
//                       className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       فتح الملف
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-32 text-center text-gray-500">
//                   لا توجد نتائج مطابقة للبحث
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Modal */}
//       {open && selectedPatient && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
//           <div
//             className={`bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${maximized ? "w-screen h-screen rounded-none" : "w-full max-w-6xl max-h-[90vh]"}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <img
//                     src={selectedPatient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPatient.name)}&background=0D8ABC&color=fff`}
//                     alt="avatar"
//                     className="h-14 w-14 rounded-full border-4 border-white shadow-sm"
//                   />
//                   <span className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full"></span>
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                     {selectedPatient.name}
//                     <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200 font-normal">{calculateAge(selectedPatient.dateOfBirth)} سنة</span>
//                   </h2>
//                   <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
//                     <span className="flex items-center gap-1"><User size={14} /> {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                     <span className="text-gray-300">|</span>
//                     <span className="font-mono text-gray-400">ID: {selectedPatient.id}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon" onClick={() => setMaximized(!maximized)} className="text-gray-500 hover:bg-gray-100 rounded-full">
//                   {maximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handlePrint} className="text-gray-500 hover:bg-gray-100 rounded-full">
//                   <Printer size={18} />
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handleExportPDF} className="text-gray-500 hover:bg-gray-100 rounded-full">
//                   {loadingPdf ? <span className="animate-spin">⌛</span> : <Download size={18} />}
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-red-500 hover:bg-red-50 rounded-full">
//                   <X size={20} />
//                 </Button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6" dir="rtl">
//               <div ref={contentRef} className="max-w-6xl mx-auto space-y-6">
//                 {/* Vitals */}
//                 {selectedPatient.generalMedicine?.vitalSigns && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <VitalCard title="معدل النبض" value={selectedPatient.generalMedicine.vitalSigns.heartRate} unit="bpm" icon={<Activity className="text-rose-500" />} min={60} max={100} />
//                     <VitalCard title="ضغط الدم" value={selectedPatient.generalMedicine.vitalSigns.bloodPressure} unit="mmHg" icon={<Heart className="text-blue-500" />} customCheck={(val) => {
//                       const sys = parseInt(val.split('/')[0]);
//                       return sys > 130 ? 'high' : 'normal';
//                     }} />
//                     <VitalCard title="الحرارة" value={selectedPatient.generalMedicine.vitalSigns.temperature} unit="°C" icon={<Thermometer className="text-orange-500" />} min={36} max={37.5} />
//                     <VitalCard title="سكر الدم" value={selectedPatient.generalMedicine.vitalSigns.glucose} unit="mg/dL" icon={<Droplet className="text-purple-500" />} min={70} max={140} />
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                   <div className="lg:col-span-4 space-y-6">
//                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">بيانات الاتصال</h3>
//                       <div className="space-y-4 text-sm">
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Phone size={16} /></div>
//                           <div>
//                             <p className="text-gray-500 text-xs">رقم الهاتف</p>
//                             <p className="font-medium font-mono dir-ltr text-right">{selectedPatient.contactPhone}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Mail size={16} /></div>
//                           <div>
//                             <p className="text-gray-500 text-xs">البريد الإلكتروني</p>
//                             <p className="font-medium">{selectedPatient.contactEmail}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><MapPin size={16} /></div>
//                           <div>
//                             <p className="text-gray-500 text-xs">العنوان</p>
//                             <p className="font-medium">{selectedPatient.address}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">تنبيهات طبية</h3>
//                       <div className="space-y-4">
//                         <div>
//                           <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><AlertCircle size={12} /> الحساسية</p>
//                           <div className="flex flex-wrap gap-2">
//                             {selectedPatient.personalInfo?.allergies?.length ? selectedPatient.personalInfo.allergies.map((alg, i) => (
//                               <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium">{alg}</span>
//                             )) : <span className="text-gray-400 text-xs">لا توجد حساسيات معروفة</span>}
//                           </div>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Activity size={12} /> الأمراض المزمنة</p>
//                           <div className="flex flex-wrap gap-2">
//                             {selectedPatient.personalInfo?.chronicConditions?.length ? selectedPatient.personalInfo.chronicConditions.map((cond, i) => (
//                               <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium">{cond}</span>
//                             )) : <span className="text-gray-400 text-xs">لا توجد أمراض مزمنة</span>}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">تاريخ العائلة المرضي</h3>
//                       <div className="text-sm">
//                         {selectedPatient.personalInfo?.familyHistory?.length ? (
//                           <ul className="list-disc list-inside text-sm text-gray-600">
//                             {selectedPatient.personalInfo!.familyHistory!.map((f, i) => (
//                               <li key={i}>{f}</li>
//                             ))}
//                           </ul>
//                         ) : (
//                           <p className="text-gray-400 text-sm">لا توجد سجلات</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="lg:col-span-8">
//                     <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm mb-6 flex overflow-x-auto gap-1">
//                       {['overview', 'labs', 'cardio', 'radiology', 'dental', 'pediatrics', 'gynecology', 'allergies', 'family'].map((tab) => {
//                         const labels: Record<string, string> = { overview: "نظرة عامة", labs: "التحاليل", cardio: "القلب", radiology: "الأشعة", dental: "الأسنان", pediatrics: "الأطفال", gynecology: "نساء وولادة", allergies: "الحساسية", family: "تاريخ العائلة" };
//                         const isActive = activeTab === tab;
//                         return (
//                           <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
//                             {labels[tab]}
//                           </button>
//                         );
//                       })}
//                     </div>

//                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] p-6">
//                       {selectedPatient && (renderTabContent || {})[activeTab]}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











// "use client";

// import React, { useState } from "react";
// import { 
//   X, Search, Activity, Heart, Thermometer, Droplet, User, 
//   Calendar, Phone, MapPin, Mail, AlertTriangle, FileText, Pill,
//   Stethoscope, Eye, Bone, Brain, Syringe, Scan, Smile, Briefcase, 
//   Cigarette, Baby, Info, ClipboardList
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// // --- 1. EPIC-STYLE DATA STRUCTURE ---
// const epicPatientData = [
//   {
//     id: "MRN-998877",
//     name: "مها أحمد محمد علي",
//     dob: "1985-05-15", // 40 Years
//     gender: "Female",
//     bloodType: "O+",
//     maritalStatus: "Married",
//     occupation: "مهندسة معمارية",
//     insurance: { provider: "Bupa Global", policy: "EG-99821", coverage: "Platinum" },
//     contact: { phone: "01000000000", email: "maha.arch@example.com", address: "6 أكتوبر، الجيزة" },
//     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&h=128&q=80",
    
//     // Triage / Status
//     status: { code: "Stable", location: "Outpatient Clinic", admissionDate: "2025-10-01" },

//     // Clinical Decision Support (Alerts)
//     alerts: [
//       { type: "critical", msg: "حساسية مفرطة من البنسلين (Anaphylaxis Risk)" },
//       { type: "warning", msg: "لم يتم إجراء فحص الماموجرام السنوي" },
//       { type: "info", msg: "المريض يفضل التواصل عبر الواتساب" }
//     ],

//     // Vitals Trend (Last 3 readings)
//     vitals: {
//       bp: "120/80", hr: "72", temp: "36.8", rr: "16", spo2: "98%", bmi: "24.5", weight: "68kg", height: "165cm"
//     },

//     // Detailed History (Epic Style)
//     history: {
//       medical: ["Hypothyroidism (قصور الغدة الدرقية)", "Migraine (صداع نصفي مزمن)"],
//       surgical: [
//         { proc: "Caesarean Section (C-Section)", date: "2015", note: "Lower segment" },
//         { proc: "Tonsillectomy", date: "1995", note: "Childhood" }
//       ],
//       social: {
//         smoking: "Non-smoker",
//         alcohol: "Socially (Rare)",
//         living: "Lives with husband and 2 children",
//         exercise: "Gym 2x/week"
//       },
//       family: [
//         { relation: "Mother", condition: "Breast Cancer", onsetAge: "55" },
//         { relation: "Father", condition: "Hypertension", onsetAge: "60" }
//       ],
//       obgyn: {
//         para: "2", gravida: "2", lmp: "2025-09-20", cycle: "Regular"
//       }
//     },

//     // Medications List
//     medications: [
//       { name: "Eltroxin", dose: "50mcg", route: "PO", freq: "Daily", status: "Active" },
//       { name: "Panadol Extra", dose: "500mg", route: "PO", freq: "PRN", status: "Active" }
//     ],

//     // --- SPECIALTY MODULES ---
//     specialties: {
//       // 1. DENTISTRY MODULE (Odontogram Data)
//       dentistry: {
//         lastVisit: "2025-08-10",
//         doctor: "د. تامر الأسنان",
//         gingivalHealth: "Mild Gingivitis",
//         // Universal Numbering System (1-32)
//         teeth: {
//           18: { status: "missing", note: "Extracted" },
//           19: { status: "filling", type: "Amalgam", surfaces: "MOD" },
//           30: { status: "caries", note: "Deep decay, needs RCT" },
//           14: { status: "crown", type: "Zirconia" }
//         },
//         notes: "المريضة تشتكي من حساسية مع المشروبات الباردة في الجانب السفلي الأيسر."
//       },

//       // 2. OPHTHALMOLOGY MODULE
//       ophthalmology: {
//         lastVisit: "2024-11-02",
//         doctor: "د. سلمى الرمد",
//         visualAcuity: { od: "6/6", os: "6/9" }, // Right/Left
//         iop: { od: "14 mmHg", os: "15 mmHg" }, // Intraocular Pressure
//         diagnosis: "Myopia (قصر نظر بسيط) في العين اليسرى",
//         prescription: "N/A - No glasses needed currently"
//       },

//       // 3. DERMATOLOGY MODULE
//       dermatology: {
//         lastVisit: "2025-01-15",
//         doctor: "د. كريم الجلدية",
//         skinType: "Type III (Fitzpatrick)",
//         conditions: [
//           { site: "Face", type: "Acne Vulgaris", status: "Improved" },
//           { site: "Left Arm", type: "Eczema", status: "Active flare-up" }
//         ]
//       },

//       // 4. ORTHOPEDICS MODULE
//       orthopedics: {
//         lastVisit: "2023-05-20",
//         doctor: "د. عظام",
//         complaint: "Lower Back Pain",
//         mriResult: "L4-L5 Mild Disc Bulge",
//         plan: "Physical Therapy"
//       }
//     },

//     // Labs & Imaging
//     labs: [
//       { name: "TSH", value: "2.5", unit: "mIU/L", range: "0.4-4.0", date: "2025-09-01", flag: "Normal" },
//       { name: "Free T4", value: "1.1", unit: "ng/dL", range: "0.8-1.8", date: "2025-09-01", flag: "Normal" },
//       { name: "Vitamin D", value: "18", unit: "ng/mL", range: "30-100", date: "2025-09-01", flag: "Low" }
//     ]
//   }
// ];

// // --- HELPER COMPONENTS ---

// // Dental Tooth Component
// const Tooth = ({ number, data }: { number: number, data: any }) => {
//   let color = "bg-white border-gray-300"; // Healthy
//   if (data?.status === "missing") color = "bg-gray-200 border-gray-400 opacity-50";
//   if (data?.status === "filling") color = "bg-blue-100 border-blue-400";
//   if (data?.status === "caries") color = "bg-red-100 border-red-400";
//   if (data?.status === "crown") color = "bg-yellow-100 border-yellow-400";

//   return (
//     <div className="flex flex-col items-center gap-1 group cursor-pointer">
//       <div className={`w-8 h-10 rounded-t-lg rounded-b-md border-2 ${color} shadow-sm flex items-center justify-center transition-all hover:scale-110 relative`}>
//         {data?.status === "caries" && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
//         {data?.status === "filling" && <div className="w-3 h-3 bg-blue-500/50 rounded-sm"></div>}
//       </div>
//       <span className="text-xs font-bold text-gray-500">{number}</span>
      
//       {/* Tooltip mimic */}
//       {data && (
//         <div className="absolute bottom-12 hidden group-hover:block bg-black/80 text-white text-xs p-2 rounded z-50 whitespace-nowrap">
//           {data.status} - {data.note || data.type}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function EpicMedicalRecord() {
//   const [selectedPatient, setSelectedPatient] = useState(epicPatientData[0]);
//   const [activeTab, setActiveTab] = useState("summary");

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 font-sans text-right" dir="rtl">
      
//       {/* 1. TOP BAR (Patient Context) - Epic Style Header */}
//       <header className="bg-white border-b border-gray-300 shadow-sm rounded-t-xl overflow-hidden mb-4">
//         <div className="bg-slate-800 text-white p-2 px-4 text-xs flex justify-between">
//            <span>نظام إدارة العيادات الذكي v2.0</span>
//            <span className="flex gap-4">
//               <span>المستخدم: د. أحمد (Admin)</span>
//               <span>{new Date().toLocaleDateString('ar-EG')}</span>
//            </span>
//         </div>
        
//         <div className="p-4 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
//           {/* Avatar & Basic Info */}
//           <div className="flex gap-4 items-center min-w-[300px]">
//              <img src={selectedPatient.avatar} className="w-20 h-20 rounded-lg border border-gray-200 shadow-sm object-cover" alt="avatar" />
//              <div>
//                 <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//                    {selectedPatient.name}
//                    <Badge variant="outline" className="text-slate-600 border-slate-400">{selectedPatient.id}</Badge>
//                 </h1>
//                 <div className="text-sm text-gray-500 flex flex-wrap gap-3 mt-1">
//                    <span className="flex items-center gap-1"><User size={14}/> {selectedPatient.dob} ({new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()} سنة)</span>
//                    <span className="flex items-center gap-1"><Briefcase size={14}/> {selectedPatient.occupation}</span>
//                    <span className="flex items-center gap-1 text-blue-600 font-bold">{selectedPatient.insurance.provider}</span>
//                 </div>
//              </div>
//           </div>

//           {/* Vitals Ribbon */}
//           <div className="flex-1 flex gap-4 overflow-x-auto py-2 px-4 bg-slate-50 rounded-lg border border-slate-100 w-full lg:w-auto">
//              <div className="flex flex-col items-center min-w-[60px]">
//                 <span className="text-xs text-gray-400 uppercase">BP</span>
//                 <span className="font-bold text-lg text-slate-700">{selectedPatient.vitals.bp}</span>
//              </div>
//              <div className="w-px bg-gray-200 h-8 self-center"></div>
//              <div className="flex flex-col items-center min-w-[60px]">
//                 <span className="text-xs text-gray-400 uppercase">HR</span>
//                 <span className="font-bold text-lg text-slate-700">{selectedPatient.vitals.hr}</span>
//              </div>
//              <div className="w-px bg-gray-200 h-8 self-center"></div>
//              <div className="flex flex-col items-center min-w-[60px]">
//                 <span className="text-xs text-gray-400 uppercase">WT</span>
//                 <span className="font-bold text-lg text-slate-700">{selectedPatient.vitals.weight}</span>
//              </div>
//              <div className="w-px bg-gray-200 h-8 self-center"></div>
//              <div className="flex flex-col items-center min-w-[60px]">
//                 <span className="text-xs text-gray-400 uppercase">BMI</span>
//                 <span className={`font-bold text-lg ${parseFloat(selectedPatient.vitals.bmi) > 25 ? 'text-orange-600' : 'text-slate-700'}`}>{selectedPatient.vitals.bmi}</span>
//              </div>
//           </div>

//           {/* Clinical Alerts (BPA) */}
//           <div className="min-w-[250px] space-y-1">
//              {selectedPatient.alerts.map((alert, i) => (
//                 <div key={i} className={`text-xs px-3 py-1.5 rounded flex items-center gap-2 font-medium
//                    ${alert.type === 'critical' ? 'bg-red-100 text-red-800 border border-red-200' : 
//                      alert.type === 'warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-700'}`}>
//                    <AlertTriangle size={12} /> {alert.msg}
//                 </div>
//              ))}
//           </div>
//         </div>
//       </header>

//       {/* 2. MAIN LAYOUT */}
//       <div className="grid grid-cols-12 gap-6 h-[calc(100vh-220px)]">
         
//          {/* LEFT SIDEBAR (Navigation) */}
//          <div className="col-span-12 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-y-auto">
//             <nav className="p-2 space-y-1">
//                <NavBtn active={activeTab === 'summary'} onClick={()=>setActiveTab('summary')} icon={<ClipboardList size={18}/>} label="الملخص (Summary)" />
//                <NavBtn active={activeTab === 'dental'} onClick={()=>setActiveTab('dental')} icon={<Smile size={18}/>} label="الأسنان (Dental)" />
//                <NavBtn active={activeTab === 'eyes'} onClick={()=>setActiveTab('eyes')} icon={<Eye size={18}/>} label="الرمد (Eyes)" />
//                <NavBtn active={activeTab === 'derm'} onClick={()=>setActiveTab('derm')} icon={<User size={18}/>} label="الجلدية (Skin)" />
//                <NavBtn active={activeTab === 'obgyn'} onClick={()=>setActiveTab('obgyn')} icon={<Baby size={18}/>} label="النساء (OB/GYN)" />
//                <div className="h-px bg-gray-200 my-2"></div>
//                <NavBtn active={activeTab === 'labs'} onClick={()=>setActiveTab('labs')} icon={<Syringe size={18}/>} label="التحاليل (Labs)" />
//                <NavBtn active={activeTab === 'history'} onClick={()=>setActiveTab('history')} icon={<FileText size={18}/>} label="التاريخ الكامل" />
//             </nav>
//          </div>

//          {/* CENTER CONTENT */}
//          <div className="col-span-12 lg:col-span-10 bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-y-auto p-6">
            
//             {/* --- TAB: DENTAL CHART (Interactive) --- */}
//             {activeTab === 'dental' && (
//                <div className="animate-in fade-in slide-in-from-bottom-2">
//                   <div className="flex justify-between items-center mb-6">
//                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Smile className="text-blue-500"/> سجل الأسنان (Odontogram)</h2>
//                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{selectedPatient.specialties.dentistry.gingivalHealth}</Badge>
//                   </div>

//                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-6 overflow-x-auto">
//                      {/* Upper Jaw (1-16) */}
//                      <div className="flex justify-center gap-2 mb-8">
//                         {Array.from({length: 16}, (_, i) => i + 1).map(num => (
//                            <Tooth key={num} number={num} data={selectedPatient.specialties.dentistry.teeth[num as keyof typeof selectedPatient.specialties.dentistry.teeth]} />
//                         ))}
//                      </div>
                     
//                      <div className="text-center text-gray-300 font-bold mb-8">--- الفك العلوي / الفك السفلي ---</div>

//                      {/* Lower Jaw (17-32) */}
//                      <div className="flex justify-center gap-2">
//                         {Array.from({length: 16}, (_, i) => 32 - i).map(num => (
//                            <Tooth key={num} number={num} data={selectedPatient.specialties.dentistry.teeth[num as keyof typeof selectedPatient.specialties.dentistry.teeth]} />
//                         ))}
//                      </div>
//                   </div>

//                   {/* Legend */}
//                   <div className="flex gap-4 justify-center text-sm text-gray-600 mb-6">
//                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-400"></div> سليم</span>
//                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-400"></div> تسوس</span>
//                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-400"></div> حشو</span>
//                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-400"></div> طربوش (Crown)</span>
//                      <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 border border-gray-400 opacity-50"></div> مخلوع</span>
//                   </div>
                  
//                   <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800">
//                      <strong>ملاحظات الطبيب:</strong> {selectedPatient.specialties.dentistry.notes}
//                   </div>
//                </div>
//             )}

//             {/* --- TAB: OPHTHALMOLOGY --- */}
//             {activeTab === 'eyes' && (
//                <div className="animate-in fade-in slide-in-from-bottom-2">
//                   <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Eye className="text-teal-500"/> فحص الرمد (Ophthalmology Exam)</h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
//                      {/* OD (Right Eye) */}
//                      <Card className="border-t-4 border-t-blue-500">
//                         <CardHeader><CardTitle className="text-center">العين اليمنى (OD)</CardTitle></CardHeader>
//                         <CardContent className="space-y-4 text-center">
//                            <div>
//                               <div className="text-sm text-gray-500">Visual Acuity</div>
//                               <div className="text-3xl font-bold text-gray-800">{selectedPatient.specialties.ophthalmology.visualAcuity.od}</div>
//                            </div>
//                            <div className="h-px bg-gray-100"></div>
//                            <div>
//                               <div className="text-sm text-gray-500">Pressure (IOP)</div>
//                               <div className="text-xl font-bold text-gray-800">{selectedPatient.specialties.ophthalmology.iop.od}</div>
//                            </div>
//                         </CardContent>
//                      </Card>
                     
//                      {/* OS (Left Eye) */}
//                      <Card className="border-t-4 border-t-green-500">
//                         <CardHeader><CardTitle className="text-center">العين اليسرى (OS)</CardTitle></CardHeader>
//                         <CardContent className="space-y-4 text-center">
//                            <div>
//                               <div className="text-sm text-gray-500">Visual Acuity</div>
//                               <div className="text-3xl font-bold text-gray-800">{selectedPatient.specialties.ophthalmology.visualAcuity.os}</div>
//                            </div>
//                            <div className="h-px bg-gray-100"></div>
//                            <div>
//                               <div className="text-sm text-gray-500">Pressure (IOP)</div>
//                               <div className="text-xl font-bold text-gray-800">{selectedPatient.specialties.ophthalmology.iop.os}</div>
//                            </div>
//                         </CardContent>
//                      </Card>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                      <h3 className="font-bold mb-2">التشخيص الحالي:</h3>
//                      <p>{selectedPatient.specialties.ophthalmology.diagnosis}</p>
//                   </div>
//                </div>
//             )}

//             {/* --- TAB: SUMMARY (General) --- */}
//             {activeTab === 'summary' && (
//                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
//                   {/* Social History (Epic Style) */}
//                   <div className="col-span-1 lg:col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-wrap gap-6 items-center">
//                      <span className="font-bold text-indigo-900 flex items-center gap-2"><Info size={18}/> Social History:</span>
//                      <div className="flex items-center gap-2 text-sm text-indigo-800"><Cigarette size={16}/> {selectedPatient.history.social.smoking}</div>
//                      <div className="w-px h-4 bg-indigo-200"></div>
//                      <div className="flex items-center gap-2 text-sm text-indigo-800"><Activity size={16}/> {selectedPatient.history.social.exercise}</div>
//                      <div className="w-px h-4 bg-indigo-200"></div>
//                      <div className="flex items-center gap-2 text-sm text-indigo-800"><Briefcase size={16}/> {selectedPatient.occupation}</div>
//                   </div>

//                   {/* Problems List */}
//                   <Card>
//                      <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-700">قائمة المشكلات (Problem List)</CardTitle></CardHeader>
//                      <CardContent>
//                         <ul className="space-y-2">
//                            {selectedPatient.history.medical.map((m,i) => (
//                               <li key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
//                                  <AlertTriangle size={14} className="text-amber-500"/> {m}
//                               </li>
//                            ))}
//                         </ul>
//                      </CardContent>
//                   </Card>

//                   {/* Medications */}
//                   <Card>
//                      <CardHeader className="pb-2"><CardTitle className="text-base font-bold text-gray-700">الأدوية (Medications)</CardTitle></CardHeader>
//                      <CardContent>
//                         <ul className="space-y-2">
//                            {selectedPatient.medications.map((m,i) => (
//                               <li key={i} className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded shadow-sm">
//                                  <div>
//                                     <div className="font-bold text-sm">{m.name} {m.dose}</div>
//                                     <div className="text-xs text-gray-500">{m.freq} - {m.route}</div>
//                                  </div>
//                                  <Badge variant="secondary" className="bg-green-100 text-green-800">{m.status}</Badge>
//                               </li>
//                            ))}
//                         </ul>
//                      </CardContent>
//                   </Card>
//                </div>
//             )}
            
//             {/* --- TAB: OB/GYN --- */}
//             {activeTab === 'obgyn' && (
//                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
//                   <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Baby className="text-pink-500"/> صحة المرأة (OB/GYN)</h2>
                  
//                   <div className="grid grid-cols-4 gap-4">
//                      <Card className="bg-pink-50 border-pink-100">
//                         <CardContent className="p-4 text-center">
//                            <div className="text-sm text-pink-600 font-bold">Gravida (عدد الحمل)</div>
//                            <div className="text-2xl font-bold text-pink-900">{selectedPatient.history.obgyn.gravida}</div>
//                         </CardContent>
//                      </Card>
//                      <Card className="bg-pink-50 border-pink-100">
//                         <CardContent className="p-4 text-center">
//                            <div className="text-sm text-pink-600 font-bold">Para (الولادة)</div>
//                            <div className="text-2xl font-bold text-pink-900">{selectedPatient.history.obgyn.para}</div>
//                         </CardContent>
//                      </Card>
//                      <Card className="bg-pink-50 border-pink-100">
//                         <CardContent className="p-4 text-center">
//                            <div className="text-sm text-pink-600 font-bold">LMP (آخر دورة)</div>
//                            <div className="text-lg font-bold text-pink-900">{selectedPatient.history.obgyn.lmp}</div>
//                         </CardContent>
//                      </Card>
//                      <Card className="bg-pink-50 border-pink-100">
//                         <CardContent className="p-4 text-center">
//                            <div className="text-sm text-pink-600 font-bold">Cycle</div>
//                            <div className="text-lg font-bold text-pink-900">{selectedPatient.history.obgyn.cycle}</div>
//                         </CardContent>
//                      </Card>
//                   </div>

//                   <Card>
//                      <CardHeader><CardTitle>التاريخ الجراحي النسائي</CardTitle></CardHeader>
//                      <CardContent>
//                         <Table>
//                            <TableHeader>
//                               <TableRow>
//                                  <TableHead className="text-right">العملية</TableHead>
//                                  <TableHead className="text-right">السنة</TableHead>
//                                  <TableHead className="text-right">ملاحظات</TableHead>
//                               </TableRow>
//                            </TableHeader>
//                            <TableBody>
//                               {selectedPatient.history.surgical.map((s, i) => (
//                                  <TableRow key={i}>
//                                     <TableCell className="font-medium">{s.proc}</TableCell>
//                                     <TableCell>{s.date}</TableCell>
//                                     <TableCell className="text-gray-500">{s.note}</TableCell>
//                                  </TableRow>
//                               ))}
//                            </TableBody>
//                         </Table>
//                      </CardContent>
//                   </Card>
//                </div>
//             )}

//          </div>
//       </div>
//     </div>
//   );
// }

// // Sub-component for Sidebar Nav
// const NavBtn = ({ active, onClick, icon, label }: any) => (
//    <button 
//       onClick={onClick} 
//       className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all mb-1
//          ${active ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}
//       `}
//    >
//       {icon}
//       {label}
//    </button>
// );


// "use client";

// import React, { useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { 
//   X, Maximize2, Minimize2, Download, Printer, Search, 
//   Activity, Heart, Thermometer, Droplet, User, 
//   Calendar, Phone, MapPin, Mail, AlertCircle, FileText, Pill 
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { useLocale } from "next-intl";
// import { dummyPatients } from "@/lib/dummy-data";

// // --- Helper Components & Functions ---

// function calculateAge(dateOfBirth: string): number {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// // Parsers
// const parseVal = (str: string) => {
//   const matches = str?.match(/\d+(\.\d+)?/);
//   return matches ? parseFloat(matches[0]) : 0;
// };

// // Status Checkers
// const getStatusColor = (val: number, min: number, max: number) => {
//   if (val < min || val > max) return "text-red-600 bg-red-50 border-red-100";
//   return "text-emerald-600 bg-emerald-50 border-emerald-100";
// };

// // --- Main Component ---

// export default function MedicalRecordModalModern() {
//   const patients = dummyPatients;
//   const locale = useLocale();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");
//   const [open, setOpen] = useState(false);
//   const [maximized, setMaximized] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState<typeof dummyPatients[number] | null>(null);
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const [loadingPdf, setLoadingPdf] = useState(false);

//   const filteredPatients = patients.filter((p) =>
//     Object.values(p).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const openModalWithPatient = (patient: typeof dummyPatients[number]) => {
//     setSelectedPatient(patient);
//     setOpen(true);
//     setActiveTab("overview");
//   };

//   // --- Print & Export Handlers ---
//   const handlePrint = () => {
//     if (!contentRef.current) return;
//     const html = contentRef.current.outerHTML;
//     const newWin = window.open("", "_blank", "width=900,height=700");
//     if (!newWin) return;
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>تقرير طبي - ${selectedPatient?.name}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
//             body { font-family: 'Cairo', sans-serif; direction: rtl; background: white; }
//           </style>
//         </head>
//         <body class="p-8">
//           ${html}
//           <script>
//             setTimeout(() => { window.print(); window.close(); }, 800);
//           </script>
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//   };

//   const handleExportPDF = async () => {
//     if (!contentRef.current) return;
//     setLoadingPdf(true);
//     try {
//       const element = contentRef.current;
//       // Temporarily remove shadow and rounded corners for clean PDF
//       element.classList.remove("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.add("bg-white");

//       const canvas = await html2canvas(element, { scale: 2, useCORS: true });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: "p",
//         unit: "mm",
//         format: "a4",
//       });

//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`Medical_Record_${selectedPatient?.id}.pdf`);

//       // Restore classes
//       element.classList.add("shadow-sm", "rounded-xl", "bg-gray-50");
//       element.classList.remove("bg-white");
//     } catch (err) {
//       console.error("PDF Error", err);
//     } finally {
//       setLoadingPdf(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 font-sans bg-gray-50/50 min-h-screen" dir="rtl">
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">سجلات المرضى</h1>
//           <p className="text-gray-500 text-sm mt-1">إدارة الملفات الطبية ومتابعة الحالات</p>
//         </div>
//         <div className="relative w-full md:w-96 group">
//           <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
//           <Input
//             type="search"
//             placeholder="بحث سريع (اسم، هاتف، رقم ملف)..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pr-10 h-11 bg-white border-gray-200 focus:border-blue-500 rounded-xl shadow-sm transition-all"
//           />
//         </div>
//       </div>

//       {/* Main Table Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <Table>
//           <TableHeader className="bg-gray-50/80">
//             <TableRow>
//               <TableHead className="text-right font-semibold text-gray-700">المريض</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">العمر / الجنس</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">رقم الهاتف</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">آخر زيارة</TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">الإجراءات</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((p) => (
//                 <TableRow key={p.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => openModalWithPatient(p)}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
//                         {p.name.charAt(0)}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">{p.name}</div>
//                         <div className="text-xs text-gray-500">#{p.id}</div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col">
//                       <span className="font-medium">{calculateAge(p.dateOfBirth)} سنة</span>
//                       <span className="text-xs text-gray-500">{p.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="font-mono text-gray-600">{p.contactPhone}</TableCell>
//                   <TableCell>
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       {p.lastVisit || "جديد"}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <Button 
//                       onClick={(e) => { e.stopPropagation(); openModalWithPatient(p); }} 
//                       variant="outline" 
//                       size="sm"
//                       className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       فتح الملف
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-32 text-center text-gray-500">
//                   لا توجد نتائج مطابقة للبحث
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* --- Medical Record Modal --- */}
//       {open && selectedPatient && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all" onClick={() => setOpen(false)}>
//           <div
//             className={`bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
//               maximized ? "w-screen h-screen rounded-none" : "w-full max-w-6xl max-h-[90vh]"
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//               <div className="flex items-center gap-4">
//                  <div className="relative">
//                     <img
//                       src={selectedPatient.avatar || `https://ui-avatars.com/api/?name=${selectedPatient.name}&background=0D8ABC&color=fff`}
//                       alt="avatar"
//                       className="h-14 w-14 rounded-full border-4 border-white shadow-sm"
//                     />
//                     <span className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full"></span>
//                  </div>
//                  <div>
//                     <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                       {selectedPatient.name}
//                       <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200 font-normal">
//                          {calculateAge(selectedPatient.dateOfBirth)} سنة
//                       </span>
//                     </h2>
//                     <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
//                       <span className="flex items-center gap-1"><User size={14}/> {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}</span>
//                       <span className="text-gray-300">|</span>
//                       {/* <span className="flex items-center gap-1"><Droplet size={14}/> {selectedPatient.bloodType || "O+"}</span> */}
//                       <span className="text-gray-300">|</span>
//                       <span className="font-mono text-gray-400">ID: {selectedPatient.id}</span>
//                     </div>
//                  </div>
//               </div>

//               <div className="flex items-center gap-2">
//                  <Button variant="ghost" size="icon" onClick={() => setMaximized(!maximized)} className="text-gray-500 hover:bg-gray-100 rounded-full">
//                     {maximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
//                  </Button>
//                  <Button variant="ghost" size="icon" onClick={handlePrint} className="text-gray-500 hover:bg-gray-100 rounded-full">
//                     <Printer size={18} />
//                  </Button>
//                  <Button variant="ghost" size="icon" onClick={handleExportPDF} className="text-gray-500 hover:bg-gray-100 rounded-full">
//                     {loadingPdf ? <span className="animate-spin">⌛</span> : <Download size={18} />}
//                  </Button>
//                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-red-500 hover:bg-red-50 rounded-full">
//                     <X size={20} />
//                  </Button>
//               </div>
//             </div>

//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto p-6" dir="rtl">
//               <div ref={contentRef} className="max-w-6xl mx-auto space-y-6">
                
//                 {/* 1. Vitals Grid (Top Summary) */}
//                 {selectedPatient.generalMedicine?.vitalSigns && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <VitalCard 
//                       title="معدل النبض" 
//                       value={selectedPatient.generalMedicine.vitalSigns.heartRate} 
//                       unit="bpm"
//                       icon={<Activity className="text-rose-500" />} 
//                       min={60} max={100}
//                     />
//                     <VitalCard 
//                       title="ضغط الدم" 
//                       value={selectedPatient.generalMedicine.vitalSigns.bloodPressure} 
//                       unit="mmHg"
//                       icon={<Heart className="text-blue-500" />} 
//                       customCheck={(val) => {
//                          const sys = parseInt(val.split('/')[0]);
//                          return sys > 130 ? 'high' : 'normal';
//                       }}
//                     />
//                     <VitalCard 
//                       title="الحرارة" 
//                       value={selectedPatient.generalMedicine.vitalSigns.temperature} 
//                       unit="°C"
//                       icon={<Thermometer className="text-orange-500" />} 
//                       min={36} max={37.5}
//                     />
//                      <VitalCard 
//                       title="سكر الدم" 
//                       value={selectedPatient.generalMedicine.vitalSigns.glucose} 
//                       unit="mg/dL"
//                       icon={<Droplet className="text-purple-500" />} 
//                       min={70} max={140}
//                     />
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                   {/* Left Sidebar (Profile Info) */}
//                   <div className="lg:col-span-4 space-y-6">
                    
//                     {/* Contact Info Card */}
//                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">بيانات الاتصال</h3>
//                       <div className="space-y-4 text-sm">
//                         <div className="flex items-start gap-3">
//                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Phone size={16}/></div>
//                            <div>
//                              <p className="text-gray-500 text-xs">رقم الهاتف</p>
//                              <p className="font-medium font-mono dir-ltr text-right">{selectedPatient.contactPhone}</p>
//                            </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Mail size={16}/></div>
//                            <div>
//                              <p className="text-gray-500 text-xs">البريد الإلكتروني</p>
//                              <p className="font-medium">{selectedPatient.contactEmail}</p>
//                            </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><MapPin size={16}/></div>
//                            <div>
//                              <p className="text-gray-500 text-xs">العنوان</p>
//                              <p className="font-medium">{selectedPatient.address}</p>
//                            </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Medical Alerts Card */}
//                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">تنبيهات طبية</h3>
//                        <div className="space-y-4">
//                           <div>
//                             <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><AlertCircle size={12}/> الحساسية</p>
//                             <div className="flex flex-wrap gap-2">
//                                {selectedPatient.personalInfo?.allergies?.map((alg, i) => (
//                                  <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium">
//                                    {alg}
//                                  </span>
//                                )) || <span className="text-gray-400 text-xs">لا توجد حساسيات معروفة</span>}
//                             </div>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Activity size={12}/> الأمراض المزمنة</p>
//                             <div className="flex flex-wrap gap-2">
//                                {selectedPatient.personalInfo?.chronicConditions?.map((cond, i) => (
//                                  <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium">
//                                    {cond}
//                                  </span>
//                                )) || <span className="text-gray-400 text-xs">لا توجد أمراض مزمنة</span>}
//                             </div>
//                           </div>
//                        </div>
//                     </div>
//                   </div>

//                   {/* Right Content (Tabs) */}
//                   <div className="lg:col-span-8">
//                      {/* Modern Tabs Navigation */}
//                      <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm mb-6 flex overflow-x-auto gap-1">
//                         {['overview', 'labs', 'cardio', 'radiology'].map((tab) => {
//                           const labels: Record<string, string> = { overview: "نظرة عامة", labs: "التحاليل", cardio: "القلب", radiology: "الأشعة" };
//                           const isActive = activeTab === tab;
//                           return (
//                             <button
//                               key={tab}
//                               onClick={() => setActiveTab(tab)}
//                               className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                                 isActive 
//                                 ? "bg-blue-600 text-white shadow-md" 
//                                 : "text-gray-600 hover:bg-gray-100"
//                               }`}
//                             >
//                               {labels[tab]}
//                             </button>
//                           )
//                         })}
//                      </div>

//                      {/* Tab Content */}
//                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] p-6">
                        
//                         {/* OVERVIEW TAB */}
//                         {activeTab === 'overview' && (
//                            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
//                               {/* Active Diagnoses */}
//                               <section>
//                                  <h4 className="flex items-center gap-2 font-bold text-gray-800 text-lg mb-4">
//                                     <FileText className="text-blue-500" size={20}/>
//                                     التشخيصات النشطة
//                                  </h4>
//                                  <div className="grid gap-3">
//                                     {selectedPatient.generalMedicine?.diagnoses?.map((diag, i) => (
//                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
//                                           <div>
//                                              <p className="font-semibold text-gray-900">{diag.description}</p>
//                                              <p className="text-xs text-gray-500 mt-1">Code: {diag.code}</p>
//                                           </div>
//                                           <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
//                                        </div>
//                                     ))}
//                                  </div>
//                               </section>

//                               {/* Medications */}
//                               <section>
//                                  <h4 className="flex items-center gap-2 font-bold text-gray-800 text-lg mb-4">
//                                     <Pill className="text-purple-500" size={20}/>
//                                     الأدوية الحالية
//                                  </h4>
//                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                     {selectedPatient.generalMedicine?.medications?.map((med, i) => (
//                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50/50">
//                                           <div className="bg-white p-2 rounded-lg shadow-sm text-purple-600">
//                                              <Pill size={16}/>
//                                           </div>
//                                           <div>
//                                              <p className="font-medium text-gray-900">{med}</p>
//                                              <p className="text-xs text-gray-500">حبة واحدة يومياً بعد الأكل</p>
//                                           </div>
//                                        </div>
//                                     ))}
//                                  </div>
//                               </section>

//                               {/* Visit Timeline */}
//                               <section>
//                                  <h4 className="flex items-center gap-2 font-bold text-gray-800 text-lg mb-4">
//                                     <Calendar className="text-orange-500" size={20}/>
//                                     سجل الزيارات
//                                  </h4>
//                                  <div className="relative border-r border-gray-200 mr-3 space-y-6 pr-6">
//                                     {selectedPatient.visitNotes?.map((visit, i) => (
//                                        <div key={i} className="relative">
//                                           <div className="absolute -right-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
//                                           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
//                                              <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{visit.date}</span>
//                                              <span className="text-xs text-gray-500 mt-1 sm:mt-0">د. {visit.doctorName}</span>
//                                           </div>
//                                           <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600 leading-relaxed">
//                                              {visit.notes}
//                                           </div>
//                                        </div>
//                                     ))}
//                                  </div>
//                               </section>
//                            </div>
//                         )}

//                         {/* LABS TAB */}
//                         {activeTab === 'labs' && (
//                            <div className="animate-in fade-in zoom-in-95 duration-300">
//                               <h4 className="font-bold text-gray-800 text-lg mb-6">نتائج المختبر</h4>
//                               <div className="overflow-x-auto rounded-xl border border-gray-200">
//                                  <table className="w-full text-right text-sm">
//                                     <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
//                                        <tr>
//                                           <th className="p-4">اسم الفحص</th>
//                                           <th className="p-4">النتيجة</th>
//                                           <th className="p-4">المعدل الطبيعي</th>
//                                           <th className="p-4">التاريخ</th>
//                                        </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                        {selectedPatient.labTests?.map((test, i) => {
//                                           const val = parseVal(test.result);
//                                           const isHigh = val > 100; // Simplified logic for demo
//                                           return (
//                                              <tr key={i} className="hover:bg-gray-50/80">
//                                                 <td className="p-4 font-medium text-gray-900">{test.testName}</td>
//                                                 <td className="p-4">
//                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isHigh ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//                                                       {test.result} {test.unit}
//                                                    </span>
//                                                 </td>
//                                                 <td className="p-4 text-gray-500">{test.range || "-"}</td>
//                                                 {/* <td className="p-4 text-gray-400">{test.date || "2023-10-01"}</td> */}
//                                              </tr>
//                                           )
//                                        })}
//                                     </tbody>
//                                  </table>
//                               </div>
//                            </div>
//                         )}

//                         {/* RADIOLOGY & CARDIO (Placeholders for demo) */}
//                         {(activeTab === 'cardio' || activeTab === 'radiology') && (
//                            <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in zoom-in-95 duration-300">
//                               <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
//                                  {activeTab === 'cardio' ? <Heart size={32}/> : <FileText size={32}/>}
//                               </div>
//                               <h3 className="text-lg font-medium text-gray-900">
//                                  {activeTab === 'cardio' ? 'معلومات القلب' : 'تقارير الأشعة'}
//                               </h3>
//                               <p className="text-gray-500 max-w-sm mt-2">
//                                  سيتم عرض التفاصيل والتقارير والصور الخاصة بهذا القسم هنا بتصميم معرض صور (Gallery) تفاعلي.
//                               </p>
//                            </div>
//                         )}
//                      </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // --- Sub-Components ---

// const VitalCard = ({ 
//   title, 
//   value, 
//   unit, 
//   icon, 
//   min = 0, 
//   max = 1000,
//   customCheck
// }: { 
//   title: string, 
//   value?: string, 
//   unit?: string, 
//   icon: React.ReactNode,
//   min?: number,
//   max?: number,
//   customCheck?: (val: string) => string
// }) => {
//   if (!value) return null;
  
//   const numVal = parseVal(value);
//   let statusClass = "text-gray-600 bg-gray-50 border-gray-100";
  
//   if (customCheck) {
//      const status = customCheck(value);
//      statusClass = status === 'high' ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100";
//   } else {
//      statusClass = getStatusColor(numVal, min, max);
//   }

//   return (
//     <div className={`p-4 rounded-xl border ${statusClass.split(' ')[2]} ${statusClass.split(' ')[1]} flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02]`}>
//        <div>
//           <p className="text-xs text-gray-500 mb-1 font-medium">{title}</p>
//           <div className="flex items-end gap-1">
//              <span className={`text-2xl font-bold ${statusClass.split(' ')[0]}`}>{value}</span>
//              <span className="text-xs text-gray-400 mb-1">{unit}</span>
//           </div>
//        </div>
//        <div className={`p-2 rounded-full bg-white bg-opacity-60 shadow-sm`}>
//           {icon}
//        </div>
//     </div>
//   );
// };


// "use client";

// import React, { useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { 
//   X, Maximize2, Minimize2, Download, Printer, Search, 
//   Activity, Heart, Thermometer, Droplet, User, 
//   Calendar, Phone, MapPin, Mail, AlertCircle, FileText, Pill,
//   Stethoscope, Eye, Bone, Brain, Syringe, Scan
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";

// // --- 1. THE MASSIVE DATASET (Comprehensive Medical History) ---
// const massiveDummyData = [
//   {
//     id: "PAT-2025-001",
//     name: "الحاج/ أحمد عبد الموجود السيد",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     dateOfBirth: "1958-04-12", // 67 Years old
//     gender: "Male",
//     bloodType: "A+",
//     contactPhone: "+20 123 456 7890",
//     contactEmail: "ahmed.abdelmawgod@example.com",
//     address: "12 شارع البحر، طنطا، الغربية",
//     insuranceProvider: "التأمين الصحي الحكومي",
//     lastVisit: "2024-12-01",
    
//     // Core Medical Profile
//     vitalSigns: {
//       heartRate: "88",      // High normal
//       bloodPressure: "145/90", // Hypertension Stage 2
//       temperature: "37.1",
//       glucose: "185",       // High (Random)
//       spO2: "96",
//       respiratoryRate: "18",
//       weight: "92",
//       height: "175",
//       bmi: "30.0"           // Obese
//     },

//     // Comprehensive History
//     medicalHistory: {
//       chronicConditions: [
//         "مرض السكري من النوع الثاني (Type 2 DM) - منذ 15 سنة",
//         "ارتفاع ضغط الدم (Hypertension) - منذ 10 سنوات",
//         "قصور الشريان التاجي (CAD)",
//         "خشونة الركبة (Osteoarthritis)"
//       ],
//       surgeries: [
//         { procedure: "قسطرة قلبية وتركيب دعامة (PCI)", year: "2018", hospital: "مركز القلب بالمحلة" },
//         { procedure: "استئصال الزائدة الدودية", year: "1995", hospital: "مستشفى الجامعة" },
//         { procedure: "إزالة المياه البيضاء (عين يمنى)", year: "2022", hospital: "مستشفى الرمد" }
//       ],
//       familyHistory: [
//         "الأب: توفي بأزمة قلبية (MI) في عمر 60",
//         "الأم: كانت تعاني من السكري والفشل الكلوي"
//       ],
//       allergies: ["البنسلين (Penicillin)", "الفراولة", "صبغة الأشعة (Contrast Media)"],
//       vaccinations: ["لقاح الإنفلونزا الموسمية (2024)", "لقاح كورونا (3 جرعات)"],
//       lifestyle: {
//         smoking: "مدخن سابق (أقلع منذ 2018)",
//         alcohol: "لا يتعاطى",
//         activity: "نشاط بدني محدود بسبب آلام الركبة"
//       }
//     },

//     // Current Medications (Polypharmacy Case)
//     medications: [
//       { name: "Metformin XR", dose: "1000mg", freq: "مرتين يومياً", indication: "السكري" },
//       { name: "Aspirin Protect", dose: "100mg", freq: "مرة يومياً", indication: "سيولة الدم" },
//       { name: "Atorvastatin", dose: "40mg", freq: "مساءً", indication: "الكوليسترول" },
//       { name: "Bisoprolol", dose: "5mg", freq: "صباحاً", indication: "الضغط والقلب" },
//       { name: "Pantoprazole", dose: "40mg", freq: "قبل الفطار", indication: "حماية المعدة" }
//     ],

//     // Specialized Data Blocks
//     specialties: {
//       internalMedicine: {
//         diagnosis: ["Uncontrolled Diabetes", "Hyperlipidemia"],
//         notes: "المريض يعاني من عدم انتظام في السكر التراكمي. تم تعديل جرعة الميتفورمين. يحتاج لحمية غذائية صارمة.",
//         doctor: "د. محمد الباطني"
//       },
//       cardiology: {
//         diagnosis: ["Ischemic Heart Disease", "Left Ventricular Hypertrophy"],
//         echoReport: "EF: 55%, Mild MR, Grade 1 Diastolic Dysfunction.",
//         ecgResult: "Sinus Rhythm with LVH criteria. No acute ST changes.",
//         doctor: "د. إبراهيم القلب"
//       },
//       orthopedics: {
//         diagnosis: ["Advanced OA (Right Knee)", "Chronic Lower Back Pain"],
//         notes: "خشونة متقدمة في الركبة اليمنى. ينصح بالعلاج الطبيعي والحقن الموضعي (Hyaluronic acid).",
//         xray: "تآكل في الغضروف المفصلي للركبة اليمنى، ووجود نتوءات عظمية (Osteophytes).",
//         doctor: "د. علي العظام"
//       },
//       ophthalmology: {
//         diagnosis: ["Diabetic Retinopathy (Background)", "Post-Cataract Surgery (OD)"],
//         vision: "R: 6/9 (IOL), L: 6/18",
//         notes: "وجود تغيرات بالشبكية نتيجة السكري. يحتاج متابعة دورية وقاع عين كل 6 أشهر.",
//         doctor: "د. سارة الرمد"
//       },
//       neurology: {
//         diagnosis: ["Diabetic Neuropathy (Peripheral)"],
//         symptoms: "تنميل وحرقة في القدمين (Glove and Stocking sensation).",
//         reflexes: "Ankle jerk reflex: Absent bilateral.",
//         doctor: "د. محمود الأعصاب"
//       }
//     },

//     // Extensive Labs
//     labs: [
//       { category: "Hematology", test: "Hemoglobin (Hb)", result: "13.5", unit: "g/dL", range: "13-17", status: "normal", date: "2024-11-28" },
//       { category: "Hematology", test: "WBCs", result: "6.5", unit: "K/uL", range: "4-11", status: "normal", date: "2024-11-28" },
//       { category: "Chemistry", test: "HbA1c", result: "8.2", unit: "%", range: "< 5.7", status: "high", date: "2024-11-28" },
//       { category: "Chemistry", test: "Fasting Glucose", result: "160", unit: "mg/dL", range: "70-100", status: "high", date: "2024-11-28" },
//       { category: "Chemistry", test: "Creatinine", result: "1.2", unit: "mg/dL", range: "0.7-1.3", status: "normal", date: "2024-11-28" },
//       { category: "Lipids", test: "Total Cholesterol", result: "240", unit: "mg/dL", range: "< 200", status: "high", date: "2024-11-28" },
//       { category: "Lipids", test: "LDL", result: "160", unit: "mg/dL", range: "< 100", status: "high", date: "2024-11-28" },
//       { category: "Liver", test: "ALT", result: "35", unit: "U/L", range: "0-40", status: "normal", date: "2024-11-28" }
//     ],

//     // Visits Timeline
//     visits: [
//       { date: "2024-12-01", type: "Follow-up", dept: "باطنة", doctor: "د. محمد", notes: "متابعة السكر والضغط. الضغط ما زال مرتفعاً." },
//       { date: "2024-11-15", type: "Complaint", dept: "عظام", doctor: "د. علي", notes: "ألم شديد بالركبة اليمنى مع المشي." },
//       { date: "2024-10-05", type: "Routine", dept: "قلب", doctor: "د. إبراهيم", notes: "عمل موجات صوتية (Echo) للاطمئنان على كفاءة العضلة." }
//     ]
//   },
//   // ... ممكن تضيف مرضى تانيين بنفس الهيكل
// ];

// // --- Helper Functions ---
// function calculateAge(dateOfBirth: string) {
//   return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
// }

// export default function MedicalRecordUltimate() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPatient, setSelectedPatient] = useState<typeof massiveDummyData[number] | null>(null);
//   const [open, setOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("general"); // general, history, specialties, labs, meds
//   const [specialtyFilter, setSpecialtyFilter] = useState("all");

//   const filteredPatients = massiveDummyData.filter(p => p.name.includes(searchTerm) || p.contactPhone.includes(searchTerm));

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans text-right" dir="rtl">
      
//       {/* Header & Search */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//         <div>
//            <h1 className="text-3xl font-bold text-gray-900">نظام السجلات الطبية الموحد</h1>
//            <p className="text-gray-500 mt-1">عرض شامل للتاريخ المرضي وكافة التخصصات</p>
//         </div>
//         <div className="relative w-full md:w-96">
//           <Search className="absolute right-3 top-3 text-gray-400" size={20} />
//           <Input 
//             className="pr-10 h-12 text-lg" 
//             placeholder="بحث بالاسم أو الرقم القومي..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Patient List Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
//         <Table>
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="text-right">المريض</TableHead>
//               <TableHead className="text-right">العمر / الجنس</TableHead>
//               <TableHead className="text-right">التشخيصات الرئيسية</TableHead>
//               <TableHead className="text-right">الإجراء</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredPatients.map(patient => (
//               <TableRow key={patient.id} className="cursor-pointer hover:bg-blue-50" onClick={() => { setSelectedPatient(patient); setOpen(true); }}>
//                 <TableCell className="font-medium">
//                   <div className="flex items-center gap-3">
//                     <img src={patient.avatar} className="w-10 h-10 rounded-full" alt="" />
//                     <div>
//                       <div>{patient.name}</div>
//                       <div className="text-xs text-gray-500">{patient.id}</div>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>{calculateAge(patient.dateOfBirth)} سنة / {patient.gender === 'Male' ? 'ذكر' : 'أنثى'}</TableCell>
//                 <TableCell>
//                   <div className="flex flex-wrap gap-1">
//                     {patient.medicalHistory.chronicConditions.slice(0, 2).map((c, i) => (
//                       <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 truncate max-w-[150px]">{c}</span>
//                     ))}
//                     {patient.medicalHistory.chronicConditions.length > 2 && <span className="text-xs text-gray-400">+{patient.medicalHistory.chronicConditions.length - 2}</span>}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <Button size="sm" variant="outline">عرض الملف الكامل</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* --- MODAL FOR FULL RECORD --- */}
//       {open && selectedPatient && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
//           <div className="bg-white w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            
//             {/* Modal Header */}
//             <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
//                <div className="flex gap-5">
//                   <div className="relative">
//                     <img src={selectedPatient.avatar} className="w-20 h-20 rounded-xl border-4 border-slate-700 shadow-lg" alt="" />
//                     <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold ${selectedPatient.vitalSigns.bmi > "25" ? "bg-orange-500" : "bg-green-500"}`}>
//                        BMI: {selectedPatient.vitalSigns.bmi}
//                     </span>
//                   </div>
//                   <div>
//                      <h2 className="text-2xl font-bold flex items-center gap-2">
//                         {selectedPatient.name} 
//                         <span className="text-sm font-normal text-slate-400 px-2 border border-slate-700 rounded-full">{calculateAge(selectedPatient.dateOfBirth)} سنة</span>
//                      </h2>
//                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-300">
//                         <span className="flex items-center gap-1"><Droplet size={14} className="text-red-400"/> {selectedPatient.bloodType}</span>
//                         <span className="flex items-center gap-1"><MapPin size={14}/> {selectedPatient.address}</span>
//                         <span className="flex items-center gap-1"><Phone size={14}/> {selectedPatient.contactPhone}</span>
//                         <span className="flex items-center gap-1"><Scan size={14}/> {selectedPatient.insuranceProvider}</span>
//                      </div>
//                   </div>
//                </div>
//                <Button variant="ghost" className="text-white hover:bg-slate-800" onClick={() => setOpen(false)}><X /></Button>
//             </div>

//             {/* Vitals Ribbon */}
//             <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex overflow-x-auto gap-6 whitespace-nowrap scrollbar-hide">
//                <VitalItem label="ضغط الدم" value={selectedPatient.vitalSigns.bloodPressure} unit="mmHg" icon={<Activity size={16} className="text-blue-600"/>} alert={true} />
//                <VitalItem label="النبض" value={selectedPatient.vitalSigns.heartRate} unit="bpm" icon={<Heart size={16} className="text-red-600"/>} />
//                <VitalItem label="السكر (عشوائي)" value={selectedPatient.vitalSigns.glucose} unit="mg/dL" icon={<Droplet size={16} className="text-purple-600"/>} alert={true} />
//                <VitalItem label="الأكسجين" value={selectedPatient.vitalSigns.spO2} unit="%" icon={<Activity size={16} className="text-green-600"/>} />
//                <VitalItem label="الحرارة" value={selectedPatient.vitalSigns.temperature} unit="°C" icon={<Thermometer size={16} className="text-orange-600"/>} />
//                <VitalItem label="الوزن" value={selectedPatient.vitalSigns.weight} unit="kg" icon={<User size={16} className="text-gray-600"/>} />
//             </div>

//             {/* Main Content Layout */}
//             <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-gray-50">
               
//                {/* Sidebar Tabs */}
//                <div className="w-full lg:w-64 bg-white border-l border-gray-200 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible shrink-0">
//                   <NavButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<FileText size={18}/>} label="نظرة عامة" />
//                   <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Calendar size={18}/>} label="التاريخ الطبي والجراحي" />
//                   <NavButton active={activeTab === 'specialties'} onClick={() => setActiveTab('specialties')} icon={<Stethoscope size={18}/>} label="سجلات التخصصات" />
//                   <NavButton active={activeTab === 'labs'} onClick={() => setActiveTab('labs')} icon={<Syringe size={18}/>} label="التحاليل والأشعة" />
//                   <NavButton active={activeTab === 'meds'} onClick={() => setActiveTab('meds')} icon={<Pill size={18}/>} label="الأدوية الحالية" />
//                </div>

//                {/* Scrollable Area */}
//                <div className="flex-1 overflow-y-auto p-6">
                  
//                   {/* TAB: GENERAL */}
//                   {activeTab === 'general' && (
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
//                         {/* Warnings */}
//                         <div className="bg-red-50 border border-red-100 rounded-xl p-5">
//                            <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3"><AlertCircle size={20}/> تنبيهات هامة</h3>
//                            <div className="space-y-2">
//                               <div>
//                                  <span className="text-xs font-bold text-red-600 uppercase">حساسية:</span>
//                                  <div className="flex flex-wrap gap-2 mt-1">
//                                     {selectedPatient.medicalHistory.allergies.map((a,i) => <span key={i} className="bg-white border border-red-200 text-red-700 px-2 py-1 rounded text-sm">{a}</span>)}
//                                  </div>
//                               </div>
//                               <div className="mt-2">
//                                  <span className="text-xs font-bold text-red-600 uppercase">أمراض مزمنة نشطة:</span>
//                                  <ul className="list-disc list-inside text-sm text-red-900 mt-1">
//                                     {selectedPatient.medicalHistory.chronicConditions.map((c,i) => <li key={i}>{c}</li>)}
//                                  </ul>
//                               </div>
//                            </div>
//                         </div>

//                         {/* Recent Visits */}
//                         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><Calendar size={20}/> أحدث الزيارات</h3>
//                            <div className="space-y-4">
//                               {selectedPatient.visits.map((v, i) => (
//                                  <div key={i} className="flex gap-3 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
//                                     <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-lg flex items-center justify-center flex-col shrink-0">
//                                        <span className="text-xs font-bold">{v.date.split('-')[2]}</span>
//                                        <span className="text-[10px]">{v.date.split('-')[1]}</span>
//                                     </div>
//                                     <div>
//                                        <div className="flex items-center gap-2">
//                                           <span className="font-bold text-sm text-gray-900">{v.dept}</span>
//                                           <span className="text-xs text-gray-500">({v.doctor})</span>
//                                        </div>
//                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{v.notes}</p>
//                                     </div>
//                                  </div>
//                               ))}
//                            </div>
//                         </div>
//                      </div>
//                   )}

//                   {/* TAB: SPECIALTIES (The Complex Part) */}
//                   {activeTab === 'specialties' && (
//                      <div className="animate-in fade-in slide-in-from-bottom-2">
//                         <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//                            {Object.keys(selectedPatient.specialties).map(key => (
//                               <button 
//                                  key={key}
//                                  onClick={() => setSpecialtyFilter(key)}
//                                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${specialtyFilter === key ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
//                               >
//                                  {key === 'internalMedicine' ? 'الباطنة' : 
//                                   key === 'cardiology' ? 'القلب' : 
//                                   key === 'orthopedics' ? 'العظام' : 
//                                   key === 'ophthalmology' ? 'الرمد' : 
//                                   key === 'neurology' ? 'المخ والأعصاب' : key}
//                               </button>
//                            ))}
//                            <button onClick={() => setSpecialtyFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${specialtyFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border'}`}>الكل</button>
//                         </div>

//                         <div className="grid grid-cols-1 gap-6">
//                            {Object.entries(selectedPatient.specialties).map(([key, data]: [string, any]) => {
//                               if (specialtyFilter !== 'all' && specialtyFilter !== key) return null;
                              
//                               return (
//                                  <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                                     <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
//                                        <h3 className="font-bold text-lg text-blue-900 uppercase flex items-center gap-2">
//                                           {key === 'cardiology' && <Heart size={18} />}
//                                           {key === 'orthopedics' && <Bone size={18} />}
//                                           {key === 'neurology' && <Brain size={18} />}
//                                           {key === 'ophthalmology' && <Eye size={18} />}
//                                           {key}
//                                        </h3>
//                                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">{data.doctor}</span>
//                                     </div>
//                                     <div className="p-6 grid md:grid-cols-2 gap-6">
//                                        <div>
//                                           <h4 className="text-sm font-bold text-gray-500 mb-2">التشخيص</h4>
//                                           <ul className="list-disc list-inside text-gray-900 font-medium">
//                                              {data.diagnosis?.map((d: string, i: number) => <li key={i}>{d}</li>)}
//                                           </ul>
//                                        </div>
                                       
//                                        <div className="space-y-3">
//                                           {data.echoReport && (
//                                              <div className="bg-blue-50 p-3 rounded-lg text-sm border border-blue-100">
//                                                 <span className="font-bold text-blue-800 block mb-1">تقرير الإيكو:</span>
//                                                 {data.echoReport}
//                                              </div>
//                                           )}
//                                           {data.xray && (
//                                              <div className="bg-gray-100 p-3 rounded-lg text-sm border border-gray-200">
//                                                 <span className="font-bold text-gray-800 block mb-1">الأشعة:</span>
//                                                 {data.xray}
//                                              </div>
//                                           )}
//                                           {data.vision && (
//                                              <div className="bg-green-50 p-3 rounded-lg text-sm border border-green-100">
//                                                 <span className="font-bold text-green-800 block mb-1">قياس النظر:</span>
//                                                 {data.vision}
//                                              </div>
//                                           )}
//                                           {data.notes && (
//                                              <div>
//                                                 <span className="text-sm font-bold text-gray-500">ملاحظات:</span>
//                                                 <p className="text-sm text-gray-700">{data.notes}</p>
//                                              </div>
//                                           )}
//                                        </div>
//                                     </div>
//                                  </div>
//                               );
//                            })}
//                         </div>
//                      </div>
//                   )}

//                   {/* TAB: LABS */}
//                   {activeTab === 'labs' && (
//                      <div className="animate-in fade-in slide-in-from-bottom-2">
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                            <Table>
//                               <TableHeader>
//                                  <TableRow className="bg-gray-50">
//                                     <TableHead className="text-right">الفئة</TableHead>
//                                     <TableHead className="text-right">الاختبار</TableHead>
//                                     <TableHead className="text-center">النتيجة</TableHead>
//                                     <TableHead className="text-center">المعدل الطبيعي</TableHead>
//                                     <TableHead className="text-center">الحالة</TableHead>
//                                  </TableRow>
//                               </TableHeader>
//                               <TableBody>
//                                  {selectedPatient.labs.map((test, i) => (
//                                     <TableRow key={i} className="hover:bg-gray-50">
//                                        <TableCell className="font-medium text-gray-500 text-xs uppercase">{test.category}</TableCell>
//                                        <TableCell className="font-bold text-gray-800">{test.test}</TableCell>
//                                        <TableCell className="text-center text-lg font-mono">
//                                           {test.result} <span className="text-xs text-gray-400">{test.unit}</span>
//                                        </TableCell>
//                                        <TableCell className="text-center text-gray-500 font-mono text-sm">{test.range}</TableCell>
//                                        <TableCell className="text-center">
//                                           {test.status === 'high' ? (
//                                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">مرتفع</span>
//                                           ) : test.status === 'low' ? (
//                                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold border border-yellow-200">منخفض</span>
//                                           ) : (
//                                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold border border-green-200">طبيعي</span>
//                                           )}
//                                        </TableCell>
//                                     </TableRow>
//                                  ))}
//                               </TableBody>
//                            </Table>
//                         </div>
//                      </div>
//                   )}

//                   {/* TAB: MEDS */}
//                   {activeTab === 'meds' && (
//                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2">
//                         {selectedPatient.medications.map((med, i) => (
//                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
//                               <div>
//                                  <div className="flex justify-between items-start mb-2">
//                                     <h4 className="font-bold text-lg text-blue-900">{med.name}</h4>
//                                     <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg"><Pill size={16}/></span>
//                                  </div>
//                                  <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded block w-fit">
//                                     {med.indication}
//                                  </div>
//                               </div>
//                               <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
//                                  <span className="font-bold text-gray-800">{med.dose}</span>
//                                  <span className="text-gray-600">{med.freq}</span>
//                               </div>
//                            </div>
//                         ))}
//                      </div>
//                   )}

//                    {/* TAB: HISTORY */}
//                    {activeTab === 'history' && (
//                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
//                         {/* Surgeries */}
//                         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity size={20} className="text-purple-600"/> العمليات الجراحية</h3>
//                            <div className="space-y-3">
//                               {selectedPatient.medicalHistory.surgeries.map((s, i) => (
//                                  <div key={i} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-100">
//                                     <span className="font-medium text-purple-900">{s.procedure}</span>
//                                     <div className="text-sm text-purple-600 flex gap-4">
//                                        <span>{s.hospital}</span>
//                                        <span className="font-bold bg-white px-2 rounded border border-purple-200">{s.year}</span>
//                                     </div>
//                                  </div>
//                               ))}
//                            </div>
//                         </div>

//                         {/* Family History */}
//                         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><User size={20} className="text-blue-600"/> التاريخ العائلي</h3>
//                            <ul className="space-y-2">
//                               {selectedPatient.medicalHistory.familyHistory.map((h, i) => (
//                                  <li key={i} className="flex items-start gap-2 text-gray-700">
//                                     <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
//                                     {h}
//                                  </li>
//                               ))}
//                            </ul>
//                         </div>
//                      </div>
//                    )}
//                </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // --- Sub-components ---
// const VitalItem = ({ label, value, unit, icon, alert }: any) => (
//    <div className={`inline-flex flex-col items-start min-w-[120px] p-3 rounded-xl border ${alert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
//       <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">{icon} {label}</span>
//       <div className="flex items-baseline gap-1">
//          <span className={`text-xl font-bold ${alert ? 'text-red-700' : 'text-gray-800'}`}>{value}</span>
//          <span className="text-xs text-gray-400">{unit}</span>
//       </div>
//    </div>
// );

// const NavButton = ({ active, onClick, icon, label }: any) => (
//    <button 
//       onClick={onClick} 
//       className={`flex items-center gap-3 p-4 w-full text-sm font-medium transition-all
//          ${active ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-r-4 border-transparent'}
//       `}
//    >
//       {icon}
//       {label}
//    </button>
// );

//Old not responcive version



// "use client";

// import React, { useRef, useState } from "react";
// import { Button } from "@/components/ui/button"; // أو استخدم زر html عادي
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { X, Maximize2, Minimize2, Download, Printer } from "lucide-react";
// import { Search} from "lucide-react";
// import { dummyPatients } from "@/lib/dummy-data";


// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { useLocale } from "next-intl";




// // const maleBodyImg = "/bodies/m.png";
// // const femaleBodyImg = "/bodies/f.png";

// export default function MedicalRecordModalExample() {
//   const patients = dummyPatients;
//   const locale = useLocale()
//   const [searchTerm, setSearchTerm] = useState("");
//   // const [search, setSearch] = useState("");
//   const [activeTab, setActiveTab] = useState('الملف الطبي العام');
//   // const [sortKey, setSortKey] = useState<keyof typeof dummyPatients[number] | null>(null);
//   // const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [open, setOpen] = useState(false);
//   const [maximized, setMaximized] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState<typeof dummyPatients[number] | null>(null);

//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const [loadingPdf, setLoadingPdf] = useState(false);


// // فلترة على كل بيانات المريض
//   const filteredPatients = patients.filter((p) =>
//     Object.values(p).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   // //  ⬆️⬇️ فرز
//   // const sortedPatients = [...filteredPatients].sort((a, b) => {
//   //   if (!sortKey) return 0;
//   //   const aVal = a[sortKey] as any;
//   //   const bVal = b[sortKey] as any;
//   //   if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
//   //   if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
//   //   return 0;
//   // });


//   // const handleSort = (key: keyof typeof dummyPatients[number]) => {
//   //   if (sortKey === key) {
//   //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//   //   } else {
//   //     setSortKey(key);
//   //     setSortOrder("asc");
//   //   }
//   // };



//   // فتح المودال مع تحديد المريض
//   const openModalWithPatient = (patient: typeof dummyPatients[number]) => {
//     setSelectedPatient(patient);
//     setOpen(true);
//   };

//   const handlePrint = () => {
//     if (!contentRef.current) return;
//     const html = contentRef.current.outerHTML;
//     const newWin = window.open("", "_blank", "width=900,height=700");
//     if (!newWin) return;
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>طباعة السجل الطبي</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
//             body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 10px; }
//             .record-container { width: 100%; }
//           </style>
//         </head>
//         <body>
//           ${html}
//           <script>
//             setTimeout(() => { window.print(); setTimeout(()=>window.close(), 200); }, 500);
//           </script>
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//   };

//   const handleExportPDF = async () => {
//     if (!contentRef.current) return;
//     setLoadingPdf(true);
//     try {
//       const element = contentRef.current;
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         windowWidth: element.scrollWidth,
//         windowHeight: element.scrollHeight,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: canvas.width > canvas.height ? "landscape" : "portrait",
//         unit: "px",
//         format: [canvas.width, canvas.height],
//       });

//       const imgProps = { width: canvas.width, height: canvas.height };
//       // const pdfPageWidth = pdf.internal.pageSize.getWidth();
//       const pdfPageHeight = pdf.internal.pageSize.getHeight();

//       if (imgProps.height <= pdfPageHeight) {
//         pdf.addImage(imgData, "PNG", 0, 0, imgProps.width, imgProps.height);
//       } else {
//         let heightLeft = imgProps.height;
//         let position = 0;
//         while (heightLeft > 0) {
//           pdf.addImage(imgData, "PNG", 0, -position, imgProps.width, imgProps.height);
//           heightLeft -= pdfPageHeight;
//           position += pdfPageHeight;
//           if (heightLeft > 0) pdf.addPage();
//         }
//       }

//       pdf.save(`السجل_الطبي_${selectedPatient?.name || "مريض"}.pdf`);
//     } catch (err) {
//       console.error("Error exporting PDF", err);
//       alert("حدث خطأ أثناء إنشاء PDF.");
//     } finally {
//       setLoadingPdf(false);
//     }
//   };

//   function calculateAge(dateOfBirth: string): number {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();

//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }


// // دوال مساعدة لمعالجة البيانات
// // const calculateAge = (dateOfBirth: string): number => {
// //   const birthDate = new Date(dateOfBirth);
// //   const today = new Date();
// //   let age = today.getFullYear() - birthDate.getFullYear();
// //   const monthDiff = today.getMonth() - birthDate.getMonth();
  
// //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
// //     age--;
// //   }
  
// //   return age;
// // };

// const parseHeartRate = (heartRate: string): number => {
//   // استخراج الأرقام من النص
//   const matches = heartRate.match(/\d+/);
//   return matches ? parseInt(matches[0]) : 0;
// };

// const getHeartRateStatus = (patient: typeof dummyPatients[number]): string => {
//   if (!patient.generalMedicine?.vitalSigns?.heartRate) return 'normal';
//   const hr = parseHeartRate(patient.generalMedicine.vitalSigns.heartRate);
//   return hr > 100 ? 'high' : 'normal';
// };

// const parseSystolicBloodPressure = (bp: string): number => {
//   const matches = bp.match(/\d+/);
//   return matches ? parseInt(matches[0]) : 0;
// };

// const getBloodPressureStatus = (bp: string): string => {
//   const systolic = parseSystolicBloodPressure(bp);
//   return systolic > 130 ? 'high' : 'normal';
// };

// const parseGlucose = (glucose: string): number => {
//   const matches = glucose.match(/\d+/);
//   return matches ? parseInt(matches[0]) : 0;
// };

// const getGlucoseStatus = (glucose: string): string => {
//   const value = parseGlucose(glucose);
//   return value > 140 ? 'high' : 'normal';
// };

// const parseTemperature = (temp: string): number => {
//   const matches = temp.match(/\d+(\.\d+)?/);
//   return matches ? parseFloat(matches[0]) : 0;
// };

// const getTemperatureStatus = (temp: string): string => {
//   const value = parseTemperature(temp);
//   return value > 37.5 ? 'high' : 'normal';
// };

// const isTestResultNormal = (test: { result: string; range?: string }): boolean => {
//   if (!test.range) return true;
  
//   // معالجة النطاقات المختلفة (مثل "70-110" أو "<140")
//   if (test.range.includes('-')) {
//     const [min, max] = test.range.split('-').map(val => parseFloat(val));
//     const resultValue = parseFloat(test.result);
//     return resultValue >= min && resultValue <= max;
//   }
  
//   // إذا لم يكن هناك نطاق محدد، نفترض أن النتيجة طبيعية
//   return true;
// };





//   return (
//     <>
//       <div className="space-y-4 p-4 m-2">
//       {/* العنوان + البحث */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-[var(--primary)]">
//           سجلات المرضى
//         </h1>
//         <div className="relative w-full max-w-sm">
//           <Search className="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="ابحث باسم المريض أو الهاتف أو أي بيانات..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-8 rtl:pr-8 w-full"
//           />
//         </div>
//       </div>

//       {/* الجدول */}
//       <div className="rounded-md border shadow-sm bg-card p-4 m-4">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className={locale === "ar"?`text-right`:`text-left`}>رقم المريض</TableHead>
//               <TableHead className={locale === "ar"?`text-right`:`text-left`}>الاسم</TableHead>
//               <TableHead className={locale === "ar"?`text-right`:`text-left`}>العمر</TableHead>
//               <TableHead className={locale === "ar"?`text-right`:`text-left`}>الجنس</TableHead>
//               <TableHead className={locale === "ar"?`text-right`:`text-left`}>الهاتف</TableHead>
//               <TableHead className={locale === "ar"?`text-right`:`text-left`}>إجراء</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((p) => (
//                 <TableRow key={p.id}>
//                   <TableCell className="font-medium">{p.id}</TableCell>
//                   <TableCell>{p.name}</TableCell>
//                   <TableCell>{calculateAge(p.dateOfBirth)} سنة</TableCell>
//                   <TableCell>{p.gender === "Male" ? "ذكر" : "أنثى"}</TableCell>
//                   <TableCell>{p.contactPhone}</TableCell>
//                   <TableCell className="text-right rtl:text-left">
//                     <Button
//                       onClick={() => openModalWithPatient(p)}
//                       size="sm"
//                       className="rounded-xl"
//                     >
//                       عرض السجل الطبي
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} className="h-24 text-center">
//                   لا يوجد مرضى مطابقين للبحث
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//     {open && selectedPatient && (
//   <div
//     className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
//     aria-modal="true"
//     role="dialog"
//     onClick={() => setOpen(false)}
//   >
//     <div
//       className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col 
//         ${maximized ? "w-[95vw] h-[95vh]" : "w-[1400px] h-[90vh]"} transition-all duration-300`}
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <img
//               src={selectedPatient.avatar || "/default-avatar.png"}
//               alt="avatar"
//               className="h-12 w-12 rounded-full border-2 border-white shadow-md"
//             />
//             <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getHeartRateStatus(selectedPatient) === 'high' ? 'bg-red-500' : 'bg-green-500'}`}></div>
//           </div>
//           <div className="text-right">
//             <div className="font-bold text-xl">{selectedPatient.name}</div>
//             <div className="text-sm opacity-90 flex gap-2">
//               <span>ID: {selectedPatient.id}</span>
//               <span>•</span>
//               <span>آخر زيارة: {selectedPatient.lastVisit || "لا توجد زيارة سابقة"}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             size="icon"
//             variant="ghost"
//             className="text-white hover:bg-blue-700"
//             onClick={() => setMaximized(!maximized)}
//             aria-label="تكبير/تصغير"
//           >
//             {maximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
//           </Button>
//           <Button size="icon" variant="ghost" className="text-white hover:bg-blue-700" onClick={handlePrint} aria-label="طباعة">
//             <Printer size={18} />
//           </Button>
//           <Button size="icon" variant="ghost" className="text-white hover:bg-blue-700" onClick={handleExportPDF} aria-label="PDF">
//             <Download size={18} />
//           </Button>
//           <Button size="icon" variant="ghost" className="text-white hover:bg-blue-700" onClick={() => setOpen(false)} aria-label="إغلاق">
//             <X size={18} />
//           </Button>
//         </div>
//       </div>

//       <div
//         ref={contentRef}
//         dir="rtl"
//         className="flex-1 overflow-auto p-6 bg-gray-50 text-gray-900"
//         style={{ fontFamily: "'Cairo', sans-serif" }}
//       >
//         <div className="grid grid-cols-12 gap-5">
//           {/* العمود الجانبي - المعلومات الأساسية */}
//           <div className="col-span-3 space-y-5">
//             {/* بطاقة المعلومات الشخصية */}
//             <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
//               <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">المعلومات الشخصية</h3>
              
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">العمر</span>
//                   <span className="font-medium">
//                     {calculateAge(selectedPatient.dateOfBirth)} سنة
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">الجنس</span>
//                   <span className="font-medium">
//                     {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">فصيلة الدم</span>
//                   <span className="font-medium">O+</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">الحالة</span>
//                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">مستقر</span>
//                 </div>
//               </div>
              
//               <div className="mt-5 pt-4 border-t border-gray-100">
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">معلومات الاتصال</h4>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-sm">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                       <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                     </svg>
//                     <span>{selectedPatient.contactPhone}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                       <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                       <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                     </svg>
//                     <span>{selectedPatient.contactEmail}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                     </svg>
//                     <span>{selectedPatient.address}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* المؤشرات الحيوية */}
//             {selectedPatient.generalMedicine?.vitalSigns && (
//               <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
//                 <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">المؤشرات الحيوية</h3>
                
//                 <div className="space-y-4">
//                   {selectedPatient.generalMedicine.vitalSigns.bloodPressure && (
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-sm text-gray-500">ضغط الدم</span>
//                         <span className={`font-bold ${getBloodPressureStatus(selectedPatient.generalMedicine.vitalSigns.bloodPressure) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
//                           {selectedPatient.generalMedicine.vitalSigns.bloodPressure}
//                         </span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="bg-blue-500 h-2 rounded-full" 
//                           style={{ width: `${Math.min(100, (parseSystolicBloodPressure(selectedPatient.generalMedicine.vitalSigns.bloodPressure) / 200) * 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {selectedPatient.generalMedicine.vitalSigns.heartRate && (
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-sm text-gray-500">نبض القلب</span>
//                         <span className={`font-bold ${getHeartRateStatus(selectedPatient) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
//                           {parseHeartRate(selectedPatient.generalMedicine.vitalSigns.heartRate)} دقة/د
//                         </span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="bg-green-500 h-2 rounded-full" 
//                           style={{ width: `${Math.min(100, (parseHeartRate(selectedPatient.generalMedicine.vitalSigns.heartRate) / 150) * 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {selectedPatient.generalMedicine.vitalSigns.glucose && (
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-sm text-gray-500">سكر الدم</span>
//                         <span className={`font-bold ${getGlucoseStatus(selectedPatient.generalMedicine.vitalSigns.glucose) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
//                           {parseGlucose(selectedPatient.generalMedicine.vitalSigns.glucose)}
//                         </span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="bg-purple-500 h-2 rounded-full" 
//                           style={{ width: `${Math.min(100, (parseGlucose(selectedPatient.generalMedicine.vitalSigns.glucose) / 300) * 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {selectedPatient.generalMedicine.vitalSigns.temperature && (
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-sm text-gray-500">درجة الحرارة</span>
//                         <span className={`font-bold ${getTemperatureStatus(selectedPatient.generalMedicine.vitalSigns.temperature) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
//                           {parseTemperature(selectedPatient.generalMedicine.vitalSigns.temperature)}
//                         </span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="bg-yellow-500 h-2 rounded-full" 
//                           style={{ width: `${Math.min(100, ((parseTemperature(selectedPatient.generalMedicine.vitalSigns.temperature) - 35) / 5) * 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* الأدوية الحالية */}
//             {selectedPatient.generalMedicine?.medications && selectedPatient.generalMedicine.medications.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
//                 <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">الأدوية الحالية</h3>
                
//                 <div className="space-y-3">
//                   {selectedPatient.generalMedicine.medications.map((med, idx) => (
//                     <div key={idx} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//                       </svg>
//                       <div>
//                         <div className="font-medium text-sm">{med}</div>
//                         <div className="text-xs text-gray-500">جرعة: 500mg - مرتين daily</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* معلومات إضافية */}
//             {selectedPatient.personalInfo && (
//               <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
//                 <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">معلومات إضافية</h3>
                
//                 <div className="space-y-3">
//                   {selectedPatient.personalInfo.chronicConditions && selectedPatient.personalInfo.chronicConditions.length > 0 && (
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-700 mb-1">الأمراض المزمنة</h4>
//                       <div className="flex flex-wrap gap-1">
//                         {selectedPatient.personalInfo.chronicConditions.map((condition, idx) => (
//                           <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
//                             {condition}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {selectedPatient.personalInfo.allergies && selectedPatient.personalInfo.allergies.length > 0 && (
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-700 mb-1">الحساسيات</h4>
//                       <div className="flex flex-wrap gap-1">
//                         {selectedPatient.personalInfo.allergies.map((allergy, idx) => (
//                           <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
//                             {allergy}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {selectedPatient.personalInfo.lifestyle && (
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-700 mb-1">نمط الحياة</h4>
//                       <div className="space-y-1 text-xs">
//                         {selectedPatient.personalInfo.lifestyle.smoking !== undefined && (
//                           <div>التدخين: {selectedPatient.personalInfo.lifestyle.smoking ? 'نعم' : 'لا'}</div>
//                         )}
//                         {selectedPatient.personalInfo.lifestyle.exercise && (
//                           <div>التمارين: {selectedPatient.personalInfo.lifestyle.exercise}</div>
//                         )}
//                         {selectedPatient.personalInfo.lifestyle.diet && (
//                           <div>النظام الغذائي: {selectedPatient.personalInfo.lifestyle.diet}</div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* المحتوى الرئيسي */}
//           <div className="col-span-9 space-y-5">
//             {/* علامات التبويب */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="flex border-b border-gray-200 overflow-x-auto">
//                 <button 
//                   className={`px-5 py-3 font-medium whitespace-nowrap ${
//                     activeTab === 'الملف الطبي العام' 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-500 hover:text-blue-600'
//                   }`}
//                   onClick={() => setActiveTab('الملف الطبي العام')}
//                 >
//                   الملف الطبي العام
//                 </button>
//                 <button 
//                   className={`px-5 py-3 font-medium whitespace-nowrap ${
//                     activeTab === 'الفحوصات' 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-500 hover:text-blue-600'
//                   }`}
//                   onClick={() => setActiveTab('الفحوصات')}
//                 >
//                   الفحوصات
//                 </button>
//                 <button 
//                   className={`px-5 py-3 font-medium whitespace-nowrap ${
//                     activeTab === 'القلب' 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-500 hover:text-blue-600'
//                   }`}
//                   onClick={() => setActiveTab('القلب')}
//                 >
//                   القلب
//                 </button>
//                 <button 
//                   className={`px-5 py-3 font-medium whitespace-nowrap ${
//                     activeTab === 'الأشعة' 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-500 hover:text-blue-600'
//                   }`}
//                   onClick={() => setActiveTab('الأشعة')}
//                 >
//                   الأشعة
//                 </button>
//                 <button 
//                   className={`px-5 py-3 font-medium whitespace-nowrap ${
//                     activeTab === 'الجراحة' 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-500 hover:text-blue-600'
//                   }`}
//                   onClick={() => setActiveTab('الجراحة')}
//                 >
//                   الجراحة
//                 </button>
//                 <button 
//                   className={`px-5 py-3 font-medium whitespace-nowrap ${
//                     activeTab === 'التغذية' 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-500 hover:text-blue-600'
//                   }`}
//                   onClick={() => setActiveTab('التغذية')}
//                 >
//                   التغذية
//                 </button>
//                 <button 
//                   className={`px-5 py-3 font-medium whitespace-nowrap ${
//                     activeTab === 'العلاج الطبيعي' 
//                       ? 'border-b-2 border-blue-600 text-blue-600' 
//                       : 'text-gray-500 hover:text-blue-600'
//                   }`}
//                   onClick={() => setActiveTab('العلاج الطبيعي')}
//                 >
//                   العلاج الطبيعي
//                 </button>
//               </div>
              
//               <div className="p-5">
//                 {/* محتوى الملف الطبي العام */}
//                 {activeTab === 'الملف الطبي العام' && (
//                   <>
//                     {/* التشخيصات */}
//                     {selectedPatient.generalMedicine?.diagnoses && selectedPatient.generalMedicine.diagnoses.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">التشخيصات</h3>
                        
//                         <div className="grid grid-cols-2 gap-4">
//                           {selectedPatient.generalMedicine.diagnoses.map((diagnosis, idx) => (
//                             <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <div className="font-medium">{diagnosis.description}</div>
//                                   <div className="text-sm text-gray-500 mt-1">كود: {diagnosis.code}</div>
//                                 </div>
//                                 <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">نشط</span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* الأعراض */}
//                     {selectedPatient.generalMedicine?.symptoms && selectedPatient.generalMedicine.symptoms.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">الأعراض</h3>
                        
//                         <div className="flex flex-wrap gap-2">
//                           {selectedPatient.generalMedicine.symptoms.map((symptom, idx) => (
//                             <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
//                               {symptom}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* الخطة العلاجية */}
//                     <div className="mb-6">
//                       <h3 className="font-semibold text-lg mb-3 text-blue-800">الخطة العلاجية</h3>
                      
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="bg-white border border-green-200 rounded-lg p-4">
//                           <h4 className="font-medium text-green-800 mb-2">الإجراءات المطلوبة</h4>
//                           <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
//                             <li>فحص السكر التراكمي كل 3 أشهر</li>
//                             <li>مراقبة ضغط الدم أسبوعياً</li>
//                             <li>زيارة عيادة السكري شهرياً</li>
//                           </ul>
//                         </div>
                        
//                         <div className="bg-white border border-blue-200 rounded-lg p-4">
//                           <h4 className="font-medium text-blue-800 mb-2">التوصيات</h4>
//                           <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
//                             <li>اتباع نظام غذائي منخفض الكربوهيدرات</li>
//                             <li>ممارسة رياضة المشي 30 دقيقة يومياً</li>
//                             <li>فحص القدمين يومياً</li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>

//                     {/* زيارات العيادة */}
//                     {selectedPatient.visitNotes && selectedPatient.visitNotes.length > 0 && (
//                       <div>
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">سجل الزيارات</h3>
                        
//                         <div className="space-y-4">
//                           {selectedPatient.visitNotes.map((visit, idx) => (
//                             <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
//                               <div className="flex justify-between items-center mb-2">
//                                 <div className="font-medium">{visit.date}</div>
//                                 <div className="text-sm text-gray-500">د. {visit.doctorName}</div>
//                               </div>
//                               <p className="text-gray-700 text-sm">{visit.notes}</p>
                              
//                               <div className="mt-3 flex gap-2">
//                                 <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">فحص عام</span>
//                                 <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">وصفة طبية</span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* محتوى الفحوصات */}
//                 {activeTab === 'الفحوصات' && (
//                   <>
//                     {/* الفحوصات المخبرية */}
//                     {selectedPatient.labTests && selectedPatient.labTests.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">الفحوصات المخبرية</h3>
                        
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <table className="w-full">
//                             <thead>
//                               <tr className="text-right border-b border-gray-200">
//                                 <th className="pb-2 font-medium">الفحص</th>
//                                 <th className="pb-2 font-medium">النتيجة</th>
//                                 <th className="pb-2 font-medium">المعدل الطبيعي</th>
//                                 <th className="pb-2 font-medium">الحالة</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {selectedPatient.labTests.map((test, idx) => {
//                                 const isNormal = isTestResultNormal(test);
//                                 return (
//                                   <tr key={idx} className="border-b border-gray-100 hover:bg-gray-100">
//                                     <td className="py-3 text-sm">{test.testName}</td>
//                                     <td className="py-3 font-medium">{test.result} {test.unit}</td>
//                                     <td className="py-3 text-sm text-gray-500">{test.range || 'N/A'}</td>
//                                     <td className="py-3">
//                                       <span className={`px-2 py-1 text-xs rounded-full ${isNormal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                         {isNormal ? 'طبيعي' : 'غير طبيعي'}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}

//                     {/* الأشعة */}
//                     {selectedPatient.radiology && selectedPatient.radiology.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">تقارير الأشعة</h3>
                        
//                         <div className="grid grid-cols-2 gap-4">
//                           {selectedPatient.radiology.map((scan, idx) => (
//                             <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
//                               <div className="flex justify-between items-start mb-2">
//                                 <h4 className="font-medium text-gray-700">{scan.type}</h4>
//                                 <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                                  {new Date(scan.reportDate || selectedPatient.lastVisit || Date.now()).toLocaleDateString('ar-EG')}
//                                 </span>
//                               </div>
//                               <p className="text-sm text-gray-600">{scan.report}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* محتوى القلب */}
//                 {activeTab === 'القلب' && (
//                   <>
//                     {/* أمراض القلب */}
//                     {selectedPatient.cardiology && (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">أمراض القلب</h3>
                        
//                         <div className="grid grid-cols-2 gap-4">
//                           {selectedPatient.cardiology.ecgResults && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200">
//                               <h4 className="font-medium text-gray-700 mb-2">نتائج تخطيط القلب</h4>
//                               <p className="text-sm">{selectedPatient.cardiology.ecgResults}</p>
//                             </div>
//                           )}
                          
//                           {selectedPatient.cardiology.echocardiography && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200">
//                               <h4 className="font-medium text-gray-700 mb-2">تصوير صدى القلب</h4>
//                               <p className="text-sm">{selectedPatient.cardiology.echocardiography}</p>
//                             </div>
//                           )}
                          
//                           {selectedPatient.cardiology.cardiacMeds && selectedPatient.cardiology.cardiacMeds.length > 0 && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
//                               <h4 className="font-medium text-gray-700 mb-2">أدوية القلب</h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {selectedPatient.cardiology.cardiacMeds.map((med, idx) => (
//                                   <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
//                                     {med}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* محتوى الأشعة */}
//                 {activeTab === 'الأشعة' && (
//                   <>
//                     {selectedPatient.radiology && selectedPatient.radiology.length > 0 ? (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">تقارير الأشعة</h3>
                        
//                         <div className="grid grid-cols-2 gap-4">
//                           {selectedPatient.radiology.map((scan, idx) => (
//                             <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
//                               <div className="flex justify-between items-start mb-2">
//                                 <h4 className="font-medium text-gray-700">{scan.type}</h4>
//                                 <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                                   {new Date().toLocaleDateString()}
//                                 </span>
//                               </div>
//                               <p className="text-sm text-gray-600">{scan.report}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-10 text-gray-500">
//                         لا توجد تقارير أشعة متاحة
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* محتوى الجراحة */}
//                 {activeTab === 'الجراحة' && (
//                   <>
//                     {selectedPatient.surgery && selectedPatient.surgery.length > 0 ? (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">التاريخ الجراحي</h3>
                        
//                         <div className="grid grid-cols-1 gap-4">
//                           {selectedPatient.surgery.map((surgery, idx) => (
//                             <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
//                               <div className="flex justify-between items-start mb-2">
//                                 <h4 className="font-medium text-gray-700">{surgery.type}</h4>
//                                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                                   مكتمل
//                                 </span>
//                               </div>
//                               {surgery.description && (
//                                 <p className="text-sm text-gray-600 mb-2">{surgery.description}</p>
//                               )}
//                               {surgery.complications && surgery.complications.length > 0 && (
//                                 <div className="mb-2">
//                                   <h5 className="font-medium text-sm text-gray-700">المضاعفات:</h5>
//                                   <ul className="list-disc list-inside text-sm text-gray-600">
//                                     {surgery.complications.map((comp, compIdx) => (
//                                       <li key={compIdx}>{comp}</li>
//                                     ))}
//                                   </ul>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-10 text-gray-500">
//                         لا توجد عمليات جراحية سابقة
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* محتوى التغذية */}
//                 {activeTab === 'التغذية' && (
//                   <>
//                     {selectedPatient.nutrition ? (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">التغذية والحمية</h3>
                        
//                         <div className="grid grid-cols-2 gap-4">
//                           {selectedPatient.nutrition.dietPlan && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200">
//                               <h4 className="font-medium text-gray-700 mb-2">الخطة الغذائية</h4>
//                               <p className="text-sm text-gray-600">{selectedPatient.nutrition.dietPlan}</p>
//                             </div>
//                           )}
                          
//                           {selectedPatient.nutrition.weightEvaluation && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200">
//                               <h4 className="font-medium text-gray-700 mb-2">تقييم الوزن</h4>
//                               <p className="text-sm text-gray-600">{selectedPatient.nutrition.weightEvaluation}</p>
//                             </div>
//                           )}
                          
//                           {selectedPatient.nutrition.followUp && selectedPatient.nutrition.followUp.length > 0 && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
//                               <h4 className="font-medium text-gray-700 mb-2">متابعة التغذية</h4>
//                               <ul className="list-disc list-inside text-sm text-gray-600">
//                                 {selectedPatient.nutrition.followUp.map((item, idx) => (
//                                   <li key={idx}>{item}</li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-10 text-gray-500">
//                         لا توجد معلومات عن التغذية
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {/* محتوى العلاج الطبيعي */}
//                 {activeTab === 'العلاج الطبيعي' && (
//                   <>
//                     {selectedPatient.physiotherapy ? (
//                       <div className="mb-6">
//                         <h3 className="font-semibold text-lg mb-3 text-blue-800">العلاج الطبيعي</h3>
                        
//                         <div className="grid grid-cols-2 gap-4">
//                           {selectedPatient.physiotherapy.exerciseProgram && selectedPatient.physiotherapy.exerciseProgram.length > 0 && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200">
//                               <h4 className="font-medium text-gray-700 mb-2">برنامج التمارين</h4>
//                               <ul className="list-disc list-inside text-sm text-gray-600">
//                                 {selectedPatient.physiotherapy.exerciseProgram.map((exercise, idx) => (
//                                   <li key={idx}>{exercise}</li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
                          
//                           {selectedPatient.physiotherapy.progressNotes && selectedPatient.physiotherapy.progressNotes.length > 0 && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200">
//                               <h4 className="font-medium text-gray-700 mb-2">تقدم العلاج</h4>
//                               <ul className="list-disc list-inside text-sm text-gray-600">
//                                 {selectedPatient.physiotherapy.progressNotes.map((note, idx) => (
//                                   <li key={idx}>{note}</li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
                          
//                           {selectedPatient.physiotherapy.assistiveDevices && selectedPatient.physiotherapy.assistiveDevices.length > 0 && (
//                             <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
//                               <h4 className="font-medium text-gray-700 mb-2">أجهزة مساعدة</h4>
//                               <ul className="list-disc list-inside text-sm text-gray-600">
//                                 {selectedPatient.physiotherapy.assistiveDevices.map((device, idx) => (
//                                   <li key={idx}>{device}</li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-10 text-gray-500">
//                         لا توجد معلومات عن العلاج الطبيعي
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-end gap-2 p-4 bg-gray-100 border-t">
//         <Button onClick={handleExportPDF} disabled={loadingPdf} className="bg-blue-600 hover:bg-blue-700">
//           {loadingPdf ? "جاري إنشاء PDF..." : "حفظ كـ PDF"}
//         </Button>
//         <Button onClick={handlePrint} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
//           طباعة
//         </Button>
//         <Button onClick={() => setOpen(false)} variant="ghost">
//           إغلاق
//         </Button>
//       </div>
//     </div>
//   </div>
// )}



      
//     </>
//   );
// }


