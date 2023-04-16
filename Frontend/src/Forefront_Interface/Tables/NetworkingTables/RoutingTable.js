// TableGrid.js
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const NetworkAdaptersTable = () => {

  const columnDefs = [
    { headerName: 'Name Destination', field: 'name',  sortable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { headerName: 'Netmask', field: 'netmask', sortable: true },
    { headerName: 'Gateway/Interface Name', field: 'gate', sortable: true},
    { headerName: 'Metric', field: 'metric', sortable: true, flex:1},
    ];

  const rowData = [
    {
      name: '0.0.0.0',
      netmask: '0.0.0.0',
      gate: '192.168.0.1',
      metric: '256',
    },
    {
      name: '10.0.5.0',
      netmask: '255.255.255.0',
      gate: 'Exam Room B',
      metric: '256',
    },
    {
      name: '172.16.0.0',
      netmask: '255.255.255.0',
      gate: 'Exam Room A',
      metric: '256',
    },
  ];

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: 'calc(100vh - 20vh)', // Adjust this value as needed
        width: '100%',
        overflow: 'auto',
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true, suppressMovable: true }}
        rowSelection='multiple'
        suppressRowClickSelection={false}
        />
    </div>
  );
};

export default NetworkAdaptersTable;
