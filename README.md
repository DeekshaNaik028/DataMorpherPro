# 🔄 Data Transformer Pro

A powerful, modern web application for converting, validating, and transforming data between multiple formats (JSON, XML, YAML, CSV) with advanced features like tree visualization, JSONPath querying, and code generation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-4.4.0-646cff.svg)

## ✨ Features

### 🔄 Format Conversion
- **JSON** ↔️ **XML** ↔️ **YAML** ↔️ **CSV**
- Automatic format detection from file uploads
- Beautify and minify options
- Real-time conversion as you type

### 🌳 Tree View
- Interactive JSON tree visualization
- Expandable/collapsible nodes
- Color-coded value types
- Easy navigation of complex structures

### 🔍 JSONPath Query
- Test JSONPath expressions
- Support for wildcards (`[*]`)
- Nested property access
- Array indexing

### ✅ Validation
- Format validation for all supported types
- Detailed error messages
- Line-by-line error reporting
- Schema validation support

### 🔄 Diff Tool
- Compare two JSON objects
- Visual diff highlighting
- Shows added, removed, and changed values
- Color-coded differences

### 🎲 Mock Data Generation
- Generate mock data from JSON Schema
- Support for complex nested structures
- Multiple data types (string, number, boolean, array, object)
- Custom format support (email, date, uri)

### 💻 Code Generation
- Generate interfaces/classes from JSON
- **TypeScript** interfaces
- **Python** dataclasses
- **Java** POJOs
- **Go** structs
- Handles nested objects and arrays

### 🎨 Additional Features
- 🌓 **Dark Mode** - Easy on the eyes
- ⌨️ **Keyboard Shortcuts** - Power user friendly
- 📁 **File Upload** - Drag & drop support
- 📋 **Copy/Download** - Export results easily
- 💾 **Auto-save** - Never lose your work
- 📱 **Responsive** - Works on all devices

## 🚀 Demo

**Live Demo**: [https://your-app.vercel.app](https://your-app.vercel.app) *(Update after deployment)*

## 📸 Screenshots

### Convert Tab
![Convert](screenshots/convert.png)

### Tree View
![Tree View](screenshots/tree-view.png)

### Query Tab
![Query](screenshots/query.png)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 4.4
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Data Processing**: 
  - `js-yaml` for YAML parsing
  - `xml2js` for XML conversion
  - Custom parsers for CSV
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/DeekshaNaik028/DataTransformer.git

# Navigate to project directory
cd data-transformer-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔧 Development

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Convert Tab |
| `Ctrl+Q` | Query Tab |
| `Ctrl+D` | Diff Tab |
| `Ctrl+M` | Mock Data Tab |
| `Ctrl+V` | Validate Tab |
| `Ctrl+E` | Tree View Tab |
| `Ctrl+G` | Generate Code Tab |

*Use `Cmd` instead of `Ctrl` on Mac*

## 📖 Usage Examples

### 1. Convert JSON to XML
```javascript
// Input (JSON)
{
  "name": "John",
  "age": 30
}

// Output (XML)
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>John</name>
  <age>30</age>
</root>
```

### 2. JSONPath Query
```javascript
// Data
{
  "users": [
    { "name": "Alice", "age": 28 },
    { "name": "Bob", "age": 32 }
  ]
}

// Query: $.users[*].name
// Result: ["Alice", "Bob"]
```

### 3. Generate TypeScript Interface
```javascript
// Input
{
  "id": 1,
  "name": "Product",
  "price": 99.99
}

// Output
interface Root {
  id: number;
  name: string;
  price: number;
}
```

## 🧪 Testing

### Manual Testing
1. Open the app
2. Try different conversions
3. Test query functionality
4. Validate different formats
5. Generate code in all languages

### Test Data
The app includes sample data for testing. See [Query Test Guide](QUERY_EXAMPLES.md) for comprehensive examples.

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or use the [Vercel Dashboard](https://vercel.com):
1. Import GitHub repository
2. Vercel auto-detects Vite
3. Click Deploy 🚀

See [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
data-transformer-pro/
├── src/
│   ├── components/
│   │   ├── DataTransformer.jsx    # Main component
│   │   ├── TreeView.jsx            # Tree visualization
│   │   ├── ThemeToggle.jsx         # Dark mode toggle
│   │   └── KeyboardShortcuts.jsx   # Shortcuts handler
│   ├── utils/
│   │   ├── DataUtils.js            # Conversion logic
│   │   ├── validators.js           # Validation logic
│   │   └── codeGenerators.js       # Code generation
│   ├── styles/
│   │   └── globals.css             # Global styles
│   ├── App.jsx                     # Root component
│   └── index.jsx                   # Entry point
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Known Issues

- Large files (>10MB) may cause performance issues
- CSV conversion works best with flat structures
- Some complex XML structures may not convert perfectly

## 🗺️ Roadmap

- [ ] Add GraphQL support
- [ ] Implement custom transformation rules
- [ ] Add batch file processing
- [ ] Support more programming languages (Rust, C#)
- [ ] Add data visualization charts
- [ ] Implement data filtering options
- [ ] Add export templates
- [ ] Support for Protocol Buffers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Deeksha Naik**
- GitHub: [@DeekshaNaik028](https://github.com/DeekshaNaik028)
- Repository: [DataTransformer](https://github.com/DeekshaNaik028/DataTransformer)

## 🙏 Acknowledgments

- [React](https://react.dev) - UI Framework
- [Vite](https://vitejs.dev) - Build Tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide](https://lucide.dev) - Icons
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML Parser
- [Vercel](https://vercel.com) - Hosting

## 📞 Support

If you have any questions or need help:
- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/DeekshaNaik028/DataTransformer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/DeekshaNaik028/DataTransformer/discussions)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by Deeksha Naik**