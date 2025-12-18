import React from 'react';
import { Activity, FlaskConical, ClipboardList } from 'lucide-react';

interface InternalMedicineDataViewProps {
  data: any;
  locale: string;
}

const InternalMedicineDataView: React.FC<InternalMedicineDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Blood Pressure & Heart Rate */}
      {(data.systolic || data.diastolic || data.heartRate) && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" />
            {locale === 'ar' ? 'العلامات الحيوية' : 'Vital Signs'}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {data.systolic && (
              <div className={`p-2 rounded text-center ${data.systolic > 130 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
                <div className="text-xs text-gray-600 mb-1">Systolic</div>
                <div className={`text-lg font-bold ${data.systolic > 130 ? 'text-red-600' : 'text-green-600'}`}>
                  {data.systolic} mmHg
                </div>
              </div>
            )}
            {data.diastolic && (
              <div className={`p-2 rounded text-center ${data.diastolic > 80 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
                <div className="text-xs text-gray-600 mb-1">Diastolic</div>
                <div className={`text-lg font-bold ${data.diastolic > 80 ? 'text-red-600' : 'text-green-600'}`}>
                  {data.diastolic} mmHg
                </div>
              </div>
            )}
            {data.heartRate && (
              <div className={`p-2 rounded text-center ${data.heartRate > 100 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
                <div className="text-xs text-gray-600 mb-1">Heart Rate</div>
                <div className={`text-lg font-bold ${data.heartRate > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {data.heartRate} bpm
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lab Results */}
      {data.labResults && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-blue-500" />
            {locale === 'ar' ? 'نتائج المعمل' : 'Lab Results'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(data.labResults).map(([test, value]) => {
              let colorClass = 'text-gray-900';
              let bgClass = 'bg-gray-50';
              
              if (test.includes('glucose')) {
                const numValue = parseFloat((value as string).split(' ')[0]);
                colorClass = numValue > 140 ? 'text-red-600' : 'text-green-600';
                bgClass = numValue > 140 ? 'bg-red-50' : 'bg-green-50';
              } else if (test.includes('creatinine')) {
                const numValue = parseFloat((value as string).split(' ')[0]);
                colorClass = numValue > 1.2 ? 'text-red-600' : 'text-green-600';
                bgClass = numValue > 1.2 ? 'bg-red-50' : 'bg-green-50';
              }
              
              return (
                <div key={test} className={`${bgClass} p-2 rounded border`}>
                  <div className="text-xs text-gray-600 mb-1 capitalize">{test}</div>
                  <div className={`font-medium ${colorClass}`}>{value as string}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plan & Recommendations */}
      {(data.plan || data.recommendations) && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-500" />
            {locale === 'ar' ? 'خطة العلاج' : 'Treatment Plan'}
          </h4>
          <div className="bg-purple-50 border border-purple-200 rounded p-3">
            {data.plan && <p className="text-sm text-purple-900 mb-2">{data.plan}</p>}
            {data.recommendations && <p className="text-sm text-purple-900">{data.recommendations}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalMedicineDataView;