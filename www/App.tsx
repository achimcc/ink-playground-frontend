import React, { useState } from "react";
import Editor from "./Editor/Editor";
import { performCompile } from "./Integration/compile";
import {
  CompileRequest,
  CompileConfig,
  Channel,
  Mode,
  Edition,
  AssemblyFlavor,
  DemangleAssembly,
  ProcessAssembly,
} from "./Integration/types";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const parseRequest = (code: string): CompileRequest => {
  const config: CompileConfig = {
    channel: Channel.Stable,
    mode: Mode.Release,
    edition: Edition.Rust2018,
    assemblyFlavor: AssemblyFlavor.Att,
    demangleAssembly: DemangleAssembly.Demangle,
    processAssembly: ProcessAssembly.Filter,
  };
  const request: CompileRequest = {
    config,
    crateType: "bin",
    backtrace: false,
    target: "asm",
    code,
  };
  return request;
};

function App() {
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
    performCompile(request).then((response) =>
      console.log("response: ", response)
    );
    console.log("compile! ", model?.getValue());
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
