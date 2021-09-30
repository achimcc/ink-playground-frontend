import React from "react";
import { Message } from "../../context";

interface Props {
  message: Message;
}

const severityColors = {
  info: "text-yellow-400",
  success: "text-green-400",
  error: "text-red-400",
};

const TerminalMessage = ({ message: m }: Props) => {
  return (
    <>
      <div className="mt-4 flex">
        <span className={severityColors[m.severity]}>{m.prompt} &gt;</span>
        <p
          className="flex-1 typing items-center pl-2"
          dangerouslySetInnerHTML={{ __html: m.text.toString() }}
        />
      </div>
    </>
  );
};

export default TerminalMessage;
