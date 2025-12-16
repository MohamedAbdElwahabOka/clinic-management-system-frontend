"use client";

import React, { useCallback, useMemo, useState, use } from "react";
import { Link } from "@/i18n/navigation";
import { Edit3, ChevronRight, Plus, Search, ListFilter, Trash2, Info, ClipboardList, Microscope, FileArchive } from "lucide-react";
import { 
  ArrowRight, 
  Printer, 
  Download, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplet, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  AlertTriangle, 
  Stethoscope, 
  FlaskRound, 
  Scan, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  FileText, 
  Pill, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

import { Patient, CURRENT_DOCTOR_ID, SourceInfo } from "../types";
import { dummyPatients } from "../data";
import { OTPModal } from "../OTPModal";
import { SourceBadge, LockedOverlay, AccessControlCard } from "../AccessControl";

// ============================================
// Helper Functions
// ============================================

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
    case "critical": return "bg-red-100 text-red-800 border border-red-200";
    case "warning": return "bg-amber-100 text-amber-800 border border-amber-200";
    default: return "bg-blue-100 text-blue-800 border border-blue-200";
  }
};

const isLocalRecord = (source: SourceInfo): boolean => {
  return source.doctorId === CURRENT_DOCTOR_ID;
};

// ============================================
// Sub Components
// ============================================

