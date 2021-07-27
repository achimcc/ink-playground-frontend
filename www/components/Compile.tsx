import React from "react";
import { downloadBlob } from "../integration/integration";
import { usePlayground } from "../context";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";

const Compile = () => {
  const { isCompiling, requestCompile, blob } = usePlayground();
  const onCompile = () => requestCompile();
  /*
  const requestCompile = () => {
    setLoading(true);
    const model = monaco.editor.getModel(uri);
    const code = model?.getValue() as string;
    const request = parseRequest(code);
    dispatch({
      type: "LOG_MESSAGE",
      payload: {
        severity: "info",
        summary: "Starting compilation",
        detail: ``,
        sticky: true,
      },
    });
    performCompile(request).then((response) => {
      console.log("resposne: ", response);
      downloadBlob((response as any).code);
      dispatch({
        type: "LOG_MESSAGE",
        payload: {
          severity: "success",
          summary: "Compilation Successfull: ",
          detail: (response as any).stdout,
          sticky: true,
        },
      });
      setLoading(false);
    });
    */
  return (
    <>
      <Card
        title="Compile and Download the Playground Code: "
        style={{ width: "100%" }}
      >
        <Button
          label="Compile"
          loading={isCompiling}
          icon="pi pi-play"
          onClick={onCompile}
        />
        {blob && (
          <>
            <Divider />
            <Fieldset
              style={{ marginTop: "1em" }}
              legend="Compilation Result: "
            >
              <div style={{ display: "table" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  contract.contract
                </div>
                <div style={{ display: "table-cell", paddingLeft: "1em" }}>
                  <Button
                    icon="pi pi-download"
                    onClick={() => downloadBlob(blob as Blob)}
                    loading={isCompiling}
                  />
                </div>
              </div>
            </Fieldset>
          </>
        )}
      </Card>
    </>
  );
};

export default Compile;
