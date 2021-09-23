import React from "react";
import { usePlayground } from "../../context";
import { Button } from "primereact/button";
import { Settings, Share } from "../";

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
        <div>
          <Button
            label="Download"
            loading={isCompiling}
            className="bg-primary text-primary transform scale-75 border-0"
            icon="pi pi-download"
            onClick={() => console.log("Download!")}
          />
        </div>
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
