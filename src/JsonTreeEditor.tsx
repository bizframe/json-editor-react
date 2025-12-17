import React, { useState, useEffect } from 'react';
import { EditorHeader } from './EditorHeader';
import { EditorFooter } from './EditorFooter';
import { TreeNode } from './TreeNode';
import { setNestedValue, collectAllNodes } from './utils';

export interface JsonTreeEditorProps {
  initialData: any;
  fileName?: string;
  onSave?: (data: any) => void;
  onClose?: () => void;
  userRole?: string;
}

export const JsonTreeEditor: React.FC<JsonTreeEditorProps> = ({
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
    const allNodes = collectAllNodes(jsonData);
    setExpandedNodes(allNodes);
  }, []);

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

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="h-full flex flex-col rounded-md bg-white">
      <EditorHeader
        fileName={fileName}
        isEditMode={isEditMode}
        userRole={userRole}
        onToggleEditMode={handleToggleEditMode}
        onClose={onClose}
      />

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
        <EditorFooter
          hasChanges={hasChanges}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default JsonTreeEditor;