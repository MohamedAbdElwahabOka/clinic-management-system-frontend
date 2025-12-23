
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, Lock, ShieldCheck, MapPin, 
  Phone, User, Plus, Mail, MessageSquare, Timer, 
  LogOut, CheckCircle2, TrendingUp, 
  Repeat, Stethoscope, 
  List, GitCommitHorizontal, LayoutList, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// --- Imports from Modular Structure ---
import { dummyPatients } from "../data"; 
import { CURRENT_DOCTOR_ID } from "../types"; 
import { getLoc } from "../utils"; // New Helper
import { useExternalAccess } from "../hooks/useExternalAccess"; // Hook
import { ClinicalPriorityStrip } from "../components/header/ClinicalPriorityStrip"; // Header
import { SmartSparkline } from "../components/vitals/SmartSparkline"; // Vitals
import { SingleVisitView } from "../components/visits/SingleVisitView"; // Visits
import { DoctorVisitCard } from "../components/visits/DoctorVisitCard"; // Visits

// ============================================ 
// MAIN COMPONENT 
// ============================================ 
export default function PatientRecordDetail() { 
  const params = useParams(); 
  const locale = (params.locale as string) || "ar"; 

  // --- Logic & Hooks ---
  const externalAccess = useExternalAccess(locale);
  const [activeTab, setActiveTab] = useState("local"); 
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list'); 
  const [isNewLogOpen, setIsNewLogOpen] = useState(false); 
  const [planInput, setPlanInput] = useState(""); 
  const [assessmentInput, setAssessmentInput] = useState(""); 
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null); 
  const [soapError, setSoapError] = useState<string | null>(null); 

  const patient = useMemo(() => dummyPatients.find((p) => p.id === params.id) || dummyPatients[0], [params.id]); 

  const localVisits = patient.visitsHistory.filter((v) => v.doctorId === CURRENT_DOCTOR_ID); 
  const externalVisits = patient.visitsHistory.filter((v) => v.doctorId !== CURRENT_DOCTOR_ID); 
   
  const groupVisitsByDoctor = (visits: any[]) => { 
    const grouped: Record<string, any[]> = {}; 
    visits.forEach(visit => { 
      const doctorId = visit.doctorId; 
      if (!grouped[doctorId]) grouped[doctorId] = []; 
      grouped[doctorId].push(visit); 
    }); 
    return grouped; 
  }; 
   
  const groupedLocalVisits = groupVisitsByDoctor(localVisits); 
  const groupedExternalVisits = groupVisitsByDoctor(externalVisits); 

  useEffect(() => { 
    const lowerPlan = planInput.toLowerCase(); 
    const hasPenicillinAllergy = patient.alerts.some(a =>  
      a.type === 'critical' && getLoc(a.msg, 'en').toLowerCase().includes('penicillin') 
    ); 
    if (hasPenicillinAllergy && lowerPlan.includes('penicillin')) { 
      setAllergyWarning(locale === 'ar' ? "تنبيه خطير: المريض لديه حساسية من البنسلين!" : "CRITICAL: Patient has Penicillin allergy!"); 
    } else { 
      setAllergyWarning(null); 
    } 
  }, [planInput, patient, locale]); 

  const handleRefill = (doctorId: string, prevNotes: string) => { 
    setPlanInput(prevNotes + (locale === 'ar' ? "\n(تكرار العلاج - Refill)" : "\n(Refill)")); 
    setIsNewLogOpen(true); 
  }; 

  const handleSaveSOAP = () => { 
      if (planInput.trim().length > 0 && assessmentInput.trim().length === 0) { 
          setSoapError(locale === 'ar' ? "لا يمكن حفظ خطة علاج بدون تشخيص (Assessment)" : "Cannot save Plan without Assessment"); 
          return; 
      } 
      setSoapError(null); 
      setIsNewLogOpen(false); 
  }; 

  return ( 
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 transition-colors" dir={locale === 'ar' ? 'rtl' : 'ltr'}> 
       
      <ClinicalPriorityStrip patient={patient} locale={locale} />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 w-full"> 

      {/* Header Info */} 
      <div className="flex flex-col md:flex-row gap-6 items-start"> 
            <div className="relative shrink-0"> 
              <Avatar className="w-20 h-20 border-4 border-white shadow-sm"> 
                <AvatarImage src={patient.avatar} /> 
                <AvatarFallback>{getLoc(patient.name, locale)[0]}</AvatarFallback> 
              </Avatar> 
              <Badge className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] ${getLoc(patient.status.code, 'en') === 'Stable' ? 'bg-green-500' : 'bg-red-500'}`}> 
                {getLoc(patient.status.code, locale)} 
              </Badge> 
            </div> 
             
            <div className="flex-1 min-w-0"> 
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight"> 
                    {getLoc(patient.name, locale)} 
                  </h1> 
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1"> 
                      <span className="flex items-center gap-1"><User className="w-3 h-3"/> {getLoc(patient.gender, locale)}, {2024 - parseInt(patient.dateOfBirth.split('-')[0])}yo</span> 
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> <span dir="ltr">{patient.contactPhone}</span></span> 
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {getLoc(patient.address, locale)}</span> 
                  </div> 
            </div> 
 
            {/* New Record Button (SOAP Modal) */} 
            <div className="shrink-0"> 
                <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}> 
                  <DialogTrigger asChild> 
                    <Button className="gap-2 shadow-sm bg-blue-600 hover:bg-blue-700" onClick={() => { setPlanInput(""); setAssessmentInput(""); setSoapError(null); }}> 
                      <Plus className="w-4 h-4" />  
                      {locale === 'ar' ? 'سجل جديد' : 'New Record'} 
                    </Button> 
                  </DialogTrigger> 
                  <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0" dir={locale === 'ar' ? 'rtl' : 'ltr'}> 
                      <div className="flex h-full overflow-hidden"> 
                          {/* Sidebar */} 
                          <div className="w-[280px] bg-gray-50 dark:bg-gray-900 border-e dark:border-gray-800 p-4 overflow-y-auto hidden md:block text-sm"> 
                              <h3 className="font-bold text-gray-500 dark:text-gray-300 uppercase text-xs mb-3">Patient Summary</h3> 
                              <div className="mb-4"> 
                                  {patient.alerts.map((a,i) => ( 
                                    <div key={i} className="text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 p-2 rounded mb-1"> 
                                      {getLoc(a.msg, locale)} 
                                    </div> 
                                  ))} 
                              </div> 
                              <Separator className="mb-4"/> 
                              <div className="space-y-2"> 
                                  <div className="flex justify-between"><span>BP</span> <span className="font-mono font-bold">{patient.vitalSigns.bloodPressure}</span></div> 
                                  <div className="flex justify-between"><span>HR</span> <span className="font-mono font-bold">{patient.vitalSigns.heartRate}</span></div> 
                              </div> 
                          </div> 
                          {/* Form */} 
                          <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-950"> 
                              <DialogHeader className="p-5 border-b"> 
                                  <DialogTitle>New SOAP Note</DialogTitle> 
                              </DialogHeader> 
                              <div className="flex-1 overflow-y-auto p-6 space-y-6"> 
                                  <div><Label className="text-blue-600 font-bold mb-1 block">Subjective</Label><Textarea className="bg-blue-50/20"/></div> 
                                  <div><Label className="text-green-600 font-bold mb-1 block">Objective</Label><Textarea className="bg-green-50/20"/></div> 
                                  <div> 
                                      <Label className="text-purple-600 font-bold mb-1 block">Assessment <span className="text-red-500">*</span></Label> 
                                      <Input className="bg-purple-50/20" value={assessmentInput} onChange={(e) => setAssessmentInput(e.target.value)} placeholder="Diagnosis..." /> 
                                  </div> 
                                  <div> 
                                      <Label className="text-orange-600 font-bold mb-1 block">Plan</Label> 
                                      {allergyWarning && <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs rounded font-bold animate-pulse">{allergyWarning}</div>} 
                                      <Textarea className="bg-orange-50/20 dark:bg-orange-900/20 min-h-[100px]" value={planInput} onChange={(e) => setPlanInput(e.target.value)} /> 
                                  </div> 
                                  {soapError && <div className="text-red-600 dark:text-red-300 text-sm font-semibold bg-red-50 dark:bg-red-900/40 p-2 rounded">{soapError}</div>} 
                              </div> 
                              <DialogFooter className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900"> 
                                  <Button onClick={handleSaveSOAP}>Save Record</Button> 
                              </DialogFooter> 
                          </div> 
                      </div> 
                  </DialogContent> 
                </Dialog> 
            </div> 
      </div> 
 
      <div className="grid grid-cols-12 gap-6"> 
         
        {/* LEFT COLUMN: Vitals */} 
        <div className="col-span-12 lg:col-span-3 space-y-6"> 
          <Card className="shadow-sm border-gray-200 dark:border-gray-800 dark:bg-gray-900"> 
            <CardHeader className="pb-2 pt-4 px-4"> 
               <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200"> 
                  <TrendingUp className="w-4 h-4 text-blue-500" /> 
                  {locale === 'ar' ? 'المؤشرات الحيوية' : 'Vital Trends'} 
               </CardTitle> 
            </CardHeader> 
            <CardContent className="space-y-6 px-4 pb-4"> 
               <div><div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400"><span>Heart Rate</span></div><SmartSparkline data={patient.vitalSigns.history.heartRate} minNormal={60} maxNormal={100} unit="bpm" /></div> 
               <div><div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400"><span>BP (Systolic)</span></div><SmartSparkline data={patient.vitalSigns.history.bloodPressure} minNormal={110} maxNormal={130} unit="mmHg" /></div> 
               <div><div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400"><span>Glucose</span></div><SmartSparkline data={patient.vitalSigns.history.glucose} minNormal={70} maxNormal={140} unit="mg/dL" /></div> 
            </CardContent> 
          </Card> 
        </div> 
 
        {/* RIGHT COLUMN: Visits & Actions */} 
        <div className="col-span-12 lg:col-span-9 space-y-6"> 
           
          {/* Actions Strip */} 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> 
              <Button variant="outline" className="h-auto py-3 px-4 justify-start gap-3 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-100 dark:border-blue-900 hover:border-blue-200 shadow-sm group"> 
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full group-hover:bg-blue-200"><Repeat className="w-4 h-4"/></div> 
                  <div className="text-start"><div className="text-sm font-semibold text-gray-900">Refill Prescriptions</div><div className="text-[10px] text-gray-500">Metformin, Lisinopril</div></div> 
              </Button> 
              <Button variant="outline" className="h-auto py-3 px-4 justify-start gap-3 bg-white dark:bg-gray-900 hover:bg-yellow-50 dark:hover:bg-yellow-950 border-yellow-100 dark:border-yellow-900 hover:border-yellow-200 shadow-sm group"> 
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 rounded-full group-hover:bg-yellow-200"><Stethoscope className="w-4 h-4"/></div> 
                  <div className="text-start"><div className="text-sm font-semibold text-gray-900">Review HR Trend</div><div className="text-[10px] text-gray-500">Elevated in last 2 visits</div></div> 
              </Button> 
              <Button variant="outline" className="h-auto py-3 px-4 justify-start gap-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm group"> 
                   <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-full"><GitCommitHorizontal className="w-4 h-4"/></div> 
                   <div className="text-start"><div className="text-sm font-semibold text-gray-900">Lab Results</div><div className="text-[10px] text-gray-500">Pending from 12/12</div></div> 
              </Button> 
          </div> 
 
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"> 
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 sm:gap-0"> 
                <TabsList className="w-full sm:w-auto grid grid-cols-2"> 
                    <TabsTrigger value="local">{locale === 'ar' ? 'سجلات محلية' : 'Local Records'}</TabsTrigger> 
                    <TabsTrigger value="external" className="relative"> 
                        {locale === 'ar' ? 'سجلات خارجية' : 'External Records'} 
                        {externalAccess.isUnlocked && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"/>} 
                    </TabsTrigger> 
                </TabsList> 
                 
                {activeTab === 'local' && ( 
                    <div className="flex bg-gray-100 p-1 rounded-lg mt-2 sm:mt-0"> 
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-black dark:bg-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}><List className="w-4 h-4"/></button> 
                        <button onClick={() => setViewMode('timeline')} className={`p-1.5 rounded ${viewMode === 'timeline' ? 'bg-white shadow text-black dark:bg-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}><LayoutList className="w-4 h-4"/></button> 
                    </div> 
                )} 
            </div> 
 
            {/* LOCAL TAB */} 
            <TabsContent value="local" className="space-y-4"> 
               {Object.keys(groupedLocalVisits).length > 0 ? ( 
                  viewMode === 'list' ? ( 
                      Object.entries(groupedLocalVisits).map(([doctorId, visits]) => ( 
                        <DoctorVisitCard  
                            key={doctorId} 
                            visits={visits} 
                            locale={locale} 
                            onRefill={() => handleRefill(doctorId, getLoc(visits[0].notes, locale))} 
                        /> 
                      )) 
                  ) : ( 
                      <div className="relative border-s-2 border-gray-200 dark:border-gray-700 ms-4 space-y-8 py-4"> 
                          {localVisits.map((visit) => ( 
                              <div key={visit.id} className="ms-6 relative"> 
                                  <span className="absolute -left-[33px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white"> 
                                      <CheckCircle2 className="h-4 w-4 text-blue-600" /> 
                                  </span> 
                                  <div className="text-xs text-gray-500 mb-1 font-mono">{visit.date}</div> 
                                  <SingleVisitView visit={visit} locale={locale} /> 
                              </div> 
                          ))} 
                      </div> 
                  ) 
               ) : ( 
                 <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700"> 
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-3"><FileText className="w-8 h-8 text-gray-400"/></div> 
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{locale === 'ar' ? 'لا توجد سجلات محلية' : 'No Local Records Yet'}</h3> 
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-4">{locale === 'ar' ? 'ابدأ بإضافة أول زيارة لهذا المريض' : 'Start by creating the first consultation log for this patient.'}</p> 
                    <Button variant="outline" onClick={() => { setPlanInput(""); setIsNewLogOpen(true); }}><Plus className="w-4 h-4 mr-2"/> {locale === 'ar' ? 'إضافة زيارة' : 'Add First Visit'}</Button> 
                 </div> 
               )} 
            </TabsContent> 
 
            {/* EXTERNAL TAB */} 
            <TabsContent value="external" className="space-y-4"> 
              {!externalAccess.isUnlocked ? ( 
                 <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300"> 
                   <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-10 px-4"> 
                      {/* Step 1: Choose Method */} 
                      {externalAccess.otpStep === 'method' && ( 
                        <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300"> 
                          <div className="mx-auto bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full w-fit mb-2"> 
                              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" /> 
                          </div> 
                          <div className="space-y-1"> 
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{locale === 'ar' ? 'التحقق الأمني' : 'Security Verification'}</h3> 
                              <p className="text-sm text-gray-500 dark:text-gray-400">{locale === 'ar' ? 'اختر طريقة لاستلام رمز التحقق' : 'Choose a method to receive your OTP'}</p> 
                          </div> 
                          <div className="grid grid-cols-2 gap-4 w-full mt-4"> 
                              <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all group" 
                                onClick={() => { externalAccess.setSelectedMethod('sms'); externalAccess.setOtpStep('verify'); externalAccess.setOtpInput(""); }}> 
                                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 transition-colors"> 
                                      <MessageSquare className="w-6 h-6 text-gray-600 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400" /> 
                                  </div> 
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">SMS ••••890</span> 
                              </button> 
                              <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all group" 
                                onClick={() => { externalAccess.setSelectedMethod('email'); externalAccess.setOtpStep('verify'); externalAccess.setOtpInput(""); }}> 
                                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 transition-colors"> 
                                      <Mail className="w-6 h-6 text-gray-600 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400" /> 
                                  </div> 
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email</span> 
                              </button> 
                          </div> 
                        </div> 
                      )} 
                      {/* Step 2: Verify */} 
                      {externalAccess.otpStep === 'verify' && ( 
                        <div className="w-full space-y-6 animate-in slide-in-from-right-8 fade-in duration-300"> 
                           <div className="w-full flex justify-start"> 
                               <Button variant="ghost" size="sm" onClick={() => externalAccess.setOtpStep('method')} className="gap-1 text-gray-500 -ml-2"> 
                                   <ArrowLeft className="w-4 h-4" /> {locale === 'ar' ? 'رجوع' : 'Back'} 
                               </Button> 
                           </div> 
                           <div className="space-y-2"> 
                               <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{locale === 'ar' ? 'أدخل الرمز' : 'Enter Code'}</h3> 
                               <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1"> 
                                  <span>{locale === 'ar' ? 'تم الإرسال إلى' : 'Sent to'}</span> 
                                  <span className="font-semibold text-gray-900 dark:text-gray-200">{externalAccess.selectedMethod === 'sms' ? '+20 10••••890' : 'dr••••@hospital.com'}</span> 
                               </div> 
                           </div> 
                           <div className="relative flex justify-center w-full h-14" dir="ltr"> 
                               <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none"> 
                                   {[...Array(6)].map((_, i) => ( 
                                       <div key={i} className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 bg-white dark:bg-gray-800 ${externalAccess.otpInput.length === i ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : externalAccess.otpInput.length > i ? 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}> 
                                           {externalAccess.otpInput[i] || ""} 
                                       </div> 
                                   ))} 
                               </div> 
                               <input type="text" inputMode="numeric" autoFocus maxLength={6} value={externalAccess.otpInput} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); if (val.length <= 6) externalAccess.setOtpInput(val); }} className="w-full h-full opacity-0 cursor-text text-center text-transparent bg-transparent" style={{ letterSpacing: '1rem' }} /> 
                           </div> 
                           <Button className="w-full h-11 text-base shadow-lg shadow-blue-500/20" onClick={externalAccess.verifyOTP} disabled={externalAccess.otpInput.length < 6}> 
                               {locale === 'ar' ? 'تحقق (123456)' : 'Verify Access'} 
                           </Button> 
                           <div className="flex items-center justify-center gap-2 text-sm"> 
                               <span className="text-gray-500">{locale === 'ar' ? 'لم يصلك الرمز؟' : "Didn't receive code?"}</span> 
                               <button onClick={externalAccess.resendCode} disabled={externalAccess.resendTimer > 0} className={`font-semibold ${externalAccess.resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}> 
                                  {externalAccess.resendTimer > 0 ? `${locale === 'ar' ? 'إعادة إرسال خلال' : 'Resend in'} ${externalAccess.resendTimer}s` : (locale === 'ar' ? 'إعادة الإرسال' : 'Resend Code')} 
                               </button> 
                           </div> 
                        </div> 
                      )} 
                   </div> 
                 </Card> 
              ) : ( 
                <div className="space-y-4 animate-in fade-in"> 
                   <div className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-900 rounded-lg p-3 flex justify-between items-center"> 
                      <div className="flex items-center gap-3 text-green-800 dark:text-green-200"> 
                        <ShieldCheck className="w-5 h-5" /> 
                        <div> 
                            <span className="font-bold text-sm block">{locale === 'ar' ? 'جلسة خارجية نشطة' : 'Active External Session'}</span> 
                            <span className="text-[10px] opacity-80 block">Secure Connection Established</span> 
                        </div> 
                      </div> 
                       <div className="flex items-center gap-3"> 
                         <div className="flex items-center gap-2 bg-white dark:bg-green-950 px-3 py-1 rounded border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 font-mono font-bold"> 
                            <Timer className="w-4 h-4 animate-pulse" /> {externalAccess.timeLeft} 
                         </div> 
                         <Button variant="destructive" size="sm" onClick={externalAccess.endSession}> 
                            <LogOut className="w-4 h-4" /> 
                         </Button> 
                      </div> 
                   </div> 
                   {Object.entries(groupedExternalVisits).map(([doctorId, visits]) => ( 
                     <DoctorVisitCard key={doctorId} visits={visits} locale={locale} isExternal /> 
                   ))} 
                </div> 
              )} 
            </TabsContent> 
          </Tabs> 
        </div> 
      </div> 
      </div> 
    </div> 
  ); 
}


// هذا الكود عباره عن الميدال ريكود كلها علي بعضها اللي قبل الفصل وعمل البلاجن وكان شغال ميه ميه 
// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { 
//   ArrowRight, Lock, ShieldCheck, AlertTriangle, Info, MapPin, 
//   Phone, User, Plus, Mail, MessageSquare, Timer, 
//   LogOut, RefreshCw, FileText, CheckCircle2, TrendingUp, 
//   Image as ImageIcon, Repeat, X, Pill, Stethoscope, 
//   AlertOctagon, FileDown, Flag, History, List, 
//   GitCommitHorizontal, LayoutList, Eye, Droplets, Search, ClipboardCheck, Scan, Scissors, 
//   Microscope, ScanEye, Droplet, Ear, Camera, Scaling, 
//   FlaskConical, ClipboardList, Activity, Calendar, ChevronDown, ChevronUp
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// import { dummyPatients } from "../data";
// import { CURRENT_DOCTOR_ID, LocalizedText } from "../types";
// import {
//   CardiologyDataView,
//   OphthalmologyDataView,  
//   GastroenterologyDataView,
//   UrologyDataView,
//   ENTDataView,
//   DermatologyDataView,
//   InternalMedicineDataView,
//   DefaultDataView
// } from "../components/specialties/index";

// // ============================================
// // 1. Localization Helper
// // ============================================
// const getLoc = (content: LocalizedText | string | undefined, locale: string) => {
//   if (!content) return "";
//   if (typeof content === "string") return content;
  
//   const priorities: Record<string, string[]> = {
//     'en': ['en', 'ar', 'de'],
//     'ar': ['ar', 'en', 'de'],
//     'de': ['de', 'en', 'ar'],
//   };
  
//   const searchOrder = priorities[locale] || ['ar', 'en', 'de'];
  
//   for (const lang of searchOrder) {
//     // @ts-ignore
//     const value = content[lang];
//     if (value && value.trim() !== "") return value;
//   }
//   return "";
// };

// // ============================================
// // 2. Enhanced Sparkline (Context-Aware)
// // ============================================
// const SmartSparkline = ({ data, minNormal, maxNormal, unit }: { data: number[], minNormal: number, maxNormal: number, unit: string }) => {
//     if (!data || data.length < 2) return null;
    
//     const min = Math.min(...data, minNormal - 5);
//     const max = Math.max(...data, maxNormal + 5);
//     const range = max - min || 1;
//     const width = 120;
//     const height = 40;
    
//     const lastValue = data[data.length - 1];
//     const isAbnormal = lastValue < minNormal || lastValue > maxNormal;
//     const color = isAbnormal ? "red" : "#10b981"; 

//     const points = data.map((val, i) => {
//         const x = (i / (data.length - 1)) * width;
//         const y = height - ((val - min) / range) * height;
//         return `${x},${y}`;
//     }).join(" ");

//     return (
//         <TooltipProvider>
//             <Tooltip>
//                 <TooltipTrigger asChild>
//                     <div className="flex flex-col items-end cursor-help">
//                          <div className="flex items-center gap-2 mb-1">
//                              {isAbnormal && <AlertOctagon className="w-3 h-3 text-red-500 animate-pulse" />}
//                              <span className={`font-bold text-sm ${isAbnormal ? 'text-red-600' : 'text-gray-700'}`}>
//                                  {lastValue} <span className="text-[10px] text-muted-foreground font-normal">{unit}</span>
//                              </span>
//                          </div>
//                          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
//                             {/* Normal Range Zone Background */}
//                             <rect 
//                                 x="0" 
//                                 y={height - ((maxNormal - min) / range) * height} 
//                                 width={width} 
//                                 height={((maxNormal - minNormal) / range) * height} 
//                                 fill={isAbnormal ? "#fee2e2" : "#ecfdf5"} 
//                                 opacity="0.5"
//                             />
//                             <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
//                             <circle cx={width} cy={height - ((lastValue - min) / range) * height} r="3" fill={color} />
//                         </svg>
//                     </div>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                     <p className="text-xs">Normal Range: {minNormal}-{maxNormal} {unit}</p>
//                     <p className="text-xs font-bold">{isAbnormal ? '⚠️ Attention Needed' : '✅ Within Limits'}</p>
//                 </TooltipContent>
//             </Tooltip>
//         </TooltipProvider>
//     );
// };





// // Dentistry Data View
// const DentistryDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   const hasDentalChart = data.dentalChart && Object.keys(data.dentalChart).length > 0;

//   return (
//     <div className="space-y-4">
//       {/* Chief Complaint */}
//       {data.chiefComplaint && (
//         <div className="space-y-1">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <AlertTriangle className="w-4 h-4 text-red-500" />
//             {locale === 'ar' ? 'الشكوى الرئيسية' : 'Chief Complaint'}
//           </h4>
//           <p className="text-sm text-gray-800 bg-red-50/60 border border-red-100 rounded p-2">
//             {data.chiefComplaint}
//           </p>
//         </div>
//       )}

//       {/* Tooth / Dental Chart */}
//       {hasDentalChart && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Activity className="w-4 h-4 text-amber-500" />
//             {locale === 'ar' ? 'خريطة الأسنان' : 'Dental Chart'}
//           </h4>
//           <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
//             <table className="min-w-full text-xs md:text-sm">
//               <thead className="bg-gray-50 text-gray-600">
//                 <tr>
//                   <th className="px-3 py-2 text-right">{locale === 'ar' ? 'السن' : 'Tooth'}</th>
//                   <th className="px-3 py-2 text-right">{locale === 'ar' ? 'الموضع' : 'Location'}</th>
//                   <th className="px-3 py-2 text-right">{locale === 'ar' ? 'الحالة' : 'Condition'}</th>
//                   <th className="px-3 py-2 text-right hidden md:table-cell">
//                     {locale === 'ar' ? 'حالة العصب / ملاحظات' : 'Pulp / Notes'}
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {Object.entries<any>(data.dentalChart).map(([toothKey, toothInfo]) => (
//                   <tr key={toothKey} className="hover:bg-gray-50">
//                     <td className="px-3 py-2 font-mono text-gray-800">{toothKey}</td>
//                     <td className="px-3 py-2 text-gray-700">{toothInfo.location}</td>
//                     <td className="px-3 py-2 text-gray-700">
//                       {toothInfo.condition || toothInfo.status}
//                     </td>
//                     <td className="px-3 py-2 text-gray-600 hidden md:table-cell">
//                       {[
//                         toothInfo.pulpStatus,
//                         toothInfo.percussion && `${locale === 'ar' ? 'طرق:' : 'Perc:'} ${toothInfo.percussion}`,
//                         toothInfo.mobility && `${locale === 'ar' ? 'حركة:' : 'Mob:'} ${toothInfo.mobility}`,
//                         toothInfo.status
//                       ]
//                         .filter(Boolean)
//                         .join(' • ')}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Periodontal Status */}
//       {data.periodontalStatus && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Activity className="w-4 h-4 text-green-600" />
//             {locale === 'ar' ? 'حالة اللثة والدعم' : 'Periodontal Status'}
//           </h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//             {Object.entries<any>(data.periodontalStatus).map(([k, v]) => (
//               <div key={k} className="flex justify-between bg-green-50/60 border border-green-100 rounded px-2 py-1">
//                 <span className="text-gray-600 capitalize">
//                   {locale === 'ar' ? k : k.replace(/([A-Z])/g, ' $1')}
//                 </span>
//                 <span className="font-medium text-green-800">{String(v)}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Procedure Details */}
//       {data.procedureDetails && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Scan className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'تفاصيل الإجراء' : 'Procedure Details'}
//           </h4>
//           <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-2 text-sm">
//             {data.procedureDetails.type && (
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{locale === 'ar' ? 'نوع الإجراء' : 'Type'}</span>
//                 <span className="font-medium text-blue-900">{data.procedureDetails.type}</span>
//               </div>
//             )}
//             {data.procedureDetails.anesthesia && (
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{locale === 'ar' ? 'التخدير' : 'Anesthesia'}</span>
//                 <span className="font-medium text-blue-900">{data.procedureDetails.anesthesia}</span>
//               </div>
//             )}
//             {Array.isArray(data.procedureDetails.steps) && data.procedureDetails.steps.length > 0 && (
//               <div>
//                 <p className="text-xs font-semibold text-gray-600 mb-1">
//                   {locale === 'ar' ? 'الخطوات' : 'Steps'}
//                 </p>
//                 <ul className="list-disc list-inside space-y-1 text-gray-800">
//                   {data.procedureDetails.steps.map((step: string, idx: number) => (
//                     <li key={idx}>{step}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {data.procedureDetails.workingLength && (
//               <div className="mt-1">
//                 <p className="text-xs font-semibold text-gray-600 mb-1">
//                   {locale === 'ar' ? 'أطوال القنوات (Working Length)' : 'Working Lengths'}
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs">
//                   {Object.entries<any>(data.procedureDetails.workingLength).map(([canal, length]) => (
//                     <div key={canal} className="flex justify-between bg-white/60 rounded px-2 py-1">
//                       <span className="text-gray-600 capitalize">{canal}</span>
//                       <span className="font-mono text-gray-800">{length}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Diagnosis & Plan */}
//       {(data.diagnosis || data.plan) && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <ClipboardList className="w-4 h-4 text-purple-500" />
//             {locale === 'ar' ? 'التشخيص والخطة' : 'Diagnosis & Plan'}
//           </h4>
//           <div className="bg-purple-50 border border-purple-200 rounded p-3 space-y-1 text-sm">
//             {data.diagnosis && (
//               <p className="font-medium text-purple-900">
//                 {locale === 'ar' ? 'التشخيص: ' : 'Diagnosis: '}
//                 <span className="font-normal">{data.diagnosis}</span>
//               </p>
//             )}
//             {data.plan && (
//               <p className="text-purple-900">
//                 {locale === 'ar' ? 'الخطة: ' : 'Plan: '}
//                 {data.plan}
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Medications */}
//       {Array.isArray(data.medicationsPrescribed) && data.medicationsPrescribed.length > 0 && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Pill className="w-4 h-4 text-green-600" />
//             {locale === 'ar' ? 'الأدوية الموصوفة' : 'Prescribed Medications'}
//           </h4>
//           <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
//             {data.medicationsPrescribed.map((m: string, idx: number) => (
//               <li key={idx}>{m}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // 4. Single Visit View Component
// // ============================================
// const SingleVisitView = ({ visit, locale, isExternal }: { visit: any, locale: string, isExternal?: boolean }) => {
//   const [selectedImage, setSelectedImage] = useState<{ url: string, title: string } | null>(null);

//   // Helper function to get specialty in English
//   const getSpecialtyKey = (specialtyObj: any) => {
//     if (!specialtyObj) return '';
//     if (typeof specialtyObj === 'string') return specialtyObj;
//     return specialtyObj.en || specialtyObj.ar || '';
//   };

//   // Specialized Data Payload Renderers
//   const renderDataPayload = (payload: any, specialty: any) => {
//     if (!payload) return null;
    
//     const specialtyKey = getSpecialtyKey(specialty).toLowerCase();
    
//     switch (true) {
//       case specialtyKey.includes('cardiology'):
//         return <CardiologyDataView data={payload} locale={locale} />;
//         // return <div>تمام يسطا اتشالت</div>
      
//       case specialtyKey.includes('ophthalmology') || specialtyKey.includes('eye'):
//         return <OphthalmologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('gastroenterology') || specialtyKey.includes('digestive'):
//         return <GastroenterologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('urology') || specialtyKey.includes('renal'):
//         return <UrologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('ent') || specialtyKey.includes('sinus'):
//         return <ENTDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('dermatology') || specialtyKey.includes('skin'):
//         return <DermatologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('internal medicine') || specialtyKey.includes('internal'):
//         return <InternalMedicineDataView data={payload} locale={locale} />;

//       case specialtyKey.includes('dentistry') || specialtyKey.includes('dental') || specialtyKey.includes('tooth'):
//         return <DentistryDataView data={payload} locale={locale} />;
      
//       default:
//         return <DefaultDataView data={payload} locale={locale} />;
//     }
//   };

//   return (
//     <>
//       <div className="border rounded-lg mb-3 bg-white">
//         <div className="p-4 border-b bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Calendar className="w-4 h-4 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">
//                 {new Date(visit.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
//                   weekday: 'long',
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </span>
//             </div>
//             <Badge variant="outline" className="text-xs">
//               {visit.type || 'Consultation'}
//             </Badge>
//           </div>
//           {visit.notes && (
//             <p className="text-sm text-gray-600 mt-2">{getLoc(visit.notes, locale)}</p>
//           )}
//         </div>
        
//         <div className="p-4">
//           {visit.records.map((rec: any) => (
//             <div key={rec.id} className="mb-4 last:mb-0">
//               {/* Record Header */}
//               <div className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded transition-colors group mb-3">
//                 <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
//                 <div className="flex-1">
//                   <h5 className="font-medium text-sm text-gray-900 flex justify-between">
//                       {getLoc(rec.title, locale)}
//                       <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">#{rec.id}</span>
//                   </h5>
//                   <p className="text-xs text-gray-500 mt-0.5">{getLoc(rec.description, locale)}</p>
//                 </div>
//               </div>

//               {/* Specialized Data Payload View */}
//               {rec.dataPayload && (
//                 <div className="mt-3 ms-9">
//                   <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 shadow-sm">
//                     <div className="mb-3">
//                       <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
//                         <FileText className="w-3 h-3" />
//                         {locale === 'ar' ? 'تفاصيل الفحص' : 'Examination Details'}
//                       </div>
//                       {renderDataPayload(rec.dataPayload, visit.specialty)}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Attachments Gallery */}
//               {rec.attachments && rec.attachments.length > 0 && (
//                   <div className="mt-4 ms-9">
//                     <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
//                       <ImageIcon className="w-3 h-3" />
//                       {locale === 'ar' ? 'المرفقات' : 'Attachments'}
//                     </div>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                        {rec.attachments.map((att: any) => (
//                            <div 
//                              key={att.id} 
//                              className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border cursor-zoom-in shadow-sm hover:shadow-md transition-all"
//                              onClick={(e) => { 
//                                e.stopPropagation(); 
//                                setSelectedImage({ url: att.url, title: att.title }); 
//                              }}
//                            >
//                                <img src={att.url} alt={att.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
//                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs text-center p-1 font-medium">
//                                    {att.title}
//                                </div>
//                                <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded text-white">
//                                    <ImageIcon className="w-3 h-3" />
//                                </div>
//                            </div>
//                        ))}
//                     </div>
//                   </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
//         <DialogContent className="max-w-4xl p-0 bg-black/95 border-none text-white overflow-hidden flex flex-col items-center justify-center h-[80vh] sm:h-auto">
//           {selectedImage && (
//             <>
//               <div className="absolute top-4 right-4 z-50">
//                  <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-white/20 text-white" onClick={() => setSelectedImage(null)}>
//                    <X className="w-5 h-5" />
//                  </Button>
//               </div>
//               <div className="w-full h-full flex items-center justify-center p-2 sm:p-6">
//                 <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl" />
//               </div>
//               <div className="w-full bg-black/80 p-4 text-center backdrop-blur-sm absolute bottom-0">
//                 <p className="font-medium text-sm sm:text-base">{selectedImage.title}</p>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// // ============================================
// // 5. Doctor Visit Card (Groups visits by doctor)
// // ============================================
// const DoctorVisitCard = ({ visits, locale, onRefill, isExternal }: { visits: any[], locale: string, onRefill?: () => void, isExternal?: boolean }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
  
//   if (visits.length === 0) return null;
  
//   const firstVisit = visits[0];
//   const sortedVisits = [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   const latestVisit = sortedVisits[0];
  
//   return (
//     <Card className={`border rounded-lg shadow-sm ${isExternal ? 'opacity-90' : ''}`}>
//       <CardHeader className="pb-3 pt-4 px-4">
//         <div className="flex items-start justify-between">
//           <div className="flex items-start gap-4">
//             <div className="hidden sm:flex flex-col items-center min-w-[60px] text-center border-e pe-4">
//               <span className="text-xs text-muted-foreground uppercase">{new Date(latestVisit.date).toLocaleString('default', { month: 'short' })}</span>
//               <span className="text-xl font-bold text-gray-800">{new Date(latestVisit.date).getDate()}</span>
//               <span className="text-xs text-muted-foreground">{new Date(latestVisit.date).getFullYear()}</span>
//             </div>

//             <div className="flex-1">
//               <h4 className="font-semibold text-base text-primary flex items-center gap-2">
//                 {getLoc(firstVisit.doctorName, locale)}
//                 <Badge variant="secondary" className="text-[10px] font-normal">
//                   {getLoc(firstVisit.specialty, locale)}
//                 </Badge>
//                 <Badge variant="outline" className="text-[10px] font-normal">
//                   {visits.length} {locale === 'ar' ? 'زيارة' : 'visits'}
//                 </Badge>
//               </h4>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                 <MapPin className="w-3 h-3"/> {getLoc(firstVisit.clinicName, locale)}
//               </div>
//               <div className="text-xs text-gray-500 mt-2">
//                 <span className="flex items-center gap-1">
//                   <Calendar className="w-3 h-3" />
//                   {locale === 'ar' ? 'آخر زيارة: ' : 'Last visit: '}
//                   {new Date(latestVisit.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col items-end gap-2">
//             {!isExternal && onRefill && (
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 className="text-blue-600 hover:bg-blue-50 gap-1 h-8"
//                 onClick={onRefill}
//               >
//                 <Repeat className="w-3 h-3" />
//                 {locale === 'ar' ? 'تكرار' : 'Refill'}
//               </Button>
//             )}
            
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-8 px-2"
//               onClick={() => setIsExpanded(!isExpanded)}
//             >
//               {isExpanded ? (
//                 <ChevronUp className="w-4 h-4" />
//               ) : (
//                 <ChevronDown className="w-4 h-4" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* External Badge */}
//         {isExternal && (
//           <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300 gap-1 absolute top-4 right-4">
//             <Lock className="w-3 h-3"/> Read-Only
//           </Badge>
//         )}
//       </CardHeader>

//       {isExpanded && (
//         <CardContent className="pt-0 px-4 pb-4 border-t">
//           <div className="space-y-4 mt-4">
//             {sortedVisits.map((visit) => (
//               <SingleVisitView 
//                 key={visit.id} 
//                 visit={visit} 
//                 locale={locale} 
//                 isExternal={isExternal}
//               />
//             ))}
//           </div>
//         </CardContent>
//       )}
//     </Card>
//   );
// };

// // ============================================
// // 6. Main Page Component
// // ============================================
// export default function PatientRecordDetail() {
//   const params = useParams();
//   const locale = (params.locale as string) || "ar";

//   // --- States ---
//   const [activeTab, setActiveTab] = useState("local");
//   const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

//   // Modal & Forms
//   const [isNewLogOpen, setIsNewLogOpen] = useState(false);
//   const [planInput, setPlanInput] = useState("");
//   const [assessmentInput, setAssessmentInput] = useState("");
//   const [allergyWarning, setAllergyWarning] = useState<string | null>(null);
//   const [soapError, setSoapError] = useState<string | null>(null);

//   // Security & OTP
//   const [isExternalUnlocked, setIsExternalUnlocked] = useState(false);
//   const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
//   const [timeLeft, setTimeLeft] = useState<string>("");
//   const [otpStep, setOtpStep] = useState<'reason' | 'method' | 'verify'>('reason');
//   const [accessReason, setAccessReason] = useState("");
//   const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | null>(null);
//   const [otpInput, setOtpInput] = useState("");

//   // --- Data Logic ---
//   const patient = useMemo(
//     () => dummyPatients.find((p) => p.id === params.id) || dummyPatients[0],
//     [params.id]
//   );

//   const localVisits = patient.visitsHistory.filter((v) => v.doctorId === CURRENT_DOCTOR_ID);
//   const externalVisits = patient.visitsHistory.filter((v) => v.doctorId !== CURRENT_DOCTOR_ID);
  
//   // Group visits by doctor
//   const groupVisitsByDoctor = (visits: any[]) => {
//     const grouped: Record<string, any[]> = {};
    
//     visits.forEach(visit => {
//       const doctorId = visit.doctorId;
//       if (!grouped[doctorId]) {
//         grouped[doctorId] = [];
//       }
//       grouped[doctorId].push(visit);
//     });
    
//     return grouped;
//   };
  
//   const groupedLocalVisits = groupVisitsByDoctor(localVisits);
//   const groupedExternalVisits = groupVisitsByDoctor(externalVisits);

//   // --- Clinical Priority Strip Data ---
//   const criticalAlerts = patient.alerts.filter(a => a.type === 'critical');
//   const chronicConditions = patient.alerts.filter(a => a.type === 'warning');

//   // --- Effect: Drug Interaction Check ---
//   useEffect(() => {
//     const lowerPlan = planInput.toLowerCase();
//     const hasPenicillinAllergy = patient.alerts.some(a => 
//       a.type === 'critical' && getLoc(a.msg, 'en').toLowerCase().includes('penicillin')
//     );
//     if (hasPenicillinAllergy && lowerPlan.includes('penicillin')) {
//       setAllergyWarning(locale === 'ar' ? "تنبيه خطير: المريض لديه حساسية من البنسلين!" : "CRITICAL: Patient has Penicillin allergy!");
//     } else {
//       setAllergyWarning(null);
//     }
//   }, [planInput, patient, locale]);

//   // --- Effect: Countdown Timer ---
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isExternalUnlocked && sessionExpiry) {
//       interval = setInterval(() => {
//         const now = Date.now();
//         const diff = sessionExpiry - now;
//         if (diff <= 0) handleEndSession();
//         else {
//           const minutes = Math.floor(diff / 60000);
//           const seconds = Math.floor((diff % 60000) / 1000);
//           setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
//         }
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isExternalUnlocked, sessionExpiry]);

//   // --- Handlers ---
//   const handleVerifyOTP = () => {
//     if (otpInput === "1234") {
//       setIsExternalUnlocked(true);
//       setSessionExpiry(Date.now() + 60 * 60 * 1000);
//       setOtpStep('reason'); 
//       setOtpInput("");
//       setAccessReason("");
//     } else {
//       alert("Invalid OTP");
//     }
//   };

//   const handleEndSession = () => {
//     setIsExternalUnlocked(false);
//     setSessionExpiry(null);
//     setTimeLeft("");
//   };

//   const handleRefill = (doctorId: string, prevNotes: string) => {
//     setPlanInput(prevNotes + (locale === 'ar' ? "\n(تكرار العلاج - Refill)" : "\n(Refill)"));
//     setIsNewLogOpen(true);
//   };

//   const handleSaveSOAP = () => {
//       // SOAP Validation
//       if (planInput.trim().length > 0 && assessmentInput.trim().length === 0) {
//           setSoapError(locale === 'ar' ? "لا يمكن حفظ خطة علاج بدون تشخيص (Assessment)" : "Cannot save Plan without Assessment");
//           return;
//       }
//       setSoapError(null);
//       setIsNewLogOpen(false);
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-50/30 dark:bg-gray-950 transition-colors"
//       dir={locale === 'ar' ? 'rtl' : 'ltr'}
//     >
      
//       {/* 🚀 CLINICAL PRIORITY STRIP (Sticky Header) */}
//       <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b dark:border-gray-800 shadow-sm px-4 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar">
//          {/* Critical Alerts */}
//          {criticalAlerts.length > 0 && (
//              <Badge
//                variant="destructive"
//                className="flex items-center gap-1 animate-pulse px-3 py-1 text-xs cursor-pointer"
//              >
//                  <AlertTriangle className="w-3 h-3" />
//                  {getLoc(criticalAlerts[0].msg, locale)}
//              </Badge>
//          )}
//          {/* Chronic Conditions */}
//          {chronicConditions.length > 0 && (
//              <Badge
//                variant="outline"
//                className="flex items-center gap-1 border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 px-3 py-1 text-xs cursor-pointer"
//              >
//                  <Info className="w-3 h-3" />
//                  {getLoc(chronicConditions[0].msg, locale)}
//              </Badge>
//          )}
//          {/* Medications */}
//          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors">
//             <Pill className="w-3 h-3" />
//             <span className="font-semibold">{locale === 'ar' ? 'الأدوية الحالية:' : 'Meds:'}</span>
//             <span className="truncate max-w-[200px]">{patient.currentMedications ? patient.currentMedications.join(", ") : 'None'}</span>
//          </div>
//          {/* Last Visit */}
//          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full ml-auto">
//              <History className="w-3 h-3" />
//              {locale === 'ar' ? 'آخر زيارة: منذ 3 أيام' : 'Last visit: 3 days ago'}
//          </div>
         
//          {/* Enterprise Actions */}
//          <div className="flex items-center gap-1 border-l pl-2 border-gray-300">
//              <TooltipProvider>
//                  <Tooltip>
//                      <TooltipTrigger asChild>
//                          <Button variant="ghost" size="icon" className="h-7 w-7"><FileDown className="w-4 h-4 text-gray-500"/></Button>
//                      </TooltipTrigger>
//                      <TooltipContent>Export PDF</TooltipContent>
//                  </Tooltip>
//                  <Tooltip>
//                      <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-7 w-7"><Flag className="w-4 h-4 text-gray-500"/></Button>
//                      </TooltipTrigger>
//                      <TooltipContent>Flag for Follow-up</TooltipContent>
//                  </Tooltip>
//              </TooltipProvider>
//          </div>
//       </div>

//       <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 w-full">

//       {/* Header Info */}
//       <div className="flex flex-col md:flex-row gap-6 items-start">
//             <div className="relative shrink-0">
//               <Avatar className="w-20 h-20 border-4 border-white shadow-sm">
//                 <AvatarImage src={patient.avatar} />
//                 <AvatarFallback>{getLoc(patient.name, locale)[0]}</AvatarFallback>
//               </Avatar>
//               <Badge className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] ${getLoc(patient.status.code, 'en') === 'Stable' ? 'bg-green-500' : 'bg-red-500'}`}>
//                 {getLoc(patient.status.code, locale)}
//               </Badge>
//             </div>
            
//             <div className="flex-1 min-w-0">
//                   <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
//                     {getLoc(patient.name, locale)}
//                   </h1>
//                   <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
//                       <span className="flex items-center gap-1"><User className="w-3 h-3"/> {getLoc(patient.gender, locale)}, {2024 - parseInt(patient.dateOfBirth.split('-')[0])}yo</span>
//                       <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> <span dir="ltr">{patient.contactPhone}</span></span>
//                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {getLoc(patient.address, locale)}</span>
//                   </div>
//             </div>

//             {/* New Record Button */}
//             <div className="shrink-0">
//                 <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="gap-2 shadow-sm bg-blue-600 hover:bg-blue-700" onClick={() => { setPlanInput(""); setAssessmentInput(""); setSoapError(null); }}>
//                       <Plus className="w-4 h-4" /> 
//                       {locale === 'ar' ? 'سجل جديد' : 'New Record'}
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//                       <div className="flex h-full overflow-hidden">
//                           {/* Sidebar */}
//                           <div className="w-[280px] bg-gray-50 dark:bg-gray-900 border-e dark:border-gray-800 p-4 overflow-y-auto hidden md:block text-sm">
//                               <h3 className="font-bold text-gray-500 dark:text-gray-300 uppercase text-xs mb-3">Patient Summary</h3>
//                               {/* Quick Allergies */}
//                               <div className="mb-4">
//                                   {patient.alerts.map((a,i) => (
//                                     <div
//                                       key={i}
//                                       className="text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 p-2 rounded mb-1"
//                                     >
//                                       {getLoc(a.msg, locale)}
//                                     </div>
//                                   ))}
//                               </div>
//                               <Separator className="mb-4"/>
//                               <div className="space-y-2">
//                                   <div className="flex justify-between"><span>BP</span> <span className="font-mono font-bold">{patient.vitalSigns.bloodPressure}</span></div>
//                                   <div className="flex justify-between"><span>HR</span> <span className="font-mono font-bold">{patient.vitalSigns.heartRate}</span></div>
//                               </div>
//                           </div>
//                           {/* Form */}
//                           <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-950">
//                               <DialogHeader className="p-5 border-b">
//                                   <DialogTitle>New SOAP Note</DialogTitle>
//                               </DialogHeader>
//                               <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                                   {/* SOAP Fields */}
//                                   <div><Label className="text-blue-600 font-bold mb-1 block">Subjective</Label><Textarea className="bg-blue-50/20"/></div>
//                                   <div><Label className="text-green-600 font-bold mb-1 block">Objective</Label><Textarea className="bg-green-50/20"/></div>
//                                   <div>
//                                       <Label className="text-purple-600 font-bold mb-1 block">Assessment <span className="text-red-500">*</span></Label>
//                                       <Input 
//                                         className="bg-purple-50/20" 
//                                         value={assessmentInput}
//                                         onChange={(e) => setAssessmentInput(e.target.value)}
//                                         placeholder="Diagnosis..."
//                                       />
//                                   </div>
//                                   <div>
//                                       <Label className="text-orange-600 font-bold mb-1 block">Plan</Label>
//                                       {allergyWarning && (
//                                         <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs rounded font-bold animate-pulse">
//                                           {allergyWarning}
//                                         </div>
//                                       )}
//                                       <Textarea 
//                                         className="bg-orange-50/20 dark:bg-orange-900/20 min-h-[100px]" 
//                                         value={planInput} 
//                                         onChange={(e) => setPlanInput(e.target.value)}
//                                       />
//                                   </div>
//                                   {soapError && (
//                                     <div className="text-red-600 dark:text-red-300 text-sm font-semibold bg-red-50 dark:bg-red-900/40 p-2 rounded">
//                                       {soapError}
//                                     </div>
//                                   )}
//                               </div>
//                               <DialogFooter className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
//                                   <Button onClick={handleSaveSOAP}>Save Record</Button>
//                               </DialogFooter>
//                           </div>
//                       </div>
//                   </DialogContent>
//                 </Dialog>
//             </div>
//       </div>

//       <div className="grid grid-cols-12 gap-6">
        
//         {/* LEFT COLUMN: Vitals (Sparklines) */}
//         <div className="col-span-12 lg:col-span-3 space-y-6">
//           <Card className="shadow-sm border-gray-200 dark:border-gray-800 dark:bg-gray-900">
//             <CardHeader className="pb-2 pt-4 px-4">
//                <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
//                   <TrendingUp className="w-4 h-4 text-blue-500" />
//                   {locale === 'ar' ? 'المؤشرات الحيوية' : 'Vital Trends'}
//                </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 px-4 pb-4">
//                {/* Heart Rate */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
//                     <span>Heart Rate</span>
//                   </div>
//                   <SmartSparkline data={patient.vitalSigns.history.heartRate} minNormal={60} maxNormal={100} unit="bpm" />
//                </div>
//                {/* BP */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
//                     <span>BP (Systolic)</span>
//                   </div>
//                   <SmartSparkline data={patient.vitalSigns.history.bloodPressure} minNormal={110} maxNormal={130} unit="mmHg" />
//                </div>
//                {/* Glucose */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
//                     <span>Glucose</span>
//                   </div>
//                   <SmartSparkline data={patient.vitalSigns.history.glucose} minNormal={70} maxNormal={140} unit="mg/dL" />
//                </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN: Visits & Actions */}
//         <div className="col-span-12 lg:col-span-9 space-y-6">
          
//           {/* 🧠 DECISION-ORIENTED UI: Suggested Actions */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <Button
//                 variant="outline"
//                 className="h-auto py-3 px-4 justify-start gap-3 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-100 dark:border-blue-900 hover:border-blue-200 shadow-sm group"
//               >
//                   <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full group-hover:bg-blue-200">
//                     <Repeat className="w-4 h-4"/>
//                   </div>
//                   <div className="text-start">
//                       <div className="text-sm font-semibold text-gray-900">Refill Prescriptions</div>
//                       <div className="text-[10px] text-gray-500">Metformin, Lisinopril</div>
//                   </div>
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-auto py-3 px-4 justify-start gap-3 bg-white dark:bg-gray-900 hover:bg-yellow-50 dark:hover:bg-yellow-950 border-yellow-100 dark:border-yellow-900 hover:border-yellow-200 shadow-sm group"
//               >
//                   <div className="p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 rounded-full group-hover:bg-yellow-200">
//                     <Stethoscope className="w-4 h-4"/>
//                   </div>
//                   <div className="text-start">
//                       <div className="text-sm font-semibold text-gray-900">Review HR Trend</div>
//                       <div className="text-[10px] text-gray-500">Elevated in last 2 visits</div>
//                   </div>
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-auto py-3 px-4 justify-start gap-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm group"
//               >
//                    <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-full">
//                      <GitCommitHorizontal className="w-4 h-4"/>
//                    </div>
//                    <div className="text-start">
//                       <div className="text-sm font-semibold text-gray-900">Lab Results</div>
//                       <div className="text-[10px] text-gray-500">Pending from 12/12</div>
//                    </div>
//               </Button>
//           </div>

//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 sm:gap-0">
//                 <TabsList className="w-full sm:w-auto grid grid-cols-2">
//                     <TabsTrigger value="local">{locale === 'ar' ? 'سجلات محلية' : 'Local Records'}</TabsTrigger>
//                     <TabsTrigger value="external" className="relative">
//                         {locale === 'ar' ? 'سجلات خارجية' : 'External Records'}
//                         {isExternalUnlocked && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"/>}
//                     </TabsTrigger>
//                 </TabsList>
                
//                 {/* Timeline Toggle */}
//                 {activeTab === 'local' && (
//                     <div className="flex bg-gray-100 p-1 rounded-lg mt-2 sm:mt-0">
//                         <button
//                           type="button"
//                           aria-label={locale === 'ar' ? 'عرض قائمة' : 'List view'}
//                           onClick={() => setViewMode('list')}
//                           className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-black dark:bg-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}
//                         >
//                           <List className="w-4 h-4"/>
//                         </button>
//                         <button
//                           type="button"
//                           aria-label={locale === 'ar' ? 'عرض تسلسلي زمني' : 'Timeline view'}
//                           onClick={() => setViewMode('timeline')}
//                           className={`p-1.5 rounded ${viewMode === 'timeline' ? 'bg-white shadow text-black dark:bg-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}
//                         >
//                           <LayoutList className="w-4 h-4"/>
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* LOCAL TAB */}
//             <TabsContent value="local" className="space-y-4">
//                {Object.keys(groupedLocalVisits).length > 0 ? (
//                   viewMode === 'list' ? (
//                       // List View with grouped visits by doctor
//                       Object.entries(groupedLocalVisits).map(([doctorId, visits]) => (
//                         <DoctorVisitCard 
//                             key={doctorId}
//                             visits={visits}
//                             locale={locale}
//                             onRefill={() => handleRefill(doctorId, getLoc(visits[0].notes, locale))}
//                         />
//                       ))
//                   ) : (
//                       // Timeline View
//                       <div className="relative border-s-2 border-gray-200 dark:border-gray-700 ms-4 space-y-8 py-4">
//                           {localVisits.map((visit) => (
//                               <div key={visit.id} className="ms-6 relative">
//                                   <span className="absolute -left-[33px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
//                                       <CheckCircle2 className="h-4 w-4 text-blue-600" />
//                                   </span>
//                                   <div className="text-xs text-gray-500 mb-1 font-mono">{visit.date}</div>
//                                   <SingleVisitView visit={visit} locale={locale} />
//                               </div>
//                           ))}
//                       </div>
//                   )
//                ) : (
//                  // 🎯 Smart Empty State
//                  <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
//                     <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-3">
//                       <FileText className="w-8 h-8 text-gray-400"/>
//                     </div>
//                     <h3 className="font-semibold text-gray-900 dark:text-gray-100">
//                       {locale === 'ar' ? 'لا توجد سجلات محلية' : 'No Local Records Yet'}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-4">
//                       {locale === 'ar' ? 'ابدأ بإضافة أول زيارة لهذا المريض' : 'Start by creating the first consultation log for this patient.'}
//                     </p>
//                     <Button variant="outline" onClick={() => { setPlanInput(""); setIsNewLogOpen(true); }}>
//                         <Plus className="w-4 h-4 mr-2"/>
//                         {locale === 'ar' ? 'إضافة زيارة' : 'Add First Visit'}
//                     </Button>
//                  </div>
//                )}
//             </TabsContent>

