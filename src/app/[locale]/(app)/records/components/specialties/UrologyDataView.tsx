import React from 'react';
import { Activity, ScanEye, Droplet } from 'lucide-react';

interface UrologyDataViewProps {
  data: any;
  locale: string;
}

const UrologyDataView: React.FC<UrologyDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* PSA Levels */}
      {data.psaLevels && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            {locale === 'ar' ? 'مستويات PSA' : 'PSA Levels'}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-blue-700 mb-1">Total PSA</div>
              <div className={`text-lg font-bold ${parseFloat(data.psaLevels.totalPSA) > 4 ? 'text-red-600' : 'text-green-600'}`}>
                {data.psaLevels.totalPSA}
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-blue-700 mb-1">Free PSA</div>
              <div className="text-lg font-bold text-blue-900">{data.psaLevels.freePSA}</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-blue-700 mb-1">Free/Total</div>
              <div className="text-lg font-bold text-blue-900">{data.psaLevels.freeToTotalRatio}</div>
            </div>
          </div>
        </div>
      )}

      {/* Ultrasound Findings */}
      {data.ultrasoundFindings && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ScanEye className="w-4 h-4 text-purple-500" />
            {locale === 'ar' ? 'نتائج السونار' : 'Ultrasound Findings'}
          </h4>
          <div className="bg-purple-50 border border-purple-200 rounded p-3">
            <p className="text-sm text-purple-900">{data.ultrasoundFindings}</p>
          </div>
        </div>
      )}

      {/* Urinary Symptoms */}
      {data.urinarySymptoms && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-cyan-500" />
            {locale === 'ar' ? 'الأعراض البولية' : 'Urinary Symptoms'}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.urinarySymptoms).map(([symptom, value]) => (
              <div key={symptom} className="text-sm">
                <span className="text-gray-600 capitalize">{symptom}:</span>
                <span className="font-medium text-gray-900 ml-2">{value as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrologyDataView;