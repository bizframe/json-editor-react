import { ValueType } from '../types';

/**
 * Get the type of a value
 */
export const getValueType = (value: any): ValueType => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as ValueType;
};

/**
 * Get the Tailwind color class for a type
 */
export const getTypeColor = (type: ValueType): string => {
  const colorMap: Record<ValueType, string> = {
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-purple-600',
    null: 'text-gray-500',
    array: 'text-orange-600',
    object: 'text-gray-700'
  };
  
  return colorMap[type] || 'text-gray-700';
};

/**
 * Parse a string value to its original type
 */
export const parseValueByType = (editValue: string, originalValue: any): any => {
  const originalType = typeof originalValue;

  if (originalType === 'number') {
    const num = Number(editValue);
    if (isNaN(num)) {
      throw new Error('Invalid number format');
    }
    return num;
  }

  if (originalType === 'boolean') {
    if (editValue === 'true') return true;
    if (editValue === 'false') return false;
    throw new Error('Invalid boolean value. Use "true" or "false"');
  }

  if (originalValue === null) {
    if (editValue === 'null') return null;
    throw new Error('Invalid null value. Use "null"');
  }

  if (originalType === 'string') {
    return editValue;
  }

  if (Array.isArray(originalValue)) {
    const parsedValue = JSON.parse(editValue);
    if (!Array.isArray(parsedValue)) {
      throw new Error('Value must be an array');
    }
    return parsedValue;
  }

  if (originalType === 'object') {
    const parsedValue = JSON.parse(editValue);
    if (typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
      throw new Error('Value must be an object');
    }
    return parsedValue;
  }

  try {
    return JSON.parse(editValue);
  } catch {
    return editValue;
  }
};

/**
 * Format value for display in edit popup
 */
export const formatValueForEdit = (value: any): string => {
  if (Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }
  
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  return String(value ?? '');
};