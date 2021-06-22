// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import * as rustConf from "monaco-editor/esm/vs/basic-languages/rust/rust";
import "./index.css";

import { WorldState } from "../../pkg/wasm_demo";
// @ts-ignore
// type Monaco = typeof monaco;

const modeId = "ra-rust";

export const configureLanguage =
  (monaco: any, state: WorldState, allTokens: any[]) => async () => {
    monaco.languages.register({
      // language for editor
      id: modeId,
    });
    monaco.languages.register({
      // language for hover info
      id: "rust",
    });

    // monaco.languages.setLanguageConfiguration("rust", rustConf.conf);
    // monaco.languages.setMonarchTokensProvider("rust", rustConf.language);
    monaco.languages.registerHoverProvider(modeId, {
      // @ts-ignore
      provideHover: (_, pos) => state.hover(pos.lineNumber, pos.column),
    });
    monaco.languages.registerCodeLensProvider(modeId, {
      // @ts-ignore
      async provideCodeLenses(m) {
        const code_lenses = await state.code_lenses();
        const lenses = code_lenses.map(({ range, command }: any) => {
          const position = {
            column: range.startColumn,
            lineNumber: range.startLineNumber,
          };

          const references = command.positions.map((pos: any) => ({
            range: pos,
            uri: m.uri,
          }));
          return {
            range,
            command: {
              id: command.id,
              title: command.title,
              arguments: [m.uri, position, references],
            },
          };
        });

        return { lenses, dispose() {} };
      },
    });
    monaco.languages.registerReferenceProvider(modeId, {
      // @ts-ignore
      async provideReferences(m, pos, { includeDeclaration }) {
        const references = await state.references(
          pos.lineNumber,
          pos.column,
          includeDeclaration
        );
        if (references) {
          return references.map(({ range }: any) => ({ uri: m.uri, range }));
        }
      },
    });
    monaco.languages.registerDocumentHighlightProvider(modeId, {
      // @ts-ignore
      async provideDocumentHighlights(_, pos) {
        return await state.references(pos.lineNumber, pos.column, true);
      },
    });

    monaco.languages.registerRenameProvider(modeId, {
      // @ts-ignore
      async provideRenameEdits(m, pos, newName) {
        const edit = await state.rename(pos.lineNumber, pos.column, newName);
        if (edit) {
          return {
            edits: [
              {
                resource: m.uri,
                edit,
              },
            ],
          };
        }
      },
      // @ts-ignore
      async resolveRenameLocation(_, pos) {
        return state.prepare_rename(pos.lineNumber, pos.column);
      },
    });

    monaco.languages.registerCompletionItemProvider(modeId, {
      triggerCharacters: [".", ":", "="],
      // @ts-ignore
      async provideCompletionItems(_m, pos) {
        const suggestions = await state.completions(pos.lineNumber, pos.column);
        if (suggestions) {
          return { suggestions };
        }
      },
    });
    monaco.languages.registerSignatureHelpProvider(modeId, {
      signatureHelpTriggerCharacters: ["(", ","],
      // @ts-ignore
      async provideSignatureHelp(_m, pos) {
        const value = await state.signature_help(pos.lineNumber, pos.column);
        if (!value) return null;
        return {
          value,
          dispose() {},
        };
      },
    });
    monaco.languages.registerDefinitionProvider(modeId, {
      // @ts-ignore
      async provideDefinition(m, pos) {
        const list = await state.definition(pos.lineNumber, pos.column);
        if (list) {
          return list.map((def: any) => ({ ...def, uri: m.uri }));
        }
      },
    });
    monaco.languages.registerTypeDefinitionProvider(modeId, {
      // @ts-ignore
      async provideTypeDefinition(m, pos) {
        const list = await state.type_definition(pos.lineNumber, pos.column);
        if (list) {
          return list.map((def: any) => ({ ...def, uri: m.uri }));
        }
      },
    });
    monaco.languages.registerImplementationProvider(modeId, {
      // @ts-ignore
      async provideImplementation(m, pos) {
        const list = await state.goto_implementation(
          pos.lineNumber,
          pos.column
        );
        if (list) {
          return list.map((def: any) => ({ ...def, uri: m.uri }));
        }
      },
    });
    monaco.languages.registerDocumentSymbolProvider(modeId, {
      async provideDocumentSymbols() {
        return await state.document_symbols();
      },
    });
    monaco.languages.registerOnTypeFormattingEditProvider(modeId, {
      autoFormatTriggerCharacters: [".", "="],
      // @ts-ignore
      async provideOnTypeFormattingEdits(_, pos, ch) {
        return await state.type_formatting(pos.lineNumber, pos.column, ch);
      },
    });
    monaco.languages.registerFoldingRangeProvider(modeId, {
      async provideFoldingRanges() {
        return await state.folding_ranges();
      },
    });

    setTokens(monaco, allTokens);
  };

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
    case "builtin_type":
    case "self_type":
    case "bool_literal":
      return "keyword";
    case "value_param":
      return "value";
    case "string_literal":
      return "string";
    case "macro":
      return "number.hex";
    case "literal":
      return "number";
    default:
      return tag;
  }
}

export const setTokens = (monaco: any, allTokens: Array<any>) =>
  // @ts-ignore
  monaco.languages.setTokensProvider(modeId, {
    getInitialState: () => new TokenState(),
    // @ts-ignore
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
