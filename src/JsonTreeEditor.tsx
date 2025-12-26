import React, { useState } from 'react';
import { EditorHeader, EditorFooter, SearchPanel, TreeNode } from './components';
import { useJsonEditor, useSearchState } from './hooks';
import { JsonTreeEditorProps } from './types';

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
  const [fileName] = useState(initialFileName || 'data.json');

  const {
    jsonData,
    expandedNodes,
    isEditMode,
    hasChanges,
    handleEdit,
    toggleNode,
    handleSave,
    handleToggleEditMode,
    setExpandedNodes
  } = useJsonEditor({ initialData, onSave });

  const {
    showSearch,
    searchResults,
    highlightedPaths,
    handleSearch,
    handleResultClick,
    setShowSearch
  } = useSearchState({
    jsonData,
    expandedNodes,
    setExpandedNodes
  });

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