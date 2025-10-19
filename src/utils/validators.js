import * as YAML from 'js-yaml';

export const Validators = {
  // ========== JSON VALIDATION ==========
  
  validateJson(text) {
    try {
      JSON.parse(text);
      return { 
        valid: true, 
        message: '✓ Valid JSON format' 
      };
    } catch (e) {
      // Extract position info if available
      const posMatch = e.message.match(/position (\d+)/);
      const pos = posMatch ? ` at position ${posMatch[1]}` : '';
      return { 
        valid: false, 
        message: `JSON Error: ${e.message}${pos}` 
      };
    }
  },

  // ========== XML VALIDATION ==========
  
  validateXml(text) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');
      
      // Check for parse errors
      const parseError = doc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        const errorText = parseError[0].textContent;
        return { 
          valid: false, 
          message: `XML Parse Error: ${errorText}` 
        };
      }
      
      // Check for valid XML structure
      if (!doc.documentElement) {
        return { 
          valid: false, 
          message: 'XML Error: No root element found' 
        };
      }
      
      return { 
        valid: true, 
        message: '✓ Valid XML format' 
      };
    } catch (e) {
      return { 
        valid: false, 
        message: `XML Error: ${e.message}` 
      };
    }
  },

  // ========== YAML VALIDATION ==========
  
  validateYaml(text) {
    try {
      // Use js-yaml library for robust parsing
      YAML.load(text);
      return { 
        valid: true, 
        message: '✓ Valid YAML format' 
      };
    } catch (e) {
      // Extract line number if available
      const lineMatch = e.message.match(/line (\d+)/);
      const line = lineMatch ? ` at line ${lineMatch[1]}` : '';
      return { 
        valid: false, 
        message: `YAML Error: ${e.message}${line}` 
      };
    }
  },

  // ========== CSV VALIDATION ==========
  
  validateCsv(text) {
    try {
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length === 0) {
        return { 
          valid: false, 
          message: 'CSV Error: File is empty' 
        };
      }
      
      // Parse header
      const headerLine = lines[0];
      const headerCount = this.countCSVFields(headerLine);
      
      if (headerCount === 0) {
        return { 
          valid: false, 
          message: 'CSV Error: No headers found' 
        };
      }
      
      // Check data rows for consistency
      let issues = [];
      const dataRows = lines.length - 1; // Exclude header
      
      for (let i = 1; i < lines.length; i++) {
        const lineCount = this.countCSVFields(lines[i]);
        
        // Allow 0-2 column variance for flexibility
        if (Math.abs(lineCount - headerCount) > 2) {
          issues.push(`Row ${i} has ${lineCount} fields (expected ~${headerCount})`);
        }
      }
      
      if (issues.length > 0) {
        return { 
          valid: false, 
          message: `CSV Warnings: ${issues.slice(0, 2).join(', ')}${issues.length > 2 ? '...' : ''}` 
        };
      }
      
      return { 
        valid: true, 
        message: `✓ Valid CSV format (${dataRows} rows, ${headerCount} columns)` 
      };
    } catch (e) {
      return { 
        valid: false, 
        message: `CSV Error: ${e.message}` 
      };
    }
  },

  countCSVFields(line) {
    let count = 1;
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        count++;
      }
    }
    
    return count;
  },

  // ========== JSON SCHEMA VALIDATION ==========
  
  validateJsonSchema(data, schema) {
    try {
      const validate = (obj, sch, path = 'root') => {
        if (!sch) return { valid: true };
        
        // Handle type as array
        const schemaType = Array.isArray(sch.type) ? sch.type[0] : sch.type;
        
        switch (schemaType) {
          case 'object':
            if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
              return { 
                valid: false, 
                path, 
                message: `Expected object, got ${typeof obj}` 
              };
            }
            if (sch.properties) {
              for (const [key, prop] of Object.entries(sch.properties)) {
                if (key in obj) {
                  const result = validate(obj[key], prop, `${path}.${key}`);
                  if (!result.valid) return result;
                }
              }
            }
            break;
            
          case 'array':
            if (!Array.isArray(obj)) {
              return { 
                valid: false, 
                path, 
                message: `Expected array, got ${typeof obj}` 
              };
            }
            if (sch.items && obj.length > 0) {
              for (let i = 0; i < obj.length; i++) {
                const result = validate(obj[i], sch.items, `${path}[${i}]`);
                if (!result.valid) return result;
              }
            }
            break;
            
          case 'string':
            if (typeof obj !== 'string') {
              return { 
                valid: false, 
                path, 
                message: `Expected string, got ${typeof obj}` 
              };
            }
            break;
            
          case 'number':
            if (typeof obj !== 'number') {
              return { 
                valid: false, 
                path, 
                message: `Expected number, got ${typeof obj}` 
              };
            }
            break;
            
          case 'integer':
            if (!Number.isInteger(obj)) {
              return { 
                valid: false, 
                path, 
                message: `Expected integer, got ${typeof obj}` 
              };
            }
            break;
            
          case 'boolean':
            if (typeof obj !== 'boolean') {
              return { 
                valid: false, 
                path, 
                message: `Expected boolean, got ${typeof obj}` 
              };
            }
            break;
            
          default:
            break;
        }
        
        return { valid: true };
      };
      
      const result = validate(data, schema);
      if (result.valid) {
        return { 
          valid: true, 
          message: '✓ Data matches schema' 
        };
      } else {
        return { 
          valid: false, 
          message: `Schema validation failed at ${result.path}: ${result.message}` 
        };
      }
    } catch (e) {
      return { 
        valid: false, 
        message: `Validation Error: ${e.message}` 
      };
    }
  }
};

export default Validators;