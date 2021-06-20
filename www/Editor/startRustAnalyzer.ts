import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
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

export const startRustAnalyzer = async (model: monaco.editor.ITextModel) => {
  const state = await createRa();

  const allTokens: Array<any> = [];

  monaco.languages.onLanguage(
    modeId,
    configureLanguage(monaco, state, allTokens)
  );
  let i = 0;
  // Sends the crate data to rust-analyzer
  for (i = 1; i < 8; i++) {
    const part = await fetch(`./Editor/data/part${i}.json`);
    const res = await part.text();
    //  console.log("res: ", res);
    await state.load(res);
  }

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
  return model;
};