//             {/* EXTERNAL TAB */}
//             <TabsContent value="external" className="space-y-4">
//               {!isExternalUnlocked ? (
//                  <Card className="bg-gray-50/50 dark:bg-gray-900/70 border-dashed border-2 dark:border-gray-700 p-8">
//                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
//                       <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
//                         <Lock className="w-10 h-10 text-gray-400 dark:text-gray-300" />
//                       </div>
                      
//                       {/* Step 1: Reason for Access (Audit Log) */}
//                       {otpStep === 'reason' && (
//                           <div className="w-full space-y-4 animate-in fade-in">
//                               <h3 className="font-semibold text-gray-900 dark:text-gray-100">
//                                 Reason for Accessing External Data
//                               </h3>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 This action will be recorded in the audit log.
//                               </p>
                              
//                               <RadioGroup value={accessReason} onValueChange={setAccessReason} className="grid grid-cols-1 gap-2 text-start">
//                                   <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-3 rounded border dark:border-gray-700 cursor-pointer hover:border-blue-400">
//                                       <RadioGroupItem value="consultation" id="r1" />
//                                       <Label htmlFor="r1" className="cursor-pointer font-normal">Regular Consultation</Label>
//                                   </div>
//                                   <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-3 rounded border dark:border-gray-700 cursor-pointer hover:border-blue-400">
//                                       <RadioGroupItem value="emergency" id="r2" />
//                                       <Label htmlFor="r2" className="cursor-pointer font-normal">Emergency / Urgent Care</Label>
//                                   </div>
//                               </RadioGroup>
//                               <Button className="w-full" disabled={!accessReason} onClick={() => setOtpStep('method')}>Next</Button>
//                           </div>
//                       )}

