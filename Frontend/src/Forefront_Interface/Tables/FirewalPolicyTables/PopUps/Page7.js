import React from "react";
import "./NewAccessRule.css";

const Page7 = ({
    ruleName,
    ruleAction,
    ruleAppliesTo,
    items,
    sourceItems,
    destinationItems,
}) => {
    return (
        <>
            <h3>Completing the New Access Rule Wizard</h3>
            <p>
            You have successfully completed the New Access Rule Wizard. The new
            Access Rule will have the following configurations:
            </p>
            <div className="configurations-box">
            <pre>
                Name:{"\n"}
                {ruleName}
                {"\n\n"}
                Action:{"\n"}
                {ruleAction}
                {"\n\n"}
                Traffic:{"\n"}
                {ruleAppliesTo === "selectedProtocols"
                ? items.join("\n")
                : ruleAppliesTo === "allOutbound"
                ? "All outbound traffic"
                : `All IP traffic except\n  ${items.join("\n  ")}`}
                {"\n\n"}
                Source:{"\n"}
                {sourceItems.join("\n")}
                {"\n\n"}
                Destination:{"\n"}
                {destinationItems.join("\n")}
                {"\n\n"}
                Accepted user sets:{"\n"}
                All Users
            </pre>
            </div>
            <p>To close the wizard, click Finish.</p>
        </>
    );
};

export default Page7;