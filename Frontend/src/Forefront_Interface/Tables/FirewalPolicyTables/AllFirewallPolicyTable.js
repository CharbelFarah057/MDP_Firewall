// AllFirewallPolicyTable.js
import React, {useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AllFirewallPolicyTablesStyling.css';
import {rowData} from './firewallPolicyData';
import {columnDefs, orderCellRenderer, actionCellRenderer, protocolsCellRenderer, fromCellRenderer, toCellRenderer, conditionCellRenderer} from './firewallPolicyColumns';

const AllFirewallPolicyTable = () => {

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: 'calc(100vh - 100px)', // Adjust this to change the height of the table dynamically with the window
        width: '100%',
        overflow: 'auto',
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true, suppressMovable: true }}
        frameworkComponents = {{
            orderCellRenderer: orderCellRenderer,
            actionCellRenderer : actionCellRenderer,
            protocolsCellRenderer : protocolsCellRenderer,
            fromCellRenderer : fromCellRenderer,
            toCellRenderer : toCellRenderer,
            conditionCellRenderer : conditionCellRenderer,
          }}
        rowSelection='multiple'
        suppressRowClickSelection={false}
        />
    </div>
  );
};

export default AllFirewallPolicyTable;