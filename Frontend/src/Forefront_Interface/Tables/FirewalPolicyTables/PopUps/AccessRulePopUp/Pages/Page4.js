import React from "react";
import "../NewAccessRule.css";
import NetworkChoicePopUp from "../NetworkChoicePopUp.js";

const Page4 = ({
  sourceItems,
  handleAddItem,
  handleRemoveItems,
  handleSelectItem,
  selectedRuleSources,
  errorMessage,
  sourceselectedItems,
  handleSourceSelectItem,
  sourceItemsValue,
  setSourceItemsValue
}) => {

  const [isopenAddPopup, setIsOpenAddPopup] = React.useState(false);

  const handleAddPopupOpen = () => {
    setIsOpenAddPopup(true);
  };

  const handleAddPopupClose = () => {
    setIsOpenAddPopup(false);
  };

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
              className={`item${selectedRuleSources.has(index) ? " selected" : ""}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="page3-controls">
          <button onClick={handleAddPopupOpen}>Add</button>
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
      <NetworkChoicePopUp
        isOpen={isopenAddPopup}
        onClose={handleAddPopupClose}
        handleSourceSelectItem={handleSourceSelectItem}
        sourceselectedItems={sourceselectedItems}
        addItems={handleAddItem}
        itemsValue={sourceItemsValue}
        setItemsValue={setSourceItemsValue}
      />
    </>
  );
};

export default Page4;
