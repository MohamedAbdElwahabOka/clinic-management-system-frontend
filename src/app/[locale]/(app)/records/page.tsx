"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button"; // أو استخدم زر html عادي
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { X, Maximize2, Minimize2, Download, Printer } from "lucide-react";

interface PatientRecord {
  id: number;
  patientName: string;
  age: number;
  gender: "Male" | "Female";
  email: string;
  phone: string;
  bloodType: string;
  avatar: string;
  vitals: { label: string; value: string }[];
  measurements: {
    waist: string;
    hip: string;
    weight: string;
  };
  bodyComposition: {
    bodyFat: string;
    leanMass: string;
    fatMass: string;
  };
  energyRequirements: {
    resting: string;
    daily: string;
  };
  importantDates: { date: string; title: string }[];
  medications: { name: string; dose: string; notes: string }[];
  timeline: { date: string; note: string }[];
}

// بيانات مرضى تجريبية — استبدل أو أضف حسب حاجتك
const patients: PatientRecord[] = [
  {
    id: 1,
    patientName: "أنيل جوشي",
    age: 34,
    gender: "Male",
    email: "anil10@gmail.com",
    phone: "+20114555229",
    bloodType: "O+",
    avatar: "https://placehold.co/100x100.png?text=KO",
    vitals: [
      { label: "Blood pressure", value: "130/90" },
      { label: "Heart rate", value: "110" },
      { label: "Temperature", value: "38.4°C" },
      { label: "RR", value: "18" },
    ],
    measurements: {
      waist: "78 cm",
      hip: "95 cm",
      weight: "72 kg",
    },
    bodyComposition: {
      bodyFat: "19%",
      leanMass: "58 kg",
      fatMass: "14 kg",
    },
    energyRequirements: {
      resting: "1200 kcal/day",
      daily: "1400 kcal/day",
    },
    importantDates: [
      { date: "28 March 2025", title: "Office Consultation" },
      { date: "30 March 2025", title: "Follow-up" },
    ],
    medications: [
      { name: "Paracetamol", dose: "1 Tablet", notes: "2 times per day" },
      { name: "Dalteparin", dose: "2 Tablet", notes: "after food" },
    ],
    timeline: [
      { date: "2025-08-10", note: "زيارة طبية، وصف دواء" },
      { date: "2025-08-12", note: "متابعة الحالة" },
      { date: "2025-08-15", note: "شُفى المريض" },
    ],
  },
  {
    id: 2,
    patientName: "فاطمة الزهراء",
    age: 29,
    gender: "Female",
    email: "fatima29@gmail.com",
    phone: "+20115558877",
    bloodType: "A-",
    avatar: "https://placehold.co/100x100.png?text=FZ",
    vitals: [
      { label: "Blood pressure", value: "120/80" },
      { label: "Heart rate", value: "75" },
      { label: "Temperature", value: "37.0°C" },
      { label: "RR", value: "16" },
    ],
    measurements: {
      waist: "68 cm",
      hip: "90 cm",
      weight: "60 kg",
    },
    bodyComposition: {
      bodyFat: "22%",
      leanMass: "47 kg",
      fatMass: "13 kg",
    },
    energyRequirements: {
      resting: "1100 kcal/day",
      daily: "1300 kcal/day",
    },
    importantDates: [
      { date: "25 April 2025", title: "Initial Checkup" },
      { date: "01 May 2025", title: "Diet Consultation" },
    ],
    medications: [
      { name: "Ibuprofen", dose: "1 Tablet", notes: "3 times per day" },
    ],
    timeline: [
      { date: "2025-07-20", note: "زيارة طبية" },
      { date: "2025-07-25", note: "تحسن ملحوظ" },
    ],
  },
];

// ضع هنا المسارات الحقيقية لاحقاً
const maleBodyImg = "/bodies/m.png";
const femaleBodyImg = "/bodies/f.png";

