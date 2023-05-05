import React, { useState } from 'react';
import Layout from '../Layouts/Layout';
import { Route, Switch, useLocation } from 'react-router-dom';
import WebAccessPolicyPageTabsComponent from '../TabComponent/WebAcccessTabsComponent';
import WebAccessTable from '../Tables/WebAccessPolicy/WebAccessPolicyTable';


const WebAccessPolicyPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  return (
    <Layout>
    <div>
      <WebAccessPolicyPageTabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
      <Switch>
        <Route path="/tmg/web-access-policy" component={WebAccessTable} />
      </Switch>
    </div>
    </Layout>
  );
};

export default WebAccessPolicyPage;