# Development Guide - Data Transformer Pro

## 🛠️ Development Setup

### Required Tools
- Node.js 16+ with npm
- Code editor (VS Code recommended)
- Git for version control

### Initial Setup
```bash
npm install
npm run dev
```

## 📁 File Organization

### Components (`src/components/`)
- **DataTransformer.jsx** - Main app component
  - Manages all tabs and state
  - Handles user interactions
  - ~600 lines

- **TreeView.jsx** - Data visualization
  - Recursive rendering
  - Interactive expansion
  - ~80 lines

### Utilities (`src/utils/`)

#### DataUtils.js
Core data transformation logic:
```javascript
// Format conversion (11 functions)
jsonToXml()        // Object → XML string
xmlToJson()        // XML string → Object
jsonToYaml()       // Object → YAML string
yamlToJson()       // YAML string → Object
jsonToCsv()        // Array → CSV string
csvToJson()        // CSV string → Array
parseCSVLine()     // CSV line parser

// Formatting (2 functions)
beautify()         // Pretty-print with indentation
minify()           // Remove whitespace

// Querying (1 function)
queryJsonPath()    // Query using JSONPath notation

// Comparison (1 function)
diffObjects()      // Find differences between objects
```

#### validators.js
Validation functions:
```javascript
validateJson()           // Check JSON syntax
validateXml()            // Check XML syntax
validateYaml()           // Check YAML syntax
validateCsv()            // Check CSV format
validateJsonSchema()     // Validate against schema
```

#### codeGenerators.js
Code generation:
```javascript
generateTypeScript()     // Create TS interfaces
generatePython()         // Create Python classes
generateJava()           // Create Java classes
generateGo()             // Create Go structs
getTypeFromValue()       // Infer type from value
```

## 🔄 Data Flow

### Conversion Flow
```
User Input (textarea)
    ↓
Select Format (buttons)
    ↓
Parse Input (DataUtils)
    ↓
Convert to Target (DataUtils)
    ↓
Display Output (textarea)
    ↓
User sees result
```

### State Management
```javascript
// Main state in DataTransformer.jsx
- input              // Source data
- output             // Result data
- inputFormat        // Source format
- outputFormat       // Target format
- activeTab          // Current tab
- validation         // Validation result
- query              // JSONPath query
- queryResult        // Query result
- compareInput       // Compare data
- diffResult         // Comparison results
- schema             // JSON schema
- codeLanguage       // Selected language
```

## 🎨 Component Structure

### DataTransformer.jsx
```
DataTransformer
├── Header (title, icon, tabs)
├── Tab: Convert
│   ├── InputPane (format selectors, beautify/minify)
│   └── OutputPane (format selectors, copy/download)
├── Tab: Tree View
│   └── TreeView Component
├── Tab: Query
│   ├── QueryInput (path input)
│   └── ResultDisplay
├── Tab: Validate
│   ├── ValidateButton
│   └── StatusMessage
├── Tab: Diff
│   ├── DataPane1 (input)
│   ├── DataPane2 (compareInput)
│   └── DiffResults
├── Tab: Mock Data
│   ├── SchemaInput
│   └── MockOutput
├── Tab: Generate
│   ├── CodeInput
│   ├── LanguageSelector
│   └── CodeOutput
└── StatusBar (validation status)
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Convert JSON → XML → YAML → CSV
- [ ] Validate each format
- [ ] Query nested properties
- [ ] Compare two objects
- [ ] Generate code in all languages
- [ ] Generate mock data
- [ ] Copy/Download functionality

### Test Data
```javascript
// Basic object
{ name: "John", age: 30 }

// Nested structure
{ user: { name: "John", address: { city: "NYC" } } }

// Array
[{ id: 1 }, { id: 2 }]

