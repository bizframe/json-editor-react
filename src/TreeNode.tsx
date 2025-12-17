import React from 'react';
import { TreeLeaf } from './TreeLeaf';
import { TreeArray } from './TreeArray';
import { TreeObject } from './TreeObject';

export interface TreeNodeProps {
  path: string;
  data: any;
  onEdit: (path: string, value: any) => void;
  level?: number;
  expandedNodes: Record<string, boolean>;
  toggleNode: (key: string) => void;
  isEditMode: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ 
  path, 
  data, 
  onEdit, 
  level = 0, 
  expandedNodes, 
  toggleNode, 
  isEditMode 
}) => {
  const nodeKey = path || 'root';
  const isExpanded = expandedNodes[nodeKey];

  // Leaf node (primitive values)
  if (data === null || typeof data !== 'object') {
    return (
      <TreeLeaf
        path={path}
        data={data}
        level={level}
        isEditMode={isEditMode}
        onEdit={onEdit}
      />
    );
  }

  // Array node
  if (Array.isArray(data)) {
    return (
      <TreeArray
        path={path}
        data={data}
        level={level}
        nodeKey={nodeKey}
        isExpanded={isExpanded}
        isEditMode={isEditMode}
        onToggle={() => toggleNode(nodeKey)}
      >
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
      </TreeArray>
    );
  }

  // Object node
  const keys = Object.keys(data);
  return (
    <TreeObject
      path={path}
      data={data}
      level={level}
      nodeKey={nodeKey}
      isExpanded={isExpanded}
      isEditMode={isEditMode}
      onToggle={() => toggleNode(nodeKey)}
    >
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
    </TreeObject>
  );
};