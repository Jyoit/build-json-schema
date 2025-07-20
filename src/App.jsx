import React from "react";
import SchemaBuilder from "./components/SchemaBuilder";

function App() {
  return (
    <div className="container">
      <h1>JSON Schema Builder</h1>
      <p>Create and manage your JSON schema with ease</p>

      <SchemaBuilder />
    </div>
  );
}

export default App;
