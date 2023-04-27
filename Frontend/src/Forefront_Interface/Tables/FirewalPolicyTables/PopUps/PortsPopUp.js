import React, { useState } from "react";
import "./PortsPopUp.css";

const PortsPopup = ({ isOpen, onClose, onSave }) => {
  const [radioValue, setRadioValue] = useState("anySourcePort");
  const [fromPort, setFromPort] = useState(0);
  const [toPort, setToPort] = useState(0);

  const handleRadioChange = (event) => {
    setFromPort(0);
    setToPort(0);
    setRadioValue(event.target.value);
  };

  const handleFromPortChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 65535) {
      setFromPort(value);
    }
  };
  
  const handleToPortChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 65535 && value >= fromPort) {
      setToPort(value);
    }
  };

  const handleSave = () => {
    onSave({ radioValue, fromPort, toPort });
    onClose();
  };

  const resetState = () => {
    setRadioValue("anySourcePort");
    setFromPort(0);
    setToPort(0);
  };

  const handleCancel = () => {
    resetState();
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
        <p>
            This range must belong to clients specified in the allowed traffic sources
            for this rule.
        </p>
        <div className="popup-buttons">
            <button onClick={handleSave}>OK</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
        </div>
    ) : null;
};

export default PortsPopup;