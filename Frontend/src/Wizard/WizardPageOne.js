import React from 'react';
import './WizardPageOne.css';

const WizardPageOne = ({ onNext }) => {
  return (
    <div className="wizard-page-one">
      <div className="left-section">
        <h1>Linux Firewall</h1>
      </div>
      <div className="right-section">
        <p>
          This wizard will guide you through the process of setting up and configuring your Linux Firewall.
          You'll be able to define rules, manage connections, and secure your network.
        </p>
      </div>
      <div className="buttons">
        <button className="back-button" disabled>
          Back
        </button>
        <button className="next-button" onClick={onNext}>
          Next
        </button>
        <button className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WizardPageOne;
