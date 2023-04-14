// TableGrid.js
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {AiOutlineNumber, AiFillCheckCircle, AiOutlineStop} from 'react-icons/ai';
import {FiUsers} from 'react-icons/fi';
import {FaNetworkWired} from 'react-icons/fa';
import {FcGlobe} from 'react-icons/fc';

const AllFirewallPolicyTable = () => {
  const orderCellRenderer = (params) => {
    const Icon = params.data.ordicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const actionCellRenderer = (params) => {
    const Icon = params.data.actionicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const protocolsCellRenderer = (params) => {
    const Icon = params.data.protocicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const fromCellRenderer = (params) => {
    const Icon = params.data.fromicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const toCellRenderer = (params) => {
    const Icon = params.data.toicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const conditionCellRenderer = (params) => {
    const Icon = params.data.condicon;
    return (
      <>
        <Icon/>
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const columnDefs = [
    { headerName: 'Order', field: 'order', cellRenderer: 'orderCellRenderer', sortable: true, checkboxSelection: true, headerCheckboxSelection: true},
    { headerName: 'Name', field: 'name', sortable: true},
    { headerName: 'Action', field: 'act', sortable: true, cellRenderer: 'actionCellRenderer'},
    { headerName: 'Protocols', field: 'protoc', sortable: true, cellRenderer: 'protocolsCellRenderer'},
    { headerName: 'From / Listener', field: 'FL', sortable: true, cellRenderer: 'fromCellRenderer'},
    { headerName: 'To', field: 'to', sortable: true, cellRenderer: 'toCellRenderer'},
    { headerName: 'Condition', field: 'cond', sortable: true, cellRenderer: 'conditionCellRenderer'},
    { headerName: 'Description', field: 'desc', sortable: true},
    { headerName: 'Policy', field: 'pol', sortable: true},
  ];

  const rowData = [
    {
        order : 1,
        name : 'Rule 1',
        act : 'Deny',
        protoc : 'All Outbound Traffic',
        FL : 'External',
        to : 'Internal',
        cond : 'All Users',
        desc : '',
        pol : 'Array',
        ordicon: AiOutlineNumber,
        actionicon: (props) => (
          <AiOutlineStop {...props} style={{ ...props.style, color: 'red' }} />
        ),
        protocicon: FaNetworkWired,
        fromicon: FcGlobe,
        toicon: FaNetworkWired,
        condicon: FiUsers,

    },
    {
      order : 2,
      name : 'Rule 2',
      act : 'Allow',
      protoc : 'All Outbound Traffic',
      FL : 'External',
      to : 'Internal',
      cond : 'All Users',
      desc : '',
      pol : 'Array',
      ordicon: AiOutlineNumber,
      actionicon: (props) => (
        <AiFillCheckCircle
          {...props}
          style={{
            ...props.style,
            color: 'white',
            backgroundColor: 'green',
            borderRadius: '50%',
          }}
        />
      ),
      protocicon: FaNetworkWired,
      fromicon: FcGlobe,
      toicon: FaNetworkWired,
      condicon: FiUsers,
    },
  ];

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: 'calc(100vh - 100px)', // Adjust this value as needed
        width: '100%',
        overflow: 'auto',
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true, suppressMovable: true }}
        frameworkComponents={{
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