import React, { useState } from "react";
import "./NewAccessRule.css";
import Page1 from "./Pages/Page1";
import { handleRuleNameChange } from "./Utilities/Page1Utilities";
import Page2 from "./Pages/Page2";
import { handleRuleActionChange } from "./Utilities/Page2Utilities";
import Page3 from "./Pages/Page3";
import Page4 from "./Pages/Page4";
import Page5 from "./Pages/Page5";
import {handleRuleAppliesToChange,
  handleAddItem, 
  handleRemoveItems, 
  handleSelectItem, 
  handleSavePortsPopup,
  parseItems, } from "./Utilities/Page3-4-5Utilities.js";
import Page6 from "./Pages/Page6";
import Page7 from "./Pages/Page7";

const NewAccessRule = ({ 
  isOpen, 
  onClose,
  onFinish,
  ruleName,
  setRuleName,
  ruleAction,
  setRuleAction,
  ruleAppliesTo,
  setRuleAppliesTo,
  tcp_protocol_items,
  setTcp_protocol_items,
  udp_protocol_items,
  setUdp_protocol_items,
  items, 
  setItems,
  PortsPopupData,
  setPortsPopupData,
  sourceItems,
  setSourceItems,
  destinationItems,
  setDestinationItems,
  userContext,
  ruleType}) => {
  // Next State
  const [step, setStep] = useState(1);
  // Page 1 State
  const [errorMessage, setErrorMessage] = useState("");
  // Page 2 State in AllFirewallPolicyTable.js
  // Exit Confirmation State
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  // Page 3 States 
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [page3ErrorMessage, setPage3ErrorMessage] = useState("");
  const [folderselectedItems, setFolderSelectedItems] = useState(new Set());
  const [itemsValue, setItemsValue] = useState([]);
  // Page 4 State
  const [selectedRuleSources, setSelectedRuleSources] = useState(new Set());
  const [page4ErrorMessage, setPage4ErrorMessage] = useState("");
  const [sourceselectedItems, setSourceSelectedItems] = useState(new Set());
  const [sourceItemsValue, setSourceItemsValue] = useState([])
  // Page 5 State
  const [selectedRuleDestinations, setSelectedRuleDestinations] = useState(new Set());
  const [page5ErrorMessage, setPage5ErrorMessage] = useState("");
  const [accessRuleErrorMessage, setAccessRuleErrorMessage] = useState("");
  const [destinationselectedItems, setDestinationSelectedItems] = useState(new Set());
  const [destinationItemsValue, setDestinationItemsValue] = useState([]) 

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    console.log(tcp_protocol_items)
    if (step === 1 && ruleName === "") {
      setErrorMessage("The specified name is not valid.");
    } else if (step === 3 && items.length === 0) {
      setPage3ErrorMessage("At least one protocol must be added to the list of selected protocols.");
    } else if (step === 4 && sourceItems.length === 0) {
      setPage4ErrorMessage("At least one source must be added to the list of selected sources.");
    } else if (step === 5 && destinationItems.length === 0) {
      setPage5ErrorMessage("At least one destination must be added to the list of selected destinations.");
    } else if (step === 7) {
        const data =  {
          "order" : 1,
          "name" : ruleName,
          "action" : ruleAction,
          "tcp_protocol" : { [ruleAppliesTo] : tcp_protocol_items},
          "udp_protocol" : { [ruleAppliesTo] : udp_protocol_items},
          "source_network" : sourceItems,
          "destination_network" : destinationItems,
          "condition" : "All Users",
          "description" : "",
          "ports" : PortsPopupData,
          "rule_type" : ruleType
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
      setRuleAction("Drop");
      setRuleAppliesTo("selectedProtocols");
      setItems([]);
      setSelectedItems(new Set());
      setPage3ErrorMessage("");
      setSourceItems([]);
      setSelectedRuleSources(new Set());
      setPage4ErrorMessage("");
      setDestinationItems([]);
      setSelectedRuleDestinations(new Set());
      setPage5ErrorMessage("");
      setPortsPopupData({"anySourcePort" : [1, 65535, "tcp"]});
      setShowExitConfirmation(false);
      setTcp_protocol_items([]);
      setUdp_protocol_items([]);
      setFolderSelectedItems(new Set());
      setAccessRuleErrorMessage("");
      setItemsValue([]);
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
            handleRuleAppliesToChange={handleRuleAppliesToChange(setRuleAppliesTo, setItems)}
            items={items}
            handleAddItem={() => handleAddItem(setItems, items, itemsValue)}
            itemsValue={itemsValue}
            setItemsValue={setItemsValue}
            parseItems={() => parseItems(items, setTcp_protocol_items, setUdp_protocol_items, tcp_protocol_items, udp_protocol_items)}
            handleRemoveItems={() => handleRemoveItems(setItems, items, selectedItems, setSelectedItems)}
            handleSelectItem={(index, event) => handleSelectItem(selectedItems, setSelectedItems)(index, event)}
            selectedItems={selectedItems}
            errorMessage={page3ErrorMessage}
            PortsPopupData={PortsPopupData}
            handleSavePortsPopup={handleSavePortsPopup(setPortsPopupData)}
            folderselectedItems={folderselectedItems}
            handleFolderSelectItem={(index, event) => handleSelectItem(folderselectedItems, setFolderSelectedItems)(index, event)}   
          />
        )}
        {step === 4 && (
          <Page4
            sourceItems={sourceItems}
            handleAddItem={() => handleAddItem(setSourceItems, sourceItems, sourceItemsValue)}
            handleRemoveItems={() => handleRemoveItems(setSourceItems, sourceItems, selectedRuleSources, setSelectedRuleSources)}
            handleSelectItem={(index, event) => handleSelectItem(selectedRuleSources, setSelectedRuleSources)(index, event)}
            selectedRuleSources={selectedRuleSources}
            errorMessage={page4ErrorMessage}
            sourceselectedItems={sourceselectedItems}
            handleSourceSelectItem={(index, event) => handleSelectItem(sourceselectedItems, setSourceSelectedItems)(index, event)}   
            sourceItemsValue={sourceItemsValue}
            setSourceItemsValue={setSourceItemsValue}
          />
        )}
        {step === 5 && (
          <Page5
            destinationItems={destinationItems}
            handleAddItem={() => handleAddItem(setDestinationItems, destinationItems, destinationItemsValue)}
            handleRemoveItems={() => handleRemoveItems(setDestinationItems, destinationItems, selectedRuleDestinations, setSelectedRuleDestinations)}
            handleSelectItem={(index, event) => handleSelectItem(selectedRuleDestinations, setSelectedRuleDestinations)(index, event)}
            selectedItems={selectedRuleDestinations}
            errorMessage={page5ErrorMessage}
            destinationselectedItems={destinationselectedItems}
            handleDestinationSelectItem={(index, event) => handleSelectItem(destinationselectedItems, setDestinationSelectedItems)(index, event)}   
            destinationItemsValue={destinationItemsValue}
            setDestinationItemsValue={setDestinationItemsValue}
          />
        )}
        {step === 6 && <Page6/>}
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
