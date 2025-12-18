import React from 'react';

interface DefaultDataViewProps {
  data: any;
  locale: string;
}

const DefaultDataView: React.FC<DefaultDataViewProps> = ({ data, locale }) => {
  if (!data) return null;

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="ml-4 mt-1 space-y-1 border-l pl-3 border-gray-200">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="text-sm">
              <span className="text-gray-600 capitalize">{k}:</span>
              <span className="ml-2 font-medium">{renderValue(v)}</span>
              <h1>sssssssssssssssss</h1>
            </div>
          ))}
        </div>
      );
    }
    return <span className="font-medium text-gray-900">{String(value)}</span>;
  };

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="text-sm">
          <div className="flex items-start">
            <span className="text-gray-600 capitalize min-w-[120px]">{key}:</span>
            <div className="flex-1">
              {renderValue(value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DefaultDataView;