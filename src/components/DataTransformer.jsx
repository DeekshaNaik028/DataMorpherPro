import React, { useState, useEffect } from 'react';
import {
  FileJson, FileCode, Database, GitCompare, Sparkles,
  Eye, Code2, CheckCircle, AlertCircle, Copy, Download,
  Wand2, Upload, Menu, X
} from 'lucide-react';
import { useTheme, ThemeToggle } from './ThemeToggle';
import { useKeyboardShortcuts, KeyboardShortcutsButton } from './KeyboardShortcuts';
import TreeView from './TreeView';
import DataUtils from '../utils/DataUtils';
import Validators from '../utils/validators';
import CodeGenerators from '../utils/codeGenerators';

// Format configuration
const FORMATS = [
  { id: 'json', label: 'JSON', icon: FileJson },
  { id: 'xml', label: 'XML', icon: FileCode },
  { id: 'yaml', label: 'YAML', icon: Database },
  { id: 'csv', label: 'CSV', icon: Database }
];

const LANGUAGES = [
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' }
];

const TABS = [
  { id: 'convert', label: 'Convert', icon: FileJson },
  { id: 'tree', label: 'Tree View', icon: Eye },
  { id: 'query', label: 'Query', icon: Code2 },
  { id: 'validate', label: 'Validate', icon: CheckCircle },
  { id: 'diff', label: 'Diff', icon: GitCompare },
  { id: 'mock', label: 'Mock Data', icon: Sparkles },
  { id: 'generate', label: 'Generate Code', icon: Code2 }
];

// Logo Component
const Logo = () => (
  <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
    <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#f59e0b"/>
      <path d="M8 14h14M22 14l-4-4M22 14l-4 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 26H18M18 26l4-4M18 26l4 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

// File Upload Component
const FileUploadButton = ({ onUpload, darkMode }) => {
  const fileInputRef = React.useRef(null);

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
      >
        <Upload size={16} />
        <span>Upload</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.xml,.yaml,.yml,.csv"
        onChange={onUpload}
        style={{ display: 'none' }}
      />
    </>
  );
};

// Action Buttons Component
const ActionButtons = ({ onCopy, onDownload, content, filename, darkMode }) => (
  <div className="flex gap-2">
    <button
      onClick={() => onCopy(content)}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
    >
      <Copy size={16} />
      <span>Copy</span>
    </button>
    <button
      onClick={() => onDownload(content, filename)}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
      disabled={!content}
    >
      <Download size={16} />
      <span>Download</span>
    </button>
  </div>
);

