import React from 'react';
import { FileJson, X, Edit3, Eye } from 'lucide-react';

interface EditorHeaderProps {
  fileName: string;
  isEditMode: boolean;
  userRole: string;
  onToggleEditMode: () => void;
  onClose?: () => void;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  buttonClassName?: string;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  fileName,
  isEditMode,
  userRole,
  onToggleEditMode,
  onClose,
  className = '',
  iconClassName = '',
  titleClassName = '',
  buttonClassName = ''
}) => {
  return (
    <div className={`flex items-center justify-between rounded-md p-2 border-b border-gray-200 bg-gray-50 gap-2 ${className}`}>
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <FileJson 
          size={20} 
          className={`text-blue-600 flex-shrink-0 md:w-6 md:h-6 ${iconClassName}`} 
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className={`text-base md:text-lg font-bold text-gray-900 truncate ${titleClassName}`}>
              {fileName}
            </h2>
            {userRole === 'Admin' && (
              <button
                onClick={onToggleEditMode}
                className={`p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  isEditMode 
                    ? 'text-orange-700 hover:bg-orange-100' 
                    : 'text-blue-700 hover:bg-blue-100'
                } ${buttonClassName}`}
                title={isEditMode ? 'Switch to view mode' : 'Switch to edit mode'}
              >
                {isEditMode ? (
                  <Eye size={16} className="md:w-5 md:h-5" />
                ) : (
                  <Edit3 size={16} className="md:w-5 md:h-5" />
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-600">
            {isEditMode ? 'Edit mode' : 'Read-only mode'}
          </p>
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg transition-colors flex-shrink-0 ${buttonClassName}`}
        >
          <X size={16} className="md:w-5 md:h-5" />
        </button>
      )}
    </div>
  );
};