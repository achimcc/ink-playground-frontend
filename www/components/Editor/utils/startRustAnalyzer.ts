import encoding from "text-encoding";
import * as Comlink from "comlink";

import { WorkerApi } from "../workers/worker";

import { configureLanguage, setTokens } from "./configureLanguage";

if (typeof TextEncoder === "undefined") {
  // Edge polyfill, https://rustwasm.github.io/docs/wasm-bindgen/reference/browser-support.html
  self.TextEncoder = encoding.TextEncoder;
  self.TextDecoder = encoding.TextDecoder;
}

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
  const rustConf = await import(
    /* webpackChunkName: "monaco-editor" */ "monaco-editor/esm/vs/basic-languages/rust/rust"
  );
  monaco.editor.setModelLanguage(model, "rust");
  monaco.languages.setLanguageConfiguration("rust", rustConf.conf);
  monaco.languages.setMonarchTokensProvider("rust", rustConf.language);
  monaco.languages.setLanguageConfiguration(modeId, rustConf.conf);

  // start rust-analyzer web worker
  // const state = await createRa();

  const state = await Comlink.wrap<WorkerApi>(
    new Worker(new URL("../workers/worker.ts", import.meta.url), {
      type: "module",
    })
  ).handlers;

  const allTokens: Array<any> = [];
  monaco.languages.onLanguage(
    modeId,
    configureLanguage(monaco, state, allTokens)
  );
  let i = 0;
  // Fetch the crate data and send it to rust-analyzer
  /*
  for (i = 1; i < 8; i++) {
    const part = await fetch(`./part${i}.json`);
    const res = await part.text();
    await state.load(res);
  }
  */

  const data = await fetch(`./change.json`);
  const res = await data.text();
  await state.load(res);

  async function update() {
    const text = model.getValue();
    await state.update(text);
    const res = await state.analyze(183);
    console.log(res);
    monaco.editor.setModelMarkers(model, modeId, res.diagnostics);
    allTokens.length = 0;
    allTokens.push(...res.highlights);
    setTokens(monaco, allTokens);
  }
  // await state.test(exampleCode);
  await update();
  model.onDidChangeContent(update);

  // rust analyzer loaded and diagnostics ready -> switch to rust analyzer
  monaco.editor.setModelLanguage(model, modeId);
  return model;
};