const FormatSelector = ({ formats, activeFormat, onSelect, darkMode, label }) => (
  <div className="w-full">
    {label && (
      <label className={`block text-xs sm:text-sm font-semibold mb-2 ${darkMode ? 'text-[#7d8590]' : 'text-gray-600'}`}>
        {label}
      </label>
    )}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {formats.map(fmt => {
        const Icon = fmt.icon;
        return (
          <button
            key={fmt.id}
            onClick={() => onSelect(fmt.id)}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold transition-all ${
              activeFormat === fmt.id
                ? 'bg-amber-400 text-gray-900 ring-1 ring-amber-300'
                : darkMode
                  ? 'bg-[#21262d] text-[#7d8590] hover:text-[#e6edf3] border border-[#30363d]'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Icon size={14} className="sm:w-4 sm:h-4" />
            <span>{fmt.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// Mobile Tab Menu
const MobileTabMenu = ({ tabs, activeTab, setActiveTab, darkMode, isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      <div className={`absolute right-0 top-0 h-full w-72 ${
        darkMode ? 'bg-[#161b22] border-l border-[#30363d]' : 'bg-white border-l border-gray-200'
      } p-6 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-mono font-semibold text-sm tracking-wide uppercase ${darkMode ? 'text-[#7d8590]' : 'text-gray-500'}`}>Navigation</h3>
          <button onClick={() => setIsOpen(false)} className={`p-1.5 rounded-md ${darkMode ? 'text-[#7d8590] hover:bg-[#21262d] hover:text-[#e6edf3]' : 'text-gray-500 hover:bg-gray-100'}`}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'bg-amber-400/10 text-amber-400'
                      : 'bg-amber-50 text-amber-700'
                    : darkMode
                      ? 'text-[#7d8590] hover:bg-[#21262d] hover:text-[#e6edf3]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main DataTransformer Component
const DataTransformer = () => {
  const [input, setInput] = useState(JSON.stringify({
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    isActive: true,
    skills: ["JavaScript", "React", "Node.js"],
    address: {
      city: "New York",
      zip: "10001",
      country: "USA"
    },
    projects: [
      {
        id: 1,
        title: "E-commerce Platform",
        status: "completed",
        tech: ["React", "Node.js", "MongoDB"]
      },
      {
        id: 2,
        title: "Task Manager",
        status: "in-progress",
        tech: ["Vue", "Firebase"]
      },
      {
        id: 3,
        title: "Blog System",
        status: "planning",
        tech: ["Next.js", "PostgreSQL"]
      }
    ],
    social: {
      github: "johndoe",
      linkedin: "john-doe",
      twitter: "@johndoe"
    }
  }, null, 2));

  const [output, setOutput] = useState('');
  const [inputFormat, setInputFormat] = useState('json');
  const [outputFormat, setOutputFormat] = useState('xml');
  const [activeTab, setActiveTab] = useState('convert');
  const [validation, setValidation] = useState(null);
  const [query, setQuery] = useState('$.name');
  const [queryResult, setQueryResult] = useState('');
  const [compareInput, setCompareInput] = useState('{}');
  const [diffResult, setDiffResult] = useState([]);
  const [schema, setSchema] = useState(JSON.stringify({
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      email: { type: "string" }
    }
  }, null, 2));
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useTheme();
  useKeyboardShortcuts(setActiveTab);

  // Conversion logic
  const convert = async () => {
    try {
      let data;

      if (inputFormat === 'json') {
        data = JSON.parse(input);
      } else if (inputFormat === 'xml') {
        data = await DataUtils.xmlToJson(input);
      } else if (inputFormat === 'yaml') {
        data = DataUtils.yamlToJson(input);
      } else if (inputFormat === 'csv') {
        data = DataUtils.csvToJson(input);
      }

      let result = '';
      if (outputFormat === 'json') {
        result = JSON.stringify(data, null, 2);
      } else if (outputFormat === 'xml') {
        result = DataUtils.jsonToXml(data);
      } else if (outputFormat === 'yaml') {
        result = DataUtils.jsonToYaml(data);
      } else if (outputFormat === 'csv') {
        result = DataUtils.jsonToCsv(data);
      }

      setOutput(result);
      setValidation({ valid: true, message: 'Conversion successful!' });
    } catch (e) {
      setValidation({ valid: false, message: e.message });
      setOutput('');
    }
  };

  const validateInput = () => {
    let result;
    if (inputFormat === 'json') {
      result = Validators.validateJson(input);
    } else if (inputFormat === 'xml') {
      result = Validators.validateXml(input);
    } else if (inputFormat === 'yaml') {
      result = Validators.validateYaml(input);
    } else if (inputFormat === 'csv') {
      result = Validators.validateCsv(input);
    }
    setValidation(result);
  };

  const executeQuery = () => {
    try {
      const data = JSON.parse(input);
      const result = DataUtils.queryJsonPath(data, query);
      setQueryResult(JSON.stringify(result, null, 2));
      setValidation({ valid: true, message: 'Query executed successfully!' });
    } catch (e) {
      setQueryResult('');
      setValidation({ valid: false, message: `Query Error: ${e.message}` });
    }
  };

  const compareData = () => {
    try {
      const data1 = JSON.parse(input);
      const data2 = JSON.parse(compareInput);
      const diffs = DataUtils.diffObjects(data1, data2);
      setDiffResult(diffs);
      setValidation({ valid: true, message: `Found ${diffs.length} difference(s)` });
    } catch (e) {
      setDiffResult([]);
      setValidation({ valid: false, message: `Compare Error: ${e.message}` });
    }
  };

  const generateMock = () => {
    try {
      const schemaObj = JSON.parse(schema);
      const mock = DataUtils.generateMockData(schemaObj);
      setOutput(JSON.stringify(mock, null, 2));
      setValidation({ valid: true, message: 'Mock data generated successfully!' });
    } catch (e) {
      setOutput('');
      setValidation({ valid: false, message: `Mock Generation Error: ${e.message}` });
    }
  };

  const generateInterface = () => {
    try {
      const data = JSON.parse(input);
      let code = '';

      if (codeLanguage === 'typescript') {
        code = CodeGenerators.generateTypeScript(data, 'Root');
      } else if (codeLanguage === 'python') {
        code = CodeGenerators.generatePython(data, 'Root');
      } else if (codeLanguage === 'java') {
        code = CodeGenerators.generateJava(data, 'Root');
      } else if (codeLanguage === 'go') {
        code = CodeGenerators.generateGo(data, 'Root');
      }

      setOutput(code);
      setValidation({ valid: true, message: `${codeLanguage} code generated!` });
    } catch (e) {
      setOutput('');
      setValidation({ valid: false, message: `Code Generation Error: ${e.message}` });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setValidation({ valid: false, message: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum supported size is 10MB to avoid browser slowdowns.` });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        setInput(content);

        const extension = file.name.split('.').pop().toLowerCase();
        const formatMap = {
          'json': 'json',
          'xml': 'xml',
          'yaml': 'yaml',
          'yml': 'yaml',
          'csv': 'csv'
        };

        const detectedFormat = formatMap[extension];
        if (detectedFormat) {
          setInputFormat(detectedFormat);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    };

    reader.readAsText(file);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadFile = (content, filename) => {
    if (!content) {
      alert('No content to download');
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'output.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    convert();
  }, [inputFormat, outputFormat]);

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-6 transition-colors ${
      darkMode
        ? 'bg-[#0d1117]'
        : 'bg-[#f6f8fa]'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6 mb-4 sm:mb-6`}>
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 overflow-hidden">
              <Logo />
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-1 sm:gap-2">
                  <h1 className={`text-base sm:text-2xl md:text-3xl font-mono font-bold truncate ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>
                    Data Morpher Pro
                  </h1>
                  <span className={`text-[9px] sm:text-xs font-mono px-1.5 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${darkMode ? 'border-[#30363d] text-[#7d8590] bg-[#21262d]' : 'border-gray-300 text-gray-400 bg-gray-100'}`}>
                    v1.0
                  </span>
                </div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-[#7d8590]' : 'text-gray-500'} hidden sm:block mt-1 truncate`}>
                  Convert, validate, and morph data effortlessly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <div className="hidden sm:block">
                <KeyboardShortcutsButton darkMode={darkMode} />
              </div>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-1.5 sm:p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-[#21262d]' : 'hover:bg-gray-200'}`}
              >
                <Menu size={18} className={`sm:w-5 sm:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className={`hidden lg:flex overflow-x-auto mt-4 border-b ${darkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-amber-400 text-amber-400'
                      : darkMode
                        ? 'border-transparent text-[#7d8590] hover:text-[#e6edf3]'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Tab Indicator */}
          <div className="lg:hidden mt-3">
            <div className={`px-3 py-2 rounded-md border ${darkMode ? 'bg-[#21262d] border-[#30363d]' : 'bg-gray-100 border-gray-200'} flex items-center justify-between`}>
              <span className={`text-sm font-mono font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                {TABS.find(t => t.id === activeTab)?.label}
              </span>
              <span className={`text-xs ${darkMode ? 'text-[#7d8590]' : 'text-gray-400'}`}>tap menu to switch</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileTabMenu 
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          isOpen={mobileMenuOpen}
          setIsOpen={setMobileMenuOpen}
        />

        {/* Convert Tab */}
        {activeTab === 'convert' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Input Section */}
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>
                Input
              </h2>
              
              <FormatSelector 
                formats={FORMATS} 
                activeFormat={inputFormat} 
                onSelect={setInputFormat}
                darkMode={darkMode}
                label="Select Input Format:"
              />
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full h-64 sm:h-80 md:h-96 p-3 sm:p-4 border-2 rounded-lg font-mono text-xs sm:text-sm focus:outline-none resize-none mt-4 ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d] focus:border-amber-400/60'
                    : 'bg-white text-gray-800 border-gray-200 focus:border-blue-400'
                }`}
                placeholder="Enter your data here..."
              />
              
              <div className="mt-4">
                <FileUploadButton onUpload={handleFileUpload} darkMode={darkMode} />
              </div>
            </div>

            {/* Output Section */}
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>
                Output
              </h2>
              
              <FormatSelector 
                formats={FORMATS} 
                activeFormat={outputFormat} 
                onSelect={setOutputFormat}
                darkMode={darkMode}
                label="Select Output Format:"
              />
              
              <textarea
                value={output}
                readOnly
                className={`w-full h-64 sm:h-80 md:h-96 p-3 sm:p-4 border-2 rounded-lg font-mono text-xs sm:text-sm resize-none mt-4 ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d]'
                    : 'bg-gray-50 text-gray-800 border-gray-200'
                }`}
                placeholder="Converted output will appear here..."
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setOutput(DataUtils.beautify(output, outputFormat))}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    Beautify
                  </button>
                  <button
                    onClick={() => setOutput(DataUtils.minify(output, outputFormat))}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Minify
                  </button>
                </div>
                <ActionButtons 
                  onCopy={copyToClipboard}
                  onDownload={downloadFile}
                  content={output}
                  filename={`output.${outputFormat}`}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tree View Tab */}
        {activeTab === 'tree' && (
          <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>Data Tree View</h2>
            <div className={`border-2 rounded-lg p-3 sm:p-4 max-h-[400px] sm:max-h-[600px] overflow-auto ${
              darkMode
                ? 'bg-[#0d1117] border-[#30363d]'
                : 'bg-gray-50 border-gray-200'
            }`}>
              {(() => {
                try {
                  const data = JSON.parse(input);
                  return <TreeView data={data} darkMode={darkMode} />;
                } catch (e) {
                  return <div className={`${darkMode ? 'text-red-400' : 'text-red-500'} font-mono text-xs sm:text-sm`}>Invalid JSON: {e.message}</div>;
                }
              })()}
            </div>
          </div>
        )}

        {/* Query Tab */}
        {activeTab === 'query' && (
          <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>JSONPath Query</h2>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-[#7d8590]' : 'text-gray-600'} mb-2`}>JSONPath Expression</label>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-3`}>Examples: $.name, $.skills[0], $.address.city, $.users[*].id</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none text-sm ${
                    darkMode
                      ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d] focus:border-amber-400/60'
                      : 'bg-white text-gray-800 border-gray-200 focus:border-blue-400'
                  }`}
                  placeholder="$.users[0].name"
                />
                <button
                  onClick={executeQuery}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  Execute
                </button>
              </div>
            </div>
            <div className={`border-2 rounded-lg p-4 ${
              darkMode
                ? 'bg-[#0d1117] border-[#30363d]'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`font-medium text-sm ${darkMode ? 'text-[#7d8590]' : 'text-gray-600'} mb-3`}>Result:</h3>
              <pre className={`p-4 rounded-lg overflow-auto max-h-64 sm:max-h-96 text-xs sm:text-sm font-mono border ${
                darkMode
                  ? 'bg-[#161b22] text-[#e6edf3] border-[#30363d]'
                  : 'bg-white text-gray-800 border-gray-200'
              }`}>
                {queryResult || 'No result yet...'}
              </pre>
            </div>
          </div>
        )}

        {/* Validate Tab */}
        {activeTab === 'validate' && (
          <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>Data Validation</h2>
            <button
              onClick={validateInput}
              className="mb-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium w-full sm:w-auto"
            >
              Validate {inputFormat.toUpperCase()}
            </button>
            {validation && (
              <div className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                validation.valid
                  ? darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'
                  : darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'
              }`}>
                {validation.valid ? (
                  <CheckCircle className={`${darkMode ? 'text-green-400' : 'text-green-600'} flex-shrink-0`} size={24} />
                ) : (
                  <AlertCircle className={`${darkMode ? 'text-red-400' : 'text-red-600'} flex-shrink-0`} size={24} />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg ${validation.valid ? (darkMode ? 'text-green-300' : 'text-green-800') : (darkMode ? 'text-red-300' : 'text-red-800')}`}>
                    {validation.valid ? '✓ Valid' : '✗ Invalid'}
                  </h3>
                  <p className={`text-sm break-words ${validation.valid ? (darkMode ? 'text-green-200' : 'text-green-700') : (darkMode ? 'text-red-200' : 'text-red-700')}`}>
                    {validation.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diff Tab */}
        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>Original</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full h-48 sm:h-64 p-4 border-2 rounded-lg font-mono text-xs sm:text-sm focus:outline-none resize-none ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d] focus:border-amber-400/60'
                    : 'bg-white text-gray-800 border-gray-200 focus:border-blue-400'
                }`}
              />
            </div>
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>Updated</h2>
              <textarea
                value={compareInput}
                onChange={(e) => setCompareInput(e.target.value)}
                className={`w-full h-48 sm:h-64 p-4 border-2 rounded-lg font-mono text-xs sm:text-sm focus:outline-none resize-none ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d] focus:border-amber-400/60'
                    : 'bg-white text-gray-800 border-gray-200 focus:border-blue-400'
                }`}
              />
            </div>
            <div className={`lg:col-span-2 ${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>Differences</h2>
                <button
                  onClick={compareData}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium w-full sm:w-auto"
                >
                  Compare
                </button>
              </div>
              <div className="space-y-2 max-h-64 sm:max-h-96 overflow-auto">
                {diffResult.length === 0 ? (
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8 text-sm`}>No differences found or click Compare</div>
                ) : (
                  diffResult.map((diff, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border-l-4 font-mono text-xs sm:text-sm ${
                        diff.type === 'added'
                          ? darkMode ? 'bg-green-900 border-green-500 text-green-200' : 'bg-green-50 border-green-500 text-green-800'
                          : diff.type === 'removed'
                          ? darkMode ? 'bg-red-900 border-red-500 text-red-200' : 'bg-red-50 border-red-500 text-red-800'
                          : diff.type === 'changed'
                          ? darkMode ? 'bg-yellow-900 border-yellow-500 text-yellow-200' : 'bg-yellow-50 border-yellow-500 text-yellow-800'
                          : darkMode ? 'bg-gray-700 border-gray-500 text-gray-200' : 'bg-gray-50 border-gray-500 text-gray-800'
                      }`}
                    >
                      <div className="font-bold break-words">{diff.path || 'Error'}</div>
                      {diff.type === 'changed' && (
                        <>
                          <div className={`${darkMode ? 'text-red-300' : 'text-red-600'} mt-1 break-words`}>- {JSON.stringify(diff.old)}</div>
                          <div className={`${darkMode ? 'text-green-300' : 'text-green-600'} break-words`}>+ {JSON.stringify(diff.new)}</div>
                        </>
                      )}
                      {diff.type === 'added' && (
                        <div className={`${darkMode ? 'text-green-300' : 'text-green-600'} mt-1 break-words`}>+ {JSON.stringify(diff.value)}</div>
                      )}
                      {diff.type === 'removed' && (
                        <div className={`${darkMode ? 'text-red-300' : 'text-red-600'} mt-1 break-words`}>- {JSON.stringify(diff.value)}</div>
                      )}
                      {diff.message && <div className={`${darkMode ? 'text-red-300' : 'text-red-600'} mt-1 break-words`}>{diff.message}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mock Data Tab */}
        {activeTab === 'mock' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>JSON Schema</h2>
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className={`w-full h-64 sm:h-80 md:h-96 p-4 border-2 rounded-lg font-mono text-xs sm:text-sm focus:outline-none resize-none ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d] focus:border-amber-400/60'
                    : 'bg-white text-gray-800 border-gray-200 focus:border-blue-400'
                }`}
                placeholder="Enter JSON Schema..."
              />
              <button
                onClick={generateMock}
                className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-300 transition-colors font-medium w-full"
              >
                <Wand2 size={18} />
                Generate Mock Data
              </button>
            </div>
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>Generated Mock Data</h2>
              <textarea
                value={output}
                readOnly
                className={`w-full h-64 sm:h-80 md:h-96 p-4 border-2 rounded-lg font-mono text-xs sm:text-sm resize-none ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d]'
                    : 'bg-gray-50 text-gray-800 border-gray-200'
                }`}
                placeholder="Mock data will appear here..."
              />
              <div className="mt-4">
                <ActionButtons 
                  onCopy={copyToClipboard}
                  onDownload={downloadFile}
                  content={output}
                  filename="mock-data.json"
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Generate Code Tab */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>Input JSON</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full h-48 sm:h-64 md:h-80 p-4 border-2 rounded-lg font-mono text-xs sm:text-sm focus:outline-none resize-none ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d] focus:border-amber-400/60'
                    : 'bg-white text-gray-800 border-gray-200 focus:border-blue-400'
                }`}
                placeholder="Enter JSON to generate interfaces..."
              />
              <div className="mt-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-[#7d8590]' : 'text-gray-600'} mb-3`}>Select Language:</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setCodeLanguage(lang.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        codeLanguage === lang.id
                          ? 'bg-amber-400 text-gray-900'
                          : darkMode
                            ? 'bg-[#21262d] text-[#7d8590] hover:text-[#e6edf3] border border-[#30363d]'
                            : 'bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={generateInterface}
                className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium w-full"
              >
                <Code2 size={18} />
                Generate Code
              </button>
            </div>
            <div className={`${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-4`}>
                Generated <span className={`font-mono text-base ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{codeLanguage}</span>
              </h2>
              <textarea
                value={output}
                readOnly
                className={`w-full h-48 sm:h-64 md:h-80 p-4 border-2 rounded-lg font-mono text-xs sm:text-sm resize-none ${
                  darkMode
                    ? 'bg-[#0d1117] text-[#e6edf3] border-[#30363d]'
                    : 'bg-gray-50 text-gray-800 border-gray-200'
                }`}
                placeholder="Code will appear here..."
              />
              <div className="mt-4">
                <ActionButtons 
                  onCopy={copyToClipboard}
                  onDownload={downloadFile}
                  content={output}
                  filename={`interfaces.${codeLanguage === 'python' ? 'py' : codeLanguage === 'java' ? 'java' : codeLanguage === 'go' ? 'go' : 'ts'}`}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Validation Status Bar */}
        {validation && activeTab !== 'validate' && (
          <div className={`mt-6 ${darkMode ? 'bg-[#161b22] border border-[#30363d]' : 'bg-white border border-gray-200'} rounded-xl p-4`}>
            <div className="flex items-center gap-3">
              {validation.valid ? (
                <CheckCircle className={`${darkMode ? 'text-green-400' : 'text-green-500'} flex-shrink-0`} size={20} />
              ) : (
                <AlertCircle className={`${darkMode ? 'text-red-400' : 'text-red-500'} flex-shrink-0`} size={20} />
              )}
              <span className={`font-medium text-sm break-words ${validation.valid ? (darkMode ? 'text-green-300' : 'text-green-700') : (darkMode ? 'text-red-300' : 'text-red-700')}`}>
                {validation.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTransformer;