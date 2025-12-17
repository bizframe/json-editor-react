import React from 'react';
import { Save } from 'lucide-react';

interface EditorFooterProps {
  hasChanges: boolean;
  onSave: () => void;
}

export const EditorFooter: React.FC<EditorFooterProps> = ({ 
  hasChanges, 
  onSave 
}) => {
  return (
    <div className="sticky bottom-0 p-2 bg-white border-t border-gray-200 flex justify-end">
      <button
        onClick={onSave}
        disabled={!hasChanges}
        className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg transition-colors ${
          hasChanges 
            ? 'text-white bg-green-600 hover:bg-green-700' 
            : 'text-gray-400 bg-gray-200 cursor-not-allowed'
        }`}
      >
        <Save size={16} className="md:w-5 md:h-5" />
        <span className="hidden sm:inline">Save Changes</span>
      </button>
    </div>
  );
};