//                       {/* Step 2: Choose Method */}
//                       {otpStep === 'method' && (
//                         <div className="grid grid-cols-2 gap-4 w-full animate-in fade-in slide-in-from-right-4">
//                           <Button
//                             variant="outline"
//                             className="h-24 flex flex-col gap-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
//                             onClick={() => { setSelectedMethod('sms'); setOtpStep('verify'); }}
//                           >
//                             <MessageSquare className="w-6 h-6 text-blue-600" />
//                             <span className="text-xs font-semibold">SMS ••••890</span>
//                           </Button>
//                           <Button
//                             variant="outline"
//                             className="h-24 flex flex-col gap-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
//                             onClick={() => { setSelectedMethod('email'); setOtpStep('verify'); }}
//                           >
//                             <Mail className="w-6 h-6 text-blue-600" />
//                             <span className="text-xs font-semibold">Email</span>
//                           </Button>
//                         </div>
//                       )}

//                       {/* Step 3: Verify */}
//                       {otpStep === 'verify' && (
//                         <div className="w-full space-y-4 animate-in fade-in">
//                            <div className="text-sm text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 py-2 rounded flex items-center justify-center gap-2">
//                               {selectedMethod === 'sms' ? <MessageSquare className="w-4 h-4"/> : <Mail className="w-4 h-4"/>}
//                               Code Sent
//                            </div>
//                            <Input 
//                               placeholder="0000" 
//                               className="text-center text-2xl tracking-[1em] font-mono h-12" 
//                               maxLength={4}
//                               value={otpInput}
//                               onChange={(e) => setOtpInput(e.target.value)}
//                             />
//                             <Button className="w-full" onClick={handleVerifyOTP}>Verify (1234)</Button>
//                             <Button
//                               variant="link"
//                               size="sm"
//                               onClick={() => setOtpStep('method')}
//                               className="text-gray-400 dark:text-gray-300"
//                             >
//                               Back
//                             </Button>
//                         </div>
//                       )}
//                    </div>
//                  </Card>
//               ) : (
//                 <div className="space-y-4 animate-in fade-in">
//                    <div className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-900 rounded-lg p-3 flex justify-between items-center">
//                       <div className="flex items-center gap-3 text-green-800 dark:text-green-200">
//                         <ShieldCheck className="w-5 h-5" />
//                         <div>
//                             <span className="font-bold text-sm block">{locale === 'ar' ? 'جلسة خارجية نشطة' : 'Active External Session'}</span>
//                             <span className="text-[10px] opacity-80 block">Access Reason: {accessReason}</span>
//                         </div>
//                       </div>
//                        <div className="flex items-center gap-3">
//                          <div className="flex items-center gap-2 bg-white dark:bg-green-950 px-3 py-1 rounded border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 font-mono font-bold">
//                             <Timer className="w-4 h-4 animate-pulse" />
//                             {timeLeft}
//                          </div>
//                          <Button variant="destructive" size="sm" onClick={handleEndSession}>
//                             <LogOut className="w-4 h-4" />
//                          </Button>
//                       </div>
//                    </div>
                   
