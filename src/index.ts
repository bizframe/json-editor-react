// Main component export
export { JsonTreeEditor as default } from './JsonTreeEditor';
export { JsonTreeEditor } from './JsonTreeEditor';
export type { JsonTreeEditorProps } from './JsonTreeEditor';

// Sub-component exports (for advanced customization)
export { EditPopup } from './EditPopup';
export { TreeNode } from './TreeNode';
export type { TreeNodeProps } from './TreeNode';
export { TreeLeaf } from './TreeLeaf';
export { TreeArray } from './TreeArray';
export { TreeObject } from './TreeObject';
export { EditorHeader } from './EditorHeader';
export { EditorFooter } from './EditorFooter';

// Utility exports
export { 
  getValueType, 
  getTypeColor, 
  setNestedValue, 
  collectAllNodes 
} from './utils';