import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaNetworkWired } from 'react-icons/fa';

const NetworkSetTable = () => {
  const nameCellRenderer = (params) => {
    const Icon = params.data.icon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const networksCellRenderer = (params) => {
    if (!params.data.networks) {
      return params.value;
    }
    const Icon = params.data.neticon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const columnDefs = [
    { headerName: 'Name', field: 'name', cellRenderer: 'nameCellRenderer', sortable: true, checkboxSelection: true, headerCheckboxSelection: true},
    { headerName: 'Description', field: 'description', sortable: true },
    { headerName: 'Type', field: 'type', sortable: true},
    { headerName: 'Networks', field: 'networks', cellRenderer : 'networksCellRenderer', sortable: true, flex: 1},
  ];

  const rowData = [
    {
      name: 'All Networks (and Local Host)',
      description: 'This predefined network set includes all networks. Predefined network sets cannot be modified.',
      type: 'Exclude',
      networks: 'External',
      icon: FaNetworkWired,
      neticon: FaNetworkWired
    },
    {
      name: 'All Networks (and Local Host)',
      description: 'This predefined network set includes all networks. Predefined network sets cannot be modified.',
      type: 'Exclude',
      networks: '',
      icon: FaNetworkWired,
    },
    {
      name: 'Forefront Protection Manager Monitored Networks',
      description: 'This Predefined Network set of networks monitored by Forefront Protection Manager',
      type: 'Include',
      icon: FaNetworkWired,
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
            nameCellRenderer: nameCellRenderer,
            networksCellRenderer : networksCellRenderer,
          }}
        rowSelection='multiple'
        suppressRowClickSelection={false}  
          />
    </div>
  );
};

export default NetworkSetTable;
