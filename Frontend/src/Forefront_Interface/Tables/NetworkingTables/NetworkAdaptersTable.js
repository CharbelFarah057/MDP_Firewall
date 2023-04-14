// TableGrid.js
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {TbNetwork} from 'react-icons/tb';

const NetworkAdaptersTable = () => {
  const nameCellRenderer = (params) => {
    const Icon = params.data.icon;
    return (
      <>
        <Icon />
        <span style={{ marginLeft: '5px' }}>{params.value}</span>
      </>
    );
  };


  const columnDefs = [
    { headerName: 'Name', field: 'name', cellRenderer: 'nameCellRenderer', sortable: true, checkboxSelection: true, headerCheckboxSelection: true},
    { headerName: 'Type', field: 'type', sortable: true },
    { headerName: 'IP Address', field: 'ip', sortable: true},
    { headerName: 'Subnets', field: 'subnet', sortable: true},
    { headerName: 'Status', field: 'status', sortable: true, flex:1},
  ];

  const rowData = [
    {
        name : 'Exam Room A',
        type : 'Static',
        ip : '172.16.0.1',
        subnet : '255.255.255.0',
        status : 'Connected',
        icon: TbNetwork,
    },
    {
        name : 'Exam Room B',
        type : 'Static',
        ip : '10.0.5.1',
        subnet : '255.255.255.0',
        status : 'Connected',
        icon: TbNetwork,
    },
    {
        name : 'WAN',
        type : 'Static',
        ip : '192.168.0.1',
        subnet : '255.255.255.0',
        status : 'Connected',
        icon: TbNetwork,
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
        defaultColDef={{ resizable: true, suppressMovable: true }}
        frameworkComponents={{
            nameCellRenderer: nameCellRenderer,
          }}
        rowSelection='multiple'
        suppressRowClickSelection={false}
        />
    </div>
  );
};

export default NetworkAdaptersTable;
