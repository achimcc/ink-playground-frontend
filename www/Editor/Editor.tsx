import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
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
monaco.languages.register({
  // language for editor
  id: modeId,
});
monaco.languages.register({
  // language for hover info
  id: "rust",
});
MonacoEnvironment;
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
  let divNode: any;
  const assignRef = useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);

  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (divNode) {
      let model = monaco.editor.createModel(exampleCode, "rust");
      const myEditor = monaco.editor.create(divNode, {
        theme: isDark ? "hc-black" : "vs",
        minimap: { enabled: minimap },
        lineNumbers: numbering ? "on" : "off",
        model: model,
      });
      editor.current = myEditor;
      window.onresize = () => myEditor.layout();
      startRustAnalyzer(model).then((m) => {
        monaco.editor.setModelLanguage(m, modeId);
        setIsLoading(false);
      });
    }
  }, [assignRef]);

  useEffect(() => {
    editor.current?.updateOptions({ theme: isDark ? "vs-dark" : "vs" });
  }, [isDark, editor]);

  useEffect(() => {
    editor.current?.updateOptions({ minimap: { enabled: minimap } });
  }, [minimap, editor]);

  useEffect(() => {
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
