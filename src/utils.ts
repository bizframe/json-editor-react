export const getValueType = (value: any): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

export const getTypeColor = (type: string): string => {
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

export const collectAllNodes = (data: any, path = ''): Record<string, boolean> => {
  const allNodes: Record<string, boolean> = {};
  
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