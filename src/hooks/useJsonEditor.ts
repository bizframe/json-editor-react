import { useState, useEffect, useCallback } from 'react';
import { setNestedValue, deepClone, collectAllNodes } from '../utils';
import { ExpandedNodes } from '../types';

export interface UseJsonEditorProps {
  initialData: any;
  onSave?: (data: any) => void;
}

export interface UseJsonEditorReturn {
  jsonData: any;
  originalData: any;
  expandedNodes: ExpandedNodes;
  isEditMode: boolean;
  hasChanges: boolean;
  handleEdit: (path: string, value: any) => void;
  toggleNode: (nodeKey: string) => void;
  handleSave: () => void;
  handleToggleEditMode: () => void;
  setExpandedNodes: (nodes: ExpandedNodes | ((prev: ExpandedNodes) => ExpandedNodes)) => void;
}

export const useJsonEditor = ({
  initialData,
  onSave
}: UseJsonEditorProps): UseJsonEditorReturn => {
  const [jsonData, setJsonData] = useState(initialData);
  const [originalData, setOriginalData] = useState(deepClone(initialData));
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodes>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const allNodes = collectAllNodes(jsonData);
    setExpandedNodes(allNodes);
  }, []);

  const handleEdit = useCallback((path: string, value: any) => {
    const newData = deepClone(jsonData);
    setNestedValue(newData, path, value);
    setJsonData(newData);
    setHasChanges(true);
  }, [jsonData]);

  const toggleNode = useCallback((nodeKey: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey],
    }));
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(deepClone(jsonData));
    }
    setOriginalData(deepClone(jsonData));
    setHasChanges(false);
  }, [jsonData, onSave]);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  return {
    jsonData,
    originalData,
    expandedNodes,
    isEditMode,
    hasChanges,
    handleEdit,
    toggleNode,
    handleSave,
    handleToggleEditMode,
    setExpandedNodes
  };
};