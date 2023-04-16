// firewallPolicyColumns.js
import React from 'react';

export const orderCellRenderer = (params) => {
    const Icon = params.data.ordicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

export const actionCellRenderer = (params) => {
    const Icon = params.data.actionicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

export const protocolsCellRenderer = (params) => {
    const Icon = params.data.protocicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

export const  fromCellRenderer = (params) => {
    const Icon = params.data.fromicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

export const toCellRenderer = (params) => {
    const Icon = params.data.toicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

export const conditionCellRenderer = (params) => {
    const Icon = params.data.condicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };
  
export const columnDefs = [
    { headerName: 'Order', field: 'order', cellRenderer: 'orderCellRenderer', sortable: true, checkboxSelection: true, headerCheckboxSelection: true},
    { headerName: 'Name', field: 'name', sortable: true},
    { headerName: 'Action', field: 'act', sortable: true, cellRenderer: 'actionCellRenderer'},
    { headerName: 'Protocols', field: 'protoc', sortable: true, cellRenderer: 'protocolsCellRenderer'},
    { headerName: 'From / Listener', field: 'FL', sortable: true, cellRenderer: 'fromCellRenderer'},
    { headerName: 'To', field: 'to', sortable: true, cellRenderer: 'toCellRenderer'},
    { headerName: 'Condition', field: 'cond', sortable: true, cellRenderer: 'conditionCellRenderer'},
    { headerName: 'Description', field: 'desc', sortable: true},
    { headerName: 'Policy', field: 'pol', sortable: true},
  ]