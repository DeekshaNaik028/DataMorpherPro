import * as YAML from 'js-yaml';

export const DataUtils = {
  // ========== JSON TO XML ==========
  
  jsonToXml(obj, rootName = 'root') {
    const escapeXml = (str) => {
      if (typeof str !== 'string') str = String(str);
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const convert = (o, name) => {
      if (Array.isArray(o)) {
        return o.map((item) => convert(item, name.replace(/s$/, ''))).join('');
      }
      if (typeof o === 'object' && o !== null) {
        const entries = Object.entries(o);
        return `<${name}>${entries.map(([k, v]) => convert(v, k)).join('')}</${name}>`;
      }
      return `<${name}>${escapeXml(o)}</${name}>`;
    };
    
    return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(obj, rootName)}`;
  },

  // ========== JSON TO YAML ==========
  
  jsonToYaml(obj) {
    try {
      return YAML.dump(obj, {
        indent: 2,
        lineWidth: -1,
        noRefs: true
      });
    } catch (e) {
      throw new Error(`YAML conversion error: ${e.message}`);
    }
  },

  // ========== JSON TO CSV ==========
  
  jsonToCsv(data) {
    // If data is not an array, convert to array
    let array = Array.isArray(data) ? data : [data];
    
    // For arrays of objects, flatten if they have nested objects/arrays
    const isFlat = array.every(item => 
      Object.values(item).every(val => 
        typeof val !== 'object' || val === null
      )
    );
    
    if (!isFlat) {
      // If data has nested arrays of objects, extract them
      let flatArray = [];
      let arrayKey = null;
      
      for (const item of array) {
        for (const [key, value] of Object.entries(item)) {
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            arrayKey = key;
            flatArray = value;
            break;
          }
        }
        if (arrayKey) break;
      }
      
      if (arrayKey && flatArray.length > 0) {
        array = flatArray;
      }
    }
    
    if (array.length === 0) return '';
    
    // Extract all possible headers from all objects
    const headers = [...new Set(array.flatMap(item => Object.keys(item)))];
    
    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const csv = [
      headers.join(','),
      ...array.map(row => 
        headers.map(h => escapeCSV(row[h])).join(',')
      )
    ];
    return csv.join('\n');
  },

  // ========== XML TO JSON ==========
  
  xmlToJsonSync(xml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
      if (doc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML');
      }
      
      const convert = (node) => {
        if (node.nodeType === 3) {
          const text = node.nodeValue.trim();
          return text || null;
        }
        
        const obj = {};
        
        // Handle attributes
        if (node.attributes?.length > 0) {
          for (let attr of node.attributes) {
            obj[attr.name] = attr.value;
          }
        }
        
        // Handle children
        const children = {};
        if (node.hasChildNodes()) {
          for (let child of node.childNodes) {
            if (child.nodeType === 3) {
              const text = child.nodeValue.trim();
              if (text && !obj['#text']) obj['#text'] = text;
            } else if (child.nodeType === 1) {
              const name = child.nodeName;
              const value = convert(child);
              
              if (children[name]) {
                if (!Array.isArray(children[name])) {
                  children[name] = [children[name]];
                }
                children[name].push(value);
              } else {
                children[name] = value;
              }
            }
          }
        }
        
        return { ...obj, ...children };
      };
      
      return convert(doc.documentElement);
    } catch (e) {
      throw new Error(`XML Parse Error: ${e.message}`);
    }
  },

  // Async version - for compatibility
  async xmlToJson(xml) {
    return this.xmlToJsonSync(xml);
  },

  // ========== YAML TO JSON ==========
  
  yamlToJson(yaml) {
    try {
      const result = YAML.load(yaml);
      return result || {};
    } catch (e) {
      throw new Error(`YAML Parse Error: ${e.message}`);
    }
  },

  // ========== CSV TO JSON ==========
  
  csvToJson(csv) {
    try {
      const lines = csv.split('\n').filter(l => l.trim());
      if (lines.length === 0) return [];
      
      const headers = this.parseCSVLine(lines[0]);
      
      return lines.slice(1).map(line => {
        const values = this.parseCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => {
          obj[h.trim()] = values[i] || '';
        });
        return obj;
      });
    } catch (e) {
      throw new Error(`CSV Parse Error: ${e.message}`);
    }
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
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  },

  // ========== FORMAT & BEAUTIFY ==========
  
  beautify(text, format) {
    try {
      if (format === 'json') {
        return JSON.stringify(JSON.parse(text), null, 2);
      }
      if (format === 'xml') {
        return text
          .replace(/></g, '>\n<')
          .replace(/^(<[^?])/m, '<?xml version="1.0" encoding="UTF-8"?>\n$1');
      }
      if (format === 'yaml') {
        return YAML.dump(YAML.load(text), { indent: 2 });
      }
      if (format === 'csv') {
        return text;
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
        return text.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
      }
      if (format === 'yaml') {
        return YAML.dump(YAML.load(text), { indent: 2 });
      }
      return text;
    } catch (e) {
      return text;
    }
  },

  // ========== QUERY - JSONPath ==========
  
  queryJsonPath(data, path) {
  try {
    if (!data) return null;
    
    let cleanPath = path.trim();
    cleanPath = cleanPath.replace(/^\$\.?/, '');
    
    if (!cleanPath) return data;
    
    const parts = [];
    let current = '';
    let inBracket = false;
    
    for (let i = 0; i < cleanPath.length; i++) {
      const char = cleanPath[i];
      
      if (char === '[') {
        if (current) {
          parts.push(current);
          current = '';
        }
        inBracket = true;
      } else if (char === ']') {
        inBracket = false;
        parts.push(`[${current}]`);
        current = '';
      } else if (char === '.' && !inBracket) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current) {
      parts.push(current);
    }
    
    let result = data;
    let i = 0;
    
    while (i < parts.length && result !== null && result !== undefined) {
      const part = parts[i];
      
      if (part.startsWith('[')) {
        const indexMatch = part.match(/^\[(\d+|\*)\]$/);
        if (indexMatch) {
          const indexStr = indexMatch[1];
          
          if (!Array.isArray(result)) {
            return null;
          }
          
          if (indexStr === '*') {
            let allItems = result;
            i++;
            if (i < parts.length) {
              const remainingPath = parts.slice(i).join('.');
              const extracted = allItems.map(item => {
                return this.queryJsonPath(item, '$.' + remainingPath);
              });
              return extracted.filter(e => e !== null);
            } else {
              return allItems;
            }
          } else {
            const index = parseInt(indexStr);
            result = result[index];
            i++;
          }
        } else {
          return null;
        }
      } else {
        result = result[part];
        i++;
      }
    }
    
    return result;
  } catch (e) {
    throw new Error(`Query Error: ${e.message}`);
  }
},
  // ========== DIFF - Compare Objects ==========
  
  diffObjects(obj1, obj2, path = '') {
    const diffs = [];
    const keys = new Set([
      ...Object.keys(obj1 || {}), 
      ...Object.keys(obj2 || {})
    ]);
    
    keys.forEach(key => {
      const fullPath = path ? `${path}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];
      
      // Key only in obj2
      if (!(key in (obj1 || {}))) {
        diffs.push({ 
          type: 'added', 
          path: fullPath, 
          value: val2 
        });
      } 
      // Key only in obj1
      else if (!(key in (obj2 || {}))) {
        diffs.push({ 
          type: 'removed', 
          path: fullPath, 
          value: val1 
        });
      } 
      // Key in both - check if different
      else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        // Both are objects (but NOT arrays) - recurse
        if (typeof val1 === 'object' && typeof val2 === 'object' && 
            val1 !== null && val2 !== null && 
            !Array.isArray(val1) && !Array.isArray(val2)) {
          diffs.push(...this.diffObjects(val1, val2, fullPath));
        } 
        // Value changed
        else {
          diffs.push({ 
            type: 'changed', 
            path: fullPath, 
            old: val1, 
            new: val2 
          });
        }
      }
    });
    
    return diffs;
  },

  // ========== MOCK DATA GENERATION ==========
  
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
          if (s.format === 'date-time') return new Date().toISOString();
          return 'sample text';
        
        case 'number':
        case 'integer':
          if (s.enum) return s.enum[0];
          if (s.example !== undefined) return s.example;
          if (s.minimum !== undefined) return s.minimum;
          if (s.type === 'integer') return 42;
          return 3.14;
        
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