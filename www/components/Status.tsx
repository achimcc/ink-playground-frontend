import React, { useEffect, useRef } from "react";
import { Messages } from "primereact/messages";
import { usePlayground } from "../context";

const Status = () => {
  const msgs1 = useRef(null);
  const { messages } = usePlayground();
  useEffect(() => {
    (msgs1 as any).current.show(messages);
  }, [messages]);
  return (
    <div>
      <h1>Status:</h1>
      <Messages ref={msgs1} />
    </div>
  );
};

export default Status;
