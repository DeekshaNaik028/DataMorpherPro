# 🔄 Data Morpher Pro

A powerful, modern web application for converting, validating, and morphing data between multiple formats (JSON, XML, YAML, CSV) with advanced features like tree visualization, JSONPath querying, and code generation.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://datamorpherpro.site)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-4.4.0-646cff.svg)

## 🌐 Live Demo

**Current URL**: [https://data-transformer-pro-p9ps.vercel.app](https://data-transformer-pro-p9ps.vercel.app)  
**Custom Domain**: `datamorpherpro.site` *(Coming Soon)*

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
- Array indexing and filtering

### ✅ Validation
- Format validation for all supported types
- Detailed error messages with line numbers
- Real-time syntax checking
- Schema validation support

### 🔄 Diff Tool
- Compare two JSON objects side-by-side
- Visual diff highlighting
- Shows added, removed, and changed values
- Color-coded differences for easy scanning

### 🎲 Mock Data Generation
- Generate realistic mock data from JSON Schema
- Support for complex nested structures
- Multiple data types (string, number, boolean, array, object)
- Custom format support (email, date, uri, date-time)

### 💻 Code Generation
- Generate interfaces/classes from JSON
- **TypeScript** interfaces with proper typing
- **Python** dataclasses
- **Java** POJOs with getters/setters
- **Go** structs with JSON tags
- Handles nested objects and arrays

### 🎨 User Experience
- 🌓 **Dark Mode** - Easy on the eyes with persistent theme
- ⌨️ **Keyboard Shortcuts** - Power user friendly (Ctrl+K, Ctrl+Q, etc.)
- 📁 **File Upload** - Support for .json, .xml, .yaml, .csv files
- 📋 **Copy/Download** - Export results with one click
- 📱 **Fully Responsive** - Perfect experience on mobile, tablet, and desktop
- 🎯 **Intuitive UI** - Clean, modern interface with helpful tooltips

## 📸 Screenshots

### Desktop View
![Desktop](screenshots/desktop.png)

### Mobile View
![Mobile](screenshots/mobile.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 4.4
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Data Processing**: 
  - `js-yaml` for YAML parsing
  - `xml2js` for XML conversion
  - Custom CSV parser
- **Deployment**: Vercel
- **Domain**: [datamorpherpro.site](https://datamorpherpro.site)

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/DeekshaNaik028/DataTransformerPro.git

# Navigate to project directory
cd data-morpher-pro

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
| `Ctrl+B` | Validate Tab |
| `Ctrl+E` | Tree View Tab |
| `Ctrl+G` | Generate Code Tab |

*Use `Cmd` instead of `Ctrl` on Mac*

## 📖 Usage Examples

### 1. Convert JSON to XML
```javascript
// Input (JSON)
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
}

// Output (XML)
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>John Doe</name>
  <age>30</age>
  <email>john@example.com</email>
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
  "price": 99.99,
  "inStock": true
}

// Output
interface Root {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}
```

### 4. Compare Objects (Diff)
```javascript
// Object 1
{ "name": "John", "age": 30 }

// Object 2
{ "name": "John", "age": 31, "city": "NYC" }

// Result shows:
// - Changed: age (30 → 31)
// - Added: city ("NYC")
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Convert between all format combinations
- [ ] Upload files of different formats
- [ ] Test JSONPath queries with complex data
- [ ] Validate syntax for all formats
- [ ] Compare two JSON objects
- [ ] Generate mock data from schema
- [ ] Generate code in all languages
- [ ] Test dark mode toggle
- [ ] Test all keyboard shortcuts
- [ ] Test on mobile devices

### Test JSONPath Queries
```javascript
$.name                    // Basic property
$.address.city            // Nested property
$.skills[0]              // Array by index
$.projects[*].title      // Wildcard selection
$.projects[0].tech[1]    // Deep nested access
```

## 🌐 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Or use the [Vercel Dashboard](https://vercel.com):
1. Import your GitHub repository
2. Vercel auto-detects Vite configuration
3. Click **Deploy**
4. Add custom domain: `datamorpherpro.site`

### Custom Domain Setup
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `datamorpherpro.site` and `www.datamorpherpro.site`
3. Update DNS records as instructed by Vercel
4. SSL certificate is automatically provisioned

## 📁 Project Structure

```
data-morpher-pro/
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
- Follow existing code style and conventions
- Write descriptive commit messages
- Test your changes thoroughly on multiple devices
- Update documentation as needed
- Ensure mobile responsiveness

## 🐛 Known Issues

- Large files (>10MB) may cause performance slowdown
- CSV conversion works best with flat data structures
- Some complex XML structures with attributes may not convert perfectly
- Safari may require hard refresh for theme persistence

## 🗺️ Roadmap

### Planned Features
- [ ] GraphQL support
- [ ] Custom transformation rules/templates
- [ ] Batch file processing
- [ ] More programming languages (Rust, C#, Swift)
- [ ] Data visualization with charts
- [ ] Advanced filtering options
- [ ] Export templates library
- [ ] Protocol Buffers support
- [ ] API endpoint for programmatic access
- [ ] Browser extension

### In Progress
- [x] Mobile responsiveness improvements
- [x] Custom domain setup
- [x] Performance optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Deeksha Naik**
- GitHub: [@DeekshaNaik028](https://github.com/DeekshaNaik028)
- Repository: [DataTransformerPro](https://github.com/DeekshaNaik028/DataTransformerPro)
- Website: [datamorpherpro.site](https://datamorpherpro.site)

## 🙏 Acknowledgments

- [React](https://react.dev) - UI Framework
- [Vite](https://vitejs.dev) - Build Tool
- [Tailwind CSS](https://tailwindcss.com) - Styling Framework
- [Lucide](https://lucide.dev) - Beautiful Icons
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML Parser
- [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) - XML Parser
- [Vercel](https://vercel.com) - Hosting Platform

## 📊 Stats

- **Lines of Code**: ~3,500+
- **Components**: 7 major features
- **Supported Formats**: 4 (JSON, XML, YAML, CSV)
- **Code Generation Languages**: 4 (TypeScript, Python, Java, Go)
- **Build Size**: ~250KB (gzipped)
- **Performance Score**: 95+ (Lighthouse)

## 📞 Support

If you have any questions or need help:

- 🐛 **Issues**: [GitHub Issues](https://github.com/DeekshaNaik028/DataTransformerPro/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/DeekshaNaik028/DataTransformerPro/discussions)
- 📧 **Email**: Contact via GitHub profile
- 🌐 **Website**: [datamorpherpro.site](https://datamorpherpro.site)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

[![Star History Chart](https://api.star-history.com/svg?repos=DeekshaNaik028/DataTransformerPro&type=Date)](https://star-history.com/#DeekshaNaik028/DataTransformerPro&Date)

## 🔗 Links

- **Live Demo**: [datamorpherpro.site](https://datamorpherpro.site)
- **GitHub Repository**: [DataTransformerPro](https://github.com/DeekshaNaik028/DataTransformerPro)
- **Documentation**: Coming soon
- **API Docs**: Coming soon

---

<div align="center">
  <strong>Transform your data with ease! 🚀</strong>
  <br />
  <sub>Built with ❤️ by <a href="https://github.com/DeekshaNaik028">Deeksha Naik</a></sub>
</div>