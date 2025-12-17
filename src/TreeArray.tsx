import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TreeArrayProps {
  path: string;
  data: any[];
  level: number;
  nodeKey: string;
  isExpanded: boolean;
  isEditMode: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const TreeArray: React.FC<TreeArrayProps> = ({
  path,
  data,
  level,
  nodeKey,
  isExpanded,
  isEditMode,
  onToggle,
  children
}) => {
  const fieldName = path.split('.').pop()?.replace(/\[(\d+)\]/, '[$1]') || 'root';

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div className={`flex items-center gap-2 py-1 ${isEditMode ? 'hover:bg-gray-100' : ''} rounded px-2 group`}>
        <button 
          onClick={onToggle} 
          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-600" />
          ) : (
            <ChevronRight size={16} className="text-gray-600" />
          )}
        </button>
        <span className="font-mono text-sm text-blue-600">&quot;{fieldName}&quot;</span>
        <span className="text-gray-500">:</span>
        <span className="text-orange-600">[</span>
        {!isExpanded && <span className="text-gray-500 text-xs">{data.length} items</span>}
        {!isExpanded && <span className="text-orange-600">]</span>}
      </div>
      {isExpanded && (
        <div className="border-l border-gray-300 ml-3 pl-2">
          {children}
          <div style={{ marginLeft: `${(level + 1) * 20}px` }} className="py-1 px-2">
            <span className="text-orange-600">]</span>
            <span className="text-gray-400">,</span>
          </div>
        </div>
      )}
    </div>
  );
};