"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button"; // أو استخدم زر html عادي
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { X, Maximize2, Minimize2, Download, Printer } from "lucide-react";
import { Search} from "lucide-react";
import { dummyPatients } from "@/lib/dummy-data";


import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";


// interface PatientRecord {
//   id: number;
//   patientName: string;
//   age: number;
//   gender: "Male" | "Female";
//   email: string;
//   phone: string;
//   bloodType: string;
//   avatar: string;
//   vitals: { label: string; value: string }[];
//   measurements: {
//     waist: string;
//     hip: string;
//     weight: string;
//   };
//   bodyComposition: {
//     bodyFat: string;
//     leanMass: string;
//     fatMass: string;
//   };
//   energyRequirements: {
//     resting: string;
//     daily: string;
//   };
//   importantDates: { date: string; title: string }[];
//   medications: { name: string; dose: string; notes: string }[];
//   timeline: { date: string; note: string }[];
// }



// بيانات مرضى تجريبية — استبدل أو أضف حسب حاجتك
// const patients: PatientRecord[] = [
//   {
//     id: 1,
//     patientName: "أنيل جوشي",
//     age: 34,
//     gender: "Male",
//     email: "anil10@gmail.com",
//     phone: "+20114555229",
//     bloodType: "O+",
//     avatar: "https://placehold.co/100x100.png?text=KO",
//     vitals: [
//       { label: "Blood pressure", value: "130/90" },
//       { label: "Heart rate", value: "110" },
//       { label: "Temperature", value: "38.4°C" },
//       { label: "RR", value: "18" },
//     ],
//     measurements: {
//       waist: "78 cm",
//       hip: "95 cm",
//       weight: "72 kg",
//     },
//     bodyComposition: {
//       bodyFat: "19%",
//       leanMass: "58 kg",
//       fatMass: "14 kg",
//     },
//     energyRequirements: {
//       resting: "1200 kcal/day",
//       daily: "1400 kcal/day",
//     },
//     importantDates: [
//       { date: "28 March 2025", title: "Office Consultation" },
//       { date: "30 March 2025", title: "Follow-up" },
//     ],
//     medications: [
//       { name: "Paracetamol", dose: "1 Tablet", notes: "2 times per day" },
//       { name: "Dalteparin", dose: "2 Tablet", notes: "after food" },
//     ],
//     timeline: [
//       { date: "2025-08-10", note: "زيارة طبية، وصف دواء" },
//       { date: "2025-08-12", note: "متابعة الحالة" },
//       { date: "2025-08-15", note: "شُفى المريض" },
//     ],
//   },
//   {
//     id: 2,
//     patientName: "فاطمة الزهراء",
//     age: 29,
//     gender: "Female",
//     email: "fatima29@gmail.com",
//     phone: "+20115558877",
//     bloodType: "A-",
//     avatar: "https://placehold.co/100x100.png?text=FZ",
//     vitals: [
//       { label: "Blood pressure", value: "120/80" },
//       { label: "Heart rate", value: "75" },
//       { label: "Temperature", value: "37.0°C" },
//       { label: "RR", value: "16" },
//     ],
//     measurements: {
//       waist: "68 cm",
//       hip: "90 cm",
//       weight: "60 kg",
//     },
//     bodyComposition: {
//       bodyFat: "22%",
//       leanMass: "47 kg",
//       fatMass: "13 kg",
//     },
//     energyRequirements: {
//       resting: "1100 kcal/day",
//       daily: "1300 kcal/day",
//     },
//     importantDates: [
//       { date: "25 April 2025", title: "Initial Checkup" },
//       { date: "01 May 2025", title: "Diet Consultation" },
//     ],
//     medications: [
//       { name: "Ibuprofen", dose: "1 Tablet", notes: "3 times per day" },
//     ],
//     timeline: [
//       { date: "2025-07-20", note: "زيارة طبية" },
//       { date: "2025-07-25", note: "تحسن ملحوظ" },
//     ],
//   },
// ];

// ضع هنا المسارات الحقيقية لاحقاً


