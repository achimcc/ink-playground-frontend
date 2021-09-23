import React from "react";
import { usePlayground } from "../../context";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Settings, Share } from "../";
import { downloadBlob } from "../../integration/integration";
import { AcademicCapIcon, ArrowCircleUpIcon, CodeIcon, DownloadIcon, PlayIcon } from '@heroicons/react/solid'

const Header = () => {
  const { isCompiling, requestCompile, blob } = usePlayground();
  const onCompile = () => requestCompile();
  return (
    <>
      <header className="bg-primary flex flex-row">
        <div className="flex items-center justify-center">
          <h1 className="text-primary font-semibold pl-4 mr-3">ink! Playground</h1>
          <div className="w-px h-6 bg-gray-700" />
        </div>
        <div className="flex space-x-2 p-3 items-center">
          <Button
            loading={isCompiling}
            className="bg-primary text-primary text-xs border-0"
            onClick={onCompile}
          >
            <PlayIcon className="w-4 h-4 mr-2 text-primary"/>
            Compile
          </Button>
          <div className="ctn-download-btn">
            <Button
              loading={isCompiling}
              className="bg-primary text-primary text-xs border-0"
              disabled={!blob}
              onClick={() => downloadBlob(blob as Blob)}
            >
              <DownloadIcon className="w-4 h-4 mr-2 text-primary"/>
              Download
            </Button>
          </div>
          <Tooltip
            className="text-primary text-xs"
            target=".ctn-download-btn"
            style={{ backgroundColor: "#242A2E !important" }}
          >
            {!blob
              ? "Compile first to download .contract bundle"
              : "Click to download .contract bundle"}
          </Tooltip>
          <div>
            <Share />
          </div>
          <div>
            <Settings />
          </div>
          </div>
        <div className="flex-grow" />
        <div className="flex space-x-2 p-3">
          <a
            className="flex items-center bg-transparent text-primary text-xs px-3 py-1.5 rounded hover:bg-elevation-2"
            href="https://paritytech.github.io/ink-docs/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <AcademicCapIcon className="w-4 h-4 mr-2 text-primary"/>
            ink! Docs
          </a>
          <a
            className="flex items-center bg-transparent text-primary text-xs px-3 py-1.5 rounded hover:bg-elevation-2"
            href="https://github.com/paritytech/canvas-ui-v2"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ArrowCircleUpIcon className="w-4 h-4 mr-2 text-primary"/>
            Deploy on Canvas UI
          </a>
          <a
            className="flex items-center bg-transparent text-primary text-xs px-3 py-1.5 rounded hover:bg-elevation-2"
            href="https://github.com/paritytech/ink-playground"
            rel="noopener noreferrer"
            target="_blank"
          >
            <CodeIcon className="w-4 h-4 mr-2 text-primary"/>
            Github Repo
          </a>
        </div>
      </header>
    </>
  );
};

export default Header;
