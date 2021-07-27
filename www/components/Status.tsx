import React, { useEffect, useRef } from "react";
import { Messages } from "primereact/messages";
import { usePlayground } from "../context";

const Status = () => {
  const msgs1 = useRef(null);
  const { messages } = usePlayground();
  useEffect(() => {
    (msgs1 as any).current.show(messages);
    const objDiv = document.getElementById("message_scroll");
    if (objDiv) {
      setTimeout(() => {
        objDiv.scrollTop = objDiv.scrollHeight - objDiv.clientHeight;
      }, 500);
    }
  }, [messages]);
  return (
    <div id="message_scroll" style={{ height: "100%", overflowY: "scroll" }}>
      <h1>Status:</h1>
      <Messages ref={msgs1} />
    </div>
  );
};

export default Status;
