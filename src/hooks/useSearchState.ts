import { useState, useCallback } from 'react';
import { search } from 'json-accessor';
import { expandPath } from '../utils';
import { ExpandedNodes } from '../types';

export interface UseSearchStateProps {
  jsonData: any;
  expandedNodes: ExpandedNodes;
  setExpandedNodes: (nodes: ExpandedNodes | ((prev: ExpandedNodes) => ExpandedNodes)) => void;
}

export interface UseSearchStateReturn {
  showSearch: boolean;
  searchResults: Array<{ path: string; value: any }>;
  highlightedPaths: Set<string>;
  handleSearch: (criteria: any) => void;
  handleResultClick: (path: string) => void;
  setShowSearch: (show: boolean) => void;
}

export const useSearchState = ({
  jsonData,
  expandedNodes,
  setExpandedNodes
}: UseSearchStateProps): UseSearchStateReturn => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ path: string; value: any }>>([]);
  const [highlightedPaths, setHighlightedPaths] = useState<Set<string>>(new Set());

  const handleSearch = useCallback((criteria: any) => {
    if (Object.keys(criteria).length === 0) {
      setSearchResults([]);
      setHighlightedPaths(new Set());
      return;
    }

    const results = search(jsonData, criteria);
    setSearchResults(results);
    setHighlightedPaths(new Set(results.map(r => r.path)));
  }, [jsonData]);

  const handleResultClick = useCallback((path: string) => {
    const nodesToExpand = expandPath(path, expandedNodes);
    setExpandedNodes(nodesToExpand);

    setTimeout(() => {
      const element = document.querySelector(`[data-path="${path}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [expandedNodes, setExpandedNodes]);

  return {
    showSearch,
    searchResults,
    highlightedPaths,
    handleSearch,
    handleResultClick,
    setShowSearch
  };
};