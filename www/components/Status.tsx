import React, { useEffect, useRef } from "react";
import { Messages } from "primereact/messages";
import { usePlayground } from "../context";

const Status = () => {
  const msgs1 = useRef(null);
  const { messages } = usePlayground();
  useEffect(() => {
    (msgs1 as any).current.show(messages);
    const objDiv = document.getElementById("message_div")?.parentElement;
    if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
  }, [messages]);
  return (
    <div>
      <h1>Status:</h1>
      <Messages ref={msgs1} />
    </div>
  );
};

export default Status;