import React from "react";
import { usePlayground } from "../../context";
import { FaCheckCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Status = () => {
  const { isLoading } = usePlayground();
  return (
    <div
      style={{
        border: "1px solid black",
        display: "table",
      }}
      className="bg-gray-600 text-primary w-full"
    >
      {isLoading ? (
        <div>
          <div style={{ padding: "1px 2px", display: "table-cell" }}>
            <ClipLoader size={12} />
          </div>
          <div style={{ display: "table-cell" }}>Loading Rust-Analyzer...</div>
        </div>
      ) : (
        <>
          <div
            style={{
              padding: "1px 2px",
              display: "table-cell",
              width: "18px",
            }}
          >
            <FaCheckCircle className="text-green-500" />
          </div>
          <div style={{ display: "table-cell" }}>Rust Analyzer Ready</div>
        </>
      )}
    </div>
  );
};

export default Status;
