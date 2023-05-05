import React from "react";
import "../NewAccessRule.css";

const Page3 = ({
    Name,
    domain,
}) => {
    return (
        <>
            <h3>Completing the Web Access Rule Wizard</h3>
            <p>
            You have successfully completed the Web Access Rule Wizard. The new
            Web Access will have the following configurations:
            </p>
            <div className="configurations-box">
            <pre>
                Name:{"\n"}
                {Name}
                {"\n\n"}
                Domain:{"\n"}
                {domain.join("\n")}
            </pre>
            </div>
            <p>To close the wizard, click Finish.</p>
        </>
    );
};

export default Page3;