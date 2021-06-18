import React, { useState } from "react";
import Editor from "./Editor/Editor";

function App() {
  const [isDark, setIsDark] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [numbering, setNumbering] = useState(false);
  const toggleDark = () => setIsDark((value) => !value);
  const toggleMinimap = () => setMinimap((value) => !value);
  const toggleNumbering = () => setNumbering((value) => !value);
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
        </div>
        <Editor
          width={50}
          height={60}
          isDark={isDark}
          minimap={minimap}
          numbering={numbering}
        />
      </div>
    </div>
  );
}

export default App;
