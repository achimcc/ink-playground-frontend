import init, { initThreadPool, WorldState } from "../../pkg/wasm_demo";

const start = async () => {
  await init();

  // Thread pool initialization with the given number of threads
  // (pass `navigator.hardwareConcurrency` if you want to use all cores).
  await initThreadPool(navigator.hardwareConcurrency);
  type Which = keyof WorldState;

  const state = new WorldState();
  console.log("*** start!");
  onmessage = (e) => {
    console.log("***message! ", e);
    const { which, args, id } = e.data;
    const result = (state[which as Which] as any)(...args);
    postMessage({
      id: id,
      result: result,
    });
  };
};

start().then(() => {
  postMessage({
    id: "ra-worker-ready",
  });
});
