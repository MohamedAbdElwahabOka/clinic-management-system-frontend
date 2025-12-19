import React from 'react';
import { Eye, Droplets, Search, ClipboardCheck } from 'lucide-react';

interface OphthalmologyDataViewProps {
  data: any;
  locale: string;
}


const OphthalmologyDataView: React.FC<OphthalmologyDataViewProps> = ({data , locale}) => {
    if (!data) return null;
    
      return (
        <div className="space-y-4">
          {/* Visual Acuity */}
          {data.visualAcuity && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-500" />
                {locale === 'ar' ? 'حدة الإبصار' : 'Visual Acuity'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-3 rounded border border-purple-100">
                  <div className="text-xs text-purple-700 font-medium mb-1">
                    {locale === 'ar' ? 'العين اليمنى' : 'Right Eye'}
                  </div>
                  <div className="text-lg font-bold text-purple-900">{data.visualAcuity.rightEye}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded border border-purple-100">
                  <div className="text-xs text-purple-700 font-medium mb-1">
                    {locale === 'ar' ? 'العين اليسرى' : 'Left Eye'}
                  </div>
                  <div className="text-lg font-bold text-purple-900">{data.visualAcuity.leftEye}</div>
                </div>
              </div>
              {data.visualAcuity.withCorrection && (
                <div className="text-xs text-gray-500 mt-1">
                  {locale === 'ar' ? 'مع تصحيح: ' : 'With correction: '}{data.visualAcuity.withCorrection}
                </div>
              )}
            </div>
          )}
    
          {/* Intraocular Pressure */}
          {data.intraocularPressure && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                {locale === 'ar' ? 'ضغط العين' : 'Intraocular Pressure'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'العين اليمنى' : 'Right Eye'}</div>
                  <div className={`text-lg font-bold ${parseInt(data.intraocularPressure.rightEye) > 21 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.intraocularPressure.rightEye}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'العين اليسرى' : 'Left Eye'}</div>
                  <div className={`text-lg font-bold ${parseInt(data.intraocularPressure.leftEye) > 21 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.intraocularPressure.leftEye}
                  </div>
                </div>
              </div>
            </div>
          )}
    
          {/* Fundus Findings */}
          {data.fundusFindings && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-500" />
                {locale === 'ar' ? 'نتائج قاع العين' : 'Fundus Findings'}
              </h4>
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-sm text-amber-900">{data.fundusFindings}</p>
              </div>
            </div>
          )}
    
          {/* Diagnosis */}
          {data.diagnosis && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-green-600" />
                {locale === 'ar' ? 'التشخيص' : 'Diagnosis'}
              </h4>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-sm font-medium text-green-900">{data.diagnosis}</p>
              </div>
            </div>
          )}
        </div>
      );
}

export default OphthalmologyDataView;








// import React, { useState } from 'react';
// import { 
//   Eye, Droplets, Search, ClipboardCheck, 
//   Activity, TrendingUp, Zap, Target, 
//   AlertCircle, CheckCircle, XCircle, 
//   Camera, Film, BarChart, Thermometer,
//   FileText, Heart, Stethoscope, User,
//   ChevronDown, ChevronUp, EyeOff, Brain,
//   Clock, Calendar, AlertTriangle, Info,
//   RefreshCw, Download, Maximize2, Minimize2
// } from 'lucide-react';

// interface OphthalmologyDataViewProps {
//   data: any;
//   locale: string;
// }

// const OphthalmologyDataView: React.FC<OphthalmologyDataViewProps> = ({ data, locale }) => {
//   const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
//     history: true,
//     vision: true,
//     pressure: false,
//     anterior: false,
//     posterior: false,
//     imaging: false,
//     diagnosis: false,
//     plan: false
//   });

//   const toggleSection = (section: string) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   if (!data) return null;

//   // Helper function to get localized text
//   const getLoc = (content: any): string => {
//     if (!content) return '';
//     if (typeof content === 'string') return content;
//     if (content[locale]) return content[locale];
//     if (content.en) return content.en;
//     if (typeof content === 'object') {
//       // Try to get any value
//       const firstKey = Object.keys(content)[0];
//       return content[firstKey] || '';
//     }
//     return '';
//   };

//   // Helper to render value safely
//   const renderValue = (value: any): string => {
//     if (value === null || value === undefined) return '';
//     if (typeof value === 'string') return value;
//     if (typeof value === 'number') return value.toString();
//     if (typeof value === 'boolean') return value ? 'Yes' : 'No';
//     if (Array.isArray(value)) return value.join(', ');
//     return '';
//   };

