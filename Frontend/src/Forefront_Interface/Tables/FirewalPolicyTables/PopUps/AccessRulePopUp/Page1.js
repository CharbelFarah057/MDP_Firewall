import React from "react";
import "./NewAccessRule.css";

const Page1 = ({ ruleName, handleRuleNameChange, errorMessage }) => {
    return (
        <>
        <h2>Welcome to the New Access Rule Wizard</h2>
        <p>
          This wizard helps you create a new access rule. Access rules define the action that is taken, and the protocols that may be used, when specified clients from one network attempt to access specific destinations or content on another network.
        </p>
        <div>
          <label htmlFor="rule-name">Access rule name:</label>
          <br />
          <input
            type="text"
            id="rule-name"
            value={ruleName}
            onChange={handleRuleNameChange}
            className="rule-name-input"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p>To continue, click Next.</p>
      </>
    )
};

export default Page1;