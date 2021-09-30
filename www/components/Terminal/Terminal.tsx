import { usePlayground, Message } from "../../context";
import TerminalMessage from "./Message";
import React, { useEffect } from "react";

const Terminal = () => {
  const { messages } = usePlayground();
  useEffect(() => {
    var objDiv = document.getElementById("ctn_terminal");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messages]);
  return (
    <div className="h-full w-full relative">
      <div
        id="ctn_terminal"
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
