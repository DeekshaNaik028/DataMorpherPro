export const CodeGenerators = {
  generateTypeScript(obj, name = 'Root', visited = new Set()) {
    if (!obj) return 'any';
    if (visited.has(obj)) return 'any';
    
    const getType = (value) => {
      if (value === null || value === undefined) return 'null';
      if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        const itemType = this.getTypeFromValue(value[0]);
        return `${itemType}[]`;
      }
      if (typeof value === 'object') {
        return 'object';
      }
      return typeof value;
    };
    
    if (Array.isArray(obj)) {
      const itemType = obj.length > 0 ? this.getTypeFromValue(obj[0]) : 'any';
      return `${itemType}[]`;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      visited.add(obj);
      
      const props = Object.entries(obj)
        .map(([key, value]) => {
          let type;
          if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object') {
              const nestedName = key.charAt(0).toUpperCase() + key.slice(1);
              type = `${nestedName}[]`;
            } else {
              type = this.getTypeFromValue(value[0] || null) + '[]';
            }
          } else if (typeof value === 'object' && value !== null) {
            const nestedName = key.charAt(0).toUpperCase() + key.slice(1);
            type = nestedName;
          } else {
            type = this.getTypeFromValue(value);
          }
          return `  ${key}: ${type};`;
        })
        .join('\n');
      
      return `interface ${name} {\n${props}\n}`;
    }
    
    return 'any';
  },

  generatePython(obj, name = 'Root') {
    const getType = (value) => {
      if (value === null) return 'None';
      if (typeof value === 'boolean') return 'bool';
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'float';
      }
      if (typeof value === 'string') return 'str';
      if (Array.isArray(value)) return 'list';
      if (typeof value === 'object') return 'dict';
      return 'Any';
    };
    
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      const props = Object.entries(obj)
        .map(([key, value]) => {
          const type = getType(value);
          return `    ${key}: ${type}`;
        })
        .join('\n');
      
      return `class ${name}:\n${props}\n    pass`;
    }
    
    return '';
  },

  generateJava(obj, name = 'Root') {
    const getType = (value) => {
      if (value === null) return 'Object';
      if (typeof value === 'string') return 'String';
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'double';
      }
      if (typeof value === 'boolean') return 'boolean';
      if (Array.isArray(value)) return 'List';
      if (typeof value === 'object') return 'Map';
      return 'Object';
    };
    
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      const fields = Object.entries(obj)
        .map(([key, value]) => {
          const type = getType(value);
          return `  private ${type} ${key};`;
        })
        .join('\n');
      
      const getters = Object.entries(obj)
        .map(([key, value]) => {
          const type = getType(value);
          const capitalKey = key.charAt(0).toUpperCase() + key.slice(1);
          return `  public ${type} get${capitalKey}() { return ${key}; }`;
        })
        .join('\n');
      
      return `public class ${name} {\n${fields}\n\n${getters}\n}`;
    }
    
    return '';
  },

  generateGo(obj, name = 'Root') {
    const getType = (value) => {
      if (value === null) return 'interface{}';
      if (typeof value === 'string') return 'string';
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'float64';
      }
      if (typeof value === 'boolean') return 'bool';
      if (Array.isArray(value)) return '[]interface{}';
      if (typeof value === 'object') return 'map[string]interface{}';
      return 'interface{}';
    };
    
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      const fields = Object.entries(obj)
        .map(([key, value]) => {
          const type = getType(value);
          const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
          return `  ${fieldName} ${type} \`json:"${key}"\``;
        })
        .join('\n');
      
      return `type ${name} struct {\n${fields}\n}`;
    }
    
    return '';
  },

  getTypeFromValue(value) {
    if (value === null || value === undefined) return 'unknown';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) {
      return value.length > 0 ? this.getTypeFromValue(value[0]) + '[]' : 'any[]';
    }
    if (typeof value === 'object') return 'object';
    return 'any';
  }
};

export default CodeGenerators;