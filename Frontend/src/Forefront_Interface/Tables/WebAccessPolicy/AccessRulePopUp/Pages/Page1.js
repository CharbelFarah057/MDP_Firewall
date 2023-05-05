import React from "react";
import "../NewAccessRule.css";

const Page1 = ({ Name, handleRuleNameChange, errorMessage }) => {
    return (
        <>
        <h2>Welcome to the New Web Access Wizard</h2>
        <p>
          This wizard helps you create a new Web Access rule. Web Access rules define of allowed domains from the internal network to the external network, followed by a deny all rule.
        </p>
        <div>
          <label htmlFor="rule-name">Web Access name:</label>
          <br />
          <input
            type="text"
            id="rule-name"
            value={Name}
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