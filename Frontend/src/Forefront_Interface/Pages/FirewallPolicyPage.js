import React, { useState } from 'react';
import Layout from '../Layouts/Layout';
import { Route, Switch, useLocation } from 'react-router-dom';
import FirewallPolicyTabsComponent from '../TabComponent/FirewallPolicyPageTabsComponent';
import InputTable from '../Tables/FirewalPolicyTables/InputTable';
import ForwardTable from '../Tables/FirewalPolicyTables/ForwardTable';
import OutputTable from '../Tables/FirewalPolicyTables/OutputTable';

const FirewallPolicyPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  return (
    <Layout>
      <div className="tabcomp">
        <FirewallPolicyTabsComponent activeTab={activeTab} setActiveTab={setActiveTab}/>
        <Switch>
          <Route path="/tmg/firewall-policy/input-table" component={InputTable} />
          <Route path="/tmg/firewall-policy/forward-table" component={ForwardTable} />
          <Route path="/tmg/firewall-policy/output-table" component={OutputTable} />
        </Switch>
      </div>
    </Layout>
  );
};

export default FirewallPolicyPage;