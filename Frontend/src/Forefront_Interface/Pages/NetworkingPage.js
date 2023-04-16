//NetworkingPage.js
import Layout from '../Layouts/Layout';
import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import NetworkingPageTabsComponent from '../TabComponent/NetworkingPageTabsComponent';
import NetworksTable from '../Tables/NetworkingTables/NetworksTable';
import NetworkSetTable from '../Tables/NetworkingTables/NetworkSetTable';
import NetworkRulesTable from '../Tables/NetworkingTables/NetworkRulesTable';
import NetworkAdaptersTable from '../Tables/NetworkingTables/NetworkAdaptersTable';
import RoutingTable from '../Tables/NetworkingTables/RoutingTable';

const NetworkingPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  return (
    <Layout>
      <div>
        <NetworkingPageTabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        <Switch>
          <Route path="/tmg/networking/networks" component={NetworksTable} />
          <Route path="/tmg/networking/network-sets" component={NetworkSetTable} />
          <Route path="/tmg/networking/network-rules" component={NetworkRulesTable} />
          <Route path="/tmg/networking/network-adapters" component={NetworkAdaptersTable} />
          <Route path="/tmg/networking/routing" component={RoutingTable} />
        </Switch>
      </div>
    </Layout>
  );
};

export default NetworkingPage;
