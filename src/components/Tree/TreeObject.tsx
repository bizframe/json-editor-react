import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getFieldNameFromPath } from '../../utils';
import { TreeObjectProps } from '../../types';

export const TreeObject: React.FC<TreeObjectProps> = ({
  path,
  data,
  level,
  isExpanded,
  isEditMode,
  onToggle,
  children,
  className = '',
  headerClassName = '',
  fieldClassName = '',
  buttonClassName = ''
}) => {
  const keys = Object.keys(data);
  const fieldName = getFieldNameFromPath(path);

  return (
    <div style={{ marginLeft: `${level * 20}px` }} className={className}>
      <div className={`flex items-center gap-2 py-1 ${isEditMode ? 'hover:bg-gray-100' : ''} rounded px-2 group ${headerClassName}`}>
        <button 
          onClick={onToggle} 
          className={`p-0.5 hover:bg-gray-200 rounded transition-colors ${buttonClassName}`}
          title={isExpanded ? 'Collapse object' : 'Expand object'}
        >
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-600" />
          ) : (
            <ChevronRight size={16} className="text-gray-600" />
          )}
        </button>
        {fieldName !== 'root' && (
          <>
            <span className={`font-mono text-sm text-blue-600 ${fieldClassName}`}>
              &quot;{fieldName}&quot;
            </span>
            <span className="text-gray-500">:</span>
          </>
        )}
        <span className="text-gray-700">{'{'}</span>
        {!isExpanded && <span className="text-gray-500 text-xs">{keys.length} fields</span>}
        {!isExpanded && <span className="text-gray-700">{'}'}</span>}
      </div>
      {isExpanded && (
        <div className="border-l border-gray-300 ml-3 pl-2">
          {children}
          <div style={{ marginLeft: `${(level + 1) * 20}px` }} className="py-1 px-2">
            <span className="text-gray-700">{'}'}</span>
            {level > 0 && <span className="text-gray-400">,</span>}
          </div>
        </div>
      )}
    </div>
  );
};