import React, { useState, useEffect } from 'react';
import { search } from 'json-accessor';
import { EditorHeader } from './EditorHeader';
import { EditorFooter } from './EditorFooter';
import { TreeNode } from './TreeNode';
import { SearchPanel } from './SearchPanel';
import { setNestedValue, collectAllNodes } from './utils';

export interface JsonTreeEditorProps {
  initialData: any;
  fileName?: string;
  onSave?: (data: any) => void;
  onClose?: () => void;
  userRole?: string;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  contentClassName?: string;
  treeClassName?: string;
  leafClassName?: string;
  arrayClassName?: string;
  objectClassName?: string;
  leafValueClassName?: string;
  leafFieldClassName?: string;
  arrayHeaderClassName?: string;
  objectHeaderClassName?: string;
}

export const JsonTreeEditor: React.FC<JsonTreeEditorProps> = ({
  initialData,
  fileName: initialFileName,
  onSave,
  onClose,
  userRole = 'User',
  className = '',
  headerClassName,
  footerClassName,
  contentClassName,
  treeClassName,
  leafClassName,
  arrayClassName,
  objectClassName,
  leafValueClassName,
  leafFieldClassName,
  arrayHeaderClassName,
  objectHeaderClassName
}) => {
  const [jsonData, setJsonData] = useState(initialData);
  const [originalData, setOriginalData] = useState(JSON.parse(JSON.stringify(initialData)));
  const [fileName, setFileName] = useState(initialFileName || 'data.json');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ path: string; value: any }>>([]);
  const [highlightedPaths, setHighlightedPaths] = useState<Set<string>>(new Set());

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

  const handleSearch = (criteria: any) => {
    if (Object.keys(criteria).length === 0) {
      setSearchResults([]);
      setHighlightedPaths(new Set());
      return;
    }

    const results = search(jsonData, criteria);
    setSearchResults(results);
    setHighlightedPaths(new Set(results.map(r => r.path)));
  };

  const handleResultClick = (path: string) => {
    const pathParts = path.split(/\.|\[|\]/).filter(Boolean);
    const nodesToExpand: Record<string, boolean> = { ...expandedNodes };
    
    let currentPath = '';
    pathParts.forEach((part, index) => {
      if (index === 0) {
        currentPath = part;
      } else {
        const prevPart = pathParts[index - 1];
        if (!isNaN(Number(part))) {
          currentPath += `[${part}]`;
        } else {
          currentPath += `.${part}`;
        }
      }
      nodesToExpand[currentPath] = true;
    });
    
    nodesToExpand['root'] = true;
    setExpandedNodes(nodesToExpand);

    setTimeout(() => {
      const element = document.querySelector(`[data-path="${path}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className={`h-full flex flex-col rounded-md bg-white ${className}`}>
      <EditorHeader
        fileName={fileName}
        isEditMode={isEditMode}
        userRole={userRole}
        onToggleEditMode={handleToggleEditMode}
        onClose={onClose}
        onToggleSearch={() => setShowSearch(!showSearch)}
        showSearch={showSearch}
        className={headerClassName}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-y-auto p-2 ${contentClassName}`}>
          <div className={`bg-white rounded-lg p-3 md:p-4 ${treeClassName}`}>
            <TreeNode
              path=""
              data={jsonData}
              onEdit={handleEdit}
              level={0}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              isEditMode={isEditMode}
              highlightedPaths={highlightedPaths}
              leafClassName={leafClassName}
              arrayClassName={arrayClassName}
              objectClassName={objectClassName}
              leafValueClassName={leafValueClassName}
              leafFieldClassName={leafFieldClassName}
              arrayHeaderClassName={arrayHeaderClassName}
              objectHeaderClassName={objectHeaderClassName}
            />
          </div>
        </div>

        {showSearch && (
          <SearchPanel
            onSearch={handleSearch}
            results={searchResults}
            onResultClick={handleResultClick}
            onClose={() => setShowSearch(false)}
          />
        )}
      </div>

      {isEditMode && (
        <EditorFooter
          hasChanges={hasChanges}
          onSave={handleSave}
          className={footerClassName}
        />
      )}
    </div>
  );
};