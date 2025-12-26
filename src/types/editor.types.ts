export interface JsonTreeEditorProps {
  initialData: any;
  fileName?: string;
  onSave?: (data: any) => void;
  onClose?: () => void;
  userRole?: 'Admin' | 'User';
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

export interface EditorHeaderProps {
  fileName: string;
  isEditMode: boolean;
  userRole: string;
  onToggleEditMode: () => void;
  onClose?: () => void;
  onToggleSearch?: () => void;
  showSearch?: boolean;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  buttonClassName?: string;
}

export interface EditorFooterProps {
  hasChanges: boolean;
  onSave: () => void;
  className?: string;
  buttonClassName?: string;
}

export interface EditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  field: string;
  value: any;
  onSave: (value: any) => void;
  className?: string;
  overlayClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export interface SearchPanelProps {
  onSearch: (criteria: any) => void;
  results: Array<{ path: string; value: any }>;
  onResultClick: (path: string) => void;
  onClose: () => void;
}

export interface SearchCriteria {
  type?: string;
  keyIncludes?: string;
  valueEquals?: string;
  valueGt?: number;
  valueLt?: number;
}