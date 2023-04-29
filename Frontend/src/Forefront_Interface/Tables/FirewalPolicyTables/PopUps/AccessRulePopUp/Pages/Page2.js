import React from "react";
import "../NewAccessRule.css";

const Page2 = ({ ruleAction, handleRuleActionChange }) => {
  return (
    <>
      <h3>Rule Action</h3>
      <p>
        Select how client requests for content from the specified destination are dealt with if the conditions specified in the rule are met.
      </p>
      <p>Action to take when rule conditions are met:</p>
      <div className="left-aligned">
        <div className="radio-container">
          <input
            type="radio"
            id="Allow"
            name="ruleAction"
            value="Allow"
            checked={ruleAction === "Allow"}
            onChange={handleRuleActionChange}
          />
          <label htmlFor="Allow" className="radio-label">Allow</label>
        </div>
        <div className="radio-container">
          <input
            type="radio"
            id="Deny"
            name="ruleAction"
            value="Deny"
            checked={ruleAction === "Deny"}
            onChange={handleRuleActionChange}
          />
          <label htmlFor="Deny" className="radio-label">Deny</label>
        </div>
      </div>
    </>
  );
};

export default Page2;
