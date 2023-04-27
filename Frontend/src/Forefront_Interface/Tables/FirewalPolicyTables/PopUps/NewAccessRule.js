import React, { useState } from "react";
import "./NewAccessRule.css";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import closeIcon from "../../../../Images/cross-close.svg";

const NewAccessRule = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [ruleName, setRuleName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ruleAction, setRuleAction] = useState("deny");
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [ruleAppliesTo, setRuleAppliesTo] = useState("selectedProtocols");

  const handleRuleNameChange = (e) => {
    setRuleName(e.target.value);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 1 && ruleName === "") {
      setErrorMessage("The specified name is not valid.");
    } else {
      setErrorMessage("");
      if (step < 7) {
        setStep(step + 1);
      }
    }
  };

  const handleRuleActionChange = (e) => {
    setRuleAction(e.target.value);
  };

  const handleRuleAppliesToChange = (e) => {
    setRuleAppliesTo(e.target.value);
  };

  const handleExitConfirmation = (confirmExit) => {
    if (confirmExit) {
      setStep(1);
      setRuleName("");
      setErrorMessage("");
      setRuleAction("deny");
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
            handleRuleNameChange={handleRuleNameChange}
            errorMessage={errorMessage}
          />
        )}
        {step === 2 && (
          <Page2
            ruleAction={ruleAction}
            handleRuleActionChange={handleRuleActionChange}
          />
        )}
        {step === 3 && (
            <Page3
            ruleAppliesTo={ruleAppliesTo}
            handleRuleAppliesToChange={handleRuleAppliesToChange}
            />
        )}
        <div className="buttons">
          <button onClick={handleBack} disabled={step === 1}>
            Back
          </button>
          <button onClick={handleNext} disabled={step === 7}>
            Next
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
