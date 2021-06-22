// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import encoding from "text-encoding";
import ClipLoader from "react-spinners/ClipLoader";
import { FaCheckCircle } from "react-icons/fa";

import exampleCode from "./example-code";

if (typeof TextEncoder === "undefined") {
  // Edge polyfill, https://rustwasm.github.io/docs/wasm-bindgen/reference/browser-support.html
  self.TextEncoder = encoding.TextEncoder;
  self.TextDecoder = encoding.TextDecoder;
}

import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";

import { startRustAnalyzer } from "./startRustAnalyzer";

const modeId = "ra-rust"; // not "rust" to circumvent conflict
(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: any, label: any) {
    return "./editor.worker.js";
  },
};
interface Props {
  width: number;
  height: number;
  minimap?: boolean;
  numbering?: boolean;
  isDark?: boolean;
}

const Editor: React.FC<Props> = ({
  width,
  height,
  minimap = false,
  numbering = false,
  isDark = true,
}: Props) => {
  console.log("start rendering!");
  let divNode: any;
  const assignRef = useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);

  const editor = useRef<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function init() {
    console.log("getting monaco");
    await import(/* webpackChunkName: "monaco-editor" */ "monaco-editor");
    const monaco = await import(
      /* webpackChunkName: "monaco-editor" */ "monaco-editor/esm/vs/editor/editor.api"
    );
    console.log("creating model");
    // @ts-ignore
    let model = monaco.editor.createModel(exampleCode);
    console.log("creating editor", "rust");
    // @ts-ignore
    const myEditor = monaco.editor.create(divNode, {
      theme: isDark ? "hc-black" : "vs",
      minimap: { enabled: minimap },
      lineNumbers: numbering ? "on" : "off",
      model: model,
    });
    editor.current = myEditor;
    myEditor.updateOptions({ theme: isDark ? "vs-dark" : "vs" });
    window.onresize = () => myEditor.layout();
    await startRustAnalyzer(monaco, model);
    setIsLoading(false);
  }

  useEffect(() => {
    if (divNode) {
      init();
    }
  }, [assignRef]);

  useEffect(() => {
    // @ts-ignore
    editor.current?.updateOptions({ theme: isDark ? "vs-dark" : "vs" });
  }, [isDark, editor]);

  useEffect(() => {
    // @ts-ignore
    editor.current?.updateOptions({ minimap: { enabled: minimap } });
  }, [minimap, editor]);

  useEffect(() => {
    // @ts-ignore
    editor.current?.updateOptions({ lineNumbers: numbering ? "on" : "off" });
  }, [numbering, editor]);

  return (
    <>
      <div
        id="test"
        ref={assignRef}
        style={{
          height: `${height}vh`,
          width: `${width}vw`,
          border: "1px solid black",
        }}
      ></div>

      <div
        style={{
          width: `${width}vw`,
          border: "1px solid black",
          display: "table",
        }}
      >
        {isLoading ? (
          <div>
            <div style={{ padding: "1px 2px", display: "table-cell" }}>
              <ClipLoader size={12} />
            </div>
            <div style={{ display: "table-cell" }}>
              Loading Rust-Analyzer...
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                padding: "1px 2px",
                display: "table-cell",
                width: "18px",
              }}
            >
              <FaCheckCircle />
            </div>
            <div style={{ display: "table-cell" }}>Rust Analyzer Ready</div>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;
