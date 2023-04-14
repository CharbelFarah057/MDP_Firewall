import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaNetworkWired } from 'react-icons/fa';
import { FcGlobe } from 'react-icons/fc';
import {HiOutlineDesktopComputer} from 'react-icons/hi';

const NetworkRuleTable = () => {

  const nameCellRenderer = (params) => {
    const Icon = params.data.icon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const sourceCellRenderer = (params) => {
    const Icon = params.data.dsticon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const destinationCellRenderer = (params) => {
    const Icon = params.data.srcicon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };

  const columnDefs = [
    { headerName: 'Order', field: 'order', cellRenderer: 'nameCellRenderer', sortable: true, checkboxSelection: true, headerCheckboxSelection: true},
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Relation', field: 'relation', sortable: true},
    { headerName: 'Source Networks', field: 'srcnetworks', cellRenderer : 'sourceCellRenderer', sortable: true},
    { headerName: 'Destination Networks', field: 'dstnetworks', cellRenderer : 'destinationCellRenderer', sortable: true},
    { headerName: 'NAT Addresses', field: 'nataddress', sortable: true},
    { headerName: 'Description', field: 'desc', sortable: true},
  ];

  const rowData = [
    {
        order : 1,
        name : 'Local Host Access',
        relation : 'Route',
        srcnetworks : 'Local Host',
        dstnetworks : 'All Networks (and Local Host)',
        nataddress : '',
        desc : '',
        icon: HiOutlineDesktopComputer,
        srcicon: FaNetworkWired,
        dsticon: FaNetworkWired,
    },
    {
        order : 2,
        name : 'VPN Clients to Internal Network',
        relation : 'Route',
        srcnetworks : 'Internal',
        dstnetworks : 'Internal',
        nataddress : '',
        desc : '',
        icon: HiOutlineDesktopComputer,
        srcicon: FaNetworkWired,
        dsticon: FaNetworkWired,
    },
    {
        order : 3,
        name : 'Internet Access',
        relation : 'NAT',
        srcnetworks : 'Internal',
        dstnetworks : 'External',
        nataddress : 'Default IP address',
        desc : '',
        icon: HiOutlineDesktopComputer,
        srcicon: FaNetworkWired,
        dsticon: FcGlobe,
    }
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
        defaultColDef={{ resizable: true, suppressMovable: true}}
        frameworkComponents={{
          nameCellRenderer: nameCellRenderer,
          sourceCellRenderer: sourceCellRenderer,
          destinationCellRenderer: destinationCellRenderer,
        }}
        rowSelection='multiple'
        suppressRowClickSelection={false}
      />
    </div>
  );
};

export default NetworkRuleTable;
