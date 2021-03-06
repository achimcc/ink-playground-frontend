import React, { useState, useRef, useEffect } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { usePlayground } from "../../context";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { performGistSave } from "../../integration/integration";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";
import { ShareIcon } from "@heroicons/react/solid";

import { PLAYGROUND_URL } from "../../config/constants";

const Share = () => {
  const { uri, dispatch, playgroundUrl, gistUrl, gistId } = usePlayground();
  const op = useRef(null);
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      op.current.hide();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMounted.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [loading, setLoading] = useState(false);
  const requestShare = () => {
    if (loading) return;
    setLoading(true);
    const model = monaco.editor.getModel(uri as any);
    const code = model?.getValue() as string;
    dispatch({
      type: "LOG_MESSAGE",
      payload: {
        severity: "info",
        prompt: "Creating Gist...",
        text: ``,
      },
    });
    performGistSave(code)
      .then((response) => {
        console.log("response: ", response);
        const { id: gistId = null, url: gistUrl = null } = response as any;
        const playgroundUrl = `${PLAYGROUND_URL}/?id=${gistId}`;
        dispatch({
          type: "LOG_MESSAGE",
          payload: {
            severity: "success",
            text: `Url to Gist: ${gistUrl} <br> \n Link to Playground: ${PLAYGROUND_URL}/?id=${gistId}`,
            prompt: `Gist published`,
          },
        });
        dispatch({
          type: "SET_GIST",
          payload: { gistId, gistUrl, playgroundUrl },
        });
        setLoading(false);
      })
      .catch((error) => {
        dispatch({
          type: "LOG_MESSAGE",
          payload: {
            severity: "error",
            text: `${error}`,
            prompt: `Communication Error`,
          },
        });
        setLoading(false);
      });
  };

  return (
    <div>
      <Button
        type="button"
        onClick={(e) => op.current.toggle(e)}
        aria-haspopup
        aria-controls="overlay_panel"
        className="bg-primary text-primary text-xs border-0"
      >
        <ShareIcon className="w-4 h-4 mr-2 text-primary" />
        Share
      </Button>
      <OverlayPanel
        ref={op}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "700px" }}
        className="bg-elevation-2 text-primary"
      >
        <>
          <Button
            label="Create Gist"
            className="bg-primary text-primary text-xs border-0"
            loading={loading}
            icon="pi pi-share-alt"
            onClick={requestShare}
          />
          {gistId && (
            <>
              <Divider />
              <LinkPanel
                url={playgroundUrl as string}
                title="Link to Playground: "
              />
              <LinkPanel
                url={gistUrl as string}
                title="Link to Github Gist: "
              />
            </>
          )}
        </>
      </OverlayPanel>
    </div>
  );
};

const LinkPanel = ({ url, title }: { url: string; title: string }) => (
  <Fieldset
    className="bg-primary text-primary scale-75 transform"
    style={{ marginTop: "1em" }}
    legend={title}
  >
    <div style={{ display: "table" }}>
      <div style={{ display: "table-cell", verticalAlign: "middle" }}>
        <a href={url}>{url}</a>
      </div>
      <div style={{ display: "table-cell", paddingLeft: "1em" }}>
        <Button
          icon="pi pi-copy"
          className="bg-primary text-primary transform border-0"
          onClick={() => window.navigator.clipboard.writeText(url)}
        />
      </div>
    </div>
  </Fieldset>
);

export default Share;
