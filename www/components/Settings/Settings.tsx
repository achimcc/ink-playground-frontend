import React, { useState, useEffect, useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { usePlayground } from "../../context";
import { InputSwitch, InputSwitchChangeParams } from "primereact/inputswitch";
import { CogIcon } from '@heroicons/react/solid'

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
        onClick={(e) => op.current.toggle(e)}
        aria-haspopup
        aria-controls="overlay_panel"
        className="bg-primary text-primary text-xs border-0"
      >
        <CogIcon className="w-4 h-4 mr-2 text-primary"/>
        Settings
      </Button>
      /*
      <OverlayPanel
        ref={op}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "450px" }}
        className="bg-elevation-2 text-primary"
      >
        <>
          <h5 className="mb-2 text-sm">Dark Mode</h5>
          <InputSwitch className="mb-4" checked={isDarkMode} onChange={toggleDark} />
          <h5 className="mb-2 text-sm">Show Minimap</h5>
          <InputSwitch className="mb-4" checked={isMiniMap} onChange={toggleMinimap} />
          <h5 className="mb-2 text-sm">Show Numbering</h5>
          <InputSwitch className="mb-4" checked={isNumbering} onChange={toggleNumbering} />
        </>
      </OverlayPanel>
      */
    </div>
  );
};

export default Settings;
