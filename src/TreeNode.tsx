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
  leafClassName?: string;
  arrayClassName?: string;
  objectClassName?: string;
  leafValueClassName?: string;
  leafFieldClassName?: string;
  arrayHeaderClassName?: string;
  objectHeaderClassName?: string;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ 
  path, 
  data, 
  onEdit, 
  level = 0, 
  expandedNodes, 
  toggleNode, 
  isEditMode,
  leafClassName,
  arrayClassName,
  objectClassName,
  leafValueClassName,
  leafFieldClassName,
  arrayHeaderClassName,
  objectHeaderClassName
}) => {
  const nodeKey = path || 'root';
  const isExpanded = expandedNodes[nodeKey];

  if (data === null || typeof data !== 'object') {
    return (
      <TreeLeaf
        path={path}
        data={data}
        level={level}
        isEditMode={isEditMode}
        onEdit={onEdit}
        className={leafClassName}
        valueClassName={leafValueClassName}
        fieldClassName={leafFieldClassName}
      />
    );
  }

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
        className={arrayClassName}
        headerClassName={arrayHeaderClassName}
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
            leafClassName={leafClassName}
            arrayClassName={arrayClassName}
            objectClassName={objectClassName}
            leafValueClassName={leafValueClassName}
            leafFieldClassName={leafFieldClassName}
            arrayHeaderClassName={arrayHeaderClassName}
            objectHeaderClassName={objectHeaderClassName}
          />
        ))}
      </TreeArray>
    );
  }

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
      className={objectClassName}
      headerClassName={objectHeaderClassName}
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
          leafClassName={leafClassName}
          arrayClassName={arrayClassName}
          objectClassName={objectClassName}
          leafValueClassName={leafValueClassName}
          leafFieldClassName={leafFieldClassName}
          arrayHeaderClassName={arrayHeaderClassName}
          objectHeaderClassName={objectHeaderClassName}
        />
      ))}
    </TreeObject>
  );
};