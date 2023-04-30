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
            id="Accept"
            name="ruleAction"
            value="Accept"
            checked={ruleAction === "Accept"}
            onChange={handleRuleActionChange}
          />
          <label htmlFor="Accept" className="radio-label">Accept</label>
        </div>
        <div className="radio-container">
          <input
            type="radio"
            id="Drop"
            name="ruleAction"
            value="Drop"
            checked={ruleAction === "Drop"}
            onChange={handleRuleActionChange}
          />
          <label htmlFor="Drop" className="radio-label">Drop</label>
        </div>
      </div>
    </>
  );
};

export default Page2;
