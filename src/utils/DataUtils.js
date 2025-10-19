export const DataUtils = {
  // ========== JSON TO OTHER FORMATS ==========
  
  jsonToXml(obj, rootName = 'root') {
    const convert = (o, name) => {
      if (Array.isArray(o)) {
        return o.map((item, i) => convert(item, name.replace(/s$/, ''))).join('');
      }
      if (typeof o === 'object' && o !== null) {
        const entries = Object.entries(o);
        return `<${name}>${entries.map(([k, v]) => convert(v, k)).join('')}</${name}>`;
      }
      return `<${name}>${String(o).replace(/[<>&]/g, c => ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;'
      }[c]))}</${name}>`;
    };
    return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(obj, rootName)}`;
  },

  jsonToYaml(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    
    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          const itemYaml = this.jsonToYaml(item, indent + 1);
          return `${spaces}- ${itemYaml}`;
        }
        return `${spaces}- ${item}`;
      }).join('\n');
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).map(([key, value]) => {
        if (value === null) {
          return `${spaces}${key}:`;
        }
        if (typeof value === 'object') {
          return `${spaces}${key}:\n${this.jsonToYaml(value, indent + 1)}`;
        }
        if (typeof value === 'string' && value.includes('\n')) {
          return `${spaces}${key}: |\n${value.split('\n').map(l => `${spaces}  ${l}`).join('\n')}`;
        }
        return `${spaces}${key}: ${value}`;
      }).join('\n');
    }
    
    return `${spaces}${obj}`;
  },

  jsonToCsv(data) {
    const array = Array.isArray(data) ? data : [data];
    if (array.length === 0) return '';
    
    const headers = Object.keys(array[0]);
    const escapeCSV = (val) => {
      if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return String(val);
    };
    
    const csv = [
      headers.join(','),
      ...array.map(row => 
        headers.map(h => escapeCSV(row[h] || '')).join(',')
      )
    ];
    return csv.join('\n');
  },

  // ========== XML TO JSON ==========
  
  xmlToJson(xml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
      if (doc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML');
      }
      
      const convert = (node) => {
        if (node.nodeType === 3) return node.nodeValue.trim();
        
        const obj = {};
        
        if (node.attributes?.length > 0) {
          obj['@attributes'] = {};
          for (let attr of node.attributes) {
            obj['@attributes'][attr.name] = attr.value;
          }
        }
        
        if (node.hasChildNodes()) {
          for (let child of node.childNodes) {
            if (child.nodeType === 3) {
              const text = child.nodeValue.trim();
              if (text) return text;
            } else {
              const name = child.nodeName;
              const value = convert(child);
              if (obj[name]) {
                if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
                obj[name].push(value);
              } else {
                obj[name] = value;
              }
            }
          }
        }
        return obj;
      };
      
      return convert(doc.documentElement);
    } catch (e) {
      throw new Error(`XML Parse Error: ${e.message}`);
    }
  },

  // ========== YAML TO JSON ==========
  
  yamlToJson(yaml) {
    const lines = yaml.split('\n');
    const result = {};
    const stack = [{ obj: result, indent: -1, isArray: false }];
    
    for (const line of lines) {
      if (line.trim() === '' || line.trim().startsWith('#')) continue;
      
      const indent = line.search(/\S/);
      const trimmed = line.trim();
      
      // Pop stack until we find the right indent level
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1];
      
      if (trimmed.startsWith('-')) {
        // Array item
        const value = trimmed.slice(1).trim();
        if (!Array.isArray(parent.obj)) {
          const arr = [];
          const key = Object.keys(parent.obj).pop();
          if (key) parent.obj[key] = arr;
          parent.obj = arr;
        }
        if (value) {
          parent.obj.push(value);
        }
      } else if (trimmed.includes(':')) {
        const colonIdx = trimmed.indexOf(':');
        const key = trimmed.substring(0, colonIdx).trim();
        const value = trimmed.substring(colonIdx + 1).trim();
        
        if (value) {
          parent.obj[key] = value;
        } else {
          parent.obj[key] = {};
          stack.push({ obj: parent.obj[key], indent, isArray: false });
        }
      }
    }
    
    return result;
  },

  // ========== CSV TO JSON ==========
  
  csvToJson(csv) {
    const lines = csv.split('\n').filter(l => l.trim());
    if (lines.length === 0) return [];
    
    // Parse CSV header
    const headers = this.parseCSVLine(lines[0]);
    
    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] || '';
      });
      return obj;
    });
  },

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  },

  // ========== FORMAT & BEAUTIFY ==========
  
  beautify(text, format) {
    try {
      if (format === 'json') {
        return JSON.stringify(JSON.parse(text), null, 2);
      }
      if (format === 'xml') {
        let formatted = text.replace(/></g, '>\n<');
        formatted = formatted.replace(/^\s+/gm, (match) => {
          const level = Math.floor(match.length / 2);
          return '  '.repeat(level);
        });
        return formatted;
      }
      return text;
    } catch (e) {
      return text;
    }
  },

  minify(text, format) {
    try {
      if (format === 'json') {
        return JSON.stringify(JSON.parse(text));
      }
      if (format === 'xml') {
        return text.replace(/>\s+</g, '><').trim();
      }
      return text;
    } catch (e) {
      return text;
    }
  },

  // ========== QUERY ==========
  
  queryJsonPath(data, path) {
  try {
    if (!data) return null;
    
    let cleanPath = path.trim();
    cleanPath = cleanPath.replace(/^\$\.?/, '');
    
    if (!cleanPath) return data;
    
    const parts = [];
    let current = '';
    let inBracket = false;
    
    for (let char of cleanPath) {
      if (char === '[') {
        if (current) parts.push(current);
        current = '';
        inBracket = true;
        parts.push('[');
      } else if (char === ']') {
        if (inBracket) {
          parts[parts.length - 1] += current;
          parts[parts.length - 1] += ']';
          current = '';
          inBracket = false;
        }
      } else if (char === '.' && !inBracket) {
        if (current) parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    if (current) parts.push(current);
    
    let result = data;
    
    for (let part of parts) {
      if (!result) return null;
      
      if (part.includes('[')) {
        const match = part.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const key = match[1];
          const index = parseInt(match[2]);
          result = result[key]?.[index];
        } else {
          result = result[part];
        }
      } else {
        result = result[part];
      }
    }
    
    return result;
  } catch (e) {
    console.error('Query error:', e);
    return null;
  }
},
  // ========== DIFF ==========
  
  diffObjects(obj1, obj2, path = '') {
    const diffs = [];
    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
    
    keys.forEach(key => {
      const fullPath = path ? `${path}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];
      
      if (!(key in (obj1 || {}))) {
        diffs.push({ type: 'added', path: fullPath, value: val2 });
      } else if (!(key in (obj2 || {}))) {
        diffs.push({ type: 'removed', path: fullPath, value: val1 });
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
          diffs.push(...this.diffObjects(val1, val2, fullPath));
        } else {
          diffs.push({ type: 'changed', path: fullPath, old: val1, new: val2 });
        }
      }
    });
    
    return diffs;
  },
  generateMockData(schema) {
  const generate = (s) => {
    if (!s) return null;
    
    if (Array.isArray(s.type)) {
      return generate({ ...s, type: s.type[0] });
    }
    
    switch (s.type) {
      case 'object':
        const obj = {};
        if (s.properties) {
          Object.entries(s.properties).forEach(([key, prop]) => {
            obj[key] = generate(prop);
          });
        }
        return obj;
      
      case 'array':
        const items = s.items || { type: 'string' };
        const arrayLength = s.minItems || 3;
        return Array(arrayLength).fill(null).map(() => generate(items));
      
      case 'string':
        if (s.enum) return s.enum[0];
        if (s.example) return s.example;
        if (s.format === 'email') return 'user@example.com';
        if (s.format === 'date') return new Date().toISOString().split('T')[0];
        if (s.format === 'uri') return 'https://example.com';
        return 'sample text';
      
      case 'number':
      case 'integer':
        if (s.enum) return s.enum[0];
        if (s.example !== undefined) return s.example;
        if (s.minimum !== undefined) return s.minimum;
        return 42;
      
      case 'boolean':
        return true;
      
      case 'null':
        return null;
      
      default:
        return null;
    }
  };
  
  return generate(schema);
}
};

export default DataUtils;
