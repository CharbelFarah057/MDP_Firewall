import React from 'react';
import Layout from '../Layouts/Layout';
import { Route, Switch } from 'react-router-dom';
import FirewallPolicyTabsComponent from '../TabComponent/FirewallPolicyPageTabsComponent';
import AllFirewallPolicyTable from '../Tables/FirewalPolicyTables/AllFirewallPolicyTable';

const FirewallPolicyPage = () => {
  return (
    <Layout>
      <div className="tabcomp">
        <FirewallPolicyTabsComponent/>
        <Switch>
          <Route path="/tmg/firewall-policy/all-firewall-policy" component={AllFirewallPolicyTable} />
        </Switch>
      </div>
    </Layout>
  );
};

export default FirewallPolicyPage;