import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import exampleCode from "./example-code";
import encoding from "text-encoding";
import "./index.css";

if (typeof TextEncoder === "undefined") {
  // Edge polyfill, https://rustwasm.github.io/docs/wasm-bindgen/reference/browser-support.html
  self.TextEncoder = encoding.TextEncoder;
  self.TextDecoder = encoding.TextDecoder;
}

import { configureLanguage, setTokens } from "./configureLanguage";
import { createRa } from "../workers/createRa";

const modeId = "ra-rust"; // not "rust" to circumvent conflict
monaco.languages.register({
  // language for editor
  id: modeId,
});
monaco.languages.register({
  // language for hover info
  id: "rust",
});

export const startRustAnalyzer = async (
  domElement: HTMLElement,
  numbering: boolean,
  useMinimap: boolean = false,
  isDark: boolean
) => {
  var loadingText = document.createTextNode("Loading wasm...");
  domElement.appendChild(loadingText);

  const state = await createRa();

  const allTokens: Array<any> = [];

  monaco.languages.onLanguage(
    modeId,
    configureLanguage(monaco, state, allTokens)
  );
  let i = 0;

  // Sends the crate data to rust-analyzer
  for (i = 1; i < 8; i++) {
    const part = await import(`./part${i}.json`);
    console.log(`./part${i}.json`);
    await state.load(JSON.stringify(part));
  }

  let model = monaco.editor.createModel(exampleCode, modeId);
  async function update() {
    const text = model.getValue();
    await state.update(text);
    const res = await state.analyze();
    monaco.editor.setModelMarkers(model, modeId, res.diagnostics);
    allTokens.length = 0;
    allTokens.push(...res.highlights);
    setTokens(allTokens);
  }
  // await state.test(exampleCode);
  await update();
  model.onDidChangeContent(update);

  domElement.removeChild(loadingText);

  const myEditor = monaco.editor.create(domElement, {
    theme: isDark ? "vs-dark" : "vs",
    minimap: { enabled: useMinimap },
    lineNumbers: numbering ? "on" : "off",
    model: model,
  });

  window.onresize = () => myEditor.layout();
  return myEditor;
};
