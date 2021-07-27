import React, { useEffect, useState } from "react";
import { performGistLoad } from "./integration/integration";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { TerminalService } from "primereact/terminalservice";
import "./inkTerminal.css";
import { TabView, TabPanel } from "primereact/tabview";
import { Settings, Compile, Editor, Share, Status } from "./components";
import { usePlayground } from "./context";

function App() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    TerminalService.on("command", (text: any) =>
      TerminalService.emit("response", `Hey There! ${text}`)
    );
    if (id) {
      performGistLoad(id).then((response) => {
        const model = monaco.editor.getModel(uri as any);
        model?.setValue(response);
      });
    }
  });
  const { uri } = usePlayground();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="App">
      <header className="App-header" style={{ textAlign: "center" }}>
        <h1>ink! Playground</h1>
      </header>
      <div>
        <div className="card">
          <Splitter>
            <SplitterPanel
              style={{ minWidth: 0 }}
              className="p-d-flex p-ai-center p-jc-center"
              size={60}
              minSize={10}
            >
              <Editor height={90} />
            </SplitterPanel>
            <SplitterPanel size={40}>
              <Splitter layout="vertical">
                <SplitterPanel
                  className="p-d-flex p-ai-center p-jc-center"
                  size={50}
                >
                  <div>
                    <TabView
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                    >
                      <TabPanel header="Compile">
                        <Compile />
                      </TabPanel>
                      <TabPanel header="Share">
                        <Share />
                      </TabPanel>
                      <TabPanel header="Settings">
                        <Settings />
                      </TabPanel>
                    </TabView>
                  </div>
                </SplitterPanel>
                <SplitterPanel
                  size={50}
                  style={{ minHeight: 0, overflowY: "scroll" }}
                >
                  <div className="ink-terminal" id="message_div">
                    <Status />
                  </div>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default App;
