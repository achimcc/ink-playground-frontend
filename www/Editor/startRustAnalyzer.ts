// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
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

export const startRustAnalyzer = async (monaco: any, model: any) => {
  monaco.languages.register({
    // language for editor
    id: modeId,
  });
  monaco.languages.register({
    // language for hover info
    id: "rust",
  });
  console.log("setting language to rust!");
  const rustConf = await import(
    /* webpackChunkName: "monaco-editor" */ "monaco-editor/esm/vs/basic-languages/rust/rust"
  );
  monaco.editor.setModelLanguage(model, "rust");
  monaco.languages.setLanguageConfiguration("rust", rustConf.conf);
  monaco.languages.setMonarchTokensProvider("rust", rustConf.language);
  monaco.languages.setLanguageConfiguration(modeId, rustConf.conf);
  console.log("now starting ra worker!");
  const state = await createRa();

  const allTokens: Array<any> = [];
  monaco.languages.onLanguage(
    modeId,
    configureLanguage(monaco, state, allTokens)
  );
  let i = 0;
  // Sends the crate data to rust-analyzer
  for (i = 1; i < 8; i++) {
    const part = await fetch(`./part${i}.json`);
    const res = await part.text();
    await state.load(res);
  }

  async function update() {
    const text = model.getValue();
    await state.update(text);
    const res = await state.analyze();
    monaco.editor.setModelMarkers(model, modeId, res.diagnostics);
    allTokens.length = 0;
    allTokens.push(...res.highlights);
    setTokens(monaco, allTokens);
  }
  // await state.test(exampleCode);
  await update();
  model.onDidChangeContent(update);
  // @ts-ignore
  monaco.editor.setModelLanguage(model, modeId);
  return model;
};