// Mixed
{ items: [{ name: "A" }, { name: "B" }], count: 2 }
```

## 🚀 Performance Optimization

### Current Implementation
- All processing in client-side
- No external API calls
- Efficient algorithms
- Minimal re-renders

### Potential Improvements
1. Use Web Workers for large files
2. Implement memoization
3. Lazy load components
4. Cache conversion results
5. Optimize regex patterns

## 🐛 Debugging

### Enable Debug Logging
Add to any function:
```javascript
console.log('Debug info:', data);
```

### Browser DevTools
- F12 or Cmd+Option+I
- Console for errors
- Elements for DOM inspection
- Network for requests

### Common Issues

**Issue: State not updating**
- Check useState hooks
- Verify callback functions
- Use React DevTools

**Issue: Format conversion failing**
- Check input validation
- Review error messages
- Test with simple data

**Issue: Performance slow**
- Check console for errors
- Monitor network tab
- Profile with DevTools

## 📦 Adding New Features

### Add New Format (e.g., TOML)

1. **Add converter function in DataUtils.js:**
```javascript
jsonToToml(obj) {
  // Implementation
  return tomlString;
}

tomlToJson(toml) {
  // Implementation
  return obj;
}
```

2. **Add validator in validators.js:**
```javascript
validateToml(text) {
  try {
    // Parse logic
    return { valid: true, message: 'Valid TOML' };
  } catch (e) {
    return { valid: false, message: e.message };
  }
}
```

3. **Update format array:**
```javascript
const formats = [
  { id: 'json', label: 'JSON', icon: FileJson },
  { id: 'xml', label: 'XML', icon: FileCode },
  { id: 'yaml', label: 'YAML', icon: Database },
  { id: 'csv', label: 'CSV', icon: Database },
  { id: 'toml', label: 'TOML', icon: FileCode },  // New
];
```

### Add New Code Generator

1. **Add to CodeGenerators.js:**
```javascript
generateRust(obj, name = 'Root') {
  // Implementation
  return rustCode;
}
```

2. **Add to languages array:**
```javascript
const languages = [
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },  // New
];
```

3. **Update generate function:**
```javascript
} else if (codeLanguage === 'rust') {
  code = CodeGenerators.generateRust(data, 'Root');
}
```

## 📝 Code Style

### Naming Conventions
- Components: PascalCase (TreeView.jsx)
- Functions: camelCase (generateTypeScript)
- Constants: UPPER_SNAKE_CASE (MAX_SIZE)
- Files: kebab-case or PascalCase

### Comments
```javascript
// Single line comments for clarity
/**
 * Multi-line for complex functions
 * @param {type} name - Description
 * @returns {type} Description
 */
```

## 🔐 Security Considerations

- ✅ Input validation on all conversions
- ✅ No eval() or dangerous functions
- ✅ Sanitize XML parsing
- ✅ Handle large files gracefully
- ✅ No external API calls
- ✅ Client-side only processing

## 📊 Performance Metrics

### Current
- Build size: ~250KB
- Load time: <1s
- Conversion time: <100ms for typical data
- Memory usage: ~50MB

### Goals
- Build size: <200KB
- Load time: <500ms
- Conversion time: <50ms
- Memory usage: <30MB

## 🚀 Deployment Checklist

- [ ] Run tests
- [ ] Build passes without errors
- [ ] No console warnings
- [ ] Production build created
- [ ] Environment variables set
- [ ] Source maps disabled
- [ ] Analytics implemented
- [ ] Error tracking set up
- [ ] Performance monitored

## 🔗 Useful Resources

- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

## 📞 Getting Help

- Check README.md for documentation
- Review code comments
- Test with simple data
- Check browser console
- Use debugger in VS Code

## 🎯 Future Enhancements

- [ ] Dark mode theme
- [ ] Keyboard shortcuts
- [ ] Recent files history
- [ ] Batch processing
- [ ] Custom validation rules
- [ ] API documentation
- [ ] GraphQL support
- [ ] Real-time collaboration

---

**Last Updated**: October 2024
**Version**: 1.0.0