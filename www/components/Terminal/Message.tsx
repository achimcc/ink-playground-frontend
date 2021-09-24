import React from "react";
import { Message } from "../../context";

interface Props {
  message: Message;
}

const TerminalMessage = ({ message: m }: Props) => {
  return (
    <>
      <div className="mt-4 flex">
        <span className="text-yellow-300">{m.prompt} &gt;</span>
        <p className="flex-1 typing items-center pl-2">{m.text}</p>
      </div>
    </>
  );
};

export default TerminalMessage;
