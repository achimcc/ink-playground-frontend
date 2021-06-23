import { WorldState } from "../../../pkg/wasm_demo";

// Create an RA Web worker
export const createRa = async (): Promise<WorldState> => {
  const worker = new Worker(new URL("./ra-worker.ts", import.meta.url));
  const pendingResolve: { [index: string]: any } = {};

  let id = 1;
  let ready: (value: any) => void;

  const callWorker = async (which: any, ...args: any[]) => {
    return new Promise((resolve, _) => {
      pendingResolve[id] = resolve;
      worker.postMessage({
        which: which,
        args: args,
        id: id,
      });
      id += 1;
    });
  };

  const proxyHandler = {
    get: (target: object, prop: PropertyKey, _receiver: any) => {
      if (prop == "then") {
        return Reflect.get(target, prop, _receiver);
      }
      return async (...args: any[]) => {
        return callWorker(prop, ...args);
      };
    },
  };

  worker.onmessage = (e) => {
    if (e.data.id == "ra-worker-ready") {
      ready(new Proxy({}, proxyHandler));
      return;
    }
    const pending = pendingResolve[e.data.id];
    if (pending) {
      pending(e.data.result);
      delete pendingResolve[e.data.id];
    }
  };

  return new Promise((resolve, _) => {
    ready = resolve;
  });
};
