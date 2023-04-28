import React, { useState } from "react";
import "./PortsPopUp.css";

const PortsPopup = ({ isOpen, onClose, onSave, radionSaved, FromPortSave, ToPortSaved }) => {
  const [radioValue, setRadioValue] = useState(radionSaved);
  const [fromPort, setFromPort] = useState(FromPortSave);
  const [toPort, setToPort] = useState(ToPortSaved);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRadioChange = (event) => {
    setFromPort(0);
    setToPort(0);
    setRadioValue(event.target.value);
  };

  const handleFromPortChange = (e) => {
    setFromPort(e.target.value);
  };

  const handleToPortChange = (e) => {
    setToPort(e.target.value);
  };

  const handleOk = () => {
    const from = parseInt(fromPort, 10);
    const to = parseInt(toPort, 10);
  
    if (from < 0 || from > 65535 || to < 0 || to > 65535 || to < from) {
      setErrorMessage("Invalid port range.");
      return;
    }
    onSave([radioValue, fromPort, toPort]);
    setErrorMessage("");
    onClose();
  };

  const handleCancel = () => {
    onSave(["anySourcePort", 0, 0])
    onClose();
  };

  return isOpen ? (
        <div className="ports-popup">
        <h4>Source Ports</h4>
        <p>
            When a source port range is specified, the rule only allows client traffic
            originating from the ports in that range.
        </p>
        <div>
            <input
                type="radio"
                id="anySourcePort"
                name="sourcePorts"
                value="anySourcePort"
                checked={radioValue === "anySourcePort"}
                onChange={handleRadioChange}
            />
            <label htmlFor="anySourcePort">Allow traffic from any allowed source port</label>
            <br />
            <input
                type="radio"
                id="limitSourcePort"
                name="sourcePorts"
                value="limitSourcePort"
                checked={radioValue === "limitSourcePort"}
                onChange={handleRadioChange}
            />
            <label htmlFor="limitSourcePort">
                Limit access to traffic from this range of source ports
            </label>
        </div>
        <br />
        <div className={`ports-range${radioValue === "limitSourcePort" ? " enabled" : ""}`}>
            <label htmlFor="fromPort">From:</label>
            <input
                type="text"
                id="fromPort"
                min="0"
                max="65535"
                step={1}
                value={fromPort}
                onChange={handleFromPortChange}
                disabled={radioValue === "anySourcePort"}
            />
            <label htmlFor="toPort">To:</label>
            <input
                type="text"
                id="toPort"
                min="0"
                max="65535"
                step={1}
                value={toPort}
                onChange={handleToPortChange}
                disabled={radioValue === "anySourcePort"}
            />
        </div>
        {errorMessage && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
            {errorMessage}
          </div>
        )}
        <p>
            This range must belong to clients specified in the allowed traffic sources
            for this rule.
        </p>
        <div className="popup-buttons">
            <button onClick={handleOk}>OK</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
        </div>
    ) : null;
};

export default PortsPopup;