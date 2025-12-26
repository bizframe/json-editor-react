import React from 'react';
import { TreeLeaf } from './TreeLeaf';
import { TreeArray } from './TreeArray';
import { TreeObject } from './TreeObject';
import { TreeNodeProps } from '../../types';

export const TreeNode: React.FC<TreeNodeProps> = ({ 
  path, 
  data, 
  onEdit, 
  level = 0, 
  expandedNodes, 
  toggleNode, 
  isEditMode,
  highlightedPaths = new Set(),
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
  const isHighlighted = highlightedPaths.has(path);

  // Render leaf node for primitives and null
  if (data === null || typeof data !== 'object') {
    return (
      <TreeLeaf
        path={path}
        data={data}
        level={level}
        isEditMode={isEditMode}
        onEdit={onEdit}
        isHighlighted={isHighlighted}
        className={leafClassName}
        valueClassName={leafValueClassName}
        fieldClassName={leafFieldClassName}
      />
    );
  }

  // Render array node
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
            highlightedPaths={highlightedPaths}
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

  // Render object node
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
          highlightedPaths={highlightedPaths}
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