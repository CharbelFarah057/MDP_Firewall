import React, { useState, useEffect } from "react";
import PortsPopup from "../PortsPopUp.js";
import ChoseProtocol from "../ChoseProtocol.js";
import portToProtocol from "../../../../Data/Port_to_protocolData"
import "../NewAccessRule.css";

const Page3 = ({
  ruleAppliesTo,
  handleRuleAppliesToChange,
  items,
  handleAddItem,
  itemsValue,
  setItemsValue,
  parseItems,
  handleRemoveItems,
  handleSelectItem,
  selectedItems,
  errorMessage,
  PortsPopupData,
  handleSavePortsPopup,
  folderselectedItems,
  handleFolderSelectItem,
}) => {
  const [isPortsPopupOpen, setIsPortsPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  useEffect(() => {
    parseItems();
  }, [items]);

  const handleClosePortsPopup = () => {
    setIsPortsPopupOpen(false);
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleAddClick = () => {
    setIsAddPopupOpen(true);
  };

  const handlePortsClick = () => {
    setIsPortsPopupOpen(true);
  };

  const disableLowerPart = ruleAppliesTo === "allOutbound";

  return (
    <>
      <h3>Protocols</h3>
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
          {items.map((item, index) => {
            const [port, protocol] = item.split(",");
            let protocolNames = portToProtocol[port];
            const displayName = protocolNames.length > 1 ? protocolNames.join(', ') : protocolNames[0];
            return (
              <div
                key={index}
                onClick={(event) => handleSelectItem(index, event)}
                className={`item${selectedItems.has(index) ? " selected" : ""}`}
              >
                {displayName}
              </div>
            )
          })}
        </div>
        <div className={`page3-controls${disableLowerPart ? " disabled" : ""}`}>
            <button onClick={handleAddClick} disabled={disableLowerPart}> Add</button>
            <button onClick={handleRemoveItems} disabled={disableLowerPart || selectedItems.size === 0}
          >
            Remove
          </button>
          <button onClick={handlePortsClick}>Ports</button>
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
        protocolSaved={Object.values(PortsPopupData)[0][2]}
      />
      <ChoseProtocol
        isOpen={isAddPopupOpen}
        onClose={handleCloseAddPopup}
        handleFolderSelectItem={handleFolderSelectItem}
        folderselectedItems={folderselectedItems}
        addItems={handleAddItem}
        itemsValue={itemsValue}
        setItemsValue={setItemsValue}
      />
    </>
  );
};

export default Page3;