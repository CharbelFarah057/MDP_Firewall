import NetworkingLayout from '../NetworkingLayout';
import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import NetworkingPageTabsComponent from '../TabComponent/NetworkingPageTabsComponent';
import NetworksTable from '../Tables/NetworksTable';
import NetworkSetTable from '../Tables/NetworkSetTable';
import NetworkRulesTable from '../Tables/NetworkRulesTable';
import NetworkAdaptersTable from '../Tables/NetworkAdaptersTable';
import RoutingTable from '../Tables/RoutingTable';
import './NetworkingPageStyling.css';

const NetworkingPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const tabMap = {
    '/tmg/networking/networks': 0,
    '/tmg/networking/network-sets': 1,
    '/tmg/networking/network-rules': 2,
    '/tmg/networking/network-adapters': 3,
    '/tmg/networking/routing': 4,
  };

  useState(() => {
    setActiveTab(tabMap[location.pathname]);
  }, [location]);

  return (
    <NetworkingLayout>
      <div className="tabcomp">
        <NetworkingPageTabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        <Switch>
          <Route path="/tmg/networking/networks" component={NetworksTable} />
          <Route path="/tmg/networking/network-sets" component={NetworkSetTable} />
          <Route path="/tmg/networking/network-rules" component={NetworkRulesTable} />
          <Route path="/tmg/networking/network-adapters" component={NetworkAdaptersTable} />
          <Route path="/tmg/networking/routing" component={RoutingTable} />
        </Switch>
      </div>
    </NetworkingLayout>
  );
};

export default NetworkingPage;
