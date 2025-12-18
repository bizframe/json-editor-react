import React, { useState } from 'react';
import { EditPopup } from './EditPopup';
import { getValueType, getTypeColor } from './utils';

interface TreeLeafProps {
  path: string;
  data: any;
  level: number;
  isEditMode: boolean;
  onEdit: (path: string, value: any) => void;
  className?: string;
  valueClassName?: string;
  fieldClassName?: string;
  editPopupClassName?: string;
}

export const TreeLeaf: React.FC<TreeLeafProps> = ({ 
  path, 
  data, 
  level, 
  isEditMode, 
  onEdit,
  className = '',
  valueClassName = '',
  fieldClassName = '',
  editPopupClassName = ''
}) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    if (!isEditMode) return;
    setPopupOpen(true);
  };

  const handlePopupSave = (newValue: any) => {
    onEdit(path, newValue);
    setPopupOpen(false);
  };

  const renderValue = (value: any) => {
    const type = getValueType(value);
    return (
      <span className={`${getTypeColor(type)} font-mono text-sm ${valueClassName}`}>
        {type === 'string' ? `"${value}"` : String(value ?? 'null')}
      </span>
    );
  };

  const fieldName = path.split('.').pop()?.replace(/\[(\d+)\]/, '[$1]') || '';

  return (
    <div
      className={`flex items-center gap-2 py-1 ${isEditMode ? 'hover:bg-gray-100' : ''} rounded px-2 group relative ${className}`}
      style={{ marginLeft: `${level * 20}px` }}
    >
      {isEditMode && (
        <EditPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          field={path}
          value={data}
          onSave={handlePopupSave}
          className={editPopupClassName}
        />
      )}
      <div className="w-3"></div>
      <span className={`font-mono text-sm text-blue-600 ${fieldClassName}`}>
        &quot;{fieldName}&quot;
      </span>
      <span className="text-gray-500">:</span>
      <div
        onClick={handleOpenPopup}
        className={`flex-1 ${isEditMode ? 'cursor-pointer hover:bg-gray-200' : ''} px-2 py-0.5 rounded transition-all`}
        title={isEditMode ? 'Click to edit' : ''}
      >
        {renderValue(data)}
      </div>
      <span className="text-gray-400">,</span>
    </div>
  );
};
