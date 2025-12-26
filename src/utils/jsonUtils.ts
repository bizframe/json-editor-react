import { ExpandedNodes } from '../types';

/**
 * Set a nested value in an object using a dot/bracket notation path
 */
export const setNestedValue = (obj: any, path: string, value: any): any => {
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

/**
 * Recursively collect all nodes in a JSON structure
 */
export const collectAllNodes = (data: any, path = ''): ExpandedNodes => {
  const allNodes: ExpandedNodes = {};
  
  const collect = (d: any, p: string) => {
    if (typeof d === 'object' && d !== null) {
      allNodes[p || 'root'] = true;
      
      if (Array.isArray(d)) {
        d.forEach((item, index) => {
          collect(item, `${p}[${index}]`);
        });
      } else {
        Object.keys(d).forEach((key) => {
          collect(d[key], p ? `${p}.${key}` : key);
        });
      }
    }
  };
  
  collect(data, path);
  return allNodes;
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if two objects are deeply equal
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Expand nodes along a path
 */
export const expandPath = (
  path: string,
  currentExpanded: ExpandedNodes
): ExpandedNodes => {
  const pathParts = path.split(/\.|\[|\]/).filter(Boolean);
  const nodesToExpand: ExpandedNodes = { ...currentExpanded };
  
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
  return nodesToExpand;
};

/**
 * Extract field name from path
 */
export const getFieldNameFromPath = (path: string): string => {
  if (!path) return 'root';
  return path.split('.').pop()?.replace(/\[(\d+)\]/, '[$1]') || 'root';
};