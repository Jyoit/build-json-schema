import React from "react";
import { useForm, useFieldArray, FormProvider, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";


const onSubmit = (data) => {
  const buildJson = (fields) => {
    const result = {};
    fields.forEach((field) => {
      if (!field.name) return;

      if (field.type === "string" || field.type === "number") {
  result[field.name] = {
    type: field.type.toUpperCase(),
    required: field.required || false,
  };
} else if (field.type === "nested") {
  result[field.name] = buildJson(field.children || []);
}
    });
    return result;
  };

  const jsonSchema = buildJson(data.fields);
  console.log("Submitted Schema:", jsonSchema);
  alert("Schema submitted! Check the console or copy from preview.");
};

const SchemaField = ({ field, index, nestingLevel, fieldPath, remove }) => {
  const { register, control, watch } = useFormContext();

  const currentField = watch(fieldPath);

  const { fields: children, append: appendChild, remove: removeChild } = useFieldArray({
    control,
    name: `${fieldPath}.children`,
  });

  const addNestedField = () => {
    appendChild({
      id: Date.now().toString(),
      name: "",
      type: "string",
      required: false,
      children: [],
    });
  };

  return (
    <div className={`nested`} style={{ marginLeft: `${nestingLevel * 20}px` }}>
      <div className="form-group">
        <input
          {...register(`${fieldPath}.name`)}
          placeholder="Field name"
          defaultValue={field.name}
        />

        <select {...register(`${fieldPath}.type`)}>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="nested">Nested</option>
        </select>


  <label className="switch">
  <input
    type="checkbox"
    {...register(`${fieldPath}.required`)}
    defaultChecked={field.required}
  />
  <span className="slider round"></span>
</label>


        <button
          type="button"
          className="remove-btn"
          onClick={() => remove(index)}
        >
          <X size={16} />
        </button>
      </div>

      {currentField.type === "nested" && (
        <div>
          {children.map((child, childIndex) => (
            <SchemaField
              key={child.id}
              field={child}
              index={childIndex}
              nestingLevel={nestingLevel + 1}
              fieldPath={`${fieldPath}.children.${childIndex}`}
              remove={removeChild}
            />
          ))}

          <button type="button" onClick={addNestedField}>
            <span> +</span> <span>Add Item</span>
          </button>
        </div>
      )}
    </div>
  );
};

const JsonPreview = ({ fields }) => {
  const buildJson = (fields) => {
    const result = {};
    fields.forEach((field) => {
      if (!field.name) return;

      if (field.type === "string") {
        result[field.name] = "STRING";
      } else if (field.type === "number") {
        result[field.name] = "NUMBER";
      } else if (field.type === "nested") {
        result[field.name] = buildJson(field.children || []);
      }
    });
    return result;
  };

  const json = buildJson(fields);

  return (
    <div className="card json-preview">
      <h2>JSON Preview</h2>
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
};

const SchemaBuilder = () => {
  const methods = useForm({
    defaultValues: {
      fields: [
        {
        //   id: "1",
        //   name: "address",
        //   type: "nested",
        //   required: false,
        //   children: [
        //     { id: "2", name: "hno", type: "number", required: false, children: [] },
        //     { id: "3", name: "city", type: "string", required: false, children: [] },
        //   ],
        },
      ],
    },
  });

  const { control, watch, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const addField = () => {
    append({
      id: Date.now().toString(),
      name: "",
      type: "string",
      required: false,
      children: [],
    });
  };

  const watchedFields = watch("fields");

  return (
    <div className="builder-wrapper">
      {/* Left: Builder */}
      <div className="card">
        <h2>Schema Builder</h2>
        <p>Define your JSON structure</p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <SchemaField
                key={field.id}
                field={field}
                index={index}
                nestingLevel={0}
                fieldPath={`fields.${index}`}
                remove={remove}
              />
            ))}

            <button type="button" onClick={addField}>
              <span>+</span> <span>Add Item</span> 
            </button>

            <button  type="submit"> Submit</button>
          </form>
        </FormProvider>
      </div>

      {/* Right: JSON */}
      <JsonPreview fields={watchedFields || []} />
    </div>
  );
};

export default SchemaBuilder;






















































// import React from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import SchemaFieldComponent from './SchemaField';
// import JsonPreview from './JsonPreview';
// import { Plus } from 'lucide-react';

// const SchemaBuilder = () => {
//   const { register, control, watch, handleSubmit } = useForm({
//     defaultValues: {
//       fields: [
//         { id: '1', name: 'name', type: 'string', required: false, children: [] },
//         { id: '2', name: 'class', type: 'number', required: false, children: [] },
//         {
//           id: '3',
//           name: 'address',
//           type: 'nested',
//           required: false,
//           children: [
//             { id: '4', name: 'hno', type: 'number', required: false, children: [] },
//             { id: '5', name: 'city', type: 'string', required: false, children: [] },
//           ],
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
//   const watchedFields = watch('fields');

//   const addField = () => {
//     const newField = {
//       id: Date.now().toString(),
//       name: '',
//       type: 'string',
//       required: false,
//       children: [],
//     };
//     append(newField);
//   };

//   const onSubmit = (data) => {
//     console.log('Schema Data:', data);
//   };

//   return (
//     <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//         <div style={{ marginBottom: '20px' }}>
//           <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>JSON Schema Builder</h1>
//           <p style={{ color: '#666' }}>Create and manage your JSON schema with ease</p>
//         </div>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
//           <div style={{ backgroundColor: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '5px', overflow: 'auto' }}>
//             <div style={{ marginBottom: '15px' }}>
//               <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Schema Builder</h2>
//               <p style={{ color: '#666', fontSize: '14px' }}>Define your JSON structure</p>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                 {fields.map((field, index) => (
//                   <SchemaFieldComponent
//                     key={field.id}
//                     field={field}
//                     index={index}
//                     nestingLevel={0}
//                     register={register}
//                     remove={remove}
//                     control={control}
//                     fieldPath={`fields[${index}]`}
//                   />
//                 ))}
//               </div>
//               <button
//                 type="button"
//                 onClick={addField}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '5px',
//                   padding: '10px',
//                   backgroundColor: '#007bff',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '5px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <Plus size={16} /> Add Item
//               </button>
//               <div style={{ paddingTop: '15px', borderTop: '1px solid #ddd' }}>
//                 <button
//                   type="submit"
//                   style={{
//                     padding: '10px 20px',
//                     backgroundColor: '#333',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
//             <JsonPreview fields={watchedFields || []} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchemaBuilder;