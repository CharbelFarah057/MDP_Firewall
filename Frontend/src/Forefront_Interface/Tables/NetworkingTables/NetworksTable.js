import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FcGlobe } from 'react-icons/fc';
import { FaNetworkWired } from 'react-icons/fa';
import { VscSymbolEnum, VscSymbolConstant } from 'react-icons/vsc';

const NetworksTable = () => {
  const nameCellRenderer = (params) => {
    const Icon = params.data.icon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const addressCellRenderer = (params) => {
    const Icon = params.data.adicon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const columnDefs = [
    { headerName: 'Name', field: 'name', cellRenderer: 'nameCellRenderer', checkboxSelection: true, headerCheckboxSelection: true},
    { headerName: 'Description', field: 'description' },
    { headerName: 'Address Ranges', field: 'addressRanges', cellRenderer: 'addressCellRenderer', flex: 1 },
  ];

  const rowData = [
    {
      name: 'External',
      description: 'Built-in network object representing the Internet.',
      addressRanges: 'IP addresses external tot he Forefront TMG networks.',
      icon: FcGlobe,
      adicon: VscSymbolConstant,
    },
    {
      name: 'Internal',
      description: 'Built-in network object representing the Forefront TMG computer.',
      addressRanges: '10.0.5.0-10.0.5.255, 172.16.0.0',
      icon: FaNetworkWired,
      adicon: VscSymbolEnum,
    },
    {
      name: 'Local Host',
      description: 'Built-in dynamic network representing client computers connecting to Forefront TMG via VPN that are currently quarantined.',
      addressRanges: 'No iP addresses are associated with this network.',
      icon: FaNetworkWired,
      adicon: VscSymbolConstant,
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
        defaultColDef={{ resizable: true, suppressMovable: true, sortable: true}}
        frameworkComponents={{
            nameCellRenderer: nameCellRenderer,
            addressCellRenderer: addressCellRenderer,
          }}         
        rowSelection='multiple'
        suppressRowClickSelection={false}/>
    </div>
  );
};

export default NetworksTable;
