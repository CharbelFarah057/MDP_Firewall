import React from "react";
import "./NewAccessRule.css";

const Page4 = ({
  sourceItems,
  handleAddItem,
  handleRemoveItems,
  handleSelectItem,
  selectedItems,
  errorMessage,
}) => {

  return (
    <>
      <h3>Accesss Rules Sources</h3>
      <p>This rule will apply to traffic originating from sources specified in this page</p>
      <p>This rule applies to traffic from these sources:</p>
      <div className="page3-container">
        <div className="page3-items">
          {sourceItems.map((item, index) => (
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

export default Page4;
