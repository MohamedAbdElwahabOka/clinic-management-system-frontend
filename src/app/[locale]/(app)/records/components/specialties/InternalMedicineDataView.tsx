// import React from 'react';
// import { Activity, FlaskConical, ClipboardList } from 'lucide-react';

// interface InternalMedicineDataViewProps {
//   data: any;
//   locale: string;
// }

// const InternalMedicineDataView: React.FC<InternalMedicineDataViewProps> = ({ data, locale }) => {
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

// export default InternalMedicineDataView;








import React from 'react';
import { 
  Activity, FlaskConical, ClipboardList, Stethoscope, 
  User, Heart, Pill, TrendingUp, AlertCircle,
  Calendar, Scale, Droplet, FileText, Zap,
  Award, Target, BarChart, Shield, Bell,
  CheckCircle, XCircle, HelpCircle, ChevronRight
} from 'lucide-react';

interface InternalMedicineDataViewProps {
  data: any;
  locale: string;
}

const InternalMedicineDataView: React.FC<InternalMedicineDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  // دالة مساعدة للحصول على النص المترجم
  const getLoc = (content: any): string => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (content[locale]) return content[locale];
    return content.en || '';
  };

  // دالة لتحويل القيم إلى نص قابل للعرض
  const renderValue = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      // إذا كان كائن، نحوله إلى JSON أو نص
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${renderValue(v)}`)
        .join(', ');
    }
    return String(value);
  };

  // دالة لعرض الكائنات المتداخلة بشكل منظم
  const renderNestedObject = (obj: any, depth: number = 0): React.ReactNode => {
    if (!obj) return null;
    
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return <span className="text-gray-700">{String(obj)}</span>;
    }
    
    if (Array.isArray(obj)) {
      return (
        <ul className={`space-y-1 ${depth > 0 ? 'ml-4' : ''}`}>
          {obj.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                {typeof item === 'object' ? renderNestedObject(item, depth + 1) : renderValue(item)}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    
    if (typeof obj === 'object') {
      return (
        <div className={`space-y-2 ${depth > 0 ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''}`}>
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className="text-sm">
              {typeof value === 'object' && value !== null ? (
                <>
                  <p className="font-medium text-gray-600 mb-1 capitalize">{key}:</p>
                  {renderNestedObject(value, depth + 1)}
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="font-medium text-gray-900">{renderValue(value)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  // مكون لرموز الشدة
  const SeverityBadge = ({ severity }: { severity: string }) => {
    const getConfig = (severity: string) => {
      switch (severity?.toLowerCase()) {
        case 'mild':
          return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
        case 'moderate':
          return { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="w-4 h-4" /> };
        case 'severe':
        case 'critical':
          return { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> };
        case 'uncontrolled':
          return { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="w-4 h-4" /> };
        default:
          return { color: 'bg-gray-100 text-gray-800', icon: <HelpCircle className="w-4 h-4" /> };
      }
    };

    const config = getConfig(severity);

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {severity}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. الشكوى الرئيسية والتاريخ المرضي */}
      {(data.chiefComplaint || data.historyOfPresentIllness) && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-blue-50/30">
            <h3 className="font-semibold text-blue-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {locale === 'ar' ? 'الشكوى الرئيسية والتاريخ المرضي' : 'Chief Complaint & History'}
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {data.chiefComplaint && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" />
                  {locale === 'ar' ? 'الشكوى الرئيسية' : 'Chief Complaint'}
                </h4>
                <div className="bg-red-50/20 border border-red-100 rounded p-3">
                  {typeof data.chiefComplaint === 'object' ? renderNestedObject(data.chiefComplaint) : renderValue(data.chiefComplaint)}
                </div>
              </div>
            )}
            
            {data.historyOfPresentIllness && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {locale === 'ar' ? 'تاريخ المرض الحالي' : 'History of Present Illness'}
                </h4>
                <p className="text-sm text-gray-700 bg-blue-50/20 p-3 rounded border border-blue-100">
                  {getLoc(data.historyOfPresentIllness)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. العلامات الحيوية */}
      {(data.physicalExamination?.vitalSigns || data.systolic || data.diastolic || data.heartRate) && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-green-50/30">
            <h3 className="font-semibold text-green-800 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {locale === 'ar' ? 'العلامات الحيوية' : 'Vital Signs'}
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {/* ضغط الدم الانقباضي */}
              {(data.systolic || data.physicalExamination?.vitalSigns?.bloodPressure?.sitting) && (
                <div className={`p-2 rounded text-center ${(data.systolic || parseInt(data.physicalExamination?.vitalSigns?.bloodPressure?.sitting?.split('/')[0])) > 140 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
                  <div className="text-xs text-gray-600 mb-1">{locale === 'ar' ? 'الانقباضي' : 'Systolic'}</div>
                  <div className={`text-lg font-bold ${(data.systolic || parseInt(data.physicalExamination?.vitalSigns?.bloodPressure?.sitting?.split('/')[0])) > 140 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.systolic || data.physicalExamination?.vitalSigns?.bloodPressure?.sitting?.split('/')[0]} mmHg
                  </div>
                </div>
              )}
              
              {/* ضغط الدم الانبساطي */}
              {(data.diastolic || data.physicalExamination?.vitalSigns?.bloodPressure?.sitting) && (
                <div className={`p-2 rounded text-center ${(data.diastolic || parseInt(data.physicalExamination?.vitalSigns?.bloodPressure?.sitting?.split('/')[1])) > 90 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
                  <div className="text-xs text-gray-600 mb-1">{locale === 'ar' ? 'الانبساطي' : 'Diastolic'}</div>
                  <div className={`text-lg font-bold ${(data.diastolic || parseInt(data.physicalExamination?.vitalSigns?.bloodPressure?.sitting?.split('/')[1])) > 90 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.diastolic || data.physicalExamination?.vitalSigns?.bloodPressure?.sitting?.split('/')[1]} mmHg
                  </div>
                </div>
              )}
              
              {/* معدل ضربات القلب */}
              {(data.heartRate || data.physicalExamination?.vitalSigns?.heartRate) && (
                <div className={`p-2 rounded text-center ${(data.heartRate || data.physicalExamination?.vitalSigns?.heartRate) > 100 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
                  <div className="text-xs text-gray-600 mb-1">{locale === 'ar' ? 'معدل ضربات القلب' : 'Heart Rate'}</div>
                  <div className={`text-lg font-bold ${(data.heartRate || data.physicalExamination?.vitalSigns?.heartRate) > 100 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.heartRate || data.physicalExamination?.vitalSigns?.heartRate} bpm
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. نتائج المعمل */}
      {data.labResults && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-purple-50/30">
            <h3 className="font-semibold text-purple-800 flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              {locale === 'ar' ? 'نتائج المعمل' : 'Lab Results'}
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.labResults).map(([category, tests]) => {
                if (typeof tests !== 'object' || tests === null) return null;
                
                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(tests).map(([test, value]) => {
                        if (typeof value === 'object' && value !== null) {
                          // إذا كانت قيمة الكائن (مثل electrolytes)
                          return (
                            <div key={test} className="bg-gray-50 p-2 rounded">
                              <p className="text-xs text-gray-600 mb-1 capitalize">{test}:</p>
                              {renderNestedObject(value)}
                            </div>
                          );
                        }
                        
                        // تحديد إذا كانت القيمة حرجة
                        let isCritical = false;
                        if (test.toLowerCase().includes('creatinine') && parseFloat(renderValue(value).split(' ')[0]) > 1.2) {
                          isCritical = true;
                        } else if (test.toLowerCase().includes('glucose') && parseFloat(renderValue(value).split(' ')[0]) > 140) {
                          isCritical = true;
                        } else if (test.toLowerCase().includes('ldl') && parseFloat(renderValue(value).split(' ')[0]) > 100) {
                          isCritical = true;
                        }
                        
                        return (
                          <div key={test} className={`flex justify-between items-center p-2 rounded ${isCritical ? 'bg-red-50' : 'bg-gray-50'}`}>
                            <span className="text-sm text-gray-600 capitalize">{test}:</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
                                {renderValue(value)}
                              </span>
                              {isCritical ? (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. التشخيص */}
      {data.diagnosis && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-orange-50/30">
            <h3 className="font-semibold text-orange-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {locale === 'ar' ? 'التشخيص' : 'Diagnosis'}
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700">{renderValue(data.diagnosis)}</p>
          </div>
        </div>
      )}

      {/* 5. خطة العلاج */}
      {data.plan && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-teal-50/30">
            <h3 className="font-semibold text-teal-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              {locale === 'ar' ? 'خطة العلاج' : 'Treatment Plan'}
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700">{renderValue(data.plan)}</p>
          </div>
        </div>
      )}

      {/* 6. النتائج */}
      {data.findings && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b bg-blue-50/30">
            <h3 className="font-semibold text-blue-800 flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              {locale === 'ar' ? 'النتائج' : 'Findings'}
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700">{renderValue(data.findings)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalMedicineDataView;







