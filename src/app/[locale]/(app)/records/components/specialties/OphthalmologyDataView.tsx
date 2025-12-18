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

