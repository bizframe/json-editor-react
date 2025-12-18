import React, { useState, useEffect } from 'react';

interface EditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  field: string;
  value: any;
  onSave: (value: any) => void;
  className?: string;
  overlayClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

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
      if (Array.isArray(value)) {
        setEditValue(JSON.stringify(value, null, 2));
      } else if (typeof value === 'object' && value !== null) {
        setEditValue(JSON.stringify(value, null, 2));
      } else if (typeof value === 'string') {
        setEditValue(value);
      } else {
        setEditValue(String(value ?? ''));
      }
    }
  }, [isOpen, value]);
 
  const handleSave = () => {
    try {
      const originalType = typeof value;
      let parsedValue;

      if (originalType === 'number') {
        const num = Number(editValue);
        if (isNaN(num)) {
          alert('Invalid number format');
          return;
        }
        parsedValue = num;
      } else if (originalType === 'boolean') {
        if (editValue === 'true') parsedValue = true;
        else if (editValue === 'false') parsedValue = false;
        else {
          alert('Invalid boolean value. Use "true" or "false"');
          return;
        }
      } else if (value === null) {
        if (editValue === 'null') parsedValue = null;
        else {
          alert('Invalid null value. Use "null"');
          return;
        }
      } else if (originalType === 'string') {
        parsedValue = editValue;
      } else if (Array.isArray(value)) {
        try {
          parsedValue = JSON.parse(editValue);
          if (!Array.isArray(parsedValue)) {
            alert('Value must be an array');
            return;
          }
        } catch {
          alert('Invalid array format');
          return;
        }
      } else if (originalType === 'object') {
        try {
          parsedValue = JSON.parse(editValue);
          if (typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
            alert('Value must be an object');
            return;
          }
        } catch {
          alert('Invalid object format');
          return;
        }
      } else {
        try {
          parsedValue = JSON.parse(editValue);
        } catch {
          parsedValue = editValue;
        }
      }

      onSave(parsedValue);
    } catch (error) {
      alert('Invalid value format');
    }
  };

  if (!isOpen) return null;

  const fieldName = field.split('.').pop()?.replace(/\[(\d+)\]/, '[$1]') || field;
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') onClose();
            }}
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