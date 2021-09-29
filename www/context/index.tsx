import React, { useReducer, useContext } from "react";
import type { Reducer } from "react";
import { parseRequest, performCompile } from "../integration/integration";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export interface PlaygroundState {
  isDarkMode: boolean;
  isMiniMap: boolean;
  isNumbering: boolean;
  dispatch: any;
  uri: any;
  isLoading: boolean;
  requestCompile: Function;
  messages: Array<Message>;
  gistId: string | null;
  gistUrl: string | null;
  isCompiling: boolean;
  blob: Blob | null;
  playgroundUrl: string | null;
}

export type Message = {
  severity: "info" | "error" | "success";
  prompt: String;
  text: String;
};

export type PlaygroundAction =
  | { type: "LOG_MESSAGE"; payload: Message }
  | { type: "SET_DARKMODE"; payload: boolean }
  | { type: "SET_NUMBERING"; payload: boolean }
  | { type: "SET_MINIMAP"; payload: boolean }
  | { type: "SET_URI"; payload: any }
  | { type: "SET_BLOB"; payload: Blob }
  | { type: "SET_RA_LOADING"; payload: boolean }
  | { type: "SET_COMPILING"; payload: boolean }
  | {
      type: "SET_GIST";
      payload: { gistId: string; gistUrl: string; playgroundUrl: string };
    };

const INIT_STATE: PlaygroundState = {
  isDarkMode: true,
  isNumbering: true,
  isMiniMap: true,
  dispatch: null,
  requestCompile: () => null,
  uri: null,
  isLoading: true,
  gistId: null,
  gistUrl: null,
  isCompiling: false,
  blob: null,
  playgroundUrl: null,
  messages: [
    {
      severity: "info",
      prompt: "Welcome! ",
      text: ` Loading rust analyzer...`,
    },
  ],
};

export const appReducer: Reducer<PlaygroundState, PlaygroundAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "SET_DARKMODE":
      return { ...state, isDarkMode: action.payload };
    case "SET_NUMBERING":
      return { ...state, isNumbering: action.payload };
    case "SET_MINIMAP":
      return { ...state, isMiniMap: action.payload };
    case "SET_URI":
      return { ...state, uri: action.payload };
    case "SET_GIST": {
      return { ...state, ...action.payload };
    }
    case "SET_BLOB": {
      return { ...state, blob: action.payload };
    }
    case "SET_COMPILING": {
      return { ...state, isCompiling: action.payload };
    }
    case "SET_RA_LOADING": {
      return { ...state, isLoading: action.payload };
    }
    case "LOG_MESSAGE": {
      return { ...state, messages: [action.payload, ...state.messages] };
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

export const PlaygroundContext = React.createContext(INIT_STATE);

export const PlaygroundContextProvider = ({
  children,
}: React.PropsWithChildren<Partial<PlaygroundState>>) => {
  const [state, dispatch] = useReducer(appReducer, INIT_STATE);

  const requestCompile = async () => {
    if (state.isCompiling) return;
    dispatch({
      type: "SET_BLOB",
      payload: null,
    });
    dispatch({
      type: "SET_COMPILING",
      payload: true,
    });
    const model = monaco.editor.getModel(state.uri);
    const code = model?.getValue() as string;
    const request = parseRequest(code);
    dispatch({
      type: "LOG_MESSAGE",
      payload: {
        severity: "info",
        prompt: "Compiling:",
        text: `...`,
      },
    });
    await performCompile(request)
      .catch((e) => console.log(e))
      .then((response) => {
        console.log("response: ", response);
        dispatch({
          type: "SET_COMPILING",
          payload: false,
        });
        const code = (response as any).code as Blob;
        const success = (response as any).success as boolean;
        if (!success) {
          dispatch({
            type: "LOG_MESSAGE",
            payload: {
              severity: "error",
              prompt: "Error: ",
              text: (response as any).stderr,
            },
          });
        } else {
          dispatch({
            type: "LOG_MESSAGE",
            payload: {
              severity: "success",
              prompt: "Compiled: ",
              text: (response as any).stdout,
            },
          });
          dispatch({
            type: "SET_BLOB",
            payload: code,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: "LOG_MESSAGE",
          payload: {
            severity: "error",
            prompt: "Error: ",
            text: error,
          },
        });
        dispatch({
          type: "SET_COMPILING",
          payload: false,
        });
      });
  };
  const value = { ...state, dispatch, requestCompile };

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export const usePlayground = () => useContext(PlaygroundContext);
