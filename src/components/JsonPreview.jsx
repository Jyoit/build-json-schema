import React from 'react';

const JsonPreview = ({ fields }) => {
  const generateJson = (fields) => {
    const result = {};
    fields.forEach(field => {
      if (!field.name) return;
      switch (field.type) {
        case 'string':
          result[field.name] = 'STRING';
          break;
        case 'number':
          result[field.name] = 'NUMBER';
          break;
        case 'nested':
          if (field.children && field.children.length > 0) {
            result[field.name] = generateJson(field.children);
          } else {
            result[field.name] = {};
          }
          break;
      }
    });
    return result;
  };

  const jsonOutput = generateJson(fields || []);

  return (
    <div style={{ height: '100%' }}>
      <div style={{ backgroundColor: '#333', color: '#fff', padding: '20px', borderRadius: '5px', height: '100%', overflow: 'auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>JSON Preview</h3>
        </div>
        <pre style={{ fontSize: '14px', lineHeight: '1.5' }}>
          {JSON.stringify(jsonOutput, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JsonPreview;