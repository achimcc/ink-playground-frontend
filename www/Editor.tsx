import "monaco-editor/esm/vs/editor/browser/controller/coreCommands";
import "monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget";
import "monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget";
import "monaco-editor/esm/vs/editor/browser/widget/diffNavigator";
import "monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/transpose";
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard";
import "monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions";
import "monaco-editor/esm/vs/editor/contrib/codelens/codelensController";
import "monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions";
import "monaco-editor/esm/vs/editor/contrib/comment/comment";
import "monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu";
import "monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo";
import "monaco-editor/esm/vs/editor/contrib/dnd/dnd";
import "monaco-editor/esm/vs/editor/contrib/documentSymbols/documentSymbols";
import "monaco-editor/esm/vs/editor/contrib/find/findController";
import "monaco-editor/esm/vs/editor/contrib/folding/folding";
import "monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom";
import "monaco-editor/esm/vs/editor/contrib/format/formatActions";
import "monaco-editor/esm/vs/editor/contrib/gotoError/gotoError";
import "monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands";
import "monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition";
import "monaco-editor/esm/vs/editor/contrib/hover/hover";
import "monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace";
import "monaco-editor/esm/vs/editor/contrib/indentation/indentation";
import "monaco-editor/esm/vs/editor/contrib/inlineHints/inlineHintsController";
import "monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations";
import "monaco-editor/esm/vs/editor/contrib/linkedEditing/linkedEditing";
import "monaco-editor/esm/vs/editor/contrib/links/links";
import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor";
import "monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints";
import "monaco-editor/esm/vs/editor/contrib/rename/rename";
import "monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect";
import "monaco-editor/esm/vs/editor/contrib/snippet/snippetController2";
import "monaco-editor/esm/vs/editor/contrib/suggest/suggestController";
import "monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode";
import "monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/unusualLineTerminators";
import "monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/viewportSemanticTokens";
import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter";
import "monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations";
import "monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations";
import "monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp";
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess";
import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch";
import "monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import exampleCode from "./example-code";
import crate from "./crate.json";
import encoding from "text-encoding";

if (typeof TextEncoder === "undefined") {
  // Edge polyfill, https://rustwasm.github.io/docs/wasm-bindgen/reference/browser-support.html
  self.TextEncoder = encoding.TextEncoder;
  self.TextDecoder = encoding.TextDecoder;
}

import "./index.css";
import { useCallback, useEffect, useRef } from "react";
import React from "react";

import { configureLanguage } from "./configureLanguage";
import { createRa } from "./workers/createRa";

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

const start = async (
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

  class TokenState {
    line: number;
    equals: (other?: any) => boolean;
    constructor(line: number = 0) {
      this.line = line;
      this.equals = () => true;
    }

    clone() {
      const res = new TokenState(this.line);
      res.line += 1;
      return res;
    }
  }

  function fixTag(tag: string) {
    switch (tag) {
      case "builtin":
        return "variable.predefined";
      case "attribute":
        return "key";
      case "macro":
        return "number.hex";
      case "literal":
        return "number";
      default:
        return tag;
    }
  }

  const setTokens = (allTokens: Array<any>) => monaco.languages.setTokensProvider(modeId, {
    getInitialState: () => new TokenState(),
    tokenize(_, st: TokenState) {
      const filteredTokens = allTokens.filter(
        (token) => token.range.startLineNumber === st.line
      );

      const tokens = filteredTokens.map((token) => ({
        startIndex: token.range.startColumn - 1,
        scopes: fixTag(token.tag),
      }));
      tokens.sort((a, b) => a.startIndex - b.startIndex);

      return {
        tokens,
        endState: new TokenState(st.line + 1),
      };
    },
  });
  
  // Sends the crate data to rust-analyzer
  await state.init(JSON.stringify(crate));

  let handle: any;

  let model = monaco.editor.createModel(exampleCode, modeId); 
  async function update() {
    const text = model.getValue();
    const res = await state.update(text);
    console.log('res: ', res);
    monaco.editor.setModelMarkers(model, modeId, res.diagnostics);
    allTokens.length=0;
    allTokens.push(...res.highlights);
    setTokens(allTokens);
    console.log('alLTokens.length: ', allTokens.length);
  }
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
      start(divNode, numbering, minimap, isDark).then(
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
