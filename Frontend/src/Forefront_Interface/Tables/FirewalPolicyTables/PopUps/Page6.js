import React from "react";
import "./NewAccessRule.css";
import { FiUsers } from 'react-icons/fi';

const Page6 = () => {

  return (
    <>
      <h3>User Sets</h3>
      <p>You can apply the rule to requests from all users. Or, you can limit access to specific user sets <br/> 
      Being in the context on only filtering packets for students in an exam room then, we always include all the users</p>
      <p>This rule applies to requests from the following user sets</p>
      <div className="icon-text-container">
            <FiUsers/> 
            <p> All Users</p>
      </div>
    </>
  );
};

export default Page6;