export default function MedicalRecordModalExample() {
  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // فتح المودال مع تحديد المريض
  const openModalWithPatient = (patient: PatientRecord) => {
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

      pdf.save(`السجل_الطبي_${selectedPatient?.patientName || "مريض"}.pdf`);
    } catch (err) {
      console.error("Error exporting PDF", err);
      alert("حدث خطأ أثناء إنشاء PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-center">قائمة المرضى</h1>
        <table className="w-full border-collapse text-right" dir="rtl">
          <thead>
            <tr className="bg-[var(--primary)] text-white">
              <th className="border px-4 py-2">اسم المريض</th>
              <th className="border px-4 py-2">العمر</th>
              <th className="border px-4 py-2">الجنس</th>
              <th className="border px-4 py-2">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="border px-4 py-2">{p.patientName}</td>
                <td className="border px-4 py-2">{p.age}</td>
                <td className="border px-4 py-2">{p.gender === "Male" ? "ذكر" : "أنثى"}</td>
                <td className="border px-4 py-2">
                  <Button onClick={() => openModalWithPatient(p)} size="sm">
                    عرض السجل
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              ${maximized ? "w-[95vw] h-[95vh]" : "w-[1100px] h-[80vh]"} `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--primary)] text-[var(--primary-foreground)]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPatient.avatar}
                  alt="avatar"
                  className="h-10 w-10 rounded-full border"
                />
                <div className="text-right">
                  <div className="font-bold text-lg">{selectedPatient.patientName}</div>
                  <div className="text-sm opacity-90">Patient ID: {selectedPatient.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMaximized(!maximized)}
                  aria-label="تكبير/تصغير"
                >
                  {maximized ? <Minimize2 /> : <Maximize2 />}
                </Button>
                <Button size="icon" variant="ghost" onClick={handlePrint} aria-label="طباعة">
                  <Printer />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleExportPDF} aria-label="PDF">
                  <Download />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="إغلاق">
                  <X />
                </Button>
              </div>
            </div>

            <div
              ref={contentRef}
              dir="rtl"
              className="flex-1 overflow-auto p-6 bg-white text-gray-900"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {/* Indicators */}
              <div className="flex gap-3 mb-4">
                {selectedPatient.vitals.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 rounded p-3 flex flex-col items-center"
                  >
                    <div className="text-sm opacity-70">{v.label}</div>
                    <div className="font-bold text-xl">{v.value}</div>
                  </div>
                ))}
              </div>

              {/* Profile + summary */}
              <div className="bg-white rounded shadow-sm p-4 mb-4 border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedPatient.avatar}
                      alt="avatar"
                      className="h-20 w-20 rounded-full"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{selectedPatient.patientName}</h2>
                      <div className="text-sm opacity-80">Email: {selectedPatient.email}</div>
                      <div className="text-sm opacity-80">Phone: {selectedPatient.phone}</div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm opacity-70">Blood Type</div>
                      <div className="font-semibold">{selectedPatient.bloodType}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Age</div>
                      <div className="font-semibold">{selectedPatient.age}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Gender</div>
                      <div className="font-semibold">
                        {selectedPatient.gender === "Male" ? "ذكر" : "أنثى"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">ID</div>
                      <div className="font-semibold">{selectedPatient.id}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Measurements + Body Composition */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white border rounded p-4">
                  <h3 className="font-semibold mb-3">Body Measurements</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="h-40 bg-[linear-gradient(90deg,#f5f7fa,#eaeef2)] rounded flex items-center justify-center">
                        {/* صورة شكل الجسم حسب الجنس */}
                        <img
                          src={selectedPatient.gender === "Male" ? maleBodyImg : femaleBodyImg}
                          alt="Body Shape"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="w-56">
                      <div className="mb-2">
                        <div className="text-sm opacity-70">Waist</div>
                        <div className="font-semibold">{selectedPatient.measurements.waist}</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-sm opacity-70">Hip</div>
                        <div className="font-semibold">{selectedPatient.measurements.hip}</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-sm opacity-70">Weight</div>
                        <div className="font-semibold">{selectedPatient.measurements.weight}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded p-4">
                  <h3 className="font-semibold mb-3">Body Composition</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm opacity-70">Body Fat %</div>
                      <div className="w-full bg-gray-100 rounded h-3 mt-1">
                        <div
                          className="bg-teal-400 h-3 rounded"
                          style={{ width: selectedPatient.bodyComposition.bodyFat || "19%" }}
                        />
                      </div>
                      <div className="text-sm mt-1">{selectedPatient.bodyComposition.bodyFat}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Lean Mass</div>
                      <div className="text-sm mt-1 font-semibold">{selectedPatient.bodyComposition.leanMass}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Fat Mass</div>
                      <div className="text-sm mt-1 font-semibold">{selectedPatient.bodyComposition.fatMass}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Requirements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white border rounded p-4">
                  <h4 className="font-semibold">Energy Requirements</h4>
                  <p className="text-sm opacity-70 mt-2">Resting Metabolic Rate</p>
                  <div className="font-semibold mt-1">{selectedPatient.energyRequirements.resting}</div>
                </div>

                <div className="bg-white border rounded p-4">
                  <h4 className="font-semibold">Daily Calorie Requirements</h4>
                  <p className="text-sm opacity-70 mt-2">Estimated daily calories</p>
                  <div className="font-semibold mt-1">{selectedPatient.energyRequirements.daily}</div>
                </div>
              </div>

              {/* Important Dates & Medications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border rounded p-4">
                  <h4 className="font-semibold mb-3">Important Dates</h4>
                  <ul className="space-y-2">
                    {selectedPatient.importantDates.map((d, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-semibold">{d.date}</span> — {d.title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border rounded p-4">
                  <h4 className="font-semibold mb-3">Current Medication</h4>
                  <ul className="space-y-2">
                    {selectedPatient.medications.map((m, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-semibold">{m.name}</span> — {m.dose} •{" "}
                        <span className="opacity-80">{m.notes}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">سجل الملاحظات وترتيبها زمنياً</h4>
                <div className="space-y-3">
                  {selectedPatient.timeline.map((t, idx) => (
                    <div key={idx} className="bg-gray-50 border rounded p-3">
                      <div className="text-sm font-semibold">{t.date}</div>
                      <div className="text-sm mt-1">{t.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-3 bg-gray-50 border-t">
              <Button onClick={handleExportPDF} disabled={loadingPdf}>
                {loadingPdf ? "جاري إنشاء PDF..." : "حفظ كـ PDF"}
              </Button>
              <Button onClick={handlePrint} variant="outline">
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
