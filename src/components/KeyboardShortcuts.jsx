import React from 'react';
import { Keyboard } from 'lucide-react';

// Hook to handle keyboard shortcuts
export const useKeyboardShortcuts = (setActiveTab) => {
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      switch (e.key) {
        case 'k':
        case 'K':
          e.preventDefault();
          setActiveTab('convert');
          break;
        case 'q':
        case 'Q':
          e.preventDefault();
          setActiveTab('query');
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          setActiveTab('diff');
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setActiveTab('mock');
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          setActiveTab('validate');
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          setActiveTab('tree');
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          setActiveTab('generate');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setActiveTab]);
};

// Shortcuts data
export const SHORTCUTS = [
  { key: 'Ctrl+K', action: 'Convert' },
  { key: 'Ctrl+Q', action: 'Query' },
  { key: 'Ctrl+D', action: 'Diff' },
  { key: 'Ctrl+M', action: 'Mock Data' },
  { key: 'Ctrl+B', action: 'Validate' },
  { key: 'Ctrl+E', action: 'Tree View' },
  { key: 'Ctrl+G', action: 'Generate Code' },
];

// Keyboard shortcuts button component
export const KeyboardShortcutsButton = ({ darkMode }) => {
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowShortcuts(!showShortcuts)}
        className={`p-2 rounded-lg transition-colors ${
          darkMode 
            ? 'hover:bg-[#21262d]'
            : 'hover:bg-gray-200'
        }`}
        title="Show keyboard shortcuts"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
      </button>

      {showShortcuts && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowShortcuts(false)}
          />
          
          {/* Modal */}
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 border z-50 max-w-sm w-full ${
            darkMode
              ? 'bg-[#161b22] border-[#30363d]'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-mono font-semibold text-sm tracking-wide uppercase ${darkMode ? 'text-[#7d8590]' : 'text-gray-500'}`}>
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className={`p-1 rounded-md text-sm ${darkMode ? 'text-[#7d8590] hover:bg-[#21262d] hover:text-[#e6edf3]' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
                aria-label="Close shortcuts"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {SHORTCUTS.map((shortcut, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className={darkMode ? 'text-[#e6edf3]' : 'text-gray-700'}>
                    {shortcut.action}
                  </span>
                  <kbd className={`px-2.5 py-1 rounded text-xs font-mono border ${
                    darkMode
                      ? 'bg-[#21262d] text-amber-400 border-[#30363d]'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}>
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className={`mt-5 pt-4 border-t text-xs ${
              darkMode
                ? 'border-[#30363d] text-[#7d8590]'
                : 'border-gray-100 text-gray-400'
            }`}>
              Use Ctrl (or Cmd on Mac) + key
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default KeyboardShortcutsButton;