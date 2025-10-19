# Data Transformer Pro 🚀

A powerful, full-featured data transformation tool that converts between JSON, XML, YAML, and CSV formats with advanced features like data validation, querying, comparison, code generation, and mock data generation.

## ✨ Features

### 1. **Multi-Format Conversion**
- 🔄 Convert between JSON, XML, YAML, and CSV
- 📊 Bidirectional conversion support
- ⚡ Real-time conversion with instant feedback
- 🎨 Beautiful, syntax-aware formatting

### 2. **Visual Data Tree View**
- 📁 Interactive collapsible tree structure
- 🌳 Color-coded by data type
- 🔍 Full path display for navigation
- ✨ Smooth expand/collapse animations

### 3. **Advanced Querying**
- 🔎 JSONPath query tester
- 📍 Real-time query execution
- 🎯 Support for nested paths and array indices
- 💬 Live result preview

### 4. **Data Validation**
- ✅ JSON, XML, YAML, and CSV validation
- 🐛 Detailed error messages
- 📋 Format-specific validation rules
- 🎨 Visual feedback (success/error)

### 5. **Data Comparison (Diff Tool)**
- 📊 Side-by-side data comparison
- 🎨 Color-coded differences:
  - 🟢 Green: Added fields
  - 🔴 Red: Removed fields
  - 🟡 Yellow: Modified fields
- 🔄 Nested object comparison
- 📈 Detailed change tracking

### 6. **Mock Data Generation**
- 🎲 Generate test data from JSON Schema
- 🧬 Support for all data types
- 🔁 Array generation
- 📦 Nested object support

### 7. **Code Generation**
- 📝 TypeScript interface generation
- 🐍 Python class generation
- ☕ Java class generation
- 🔷 Go struct generation
- 🔍 Automatic type inference

### 8. **Additional Features**
- 💾 Beautify/Minify formatting
- 📋 One-click copy to clipboard
- ⬇️ Download files directly
- 🎯 Format indicators
- 📍 Status messages

## 🛠️ Tech Stack

- **React** - UI library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool
- **JavaScript/ES6** - Core logic

## 📦 Project Structure

```
data-transformer-pro/
├── src/
│   ├── components/
│   │   ├── DataTransformer.jsx      # Main component
│   │   └── TreeView.jsx              # Tree view component
│   ├── utils/
│   │   ├── DataUtils.js              # Format converters
│   │   ├── validators.js             # Validation logic
│   │   └── codeGenerators.js         # Code generation
│   ├── styles/
│   │   └── globals.css               # Global styles
│   ├── App.jsx                       # Root component
│   └── index.jsx                     # Entry point
├── public/
│   └── index.html                    # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind configuration
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/data-transformer-pro.git
cd data-transformer-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 📖 Usage Examples

### Converting JSON to XML
1. Click the "Convert" tab
2. Select "JSON" as input format
3. Paste your JSON data
4. Select "XML" as output format
5. Click "Beautify" if needed
6. Copy or download the result

### Querying Data
1. Go to "Query" tab
2. Ensure input is valid JSON
3. Enter JSONPath expression:
   - `$.name` - Get name property
   - `$.users[0]` - Get first user
   - `$.address.city` - Nested property
4. Click "Execute"
5. View results

### Generating Type
