import React from "react";
import "../AccessRulePopUp/NewAccessRule.css";

const To = ({
  destinationItems,
  handleAddItem,
  handleRemoveItems,
  handleSelectItem,
  selectedItems,
  errorMessage,
}) => {

  return (
    <>
      <p>This rule will apply to traffic sent from the rule sources to the destinations specified in this page</p>
      <p>This rule applies to traffic sent to these destination</p>
      <div className="page3-container">
        <div className="page3-items">
          {destinationItems.map((item, index) => (
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
        </div>
      </div>
      {errorMessage && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default To;
