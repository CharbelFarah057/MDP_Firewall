import React from "react";
import "../AccessRulePopUp/NewAccessRule.css";

const From = ({
  sourceItems,
  handleAddItem,
  handleRemoveItems,
  handleSelectItem,
  selectedRuleSources,
  errorMessage,
}) => {

  return (
    <>
      <p>This rule will apply to traffic originating from sources specified in this page</p>
      <p>This rule applies to traffic from these sources:</p>
      <div className="page3-container">
        <div className="page3-items">
          {sourceItems.map((item, index) => (
            <div
              key={index}
              onClick={(event) => handleSelectItem(index, event)}
              className={`item${selectedRuleSources.has(index) ? " selected" : ""}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="page3-controls">
          <button onClick={handleAddItem}>Add</button>
          <button onClick={handleRemoveItems} disabled={selectedRuleSources.size === 0}>
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

export default From;