//                    {Object.entries(groupedExternalVisits).map(([doctorId, visits]) => (
//                      <DoctorVisitCard 
//                        key={doctorId}
//                        visits={visits}
//                        locale={locale}
//                        isExternal
//                      />
//                    ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }


// هذه نهاية ال كود اللي كان شغال قبل عمل البلاجن ميه ميه كل اللي تحته دا تجارب سابقه واللي فوق دا اخر نسخه انا استقريت عليها 




















// "use client";

// import React, { useCallback, useMemo, useState, use } from "react";
// import { Link } from "@/i18n/navigation";
// import { Edit3, ChevronRight, Plus, Search, ListFilter, Trash2, Info, ClipboardList, Microscope, FileArchive } from "lucide-react";
// import { 
//   ArrowRight, 
//   Printer, 
//   Download, 
//   Activity, 
//   Heart, 
//   Thermometer, 
//   Droplet, 
//   Phone, 
//   Mail, 
//   MapPin, 
//   Briefcase, 
//   AlertTriangle, 
//   Stethoscope, 
//   FlaskRound, 
//   Scan, 
//   Globe, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   Shield, 
//   FileText, 
//   Pill, 
//   Clock 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useRouter } from "next/navigation";

// import { Patient, CURRENT_DOCTOR_ID, SourceInfo } from "../types";
// import { dummyPatients } from "../data";
// import { OTPModal } from "../OTPModal";
// import { SourceBadge, LockedOverlay, AccessControlCard } from "../AccessControl";

// // ============================================
// // Helper Functions
// // ============================================

// function calculateAge(dateOfBirth: string): number {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

// const getAlertColor = (type: string) => {
//   switch (type) {
//     case "critical": return "bg-red-100 text-red-800 border border-red-200";
//     case "warning": return "bg-amber-100 text-amber-800 border border-amber-200";
//     default: return "bg-blue-100 text-blue-800 border border-blue-200";
//   }
// };

// const isLocalRecord = (source: SourceInfo): boolean => {
//   return source.doctorId === CURRENT_DOCTOR_ID;
// };

// // ============================================
// // Sub Components
// // ============================================

// const VitalCard = React.memo(function VitalCard({ title, value, unit, icon }: any) {
//   if (!value) return null;
//   return (
//     <div className="p-3 sm:p-4 rounded-xl border bg-card shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
//       <div>
//         <p className="text-xs text-muted-foreground mb-1 font-medium">{title}</p>
//         <div className="flex items-end gap-1">
//           <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{value}</span>
//           <span className="text-xs text-muted-foreground mb-1">{unit}</span>
//         </div>
//       </div>
//       <div className="p-2 rounded-full bg-muted">{icon}</div>
//     </div>
//   );
// });

// const SectionHeader = ({ icon, title, action }: any) => (
//   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
//     <div className="flex items-center gap-2">
//       <div className="p-2 rounded-md bg-muted">{icon}</div>
//       <h3 className="text-base sm:text-lg font-bold text-foreground">{title}</h3>
//     </div>
//     {action}
//   </div>
// );

// // ============================================
// // Main Page Component
// // ============================================

// export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
//   const router = useRouter();
  
//   // فك التغليف باستخدام hook "use"
//   const { id } = use(params);

//   // البحث عن المريض
//   const selectedPatient = useMemo(() => {
//     const decodedId = decodeURIComponent(id); 
//     return dummyPatients.find(p => p.id === decodedId);
//   }, [id]);

//   const [activeTab, setActiveTab] = useState<string>("overview");
//   const [isGlobalAccessUnlocked, setIsGlobalAccessUnlocked] = useState(false);
//   const [showOTPModal, setShowOTPModal] = useState(false);
//   const [showGlobalRecords, setShowGlobalRecords] = useState(false);

//   const handleOTPSuccess = useCallback(() => {
//     setIsGlobalAccessUnlocked(true);
//     setShowOTPModal(false);
//     setShowGlobalRecords(true);
//   }, []);

//   const requestGlobalAccess = useCallback(() => {
//     setShowOTPModal(true);
//   }, []);

//   const getLocalRecords = useCallback(<T extends { source: SourceInfo }>(records: T[] | undefined): T[] => {
//       return (records || []).filter((r) => isLocalRecord(r.source));
//     }, []);

//   const getGlobalRecords = useCallback(<T extends { source: SourceInfo }>(records: T[] | undefined): T[] => {
//       return (records || []).filter((r) => !isLocalRecord(r.source));
//     }, []);

//   // التحقق من وجود المريض
//   if (!selectedPatient) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4" dir="rtl">
//         <h2 className="text-2xl font-bold text-muted-foreground">المريض غير موجود</h2>
//         <p className="text-muted-foreground">رقم الملف: {id}</p>
//         <Button onClick={() => router.back()}>العودة للقائمة</Button>
//       </div>
//     );
//   }

//   // ============================================
//   // Render Content
//   // ============================================

//   const renderOverviewTab = () => {
//     const localDiagnoses = getLocalRecords(selectedPatient.diagnoses);
//     const globalDiagnoses = getGlobalRecords(selectedPatient.diagnoses);
//     const localMedications = getLocalRecords(selectedPatient.medications);
//     const globalMedications = getGlobalRecords(selectedPatient.medications);
//     const localVisits = getLocalRecords(selectedPatient.visitNotes);
    
//     return (
//       <div className="space-y-6 animate-in fade-in duration-500">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-background rounded-lg">
//               {showGlobalRecords ? <Globe className="h-5 w-5 text-primary" /> : <Shield className="h-5 w-5 text-[hsl(var(--medical-local))]" />}
//             </div>
//             <div>
//               <p className="font-medium">{showGlobalRecords ? "السجل الطبي الموحد" : "سجلاتي المحلية"}</p>
//               <p className="text-sm text-muted-foreground">{showGlobalRecords ? "عرض جميع السجلات من كافة المصادر" : "السجلات التي أدخلتها أنا فقط"}</p>
//             </div>
//           </div>
//           <Button variant={showGlobalRecords ? "default" : "outline"} onClick={() => {
//               if (!showGlobalRecords && !isGlobalAccessUnlocked) requestGlobalAccess();
//               else setShowGlobalRecords(!showGlobalRecords);
//             }} className="gap-2 w-full sm:w-auto">
//             {showGlobalRecords ? <><EyeOff className="h-4 w-4" /><span className="hidden sm:inline">إخفاء السجل الموحد</span></> : <>{isGlobalAccessUnlocked ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}<span className="hidden sm:inline">عرض السجل الموحد</span></>}
//           </Button>
//         </div>

//         <section>
//           <SectionHeader icon={<FileText size={18} />} title="التشخيصات النشطة" />
//           <div className="space-y-2 mb-4">
//             {localDiagnoses.map((diag, i) => (
//               <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-xl access-card-local gap-3">
//                 <div className="flex items-center gap-3">
//                   <SourceBadge isLocal={true} />
//                   <div>
//                     <p className="font-semibold">{diag.description}</p>
//                     <p className="text-xs text-muted-foreground">كود: {diag.code || "-"}</p>
//                   </div>
//                 </div>
//                 <span className="h-2 w-2 rounded-full bg-green-500 self-start sm:self-auto" />
//               </div>
//             ))}
//           </div>
//           {showGlobalRecords && globalDiagnoses.map((diag, i) => (
//             <AccessControlCard key={i} isLocal={false} isGlobalUnlocked={isGlobalAccessUnlocked} onRequestAccess={requestGlobalAccess} className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
//               <div className="flex items-center gap-3">
//                 <SourceBadge isLocal={false} />
//                 <div>
//                   <p className="font-semibold">{diag.description}</p>
//                   <p className="text-xs text-muted-foreground">كود: {diag.code || "-"} | {diag.source.createdAt}</p>
//                 </div>
//               </div>
//             </AccessControlCard>
//           ))}
//           {!showGlobalRecords && globalDiagnoses.length > 0 && (
//             <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
//               <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
//               <p className="text-sm text-muted-foreground">يوجد {globalDiagnoses.length} تشخيص إضافي في السجل الموحد</p>
//               <Button variant="link" size="sm" onClick={requestGlobalAccess} className="mt-1">طلب الوصول</Button>
//             </div>
//           )}
//         </section>

//         <section>
//           <SectionHeader icon={<Pill size={18} />} title="الأدوية الحالية" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//             {localMedications.map((med, i) => (
//               <div key={i} className="flex items-start gap-3 p-3 rounded-xl border access-card-local bg-card">
//                 <div className="bg-muted p-2 rounded-lg text-primary"><Pill size={16} /></div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
//                     <div className="flex items-center gap-2">
//                       <p className="font-medium truncate">{med.name}</p>
//                       <SourceBadge isLocal={true} />
//                     </div>
//                     <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">{med.dose}</span>
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">{med.freq} - {med.indication}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {!showGlobalRecords && globalMedications.length > 0 && (
//             <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
//               <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
//               <p className="text-sm text-muted-foreground">يوجد {globalMedications.length} دواء إضافي في السجل الموحد</p>
//             </div>
//           )}
//         </section>

//         <section>
//             <SectionHeader icon={<Clock size={18} />} title="آخر الزيارات" />
//             <div className="space-y-2">
//             {localVisits.slice(0, 3).map((visit, i) => (
//                 <div key={i} className="p-4 bg-card border rounded-lg access-card-local">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
//                     <div className="flex items-center gap-2">
//                     <Badge variant="outline">{visit.date}</Badge>
//                     <SourceBadge isLocal={true} />
//                     </div>
//                     <span className="text-sm text-muted-foreground">{visit.doctorName}</span>
//                 </div>
//                 <p className="text-sm">{visit.notes}</p>
//                 </div>
//             ))}
//             </div>
//         </section>
//       </div>
//     );
//   };

