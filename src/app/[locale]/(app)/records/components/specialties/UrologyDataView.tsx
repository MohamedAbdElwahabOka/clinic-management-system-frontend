// import React from 'react';
// import { Activity, ScanEye, Droplet } from 'lucide-react';

// interface UrologyDataViewProps {
//   data: any;
//   locale: string;
// }

// const UrologyDataView: React.FC<UrologyDataViewProps> = ({ data, locale }) => {
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

// export default UrologyDataView;












import React from 'react';
import {
  Activity,
  ScanEye,
  Droplet,
  Stethoscope,
  FlaskConical,
  Brain,
  Heart,
  AlertTriangle,
  Thermometer,
  ChartBar,
  User,
  Pill,
  Calendar,
  Microscope,
  FileText,
  Zap,
  Shield,
  TrendingUp,
  Eye
} from 'lucide-react';

interface UrologyDataViewProps {
  data: any;
  locale: string;
}

const UrologyDataView: React.FC<UrologyDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  const isArabic = locale === 'ar';

  const renderPSARisk = (value: number) => {
    if (value > 10) return { color: 'bg-red-100 text-red-800', label: 'High Risk' };
    if (value > 4) return { color: 'bg-amber-100 text-amber-800', label: 'Intermediate Risk' };
    return { color: 'bg-green-100 text-green-800', label: 'Low Risk' };
  };

  return (
    <div className="space-y-6">
      {/* Header - Quick Assessment */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {isArabic ? 'تقييم المسالك البولية' : 'Urological Assessment'}
              </h3>
              <p className="text-sm text-gray-600">
                {isArabic ? 'المدة: ' : 'Duration: '}
                <span className="font-medium">{data.patientHistory?.duration}</span>
              </p>
            </div>
          </div>
          
          {data.laboratoryInvestigations?.psa?.total?.value && (
            <div className="text-right">
              <div className={`px-3 py-2 rounded-lg ${renderPSARisk(data.laboratoryInvestigations.psa.total.value).color} font-bold`}>
                PSA: {data.laboratoryInvestigations.psa.total.value} ng/mL
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {renderPSARisk(data.laboratoryInvestigations.psa.total.value).label}
              </p>
            </div>
          )}
        </div>

        {/* Chief Complaint & IPSS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.patientHistory?.chiefComplaint && (
            <div className="bg-white border border-blue-200 rounded p-3">
              <h4 className="text-sm font-semibold text-blue-800 mb-1">
                {isArabic ? 'الشكوى الرئيسية' : 'Chief Complaint'}
              </h4>
              <p className="text-sm text-gray-800">{data.patientHistory.chiefComplaint}</p>
            </div>
          )}
          
          {data.lowerUrinaryTractSymptoms?.scores?.ipss && (
            <div className="bg-white border border-amber-200 rounded p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-amber-800">
                  IPSS: {data.lowerUrinaryTractSymptoms.scores.ipss.total}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  data.lowerUrinaryTractSymptoms.scores.ipss.total >= 20 ? 'bg-red-100 text-red-800' :
                  data.lowerUrinaryTractSymptoms.scores.ipss.total >= 8 ? 'bg-amber-100 text-amber-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {data.lowerUrinaryTractSymptoms.scores.ipss.symptomSeverity}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-gray-600">{isArabic ? 'التخزين' : 'Storage'}: </span>
                  <span className="font-medium">{data.lowerUrinaryTractSymptoms.scores.ipss.storageScore}</span>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? 'التفريغ' : 'Voiding'}: </span>
                  <span className="font-medium">{data.lowerUrinaryTractSymptoms.scores.ipss.voidingScore}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Symptoms Assessment */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <SectionHeader 
              icon={<Droplet className="w-5 h-5" />}
              title={isArabic ? "أعراض الجهاز البولي" : "Urinary Symptoms"}
              color="text-cyan-600"
              bgColor="bg-cyan-50"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Storage Symptoms */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "أعراض التخزين" : "Storage Symptoms"}
                </h5>
                <div className="space-y-2 text-sm">
                  {data.lowerUrinaryTractSymptoms?.storage && Object.entries(data.lowerUrinaryTractSymptoms.storage).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key === 'frequency' ? (isArabic ? 'التكرار' : 'Frequency') :
                         key === 'nocturia' ? (isArabic ? 'البول الليلي' : 'Nocturia') :
                         key === 'urgency' ? (isArabic ? 'الحاح' : 'Urgency') :
                         key}
                      </span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voiding Symptoms */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "أعراض التفريغ" : "Voiding Symptoms"}
                </h5>
                <div className="space-y-2 text-sm">
                  {data.lowerUrinaryTractSymptoms?.voiding && Object.entries(data.lowerUrinaryTractSymptoms.voiding).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key === 'hesitancy' ? (isArabic ? 'تأخر البدء' : 'Hesitancy') :
                         key === 'intermittency' ? (isArabic ? 'التقطع' : 'Intermittency') :
                         key === 'weakStream' ? (isArabic ? 'ضعف التيار' : 'Weak Stream') :
                         key}
                      </span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Laboratory Investigations */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <SectionHeader 
              icon={<FlaskConical className="w-5 h-5" />}
              title={isArabic ? "الفحوصات المخبرية" : "Laboratory Investigations"}
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            
            <div className="space-y-4">
              {/* PSA Panel */}
              {data.laboratoryInvestigations?.psa && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    PSA Profile
                  </h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`text-center p-2 rounded ${
                      data.laboratoryInvestigations.psa.total.value > 4 ? 'bg-red-50 border border-red-200' :
                      'bg-green-50 border border-green-200'
                    }`}>
                      <div className="text-xs text-gray-600 mb-1">Total PSA</div>
                      <div className={`text-lg font-bold ${
                        data.laboratoryInvestigations.psa.total.value > 4 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {data.laboratoryInvestigations.psa.total.value} ng/mL
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {data.laboratoryInvestigations.psa.total.interpretation}
                      </div>
                    </div>
                    
                    <div className="text-center p-2 rounded bg-blue-50 border border-blue-200">
                      <div className="text-xs text-gray-600 mb-1">Free PSA</div>
                      <div className="text-lg font-bold text-blue-600">
                        {data.laboratoryInvestigations.psa.free.value} ng/mL
                      </div>
                    </div>
                    
                    <div className={`text-center p-2 rounded ${
                      data.laboratoryInvestigations.psa.ratio.value < 15 ? 'bg-amber-50 border border-amber-200' :
                      'bg-green-50 border border-green-200'
                    }`}>
                      <div className="text-xs text-gray-600 mb-1">Free/Total Ratio</div>
                      <div className="text-lg font-bold text-gray-800">
                        {data.laboratoryInvestigations.psa.ratio.value}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {data.laboratoryInvestigations.psa.ratio.interpretation}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Urinalysis */}
              {data.laboratoryInvestigations?.urinalysis && (
                <div className="border-t pt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تحليل البول" : "Urinalysis"}
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {data.laboratoryInvestigations.urinalysis.leukocytes && (
                      <div className={`p-2 rounded ${
                        data.laboratoryInvestigations.urinalysis.leukocytes !== 'Negative' ? 'bg-red-50' : 'bg-green-50'
                      }`}>
                        <div className="text-gray-600">WBC</div>
                        <div className="font-medium">{data.laboratoryInvestigations.urinalysis.leukocytes}</div>
                      </div>
                    )}
                    {data.laboratoryInvestigations.urinalysis.blood && (
                      <div className={`p-2 rounded ${
                        data.laboratoryInvestigations.urinalysis.blood !== 'Negative' ? 'bg-red-50' : 'bg-green-50'
                      }`}>
                        <div className="text-gray-600">Blood</div>
                        <div className="font-medium">{data.laboratoryInvestigations.urinalysis.blood}</div>
                      </div>
                    )}
                    {data.laboratoryInvestigations.urinalysis.nitrites && (
                      <div className={`p-2 rounded ${
                        data.laboratoryInvestigations.urinalysis.nitrites !== 'Negative' ? 'bg-red-50' : 'bg-green-50'
                      }`}>
                        <div className="text-gray-600">Nitrites</div>
                        <div className="font-medium">{data.laboratoryInvestigations.urinalysis.nitrites}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Physical Examination */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <SectionHeader 
              icon={<Stethoscope className="w-5 h-5" />}
              title={isArabic ? "الفحص السريري" : "Physical Examination"}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            
            <div className="space-y-3">
              {/* Digital Rectal Exam */}
              {data.physicalExamination?.digitalRectalExam && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {isArabic ? "فحص المستقيم الرقمي" : "Digital Rectal Exam"}
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-700">{isArabic ? "الحجم:" : "Size:"}</span>
                      <span className="font-medium ml-2">{data.physicalExamination.digitalRectalExam.prostateSize}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">{isArabic ? "التماسك:" : "Consistency:"}</span>
                      <span className="font-medium ml-2">{data.physicalExamination.digitalRectalExam.consistency}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-blue-700">{isArabic ? "النتائج:" : "Findings:"}</span>
                      <span className="font-medium ml-2">{data.physicalExamination.digitalRectalExam.findings}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Vitals */}
              {data.physicalExamination?.general?.vitals && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العلامات الحيوية" : "Vital Signs"}
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">BP</div>
                      <div className={`text-sm font-medium ${
                        data.physicalExamination.general.vitals.bp.includes('/') &&
                        parseInt(data.physicalExamination.general.vitals.bp.split('/')[0]) > 130 ? 
                        'text-red-600' : 'text-green-600'
                      }`}>
                        {data.physicalExamination.general.vitals.bp}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">Heart Rate</div>
                      <div className="text-sm font-medium text-gray-800">
                        {data.physicalExamination.general.vitals.hr} bpm
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">Temperature</div>
                      <div className="text-sm font-medium text-gray-800">
                        {data.physicalExamination.general.vitals.temperature}°C
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Imaging Studies */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <SectionHeader 
              icon={<ScanEye className="w-5 h-5" />}
              title={isArabic ? "الدراسات التصويرية" : "Imaging Studies"}
              color="text-indigo-600"
              bgColor="bg-indigo-50"
            />
            
            <div className="space-y-4">
              {/* Ultrasound Findings */}
              {data.imagingStudies?.ultrasound && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموجات فوق الصوتية" : "Ultrasound"}
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">{isArabic ? "حجم البروستاتا" : "Prostate Volume"}</div>
                      <div className="font-bold text-lg text-indigo-700">
                        {data.imagingStudies.ultrasound.prostate.volume} cc
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">{isArabic ? "المتبقي بعد التبول" : "Post-Void Residual"}</div>
                      <div className={`font-bold text-lg ${
                        data.imagingStudies.ultrasound.postVoidResidual.volume > 100 ? 'text-red-600' :
                        data.imagingStudies.ultrasound.postVoidResidual.volume > 50 ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        {data.imagingStudies.ultrasound.postVoidResidual.volume} mL
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-600">{isArabic ? "النتائج" : "Findings"}</div>
                      <div className="font-medium text-gray-800 mt-1">
                        {data.imagingStudies.ultrasound.prostate.lesions}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Uroflowmetry */}
              {data.imagingStudies?.uroflowmetry && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <h5 className="text-sm font-semibold text-gray-800 mb-2">
                    {isArabic ? "قياس تدفق البول" : "Uroflowmetry"}
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-600">Qmax</div>
                      <div className={`font-bold ${
                        parseFloat(data.imagingStudies.uroflowmetry.qmax) < 10 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {data.imagingStudies.uroflowmetry.qmax}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">{isArabic ? "الحجم" : "Volume"}</div>
                      <div className="font-bold text-gray-800">
                        {data.imagingStudies.uroflowmetry.voidedVolume}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">{isArabic ? "النمط" : "Pattern"}</div>
                      <div className="font-bold text-gray-800">
                        {data.imagingStudies.uroflowmetry.pattern}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MRI Recommendation */}
              {data.imagingStudies?.mriProstate?.recommended && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3">
                  <h5 className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {isArabic ? "توصية التصوير بالرنين المغناطيسي" : "MRI Recommendation"}
                  </h5>
                  <p className="text-sm text-amber-900">
                    {data.imagingStudies.mriProstate.recommended === 'Yes' ?
                      (isArabic ? 'موصى به بسبب ارتفاع PSA' : 'Recommended due to elevated PSA') :
                      data.imagingStudies.mriProstate.recommended}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis & Risk Assessment */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <SectionHeader 
              icon={<Brain className="w-5 h-5" />}
              title={isArabic ? "التشخيص وتقييم المخاطر" : "Diagnosis & Risk Assessment"}
              color="text-red-600"
              bgColor="bg-red-50"
            />
            
            <div className="space-y-4">
              {/* Working Diagnosis */}
              {data.diagnosticAssessment?.workingDiagnosis && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "التشخيص العامل" : "Working Diagnosis"}
                  </h5>
                  <ul className="space-y-1">
                    {data.diagnosticAssessment.workingDiagnosis.map((diagnosis: string, index: number) => (
                      <li key={index} className="text-sm text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {diagnosis}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Assessment */}
              {data.diagnosticAssessment?.riskStratification && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <h5 className="text-sm font-semibold text-red-800 mb-2">
                    {isArabic ? "تقييم مخاطر سرطان البروستاتا" : "Prostate Cancer Risk Assessment"}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-700">{isArabic ? "الخطر" : "Risk"}</span>
                      <span className="font-bold text-red-900">
                        {data.diagnosticAssessment.riskStratification.prostateCancerRisk}
                      </span>
                    </div>
                    {data.diagnosticAssessment.riskStratification.factors && (
                      <div>
                        <div className="text-sm text-red-700 mb-1">
                          {isArabic ? "عوامل الخطورة" : "Risk Factors"}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {data.diagnosticAssessment.riskStratification.factors.map((factor: string, index: number) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <SectionHeader 
              icon={<Pill className="w-5 h-5" />}
              title={isArabic ? "خطة العلاج" : "Treatment Plan"}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            
            <div className="space-y-4">
              {/* Medications */}
              {data.treatmentPlan?.pharmacological && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العلاج الدوائي" : "Pharmacological Therapy"}
                  </h5>
                  <div className="space-y-3">
                    {/* Alpha Blockers */}
                    {data.treatmentPlan.pharmacological.alphaBlockers && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-blue-800">
                            {data.treatmentPlan.pharmacological.alphaBlockers.drug}
                          </span>
                          <span className="text-sm font-medium text-blue-900">
                            {data.treatmentPlan.pharmacological.alphaBlockers.dose}
                          </span>
                        </div>
                        <div className="text-xs text-blue-700">
                          {data.treatmentPlan.pharmacological.alphaBlockers.frequency}
                        </div>
                      </div>
                    )}

                    {/* 5ARI */}
                    {data.treatmentPlan.pharmacological.fiveAlphaReductaseInhibitors && (
                      <div className="bg-purple-50 border border-purple-200 rounded p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-purple-800">
                            {data.treatmentPlan.pharmacological.fiveAlphaReductaseInhibitors.drug}
                          </span>
                          <span className="text-sm font-medium text-purple-900">
                            {data.treatmentPlan.pharmacological.fiveAlphaReductaseInhibitors.dose}
                          </span>
                        </div>
                        <div className="text-xs text-purple-700">
                          {data.treatmentPlan.pharmacological.fiveAlphaReductaseInhibitors.rationale}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Surgical Options */}
              {data.treatmentPlan?.surgicalOptions && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3">
                  <h5 className="text-sm font-semibold text-amber-800 mb-2">
                    {isArabic ? "الخيارات الجراحية" : "Surgical Options"}
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-amber-700">{isArabic ? "موصى به:" : "Recommended:"}</span>
                      <span className="font-medium ml-2">{data.treatmentPlan.surgicalOptions.recommended}</span>
                    </div>
                    <div>
                      <span className="text-amber-700">{isArabic ? "التوقيت:" : "Timing:"}</span>
                      <span className="font-medium ml-2">{data.treatmentPlan.surgicalOptions.timing}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Follow-up */}
              {data.treatmentPlan?.monitoring && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <h5 className="text-sm font-semibold text-gray-800 mb-2">
                    {isArabic ? "المتابعة" : "Follow-up Monitoring"}
                  </h5>
                  <div className="space-y-1 text-sm">
                    {data.treatmentPlan.monitoring.psaFollowUp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">PSA:</span>
                        <span className="font-medium">{data.treatmentPlan.monitoring.psaFollowUp}</span>
                      </div>
                    )}
                    {data.treatmentPlan.monitoring.symptomAssessment && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? "تقييم الأعراض:" : "Symptom Assessment:"}</span>
                        <span className="font-medium">{data.treatmentPlan.monitoring.symptomAssessment}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient History & Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient History Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <SectionHeader 
            icon={<User className="w-5 h-5" />}
            title={isArabic ? "تاريخ المريض" : "Patient History"}
            color="text-gray-600"
            bgColor="bg-gray-50"
          />
          
          <div className="space-y-3">
            {data.patientHistory?.familyHistory && (
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  {isArabic ? "التاريخ العائلي" : "Family History"}
                </div>
                <div className="text-sm text-gray-800">{data.patientHistory.familyHistory}</div>
              </div>
            )}
            
            {data.patientHistory?.previousConditions && (
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  {isArabic ? "الحالات السابقة" : "Previous Conditions"}
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.patientHistory.previousConditions.map((condition: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.patientHistory?.sexualHistory && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="text-sm font-semibold text-blue-800 mb-1">
                  {isArabic ? "التاريخ الجنسي" : "Sexual History"}
                </div>
                <div className="text-sm text-blue-900">
                  {data.patientHistory.sexualHistory.erectileFunction}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Follow-up & Education */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <SectionHeader 
            icon={<Calendar className="w-5 h-5" />}
            title={isArabic ? "المتابعة والتثقيف" : "Follow-up & Education"}
            color="text-teal-600"
            bgColor="bg-teal-50"
          />
          
          <div className="space-y-4">
            {data.followUp && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "جدول المتابعة" : "Follow-up Schedule"}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{isArabic ? "الموعد القادم:" : "Next Appointment:"}</span>
                    <span className="font-medium">{data.followUp.nextAppointment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{isArabic ? "الفحوصات المطلوبة:" : "Tests Required:"}</span>
                    <span className="font-medium">{data.followUp.testsRequired}</span>
                  </div>
                </div>
              </div>
            )}

            {data.patientEducation?.warningSigns && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <h5 className="text-sm font-semibold text-red-800 mb-2">
                  {isArabic ? "علامات التحذير" : "Warning Signs"}
                </h5>
                <ul className="space-y-1">
                  {data.patientEducation.warningSigns.map((sign: string, index: number) => (
                    <li key={index} className="text-sm text-red-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  color: string;
  bgColor: string;
}> = ({ icon, title, color, bgColor }) => (
  <div className={`flex items-center gap-2 mb-4 p-2 rounded-lg ${bgColor}`}>
    <div className={color}>{icon}</div>
    <h4 className="text-base font-bold text-gray-800">{title}</h4>
  </div>
);

export default UrologyDataView;