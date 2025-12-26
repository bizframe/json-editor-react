import React, { useState, useEffect } from 'react';
import { EditPopupProps } from '../../types';
import { parseValueByType, formatValueForEdit, getFieldNameFromPath } from '../../utils';

export const EditPopup: React.FC<EditPopupProps> = ({ 
  isOpen, 
  onClose, 
  field, 
  value, 
  onSave,
  className = '',
  overlayClassName = '',
  inputClassName = '',
  buttonClassName = ''
}) => {
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEditValue(formatValueForEdit(value));
    }
  }, [isOpen, value]);
 
  const handleSave = () => {
    try {
      const parsedValue = parseValueByType(editValue, value);
      onSave(parsedValue);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Invalid value format');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const fieldName = getFieldNameFromPath(field);
  const isString = typeof value === 'string';
  const originalType = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 ${overlayClassName}`} 
        onClick={onClose} 
      />
      <div className={`absolute z-50 bg-white rounded border border-gray-300 p-2 shadow-2xl font-mono text-sm -top-10 left-0 min-w-[300px] ${className}`}>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            Type: {originalType}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-blue-600">"{fieldName}"</span>
          <span className="text-gray-600">:</span>
          {isString && <span className="text-green-600">"</span>}
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent text-green-600 outline-none px-1 ${inputClassName}`}
            style={{ minWidth: '100px' }}
            autoFocus
          />
          {isString && <span className="text-green-600">"</span>}
          <button
            onClick={handleSave}
            className={`ml-2 p-1 text-green-600 hover:bg-green-50 rounded transition-colors ${buttonClassName}`}
            title="Save (Enter)"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};