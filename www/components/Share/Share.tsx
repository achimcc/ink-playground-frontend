import React, { useState } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { performGistSave } from "../../integration/integration";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";

import { usePlayground } from "../../context";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { PLAYGROUND_URL } from "../../config/constants";

const Share = () => {
  const { uri, dispatch, playgroundUrl, gistUrl, gistId } = usePlayground();
  const [loading, setLoading] = useState(false);
  const requestShare = () => {
    setLoading(true);
    const model = monaco.editor.getModel(uri as any);
    const code = model?.getValue() as string;
    dispatch({
      type: "LOG_MESSAGE",
      payload: {
        severity: "info",
        summary: "Creating Gist...",
        detail: ``,
        sticky: true,
        closable: false,
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
            detail: `Url to Gist: ${gistUrl} <br> \n Link to Playground: ${gistId}`,
            summary: `Published`,
            sticky: true,
            closable: false,
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
            detail: `${error}`,
            summary: `Communication Error`,
            sticky: true,
            closable: false,
          },
        });
      });
  };
  return (
    <Card
      title="Generate and Share Links to your Code:"
      style={{ width: "100%" }}
    >
      <Button
        label="Generate Gists and Links for Sharing"
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
          <LinkPanel url={gistUrl as string} title="Link to Github Gist: " />
        </>
      )}
    </Card>
  );
};

const LinkPanel = ({ url, title }: { url: string; title: string }) => (
  <Fieldset style={{ marginTop: "1em" }} legend={title}>
    <div style={{ display: "table" }}>
      <div style={{ display: "table-cell", verticalAlign: "middle" }}>
        <a href={url}>{url}</a>
      </div>
      <div style={{ display: "table-cell", paddingLeft: "1em" }}>
        <Button
          icon="pi pi-copy"
          onClick={() => window.navigator.clipboard.writeText(url)}
        />
      </div>
    </div>
  </Fieldset>
);

export default Share;
