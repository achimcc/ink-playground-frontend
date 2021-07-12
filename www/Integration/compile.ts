import { CompileConfig } from "./types";

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

export function performCompile(
  config: CompileConfig,
  crateType: string,
  backtrace: boolean,
  target: string,
  code: string
): void {
  const tests = false;
  const body: CompileRequestBody = {
    ...config,
    crateType,
    tests,
    backtrace,
    target,
    code,
  };
  const respone = jsonPost(routes.compile, body).catch((json) => {
    throw new Error(`json post error: ${json.error}`);
  });
}

function jsonPost(urlObj: url.UrlObject, body: ExecuteRequestBody) {
  const urlStr = url.format(urlObj);

  return fetchJson(urlStr, {
    method: "post",
    body: JSON.stringify(body),
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
