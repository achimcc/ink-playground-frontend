import React from "react";
import ReactDOM from "react-dom";
import Editor from "./Editor";

ReactDOM.render(
  <React.StrictMode>
    <Editor width={50} height={50} />
  </React.StrictMode>,
  document.getElementById("root")
);
