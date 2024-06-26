import React, { useState } from "react";
import PortsPopup from "./PortsPopUp.js";
import "../AccessRulePopUp/NewAccessRule.css";

const Protocols = ({
  ruleAppliesTo,
  handleRuleAppliesToChange,
  items,
  handleAddItem,
  handleRemoveItems,
  handleSelectItem,
  selectedItems,
  errorMessage,
  PortsPopupData,
  handleSavePortsPopup
}) => {
  const [isPortsPopupOpen, setIsPortsPopupOpen] = useState(false);

  const handleClosePortsPopup = () => {
    setIsPortsPopupOpen(false);
  };

  const handlePortsClick = () => {
    setIsPortsPopupOpen(true);
  };

  const disableLowerPart = ruleAppliesTo === "allOutbound";

  return (
    <>
      <p>Select the protocols this rule applies to.</p>
      <p>This rule applies to:</p>
      <select
        value={ruleAppliesTo}
        onChange={handleRuleAppliesToChange}
        className="rule-applies-to-select"
      >
        <option value="allOutbound">All outbound traffic</option>
        <option value="selectedProtocols">Selected protocols</option>
        <option value="allOutboundExcept">All outbound traffic except selected</option>
      </select>
      <p>Protocols:</p>
      <div className="page3-container">
        <div className={`page3-items${disableLowerPart ? " disabled" : ""}`}>
          {items.map((item, index) => (
            <div
              key={index}
              onClick={(event) => handleSelectItem(index, event)}
              className={`item${selectedItems.has(index) ? " selected" : ""}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={`page3-controls${disableLowerPart ? " disabled" : ""}`}>
            <button onClick={handleAddItem} disabled={disableLowerPart}> Add</button>
          <button onClick={handleRemoveItems} disabled={disableLowerPart || selectedItems.size === 0}
          >
            Remove
          </button>
          <button onClick={handlePortsClick} >Ports</button>
        </div> 
      </div>
      {errorMessage && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {errorMessage}
        </div>
      )}
      <PortsPopup
        isOpen={isPortsPopupOpen}
        onClose={handleClosePortsPopup}
        onSave={handleSavePortsPopup}
        radionSaved={Object.keys(PortsPopupData)[0]}
        FromPortSave={Object.values(PortsPopupData)[0][0]}
        ToPortSaved={Object.values(PortsPopupData)[0][1]}
      />
    </>
  );
};

export default Protocols;
