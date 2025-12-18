import React from 'react';
import { Scan, Scissors, Microscope } from 'lucide-react';

interface GastroenterologyDataViewProps {
  data: any;
  locale: string;
}

const GastroenterologyDataView: React.FC<GastroenterologyDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Colonoscopy Findings */}
      {data.findings && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Scan className="w-4 h-4 text-green-600" />
            {locale === 'ar' ? 'نتائج المنظار' : 'Colonoscopy Findings'}
          </h4>
          <div className="space-y-2">
            {Object.entries(data.findings).map(([location, finding]) => (
              <div key={location} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{location}:</span>
                <span className="font-medium text-gray-900">{finding as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Polypectomy Results */}
      {data.polypectomy && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-red-500" />
            {locale === 'ar' ? 'نتائج استئصال الزوائد' : 'Polypectomy Results'}
          </h4>
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-900">{data.polypectomy}</p>
          </div>
        </div>
      )}

      {/* Biopsy Results */}
      {data.biopsyResults && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Microscope className="w-4 h-4 text-blue-500" />
            {locale === 'ar' ? 'نتائج الخزعة' : 'Biopsy Results'}
          </h4>
          <div className="space-y-2">
            {Object.entries(data.biopsyResults).map(([polyp, result]) => (
              <div key={polyp} className="text-sm">
                <span className="font-medium text-gray-700">{polyp}:</span>
                <span className="text-gray-900 ml-2">{result as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GastroenterologyDataView;