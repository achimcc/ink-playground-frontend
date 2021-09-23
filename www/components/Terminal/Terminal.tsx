import { usePlayground } from "../../context";
import React from "react";

const Terminal = () => {
  const { messages } = usePlayground();
  return (
    <div className="w-full">
      <div
        className="coding inverse-toggle px-5 pt-4 shadow-lg text-primary text-sm font-mono subpixel-antialiased 
              bg-primary  pb-6 leading-normal overflow-hidden h-full"
      >
        <div className="mt-4 flex">
          <span className="text-yellow-300">system &gt;</span>
          <p className="flex-1 typing items-center pl-2">
            Loading Rust Analyzer...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