const VitalCard = React.memo(function VitalCard({ title, value, unit, icon }: any) {
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

const SectionHeader = ({ icon, title, action }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-md bg-muted">{icon}</div>
      <h3 className="text-base sm:text-lg font-bold text-foreground">{title}</h3>
    </div>
    {action}
  </div>
);

// ============================================
// Main Page Component
// ============================================

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // فك التغليف باستخدام hook "use"
  const { id } = use(params);

  // البحث عن المريض
  const selectedPatient = useMemo(() => {
    const decodedId = decodeURIComponent(id); 
    return dummyPatients.find(p => p.id === decodedId);
  }, [id]);

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isGlobalAccessUnlocked, setIsGlobalAccessUnlocked] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showGlobalRecords, setShowGlobalRecords] = useState(false);

  const handleOTPSuccess = useCallback(() => {
    setIsGlobalAccessUnlocked(true);
    setShowOTPModal(false);
    setShowGlobalRecords(true);
  }, []);

  const requestGlobalAccess = useCallback(() => {
    setShowOTPModal(true);
  }, []);

  const getLocalRecords = useCallback(<T extends { source: SourceInfo }>(records: T[] | undefined): T[] => {
      return (records || []).filter((r) => isLocalRecord(r.source));
    }, []);

  const getGlobalRecords = useCallback(<T extends { source: SourceInfo }>(records: T[] | undefined): T[] => {
      return (records || []).filter((r) => !isLocalRecord(r.source));
    }, []);

  // التحقق من وجود المريض
  if (!selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4" dir="rtl">
        <h2 className="text-2xl font-bold text-muted-foreground">المريض غير موجود</h2>
        <p className="text-muted-foreground">رقم الملف: {id}</p>
        <Button onClick={() => router.back()}>العودة للقائمة</Button>
      </div>
    );
  }

  // ============================================
  // Render Content
  // ============================================

  const renderOverviewTab = () => {
    const localDiagnoses = getLocalRecords(selectedPatient.diagnoses);
    const globalDiagnoses = getGlobalRecords(selectedPatient.diagnoses);
    const localMedications = getLocalRecords(selectedPatient.medications);
    const globalMedications = getGlobalRecords(selectedPatient.medications);
    const localVisits = getLocalRecords(selectedPatient.visitNotes);
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg">
              {showGlobalRecords ? <Globe className="h-5 w-5 text-primary" /> : <Shield className="h-5 w-5 text-[hsl(var(--medical-local))]" />}
            </div>
            <div>
              <p className="font-medium">{showGlobalRecords ? "السجل الطبي الموحد" : "سجلاتي المحلية"}</p>
              <p className="text-sm text-muted-foreground">{showGlobalRecords ? "عرض جميع السجلات من كافة المصادر" : "السجلات التي أدخلتها أنا فقط"}</p>
            </div>
          </div>
          <Button variant={showGlobalRecords ? "default" : "outline"} onClick={() => {
              if (!showGlobalRecords && !isGlobalAccessUnlocked) requestGlobalAccess();
              else setShowGlobalRecords(!showGlobalRecords);
            }} className="gap-2 w-full sm:w-auto">
            {showGlobalRecords ? <><EyeOff className="h-4 w-4" /><span className="hidden sm:inline">إخفاء السجل الموحد</span></> : <>{isGlobalAccessUnlocked ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}<span className="hidden sm:inline">عرض السجل الموحد</span></>}
          </Button>
        </div>

        <section>
          <SectionHeader icon={<FileText size={18} />} title="التشخيصات النشطة" />
          <div className="space-y-2 mb-4">
            {localDiagnoses.map((diag, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-xl access-card-local gap-3">
                <div className="flex items-center gap-3">
                  <SourceBadge isLocal={true} />
                  <div>
                    <p className="font-semibold">{diag.description}</p>
                    <p className="text-xs text-muted-foreground">كود: {diag.code || "-"}</p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-green-500 self-start sm:self-auto" />
              </div>
            ))}
          </div>
          {showGlobalRecords && globalDiagnoses.map((diag, i) => (
            <AccessControlCard key={i} isLocal={false} isGlobalUnlocked={isGlobalAccessUnlocked} onRequestAccess={requestGlobalAccess} className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <SourceBadge isLocal={false} />
                <div>
                  <p className="font-semibold">{diag.description}</p>
                  <p className="text-xs text-muted-foreground">كود: {diag.code || "-"} | {diag.source.createdAt}</p>
                </div>
              </div>
            </AccessControlCard>
          ))}
          {!showGlobalRecords && globalDiagnoses.length > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
              <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">يوجد {globalDiagnoses.length} تشخيص إضافي في السجل الموحد</p>
              <Button variant="link" size="sm" onClick={requestGlobalAccess} className="mt-1">طلب الوصول</Button>
            </div>
          )}
        </section>

        <section>
          <SectionHeader icon={<Pill size={18} />} title="الأدوية الحالية" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {localMedications.map((med, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border access-card-local bg-card">
                <div className="bg-muted p-2 rounded-lg text-primary"><Pill size={16} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{med.name}</p>
                      <SourceBadge isLocal={true} />
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">{med.dose}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{med.freq} - {med.indication}</p>
                </div>
              </div>
            ))}
          </div>
          {!showGlobalRecords && globalMedications.length > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
              <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">يوجد {globalMedications.length} دواء إضافي في السجل الموحد</p>
            </div>
          )}
        </section>

        <section>
            <SectionHeader icon={<Clock size={18} />} title="آخر الزيارات" />
            <div className="space-y-2">
            {localVisits.slice(0, 3).map((visit, i) => (
                <div key={i} className="p-4 bg-card border rounded-lg access-card-local">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2">
                    <Badge variant="outline">{visit.date}</Badge>
                    <SourceBadge isLocal={true} />
                    </div>
                    <span className="text-sm text-muted-foreground">{visit.doctorName}</span>
                </div>
                <p className="text-sm">{visit.notes}</p>
                </div>
            ))}
            </div>
        </section>
      </div>
    );
  };

  const renderLabsTab = () => {
    const localLabs = getLocalRecords(selectedPatient.labTests);
    const globalLabs = getGlobalRecords(selectedPatient.labTests);
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SectionHeader icon={<FlaskRound size={18} />} title="نتائج المختبر" action={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="badge-local border">محلي: {localLabs.length}</Badge>
              <Badge variant="outline" className="badge-global border">خارجي: {globalLabs.length}</Badge>
            </div>
          } />
        <div className="overflow-x-auto rounded-xl border">
             <table className="w-full text-right text-sm min-w-[600px]">
                 <thead className="bg-muted/50 text-muted-foreground">
                    <tr><th className="p-3">الفحص</th><th className="p-3">النتيجة</th><th className="p-3">الحالة</th><th className="p-3">التاريخ</th></tr>
                 </thead>
                 <tbody className="divide-y">
                     {localLabs.map((test, i) => (
                         <tr key={i} className="hover:bg-muted/30">
                             <td className="p-3 font-medium">{test.testName}</td>
                             <td className="p-3 font-mono">{test.result} {test.unit}</td>
                             <td className="p-3"><Badge variant={test.status === "high" ? "destructive" : test.status === "low" ? "secondary" : "default"}>{test.status}</Badge></td>
                             <td className="p-3 text-muted-foreground">{test.date}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
        </div>
        {globalLabs.length > 0 && (
          <div className="relative mt-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--medical-global))]" />
              تحاليل السجل الموحد
            </h4>
            {isGlobalAccessUnlocked ? (
               <div className="overflow-x-auto rounded-xl border animate-unlock">
                    <div className="p-4 text-center text-muted-foreground">تم عرض التحاليل الخارجية ({globalLabs.length})</div>
               </div>
            ) : (
              <div className="relative rounded-xl border overflow-hidden">
                <div className="blur-content p-8 bg-muted/20"><div className="h-24" /></div>
                <LockedOverlay onRequestAccess={requestGlobalAccess} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRadiologyTab = () => {
    const localRadiology = getLocalRecords(selectedPatient.radiology);
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SectionHeader icon={<Scan size={18} />} title="تقارير الأشعة" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localRadiology.map((r, i) => (
                    <Card key={i} className="access-card-local">
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                <div><CardTitle className="text-base">{r.type}</CardTitle><p className="text-sm text-muted-foreground">{r.doctor}</p></div>
                                <Badge variant="secondary">{r.date}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent><p className="text-sm">{r.description}</p>{r.bodyPart && <Badge variant="outline" className="mt-2">{r.bodyPart}</Badge>}</CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
  };

  const renderGlobalRecordTab = () => {
    const globalDiagnoses = getGlobalRecords(selectedPatient.diagnoses);
    const globalMedications = getGlobalRecords(selectedPatient.medications);
    const globalLabs = getGlobalRecords(selectedPatient.labTests);
    const globalRadiology = getGlobalRecords(selectedPatient.radiology);
    const globalVisits = getGlobalRecords(selectedPatient.visitNotes);
    const totalGlobal = globalDiagnoses.length + globalMedications.length + globalLabs.length + globalRadiology.length + globalVisits.length;

    if (!isGlobalAccessUnlocked) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6"><Lock className="h-12 w-12 text-muted-foreground" /></div>
          <h3 className="text-xl font-semibold mb-2 text-center">الوصول مقيد</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6 text-base">السجل الطبي الموحد يحتوي على {totalGlobal} سجل من مصادر خارجية. للوصول إليها، يجب الحصول على موافقة المريض عبر رمز OTP.</p>
          <Button onClick={requestGlobalAccess} size="lg" className="gap-2"><Shield className="h-5 w-5" /> طلب الوصول عبر OTP</Button>
        </div>
      );
    }
    return (
      <div className="space-y-6 animate-unlock">
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3"><Shield className="h-6 w-6 text-primary" /><div><p className="font-medium text-primary text-base">تم فتح السجل الموحد</p><p className="text-sm text-muted-foreground">الوصول متاح لهذه الجلسة فقط</p></div></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalDiagnoses.length}</p><p className="text-xs text-muted-foreground">تشخيصات</p></Card>
          <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalMedications.length}</p><p className="text-xs text-muted-foreground">أدوية</p></Card>
          <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalLabs.length}</p><p className="text-xs text-muted-foreground">تحاليل</p></Card>
          <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalRadiology.length}</p><p className="text-xs text-muted-foreground">أشعة</p></Card>
          <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalVisits.length}</p><p className="text-xs text-muted-foreground">زيارات</p></Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6" dir="rtl">
      
      {/* ========================================================= */}
      {/* شريط التنقل (Breadcrumbs) والتحكم الجديد */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/records" className="hover:text-primary transition-colors">
            قائمة السجلات
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 rtl:rotate-180" />
          <span className="font-semibold text-foreground">{selectedPatient.name}</span>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/records/${selectedPatient.id}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" />
            تعديل البيانات
          </Link>
        </Button>
      </div>

      {/* باقي المحتوى */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
                <img src={selectedPatient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPatient.name)}&background=3b82f6&color=fff`} alt={selectedPatient.name} className="h-16 w-16 rounded-full border-4 border-background shadow-sm"/>
                <div>
                    <h1 className="text-2xl font-bold">{selectedPatient.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>{calculateAge(selectedPatient.dateOfBirth)} سنة</span><span>•</span><span>{selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}</span><span>•</span><span className="font-mono">{selectedPatient.id}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2"><Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button><Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button></div>
      </div>

      {selectedPatient.alerts && selectedPatient.alerts.length > 0 && (
          <div className="flex flex-wrap gap-2">
              {selectedPatient.alerts.map((alert, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getAlertColor(alert.type)}`}><AlertTriangle size={14} />{alert.msg}</div>
              ))}
          </div>
      )}

      {selectedPatient.vitalSigns && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <VitalCard title="معدل النبض" value={selectedPatient.vitalSigns.heartRate} unit="bpm" icon={<Activity className="text-rose-500" size={18} />} />
            <VitalCard title="ضغط الدم" value={selectedPatient.vitalSigns.bloodPressure} unit="mmHg" icon={<Heart className="text-blue-500" size={18} />} />
            <VitalCard title="الحرارة" value={selectedPatient.vitalSigns.temperature} unit="°C" icon={<Thermometer className="text-orange-500" size={18} />} />
            <VitalCard title="سكر الدم" value={selectedPatient.vitalSigns.glucose} unit="mg/dL" icon={<Droplet className="text-purple-500" size={18} />} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
              <Card className="p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">بيانات الاتصال</h3>
                  <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><Phone size={16} /></div><div><p className="text-muted-foreground text-xs">الهاتف</p><p className="font-medium font-mono">{selectedPatient.contactPhone}</p></div></div>
                      <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><Mail size={16} /></div><div><p className="text-muted-foreground text-xs">البريد</p><p className="font-medium">{selectedPatient.contactEmail}</p></div></div>
                      <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><MapPin size={16} /></div><div><p className="text-muted-foreground text-xs">العنوان</p><p className="font-medium">{selectedPatient.address}</p></div></div>
                      <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><Briefcase size={16} /></div><div><p className="text-muted-foreground text-xs">المهنة</p><p className="font-medium">{selectedPatient.occupation}</p></div></div>
                  </div>
              </Card>
              {selectedPatient.personalInfo?.allergies && selectedPatient.personalInfo.allergies.length > 0 && (
                <Card className="p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">الحساسية</h3>
                    <div className="flex flex-wrap gap-2">{selectedPatient.personalInfo.allergies.map((alg, i) => (<Badge key={i} variant="destructive">{alg}</Badge>))}</div>
                </Card>
              )}
          </div>

          <div className="lg:col-span-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto bg-card border p-1 mb-6">
                      <TabsTrigger value="overview" className="gap-2"><Stethoscope size={14} /> نظرة عامة</TabsTrigger>
                      <TabsTrigger value="labs" className="gap-2"><FlaskRound size={14} /> التحاليل</TabsTrigger>
                      <TabsTrigger value="radiology" className="gap-2"><Scan size={14} /> الأشعة</TabsTrigger>
                      <TabsTrigger value="global" className="gap-2">{isGlobalAccessUnlocked ? <Globe size={14} /> : <Lock size={14} />} السجل الموحد</TabsTrigger>
                  </TabsList>
                  <Card className="min-h-[400px] p-6">
                    {activeTab === "overview" && renderOverviewTab()}
                    {activeTab === "labs" && renderLabsTab()}
                    {activeTab === "radiology" && renderRadiologyTab()}
                    {activeTab === "global" && renderGlobalRecordTab()}
                  </Card>
              </Tabs>
          </div>
      </div>

      <OTPModal open={showOTPModal} onOpenChange={setShowOTPModal} onSuccess={handleOTPSuccess} patientName={selectedPatient.name} />
    </div>
  );
}