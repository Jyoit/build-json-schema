import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';

const SchemaFieldComponent = ({ field, index, nestingLevel, remove, control, fieldPath }) => {
  const { register } = useFormContext();

  const handleAddNestedField = () => {
    const newChild = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false,
      children: [],
    };
    const currentChildren = control._formValues[fieldPath]?.children || [];
    control._formValues[fieldPath].children = [...currentChildren, newChild];
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', marginBottom: '10px', marginLeft: `${nestingLevel * 20}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          {...register(`${fieldPath}.name`, { required: false })}
          style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px', flex: '1' }}
          defaultValue={field.name}
          placeholder="Field name"
        />
        <select
          {...register(`${fieldPath}.type`, { required: false })}
          style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
          defaultValue={field.type}
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="nested">Nested</option>
        </select>
        <button
          type="button"
          onClick={() => remove(index)}
          style={{ color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
      {field.type === 'nested' && (
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            onClick={handleAddNestedField}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Add Nested Field
          </button>
          {field.children && field.children.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              {field.children.map((child, childIndex) => (
                <SchemaFieldComponent
                  key={child.id}
                  field={child}
                  index={childIndex}
                  nestingLevel={nestingLevel + 1}
                  remove={(idx) => {
                    const newChildren = [...field.children];
                    newChildren.splice(idx, 1);
                    control._formValues[fieldPath].children = newChildren;
                  }}
                  control={control}
                  fieldPath={`${fieldPath}.children[${childIndex}]`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemaFieldComponent;