//index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './index.css';

import Login from './LoginPage/Login';
import FirstTimeUserPage from './LoginPage/FirstTimeUserPage';
import NetworkingPage from './Forefront_Interface/Pages/NetworkingPage';
import FirewallPolicyPage from "./Forefront_Interface/Pages/FirewallPolicyPage";
import WebAccessPolicyPage from "./Forefront_Interface/Pages/WebAccessPolicyPage";
import LoggingPage from "./Forefront_Interface/Pages/LoggingPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact render={() => <Login />} />
        <Route path="/first-time-user" exact render={() => <FirstTimeUserPage />} />
        <Route path="/" exact render={() => <Redirect to="/login" />} />
        <Route path="/tmg/firewall-policy/" exact render={() => <Redirect to="/tmg/firewall-policy/all-firewall-policy" />} />
        <Route path="/tmg/firewall-policy/all-firewall-policy" render={() => <FirewallPolicyPage />} />
        <Route path="/tmg/web-access-policy" exact render={() => <WebAccessPolicyPage />} />
        <Route path="/tmg/logging" exact render={() => <LoggingPage />} />
        <Route path="/tmg/networking/networks" render={() => <NetworkingPage />} />
        <Route path="/tmg/networking/network-sets" render={() => <NetworkingPage />} />
        <Route path="/tmg/networking/network-rules" render={() => <NetworkingPage />} />
        <Route path="/tmg/networking/network-adapters" render={() => <NetworkingPage />} />
        <Route path="/tmg/networking/routing" render={() => <NetworkingPage />} />
        <Route path="/tmg" exact render={() => <Redirect to="/tmg/firewall-policy" />} />
      </Switch>
    </BrowserRouter>
);