import encoding from "text-encoding";
import { ClipLoader, RingLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";

import exampleCode from "./data/example-code";

if (typeof TextEncoder === "undefined") {
  // Edge polyfill, https://rustwasm.github.io/docs/wasm-bindgen/reference/browser-support.html
  self.TextEncoder = encoding.TextEncoder;
  self.TextDecoder = encoding.TextDecoder;
}

import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";

import { startRustAnalyzer } from "./utils/startRustAnalyzer";
import { Module } from "webpack";

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
  setUri?: (uri: any) => void;
}

const Editor: React.FC<Props> = ({
  width,
  height,
  minimap = false,
  numbering = false,
  isDark = true,
  setUri = (uri: any) => null,
}: Props) => {
  console.log("start rendering!");
  let divNode: any;
  const assignRef = useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);

  const editor = useRef<any>();
  const [isMonacoLoading, setIsMonacoLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function init() {
    console.log("getting monaco");
    const monaco = await import(
      /* webpackChunkName: "monaco-editor" */ "monaco-editor/esm/vs/editor/editor.api"
    );
    let model = await monaco.editor.createModel(exampleCode);
    setUri(model.uri);
    const myEditor = monaco.editor.create(divNode, {
      theme: isDark ? "hc-black" : "vs",
      minimap: { enabled: minimap },
      lineNumbers: numbering ? "on" : "off",
      model: model,
    });
    setIsMonacoLoading(false);
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
          position: "relative",
        }}
      >
        {isMonacoLoading && (
          <div
            style={{
              position: "absolute",
              left: "calc(50% - 150px)",
              top: "calc(50% - 150px)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <RingLoader size={300} color={"#3EACF2"} />
          </div>
        )}
      </div>

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
