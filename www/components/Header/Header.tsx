import React from "react";
import { usePlayground } from "../../context";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Settings, Share } from "../";
import { downloadBlob } from "../../integration/integration";

const Header = () => {
  const { isCompiling, requestCompile, blob } = usePlayground();
  const onCompile = () => requestCompile();
  return (
    <>
      <header className="bg-primary flex flex-row">
        <div className="flex items-center justify-center">
          <h1 className="text-primary font-semibold pl-4">ink! Playground</h1>
        </div>
        <div>
          <Button
            label="Compile"
            loading={isCompiling}
            className="bg-primary text-primary transform scale-75 border-0"
            icon="pi pi-play"
            onClick={onCompile}
          />
        </div>
        <div className="ctn-download-btn">
          <Button
            label="Download"
            className="bg-primary text-primary transform scale-75 border-0"
            icon="pi pi-download"
            disabled={!blob}
            onClick={() => downloadBlob(blob as Blob)}
          />
        </div>
        <Tooltip target=".ctn-download-btn">
          {!blob
            ? "Compile first to download .contract bundle"
            : "Click to Download .contract bundle"}
        </Tooltip>
        <div>
          <Share />
        </div>
        <div>
          <Settings />
        </div>
      </header>
    </>
  );
};

export default Header;
