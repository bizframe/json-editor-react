import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (criteria: any) => void;
  results: Array<{ path: string; value: any }>;
  onResultClick: (path: string) => void;
  onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  onSearch,
  results,
  onResultClick,
  onClose
}) => {
  const [searchType, setSearchType] = useState('');
  const [keyIncludes, setKeyIncludes] = useState('');
  const [valueIncludes, setValueIncludes] = useState('');
  const [valueGt, setValueGt] = useState('');
  const [valueLt, setValueLt] = useState('');

  const handleSearch = () => {
    const criteria: any = {};
    
    if (searchType) criteria.type = searchType;
    if (keyIncludes) criteria.keyIncludes = keyIncludes;
    if (valueIncludes) criteria.valueIncludes = valueIncludes;
    if (valueGt) criteria.valueGt = Number(valueGt);
    if (valueLt) criteria.valueLt = Number(valueLt);
    
    onSearch(criteria);
  };

  const handleClear = () => {
    setSearchType('');
    setKeyIncludes('');
    setValueIncludes('');
    setValueGt('');
    setValueLt('');
    onSearch({});
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SearchIcon size={20} className="text-blue-600" />
            <h3 className="font-bold text-lg">Search</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All types</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="null">Null</option>
              <option value="array">Array</option>
              <option value="object">Object</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Contains
            </label>
            <input
              type="text"
              value={keyIncludes}
              onChange={(e) => setKeyIncludes(e.target.value)}
              placeholder="Search in keys..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value Contains
            </label>
            <input
              type="text"
              value={valueIncludes}
              onChange={(e) => setValueIncludes(e.target.value)}
              placeholder="Search in values..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value &gt;
              </label>
              <input
                type="number"
                value={valueGt}
                onChange={(e) => setValueGt(e.target.value)}
                placeholder="Greater than"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value &lt;
              </label>
              <input
                type="number"
                value={valueLt}
                onChange={(e) => setValueLt(e.target.value)}
                placeholder="Less than"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Results ({results.length})
        </div>
        {results.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            No results found
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => onResultClick(result.path)}
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <div className="font-mono text-xs text-blue-600 mb-1 break-all">
                  {result.path || 'root'}
                </div>
                <div className="font-mono text-xs text-gray-700 break-all">
                  {typeof result.value === 'string' 
                    ? `"${result.value}"` 
                    : JSON.stringify(result.value)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};