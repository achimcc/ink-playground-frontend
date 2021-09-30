import React, { useEffect } from "react";
import { performGistLoad } from "./integration/integration";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Editor, Terminal, Status, Header } from "./components";
import { usePlayground } from "./context";

function App() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    if (id) {
      performGistLoad(id).then((response) => {
        const model = monaco.editor.getModel(uri as any);
        model?.setValue(response);
      });
    }
  });
  const { uri } = usePlayground();
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-grow-0">
        <Header />
      </div>
      <div className="flex-grow">
        <Splitter className="w-full h-full" layout="vertical">
          <SplitterPanel size={70} className="overflow-hidden">
            <Editor />
          </SplitterPanel>
          <SplitterPanel size={30} className="overflow-hidden">
            <Terminal />
          </SplitterPanel>
        </Splitter>
      </div>
      <div className="flex-grow-0">
        <Status />
      </div>
    </div>
  );
}

export default App;
