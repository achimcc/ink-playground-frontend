import React from "react";
import { downloadBlob } from "../../integration/integration";
import { usePlayground } from "../../context";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";

const Compile = () => {
  const { isCompiling, requestCompile, blob } = usePlayground();
  const onCompile = () => requestCompile();
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
                  result.contract
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
