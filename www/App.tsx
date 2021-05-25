import React from "react";
import "./App.css";
import Editor from "@monaco-editor/react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
        />
      </header>
    </div>
  );
}

export default App;
