export const Validators = {
  validateJson(text) {
    try {
      JSON.parse(text);
      return { valid: true, message: 'Valid JSON' };
    } catch (e) {
      return { valid: false, message: `JSON Error: ${e.message}` };
    }
  },

  validateXml(text) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');
      
      if (doc.getElementsByTagName('parsererror').length > 0) {
        return { valid: false, message: 'XML Parse Error: Malformed XML' };
      }
      return { valid: true, message: 'Valid XML' };
    } catch (e) {
      return { valid: false, message: `XML Error: ${e.message}` };
    }
  },

  validateYaml(text) {
    try {
      // Simple YAML validation
      const lines = text.split('\n');
      let inBlockScalar = false;
      let lastIndent = 0;
      
      for (const line of lines) {
        if (line.trim() === '' || line.trim().startsWith('#')) continue;
        
        const indent = line.search(/\S/);
        
        if (indent < 0) continue;
        
        const trimmed = line.trim();
        
        if (indent > lastIndent + 2) {
          return { valid: false, message: 'Invalid YAML indentation' };
        }
        
        lastIndent = indent;
      }
      
      return { valid: true, message: 'Valid YAML' };
    } catch (e) {
      return { valid: false, message: `YAML Error: ${e.message}` };
    }
  },

  validateCsv(text) {
    try {
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length === 0) {
        return { valid: false, message: 'Empty CSV' };
      }
      
      const headerCount = lines[0].split(',').length;
      for (let i = 1; i < lines.length; i++) {
        const lineCount = lines[i].split(',').length;
        if (Math.abs(lineCount - headerCount) > 2) {
          return { valid: false, message: `Row ${i + 1} has inconsistent column count` };
        }
      }
      
      return { valid: true, message: 'Valid CSV' };
    } catch (e) {
      return { valid: false, message: `CSV Error: ${e.message}` };
    }
  },

  validateJsonSchema(data, schema) {
    try {
      const validate = (obj, sch) => {
        if (sch.type === 'object') {
          if (typeof obj !== 'object' || obj === null) return false;
          if (sch.properties) {
            for (const [key, prop] of Object.entries(sch.properties)) {
              if (!validate(obj[key], prop)) return false;
            }
          }
        } else if (sch.type === 'array') {
          if (!Array.isArray(obj)) return false;
          if (sch.items && obj.length > 0) {
            if (!validate(obj[0], sch.items)) return false;
          }
        } else if (sch.type === 'string') {
          if (typeof obj !== 'string') return false;
        } else if (sch.type === 'number') {
          if (typeof obj !== 'number') return false;
        } else if (sch.type === 'boolean') {
          if (typeof obj !== 'boolean') return false;
        }
        return true;
      };
      
      if (validate(data, schema)) {
        return { valid: true, message: 'Data matches schema' };
      } else {
        return { valid: false, message: 'Data does not match schema' };
      }
    } catch (e) {
      return { valid: false, message: `Validation Error: ${e.message}` };
    }
  }
};

export default Validators;
