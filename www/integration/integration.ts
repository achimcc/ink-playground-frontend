import fetch from "isomorphic-fetch";
import { BACKEND_URL } from "../config/constants";

import {
  CompileRequest,
  CompileConfig,
  Channel,
  Mode,
  Edition,
  AssemblyFlavor,
  DemangleAssembly,
  ProcessAssembly,
} from "./types";

interface ExecuteRequestBody {
  channel: string;
  mode: string;
  crateType: string;
  tests: boolean;
  code: string;
  edition: string;
  backtrace: boolean;
}

interface CompileRequestBody extends ExecuteRequestBody {
  target: string;
  assemblyFlavor: string;
  demangleAssembly: string;
  processAssembly: string;
}

const routes = {
  compile: { pathname: "/compile" },
  execute: { pathname: "/execute" },
  format: { pathname: "/format" },
  clippy: { pathname: "/clippy" },
  miri: { pathname: "/miri" },
  macroExpansion: { pathname: "/macro-expansion" },
  meta: {
    crates: { pathname: "/meta/crates" },
    version: {
      stable: "/meta/version/stable",
      beta: "/meta/version/beta",
      nightly: "/meta/version/nightly",
      rustfmt: "/meta/version/rustfmt",
      clippy: "/meta/version/clippy",
      miri: "/meta/version/miri",
    },
    gist: { pathname: "/meta/gist/" },
  },
};

export function performCompile({
  config,
  crateType,
  backtrace,
  target,
  code,
}: CompileRequest): Promise<Response> {
  const tests = false;
  const body: CompileRequestBody = {
    ...config,
    crateType,
    tests,
    backtrace,
    target,
    code,
  };
  const response = jsonPost(routes.compile, body);
  return response;
}

export function performGistSave(code: string) {
  return jsonPost(routes.meta.gist, { code });
  // TODO: Failure case
}

const buildEndpoint = (urlObj: any): string => {
  // const URL = "https://codingconnects.de";
  // const URL = "http://127.0.0.1:5000";
  return `${BACKEND_URL}${urlObj.pathname}`;
};

export async function performGistLoad(id: string) {
  console.log("get gist from id: ", id);
  const pathname = `${routes.meta.gist.pathname}${id}`;
  const url = buildEndpoint({ pathname });
  return jsonGet(url).then((response) => (response as any).code as string);
}

function jsonGet(urlStr: any) {
  console.log("fetching from: ", urlStr);
  return fetchJson(urlStr, {
    method: "get",
  });
}

function jsonPost(urlObj: any, body: any) {
  const urlStr = buildEndpoint(urlObj);
  return fetchJson(urlStr, {
    method: "post",
    body: JSON.stringify(body),
    //   mode: "no-cors",
  });
}

async function fetchJson(url: string, args: any): Promise<Response> {
  const { headers = {} } = args;
  headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(url, { ...args, headers });
  } catch (networkError) {
    // e.g. server unreachable
    throw {
      error: `Network error: ${networkError.toString()}`,
    };
  }

  let body: Response;
  try {
    body = await response.json();
  } catch (convertError) {
    throw {
      error: `Response was not JSON: ${convertError.toString()}`,
    };
  }

  if (response.ok) {
    // HTTP 2xx
    return body;
  } else {
    // HTTP 4xx, 5xx (e.g. malformed JSON request)
    throw body;
  }
}

export const parseRequest = (code: string): CompileRequest => {
  const config: CompileConfig = {
    channel: Channel.Stable,
    mode: Mode.Release,
    edition: Edition.Rust2018,
    assemblyFlavor: AssemblyFlavor.Att,
    demangleAssembly: DemangleAssembly.Demangle,
    processAssembly: ProcessAssembly.Filter,
  };
  const request: CompileRequest = {
    config,
    crateType: "lib",
    backtrace: false,
    target: "contract",
    code,
  };
  return request;
};

export function downloadBlob(code: any) {
  var blob = new Blob([new Uint8Array(code).buffer]);

  var a = document.createElement("a");
  a.download = "result.contract";
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = ["application/json", a.download, a.href].join(":");
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(a.href);
  }, 1500);
}
