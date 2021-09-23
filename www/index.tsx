import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { PlaygroundContextProvider } from "./context";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <PlaygroundContextProvider>
      <App />
    </PlaygroundContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
