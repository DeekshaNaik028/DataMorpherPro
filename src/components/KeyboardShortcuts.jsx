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
        case 'v':
        case 'V':
          e.preventDefault();
          setActiveTab('validate');
          break;
        case 't':
        case 'T':
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
  { key: 'Ctrl+V', action: 'Validate' },
  { key: 'Ctrl+T', action: 'Tree View' },
  { key: 'Ctrl+G', action: 'Generate Code' },
];

// Keyboard shortcuts button component
export const KeyboardShortcutsButton = ({ darkMode }) => {
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Show keyboard shortcuts"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
      </button>

      {showShortcuts && (
        <div className={`fixed top-20 right-6 rounded-lg shadow-xl p-6 border z-50 max-w-xs ${
          darkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Keyboard Shortcuts
            </h3>
            <button
              onClick={() => setShowShortcuts(false)}
              className={`text-lg font-bold ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
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
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {shortcut.action}
                </span>
                <kbd className={`px-2 py-1 rounded text-xs font-mono font-semibold border ${
                  darkMode
                    ? 'bg-slate-700 text-gray-200 border-slate-600'
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                }`}>
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className={`mt-4 pt-4 border-t text-xs ${
            darkMode
              ? 'border-slate-700 text-gray-500'
              : 'border-gray-200 text-gray-500'
          }`}>
            💡 Use Ctrl (Cmd on Mac) + key
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsButton;