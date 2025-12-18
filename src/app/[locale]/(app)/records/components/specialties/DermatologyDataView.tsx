import React from 'react';
import { Scaling, Microscope, Pill } from 'lucide-react';

interface DermatologyDataViewProps {
  data: any;
  locale: string;
}

const DermatologyDataView: React.FC<DermatologyDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Skin Findings */}
      {data.findings && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Scaling className="w-4 h-4 text-orange-500" />
            {locale === 'ar' ? 'النتائج' : 'Findings'}
          </h4>
          <div className="space-y-2">
            {Object.entries(data.findings).map(([area, finding]) => (
              <div key={area} className="text-sm">
                <span className="font-medium text-gray-700 capitalize">{area}:</span>
                <span className="text-gray-900 ml-2">{finding as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dermoscopy */}
      {data.dermoscopy && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Microscope className="w-4 h-4 text-blue-500" />
            {locale === 'ar' ? 'الفحص المجهري' : 'Dermoscopy'}
          </h4>
          <div className="space-y-2">
            {Object.entries(data.dermoscopy).map(([lesion, pattern]) => (
              <div key={lesion} className="text-sm">
                <span className="text-gray-600 capitalize">{lesion}:</span>
                <span className="font-medium text-gray-900 ml-2">{pattern as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatment */}
      {data.treatment && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Pill className="w-4 h-4 text-green-600" />
            {locale === 'ar' ? 'العلاج' : 'Treatment'}
          </h4>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="space-y-2">
              {Object.entries(data.treatment).map(([type, details]) => (
                <div key={type} className="text-sm">
                  <span className="font-medium text-green-700 capitalize">{type}:</span>
                  <span className="text-green-900 ml-2">{details as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DermatologyDataView;