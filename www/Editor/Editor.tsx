import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import exampleCode from "./example-code";
// import crate from "./crate.json";
import encoding from "text-encoding";

if (typeof TextEncoder === "undefined") {
  // Edge polyfill, https://rustwasm.github.io/docs/wasm-bindgen/reference/browser-support.html
  self.TextEncoder = encoding.TextEncoder;
  self.TextDecoder = encoding.TextDecoder;
}

import "./index.css";
import { useCallback, useEffect, useRef } from "react";
import React from "react";

import { configureLanguage, setTokens } from "./configureLanguage";
import { createRa } from "../workers/createRa";
import { startRustAnalyzer } from "./startRustAnalyzer";

(window as any).MonacoEnvironment = {
  getWorkerUrl: () => "./editor.worker.bundle.js",
};

const modeId = "ra-rust"; // not "rust" to circumvent conflict
monaco.languages.register({
  // language for editor
  id: modeId,
});
monaco.languages.register({
  // language for hover info
  id: "rust",
});

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

  useEffect(() => {
    if (divNode) {
      startRustAnalyzer(divNode, numbering, minimap, isDark).then(
        (m) => (editor.current = m)
      );
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
    <div
      id="test"
      ref={assignRef}
      style={{
        height: `${height}vh`,
        width: `${width}vw`,
        border: "1px solid black",
      }}
    ></div>
  );
};

export default Editor;
