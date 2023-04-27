import React, { useState } from "react";
import PortsPopup from "./PortsPopUp.js";
import "./NewAccessRule.css";

const Page3 = ({ ruleAppliesTo, handleRuleAppliesToChange }) => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isPortsPopupOpen, setIsPortsPopupOpen] = useState(false);

    const handleAddItem = () => {
        setItems([...items, "Added"]);
    };

    const handleRemoveItems = () => {
        setItems(items.filter((_, index) => !selectedItems.has(index)));
        setSelectedItems(new Set());
    };

    const handleSelectItem = (index, event) => {
    if (event.ctrlKey) {
        if (selectedItems.has(index)) {
            setSelectedItems((prevSelectedItems) => {
                const updatedSet = new Set(prevSelectedItems);
                updatedSet.delete(index);
                return updatedSet;
        });
        } else {
            setSelectedItems((prevSelectedItems) => new Set([...prevSelectedItems, index]));
        }
    } else {
        setSelectedItems(new Set([index]));
    }
    };

    const handlePortsClick = () => {
      setIsPortsPopupOpen(true);
    };
  
    const handleClosePortsPopup = () => {
      setIsPortsPopupOpen(false);
    };

    const handleSavePortsPopup = (data) => {
        console.log("Saved data:", data);
        // Save the data as needed
      };

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
            <div className="page3-items">
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
            <div className="page3-controls">
              <button onClick={handleAddItem}>Add</button>
              <button onClick={handleRemoveItems} disabled={selectedItems.size === 0}>
                Remove
              </button>
              <button onClick={handlePortsClick}>Ports</button>
            </div>
          </div>
            <PortsPopup
            isOpen={isPortsPopupOpen}
            onClose={handleClosePortsPopup}
            onSave={handleSavePortsPopup}
            />
        </>
    );      
};

export default Page3;
