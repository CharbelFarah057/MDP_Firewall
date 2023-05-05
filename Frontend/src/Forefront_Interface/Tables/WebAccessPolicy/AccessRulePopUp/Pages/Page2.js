import React, { useState } from "react";
import "../NewAccessRule.css";

const Page2 = ({
  domain,
  handleAddItem,
  handleRemoveItems,
  handleSelectItem,
  selectedomainItems,
  errorMessage,
  setDomainItems,
}) => {
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setDomainItems(e.target.value);
  };

  return (
    <>
      <h3>Accesss Rules Destination</h3>
      <p>
        This rule will apply to traffic sent from the rule sources to the
        destinations specified in this page
      </p>
      <p>This rule applies to traffic sent to these destination</p>
      <input
        type="text"
        placeholder="Enter domain"
        value={userInput}
        onChange={handleInputChange}
      />
      <div className="page3-container">
        <div className="page3-items">
          {domain.map((item, index) => (
            <div
              key={index}
              onClick={(event) => handleSelectItem(index, event)}
              className={`item${
                selectedomainItems.has(index) ? " selected" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="page3-controls">
          <button onClick={handleAddItem}>Add</button>
          <button
            onClick={handleRemoveItems}
            disabled={selectedomainItems.size === 0}
          >
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

export default Page2;
