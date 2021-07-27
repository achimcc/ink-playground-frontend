import { WorldState } from "../wasm/wasm_demo";

// Create an RA Web worker
export const createRa = async (): Promise<WorldState> => {
  const worker = new Worker(new URL("./ra-worker.ts", import.meta.url));
  const pendingResolve: { [index: string]: any } = {};

  let id = 1;
  let ready: (value: any) => void;

  type Which = keyof WorldState;

  const callWorker = async (which: Which, ...args: any[]) => {
    return new Promise((resolve, _) => {
      pendingResolve[id] = resolve;
      worker.postMessage({
        which: which,
        args: Array.prototype.slice.call(args),
        id: id,
      });
      id += 1;
    });
  };

  const proxyHandler = {
    get: (target: object, prop: Which | "then", _receiver: any) => {
      if (prop == "then") {
        return Reflect.get(target, prop, _receiver);
      }
      return async (...args: any[]) => {
        return callWorker(prop, ...Array.prototype.slice.call(args));
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
