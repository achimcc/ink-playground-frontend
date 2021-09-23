import React, { useState, useEffect, useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { usePlayground } from "../../context";
import { InputSwitch, InputSwitchChangeParams } from "primereact/inputswitch";

const Settings = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const op = useRef(null);
  const isMounted = useRef(false);
  const { dispatch, isDarkMode, isMiniMap, isNumbering } = usePlayground();
  const toggleDark = (e: InputSwitchChangeParams) =>
    dispatch({ type: "SET_DARKMODE", payload: e.value });
  const toggleMinimap = (e: InputSwitchChangeParams) =>
    dispatch({ type: "SET_MINIMAP", payload: e.value });
  const toggleNumbering = (e: InputSwitchChangeParams) =>
    dispatch({ type: "SET_NUMBERING", payload: e.value });

  useEffect(() => {
    if (isMounted.current) {
      op.current.hide();
    }
  }, [selectedProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isMounted.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Button
        type="button"
        icon="pi pi-cog"
        label={"Settings"}
        onClick={(e) => op.current.toggle(e)}
        aria-haspopup
        aria-controls="overlay_panel"
        className="bg-primary text-primary transform scale-75 border-0"
      />
      /*
      <OverlayPanel
        ref={op}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "450px" }}
        className="bg-gray-600 text-primary"
      >
        <>
          <h5>Dark Mode</h5>
          <InputSwitch checked={isDarkMode} onChange={toggleDark} />
          <h5>Show Minimap</h5>
          <InputSwitch checked={isMiniMap} onChange={toggleMinimap} />
          <h5>Show Numbering</h5>
          <InputSwitch checked={isNumbering} onChange={toggleNumbering} />
        </>
      </OverlayPanel>
      */
    </div>
  );
};

export default Settings;
