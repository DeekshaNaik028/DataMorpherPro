import React, { useState, useEffect } from 'react';
import {
  FileJson, FileCode, Database, GitCompare, Sparkles,
  Eye, Code2, CheckCircle, AlertCircle, Copy, Download,
  Settings, Wand2, RotateCw, Upload
} from 'lucide-react';
import { useTheme, ThemeToggle } from './ThemeToggle';
import { useKeyboardShortcuts, KeyboardShortcutsButton } from './KeyboardShortcuts';
import TreeView from './TreeView';
import DataUtils from '../utils/DataUtils';
import Validators from '../utils/validators';
import CodeGenerators from '../utils/codeGenerators';

const DataTransformer = () => {
  const [input, setInput] = useState(JSON.stringify({
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    skills: ["JavaScript", "React", "Node.js"],
    address: {
      city: "New York",
      zip: "10001"
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
  // Dark mode from separate component
  const [darkMode, setDarkMode] = useTheme();

  // Keyboard shortcuts from separate component
  useKeyboardShortcuts(setActiveTab);
  const formats = [
    { id: 'json', label: 'JSON', icon: FileJson },
    { id: 'xml', label: 'XML', icon: FileCode },
    { id: 'yaml', label: 'YAML', icon: Database },
    { id: 'csv', label: 'CSV', icon: Database }
  ];

  const languages = [
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'go', label: 'Go' }
  ];

  const convert = async () => {
    try {
      let data;

      // Parse input based on format
      if (inputFormat === 'json') {
        data = JSON.parse(input);
      } else if (inputFormat === 'xml') {
        data = await DataUtils.xmlToJson(input);
      } else if (inputFormat === 'yaml') {
        data = DataUtils.yamlToJson(input);
      } else if (inputFormat === 'csv') {
        data = DataUtils.csvToJson(input);
      }

      // Convert to output format
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
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    convert();
  }, [inputFormat, outputFormat]);

  return (
    <div className={`min-h-screen p-6 transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        className={`${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'} rounded-xl shadow-lg p-6`}
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileJson className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                Data Transformer Pro
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Convert, validate, and transform data between formats</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            <KeyboardShortcutsButton darkMode={darkMode} />
          </div>
        </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'convert', label: 'Convert', icon: FileJson },
              { id: 'tree', label: 'Tree View', icon: Eye },
              { id: 'query', label: 'Query', icon: Code2 },
              { id: 'validate', label: 'Validate', icon: CheckCircle },
              { id: 'diff', label: 'Diff', icon: GitCompare },
              { id: 'mock', label: 'Mock Data', icon: Sparkles },
              { id: 'generate', label: 'Generate Code', icon: Code2 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Convert Tab */}
        {activeTab === 'convert' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Input</h2>
                <div className="flex gap-2 flex-wrap">
                  {formats.map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => setInputFormat(fmt.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-all ${
                        inputFormat === fmt.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <fmt.icon size={14} />
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="Enter your data here..."
              />
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => setInput(DataUtils.beautify(input, inputFormat))}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Beautify
                </button>
                <button
                  onClick={() => setInput(DataUtils.minify(input, inputFormat))}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Minify
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Output</h2>
                <div className="flex gap-2 flex-wrap">
                  {formats.map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => setOutputFormat(fmt.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-all ${
                        outputFormat === fmt.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <fmt.icon size={14} />
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none"
                placeholder="Converted output will appear here..."
              />
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => copyToClipboard(output)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={() => downloadFile(output, `output.${outputFormat}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tree View Tab */}
        {activeTab === 'tree' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Data Tree View</h2>
            <div className="border-2 border-gray-200 rounded-lg p-4 max-h-[600px] overflow-auto bg-gray-50">
              {(() => {
                try {
                  const data = JSON.parse(input);
                  return <TreeView data={data} />;
                } catch (e) {
                  return <div className="text-red-500 font-mono text-sm">Invalid JSON: {e.message}</div>;
                }
              })()}
            </div>
          </div>
        )}

        {/* Query Tab */}
        {activeTab === 'query' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">JSONPath Query Tester</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">JSONPath Expression</label>
              <p className="text-xs text-gray-500 mb-3">Examples: $.name, $.skills[0], $.address.city, $.users[*].id</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
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
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-3">Result:</h3>
              <pre className="bg-white p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono border border-gray-200">
                {queryResult || 'No result yet...'}
              </pre>
            </div>
          </div>
        )}

        {/* Validate Tab */}
        {activeTab === 'validate' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Data Validation</h2>
            <button
              onClick={validateInput}
              className="mb-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Validate {inputFormat.toUpperCase()}
            </button>
            {validation && (
              <div className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                validation.valid
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                {validation.valid ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={28} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0" size={28} />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${validation.valid ? 'text-green-800' : 'text-red-800'}`}>
                    {validation.valid ? '✓ Valid' : '✗ Invalid'}
                  </h3>
                  <p className={`mt-1 ${validation.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {validation.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diff Tab */}
        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Data 1 (Original)</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="Enter first JSON object..."
              />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Data 2 (Updated)</h2>
              <textarea
                value={compareInput}
                onChange={(e) => setCompareInput(e.target.value)}
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="Enter second JSON object..."
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Differences</h2>
                <button
                  onClick={compareData}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Compare
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-auto">
                {diffResult.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No differences found or click Compare</div>
                ) : (
                  diffResult.map((diff, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border-l-4 font-mono text-sm ${
                        diff.type === 'added'
                          ? 'bg-green-50 border-green-500 text-green-800'
                          : diff.type === 'removed'
                          ? 'bg-red-50 border-red-500 text-red-800'
                          : diff.type === 'changed'
                          ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                          : 'bg-gray-50 border-gray-500 text-gray-800'
                      }`}
                    >
                      <div className="font-bold">{diff.path || 'Error'}</div>
                      {diff.type === 'changed' && (
                        <>
                          <div className="text-red-600 mt-1">- {JSON.stringify(diff.old)}</div>
                          <div className="text-green-600">+ {JSON.stringify(diff.new)}</div>
                        </>
                      )}
                      {diff.type === 'added' && (
                        <div className="text-green-600 mt-1">+ {JSON.stringify(diff.value)}</div>
                      )}
                      {diff.type === 'removed' && (
                        <div className="text-red-600 mt-1">- {JSON.stringify(diff.value)}</div>
                      )}
                      {diff.message && <div className="text-red-600 mt-1">{diff.message}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mock Data Tab */}
        {activeTab === 'mock' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">JSON Schema</h2>
              <p className="text-xs text-gray-500 mb-3">Define your schema with type, properties, and format</p>
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="Enter JSON Schema..."
              />
              <button
                onClick={generateMock}
                className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors font-medium w-full justify-center"
              >
                <Wand2 size={18} />
                Generate Mock Data
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Mock Data</h2>
              <textarea
                value={output}
                readOnly
                className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none"
                placeholder="Mock data will appear here..."
              />
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => copyToClipboard(output)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={() => downloadFile(output, 'mock-data.json')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generate Code Tab */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Input JSON</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-80 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="Enter JSON to generate interfaces..."
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
                <div className="flex gap-2 flex-wrap">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setCodeLanguage(lang.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        codeLanguage === lang.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={generateInterface}
                className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium w-full justify-center"
              >
                <Code2 size={18} />
                Generate Code
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Code ({codeLanguage})</h2>
              <textarea
                value={output}
                readOnly
                className="w-full h-80 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-none"
                placeholder="Code will appear here..."
              />
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => copyToClipboard(output)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={() => downloadFile(output, `interfaces.${codeLanguage === 'python' ? 'py' : codeLanguage === 'java' ? 'java' : codeLanguage === 'go' ? 'go' : 'ts'}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Status Bar */}
        {validation && activeTab !== 'validate' && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              {validation.valid ? (
                <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              ) : (
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              )}
              <span className={`font-medium ${validation.valid ? 'text-green-700' : 'text-red-700'}`}>
                {validation.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const handleFileUpload = (event, setInput, setInputFormat) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      setInput(content);

      // Detect format from file extension
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

      alert(`✅ File loaded: ${file.name}`);
    } catch (error) {
      alert(`❌ Error reading file: ${error.message}`);
    }
  };

  reader.onerror = () => {
    alert('❌ Error reading file');
  };

  reader.readAsText(file);
};

// File Download Handler
const downloadFile = (content, filename) => {
  if (!content) {
    alert('❌ No content to download');
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

// JSX Components for File Upload/Download UI

// Upload Button Component
export const FileUploadButton = ({ onUpload }) => {
  const fileInputRef = React.useRef(null);

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
      >
        <Upload size={16} />
        Upload File
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

// Download Button Component
export const FileDownloadButton = ({ content, filename = 'output.txt' }) => {
  return (
    <button
      onClick={() => downloadFile(content, filename)}
      disabled={!content}
      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors text-sm font-medium"
    >
      <Download size={16} />
      Download
    </button>
  );
};

// Quick Copy Button (Enhanced)
export const QuickCopyButton = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {copied ? (
        <>
          <Check size={16} />
          Copied!
        </>
      ) : (
        <>
          <Copy size={16} />
          Copy
        </>
      )}
    </button>
  );
};
export default DataTransformer;