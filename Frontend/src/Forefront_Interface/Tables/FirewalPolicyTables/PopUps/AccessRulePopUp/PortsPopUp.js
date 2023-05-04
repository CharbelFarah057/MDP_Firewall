import React, { useState } from "react";
import "./PortsPopUp.css";

const PortsPopup = ({ isOpen, onClose, onSave, radionSaved, FromPortSave, ToPortSaved, protocolSaved }) => {
  const [radioValue, setRadioValue] = useState(radionSaved);
  const [fromPort, setFromPort] = useState(FromPortSave);
  const [toPort, setToPort] = useState(ToPortSaved);
  const [protocol, setProtocol] = useState(protocolSaved);
  const [savedState, setSavedState] = useState([radionSaved, FromPortSave, ToPortSaved, protocolSaved]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    if (event.target.value === "anySourcePort") {
      setFromPort(1);
      setToPort(65535);
    }
    if (event.target.value === "limitSourcePort") {
      setFromPort(0);
      setToPort(0);
    }
  };

  const handleProtocolChange = (event) => {
    setProtocol(event.target.value);
  };

  const handleFromPortChange = (e) => {
    setFromPort(e.target.value);
  };

  const handleToPortChange = (e) => {
    setToPort(e.target.value);
  };

  const handleOk = () => {
    const numberRegex = /^\d+$/;

    if (!numberRegex.test(fromPort) || !numberRegex.test(toPort)) {
      setErrorMessage("Port values must be numbers.");
      return;
    }
    const from = parseInt(fromPort, 10);
    const to = parseInt(toPort, 10);
  
    if (from <= 0 || from > 65535 || to <= 0 || to > 65535 || to < from) {
      setErrorMessage("Invalid port range.");
      return;
    }
    onSave({[radioValue]: [fromPort, toPort, protocol]});
    setErrorMessage("");
    onClose();
  };

  const handleCancel = () => {
    setFromPort(savedState[1]);
    setToPort(savedState[2]);
    setProtocol(savedState[3]);
    setRadioValue(savedState[0]);
    setErrorMessage("");
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
                type="number"
                id="fromPort"
                min="1"
                max="65535"
                step={1}
                value={fromPort}
                onChange={handleFromPortChange}
                disabled={radioValue === "anySourcePort"}
            />
            <label htmlFor="toPort">To:</label>
            <input
                type="number"
                id="toPort"
                min="1"
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
          <div className="radio-container">
            <input
              type="radio"
              id="tcp"
              name="protocol"
              value="tcp"
              checked={protocol === "tcp"}
              onChange={handleProtocolChange}
            />
            <label htmlFor="tcp">TCP</label>
            
            <input
              type="radio"
              id="udp"
              name="protocol"
              value="udp"
              checked={protocol === "udp"}
              onChange={handleProtocolChange}
            />
            <label htmlFor="udp">UDP</label>
          </div>
          <div className="popup-buttons">
              <button onClick={handleOk}>OK</button>
              <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
    ) : null;
};

export default PortsPopup;