//   const renderLabsTab = () => {
//     const localLabs = getLocalRecords(selectedPatient.labTests);
//     const globalLabs = getGlobalRecords(selectedPatient.labTests);
//     return (
//       <div className="space-y-6 animate-in fade-in duration-500">
//         <SectionHeader icon={<FlaskRound size={18} />} title="نتائج المختبر" action={
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="badge-local border">محلي: {localLabs.length}</Badge>
//               <Badge variant="outline" className="badge-global border">خارجي: {globalLabs.length}</Badge>
//             </div>
//           } />
//         <div className="overflow-x-auto rounded-xl border">
//              <table className="w-full text-right text-sm min-w-[600px]">
//                  <thead className="bg-muted/50 text-muted-foreground">
//                     <tr><th className="p-3">الفحص</th><th className="p-3">النتيجة</th><th className="p-3">الحالة</th><th className="p-3">التاريخ</th></tr>
//                  </thead>
//                  <tbody className="divide-y">
//                      {localLabs.map((test, i) => (
//                          <tr key={i} className="hover:bg-muted/30">
//                              <td className="p-3 font-medium">{test.testName}</td>
//                              <td className="p-3 font-mono">{test.result} {test.unit}</td>
//                              <td className="p-3"><Badge variant={test.status === "high" ? "destructive" : test.status === "low" ? "secondary" : "default"}>{test.status}</Badge></td>
//                              <td className="p-3 text-muted-foreground">{test.date}</td>
//                          </tr>
//                      ))}
//                  </tbody>
//              </table>
//         </div>
//         {globalLabs.length > 0 && (
//           <div className="relative mt-6">
//             <h4 className="font-medium mb-3 flex items-center gap-2">
//               <span className="h-2 w-2 rounded-full bg-[hsl(var(--medical-global))]" />
//               تحاليل السجل الموحد
//             </h4>
//             {isGlobalAccessUnlocked ? (
//                <div className="overflow-x-auto rounded-xl border animate-unlock">
//                     <div className="p-4 text-center text-muted-foreground">تم عرض التحاليل الخارجية ({globalLabs.length})</div>
//                </div>
//             ) : (
//               <div className="relative rounded-xl border overflow-hidden">
//                 <div className="blur-content p-8 bg-muted/20"><div className="h-24" /></div>
//                 <LockedOverlay onRequestAccess={requestGlobalAccess} />
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderRadiologyTab = () => {
//     const localRadiology = getLocalRecords(selectedPatient.radiology);
//     return (
//         <div className="space-y-6 animate-in fade-in duration-500">
//             <SectionHeader icon={<Scan size={18} />} title="تقارير الأشعة" />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {localRadiology.map((r, i) => (
//                     <Card key={i} className="access-card-local">
//                         <CardHeader className="pb-3">
//                             <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
//                                 <div><CardTitle className="text-base">{r.type}</CardTitle><p className="text-sm text-muted-foreground">{r.doctor}</p></div>
//                                 <Badge variant="secondary">{r.date}</Badge>
//                             </div>
//                         </CardHeader>
//                         <CardContent><p className="text-sm">{r.description}</p>{r.bodyPart && <Badge variant="outline" className="mt-2">{r.bodyPart}</Badge>}</CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
//   };

//   const renderGlobalRecordTab = () => {
//     const globalDiagnoses = getGlobalRecords(selectedPatient.diagnoses);
//     const globalMedications = getGlobalRecords(selectedPatient.medications);
//     const globalLabs = getGlobalRecords(selectedPatient.labTests);
//     const globalRadiology = getGlobalRecords(selectedPatient.radiology);
//     const globalVisits = getGlobalRecords(selectedPatient.visitNotes);
//     const totalGlobal = globalDiagnoses.length + globalMedications.length + globalLabs.length + globalRadiology.length + globalVisits.length;

//     if (!isGlobalAccessUnlocked) {
//       return (
//         <div className="flex flex-col items-center justify-center py-16 px-4">
//           <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6"><Lock className="h-12 w-12 text-muted-foreground" /></div>
//           <h3 className="text-xl font-semibold mb-2 text-center">الوصول مقيد</h3>
//           <p className="text-muted-foreground text-center max-w-md mb-6 text-base">السجل الطبي الموحد يحتوي على {totalGlobal} سجل من مصادر خارجية. للوصول إليها، يجب الحصول على موافقة المريض عبر رمز OTP.</p>
//           <Button onClick={requestGlobalAccess} size="lg" className="gap-2"><Shield className="h-5 w-5" /> طلب الوصول عبر OTP</Button>
//         </div>
//       );
//     }
//     return (
//       <div className="space-y-6 animate-unlock">
//         <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
//           <div className="flex items-center gap-3"><Shield className="h-6 w-6 text-primary" /><div><p className="font-medium text-primary text-base">تم فتح السجل الموحد</p><p className="text-sm text-muted-foreground">الوصول متاح لهذه الجلسة فقط</p></div></div>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//           <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalDiagnoses.length}</p><p className="text-xs text-muted-foreground">تشخيصات</p></Card>
//           <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalMedications.length}</p><p className="text-xs text-muted-foreground">أدوية</p></Card>
//           <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalLabs.length}</p><p className="text-xs text-muted-foreground">تحاليل</p></Card>
//           <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalRadiology.length}</p><p className="text-xs text-muted-foreground">أشعة</p></Card>
//           <Card className="p-3 text-center"><p className="text-2xl font-bold">{globalVisits.length}</p><p className="text-xs text-muted-foreground">زيارات</p></Card>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6" dir="rtl">
      
//       {/* ========================================================= */}
//       {/* شريط التنقل (Breadcrumbs) والتحكم الجديد */}
//       {/* ========================================================= */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center text-sm text-muted-foreground">
//           <Link href="/records" className="hover:text-primary transition-colors">
//             قائمة السجلات
//           </Link>
//           <ChevronRight className="h-4 w-4 mx-1 rtl:rotate-180" />
//           <span className="font-semibold text-foreground">{selectedPatient.name}</span>
//         </div>
//         <Button variant="outline" asChild>
//           <Link href={`/records/${selectedPatient.id}/edit`}>
//             <Edit3 className="mr-2 h-4 w-4" />
//             تعديل البيانات
//           </Link>
//         </Button>
//       </div>

//       {/* باقي المحتوى */}
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex items-center gap-4">
//             <div className="flex items-center gap-4">
//                 <img src={selectedPatient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPatient.name)}&background=3b82f6&color=fff`} alt={selectedPatient.name} className="h-16 w-16 rounded-full border-4 border-background shadow-sm"/>
//                 <div>
//                     <h1 className="text-2xl font-bold">{selectedPatient.name}</h1>
//                     <div className="flex items-center gap-2 text-muted-foreground text-sm">
//                         <span>{calculateAge(selectedPatient.dateOfBirth)} سنة</span><span>•</span><span>{selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}</span><span>•</span><span className="font-mono">{selectedPatient.id}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="flex items-center gap-2"><Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button><Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button></div>
//       </div>

//       {selectedPatient.alerts && selectedPatient.alerts.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//               {selectedPatient.alerts.map((alert, i) => (
//                   <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getAlertColor(alert.type)}`}><AlertTriangle size={14} />{alert.msg}</div>
//               ))}
//           </div>
//       )}

//       {selectedPatient.vitalSigns && (
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             <VitalCard title="معدل النبض" value={selectedPatient.vitalSigns.heartRate} unit="bpm" icon={<Activity className="text-rose-500" size={18} />} />
//             <VitalCard title="ضغط الدم" value={selectedPatient.vitalSigns.bloodPressure} unit="mmHg" icon={<Heart className="text-blue-500" size={18} />} />
//             <VitalCard title="الحرارة" value={selectedPatient.vitalSigns.temperature} unit="°C" icon={<Thermometer className="text-orange-500" size={18} />} />
//             <VitalCard title="سكر الدم" value={selectedPatient.vitalSigns.glucose} unit="mg/dL" icon={<Droplet className="text-purple-500" size={18} />} />
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           <div className="lg:col-span-4 space-y-6">
//               <Card className="p-5">
//                   <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">بيانات الاتصال</h3>
//                   <div className="space-y-4 text-sm">
//                       <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><Phone size={16} /></div><div><p className="text-muted-foreground text-xs">الهاتف</p><p className="font-medium font-mono">{selectedPatient.contactPhone}</p></div></div>
//                       <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><Mail size={16} /></div><div><p className="text-muted-foreground text-xs">البريد</p><p className="font-medium">{selectedPatient.contactEmail}</p></div></div>
//                       <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><MapPin size={16} /></div><div><p className="text-muted-foreground text-xs">العنوان</p><p className="font-medium">{selectedPatient.address}</p></div></div>
//                       <div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg text-primary"><Briefcase size={16} /></div><div><p className="text-muted-foreground text-xs">المهنة</p><p className="font-medium">{selectedPatient.occupation}</p></div></div>
//                   </div>
//               </Card>
//               {selectedPatient.personalInfo?.allergies && selectedPatient.personalInfo.allergies.length > 0 && (
//                 <Card className="p-5">
//                     <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">الحساسية</h3>
//                     <div className="flex flex-wrap gap-2">{selectedPatient.personalInfo.allergies.map((alg, i) => (<Badge key={i} variant="destructive">{alg}</Badge>))}</div>
//                 </Card>
//               )}
//           </div>

//           <div className="lg:col-span-8">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                   <TabsList className="w-full justify-start overflow-x-auto bg-card border p-1 mb-6">
//                       <TabsTrigger value="overview" className="gap-2"><Stethoscope size={14} /> نظرة عامة</TabsTrigger>
//                       <TabsTrigger value="labs" className="gap-2"><FlaskRound size={14} /> التحاليل</TabsTrigger>
//                       <TabsTrigger value="radiology" className="gap-2"><Scan size={14} /> الأشعة</TabsTrigger>
//                       <TabsTrigger value="global" className="gap-2">{isGlobalAccessUnlocked ? <Globe size={14} /> : <Lock size={14} />} السجل الموحد</TabsTrigger>
//                   </TabsList>
//                   <Card className="min-h-[400px] p-6">
//                     {activeTab === "overview" && renderOverviewTab()}
//                     {activeTab === "labs" && renderLabsTab()}
//                     {activeTab === "radiology" && renderRadiologyTab()}
//                     {activeTab === "global" && renderGlobalRecordTab()}
//                   </Card>
//               </Tabs>
//           </div>
//       </div>

//       <OTPModal open={showOTPModal} onOpenChange={setShowOTPModal} onSuccess={handleOTPSuccess} patientName={selectedPatient.name} />
//     </div>
//   );
// }


// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { 
//   ArrowRight, Lock, ShieldCheck, AlertTriangle, Info, MapPin, 
//   Phone, User, Plus, Mail, MessageSquare, Timer, 
//   LogOut, RefreshCw, FileText, CheckCircle2, TrendingUp, 
//   Image as ImageIcon, Repeat, X 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Label } from "@/components/ui/label";

// // تأكد من صحة مسارات الاستيراد لديك
// import { dummyPatients } from "../data";
// import { CURRENT_DOCTOR_ID, LocalizedText } from "../types";

// // ============================================
// // 1. Smart Localization Helper
// // ============================================
// const getLoc = (content: LocalizedText | string | undefined, locale: string) => {
//   if (!content) return "";
//   if (typeof content === "string") return content;
  
//   // خريطة الأولويات: لو اللغة المختارة فاضية، دور في الباقي بالترتيب ده
//   const priorities: Record<string, string[]> = {
//     'en': ['en', 'ar', 'de'],
//     'ar': ['ar', 'en', 'de'],
//     'de': ['de', 'en', 'ar'],
//   };
  
//   const searchOrder = priorities[locale] || ['ar', 'en', 'de'];
  
//   for (const lang of searchOrder) {
//     // @ts-ignore
//     const value = content[lang];
//     if (value && value.trim() !== "") return value;
//   }
//   return "";
// };

// // ============================================
// // 2. Sparkline Component (SVG Chart)
// // ============================================
// const Sparkline = ({ data, color = "blue" }: { data: number[], color?: string }) => {
//     if (!data || data.length < 2) return null;
    
//     const min = Math.min(...data);
//     const max = Math.max(...data);
//     const range = max - min || 1;
//     const width = 100;
//     const height = 30;
    
//     const points = data.map((val, i) => {
//         const x = (i / (data.length - 1)) * width;
//         const y = height - ((val - min) / range) * height;
//         return `${x},${y}`;
//     }).join(" ");

//     return (
//         <svg width="100%" height="30" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
//             <polyline
//                 fill="none"
//                 stroke={color}
//                 strokeWidth="2"
//                 points={points}
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//             />
//             <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={color} />
//         </svg>
//     );
// };

// // ============================================
// // 3. Main Page Component
// // ============================================
// export default function PatientRecordDetail() {
//   const params = useParams();
//   const locale = (params.locale as string) || "ar";

//   // --- States ---
//   const [activeTab, setActiveTab] = useState("local");
  
//   // Modal & Forms
//   const [isNewLogOpen, setIsNewLogOpen] = useState(false);
//   const [planInput, setPlanInput] = useState("");
//   const [allergyWarning, setAllergyWarning] = useState<string | null>(null);

//   // Security & OTP
//   const [isExternalUnlocked, setIsExternalUnlocked] = useState(false);
//   const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
//   const [timeLeft, setTimeLeft] = useState<string>("");
//   const [otpStep, setOtpStep] = useState<'method' | 'verify'>('method');
//   const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | null>(null);
//   const [otpInput, setOtpInput] = useState("");
//   const [isResending, setIsResending] = useState(false);

//   // --- Data Logic ---
//   const patient = useMemo(
//     () => dummyPatients.find((p) => p.id === params.id) || dummyPatients[0],
//     [params.id]
//   );

//   const localVisits = patient.visitsHistory.filter((v) => v.doctorId === CURRENT_DOCTOR_ID);
//   const externalVisits = patient.visitsHistory.filter((v) => v.doctorId !== CURRENT_DOCTOR_ID);
//   const displayedVisits = activeTab === "local" ? localVisits : externalVisits;

//   // --- Effect: Drug Interaction Check ---
//   useEffect(() => {
//     const lowerPlan = planInput.toLowerCase();
//     // Check if patient has a critical allergy containing "penicillin"
//     const hasPenicillinAllergy = patient.alerts.some(a => 
//       a.type === 'critical' && getLoc(a.msg, 'en').toLowerCase().includes('penicillin')
//     );

//     if (hasPenicillinAllergy && lowerPlan.includes('penicillin')) {
//       setAllergyWarning(locale === 'ar' 
//         ? "تنبيه خطير: المريض لديه حساسية من البنسلين!" 
//         : "CRITICAL WARNING: Patient has Penicillin allergy!");
//     } else {
//       setAllergyWarning(null);
//     }
//   }, [planInput, patient, locale]);

//   // --- Effect: Countdown Timer ---
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isExternalUnlocked && sessionExpiry) {
//       interval = setInterval(() => {
//         const now = Date.now();
//         const diff = sessionExpiry - now;
//         if (diff <= 0) handleEndSession();
//         else {
//           const minutes = Math.floor(diff / 60000);
//           const seconds = Math.floor((diff % 60000) / 1000);
//           setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
//         }
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isExternalUnlocked, sessionExpiry]);

//   // --- Handlers ---
//   const handleVerifyOTP = () => {
//     if (otpInput === "1234") {
//       setIsExternalUnlocked(true);
//       setSessionExpiry(Date.now() + 60 * 60 * 1000); // 60 minutes
//       setOtpStep('method');
//       setOtpInput("");
//     } else {
//       alert("Invalid OTP (Try 1234)");
//     }
//   };

//   const handleEndSession = () => {
//     setIsExternalUnlocked(false);
//     setSessionExpiry(null);
//     setTimeLeft("");
//   };

//   const handleRefill = (prevNotes: string) => {
//     // Fill the plan with previous notes + Refill tag
//     setPlanInput(prevNotes + (locale === 'ar' ? "\n(تكرار العلاج - Refill)" : "\n(Refill)"));
//     setIsNewLogOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-4 md:p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
//       {/* HEADER CARD */}
//       <Card className="mb-6 border-none shadow-md overflow-hidden bg-white">
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="relative">
//               <Avatar className="w-24 h-24 border-4 border-white shadow-sm ring-1 ring-gray-100">
//                 <AvatarImage src={patient.avatar} />
//                 <AvatarFallback>{getLoc(patient.name, locale)[0]}</AvatarFallback>
//               </Avatar>
//               <Badge className={`absolute -bottom-2 -right-2 px-2 py-1 ${getLoc(patient.status.code, 'en') === 'Stable' ? 'bg-green-500' : 'bg-red-500'}`}>
//                 {getLoc(patient.status.code, locale)}
//               </Badge>
//             </div>
            
//             <div className="flex-1 space-y-3">
//               <div className="flex flex-wrap justify-between items-start">
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">{getLoc(patient.name, locale)}</h1>
//                   <p className="text-sm text-muted-foreground mt-1">ID: {patient.id}</p>
//                 </div>
                
//                 {/* --- NEW RECORD MODAL (SOAP) --- */}
//                 <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="gap-2 shadow-sm" onClick={() => setPlanInput("")}>
//                       <Plus className="w-4 h-4" /> 
//                       {locale === 'ar' ? 'سجل جديد' : 'New Record'}
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//                     <div className="flex h-full overflow-hidden">
//                       {/* Left: Summary Panel */}
//                       <div className="w-[30%] bg-gray-50 border-e p-4 overflow-y-auto hidden md:block">
//                         <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">
//                           {locale === 'ar' ? 'ملخص الحالة' : 'Case Summary'}
//                         </h3>
//                         <div className="space-y-2 mb-4">
//                           {patient.alerts.map((a, i) => (
//                              <div key={i} className={`text-xs p-2 rounded border ${a.type === 'critical' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700'}`}>
//                                {getLoc(a.msg, locale)}
//                              </div>
//                           ))}
//                         </div>
//                         <Separator className="my-4"/>
//                         <div className="text-xs text-gray-500 space-y-2">
//                             <div className="flex justify-between"><span>BP:</span> <span className="font-bold text-black">{patient.vitalSigns.bloodPressure}</span></div>
//                             <div className="flex justify-between"><span>HR:</span> <span className="font-bold text-black">{patient.vitalSigns.heartRate}</span></div>
//                         </div>
//                       </div>

//                       {/* Right: SOAP Form */}
//                       <div className="flex-1 flex flex-col h-full bg-white">
//                         <DialogHeader className="p-6 border-b">
//                           <DialogTitle>{locale === 'ar' ? 'إضافة سجل طبي (SOAP)' : 'Add Medical Record (SOAP)'}</DialogTitle>
//                         </DialogHeader>
                        
//                         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                            <div className="space-y-2">
//                               <Label className="text-blue-600 font-bold flex items-center gap-2"><div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-xs">S</div>Subjective</Label>
//                               <Textarea className="bg-blue-50/20 min-h-[80px]" />
//                            </div>
//                            <div className="space-y-2">
//                               <Label className="text-green-600 font-bold flex items-center gap-2"><div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-xs">O</div>Objective</Label>
//                               <Textarea className="bg-green-50/20 min-h-[80px]" />
//                            </div>
//                            <div className="space-y-2">
//                               <Label className="text-purple-600 font-bold flex items-center gap-2"><div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-xs">A</div>Assessment</Label>
//                               <Input className="bg-purple-50/20" />
//                            </div>
//                            <div className="space-y-2">
//                               <Label className="text-orange-600 font-bold flex items-center gap-2"><div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-xs">P</div>Plan</Label>
                              
//                               {/* Drug Interaction Warning */}
//                               {allergyWarning && (
//                                 <div className="mb-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2 animate-pulse font-semibold">
//                                     <AlertTriangle className="w-5 h-5" />
//                                     {allergyWarning}
//                                 </div>
//                               )}
                              
//                               <Textarea 
//                                 className={`bg-orange-50/20 min-h-[120px] transition-all ${allergyWarning ? 'border-red-500 ring-2 ring-red-200' : ''}`}
//                                 value={planInput}
//                                 onChange={(e) => setPlanInput(e.target.value)}
//                                 placeholder={locale === 'ar' ? 'اكتب: Penicillin للتجربة...' : 'Type: Penicillin to test alert...'}
//                               />
//                            </div>
//                         </div>

//                         <DialogFooter className="p-4 border-t bg-gray-50">
//                           <Button variant="ghost" onClick={() => setIsNewLogOpen(false)}>{locale === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
//                           <Button onClick={() => setIsNewLogOpen(false)}>{locale === 'ar' ? 'حفظ السجل' : 'Save Record'}</Button>
//                         </DialogFooter>
//                       </div>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm text-gray-600">
//                 <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <span dir="ltr">{patient.contactPhone}</span></div>
//                 <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> <span>{getLoc(patient.address, locale)}</span></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* MAIN CONTENT GRID */}
//       <div className="grid grid-cols-12 gap-6">
        
//         {/* SIDEBAR: Vitals & Alerts */}
//         <div className="col-span-12 lg:col-span-3 space-y-6">
//           <Card className="shadow-sm">
//             <CardHeader className="pb-3">
//                <CardTitle className="text-base flex items-center gap-2">
//                   <TrendingUp className="w-4 h-4 text-blue-500" />
//                   {locale === 'ar' ? 'المؤشرات الحيوية' : 'Vital Trends'}
//                </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                {/* Heart Rate */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1">
//                      <span className="text-gray-500">Heart Rate</span>
//                      <span className="font-bold text-red-600">{patient.vitalSigns.heartRate} bpm</span>
//                   </div>
//                   <Sparkline data={patient.vitalSigns.history.heartRate} color="red" />
//                </div>
//                {/* BP */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1">
//                      <span className="text-gray-500">BP (Systolic)</span>
//                      <span className="font-bold text-blue-600">{patient.vitalSigns.bloodPressure.split('/')[0]} mmHg</span>
//                   </div>
//                   <Sparkline data={patient.vitalSigns.history.bloodPressure} color="blue" />
//                </div>
//                 {/* Glucose */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1">
//                      <span className="text-gray-500">Glucose</span>
//                      <span className="font-bold text-orange-600">{patient.vitalSigns.glucose} mg/dL</span>
//                   </div>
//                   <Sparkline data={patient.vitalSigns.history.glucose} color="orange" />
//                </div>
//             </CardContent>
//           </Card>
          
//           <Card className="border-s-4 border-s-red-500 shadow-sm">
//              <CardContent className="pt-4 space-y-2">
//               {patient.alerts.map((a, i) => (
//                 <div key={i} className={`flex items-start gap-2 p-2 rounded border text-xs ${a.type === 'critical' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700'}`}>
//                   <Info className="w-3 h-3 mt-0.5 shrink-0" />
//                   <span>{getLoc(a.msg, locale)}</span>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>

//         {/* MAIN TABS AREA */}
//         <div className="col-span-12 lg:col-span-9">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="w-full sm:w-auto grid grid-cols-2 mb-4">
//               <TabsTrigger value="local">{locale === 'ar' ? 'السجلات المحلية' : 'Local Records'}</TabsTrigger>
//               <TabsTrigger value="external" className="relative">
//                 {locale === 'ar' ? 'السجلات الخارجية' : 'External Records'}
//                 {isExternalUnlocked && (
//                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//                   </span>
//                 )}
//               </TabsTrigger>
//             </TabsList>

//             {/* LOCAL VISITS */}
//             <TabsContent value="local" className="space-y-4">
//                {displayedVisits.map((visit) => (
//                   <VisitCard 
//                     key={visit.id} 
//                     visit={visit} 
//                     locale={locale} 
//                     onRefill={() => handleRefill(getLoc(visit.notes, locale))} 
//                   />
//                ))}
//                {displayedVisits.length === 0 && (
//                  <div className="text-center py-10 text-muted-foreground bg-white rounded border border-dashed">
//                     <FileText className="w-10 h-10 mx-auto mb-2 opacity-20"/>
//                     {locale === 'ar' ? 'لا توجد سجلات محلية' : 'No local records'}
//                  </div>
//                )}
//             </TabsContent>