// const maleBodyImg = "/bodies/m.png";
// const femaleBodyImg = "/bodies/f.png";

export default function MedicalRecordModalExample() {
  const patients = dummyPatients;
  const [searchTerm, setSearchTerm] = useState("");
  // const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState('الملف الطبي العام');
  // const [sortKey, setSortKey] = useState<keyof typeof dummyPatients[number] | null>(null);
  // const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<typeof dummyPatients[number] | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);


// فلترة على كل بيانات المريض
  const filteredPatients = patients.filter((p) =>
    Object.values(p).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // //  ⬆️⬇️ فرز
  // const sortedPatients = [...filteredPatients].sort((a, b) => {
  //   if (!sortKey) return 0;
  //   const aVal = a[sortKey] as any;
  //   const bVal = b[sortKey] as any;
  //   if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
  //   if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
  //   return 0;
  // });


  // const handleSort = (key: keyof typeof dummyPatients[number]) => {
  //   if (sortKey === key) {
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   } else {
  //     setSortKey(key);
  //     setSortOrder("asc");
  //   }
  // };



  // فتح المودال مع تحديد المريض
  const openModalWithPatient = (patient: typeof dummyPatients[number]) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handlePrint = () => {
    if (!contentRef.current) return;
    const html = contentRef.current.outerHTML;
    const newWin = window.open("", "_blank", "width=900,height=700");
    if (!newWin) return;
    newWin.document.write(`
      <html>
        <head>
          <title>طباعة السجل الطبي</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
            body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 10px; }
            .record-container { width: 100%; }
          </style>
        </head>
        <body>
          ${html}
          <script>
            setTimeout(() => { window.print(); setTimeout(()=>window.close(), 200); }, 500);
          </script>
        </body>
      </html>
    `);
    newWin.document.close();
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    setLoadingPdf(true);
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      const imgProps = { width: canvas.width, height: canvas.height };
      // const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      if (imgProps.height <= pdfPageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgProps.width, imgProps.height);
      } else {
        let heightLeft = imgProps.height;
        let position = 0;
        while (heightLeft > 0) {
          pdf.addImage(imgData, "PNG", 0, -position, imgProps.width, imgProps.height);
          heightLeft -= pdfPageHeight;
          position += pdfPageHeight;
          if (heightLeft > 0) pdf.addPage();
        }
      }

      pdf.save(`السجل_الطبي_${selectedPatient?.name || "مريض"}.pdf`);
    } catch (err) {
      console.error("Error exporting PDF", err);
      alert("حدث خطأ أثناء إنشاء PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


// دوال مساعدة لمعالجة البيانات
// const calculateAge = (dateOfBirth: string): number => {
//   const birthDate = new Date(dateOfBirth);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
  
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
  
//   return age;
// };

const parseHeartRate = (heartRate: string): number => {
  // استخراج الأرقام من النص
  const matches = heartRate.match(/\d+/);
  return matches ? parseInt(matches[0]) : 0;
};

const getHeartRateStatus = (patient: typeof dummyPatients[number]): string => {
  if (!patient.generalMedicine?.vitalSigns?.heartRate) return 'normal';
  const hr = parseHeartRate(patient.generalMedicine.vitalSigns.heartRate);
  return hr > 100 ? 'high' : 'normal';
};

const parseSystolicBloodPressure = (bp: string): number => {
  const matches = bp.match(/\d+/);
  return matches ? parseInt(matches[0]) : 0;
};

const getBloodPressureStatus = (bp: string): string => {
  const systolic = parseSystolicBloodPressure(bp);
  return systolic > 130 ? 'high' : 'normal';
};

const parseGlucose = (glucose: string): number => {
  const matches = glucose.match(/\d+/);
  return matches ? parseInt(matches[0]) : 0;
};

const getGlucoseStatus = (glucose: string): string => {
  const value = parseGlucose(glucose);
  return value > 140 ? 'high' : 'normal';
};

const parseTemperature = (temp: string): number => {
  const matches = temp.match(/\d+(\.\d+)?/);
  return matches ? parseFloat(matches[0]) : 0;
};

const getTemperatureStatus = (temp: string): string => {
  const value = parseTemperature(temp);
  return value > 37.5 ? 'high' : 'normal';
};

const isTestResultNormal = (test: { result: string; range?: string }): boolean => {
  if (!test.range) return true;
  
  // معالجة النطاقات المختلفة (مثل "70-110" أو "<140")
  if (test.range.includes('-')) {
    const [min, max] = test.range.split('-').map(val => parseFloat(val));
    const resultValue = parseFloat(test.result);
    return resultValue >= min && resultValue <= max;
  }
  
  // إذا لم يكن هناك نطاق محدد، نفترض أن النتيجة طبيعية
  return true;
};





  return (
    <>
      <div className="space-y-4 p-4 m-2">
      {/* العنوان + البحث */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--primary)]">
          سجلات المرضى
        </h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث باسم المريض أو الهاتف أو أي بيانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 rtl:pr-8 w-full"
          />
        </div>
      </div>

      {/* الجدول */}
      <div className="rounded-md border shadow-sm bg-card p-4 m-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم المريض</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">العمر</TableHead>
              <TableHead className="text-right">الجنس</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">إجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{calculateAge(p.dateOfBirth)} سنة</TableCell>
                  <TableCell>{p.gender === "Male" ? "ذكر" : "أنثى"}</TableCell>
                  <TableCell>{p.contactPhone}</TableCell>
                  <TableCell className="text-right rtl:text-left">
                    <Button
                      onClick={() => openModalWithPatient(p)}
                      size="sm"
                      className="rounded-xl"
                    >
                      عرض السجل الطبي
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  لا يوجد مرضى مطابقين للبحث
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    {open && selectedPatient && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    aria-modal="true"
    role="dialog"
    onClick={() => setOpen(false)}
  >
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col 
        ${maximized ? "w-[95vw] h-[95vh]" : "w-[1400px] h-[90vh]"} transition-all duration-300`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={selectedPatient.avatar || "/default-avatar.png"}
              alt="avatar"
              className="h-12 w-12 rounded-full border-2 border-white shadow-md"
            />
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getHeartRateStatus(selectedPatient) === 'high' ? 'bg-red-500' : 'bg-green-500'}`}></div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl">{selectedPatient.name}</div>
            <div className="text-sm opacity-90 flex gap-2">
              <span>ID: {selectedPatient.id}</span>
              <span>•</span>
              <span>آخر زيارة: {selectedPatient.lastVisit || "لا توجد زيارة سابقة"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-blue-700"
            onClick={() => setMaximized(!maximized)}
            aria-label="تكبير/تصغير"
          >
            {maximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
          <Button size="icon" variant="ghost" className="text-white hover:bg-blue-700" onClick={handlePrint} aria-label="طباعة">
            <Printer size={18} />
          </Button>
          <Button size="icon" variant="ghost" className="text-white hover:bg-blue-700" onClick={handleExportPDF} aria-label="PDF">
            <Download size={18} />
          </Button>
          <Button size="icon" variant="ghost" className="text-white hover:bg-blue-700" onClick={() => setOpen(false)} aria-label="إغلاق">
            <X size={18} />
          </Button>
        </div>
      </div>

      <div
        ref={contentRef}
        dir="rtl"
        className="flex-1 overflow-auto p-6 bg-gray-50 text-gray-900"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <div className="grid grid-cols-12 gap-5">
          {/* العمود الجانبي - المعلومات الأساسية */}
          <div className="col-span-3 space-y-5">
            {/* بطاقة المعلومات الشخصية */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">المعلومات الشخصية</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">العمر</span>
                  <span className="font-medium">
                    {calculateAge(selectedPatient.dateOfBirth)} سنة
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">الجنس</span>
                  <span className="font-medium">
                    {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">فصيلة الدم</span>
                  <span className="font-medium">O+</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">الحالة</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">مستقر</span>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">معلومات الاتصال</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{selectedPatient.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{selectedPatient.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{selectedPatient.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* المؤشرات الحيوية */}
            {selectedPatient.generalMedicine?.vitalSigns && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">المؤشرات الحيوية</h3>
                
                <div className="space-y-4">
                  {selectedPatient.generalMedicine.vitalSigns.bloodPressure && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">ضغط الدم</span>
                        <span className={`font-bold ${getBloodPressureStatus(selectedPatient.generalMedicine.vitalSigns.bloodPressure) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedPatient.generalMedicine.vitalSigns.bloodPressure}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (parseSystolicBloodPressure(selectedPatient.generalMedicine.vitalSigns.bloodPressure) / 200) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.generalMedicine.vitalSigns.heartRate && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">نبض القلب</span>
                        <span className={`font-bold ${getHeartRateStatus(selectedPatient) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
                          {parseHeartRate(selectedPatient.generalMedicine.vitalSigns.heartRate)} دقة/د
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (parseHeartRate(selectedPatient.generalMedicine.vitalSigns.heartRate) / 150) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.generalMedicine.vitalSigns.glucose && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">سكر الدم</span>
                        <span className={`font-bold ${getGlucoseStatus(selectedPatient.generalMedicine.vitalSigns.glucose) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
                          {parseGlucose(selectedPatient.generalMedicine.vitalSigns.glucose)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (parseGlucose(selectedPatient.generalMedicine.vitalSigns.glucose) / 300) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.generalMedicine.vitalSigns.temperature && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">درجة الحرارة</span>
                        <span className={`font-bold ${getTemperatureStatus(selectedPatient.generalMedicine.vitalSigns.temperature) === 'high' ? 'text-red-600' : 'text-green-600'}`}>
                          {parseTemperature(selectedPatient.generalMedicine.vitalSigns.temperature)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((parseTemperature(selectedPatient.generalMedicine.vitalSigns.temperature) - 35) / 5) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* الأدوية الحالية */}
            {selectedPatient.generalMedicine?.medications && selectedPatient.generalMedicine.medications.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">الأدوية الحالية</h3>
                
                <div className="space-y-3">
                  {selectedPatient.generalMedicine.medications.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-sm">{med}</div>
                        <div className="text-xs text-gray-500">جرعة: 500mg - مرتين daily</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* معلومات إضافية */}
            {selectedPatient.personalInfo && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b pb-2">معلومات إضافية</h3>
                
                <div className="space-y-3">
                  {selectedPatient.personalInfo.chronicConditions && selectedPatient.personalInfo.chronicConditions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">الأمراض المزمنة</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPatient.personalInfo.chronicConditions.map((condition, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.personalInfo.allergies && selectedPatient.personalInfo.allergies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">الحساسيات</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPatient.personalInfo.allergies.map((allergy, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.personalInfo.lifestyle && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">نمط الحياة</h4>
                      <div className="space-y-1 text-xs">
                        {selectedPatient.personalInfo.lifestyle.smoking !== undefined && (
                          <div>التدخين: {selectedPatient.personalInfo.lifestyle.smoking ? 'نعم' : 'لا'}</div>
                        )}
                        {selectedPatient.personalInfo.lifestyle.exercise && (
                          <div>التمارين: {selectedPatient.personalInfo.lifestyle.exercise}</div>
                        )}
                        {selectedPatient.personalInfo.lifestyle.diet && (
                          <div>النظام الغذائي: {selectedPatient.personalInfo.lifestyle.diet}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* المحتوى الرئيسي */}
          <div className="col-span-9 space-y-5">
            {/* علامات التبويب */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button 
                  className={`px-5 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'الملف الطبي العام' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('الملف الطبي العام')}
                >
                  الملف الطبي العام
                </button>
                <button 
                  className={`px-5 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'الفحوصات' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('الفحوصات')}
                >
                  الفحوصات
                </button>
                <button 
                  className={`px-5 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'القلب' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('القلب')}
                >
                  القلب
                </button>
                <button 
                  className={`px-5 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'الأشعة' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('الأشعة')}
                >
                  الأشعة
                </button>
                <button 
                  className={`px-5 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'الجراحة' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('الجراحة')}
                >
                  الجراحة
                </button>
                <button 
                  className={`px-5 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'التغذية' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('التغذية')}
                >
                  التغذية
                </button>
                <button 
                  className={`px-5 py-3 font-medium whitespace-nowrap ${
                    activeTab === 'العلاج الطبيعي' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('العلاج الطبيعي')}
                >
                  العلاج الطبيعي
                </button>
              </div>
              
              <div className="p-5">
                {/* محتوى الملف الطبي العام */}
                {activeTab === 'الملف الطبي العام' && (
                  <>
                    {/* التشخيصات */}
                    {selectedPatient.generalMedicine?.diagnoses && selectedPatient.generalMedicine.diagnoses.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">التشخيصات</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {selectedPatient.generalMedicine.diagnoses.map((diagnosis, idx) => (
                            <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{diagnosis.description}</div>
                                  <div className="text-sm text-gray-500 mt-1">كود: {diagnosis.code}</div>
                                </div>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">نشط</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* الأعراض */}
                    {selectedPatient.generalMedicine?.symptoms && selectedPatient.generalMedicine.symptoms.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">الأعراض</h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.generalMedicine.symptoms.map((symptom, idx) => (
                            <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* الخطة العلاجية */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-3 text-blue-800">الخطة العلاجية</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-800 mb-2">الإجراءات المطلوبة</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                            <li>فحص السكر التراكمي كل 3 أشهر</li>
                            <li>مراقبة ضغط الدم أسبوعياً</li>
                            <li>زيارة عيادة السكري شهرياً</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-800 mb-2">التوصيات</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                            <li>اتباع نظام غذائي منخفض الكربوهيدرات</li>
                            <li>ممارسة رياضة المشي 30 دقيقة يومياً</li>
                            <li>فحص القدمين يومياً</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* زيارات العيادة */}
                    {selectedPatient.visitNotes && selectedPatient.visitNotes.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">سجل الزيارات</h3>
                        
                        <div className="space-y-4">
                          {selectedPatient.visitNotes.map((visit, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">{visit.date}</div>
                                <div className="text-sm text-gray-500">د. {visit.doctorName}</div>
                              </div>
                              <p className="text-gray-700 text-sm">{visit.notes}</p>
                              
                              <div className="mt-3 flex gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">فحص عام</span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">وصفة طبية</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* محتوى الفحوصات */}
                {activeTab === 'الفحوصات' && (
                  <>
                    {/* الفحوصات المخبرية */}
                    {selectedPatient.labTests && selectedPatient.labTests.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">الفحوصات المخبرية</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <table className="w-full">
                            <thead>
                              <tr className="text-right border-b border-gray-200">
                                <th className="pb-2 font-medium">الفحص</th>
                                <th className="pb-2 font-medium">النتيجة</th>
                                <th className="pb-2 font-medium">المعدل الطبيعي</th>
                                <th className="pb-2 font-medium">الحالة</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedPatient.labTests.map((test, idx) => {
                                const isNormal = isTestResultNormal(test);
                                return (
                                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-100">
                                    <td className="py-3 text-sm">{test.testName}</td>
                                    <td className="py-3 font-medium">{test.result} {test.unit}</td>
                                    <td className="py-3 text-sm text-gray-500">{test.range || 'N/A'}</td>
                                    <td className="py-3">
                                      <span className={`px-2 py-1 text-xs rounded-full ${isNormal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isNormal ? 'طبيعي' : 'غير طبيعي'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* الأشعة */}
                    {selectedPatient.radiology && selectedPatient.radiology.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">تقارير الأشعة</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {selectedPatient.radiology.map((scan, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-700">{scan.type}</h4>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                 {new Date(scan.reportDate || selectedPatient.lastVisit || Date.now()).toLocaleDateString('ar-EG')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{scan.report}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* محتوى القلب */}
                {activeTab === 'القلب' && (
                  <>
                    {/* أمراض القلب */}
                    {selectedPatient.cardiology && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">أمراض القلب</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {selectedPatient.cardiology.ecgResults && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-2">نتائج تخطيط القلب</h4>
                              <p className="text-sm">{selectedPatient.cardiology.ecgResults}</p>
                            </div>
                          )}
                          
                          {selectedPatient.cardiology.echocardiography && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-2">تصوير صدى القلب</h4>
                              <p className="text-sm">{selectedPatient.cardiology.echocardiography}</p>
                            </div>
                          )}
                          
                          {selectedPatient.cardiology.cardiacMeds && selectedPatient.cardiology.cardiacMeds.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
                              <h4 className="font-medium text-gray-700 mb-2">أدوية القلب</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedPatient.cardiology.cardiacMeds.map((med, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                    {med}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* محتوى الأشعة */}
                {activeTab === 'الأشعة' && (
                  <>
                    {selectedPatient.radiology && selectedPatient.radiology.length > 0 ? (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">تقارير الأشعة</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {selectedPatient.radiology.map((scan, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-700">{scan.type}</h4>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {new Date().toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{scan.report}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        لا توجد تقارير أشعة متاحة
                      </div>
                    )}
                  </>
                )}

                {/* محتوى الجراحة */}
                {activeTab === 'الجراحة' && (
                  <>
                    {selectedPatient.surgery && selectedPatient.surgery.length > 0 ? (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">التاريخ الجراحي</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {selectedPatient.surgery.map((surgery, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-700">{surgery.type}</h4>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  مكتمل
                                </span>
                              </div>
                              {surgery.description && (
                                <p className="text-sm text-gray-600 mb-2">{surgery.description}</p>
                              )}
                              {surgery.complications && surgery.complications.length > 0 && (
                                <div className="mb-2">
                                  <h5 className="font-medium text-sm text-gray-700">المضاعفات:</h5>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {surgery.complications.map((comp, compIdx) => (
                                      <li key={compIdx}>{comp}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        لا توجد عمليات جراحية سابقة
                      </div>
                    )}
                  </>
                )}

                {/* محتوى التغذية */}
                {activeTab === 'التغذية' && (
                  <>
                    {selectedPatient.nutrition ? (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">التغذية والحمية</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {selectedPatient.nutrition.dietPlan && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-2">الخطة الغذائية</h4>
                              <p className="text-sm text-gray-600">{selectedPatient.nutrition.dietPlan}</p>
                            </div>
                          )}
                          
                          {selectedPatient.nutrition.weightEvaluation && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-2">تقييم الوزن</h4>
                              <p className="text-sm text-gray-600">{selectedPatient.nutrition.weightEvaluation}</p>
                            </div>
                          )}
                          
                          {selectedPatient.nutrition.followUp && selectedPatient.nutrition.followUp.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
                              <h4 className="font-medium text-gray-700 mb-2">متابعة التغذية</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {selectedPatient.nutrition.followUp.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        لا توجد معلومات عن التغذية
                      </div>
                    )}
                  </>
                )}

                {/* محتوى العلاج الطبيعي */}
                {activeTab === 'العلاج الطبيعي' && (
                  <>
                    {selectedPatient.physiotherapy ? (
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3 text-blue-800">العلاج الطبيعي</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {selectedPatient.physiotherapy.exerciseProgram && selectedPatient.physiotherapy.exerciseProgram.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-2">برنامج التمارين</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {selectedPatient.physiotherapy.exerciseProgram.map((exercise, idx) => (
                                  <li key={idx}>{exercise}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {selectedPatient.physiotherapy.progressNotes && selectedPatient.physiotherapy.progressNotes.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-medium text-gray-700 mb-2">تقدم العلاج</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {selectedPatient.physiotherapy.progressNotes.map((note, idx) => (
                                  <li key={idx}>{note}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {selectedPatient.physiotherapy.assistiveDevices && selectedPatient.physiotherapy.assistiveDevices.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
                              <h4 className="font-medium text-gray-700 mb-2">أجهزة مساعدة</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {selectedPatient.physiotherapy.assistiveDevices.map((device, idx) => (
                                  <li key={idx}>{device}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        لا توجد معلومات عن العلاج الطبيعي
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 p-4 bg-gray-100 border-t">
        <Button onClick={handleExportPDF} disabled={loadingPdf} className="bg-blue-600 hover:bg-blue-700">
          {loadingPdf ? "جاري إنشاء PDF..." : "حفظ كـ PDF"}
        </Button>
        <Button onClick={handlePrint} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
          طباعة
        </Button>
        <Button onClick={() => setOpen(false)} variant="ghost">
          إغلاق
        </Button>
      </div>
    </div>
  </div>
)}



      
    </>
  );
}



// {open && selectedPatient && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
//           aria-modal="true"
//           role="dialog"
//           onClick={() => setOpen(false)}
//         >
//           <div
//             className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col 
//               ${maximized ? "w-[95vw] h-[95vh]" : "w-[1100px] h-[80vh]"} `}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between px-4 py-3 bg-[var(--primary)] text-[var(--primary-foreground)]">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={selectedPatient.avatar}
//                   alt="avatar"
//                   className="h-10 w-10 rounded-full border"
//                 />
//                 <div className="text-right">
//                   <div className="font-bold text-lg">{selectedPatient.name}</div>
//                   <div className="text-sm opacity-90">Patient ID: {selectedPatient.id}</div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => setMaximized(!maximized)}
//                   aria-label="تكبير/تصغير"
//                 >
//                   {maximized ? <Minimize2 /> : <Maximize2 />}
//                 </Button>
//                 <Button size="icon" variant="ghost" onClick={handlePrint} aria-label="طباعة">
//                   <Printer />
//                 </Button>
//                 <Button size="icon" variant="ghost" onClick={handleExportPDF} aria-label="PDF">
//                   <Download />
//                 </Button>
//                 <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="إغلاق">
//                   <X />
//                 </Button>
//               </div>
//             </div>

//             <div
//               ref={contentRef}
//               dir="rtl"
//               className="flex-1 overflow-auto p-6 bg-white text-gray-900"
//               style={{ fontFamily: "'Cairo', sans-serif" }}
//             >
//               {/* Indicators */}
//               <div className="flex gap-3 mb-4">
//                 {selectedPatient.vitals.map((v, idx) => (
//                   <div
//                     key={idx}
//                     className="flex-1 bg-gray-50 dark:bg-gray-800 rounded p-3 flex flex-col items-center"
//                   >
//                     <div className="text-sm opacity-70">{v.label}</div>
//                     <div className="font-bold text-xl">{v.value}</div>
//                   </div>
//                 ))}
//               </div>

//               {/* Profile + summary */}
//               <div className="bg-white rounded shadow-sm p-4 mb-4 border">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//                   <div className="flex items-center gap-4">
//                     <img
//                       src={selectedPatient.avatar}
//                       alt="avatar"
//                       className="h-20 w-20 rounded-full"
//                     />
//                     <div>
//                       <h2 className="text-xl font-semibold">{selectedPatient.patientName}</h2>
//                       <div className="text-sm opacity-80">Email: {selectedPatient.email}</div>
//                       <div className="text-sm opacity-80">Phone: {selectedPatient.phone}</div>
//                     </div>
//                   </div>

//                   <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-2">
//                     <div>
//                       <div className="text-sm opacity-70">Blood Type</div>
//                       <div className="font-semibold">{selectedPatient.bloodType}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm opacity-70">Age</div>
//                       <div className="font-semibold">{selectedPatient.age}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm opacity-70">Gender</div>
//                       <div className="font-semibold">
//                         {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-sm opacity-70">ID</div>
//                       <div className="font-semibold">{selectedPatient.id}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Body Measurements + Body Composition */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//                 <div className="bg-white border rounded p-4">
//                   <h3 className="font-semibold mb-3">Body Measurements</h3>
//                   <div className="flex gap-4">
//                     <div className="flex-1">
//                       <div className="h-40 bg-[linear-gradient(90deg,#f5f7fa,#eaeef2)] rounded flex items-center justify-center">
//                         {/* صورة شكل الجسم حسب الجنس */}
//                         <img
//                           src={selectedPatient.gender === "Male" ? maleBodyImg : femaleBodyImg}
//                           alt="Body Shape"
//                           className="max-h-full max-w-full object-contain"
//                         />
//                       </div>
//                     </div>
//                     <div className="w-56">
//                       <div className="mb-2">
//                         <div className="text-sm opacity-70">Waist</div>
//                         <div className="font-semibold">{selectedPatient.measurements.waist}</div>
//                       </div>
//                       <div className="mb-2">
//                         <div className="text-sm opacity-70">Hip</div>
//                         <div className="font-semibold">{selectedPatient.measurements.hip}</div>
//                       </div>
//                       <div className="mb-2">
//                         <div className="text-sm opacity-70">Weight</div>
//                         <div className="font-semibold">{selectedPatient.measurements.weight}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white border rounded p-4">
//                   <h3 className="font-semibold mb-3">Body Composition</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <div className="text-sm opacity-70">Body Fat %</div>
//                       <div className="w-full bg-gray-100 rounded h-3 mt-1">
//                         <div
//                           className="bg-teal-400 h-3 rounded"
//                           style={{ width: selectedPatient.bodyComposition.bodyFat || "19%" }}
//                         />
//                       </div>
//                       <div className="text-sm mt-1">{selectedPatient.bodyComposition.bodyFat}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm opacity-70">Lean Mass</div>
//                       <div className="text-sm mt-1 font-semibold">{selectedPatient.bodyComposition.leanMass}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm opacity-70">Fat Mass</div>
//                       <div className="text-sm mt-1 font-semibold">{selectedPatient.bodyComposition.fatMass}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Energy Requirements */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//                 <div className="bg-white border rounded p-4">
//                   <h4 className="font-semibold">Energy Requirements</h4>
//                   <p className="text-sm opacity-70 mt-2">Resting Metabolic Rate</p>
//                   <div className="font-semibold mt-1">{selectedPatient.energyRequirements.resting}</div>
//                 </div>

//                 <div className="bg-white border rounded p-4">
//                   <h4 className="font-semibold">Daily Calorie Requirements</h4>
//                   <p className="text-sm opacity-70 mt-2">Estimated daily calories</p>
//                   <div className="font-semibold mt-1">{selectedPatient.energyRequirements.daily}</div>
//                 </div>
//               </div>

//               {/* Important Dates & Medications */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="bg-white border rounded p-4">
//                   <h4 className="font-semibold mb-3">Important Dates</h4>
//                   <ul className="space-y-2">
//                     {selectedPatient.importantDates.map((d, i) => (
//                       <li key={i} className="text-sm">
//                         <span className="font-semibold">{d.date}</span> — {d.title}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="bg-white border rounded p-4">
//                   <h4 className="font-semibold mb-3">Current Medication</h4>
//                   <ul className="space-y-2">
//                     {selectedPatient.medications.map((m, i) => (
//                       <li key={i} className="text-sm">
//                         <span className="font-semibold">{m.name}</span> — {m.dose} •{" "}
//                         <span className="opacity-80">{m.notes}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Timeline */}
//               <div className="mt-4">
//                 <h4 className="font-semibold mb-2">سجل الملاحظات وترتيبها زمنياً</h4>
//                 <div className="space-y-3">
//                   {selectedPatient.timeline.map((t, idx) => (
//                     <div key={idx} className="bg-gray-50 border rounded p-3">
//                       <div className="text-sm font-semibold">{t.date}</div>
//                       <div className="text-sm mt-1">{t.note}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-2 p-3 bg-gray-50 border-t">
//               <Button onClick={handleExportPDF} disabled={loadingPdf}>
//                 {loadingPdf ? "جاري إنشاء PDF..." : "حفظ كـ PDF"}
//               </Button>
//               <Button onClick={handlePrint} variant="outline">
//                 طباعة
//               </Button>
//               <Button onClick={() => setOpen(false)} variant="ghost">
//                 إغلاق
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}