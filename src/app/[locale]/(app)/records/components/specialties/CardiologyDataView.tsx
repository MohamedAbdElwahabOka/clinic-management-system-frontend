// import React from 'react';
// import { TrendingUp, Activity, CheckCircle2, Pill } from 'lucide-react';

// interface CardiologyDataViewProps {
//   data: any;
//   locale: string;
// }

// const CardiologyDataView: React.FC<CardiologyDataViewProps> = ({ data, locale }) => {
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
//                 {/* <div>ssssssssssssssssss</div> */}
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

// export default CardiologyDataView;










import React from 'react';
import {
  HeartPulse,
  Activity,
  TrendingUp,
  Thermometer,
  Stethoscope,
  Pill,
  Calendar,
  AlertCircle,
  FileText,
  Droplets,
  Zap
} from 'lucide-react';

interface CardiologyDataViewProps {
  data: any;
  locale: string;
}

const CardiologyDataView: React.FC<CardiologyDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  const isArabic = locale === 'ar';

  return (
    <div className="space-y-6">
      {/* Header - Patient Summary */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <HeartPulse className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-bold text-gray-800">
            {isArabic ? 'ملخص حالة القلب' : 'Cardiac Summary'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {data.patientInfo?.symptoms && (
            <div>
              <span className="text-gray-600">{isArabic ? 'الأعراض:' : 'Symptoms:'}</span>
              <span className="font-medium ml-2">{data.patientInfo.symptoms}</span>
            </div>
          )}
          {data.echocardiogram?.function?.ejectionFraction?.value && (
            <div>
              <span className="text-gray-600">EF:</span>
              <span className={`font-bold ml-2 ${data.echocardiogram.function.ejectionFraction.value < 50 ? 'text-red-600' : 'text-green-600'}`}>
                {data.echocardiogram.function.ejectionFraction.value}%
              </span>
            </div>
          )}
          {data.assessments?.pretestProbability && (
            <div>
              <span className="text-gray-600">{isArabic ? 'احتمالية الإصابة:' : 'CAD Probability:'}</span>
              <span className="font-medium ml-2">{data.assessments.pretestProbability}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* ECG Section */}
          <div className="card-section">
            <SectionHeader 
              icon={<TrendingUp className="w-5 h-5" />}
              title={isArabic ? "تخطيط القلب الكهربائي" : "Electrocardiogram"}
              color="text-red-600"
              bgColor="bg-red-50"
            />
            <div className="space-y-3">
              {data.restingECG?.rhythm && (
                <InfoRow 
                  label={isArabic ? "النظم" : "Rhythm"}
                  value={data.restingECG.rhythm}
                />
              )}
              {data.restingECG?.findings && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? "الملاحظات" : "Findings"}
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {data.restingECG.findings.map((finding: string, index: number) => (
                      <li key={index} className="text-gray-800">{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.restingECG?.intervals && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">PR</div>
                    <div className="font-medium">{data.restingECG.intervals.pr}ms</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">QRS</div>
                    <div className="font-medium">{data.restingECG.intervals.qrs}ms</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">QT</div>
                    <div className="font-medium">{data.restingECG.intervals.qt}ms</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">QTc</div>
                    <div className="font-medium">{data.restingECG.intervals.qtc}ms</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stress Test */}
          <div className="card-section">
            <SectionHeader 
              icon={<Activity className="w-5 h-5" />}
              title={isArabic ? "اختبار الجهد" : "Stress Test"}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            {data.stressTest && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow 
                    label={isArabic ? "البروتوكول" : "Protocol"}
                    value={data.stressTest.protocol}
                  />
                  <InfoRow 
                    label="METs"
                    value={data.stressTest.metsAchieved}
                  />
                  <InfoRow 
                    label={isArabic ? "النبض القمي" : "Peak HR"}
                    value={`${data.stressTest.peakHeartRate} bpm`}
                  />
                  <InfoRow 
                    label={isArabic ? "استعادة النبض" : "HR Recovery"}
                    value={data.heartRateRecovery || "Not specified"}
                  />
                </div>
                
                {data.stressTest.ecgChanges?.stDepression && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <h5 className="text-sm font-semibold text-amber-800 mb-1">
                      {isArabic ? "تغيرات التخطيط" : "ECG Changes"}
                    </h5>
                    <div className="text-sm text-amber-900">
                      <div>{isArabic ? "انخفاض ST:" : "ST depression:"} {data.stressTest.ecgChanges.stDepression.magnitude}mm</div>
                      <div>{isArabic ? "في المسارات:" : "In leads:"} {data.stressTest.ecgChanges.stDepression.leads.join(', ')}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Echocardiogram */}
          <div className="card-section">
            <SectionHeader 
              icon={<Stethoscope className="w-5 h-5" />}
              title={isArabic ? "الموجات فوق الصوتية للقلب" : "Echocardiogram"}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            {data.echocardiogram && (
              <div className="space-y-4">
                {/* Measurements */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "القياسات (مم)" : "Measurements (mm)"}
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <div className="text-gray-600">LVIDd</div>
                      <div className="font-bold">{data.echocardiogram.measurements?.lvidD}</div>
                    </div>
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <div className="text-gray-600">IVSd</div>
                      <div className="font-bold">{data.echocardiogram.measurements?.ivsD}</div>
                    </div>
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <div className="text-gray-600">PWd</div>
                      <div className="font-bold">{data.echocardiogram.measurements?.pwD}</div>
                    </div>
                  </div>
                </div>

                {/* Valvular Function */}
                {data.echocardiogram.valves && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "وظيفة الصمامات" : "Valvular Function"}
                    </h5>
                    <div className="space-y-1 text-sm">
                      {Object.entries(data.echocardiogram.valves).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lab Results */}
          <div className="card-section">
            <SectionHeader 
              icon={<Droplets className="w-5 h-5" />}
              title={isArabic ? "الفحوصات المخبرية" : "Laboratory Results"}
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            {data.labResults && (
              <div className="space-y-3">
                {data.labResults.troponin && (
                  <InfoRow 
                    label="Troponin"
                    value={`${data.labResults.troponin} ng/mL`}
                    isAlert={data.labResults.troponin > 0.04}
                  />
                )}
                {data.labResults.bnp && (
                  <InfoRow 
                    label="BNP"
                    value={`${data.labResults.bnp} pg/mL`}
                    isAlert={data.labResults.bnp > 100}
                  />
                )}
                {data.labResults.lipidPanel && (
                  <div className="bg-gray-50 p-3 rounded">
                    <h6 className="text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "دهون الدم" : "Lipid Panel"}
                    </h6>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">LDL</span>
                        <span className={`font-medium ${data.labResults.lipidPanel.ldl > 100 ? 'text-red-600' : 'text-green-600'}`}>
                          {data.labResults.lipidPanel.ldl} mg/dL
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">HDL</span>
                        <span className={`font-medium ${data.labResults.lipidPanel.hdl < 40 ? 'text-red-600' : 'text-green-600'}`}>
                          {data.labResults.lipidPanel.hdl} mg/dL
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medications */}
        <div className="card-section">
          <SectionHeader 
            icon={<Pill className="w-5 h-5" />}
            title={isArabic ? "العلاجات الدوائية" : "Medications"}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
          />
          <div className="space-y-4">
            {data.medications?.current && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الأدوية الحالية" : "Current Medications"}
                </h5>
                <ul className="space-y-1">
                  {data.medications.current.map((med: string, index: number) => (
                    <li key={index} className="text-sm text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      {med}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.medications?.adjustments && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <h5 className="text-sm font-semibold text-amber-800 mb-2">
                  {isArabic ? "التعديلات المقترحة" : "Proposed Adjustments"}
                </h5>
                <ul className="space-y-1">
                  {data.medications.adjustments.map((adj: string, index: number) => (
                    <li key={index} className="text-sm text-amber-900">{adj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations & Follow-up */}
        <div className="space-y-4">
          <div className="card-section">
            <SectionHeader 
              icon={<FileText className="w-5 h-5" />}
              title={isArabic ? "التوصيات" : "Recommendations"}
              color="text-teal-600"
              bgColor="bg-teal-50"
            />
            {data.recommendations && (
              <div className="space-y-3">
                {data.recommendations.medical && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? "طبية" : "Medical"}
                    </h6>
                    <ul className="space-y-1">
                      {data.recommendations.medical.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-gray-800">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card-section">
            <SectionHeader 
              icon={<Calendar className="w-5 h-5" />}
              title={isArabic ? "المتابعة" : "Follow-up"}
              color="text-cyan-600"
              bgColor="bg-cyan-50"
            />
            {data.recommendations?.followUp && (
              <ul className="space-y-2">
                {data.recommendations.followUp.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      {data.patientInfo?.riskFactors && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {isArabic ? "عوامل الخطورة" : "Risk Factors"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.patientInfo.riskFactors.map((factor: string, index: number) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  color: string;
  bgColor: string;
}> = ({ icon, title, color, bgColor }) => (
  <div className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${bgColor}`}>
    <div className={color}>{icon}</div>
    <h4 className="text-base font-bold text-gray-800">{title}</h4>
  </div>
);

const InfoRow: React.FC<{
  label: string;
  value: string | number;
  isAlert?: boolean;
}> = ({ label, value, isAlert = false }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`text-sm font-medium ${isAlert ? 'text-red-600' : 'text-gray-800'}`}>
      {value}
    </span>
  </div>
);

// CSS for card sections (add to your global CSS or as a style prop)
const cardSectionStyle = "bg-white border border-gray-200 rounded-lg p-4 shadow-sm";

// Add this to your component or global CSS
const styles = `
  .card-section {
    ${cardSectionStyle}
  }
`;

export default CardiologyDataView;