//             {/* EXTERNAL VISITS (LOCKED/UNLOCKED) */}
//             <TabsContent value="external" className="space-y-4">
//               {!isExternalUnlocked ? (
//                  <Card className="bg-gray-50 border-dashed border-2 p-8">
//                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
//                       <div className="bg-white p-4 rounded-full shadow-sm ring-1 ring-gray-100">
//                         <Lock className="w-10 h-10 text-gray-400" />
//                       </div>
                      
//                       {otpStep === 'method' && (
//                         <div className="grid grid-cols-2 gap-4 w-full">
//                           <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-300 hover:bg-blue-50" onClick={() => { setSelectedMethod('sms'); setOtpStep('verify'); }}>
//                             <MessageSquare className="w-6 h-6 text-blue-600" />
//                             <span className="text-xs font-semibold">SMS</span>
//                           </Button>
//                           <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-300 hover:bg-blue-50" onClick={() => { setSelectedMethod('email'); setOtpStep('verify'); }}>
//                             <Mail className="w-6 h-6 text-blue-600" />
//                             <span className="text-xs font-semibold">Email</span>
//                           </Button>
//                         </div>
//                       )}

//                       {otpStep === 'verify' && (
//                         <div className="w-full space-y-4 animate-in fade-in">
//                            <div className="text-sm text-blue-600 bg-blue-50 py-2 rounded flex items-center justify-center gap-2">
//                               {selectedMethod === 'sms' ? <MessageSquare className="w-4 h-4"/> : <Mail className="w-4 h-4"/>}
//                               Code Sent
//                            </div>
//                            <Input 
//                               placeholder="0000" 
//                               className="text-center text-2xl tracking-[1em] font-mono" 
//                               maxLength={4}
//                               value={otpInput}
//                               onChange={(e) => setOtpInput(e.target.value)}
//                             />
//                             <Button className="w-full" onClick={handleVerifyOTP}>Verify (1234)</Button>
//                             <Button variant="link" size="sm" onClick={() => setOtpStep('method')}>Change Method</Button>
//                         </div>
//                       )}
//                    </div>
//                  </Card>
//               ) : (
//                 <div className="space-y-4 animate-in fade-in">
//                    {/* Session Active Banner */}
//                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-center gap-3">
//                       <div className="flex items-center gap-3 text-green-800">
//                         <ShieldCheck className="w-5 h-5" />
//                         <span className="font-bold text-sm">{locale === 'ar' ? 'جلسة خارجية نشطة' : 'Active External Session'}</span>
//                       </div>
//                       <div className="flex items-center gap-3">
//                          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border text-green-700 font-mono font-bold">
//                             <Timer className="w-4 h-4 animate-pulse" />
//                             {timeLeft}
//                          </div>
//                          <Button variant="destructive" size="sm" className="gap-2" onClick={handleEndSession}>
//                             <LogOut className="w-4 h-4" />
//                             {locale === 'ar' ? 'إنهاء' : 'End'}
//                          </Button>
//                       </div>
//                    </div>
                   
//                    {displayedVisits.map((visit) => (
//                       <VisitCard key={visit.id} visit={visit} locale={locale} />
//                    ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // 4. Sub-Component: Visit Card (With Lightbox)
// // ============================================
// const VisitCard = ({ visit, locale, onRefill }: { visit: any, locale: string, onRefill?: () => void }) => {
//   const [selectedImage, setSelectedImage] = useState<{ url: string, title: string } | null>(null);

//   return (
//     <>
//       <Accordion type="single" collapsible className="w-full">
//         <AccordionItem value={visit.id} className="border rounded-lg bg-white shadow-sm px-4">
//           <AccordionTrigger className="hover:no-underline py-4">
//             <div className="flex flex-col sm:flex-row gap-4 text-start w-full items-start sm:items-center">
              
//               {/* Date Box */}
//               <div className="hidden sm:flex flex-col items-center min-w-[60px] text-center border-e pe-4">
//                  <span className="text-xs text-muted-foreground uppercase">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</span>
//                  <span className="text-xl font-bold text-gray-800">{new Date(visit.date).getDate()}</span>
//                  <span className="text-xs text-muted-foreground">{new Date(visit.date).getFullYear()}</span>
//               </div>

//               {/* Doctor Info */}
//               <div className="flex-1">
//                 <h4 className="font-semibold text-base text-primary flex items-center gap-2">
//                   {getLoc(visit.doctorName, locale)}
//                   <Badge variant="secondary" className="text-[10px] font-normal">{getLoc(visit.specialty, locale)}</Badge>
//                 </h4>
//                 <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                   <MapPin className="w-3 h-3"/> {getLoc(visit.clinicName, locale)}
//                 </div>
//               </div>

//               {/* Refill Button (if applicable) */}
//               {onRefill && (
//                  <Button 
//                    variant="ghost" 
//                    size="sm" 
//                    className="text-blue-600 hover:bg-blue-50 gap-1 h-8 z-10"
//                    onClick={(e) => { e.stopPropagation(); onRefill(); }}
//                  >
//                     <Repeat className="w-3 h-3" />
//                     {locale === 'ar' ? 'تكرار' : 'Refill'}
//                  </Button>
//               )}
//             </div>
//           </AccordionTrigger>

//           <AccordionContent className="pt-2 pb-4 border-t mt-2">
//              <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md border-s-4 border-blue-400">
//                {getLoc(visit.notes, locale)}
//              </p>
//              <div className="space-y-4">
//                {visit.records.map((rec: any) => (
//                  <div key={rec.id}>
//                      {/* Record Header */}
//                      <div className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded transition-colors">
//                        <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
//                        <div>
//                          <h5 className="font-medium text-sm text-gray-900">{getLoc(rec.title, locale)}</h5>
//                          <p className="text-xs text-gray-500 mt-0.5">{getLoc(rec.description, locale)}</p>
//                        </div>
//                      </div>

//                      {/* Attachments Grid */}
//                      {rec.attachments && rec.attachments.length > 0 && (
//                          <div className="mt-2 ms-9 grid grid-cols-2 sm:grid-cols-4 gap-3">
//                             {rec.attachments.map((att: any) => (
//                                 <div 
//                                   key={att.id} 
//                                   className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border cursor-zoom-in shadow-sm hover:shadow-md transition-all"
//                                   onClick={(e) => { 
//                                     e.stopPropagation(); 
//                                     setSelectedImage({ url: att.url, title: att.title }); 
//                                   }}
//                                 >
//                                     <img src={att.url} alt={att.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
//                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs text-center p-1">
//                                         {locale === 'ar' ? 'تكبير' : 'Zoom'}
//                                     </div>
//                                     <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded text-white">
//                                         <ImageIcon className="w-3 h-3" />
//                                     </div>
//                                 </div>
//                             ))}
//                          </div>
//                      )}
//                  </div>
//                ))}
//              </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       {/* --- Lightbox Modal --- */}
//       <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
//         <DialogContent className="max-w-4xl p-0 bg-black/95 border-none text-white overflow-hidden flex flex-col items-center justify-center h-[80vh] sm:h-auto">
//           {selectedImage && (
//             <>
//               {/* Close Button */}
//               <div className="absolute top-4 right-4 z-50">
//                  <Button 
//                    variant="ghost" 
//                    size="icon" 
//                    className="rounded-full bg-black/50 hover:bg-white/20 text-white" 
//                    onClick={() => setSelectedImage(null)}
//                  >
//                    <X className="w-5 h-5" />
//                  </Button>
//               </div>
              
//               {/* Image */}
//               <div className="w-full h-full flex items-center justify-center p-2 sm:p-6">
//                 <img 
//                   src={selectedImage.url} 
//                   alt={selectedImage.title} 
//                   className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl"
//                 />
//               </div>

//               {/* Caption */}
//               <div className="w-full bg-black/80 p-4 text-center backdrop-blur-sm absolute bottom-0">
//                 <p className="font-medium text-sm sm:text-base">{selectedImage.title}</p>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };










// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { 
//   ArrowRight, Lock, ShieldCheck, AlertTriangle, Info, MapPin, 
//   Phone, User, Plus, Mail, MessageSquare, Timer, 
//   LogOut, RefreshCw, FileText, CheckCircle2, TrendingUp, 
//   Image as ImageIcon, Repeat, X, Pill, Stethoscope, 
//   AlertOctagon, FileDown, Flag, History, List, 
//   GitCommitHorizontal, LayoutList,Eye, Droplets, Search, ClipboardCheck, Scan, Scissors, 
//   Microscope, ScanEye, Droplet, Ear, Camera, Scaling, 
//   FlaskConical, ClipboardList, Activity
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// import { dummyPatients } from "../data";
// import { CURRENT_DOCTOR_ID, LocalizedText } from "../types";

// // ============================================
// // 1. Localization Helper
// // ============================================
// const getLoc = (content: LocalizedText | string | undefined, locale: string) => {
//   if (!content) return "";
//   if (typeof content === "string") return content;
  
//   const priorities: Record<string, string[]> = {
//     'en': ['en', 'ar', 'de'],
//     'ar': ['ar', 'en', 'de'],
//     'de': ['de', 'en', 'ar'],
//   };
  
//   const searchOrder = priorities[locale] || ['ar', 'en', 'de'];
  
//   for (const lang of searchOrder) {
//     // @ts-ignore
//     const value = content[lang];
//     if (value && value.trim() !== "") return value;
//   }
//   return "";
// };

// // ============================================
// // 2. Enhanced Sparkline (Context-Aware)
// // ============================================
// const SmartSparkline = ({ data, minNormal, maxNormal, unit }: { data: number[], minNormal: number, maxNormal: number, unit: string }) => {
//     if (!data || data.length < 2) return null;
    
//     const min = Math.min(...data, minNormal - 5);
//     const max = Math.max(...data, maxNormal + 5);
//     const range = max - min || 1;
//     const width = 120;
//     const height = 40;
    
//     const lastValue = data[data.length - 1];
//     const isAbnormal = lastValue < minNormal || lastValue > maxNormal;
//     const color = isAbnormal ? "red" : "#10b981"; 

//     const points = data.map((val, i) => {
//         const x = (i / (data.length - 1)) * width;
//         const y = height - ((val - min) / range) * height;
//         return `${x},${y}`;
//     }).join(" ");

//     return (
//         <TooltipProvider>
//             <Tooltip>
//                 <TooltipTrigger asChild>
//                     <div className="flex flex-col items-end cursor-help">
//                          <div className="flex items-center gap-2 mb-1">
//                              {isAbnormal && <AlertOctagon className="w-3 h-3 text-red-500 animate-pulse" />}
//                              <span className={`font-bold text-sm ${isAbnormal ? 'text-red-600' : 'text-gray-700'}`}>
//                                  {lastValue} <span className="text-[10px] text-muted-foreground font-normal">{unit}</span>
//                              </span>
//                          </div>
//                          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
//                             {/* Normal Range Zone Background */}
//                             <rect 
//                                 x="0" 
//                                 y={height - ((maxNormal - min) / range) * height} 
//                                 width={width} 
//                                 height={((maxNormal - minNormal) / range) * height} 
//                                 fill={isAbnormal ? "#fee2e2" : "#ecfdf5"} 
//                                 opacity="0.5"
//                             />
//                             <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
//                             <circle cx={width} cy={height - ((lastValue - min) / range) * height} r="3" fill={color} />
//                         </svg>
//                     </div>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                     <p className="text-xs">Normal Range: {minNormal}-{maxNormal} {unit}</p>
//                     <p className="text-xs font-bold">{isAbnormal ? '⚠️ Attention Needed' : '✅ Within Limits'}</p>
//                 </TooltipContent>
//             </Tooltip>
//         </TooltipProvider>
//     );
// };

// // ============================================
// // 3. Main Page Component
// // ============================================
// export default function PatientRecordDetail() {
//   const params = useParams();
//   const locale = (params.locale as string) || "ar";

//   // --- States ---
//   const [activeTab, setActiveTab] = useState("local");
//   const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

//   // Modal & Forms
//   const [isNewLogOpen, setIsNewLogOpen] = useState(false);
//   const [planInput, setPlanInput] = useState("");
//   const [assessmentInput, setAssessmentInput] = useState("");
//   const [allergyWarning, setAllergyWarning] = useState<string | null>(null);
//   const [soapError, setSoapError] = useState<string | null>(null);

//   // Security & OTP
//   const [isExternalUnlocked, setIsExternalUnlocked] = useState(false);
//   const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
//   const [timeLeft, setTimeLeft] = useState<string>("");
//   const [otpStep, setOtpStep] = useState<'reason' | 'method' | 'verify'>('reason');
//   const [accessReason, setAccessReason] = useState("");
//   const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | null>(null);
//   const [otpInput, setOtpInput] = useState("");

//   // --- Data Logic ---
//   const patient = useMemo(
//     () => dummyPatients.find((p) => p.id === params.id) || dummyPatients[0],
//     [params.id]
//   );

//   const localVisits = patient.visitsHistory.filter((v) => v.doctorId === CURRENT_DOCTOR_ID);
//   const externalVisits = patient.visitsHistory.filter((v) => v.doctorId !== CURRENT_DOCTOR_ID);
//   const displayedVisits = activeTab === "local" ? localVisits : externalVisits;

//   // --- Clinical Priority Strip Data ---
//   const criticalAlerts = patient.alerts.filter(a => a.type === 'critical');
//   const chronicConditions = patient.alerts.filter(a => a.type === 'warning');

//   // --- Effect: Drug Interaction Check ---
//   useEffect(() => {
//     const lowerPlan = planInput.toLowerCase();
//     const hasPenicillinAllergy = patient.alerts.some(a => 
//       a.type === 'critical' && getLoc(a.msg, 'en').toLowerCase().includes('penicillin')
//     );
//     if (hasPenicillinAllergy && lowerPlan.includes('penicillin')) {
//       setAllergyWarning(locale === 'ar' ? "تنبيه خطير: المريض لديه حساسية من البنسلين!" : "CRITICAL: Patient has Penicillin allergy!");
//     } else {
//       setAllergyWarning(null);
//     }
//   }, [planInput, patient, locale]);

//   // --- Effect: Countdown Timer ---
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isExternalUnlocked && sessionExpiry) {
//       interval = setInterval(() => {
//         const now = Date.now();
//         const diff = sessionExpiry - now;
//         if (diff <= 0) handleEndSession();
//         else {
//           const minutes = Math.floor(diff / 60000);
//           const seconds = Math.floor((diff % 60000) / 1000);
//           setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
//         }
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isExternalUnlocked, sessionExpiry]);

//   // --- Handlers ---
//   const handleVerifyOTP = () => {
//     if (otpInput === "1234") {
//       setIsExternalUnlocked(true);
//       setSessionExpiry(Date.now() + 60 * 60 * 1000);
//       setOtpStep('reason'); 
//       setOtpInput("");
//       setAccessReason("");
//     } else {
//       alert("Invalid OTP");
//     }
//   };

//   const handleEndSession = () => {
//     setIsExternalUnlocked(false);
//     setSessionExpiry(null);
//     setTimeLeft("");
//   };

//   const handleRefill = (prevNotes: string) => {
//     setPlanInput(prevNotes + (locale === 'ar' ? "\n(تكرار العلاج - Refill)" : "\n(Refill)"));
//     setIsNewLogOpen(true);
//   };

//   const handleSaveSOAP = () => {
//       // SOAP Validation
//       if (planInput.trim().length > 0 && assessmentInput.trim().length === 0) {
//           setSoapError(locale === 'ar' ? "لا يمكن حفظ خطة علاج بدون تشخيص (Assessment)" : "Cannot save Plan without Assessment");
//           return;
//       }
//       setSoapError(null);
//       setIsNewLogOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/30" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
//       {/* 🚀 CLINICAL PRIORITY STRIP (Sticky Header) */}
//       <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm px-4 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar">
//          {/* Critical Alerts */}
//          {criticalAlerts.length > 0 && (
//              <Badge variant="destructive" className="flex items-center gap-1 animate-pulse px-3 py-1 text-xs cursor-pointer">
//                  <AlertTriangle className="w-3 h-3" />
//                  {getLoc(criticalAlerts[0].msg, locale)}
//              </Badge>
//          )}
//          {/* Chronic Conditions */}
//          {chronicConditions.length > 0 && (
//              <Badge variant="outline" className="flex items-center gap-1 border-orange-200 bg-orange-50 text-orange-700 px-3 py-1 text-xs cursor-pointer">
//                  <Info className="w-3 h-3" />
//                  {getLoc(chronicConditions[0].msg, locale)}
//              </Badge>
//          )}
//          {/* Medications */}
//          <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
//             <Pill className="w-3 h-3" />
//             <span className="font-semibold">{locale === 'ar' ? 'الأدوية الحالية:' : 'Meds:'}</span>
//             <span className="truncate max-w-[200px]">{patient.currentMedications ? patient.currentMedications.join(", ") : 'None'}</span>
//          </div>
//          {/* Last Visit */}
//          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full ml-auto">
//              <History className="w-3 h-3" />
//              {locale === 'ar' ? 'آخر زيارة: منذ 3 أيام' : 'Last visit: 3 days ago'}
//          </div>
         
//          {/* Enterprise Actions */}
//          <div className="flex items-center gap-1 border-l pl-2 border-gray-300">
//              <TooltipProvider>
//                  <Tooltip>
//                      <TooltipTrigger asChild>
//                          <Button variant="ghost" size="icon" className="h-7 w-7"><FileDown className="w-4 h-4 text-gray-500"/></Button>
//                      </TooltipTrigger>
//                      <TooltipContent>Export PDF</TooltipContent>
//                  </Tooltip>
//                  <Tooltip>
//                      <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-7 w-7"><Flag className="w-4 h-4 text-gray-500"/></Button>
//                      </TooltipTrigger>
//                      <TooltipContent>Flag for Follow-up</TooltipContent>
//                  </Tooltip>
//              </TooltipProvider>
//          </div>
//       </div>

//       <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

//       {/* Header Info */}
//       <div className="flex flex-col md:flex-row gap-6 items-start">
//             <div className="relative shrink-0">
//               <Avatar className="w-20 h-20 border-4 border-white shadow-sm">
//                 <AvatarImage src={patient.avatar} />
//                 <AvatarFallback>{getLoc(patient.name, locale)[0]}</AvatarFallback>
//               </Avatar>
//               <Badge className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] ${getLoc(patient.status.code, 'en') === 'Stable' ? 'bg-green-500' : 'bg-red-500'}`}>
//                 {getLoc(patient.status.code, locale)}
//               </Badge>
//             </div>
            
//             <div className="flex-1 min-w-0">
//                   <h1 className="text-2xl font-bold text-gray-900 leading-tight">{getLoc(patient.name, locale)}</h1>
//                   <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
//                       <span className="flex items-center gap-1"><User className="w-3 h-3"/> {getLoc(patient.gender, locale)}, {2024 - parseInt(patient.dateOfBirth.split('-')[0])}yo</span>
//                       <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> <span dir="ltr">{patient.contactPhone}</span></span>
//                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {getLoc(patient.address, locale)}</span>
//                   </div>
//             </div>

