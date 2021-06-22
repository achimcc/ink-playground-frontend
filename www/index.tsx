import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: any, label: any) {
    return "./editor.worker.js";
  },
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
