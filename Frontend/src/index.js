import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';

import Login from './LoginPage/Login';
import WizardPageOne from './Wizard/WizardPageOne';
import TMG from "./Forefront_Interface/TMG";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Switch>
    <Route path="/login" exact render={() => <Login/>} />    
    <Route path="/wizard" exact render={() => <WizardPageOne/>} />
    <Route path="/tmg" exact render={() => <TMG/>} />
    </Switch>
    </BrowserRouter>
);