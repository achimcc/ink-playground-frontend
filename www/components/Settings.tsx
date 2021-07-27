import React from "react";
import { usePlayground } from "../context";
import { InputSwitch, InputSwitchChangeParams } from "primereact/inputswitch";

const Settings = () => {
  const { dispatch, isDarkMode, isMiniMap, isNumbering } = usePlayground();
  const toggleDark = (e: InputSwitchChangeParams) =>
    dispatch({ type: "SET_DARKMODE", payload: e.value });
  const toggleMinimap = (e: InputSwitchChangeParams) =>
    dispatch({ type: "SET_MINIMAP", payload: e.value });
  const toggleNumbering = (e: InputSwitchChangeParams) =>
    dispatch({ type: "SET_NUMBERING", payload: e.value });
  return (
    <>
      <h5>Dark Mode</h5>
      <InputSwitch checked={isDarkMode} onChange={toggleDark} />
      <h5>Show Minimap</h5>
      <InputSwitch checked={isMiniMap} onChange={toggleMinimap} />
      <h5>Show Numbering</h5>
      <InputSwitch checked={isNumbering} onChange={toggleNumbering} />
    </>
  );
};

export default Settings;
