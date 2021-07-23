import React, { useEffect, useState } from "react";
import Editor from "./Editor/Editor";
import {
  performCompile,
  parseRequest,
  downloadBlob,
  performGistSave,
  performGistLoad,
} from "./Integration/integration";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

function App() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    console.log("query id: ", id);
    if (id) {
      performGistLoad(id).then((response) => {
        const model = monaco.editor.getModel(uri as any);
        model?.setValue(response);
      });
    }
  });
  const [isDark, setIsDark] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [numbering, setNumbering] = useState(false);
  const [uri, setUri] = useState();
  const toggleDark = () => setIsDark((value) => !value);
  const toggleMinimap = () => setMinimap((value) => !value);
  const toggleNumbering = () => setNumbering((value) => !value);
  const requestCompile = () => {
    const model = monaco.editor.getModel(uri as any);
    const code = model?.getValue() as string;
    const request = parseRequest(code);
    performCompile(request).then((response) => {
      downloadBlob((response as any).code);
    });
  };
  const requestShare = () => {
    const model = monaco.editor.getModel(uri as any);
    const code = model?.getValue() as string;
    performGistSave(code).then((response) => {
      console.log("response: ", response);
    });
  };
  return (
    <div className="App">
      <header className="App-header" style={{ textAlign: "center" }}>
        <h1>Just a simple Ink Playground for React</h1>
      </header>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        <div
          style={{
            margin: "2em",
            width: "50vw",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <button onClick={toggleDark}>Toggle Dark Mode</button>
          <button onClick={toggleMinimap}>Toggle Minimap</button>
          <button onClick={toggleNumbering}>Toggle Numbering</button>
          <button onClick={requestCompile}>Compile</button>
          <button onClick={requestShare}>Share</button>
        </div>
        <Editor
          width={50}
          height={60}
          isDark={isDark}
          minimap={minimap}
          numbering={numbering}
          setUri={setUri}
        />
      </div>
    </div>
  );
}

export default App;