//   // Component for eye comparison
//   const EyeComparison = ({ title, rightEye, leftEye, unit = '', isCritical = false }) => (
//     <div className={`p-4 rounded-lg border ${isCritical ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
//       <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="text-center">
//           <div className="text-xs text-gray-500 mb-2">{locale === 'ar' ? 'العين اليمنى' : 'Right Eye'}</div>
//           <div className={`text-xl font-bold ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
//             {rightEye} {unit}
//           </div>
//         </div>
//         <div className="text-center">
//           <div className="text-xs text-gray-500 mb-2">{locale === 'ar' ? 'العين اليسرى' : 'Left Eye'}</div>
//           <div className={`text-xl font-bold ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
//             {leftEye} {unit}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Component for data card
//   const DataCard = ({ title, value, icon: Icon, color = 'blue', unit = '', trend = null }) => {
//     const colors = {
//       blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
//       green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
//       red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
//       purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
//       amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' }
//     };

//     const { bg, border, text } = colors[color] || colors.blue;

//     return (
//       <div className={`p-3 rounded-lg border ${bg} ${border}`}>
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <Icon className={`w-4 h-4 ${text}`} />
//             <span className="text-sm font-medium text-gray-700">{title}</span>
//           </div>
//           {trend && (
//             <div className={`text-xs px-2 py-1 rounded-full ${trend === 'improving' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//               {trend === 'improving' ? '↗' : '↘'}
//             </div>
//           )}
//         </div>
//         <div className="text-lg font-bold text-gray-900">
//           {renderValue(value)} {unit}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-4">
//       {/* 🏥 SECTION 1: PATIENT HISTORY */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         <div 
//           className="p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50 cursor-pointer"
//           onClick={() => toggleSection('history')}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <User className="w-5 h-5 text-blue-600" />
//               <h3 className="font-semibold text-blue-800">
//                 {locale === 'ar' ? 'التاريخ المرضي' : 'Patient History'}
//               </h3>
//             </div>
//             {expandedSections.history ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </div>
//         </div>
        
