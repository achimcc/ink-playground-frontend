import { usePlayground, Message } from "../../context";
import TerminalMessage from "./Message";
import React from "react";

const Terminal = () => {
  const { messages } = usePlayground();
  return (
    <div className="h-full w-full relative">
      <div
        className="coding inverse-toggle px-5 pt-4 shadow-lg text-primary text-sm font-mono subpixel-antialiased 
              bg-primary  pb-6 leading-normal overflow-y-scroll h-full w-full absolute"
      >
        {messages.map((m) => (
          <TerminalMessage message={m} />
        ))}
      </div>
    </div>
  );
};

export default Terminal;
