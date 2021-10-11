import encoding from "text-encoding";
import exampleCode from "./data/example-code";

if (typeof TextEncoder === "undefined") {
  // Edge polyfill, https://rustwasm.github.io/docs/wasm-bindgen/reference/browser-support.html
  self.TextEncoder = encoding.TextEncoder;
  self.TextDecoder = encoding.TextDecoder;
}

import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { usePlayground } from "../../context";

import { startRustAnalyzer } from "./utils/startRustAnalyzer";

const modeId = "ra-rust"; // not "rust" to circumvent conflict
interface Props {}

const Editor: React.FC<Props> = ({}: Props) => {
  console.log("start rendering!");
  let divNode: any;
  const assignRef = useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);

  const editor = useRef<any>();
  const { isDarkMode, isMiniMap, isNumbering, dispatch } = usePlayground();

  async function init() {
    const monaco = await import(
      /* webpackChunkName: "monaco-editor" */ "monaco-editor/esm/vs/editor/editor.api"
    );
    let model = await monaco.editor.createModel(exampleCode);
    dispatch({ type: "SET_URI", payload: model.uri });
    const myEditor = monaco.editor.create(divNode, {
      theme: isDarkMode ? "hc-black" : "vs",
      minimap: { enabled: isMiniMap },
      lineNumbers: isNumbering ? "on" : "off",
      model: model,
      automaticLayout: true,
    });
    editor.current = myEditor;
    myEditor.updateOptions({ theme: isDarkMode ? "vs-dark" : "vs" });
    window.onresize = () => myEditor.layout();
    await startRustAnalyzer(monaco, model);
    dispatch({
      type: "SET_RA_LOADING",
      payload: false,
    });
    dispatch({
      type: "LOG_MESSAGE",
      payload: {
        severity: "success",
        prompt: "System: ",
        text: `Rust analyzer ready!`,
      },
    });
  }

  useEffect(() => {
    if (divNode) {
      init();
    }
  }, [assignRef]);

  useEffect(() => {
    editor.current?.updateOptions({ theme: isDarkMode ? "vs-dark" : "vs" });
  }, [isDarkMode, editor]);

  useEffect(() => {
    editor.current?.updateOptions({ minimap: { enabled: isMiniMap } });
  }, [isMiniMap, editor]);

  useEffect(() => {
    editor.current?.updateOptions({ lineNumbers: isNumbering ? "on" : "off" });
  }, [isNumbering, editor]);

  return <div ref={assignRef} className="h-full" />;
};

export default Editor;