//         {expandedSections.history && (
//           <div className="p-4 space-y-4">
//             {/* Presenting Complaint */}
//             {data.patientHistory?.presentingComplaint && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4 text-red-500" />
//                   {locale === 'ar' ? 'الشكوى الرئيسية' : 'Presenting Complaint'}
//                 </h4>
//                 <div className="bg-red-50/30 border border-red-100 rounded p-3">
//                   <p className="text-sm text-gray-700">{getLoc(data.patientHistory.presentingComplaint)}</p>
//                   <div className="flex gap-4 mt-2 text-xs text-gray-600">
//                     {data.patientHistory.duration && (
//                       <span className="flex items-center gap-1">
//                         <Clock className="w-3 h-3" />
//                         {data.patientHistory.duration}
//                       </span>
//                     )}
//                     {data.patientHistory.onset && (
//                       <span className="flex items-center gap-1">
//                         <Zap className="w-3 h-3" />
//                         {data.patientHistory.onset}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Systemic History */}
//             {data.patientHistory?.systemicHistory && (
//               <div>
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">
//                   {locale === 'ar' ? 'التاريخ المرضي العام' : 'Systemic History'}
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {Object.entries(data.patientHistory.systemicHistory).map(([condition, status]) => (
//                     <div key={condition} className="bg-gray-50 p-3 rounded border">
//                       <div className="text-sm font-medium text-gray-700 capitalize mb-1">
//                         {condition.replace(/([A-Z])/g, ' $1').trim()}
//                       </div>
//                       <div className="text-sm text-gray-600">{renderValue(status)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* 👁️ SECTION 2: VISUAL FUNCTION */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         <div 
//           className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer"
//           onClick={() => toggleSection('vision')}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Eye className="w-5 h-5 text-purple-600" />
//               <h3 className="font-semibold text-purple-800">
//                 {locale === 'ar' ? 'الوظيفة البصرية' : 'Visual Function'}
//               </h3>
//             </div>
//             {expandedSections.vision ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </div>
//         </div>
        
//         {expandedSections.vision && (
//           <div className="p-4 space-y-4">
//             {/* Distance Visual Acuity */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {data.visualFunction?.distanceVisualAcuity && (
//                 <>
//                   <EyeComparison
//                     title={locale === 'ar' ? 'حدة الإبصار عن بعد (غير مصحح)' : 'Distance VA (Uncorrected)'}
//                     rightEye={data.visualFunction.distanceVisualAcuity.rightEye?.uncorrected || 'N/A'}
//                     leftEye={data.visualFunction.distanceVisualAcuity.leftEye?.uncorrected || 'N/A'}
//                     isCritical={data.visualFunction.distanceVisualAcuity.leftEye?.uncorrected?.includes('6/18')}
//                   />
                  
//                   <EyeComparison
//                     title={locale === 'ar' ? 'حدة الإبصار عن بعد (مصحح)' : 'Distance VA (Corrected)'}
//                     rightEye={data.visualFunction.distanceVisualAcuity.rightEye?.corrected || 'N/A'}
//                     leftEye={data.visualFunction.distanceVisualAcuity.leftEye?.corrected || 'N/A'}
//                     isCritical={data.visualFunction.distanceVisualAcuity.leftEye?.corrected?.includes('6/12')}
//                   />
//                 </>
//               )}
//             </div>

//             {/* Additional Visual Tests */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {data.visualFunction?.nearVisualAcuity && (
//                 <DataCard
//                   title={locale === 'ar' ? 'قرب' : 'Near'}
//                   value={`OD: ${data.visualFunction.nearVisualAcuity.rightEye || 'N/A'}, OS: ${data.visualFunction.nearVisualAcuity.leftEye || 'N/A'}`}
//                   icon={Eye}
//                   color="purple"
//                 />
//               )}
              
//               {data.visualFunction?.contrastSensitivity && (
//                 <DataCard
//                   title={locale === 'ar' ? 'حساسية التباين' : 'Contrast Sensitivity'}
//                   value={data.visualFunction.contrastSensitivity}
//                   icon={BarChart}
//                   color="blue"
//                 />
//               )}
              
//               {data.visualFunction?.colorVision && (
//                 <DataCard
//                   title={locale === 'ar' ? 'رؤية الألوان' : 'Color Vision'}
//                   value={data.visualFunction.colorVision}
//                   icon={Brain}
//                   color="green"
//                 />
//               )}
              
//               {data.visualFunction?.visualFields && (
//                 <DataCard
//                   title={locale === 'ar' ? 'المجال البصري' : 'Visual Fields'}
//                   value={data.visualFunction.visualFields.method || 'Assessed'}
//                   icon={Target}
//                   color="amber"
//                 />
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* 💧 SECTION 3: INTRAOCULAR PRESSURE */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         <div 
//           className="p-4 border-b bg-gradient-to-r from-blue-50 to-teal-50 cursor-pointer"
//           onClick={() => toggleSection('pressure')}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Droplets className="w-5 h-5 text-blue-600" />
//               <h3 className="font-semibold text-blue-800">
//                 {locale === 'ar' ? 'ضغط العين' : 'Intraocular Pressure'}
//               </h3>
//             </div>
//             {expandedSections.pressure ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </div>
//         </div>
        
//         {expandedSections.pressure && (
//           <div className="p-4 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {data.intraocularPressure && (
//                 <>
//                   <EyeComparison
//                     title={locale === 'ar' ? 'ضغط العين (تطبيق)' : 'IOP (Applanation)'}
//                     rightEye={data.intraocularPressure.rightEye?.applanation || data.intraocularPressure.rightEye || 'N/A'}
//                     leftEye={data.intraocularPressure.leftEye?.applanation || data.intraocularPressure.leftEye || 'N/A'}
//                     unit="mmHg"
//                     isCritical={parseInt(data.intraocularPressure.leftEye?.applanation || data.intraocularPressure.leftEye || '0') > 21}
//                   />
                  
//                   {data.intraocularPressure.centralCornealThickness && (
//                     <EyeComparison
//                       title={locale === 'ar' ? 'سمك القرنية' : 'Corneal Thickness'}
//                       rightEye={data.intraocularPressure.centralCornealThickness.rightEye}
//                       leftEye={data.intraocularPressure.centralCornealThickness.leftEye}
//                       unit="μm"
//                     />
//                   )}
//                 </>
//               )}
//             </div>

//             {/* IOP Trend */}
//             {data.intraocularPressure?.previousPressures && (
//               <div className="space-y-3">
//                 <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <TrendingUp className="w-4 h-4 text-blue-500" />
//                   {locale === 'ar' ? 'اتجاه ضغط العين' : 'IOP Trend'}
//                 </h4>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">{locale === 'ar' ? 'العين اليمنى' : 'Right Eye'}</th>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">{locale === 'ar' ? 'العين اليسرى' : 'Left Eye'}</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {data.intraocularPressure.previousPressures.map((record: any, index: number) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-3 py-2 text-sm text-gray-600">{record.date}</td>
//                           <td className="px-3 py-2 text-sm font-medium">
//                             <span className={parseInt(record.rightEye) > 21 ? 'text-red-600' : 'text-green-600'}>
//                               {record.rightEye} mmHg
//                             </span>
//                           </td>
//                           <td className="px-3 py-2 text-sm font-medium">
//                             <span className={parseInt(record.leftEye) > 21 ? 'text-red-600' : 'text-green-600'}>
//                               {record.leftEye} mmHg
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* 🔍 SECTION 4: POSTERIOR SEGMENT */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         <div 
//           className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 cursor-pointer"
//           onClick={() => toggleSection('posterior')}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Search className="w-5 h-5 text-amber-600" />
//               <h3 className="font-semibold text-amber-800">
//                 {locale === 'ar' ? 'قاع العين' : 'Posterior Segment'}
//               </h3>
//             </div>
//             {expandedSections.posterior ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </div>
//         </div>
        
//         {expandedSections.posterior && (
//           <div className="p-4 space-y-4">
//             {/* Fundus Findings */}
//             {data.posteriorSegment && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-3">
//                   <h4 className="text-sm font-medium text-gray-700">{locale === 'ar' ? 'الشبكية' : 'Retina'}</h4>
//                   <div className="bg-amber-50 border border-amber-100 rounded p-3">
//                     <div className="text-sm text-gray-700 mb-2">
//                       <strong>OD:</strong> {data.posteriorSegment.retina?.rightEye || 'Normal'}
//                     </div>
//                     <div className="text-sm text-gray-700">
//                       <strong>OS:</strong> {data.posteriorSegment.retina?.leftEye || 'Normal'}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <h4 className="text-sm font-medium text-gray-700">{locale === 'ar' ? 'العصب البصري' : 'Optic Nerve'}</h4>
//                   <div className="bg-blue-50 border border-blue-100 rounded p-3">
//                     <div className="text-sm text-gray-700 mb-2">
//                       <strong>OD:</strong> {data.posteriorSegment.opticNerve?.rightEye || 'Normal'}
//                     </div>
//                     <div className="text-sm text-gray-700">
//                       <strong>OS:</strong> {data.posteriorSegment.opticNerve?.leftEye || 'Normal'}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Fundus Findings Text */}
//             {data.fundusFindings && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-gray-500" />
//                   {locale === 'ar' ? 'ملاحظات قاع العين' : 'Fundus Findings'}
//                 </h4>
//                 <div className="bg-gray-50 border border-gray-200 rounded p-3">
//                   <p className="text-sm text-gray-700">{renderValue(data.fundusFindings)}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* 📊 SECTION 5: DIAGNOSTIC IMAGING */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         <div 
//           className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 cursor-pointer"
//           onClick={() => toggleSection('imaging')}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Camera className="w-5 h-5 text-green-600" />
//               <h3 className="font-semibold text-green-800">
//                 {locale === 'ar' ? 'التصوير التشخيصي' : 'Diagnostic Imaging'}
//               </h3>
//             </div>
//             {expandedSections.imaging ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </div>
//         </div>
        
//         {expandedSections.imaging && data.diagnosticImaging && (
//           <div className="p-4 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* OCT Macular */}
//               {data.diagnosticImaging.octMacular && (
//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <Camera className="w-4 h-4 text-blue-500" />
//                     OCT Macular
//                   </h4>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Central Thickness:</span>
//                       <span className="font-medium">
//                         OD: {data.diagnosticImaging.octMacular.rightEye?.centralSubfieldThickness || 'N/A'} |
//                         OS: {data.diagnosticImaging.octMacular.leftEye?.centralSubfieldThickness || 'N/A'}
//                       </span>
//                     </div>
//                     {data.diagnosticImaging.octMacular.leftEye?.findings && (
//                       <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
//                         <strong>Findings OS:</strong> {data.diagnosticImaging.octMacular.leftEye.findings}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Fundus Photography */}
//               {data.diagnosticImaging.fundusPhotography && (
//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     <Film className="w-4 h-4 text-purple-500" />
//                     Fundus Photography
//                   </h4>
//                   <div className="text-sm space-y-1">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Right Eye:</span>
//                       <span className="font-medium">{data.diagnosticImaging.fundusPhotography.rightEye}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Left Eye:</span>
//                       <span className="font-medium">{data.diagnosticImaging.fundusPhotography.leftEye}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* 🏥 SECTION 6: DIAGNOSIS & PLAN */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         <div 
//           className="p-4 border-b bg-gradient-to-r from-teal-50 to-cyan-50 cursor-pointer"
//           onClick={() => toggleSection('diagnosis')}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <ClipboardCheck className="w-5 h-5 text-teal-600" />
//               <h3 className="font-semibold text-teal-800">
//                 {locale === 'ar' ? 'التشخيص وخطة العلاج' : 'Diagnosis & Treatment Plan'}
//               </h3>
//             </div>
//             {expandedSections.diagnosis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </div>
//         </div>
        
//         {expandedSections.diagnosis && (
//           <div className="p-4 space-y-4">
//             {/* Diagnosis */}
//             <div className="space-y-3">
//               <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 text-red-500" />
//                 {locale === 'ar' ? 'التشخيص' : 'Diagnosis'}
//               </h4>
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="font-bold text-red-900">{renderValue(data.diagnosis)}</p>
//                     {data.assessment?.primaryDiagnosis?.code && (
//                       <p className="text-sm text-gray-600 mt-1">
//                         ICD-10: {data.assessment.primaryDiagnosis.code}
//                       </p>
//                     )}
//                   </div>
//                   <SeverityBadge severity={data.assessment?.primaryDiagnosis?.severity || 'Moderate'} />
//                 </div>
//               </div>
//             </div>

//             {/* Recommendations */}
//             {data.recommendations && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <CheckCircle className="w-4 h-4 text-green-500" />
//                   {locale === 'ar' ? 'التوصيات' : 'Recommendations'}
//                 </h4>
//                 <div className="bg-green-50 border border-green-200 rounded p-3">
//                   <p className="text-sm text-green-900">{renderValue(data.recommendations)}</p>
//                 </div>
//               </div>
//             )}

//             {/* Follow-up */}
//             {data.treatmentPlan?.followUp && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <Calendar className="w-4 h-4 text-blue-500" />
//                   {locale === 'ar' ? 'المتابعة' : 'Follow-up'}
//                 </h4>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   {Object.entries(data.treatmentPlan.followUp).map(([key, value]) => (
//                     <div key={key} className="bg-blue-50 p-3 rounded border border-blue-100">
//                       <div className="text-xs text-blue-700 font-medium capitalize mb-1">
//                         {key === 'nextAppointment' ? (locale === 'ar' ? 'الموعد القادم' : 'Next Appointment') :
//                          key === 'diabeticRetinopathy' ? (locale === 'ar' ? 'اعتلال الشبكية السكري' : 'Diabetic Retinopathy') :
//                          key === 'glaucomaMonitoring' ? (locale === 'ar' ? 'مراقبة الجلوكوما' : 'Glaucoma Monitoring') :
//                          key === 'cataract' ? (locale === 'ar' ? 'الماء الأبيض' : 'Cataract') : key}
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">{renderValue(value)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Component for severity badge
// const SeverityBadge = ({ severity }: { severity: string }) => {
//   const getConfig = (severity: string) => {
//     const lowerSeverity = severity.toLowerCase();
    
//     if (lowerSeverity.includes('mild')) {
//       return { 
//         color: 'bg-green-100 text-green-800 border-green-200', 
//         icon: <CheckCircle className="w-4 h-4" /> 
//       };
//     } else if (lowerSeverity.includes('moderate')) {
//       return { 
//         color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
//         icon: <AlertTriangle className="w-4 h-4" /> 
//       };
//     } else if (lowerSeverity.includes('severe') || lowerSeverity.includes('proliferative')) {
//       return { 
//         color: 'bg-red-100 text-red-800 border-red-200', 
//         icon: <AlertCircle className="w-4 h-4" /> 
//       };
//     }
    
//     return { 
//       color: 'bg-gray-100 text-gray-800 border-gray-200', 
//       icon: <Info className="w-4 h-4" /> 
//     };
//   };

//   const config = getConfig(severity);

//   return (
//     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
//       {config.icon}
//       {severity}
//     </span>
//   );
// };

// export default OphthalmologyDataView;