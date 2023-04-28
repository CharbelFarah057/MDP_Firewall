import React, { useState } from "react";
import "./NewAccessRule.css";
import Page1 from "./Page1";
import { handleRuleNameChange } from "./Page1Utilities";
import Page2 from "./Page2";
import { handleRuleActionChange } from "./Page2Utilities";
import Page3 from "./Page3";
import Page4 from "./Page4";
import Page5 from "./Page5";
import { handleRuleAppliesToChange, handleAddItem, handleRemoveItems, handleSelectItem, handleSavePortsPopup } from "./Page3-4-5Utilities";
import Page6 from "./Page6";
import Page7 from "./Page7";

const NewAccessRule = ({ isOpen, onClose }) => {
  // Next State
  const [step, setStep] = useState(1);
  // Page 1 State
  const [ruleName, setRuleName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Page 2 State
  const [ruleAction, setRuleAction] = useState("deny");
  // Exit Confirmation State
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  // Page 3 States 
  const [ruleAppliesTo, setRuleAppliesTo] = useState("selectedProtocols");
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [page3ErrorMessage, setPage3ErrorMessage] = useState("");
  const [PortsPopupData, setPortsPopupData] = useState([
    "anySourcePort",
    0,
    0,
  ]);
  // Page 4 State
  const [sourceItems, setSourceItems] = useState([]);
  const [selectedRuleSources, setSelectedRuleSources] = useState(new Set());
  const [page4ErrorMessage, setPage4ErrorMessage] = useState("");
  // Page 5 State
  const [destinationItems, setDestinationItems] = useState([]);
  const [selectedRuleDestinations, setSelectedRuleDestinations] = useState(new Set());
  const [page5ErrorMessage, setPage5ErrorMessage] = useState("");

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 1 && ruleName === "") {
      setErrorMessage("The specified name is not valid.");
    } else if (step === 3 && items.length === 0) {
      setPage3ErrorMessage("At least one protocol must be added to the list of selected protocols.");
    } else if (step === 4 && sourceItems.length === 0) {
      setPage4ErrorMessage("At least one source must be added to the list of selected sources.");
    } else if (step === 5 && destinationItems.length === 0) {
      setPage5ErrorMessage("At least one destination must be added to the list of selected destinations.");
    } else {
      setErrorMessage("");
      setPage3ErrorMessage("");
      if (step < 7) {
        setStep(step + 1);
      }
    }
  };

  // Exit Confirmation Code
  const handleExitConfirmation = (confirmExit) => {
    if (confirmExit) {
      setStep(1);
      setRuleName("");
      setErrorMessage("");
      setRuleAction("deny");
      setRuleAppliesTo("selectedProtocols");
      setItems([]);
      setSelectedItems(new Set());
      setPage3ErrorMessage("");
      setShowExitConfirmation(false);
      onClose();
    } else {
      setShowExitConfirmation(false);
    }
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={() => setShowExitConfirmation(true)}>
          &times;
        </button>
        {step === 1 && (
          <Page1
            ruleName={ruleName}
            handleRuleNameChange={handleRuleNameChange(setRuleName)}
            errorMessage={errorMessage}
          />
        )}
        {step === 2 && (
          <Page2
            ruleAction={ruleAction}
            handleRuleActionChange={handleRuleActionChange(setRuleAction)}
          />
        )}
        {step === 3 && (
          <Page3
            ruleAppliesTo={ruleAppliesTo}
            handleRuleAppliesToChange={handleRuleAppliesToChange(setRuleAppliesTo)}
            items={items}
            handleAddItem={() => handleAddItem(setItems, items)}
            handleRemoveItems={() => handleRemoveItems(setItems, items, selectedItems, setSelectedItems)}
            handleSelectItem={(index, event) => handleSelectItem(selectedItems, setSelectedItems)(index, event)}
            selectedItems={selectedItems}
            errorMessage={page3ErrorMessage}
            PortsPopupData={PortsPopupData}
            handleSavePortsPopup={handleSavePortsPopup(setPortsPopupData)}
          />
        )}
        {step === 4 && (
          <Page4
            sourceItems={sourceItems}
            handleAddItem={() => handleAddItem(setSourceItems, sourceItems)}
            handleRemoveItems={() => handleRemoveItems(setSourceItems, sourceItems, selectedRuleSources, setSelectedRuleSources)}
            handleSelectItem={(index, event) => handleSelectItem(selectedRuleSources, setSelectedRuleSources)(index, event)}
            selectedItems={selectedRuleSources}
            errorMessage={page4ErrorMessage}
          />
        )}
        {step === 5 && (
          <Page5
            destinationItems={destinationItems}
            handleAddItem={() => handleAddItem(setDestinationItems, destinationItems)}
            handleRemoveItems={() => handleRemoveItems(setDestinationItems, destinationItems, selectedRuleDestinations, setSelectedRuleDestinations)}
            handleSelectItem={(index, event) => handleSelectItem(selectedRuleDestinations, setSelectedRuleDestinations)(index, event)}
            selectedItems={selectedRuleDestinations}
            errorMessage={page5ErrorMessage}
          />
        )}
        {step === 6 && <Page6 />}
        {step === 7 && (<Page7 
          ruleName={ruleName}
          ruleAction={ruleAction}
          ruleAppliesTo={ruleAppliesTo}
          items={items}
          sourceItems={sourceItems}
          selectedRuleSources={selectedRuleSources}
          destinationItems={destinationItems}        
        />)}
        <div className="buttons">
          <button onClick={handleBack} disabled={step === 1}>
            Back
          </button>
          <button onClick={handleNext}>
            {step === 7 ? "Finish" : "Next"}
          </button>
          <button onClick={() => setShowExitConfirmation(true)}>Cancel</button>
        </div>
      </div>
      {showExitConfirmation && (
        <div className="exit-confirmation">
          <p>Are you sure you want to exit Access Rule Wizard?</p>
          <p>All your choices will be lost.</p>
          <button onClick={() => handleExitConfirmation(true)}>Yes</button>
          <button onClick={() => handleExitConfirmation(false)}>No</button>
        </div>
      )}
    </div>
  ) : null;
};

export default NewAccessRule;
