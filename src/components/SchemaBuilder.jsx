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