//             {/* New Record Button */}
//             <div className="shrink-0">
//                 <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="gap-2 shadow-sm bg-blue-600 hover:bg-blue-700" onClick={() => { setPlanInput(""); setAssessmentInput(""); setSoapError(null); }}>
//                       <Plus className="w-4 h-4" /> 
//                       {locale === 'ar' ? 'سجل جديد' : 'New Record'}
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//                       <div className="flex h-full overflow-hidden">
//                           {/* Sidebar */}
//                           <div className="w-[280px] bg-gray-50 border-e p-4 overflow-y-auto hidden md:block text-sm">
//                               <h3 className="font-bold text-gray-500 uppercase text-xs mb-3">Patient Summary</h3>
//                               {/* Quick Allergies */}
//                               <div className="mb-4">
//                                   {patient.alerts.map((a,i) => <div key={i} className="text-xs text-red-600 bg-red-50 border border-red-100 p-2 rounded mb-1">{getLoc(a.msg, locale)}</div>)}
//                               </div>
//                               <Separator className="mb-4"/>
//                               <div className="space-y-2">
//                                   <div className="flex justify-between"><span>BP</span> <span className="font-mono font-bold">{patient.vitalSigns.bloodPressure}</span></div>
//                                   <div className="flex justify-between"><span>HR</span> <span className="font-mono font-bold">{patient.vitalSigns.heartRate}</span></div>
//                               </div>
//                           </div>
//                           {/* Form */}
//                           <div className="flex-1 flex flex-col h-full bg-white">
//                               <DialogHeader className="p-5 border-b">
//                                   <DialogTitle>New SOAP Note</DialogTitle>
//                               </DialogHeader>
//                               <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                                   {/* SOAP Fields */}
//                                   <div><Label className="text-blue-600 font-bold mb-1 block">Subjective</Label><Textarea className="bg-blue-50/20"/></div>
//                                   <div><Label className="text-green-600 font-bold mb-1 block">Objective</Label><Textarea className="bg-green-50/20"/></div>
//                                   <div>
//                                       <Label className="text-purple-600 font-bold mb-1 block">Assessment <span className="text-red-500">*</span></Label>
//                                       <Input 
//                                         className="bg-purple-50/20" 
//                                         value={assessmentInput}
//                                         onChange={(e) => setAssessmentInput(e.target.value)}
//                                         placeholder="Diagnosis..."
//                                       />
//                                   </div>
//                                   <div>
//                                       <Label className="text-orange-600 font-bold mb-1 block">Plan</Label>
//                                       {allergyWarning && <div className="mb-2 p-2 bg-red-100 text-red-700 text-xs rounded font-bold animate-pulse">{allergyWarning}</div>}
//                                       <Textarea 
//                                         className="bg-orange-50/20 min-h-[100px]" 
//                                         value={planInput} 
//                                         onChange={(e) => setPlanInput(e.target.value)}
//                                       />
//                                   </div>
//                                   {soapError && <div className="text-red-600 text-sm font-semibold bg-red-50 p-2 rounded">{soapError}</div>}
//                               </div>
//                               <DialogFooter className="p-4 border-t bg-gray-50">
//                                   <Button onClick={handleSaveSOAP}>Save Record</Button>
//                               </DialogFooter>
//                           </div>
//                       </div>
//                   </DialogContent>
//                 </Dialog>
//             </div>
//       </div>

//       <div className="grid grid-cols-12 gap-6">
        
//         {/* LEFT COLUMN: Vitals (Sparklines) */}
//         <div className="col-span-12 lg:col-span-3 space-y-6">
//           <Card className="shadow-sm border-gray-200">
//             <CardHeader className="pb-2 pt-4 px-4">
//                <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-700">
//                   <TrendingUp className="w-4 h-4 text-blue-500" />
//                   {locale === 'ar' ? 'المؤشرات الحيوية' : 'Vital Trends'}
//                </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 px-4 pb-4">
//                {/* Heart Rate */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1 text-gray-500"><span>Heart Rate</span></div>
//                   <SmartSparkline data={patient.vitalSigns.history.heartRate} minNormal={60} maxNormal={100} unit="bpm" />
//                </div>
//                {/* BP */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1 text-gray-500"><span>BP (Systolic)</span></div>
//                   <SmartSparkline data={patient.vitalSigns.history.bloodPressure} minNormal={110} maxNormal={130} unit="mmHg" />
//                </div>
//                {/* Glucose */}
//                <div>
//                   <div className="flex justify-between text-xs mb-1 text-gray-500"><span>Glucose</span></div>
//                   <SmartSparkline data={patient.vitalSigns.history.glucose} minNormal={70} maxNormal={140} unit="mg/dL" />
//                </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN: Visits & Actions */}
//         <div className="col-span-12 lg:col-span-9 space-y-6">
          
//           {/* 🧠 DECISION-ORIENTED UI: Suggested Actions */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <Button variant="outline" className="h-auto py-3 px-4 justify-start gap-3 bg-white hover:bg-blue-50 border-blue-100 hover:border-blue-200 shadow-sm group">
//                   <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200"><Repeat className="w-4 h-4"/></div>
//                   <div className="text-start">
//                       <div className="text-sm font-semibold text-gray-900">Refill Prescriptions</div>
//                       <div className="text-[10px] text-gray-500">Metformin, Lisinopril</div>
//                   </div>
//               </Button>
//               <Button variant="outline" className="h-auto py-3 px-4 justify-start gap-3 bg-white hover:bg-yellow-50 border-yellow-100 hover:border-yellow-200 shadow-sm group">
//                   <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full group-hover:bg-yellow-200"><Stethoscope className="w-4 h-4"/></div>
//                   <div className="text-start">
//                       <div className="text-sm font-semibold text-gray-900">Review HR Trend</div>
//                       <div className="text-[10px] text-gray-500">Elevated in last 2 visits</div>
//                   </div>
//               </Button>
//               <Button variant="outline" className="h-auto py-3 px-4 justify-start gap-3 bg-white hover:bg-gray-50 border-gray-200 shadow-sm group">
//                    <div className="p-2 bg-gray-100 text-gray-600 rounded-full"><GitCommitHorizontal className="w-4 h-4"/></div>
//                    <div className="text-start">
//                       <div className="text-sm font-semibold text-gray-900">Lab Results</div>
//                       <div className="text-[10px] text-gray-500">Pending from 12/12</div>
//                    </div>
//               </Button>
//           </div>

//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
//                 <TabsList className="w-full sm:w-auto grid grid-cols-2">
//                     <TabsTrigger value="local">{locale === 'ar' ? 'سجلات محلية' : 'Local Records'}</TabsTrigger>
//                     <TabsTrigger value="external" className="relative">
//                         {locale === 'ar' ? 'سجلات خارجية' : 'External Records'}
//                         {isExternalUnlocked && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"/>}
//                     </TabsTrigger>
//                 </TabsList>
                
//                 {/* Timeline Toggle */}
//                 {activeTab === 'local' && (
//                     <div className="flex bg-gray-100 p-1 rounded-lg mt-2 sm:mt-0">
//                         <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-black' : 'text-gray-500'}`}><List className="w-4 h-4"/></button>
//                         <button onClick={() => setViewMode('timeline')} className={`p-1.5 rounded ${viewMode === 'timeline' ? 'bg-white shadow text-black' : 'text-gray-500'}`}><LayoutList className="w-4 h-4"/></button>
//                     </div>
//                 )}
//             </div>

//             {/* LOCAL TAB */}
//             <TabsContent value="local" className="space-y-4">
//                {displayedVisits.length > 0 ? (
//                   viewMode === 'list' ? (
//                       // Standard List View
//                       displayedVisits.map((visit) => (
//                         <VisitCard 
//                             key={visit.id} 
//                             visit={visit} 
//                             locale={locale} 
//                             onRefill={() => handleRefill(getLoc(visit.notes, locale))} 
//                         />
//                       ))
//                   ) : (
//                       // 🧾 Timeline Visualization
//                       <div className="relative border-s-2 border-gray-200 ms-4 space-y-8 py-4">
//                           {displayedVisits.map((visit) => (
//                               <div key={visit.id} className="ms-6 relative">
//                                   <span className="absolute -left-[33px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
//                                       <CheckCircle2 className="h-4 w-4 text-blue-600" />
//                                   </span>
//                                   <div className="text-xs text-gray-500 mb-1 font-mono">{visit.date}</div>
//                                   <VisitCard visit={visit} locale={locale} />
//                               </div>
//                           ))}
//                       </div>
//                   )
//                ) : (
//                  // 🎯 Smart Empty State
//                  <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
//                     <div className="bg-gray-50 p-4 rounded-full mb-3"><FileText className="w-8 h-8 text-gray-400"/></div>
//                     <h3 className="font-semibold text-gray-900">{locale === 'ar' ? 'لا توجد سجلات محلية' : 'No Local Records Yet'}</h3>
//                     <p className="text-sm text-gray-500 max-w-xs mb-4">{locale === 'ar' ? 'ابدأ بإضافة أول زيارة لهذا المريض' : 'Start by creating the first consultation log for this patient.'}</p>
//                     <Button variant="outline" onClick={() => { setPlanInput(""); setIsNewLogOpen(true); }}>
//                         <Plus className="w-4 h-4 mr-2"/>
//                         {locale === 'ar' ? 'إضافة زيارة' : 'Add First Visit'}
//                     </Button>
//                  </div>
//                )}
//             </TabsContent>

//             {/* EXTERNAL TAB */}
//             <TabsContent value="external" className="space-y-4">
//               {!isExternalUnlocked ? (
//                  <Card className="bg-gray-50/50 border-dashed border-2 p-8">
//                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
//                       <div className="bg-white p-4 rounded-full shadow-sm ring-1 ring-gray-100">
//                         <Lock className="w-10 h-10 text-gray-400" />
//                       </div>
                      
//                       {/* Step 1: Reason for Access (Audit Log) */}
//                       {otpStep === 'reason' && (
//                           <div className="w-full space-y-4 animate-in fade-in">
//                               <h3 className="font-semibold text-gray-900">Reason for Accessing External Data</h3>
//                               <p className="text-xs text-gray-500">This action will be recorded in the audit log.</p>
                              
//                               <RadioGroup value={accessReason} onValueChange={setAccessReason} className="grid grid-cols-1 gap-2 text-start">
//                                   <div className="flex items-center space-x-2 bg-white p-3 rounded border cursor-pointer hover:border-blue-400">
//                                       <RadioGroupItem value="consultation" id="r1" />
//                                       <Label htmlFor="r1" className="cursor-pointer font-normal">Regular Consultation</Label>
//                                   </div>
//                                   <div className="flex items-center space-x-2 bg-white p-3 rounded border cursor-pointer hover:border-blue-400">
//                                       <RadioGroupItem value="emergency" id="r2" />
//                                       <Label htmlFor="r2" className="cursor-pointer font-normal">Emergency / Urgent Care</Label>
//                                   </div>
//                               </RadioGroup>
//                               <Button className="w-full" disabled={!accessReason} onClick={() => setOtpStep('method')}>Next</Button>
//                           </div>
//                       )}

//                       {/* Step 2: Choose Method */}
//                       {otpStep === 'method' && (
//                         <div className="grid grid-cols-2 gap-4 w-full animate-in fade-in slide-in-from-right-4">
//                           <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-400 hover:bg-blue-50" onClick={() => { setSelectedMethod('sms'); setOtpStep('verify'); }}>
//                             <MessageSquare className="w-6 h-6 text-blue-600" />
//                             <span className="text-xs font-semibold">SMS ••••890</span>
//                           </Button>
//                           <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-400 hover:bg-blue-50" onClick={() => { setSelectedMethod('email'); setOtpStep('verify'); }}>
//                             <Mail className="w-6 h-6 text-blue-600" />
//                             <span className="text-xs font-semibold">Email</span>
//                           </Button>
//                         </div>
//                       )}

//                       {/* Step 3: Verify */}
//                       {otpStep === 'verify' && (
//                         <div className="w-full space-y-4 animate-in fade-in">
//                            <div className="text-sm text-blue-600 bg-blue-50 py-2 rounded flex items-center justify-center gap-2">
//                               {selectedMethod === 'sms' ? <MessageSquare className="w-4 h-4"/> : <Mail className="w-4 h-4"/>}
//                               Code Sent
//                            </div>
//                            <Input 
//                               placeholder="0000" 
//                               className="text-center text-2xl tracking-[1em] font-mono h-12" 
//                               maxLength={4}
//                               value={otpInput}
//                               onChange={(e) => setOtpInput(e.target.value)}
//                             />
//                             <Button className="w-full" onClick={handleVerifyOTP}>Verify (1234)</Button>
//                             <Button variant="link" size="sm" onClick={() => setOtpStep('method')} className="text-gray-400">Back</Button>
//                         </div>
//                       )}
//                    </div>
//                  </Card>
//               ) : (
//                 <div className="space-y-4 animate-in fade-in">
//                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
//                       <div className="flex items-center gap-3 text-green-800">
//                         <ShieldCheck className="w-5 h-5" />
//                         <div>
//                             <span className="font-bold text-sm block">{locale === 'ar' ? 'جلسة خارجية نشطة' : 'Active External Session'}</span>
//                             <span className="text-[10px] opacity-80 block">Access Reason: {accessReason}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border text-green-700 font-mono font-bold">
//                             <Timer className="w-4 h-4 animate-pulse" />
//                             {timeLeft}
//                          </div>
//                          <Button variant="destructive" size="sm" onClick={handleEndSession}>
//                             <LogOut className="w-4 h-4" />
//                          </Button>
//                       </div>
//                    </div>
//                    {displayedVisits.map((visit) => <VisitCard key={visit.id} visit={visit} locale={locale} isExternal />)}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // 4. Visit Card (Refactored)
// // ============================================
// // ============================================
// // 4. Visit Card (Refactored with Specialty-Specific Data Views)
// // ============================================
// const VisitCard = ({ visit, locale, onRefill, isExternal }: { visit: any, locale: string, onRefill?: () => void, isExternal?: boolean }) => {
//   const [selectedImage, setSelectedImage] = useState<{ url: string, title: string } | null>(null);

//   // Helper function to get specialty in English
//   const getSpecialtyKey = (specialtyObj: any) => {
//     if (!specialtyObj) return '';
//     if (typeof specialtyObj === 'string') return specialtyObj;
//     return specialtyObj.en || specialtyObj.ar || '';
//   };

//   // Specialized Data Payload Renderers
//   const renderDataPayload = (payload: any, specialty: any) => {
//     if (!payload) return null;
    
//     const specialtyKey = getSpecialtyKey(specialty).toLowerCase();
    
//     switch (true) {
//       case specialtyKey.includes('cardiology'):
//         return <CardiologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('ophthalmology') || specialtyKey.includes('eye'):
//         return <OphthalmologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('gastroenterology') || specialtyKey.includes('digestive'):
//         return <GastroenterologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('urology') || specialtyKey.includes('renal'):
//         return <UrologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('ent') || specialtyKey.includes('sinus'):
//         return <ENTDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('dermatology') || specialtyKey.includes('skin'):
//         return <DermatologyDataView data={payload} locale={locale} />;
      
//       case specialtyKey.includes('internal medicine') || specialtyKey.includes('internal'):
//         return <InternalMedicineDataView data={payload} locale={locale} />;
      
//       default:
//         return <DefaultDataView data={payload} locale={locale} />;
//     }
//   };

//   return (
//     <>
//       <Accordion type="single" collapsible className={`w-full ${isExternal ? 'opacity-90' : ''}`}>
//         <AccordionItem value={visit.id} className="border rounded-lg bg-white shadow-sm px-4">
//           <AccordionTrigger className="hover:no-underline py-4">
//             <div className="flex flex-col sm:flex-row gap-4 text-start w-full items-start sm:items-center">
              
//               {/* External Badge */}
//               {isExternal && (
//                   <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300 gap-1 absolute top-2 right-2">
//                       <Lock className="w-3 h-3"/> Read-Only
//                   </Badge>
//               )}

//               <div className="hidden sm:flex flex-col items-center min-w-[60px] text-center border-e pe-4">
//                  <span className="text-xs text-muted-foreground uppercase">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</span>
//                  <span className="text-xl font-bold text-gray-800">{new Date(visit.date).getDate()}</span>
//                  <span className="text-xs text-muted-foreground">{new Date(visit.date).getFullYear()}</span>
//               </div>

//               <div className="flex-1">
//                 <h4 className="font-semibold text-base text-primary flex items-center gap-2">
//                   {getLoc(visit.doctorName, locale)}
//                   <Badge variant="secondary" className="text-[10px] font-normal">{getLoc(visit.specialty, locale)}</Badge>
//                 </h4>
//                 <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                   <MapPin className="w-3 h-3"/> {getLoc(visit.clinicName, locale)}
//                 </div>
//               </div>

//               {!isExternal && onRefill && (
//                  <Button 
//                    variant="ghost" 
//                    size="sm" 
//                    className="text-blue-600 hover:bg-blue-50 gap-1 h-8 z-10"
//                    onClick={(e) => { e.stopPropagation(); onRefill(); }}
//                  >
//                     <Repeat className="w-3 h-3" />
//                     {locale === 'ar' ? 'تكرار' : 'Refill'}
//                  </Button>
//               )}
//             </div>
//           </AccordionTrigger>

//           <AccordionContent className="pt-2 pb-4 border-t mt-2">
//              <div className="space-y-6">
//                {visit.records.map((rec: any) => (
//                  <div key={rec.id} className="border-b pb-4 last:border-0 last:pb-0">
                   
//                    {/* Record Header */}
//                    <div className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded transition-colors group">
//                      <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
//                      <div className="flex-1">
//                        <h5 className="font-medium text-sm text-gray-900 flex justify-between">
//                            {getLoc(rec.title, locale)}
//                            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">#{rec.id}</span>
//                        </h5>
//                        <p className="text-xs text-gray-500 mt-0.5">{getLoc(rec.description, locale)}</p>
//                      </div>
//                    </div>

//                    {/* Specialized Data Payload View */}
//                    {rec.dataPayload && (
//                      <div className="mt-3 ms-9">
//                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 shadow-sm">
//                          <div className="mb-3">
//                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
//                              <FileText className="w-3 h-3" />
//                              {locale === 'ar' ? 'تفاصيل الفحص' : 'Examination Details'}
//                            </div>
//                            {renderDataPayload(rec.dataPayload, visit.specialty)}
//                          </div>
//                        </div>
//                      </div>
//                    )}

