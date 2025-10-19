import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const TreeView = ({ data, level = 0 }) => {
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
        <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded transition-colors cursor-pointer">
          {hasChildren && (
            <button
              onClick={() => toggle(fullPath)}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-600" />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-5" />}
          
          <span className="font-medium text-gray-700">{key}</span>
          <span className="text-gray-500">:</span>
          
          {!isExpanded && value !== null && (
            <span className="text-gray-500 text-xs ml-2">
              {isArray ? `Array(${value.length})` : isObject ? 'Object' : ''}
            </span>
          )}
          
          {!hasChildren && (
            <span className={`ml-2 ${
              value === null ? 'text-gray-400' :
              typeof value === 'boolean' ? 'text-purple-600' :
              typeof value === 'number' ? 'text-blue-600' :
              'text-green-600'
            }`}>
              {value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value)}
            </span>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4 border-l-2 border-gray-300 pl-2">
            {Object.entries(value).map(([k, v]) => (
              renderValue(k, v, fullPath)
            ))}
          </div>
        )}
      </div>
    );
  };

  if (typeof data !== 'object' || data === null) {
    return <div className="text-gray-600 font-mono">{String(data)}</div>;
  }

  return (
    <div className="font-mono text-sm space-y-0">
      {Object.entries(data).map(([key, value]) => renderValue(key, value, ''))}
    </div>
  );
};

export default TreeView;