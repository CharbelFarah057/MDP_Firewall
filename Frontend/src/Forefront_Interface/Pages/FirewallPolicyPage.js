import React, { useState } from 'react';
import Layout from '../Layouts/Layout';
import { Route, Switch, useLocation } from 'react-router-dom';
import FirewallPolicyTabsComponent from '../TabComponent/FirewallPolicyPageTabsComponent';
import AllFirewallPolicyTable from '../Tables/FirewalPolicyTables/AllFirewallPolicyTable';

const FirewallPolicyPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  return (
    <Layout>
      <div className="tabcomp">
        <FirewallPolicyTabsComponent activeTab={activeTab} setActiveTab={setActiveTab}/>
        <Switch>
          <Route path="/tmg/firewall-policy/input-table" component={AllFirewallPolicyTable} />
          <Route path="/tmg/firewall-policy/forward-table" component={AllFirewallPolicyTable} />
          <Route path="/tmg/firewall-policy/output-table" component={AllFirewallPolicyTable} />
        </Switch>
      </div>
    </Layout>
  );
};

export default FirewallPolicyPage;