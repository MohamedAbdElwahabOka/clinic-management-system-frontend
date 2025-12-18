import React from 'react';
import { Ear, Scan, Camera } from 'lucide-react';

interface ENTDataViewProps {
  data: any;
  locale: string;
}

const ENTDataView: React.FC<ENTDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Audiometry Results */}
      {data.audiometry && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Ear className="w-4 h-4 text-blue-500" />
            {locale === 'ar' ? 'نتائج قياس السمع' : 'Audiometry Results'}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-gray-500">{locale === 'ar' ? 'الأذن اليمنى' : 'Right Ear'}</div>
              {data.audiometry.rightEar && (
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Air Conduction:</span>
                    <span className="font-medium">{data.audiometry.rightEar.airConduction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{data.audiometry.rightEar.type}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">{locale === 'ar' ? 'الأذن اليسرى' : 'Left Ear'}</div>
              {data.audiometry.leftEar && (
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Air Conduction:</span>
                    <span className="font-medium">{data.audiometry.leftEar.airConduction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{data.audiometry.leftEar.type}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nasal Endoscopy */}
      {data.nasalEndoscopy && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Scan className="w-4 h-4 text-green-500" />
            {locale === 'ar' ? 'نتائج منظار الأنف' : 'Nasal Endoscopy'}
          </h4>
          <div className="space-y-2">
            {Object.entries(data.nasalEndoscopy).map(([area, finding]) => (
              <div key={area} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{area}:</span>
                <span className="font-medium text-gray-900">{finding as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CT Findings */}
      {data.ctFindings && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Camera className="w-4 h-4 text-purple-500" />
            {locale === 'ar' ? 'نتائج الأشعة المقطعية' : 'CT Findings'}
          </h4>
          <div className="bg-purple-50 border border-purple-200 rounded p-3">
            <div className="space-y-2">
              {Object.entries(data.ctFindings).map(([sinus, finding]) => (
                <div key={sinus} className="flex justify-between text-sm">
                  <span className="text-purple-700 capitalize">{sinus}:</span>
                  <span className="font-medium text-purple-900">{finding as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ENTDataView;