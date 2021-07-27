import React, { useReducer, useEffect, useContext } from "react";
import type { Reducer } from "react";
import {
  downloadBlob,
  parseRequest,
  performCompile,
} from "../integration/integration";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export interface PlaygroundState {
  isDarkMode: boolean;
  isMiniMap: boolean;
  isNumbering: boolean;
  dispatch: any;
  uri: any;
  requestCompile: Function;
  messages: Array<Object>;
  gistId: string | null;
  gistUrl: string | null;
  isCompiling: boolean;
  blob: Blob | null;
  playgroundUrl: string | null;
}

export type PlaygroundAction =
  | { type: "LOG_MESSAGE"; payload: string }
  | { type: "SET_DARKMODE"; payload: boolean }
  | { type: "SET_NUMBERING"; payload: boolean }
  | { type: "SET_MINIMAP"; payload: boolean }
  | { type: "LOG_MESSAGE"; payload: object }
  | { type: "SET_URI"; payload: any }
  | { type: "SET_BLOB"; payload: Blob }
  | { type: "SET_COMPILING"; payload: boolean }
  | {
      type: "SET_GIST";
      payload: { gistId: string; gistUrl: string; playgroundUrl: string };
    };

const INIT_STATE: PlaygroundState = {
  isDarkMode: true,
  isNumbering: false,
  isMiniMap: false,
  dispatch: null,
  requestCompile: () => null,
  uri: null,
  gistId: null,
  gistUrl: null,
  isCompiling: false,
  blob: null,
  playgroundUrl: null,
  messages: [
    {
      severity: "info",
      summary: "Welcome! ",
      detail: ` Loading rust analyzer...`,
      sticky: true,
      closable: false,
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
      console.log("set gist: ", action.payload);
      return { ...state, ...action.payload };
    }
    case "SET_BLOB": {
      return { ...state, blob: action.payload };
    }
    case "SET_COMPILING": {
      return { ...state, isCompiling: action.payload };
    }
    case "LOG_MESSAGE":
      return { ...state, messages: [action.payload, ...state.messages] };
    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

export const PlaygroundContext = React.createContext(INIT_STATE);

export const PlaygroundContextProvider = ({
  children,
}: React.PropsWithChildren<Partial<PlaygroundState>>) => {
  const [state, dispatch] = useReducer(appReducer, INIT_STATE);

  // const { isDarkMode, isNumbering, isMiniMap } = state;

  const requestCompile = async () => {
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
        summary: "Starting compilation",
        detail: ``,
        sticky: true,
      },
    });
    await performCompile(request)
      .then((response) => {
        console.log("response: ", response);
        const code = (response as any).code as Blob;
        const success = (response as any).success as boolean;
        if (!success) {
          dispatch({
            type: "LOG_MESSAGE",
            payload: {
              severity: "error",
              summary: "Compilation Error: ",
              detail: (response as any).stderr,
              sticky: true,
              closable: false,
            },
          });
        } else {
          dispatch({
            type: "LOG_MESSAGE",
            payload: {
              severity: "success",
              summary: "Compilation Successfull: ",
              detail: (response as any).stdout,
              sticky: true,
              closable: false,
            },
          });
          dispatch({
            type: "SET_BLOB",
            payload: code,
          });
          dispatch({
            type: "SET_COMPILING",
            payload: false,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: "LOG_MESSAGE",
          payload: {
            severity: "error",
            summary: "Communication Error: ",
            detail: error,
            sticky: true,
            closable: false,
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
