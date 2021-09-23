import React from "react";
import { usePlayground } from "../../context";
import { FaCheckCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Status = () => {
  const { isLoading } = usePlayground();
  return (
    <div className="table bg-primary text-primary w-full">
      {isLoading ? (
        <div>
          <div className="px-0.5 py-1 table-cell">
            <ClipLoader color={"text-primary"} size={12} />
          </div>
          <div className="table-cell">Loading Rust-Analyzer...</div>
        </div>
      ) : (
        <>
          <div className="px-0.5 py-1 table-cell w-5">
            <FaCheckCircle className="text-green-500" />
          </div>
          <div className="table-cell">Rust Analyzer Ready</div>
        </>
      )}
    </div>
  );
};

export default Status;
