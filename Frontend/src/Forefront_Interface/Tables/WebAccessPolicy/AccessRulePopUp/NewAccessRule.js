import React, { useState } from "react";
import "./NewAccessRule.css";
import Page1 from "./Pages/Page1";
import { handleRuleNameChange } from "./Utilities/Page1Utilities";
import Page2 from "./Pages/Page2";
import Page3 from "./Pages/Page3";
import {
  handleAddItem, 
  handleRemoveItems, 
  handleSelectItem, } from "./Utilities/Page3-4-5Utilities.js";

const NewAccessRule = ({ 
  isOpen, 
  onClose,
  onFinish,
  Name,
  setName,
  domain,
  setDomain,
  userContext}) => {
  // Next State
  const [step, setStep] = useState(1);
  // Page 1 State
  const [errorMessage, setErrorMessage] = useState("");
  // Page 2 State in AllFirewallPolicyTable.js
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [page2ErrorMessage, setPage2ErrorMessage] = useState("");
  const [domainItems, setDomainItems] = useState('');
  const [selectedomainItems, setSelectedomainItems] = useState(new Set());

  const [accessRuleErrorMessage, setAccessRuleErrorMessage] = useState("");

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 1 && Name === "") {
      setErrorMessage("The specified name is not valid.");
    } else if (step === 2 && domain.length === 0) {
      setPage2ErrorMessage("At least one domain must be added to the list of selected domains.");
    } else if (step === 3) {
        const data =  {
          "name" : Name,
          "domains" : domain,
        }
        // Send data to the server to check for duplicate names
        fetch("http://localhost:3001/api/rules/add/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              handleExitConfirmation(true);
              onFinish();
            } else {
              return response.json().then((errorData) => {
                  setAccessRuleErrorMessage(errorData.message)
              });
            }
          })
      }
    else {
      setErrorMessage("");
      setPage2ErrorMessage("");
      if (step < 3) {
        setStep(step + 1);
      }
    }
  };

  // Exit Confirmation Code
  const handleExitConfirmation = (confirmExit) => {
    if (confirmExit) {
      setStep(1);
      setName("");
      setErrorMessage("");
      setPage2ErrorMessage("");
      setAccessRuleErrorMessage("");
      setDomain([]);
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
            Name={Name}
            handleRuleNameChange={handleRuleNameChange(setName)}
            errorMessage={errorMessage}
          />
        )}
        {step === 2 && (
          <Page2
            domain={domain}
            handleAddItem={() => handleAddItem(setDomain, domain, domainItems)}
            handleRemoveItems={() => handleRemoveItems(setDomain, domain, selectedomainItems, setSelectedomainItems)}
            handleSelectItem={(index, event) => handleSelectItem(selectedomainItems, setSelectedomainItems)(index, event)}
            selectedomainItems={selectedomainItems}
            errorMessage={page2ErrorMessage}
            setDomainItems={setDomainItems}
          />
        )}
        {step === 3 && (
          <Page3
            Name={Name}
            domain={domain}
          />
        )}
        <div className="buttons">
          <button onClick={handleBack} disabled={step === 1}>
            Back
          </button>
          <button onClick={handleNext}>
            {step === 3 ? "Finish" : "Next"}
          </button>
          <button onClick={() => setShowExitConfirmation(true)}>Cancel</button>
        </div>
        {accessRuleErrorMessage && ( <div className="error-message-container">
          {accessRuleErrorMessage}
        </div>)}
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
