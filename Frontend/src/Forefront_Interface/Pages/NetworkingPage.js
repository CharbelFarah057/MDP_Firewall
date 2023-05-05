//NetworkingPage.js
import Layout from '../Layouts/Layout';
import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import NetworkingPageTabsComponent from '../TabComponent/NetworkingPageTabsComponent';
import NetworksTable from '../Tables/NetworkingTables/Networks/NetworksTable';

const NetworkingPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  return (
    <Layout>
      <div>
        <NetworkingPageTabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        <Switch>
          <Route path="/tmg/networking/networks" component={NetworksTable} />
        </Switch>
      </div>
    </Layout>
  );
};

export default NetworkingPage;
