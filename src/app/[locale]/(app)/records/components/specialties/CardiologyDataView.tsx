import React from 'react';
import { TrendingUp, Activity, CheckCircle2, Pill } from 'lucide-react';

interface CardiologyDataViewProps {
  data: any;
  locale: string;
}

const CardiologyDataView: React.FC<CardiologyDataViewProps> = ({ data, locale }) => {
  if (!data) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ECG Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            {locale === 'ar' ? 'رسم القلب' : 'ECG Findings'}
          </h4>
          <div className="space-y-1 text-sm">
            {data.restingECG && (
              <div className="flex justify-between">
                <span className="text-gray-600">{locale === 'ar' ? 'رسم القلب أثناء الراحة' : 'Resting ECG'}</span>
                <span className="font-medium">{data.restingECG}</span>
              </div>
            )}
            {data.stressTest && (
              <div className="flex justify-between">
                <span className="text-gray-600">{locale === 'ar' ? 'اختبار الجهد' : 'Stress Test'}</span>
                <span className="font-medium">{data.stressTest}</span>
              </div>
            )}
            {data.heartRateRecovery && (
              <div className="flex justify-between">
                <span className="text-gray-600">{locale === 'ar' ? 'معدل استعادة النبض' : 'Heart Rate Recovery'}</span>
                <span className="font-medium">{data.heartRateRecovery}</span>
              </div>
            )}
          </div>
        </div>

        {/* Echo Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            {locale === 'ar' ? 'موجات صوتية على القلب' : 'Echocardiogram'}
          </h4>
          <div className="space-y-1 text-sm">
            {data.ejectionFraction && (
              <div className="flex justify-between">
                <span className="text-gray-600">EF</span>
                <span className="font-medium bg-blue-50 px-2 py-0.5 rounded">{data.ejectionFraction}</span>
              </div>
            )}
            {data.lvDimensions && (
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>LVIDd: <span className="font-medium">{data.lvDimensions.lvidd}</span></div>
                <div>IVSd: <span className="font-medium">{data.lvDimensions.ivsd}</span></div>
                <div>LVIDs: <span className="font-medium">{data.lvDimensions.lvids}</span></div>
                <div>PWd: <span className="font-medium">{data.lvDimensions.pwd}</span></div>
                {/* <div>ssssssssssssssssss</div> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {data.recommendations && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h5 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {locale === 'ar' ? 'التوصيات' : 'Recommendations'}
          </h5>
          <p className="text-sm text-blue-900">{data.recommendations}</p>
        </div>
      )}

      {/* Medication Adjustment */}
      {data.medicationAdjustment && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <h5 className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
            <Pill className="w-4 h-4" />
            {locale === 'ar' ? 'تعديل الأدوية' : 'Medication Adjustment'}
          </h5>
          <p className="text-sm text-amber-900">{data.medicationAdjustment}</p>
        </div>
      )}
    </div>
  );
};

export default CardiologyDataView;