//                    {/* Attachments Gallery */}
//                    {rec.attachments && rec.attachments.length > 0 && (
//                        <div className="mt-4 ms-9">
//                          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
//                            <ImageIcon className="w-3 h-3" />
//                            {locale === 'ar' ? 'المرفقات' : 'Attachments'}
//                          </div>
//                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                             {rec.attachments.map((att: any) => (
//                                 <div 
//                                   key={att.id} 
//                                   className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border cursor-zoom-in shadow-sm hover:shadow-md transition-all"
//                                   onClick={(e) => { 
//                                     e.stopPropagation(); 
//                                     setSelectedImage({ url: att.url, title: att.title }); 
//                                   }}
//                                 >
//                                     <img src={att.url} alt={att.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
//                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs text-center p-1 font-medium">
//                                         {att.title}
//                                     </div>
//                                     <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded text-white">
//                                         <ImageIcon className="w-3 h-3" />
//                                     </div>
//                                 </div>
//                             ))}
//                          </div>
//                        </div>
//                    )}
//                  </div>
//                ))}
//              </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
//         <DialogContent className="max-w-4xl p-0 bg-black/95 border-none text-white overflow-hidden flex flex-col items-center justify-center h-[80vh] sm:h-auto">
//           {selectedImage && (
//             <>
//               <div className="absolute top-4 right-4 z-50">
//                  <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-white/20 text-white" onClick={() => setSelectedImage(null)}>
//                    <X className="w-5 h-5" />
//                  </Button>
//               </div>
//               <div className="w-full h-full flex items-center justify-center p-2 sm:p-6">
//                 <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl" />
//               </div>
//               <div className="w-full bg-black/80 p-4 text-center backdrop-blur-sm absolute bottom-0">
//                 <p className="font-medium text-sm sm:text-base">{selectedImage.title}</p>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// // ============================================
// // Specialty-Specific Data View Components
// // ============================================

// // Cardiology Data View
// const CardiologyDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;
  
//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* ECG Section */}
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <TrendingUp className="w-4 h-4 text-red-500" />
//             {locale === 'ar' ? 'رسم القلب' : 'ECG Findings'}
//           </h4>
//           <div className="space-y-1 text-sm">
//             {data.restingECG && (
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{locale === 'ar' ? 'رسم القلب أثناء الراحة' : 'Resting ECG'}</span>
//                 <span className="font-medium">{data.restingECG}</span>
//               </div>
//             )}
//             {data.stressTest && (
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{locale === 'ar' ? 'اختبار الجهد' : 'Stress Test'}</span>
//                 <span className="font-medium">{data.stressTest}</span>
//               </div>
//             )}
//             {data.heartRateRecovery && (
//               <div className="flex justify-between">
//                 <span className="text-gray-600">{locale === 'ar' ? 'معدل استعادة النبض' : 'Heart Rate Recovery'}</span>
//                 <span className="font-medium">{data.heartRateRecovery}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Echo Section */}
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Activity className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'موجات صوتية على القلب' : 'Echocardiogram'}
//           </h4>
//           <div className="space-y-1 text-sm">
//             {data.ejectionFraction && (
//               <div className="flex justify-between">
//                 <span className="text-gray-600">EF</span>
//                 <span className="font-medium bg-blue-50 px-2 py-0.5 rounded">{data.ejectionFraction}</span>
//               </div>
//             )}
//             {data.lvDimensions && (
//               <div className="grid grid-cols-2 gap-1 text-xs">
//                 <div>LVIDd: <span className="font-medium">{data.lvDimensions.lvidd}</span></div>
//                 <div>IVSd: <span className="font-medium">{data.lvDimensions.ivsd}</span></div>
//                 <div>LVIDs: <span className="font-medium">{data.lvDimensions.lvids}</span></div>
//                 <div>PWd: <span className="font-medium">{data.lvDimensions.pwd}</span></div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recommendations */}
//       {data.recommendations && (
//         <div className="bg-blue-50 border border-blue-200 rounded p-3">
//           <h5 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-2">
//             <CheckCircle2 className="w-4 h-4" />
//             {locale === 'ar' ? 'التوصيات' : 'Recommendations'}
//           </h5>
//           <p className="text-sm text-blue-900">{data.recommendations}</p>
//         </div>
//       )}

//       {/* Medication Adjustment */}
//       {data.medicationAdjustment && (
//         <div className="bg-amber-50 border border-amber-200 rounded p-3">
//           <h5 className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
//             <Pill className="w-4 h-4" />
//             {locale === 'ar' ? 'تعديل الأدوية' : 'Medication Adjustment'}
//           </h5>
//           <p className="text-sm text-amber-900">{data.medicationAdjustment}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Ophthalmology Data View
// const OphthalmologyDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   return (
//     <div className="space-y-4">
//       {/* Visual Acuity */}
//       {data.visualAcuity && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Eye className="w-4 h-4 text-purple-500" />
//             {locale === 'ar' ? 'حدة الإبصار' : 'Visual Acuity'}
//           </h4>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-purple-50 p-3 rounded border border-purple-100">
//               <div className="text-xs text-purple-700 font-medium mb-1">
//                 {locale === 'ar' ? 'العين اليمنى' : 'Right Eye'}
//               </div>
//               <div className="text-lg font-bold text-purple-900">{data.visualAcuity.rightEye}</div>
//             </div>
//             <div className="bg-purple-50 p-3 rounded border border-purple-100">
//               <div className="text-xs text-purple-700 font-medium mb-1">
//                 {locale === 'ar' ? 'العين اليسرى' : 'Left Eye'}
//               </div>
//               <div className="text-lg font-bold text-purple-900">{data.visualAcuity.leftEye}</div>
//             </div>
//           </div>
//           {data.visualAcuity.withCorrection && (
//             <div className="text-xs text-gray-500 mt-1">
//               {locale === 'ar' ? 'مع تصحيح: ' : 'With correction: '}{data.visualAcuity.withCorrection}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Intraocular Pressure */}
//       {data.intraocularPressure && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Droplets className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'ضغط العين' : 'Intraocular Pressure'}
//           </h4>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-center">
//               <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'العين اليمنى' : 'Right Eye'}</div>
//               <div className={`text-lg font-bold ${parseInt(data.intraocularPressure.rightEye) > 21 ? 'text-red-600' : 'text-green-600'}`}>
//                 {data.intraocularPressure.rightEye}
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'العين اليسرى' : 'Left Eye'}</div>
//               <div className={`text-lg font-bold ${parseInt(data.intraocularPressure.leftEye) > 21 ? 'text-red-600' : 'text-green-600'}`}>
//                 {data.intraocularPressure.leftEye}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Fundus Findings */}
//       {data.fundusFindings && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Search className="w-4 h-4 text-amber-500" />
//             {locale === 'ar' ? 'نتائج قاع العين' : 'Fundus Findings'}
//           </h4>
//           <div className="bg-amber-50 border border-amber-200 rounded p-3">
//             <p className="text-sm text-amber-900">{data.fundusFindings}</p>
//           </div>
//         </div>
//       )}

//       {/* Diagnosis */}
//       {data.diagnosis && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <ClipboardCheck className="w-4 h-4 text-green-600" />
//             {locale === 'ar' ? 'التشخيص' : 'Diagnosis'}
//           </h4>
//           <div className="bg-green-50 border border-green-200 rounded p-3">
//             <p className="text-sm font-medium text-green-900">{data.diagnosis}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Gastroenterology Data View
// const GastroenterologyDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   return (
//     <div className="space-y-4">
//       {/* Colonoscopy Findings */}
//       {data.findings && (
//         <div className="space-y-3">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Scan className="w-4 h-4 text-green-600" />
//             {locale === 'ar' ? 'نتائج المنظار' : 'Colonoscopy Findings'}
//           </h4>
//           <div className="space-y-2">
//             {Object.entries(data.findings).map(([location, finding]) => (
//               <div key={location} className="flex items-center justify-between text-sm">
//                 <span className="text-gray-600 capitalize">{location}:</span>
//                 <span className="font-medium text-gray-900">{finding as string}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Polypectomy Results */}
//       {data.polypectomy && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Scissors className="w-4 h-4 text-red-500" />
//             {locale === 'ar' ? 'نتائج استئصال الزوائد' : 'Polypectomy Results'}
//           </h4>
//           <div className="bg-red-50 border border-red-200 rounded p-3">
//             <p className="text-sm text-red-900">{data.polypectomy}</p>
//           </div>
//         </div>
//       )}

//       {/* Biopsy Results */}
//       {data.biopsyResults && (
//         <div className="space-y-3">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Microscope className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'نتائج الخزعة' : 'Biopsy Results'}
//           </h4>
//           <div className="space-y-2">
//             {Object.entries(data.biopsyResults).map(([polyp, result]) => (
//               <div key={polyp} className="text-sm">
//                 <span className="font-medium text-gray-700">{polyp}:</span>
//                 <span className="text-gray-900 ml-2">{result as string}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Urology Data View
// const UrologyDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   return (
//     <div className="space-y-4">
//       {/* PSA Levels */}
//       {data.psaLevels && (
//         <div className="space-y-3">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Activity className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'مستويات PSA' : 'PSA Levels'}
//           </h4>
//           <div className="grid grid-cols-3 gap-2">
//             <div className="bg-blue-50 p-2 rounded text-center">
//               <div className="text-xs text-blue-700 mb-1">Total PSA</div>
//               <div className={`text-lg font-bold ${parseFloat(data.psaLevels.totalPSA) > 4 ? 'text-red-600' : 'text-green-600'}`}>
//                 {data.psaLevels.totalPSA}
//               </div>
//             </div>
//             <div className="bg-blue-50 p-2 rounded text-center">
//               <div className="text-xs text-blue-700 mb-1">Free PSA</div>
//               <div className="text-lg font-bold text-blue-900">{data.psaLevels.freePSA}</div>
//             </div>
//             <div className="bg-blue-50 p-2 rounded text-center">
//               <div className="text-xs text-blue-700 mb-1">Free/Total</div>
//               <div className="text-lg font-bold text-blue-900">{data.psaLevels.freeToTotalRatio}</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Ultrasound Findings */}
//       {data.ultrasoundFindings && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <ScanEye className="w-4 h-4 text-purple-500" />
//             {locale === 'ar' ? 'نتائج السونار' : 'Ultrasound Findings'}
//           </h4>
//           <div className="bg-purple-50 border border-purple-200 rounded p-3">
//             <p className="text-sm text-purple-900">{data.ultrasoundFindings}</p>
//           </div>
//         </div>
//       )}

//       {/* Urinary Symptoms */}
//       {data.urinarySymptoms && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Droplet className="w-4 h-4 text-cyan-500" />
//             {locale === 'ar' ? 'الأعراض البولية' : 'Urinary Symptoms'}
//           </h4>
//           <div className="grid grid-cols-2 gap-3">
//             {Object.entries(data.urinarySymptoms).map(([symptom, value]) => (
//               <div key={symptom} className="text-sm">
//                 <span className="text-gray-600 capitalize">{symptom}:</span>
//                 <span className="font-medium text-gray-900 ml-2">{value as string}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ENT Data View
// const ENTDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   return (
//     <div className="space-y-4">
//       {/* Audiometry Results */}
//       {data.audiometry && (
//         <div className="space-y-3">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Ear className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'نتائج قياس السمع' : 'Audiometry Results'}
//           </h4>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <div className="text-xs text-gray-500">{locale === 'ar' ? 'الأذن اليمنى' : 'Right Ear'}</div>
//               {data.audiometry.rightEar && (
//                 <div className="text-sm space-y-1">
//                   <div className="flex justify-between">
//                     <span>Air Conduction:</span>
//                     <span className="font-medium">{data.audiometry.rightEar.airConduction}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Type:</span>
//                     <span className="font-medium">{data.audiometry.rightEar.type}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="space-y-2">
//               <div className="text-xs text-gray-500">{locale === 'ar' ? 'الأذن اليسرى' : 'Left Ear'}</div>
//               {data.audiometry.leftEar && (
//                 <div className="text-sm space-y-1">
//                   <div className="flex justify-between">
//                     <span>Air Conduction:</span>
//                     <span className="font-medium">{data.audiometry.leftEar.airConduction}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Type:</span>
//                     <span className="font-medium">{data.audiometry.leftEar.type}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Nasal Endoscopy */}
//       {data.nasalEndoscopy && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Scan className="w-4 h-4 text-green-500" />
//             {locale === 'ar' ? 'نتائج منظار الأنف' : 'Nasal Endoscopy'}
//           </h4>
//           <div className="space-y-2">
//             {Object.entries(data.nasalEndoscopy).map(([area, finding]) => (
//               <div key={area} className="flex items-center justify-between text-sm">
//                 <span className="text-gray-600 capitalize">{area}:</span>
//                 <span className="font-medium text-gray-900">{finding as string}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* CT Findings */}
//       {data.ctFindings && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Camera className="w-4 h-4 text-purple-500" />
//             {locale === 'ar' ? 'نتائج الأشعة المقطعية' : 'CT Findings'}
//           </h4>
//           <div className="bg-purple-50 border border-purple-200 rounded p-3">
//             <div className="space-y-2">
//               {Object.entries(data.ctFindings).map(([sinus, finding]) => (
//                 <div key={sinus} className="flex justify-between text-sm">
//                   <span className="text-purple-700 capitalize">{sinus}:</span>
//                   <span className="font-medium text-purple-900">{finding as string}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Dermatology Data View
// const DermatologyDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   return (
//     <div className="space-y-4">
//       {/* Skin Findings */}
//       {data.findings && (
//         <div className="space-y-3">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Scaling className="w-4 h-4 text-orange-500" />
//             {locale === 'ar' ? 'النتائج' : 'Findings'}
//           </h4>
//           <div className="space-y-2">
//             {Object.entries(data.findings).map(([area, finding]) => (
//               <div key={area} className="text-sm">
//                 <span className="font-medium text-gray-700 capitalize">{area}:</span>
//                 <span className="text-gray-900 ml-2">{finding as string}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Dermoscopy */}
//       {data.dermoscopy && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Microscope className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'الفحص المجهري' : 'Dermoscopy'}
//           </h4>
//           <div className="space-y-2">
//             {Object.entries(data.dermoscopy).map(([lesion, pattern]) => (
//               <div key={lesion} className="text-sm">
//                 <span className="text-gray-600 capitalize">{lesion}:</span>
//                 <span className="font-medium text-gray-900 ml-2">{pattern as string}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Treatment */}
//       {data.treatment && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Pill className="w-4 h-4 text-green-600" />
//             {locale === 'ar' ? 'العلاج' : 'Treatment'}
//           </h4>
//           <div className="bg-green-50 border border-green-200 rounded p-3">
//             <div className="space-y-2">
//               {Object.entries(data.treatment).map(([type, details]) => (
//                 <div key={type} className="text-sm">
//                   <span className="font-medium text-green-700 capitalize">{type}:</span>
//                   <span className="text-green-900 ml-2">{details as string}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Internal Medicine Data View
// const InternalMedicineDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   return (
//     <div className="space-y-4">
//       {/* Blood Pressure & Heart Rate */}
//       {(data.systolic || data.diastolic || data.heartRate) && (
//         <div className="space-y-3">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Activity className="w-4 h-4 text-red-500" />
//             {locale === 'ar' ? 'العلامات الحيوية' : 'Vital Signs'}
//           </h4>
//           <div className="grid grid-cols-3 gap-3">
//             {data.systolic && (
//               <div className={`p-2 rounded text-center ${data.systolic > 130 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
//                 <div className="text-xs text-gray-600 mb-1">Systolic</div>
//                 <div className={`text-lg font-bold ${data.systolic > 130 ? 'text-red-600' : 'text-green-600'}`}>
//                   {data.systolic} mmHg
//                 </div>
//               </div>
//             )}
//             {data.diastolic && (
//               <div className={`p-2 rounded text-center ${data.diastolic > 80 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
//                 <div className="text-xs text-gray-600 mb-1">Diastolic</div>
//                 <div className={`text-lg font-bold ${data.diastolic > 80 ? 'text-red-600' : 'text-green-600'}`}>
//                   {data.diastolic} mmHg
//                 </div>
//               </div>
//             )}
//             {data.heartRate && (
//               <div className={`p-2 rounded text-center ${data.heartRate > 100 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
//                 <div className="text-xs text-gray-600 mb-1">Heart Rate</div>
//                 <div className={`text-lg font-bold ${data.heartRate > 100 ? 'text-red-600' : 'text-green-600'}`}>
//                   {data.heartRate} bpm
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Lab Results */}
//       {data.labResults && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <FlaskConical className="w-4 h-4 text-blue-500" />
//             {locale === 'ar' ? 'نتائج المعمل' : 'Lab Results'}
//           </h4>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//             {Object.entries(data.labResults).map(([test, value]) => {
//               let colorClass = 'text-gray-900';
//               let bgClass = 'bg-gray-50';
              
//               if (test.includes('glucose')) {
//                 const numValue = parseFloat((value as string).split(' ')[0]);
//                 colorClass = numValue > 140 ? 'text-red-600' : 'text-green-600';
//                 bgClass = numValue > 140 ? 'bg-red-50' : 'bg-green-50';
//               } else if (test.includes('creatinine')) {
//                 const numValue = parseFloat((value as string).split(' ')[0]);
//                 colorClass = numValue > 1.2 ? 'text-red-600' : 'text-green-600';
//                 bgClass = numValue > 1.2 ? 'bg-red-50' : 'bg-green-50';
//               }
              
//               return (
//                 <div key={test} className={`${bgClass} p-2 rounded border`}>
//                   <div className="text-xs text-gray-600 mb-1 capitalize">{test}</div>
//                   <div className={`font-medium ${colorClass}`}>{value as string}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Plan & Recommendations */}
//       {(data.plan || data.recommendations) && (
//         <div className="space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <ClipboardList className="w-4 h-4 text-purple-500" />
//             {locale === 'ar' ? 'خطة العلاج' : 'Treatment Plan'}
//           </h4>
//           <div className="bg-purple-50 border border-purple-200 rounded p-3">
//             {data.plan && <p className="text-sm text-purple-900 mb-2">{data.plan}</p>}
//             {data.recommendations && <p className="text-sm text-purple-900">{data.recommendations}</p>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Default Data View (for unknown specialties)
// const DefaultDataView = ({ data, locale }: { data: any, locale: string }) => {
//   if (!data) return null;

//   const renderValue = (value: any) => {
//     if (typeof value === 'object' && value !== null) {
//       return (
//         <div className="ml-4 mt-1 space-y-1 border-l pl-3 border-gray-200">
//           {Object.entries(value).map(([k, v]) => (
//             <div key={k} className="text-sm">
//               <span className="text-gray-600 capitalize">{k}:</span>
//               <span className="ml-2 font-medium">{renderValue(v)}</span>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return <span className="font-medium text-gray-900">{String(value)}</span>;
//   };

//   return (
//     <div className="space-y-3">
//       {Object.entries(data).map(([key, value]) => (
//         <div key={key} className="text-sm">
//           <div className="flex items-start">
//             <span className="text-gray-600 capitalize min-w-[120px]">{key}:</span>
//             <div className="flex-1">
//               {renderValue(value)}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



