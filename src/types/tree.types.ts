export interface TreeNodeProps {
  path: string;
  data: any;
  onEdit: (path: string, value: any) => void;
  level?: number;
  expandedNodes: Record<string, boolean>;
  toggleNode: (key: string) => void;
  isEditMode: boolean;
  highlightedPaths?: Set<string>;
  leafClassName?: string;
  arrayClassName?: string;
  objectClassName?: string;
  leafValueClassName?: string;
  leafFieldClassName?: string;
  arrayHeaderClassName?: string;
  objectHeaderClassName?: string;
}

export interface TreeLeafProps {
  path: string;
  data: any;
  level: number;
  isEditMode: boolean;
  onEdit: (path: string, value: any) => void;
  isHighlighted?: boolean;
  className?: string;
  valueClassName?: string;
  fieldClassName?: string;
  editPopupClassName?: string;
}

export interface TreeArrayProps {
  path: string;
  data: any[];
  level: number;
  nodeKey: string;
  isExpanded: boolean;
  isEditMode: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  fieldClassName?: string;
  buttonClassName?: string;
}

export interface TreeObjectProps {
  path: string;
  data: Record<string, any>;
  level: number;
  nodeKey: string;
  isExpanded: boolean;
  isEditMode: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  fieldClassName?: string;
  buttonClassName?: string;
}

export type ValueType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

export interface ExpandedNodes {
  [key: string]: boolean;
}