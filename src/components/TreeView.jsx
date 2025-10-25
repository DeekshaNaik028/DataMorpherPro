import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const TreeView = ({ data, level = 0, darkMode }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (key, value, path) => {
    const fullPath = path ? `${path}.${key}` : key;
    const isArray = Array.isArray(value);
    const isObject = typeof value === 'object' && value !== null;
    const hasChildren = isArray || isObject;
    const isExpanded = expanded[fullPath];

    return (
      <div key={fullPath} className="select-none">
        <div className={`flex items-center gap-1 sm:gap-2 py-1 px-2 rounded transition-colors cursor-pointer text-xs sm:text-sm ${
          darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'
        }`}>
          {hasChildren && (
            <button
              onClick={() => toggle(fullPath)}
              className={`p-0.5 rounded flex-shrink-0 ${
                darkMode ? 'hover:bg-slate-500' : 'hover:bg-gray-200'
              }`}
            >
              {isExpanded ? (
                <ChevronDown size={14} className={`sm:w-4 sm:h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              ) : (
                <ChevronRight size={14} className={`sm:w-4 sm:h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-4 sm:w-5 flex-shrink-0" />}
          
          <span className={`font-medium break-all ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{key}</span>
          <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>:</span>
          
          {!isExpanded && value !== null && (
            <span className={`text-xs ml-1 sm:ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {isArray ? `Array(${value.length})` : isObject ? 'Object' : ''}
            </span>
          )}
          
          {!hasChildren && (
            <span className={`ml-1 sm:ml-2 break-all ${
              value === null ? (darkMode ? 'text-gray-500' : 'text-gray-400') :
              typeof value === 'boolean' ? (darkMode ? 'text-purple-400' : 'text-purple-600') :
              typeof value === 'number' ? (darkMode ? 'text-blue-400' : 'text-blue-600') :
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              {value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value)}
            </span>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className={`ml-3 sm:ml-4 border-l-2 pl-2 ${
            darkMode ? 'border-slate-600' : 'border-gray-300'
          }`}>
            {Object.entries(value).map(([k, v]) => (
              renderValue(k, v, fullPath)
            ))}
          </div>
        )}
      </div>
    );
  };

  if (typeof data !== 'object' || data === null) {
    return <div className={`font-mono text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{String(data)}</div>;
  }

  return (
    <div className="font-mono text-xs sm:text-sm space-y-0">
      {Object.entries(data).map(([key, value]) => renderValue(key, value, ''))}
    </div>
  );
};

export default TreeView;