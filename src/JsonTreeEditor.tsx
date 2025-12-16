import React, { useState, useEffect } from 'react';
import { FileJson, ChevronRight, ChevronDown, Save, X, Edit3, Eye } from 'lucide-react';

interface EditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  field: string;
  value: any;
  onSave: (value: any) => void;
}

const EditPopup: React.FC<EditPopupProps> = ({ isOpen, onClose, field, value, onSave }) => {
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
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute z-50 bg-white rounded border border-gray-300 p-2 shadow-2xl font-mono text-sm -top-10 left-0 min-w-[300px]">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Type: {originalType}</span>
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
            className="flex-1 bg-transparent text-green-600 outline-none px-1"
            style={{ minWidth: '100px' }}
            autoFocus
          />
          {isString && <span className="text-green-600">"</span>}
          <button
            onClick={handleSave}
            className="ml-2 p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Save (Enter)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

interface TreeNodeProps {
  path: string;
  data: any;
  onEdit: (path: string, value: any) => void;
  level?: number;
  expandedNodes: Record<string, boolean>;
  toggleNode: (key: string) => void;
  isEditMode: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ path, data, onEdit, level = 0, expandedNodes, toggleNode, isEditMode }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editingValue, setEditingValue] = useState<any>(null);

  const nodeKey = path || 'root';
  const isExpanded = expandedNodes[nodeKey];

  const handleOpenPopup = (fieldPath: string, value: any) => {
    if (!isEditMode) return;
    setEditingField(fieldPath);
    setEditingValue(value);
    setPopupOpen(true);
  };

  const handlePopupSave = (newValue: any) => {
    onEdit(editingField, newValue);
    setPopupOpen(false);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const getValueType = (value: any) => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'text-green-600';
      case 'number': return 'text-blue-600';
      case 'boolean': return 'text-purple-600';
      case 'null': return 'text-gray-500';
      case 'array': return 'text-orange-600';
      case 'object': return 'text-gray-700';
      default: return 'text-gray-700';
    }
  };

  const renderValue = (value: any) => {
    const type = getValueType(value);
    if (type === 'object' || type === 'array') return null;
    return (
      <span className={`${getTypeColor(type)} font-mono text-sm`}>
        {type === 'string' ? `"${value}"` : String(value ?? 'null')}
      </span>
    );
  };

  if (data === null || typeof data !== 'object') {
    const fieldName = path.split('.').pop()?.replace(/\[(\d+)\]/, '[$1]') || '';

    return (
      <div
        className={`flex items-center gap-2 py-1 ${isEditMode ? 'hover:bg-gray-100' : ''} rounded px-2 group relative`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        {isEditMode && (
          <EditPopup
            isOpen={popupOpen}
            onClose={handlePopupClose}
            field={editingField}
            value={editingValue}
            onSave={handlePopupSave}
          />
        )}
        <div className="w-3"></div>
        <span className="font-mono text-sm text-blue-600">&quot;{fieldName}&quot;</span>
        <span className="text-gray-500">:</span>
        <div
          onClick={() => handleOpenPopup(path, data)}
          className={`flex-1 ${isEditMode ? 'cursor-pointer hover:bg-gray-200' : ''} px-2 py-0.5 rounded transition-all`}
          title={isEditMode ? 'Click to edit' : ''}
        >
          {renderValue(data)}
        </div>
        <span className="text-gray-400">,</span>
      </div>
    );
  }

  if (Array.isArray(data)) {
    const fieldName = path.split('.').pop()?.replace(/\[(\d+)\]/, '[$1]') || 'root';

    return (
      <div style={{ marginLeft: `${level * 20}px` }}>
        <div className={`flex items-center gap-2 py-1 ${isEditMode ? 'hover:bg-gray-100' : ''} rounded px-2 group`}>
          <button onClick={() => toggleNode(nodeKey)} className="p-0.5 hover:bg-gray-200 rounded transition-colors">
            {isExpanded ? <ChevronDown size={16} className="text-gray-600" /> : <ChevronRight size={16} className="text-gray-600" />}
          </button>
          <span className="font-mono text-sm text-blue-600">&quot;{fieldName}&quot;</span>
          <span className="text-gray-500">:</span>
          <span className="text-orange-600">[</span>
          {!isExpanded && <span className="text-gray-500 text-xs">{data.length} items</span>}
          {!isExpanded && <span className="text-orange-600">]</span>}
        </div>
        {isExpanded && (
          <div className="border-l border-gray-300 ml-3 pl-2">
            {data.map((item, index) => (
              <TreeNode
                key={`${path}[${index}]`}
                path={`${path}[${index}]`}
                data={item}
                onEdit={onEdit}
                level={level + 1}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                isEditMode={isEditMode}
              />
            ))}
            <div style={{ marginLeft: `${(level + 1) * 20}px` }} className="py-1 px-2">
              <span className="text-orange-600">]</span>
              <span className="text-gray-400">,</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const keys = Object.keys(data);
  const fieldName = path ? path.split('.').pop()?.replace(/\[(\d+)\]/, '[$1]') : 'root';

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div className={`flex items-center gap-2 py-1 ${isEditMode ? 'hover:bg-gray-100' : ''} rounded px-2 group`}>
        <button onClick={() => toggleNode(nodeKey)} className="p-0.5 hover:bg-gray-200 rounded transition-colors">
          {isExpanded ? <ChevronDown size={16} className="text-gray-600" /> : <ChevronRight size={16} className="text-gray-600" />}
        </button>
        {fieldName !== 'root' && (
          <>
            <span className="font-mono text-sm text-blue-600">&quot;{fieldName}&quot;</span>
            <span className="text-gray-500">:</span>
          </>
        )}
        <span className="text-gray-700">{'{'}</span>
        {!isExpanded && <span className="text-gray-500 text-xs">{keys.length} fields</span>}
        {!isExpanded && <span className="text-gray-700">{'}'}</span>}
      </div>
      {isExpanded && (
        <div className="border-l border-gray-300 ml-3 pl-2">
          {keys.map((key) => (
            <TreeNode
              key={`${path ? path + '.' : ''}${key}`}
              path={`${path ? path + '.' : ''}${key}`}
              data={data[key]}
              onEdit={onEdit}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              isEditMode={isEditMode}
            />
          ))}
          <div style={{ marginLeft: `${(level + 1) * 20}px` }} className="py-1 px-2">
            <span className="text-gray-700">{'}'}</span>
            {level > 0 && <span className="text-gray-400">,</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export interface JsonTreeEditorProps {
  initialData: any;
  fileName?: string;
  onSave?: (data: any) => void;
  onClose?: () => void;
  userRole?: string;
}

const JsonTreeEditor: React.FC<JsonTreeEditorProps> = ({
  initialData,
  fileName: initialFileName,
  onSave,
  onClose,
  userRole = 'User'
}) => {
  const [jsonData, setJsonData] = useState(initialData);
  const [originalData, setOriginalData] = useState(JSON.parse(JSON.stringify(initialData)));
  const [fileName, setFileName] = useState(initialFileName || 'data.json');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const allNodes: Record<string, boolean> = {};
    const collectNodes = (data: any, path = '') => {
      if (typeof data === 'object' && data !== null) {
        allNodes[path || 'root'] = true;
        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            collectNodes(item, `${path}[${index}]`);
          });
        } else {
          Object.keys(data).forEach((key) => {
            collectNodes(data[key], path ? `${path}.${key}` : key);
          });
        }
      }
    };
    collectNodes(jsonData);
    setExpandedNodes(allNodes);
  }, []);

  const setNestedValue = (obj: any, path: string, value: any) => {
    const parts = path.split(/\.|\[|\]/).filter(Boolean);
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];

      if (!isNaN(Number(nextPart))) {
        if (!Array.isArray(current[part])) {
          current[part] = [];
        }
        current = current[part];
      } else {
        if (current[part] === undefined) {
          current[part] = {};
        }
        current = current[part];
      }
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
    return obj;
  };

  const handleEdit = (path: string, value: any) => {
    const newData = JSON.parse(JSON.stringify(jsonData));
    setNestedValue(newData, path, value);
    setJsonData(newData);
    setHasChanges(true);
  };

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey],
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(JSON.parse(JSON.stringify(jsonData)));
    }
    setOriginalData(JSON.parse(JSON.stringify(jsonData)));
    setHasChanges(false);
  };

  return (
    <div className="h-full flex flex-col rounded-md bg-white">
      <div className="flex items-center justify-between rounded-md p-2 border-b border-gray-200 bg-gray-50 gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <FileJson size={20} className="text-blue-600 flex-shrink-0 md:w-6 md:h-6" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">{fileName}</h2>
              {userRole === 'Admin' && (
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 ${
                    isEditMode ? 'text-orange-700 hover:bg-orange-100' : 'text-blue-700 hover:bg-blue-100'
                  }`}
                  title={isEditMode ? 'Switch to view mode' : 'Switch to edit mode'}
                >
                  {isEditMode ? <Eye size={16} className="md:w-5 md:h-5" /> : <Edit3 size={16} className="md:w-5 md:h-5" />}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600">{isEditMode ? 'Edit mode' : 'Read-only mode'}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg transition-colors flex-shrink-0">
            <X size={16} className="md:w-5 md:h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="bg-white rounded-lg p-3 md:p-4">
          <TreeNode
            path=""
            data={jsonData}
            onEdit={handleEdit}
            level={0}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            isEditMode={isEditMode}
          />
        </div>
      </div>

      {isEditMode && (
        <div className="sticky bottom-0 p-2 bg-white border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg transition-colors ${
              hasChanges ? 'text-white bg-green-600 hover:bg-green-700' : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            <Save size={16} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Save Changes</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default JsonTreeEditor;