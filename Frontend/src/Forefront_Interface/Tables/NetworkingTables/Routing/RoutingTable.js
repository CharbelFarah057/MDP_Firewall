//AllFirewallPolicyTable.js
import React, { useState } from "react";
import RoutingRow from "./RoutingRows.js";
import { rowData as initialRowData } from "./RoutingData";
import "./RoutingTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState(initialRowData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

  const handleRowCheckboxChange = (rowId) => {
    setSelectedRows((prevRows) => {
      if (prevRows.includes(rowId)) {
        return prevRows.filter((row) => row !== rowId);
      } else {
        return [...prevRows, rowId];
      }
    });
  };
    
  const handleSelectAllCheckboxChange = () => {
    if (selectedRows.length === rowData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rowData.map(row => row.id));
    }
  };

  const sortData = (key) => {
    let direction;
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = 'default';
      }
    } else {
      direction = 'asc';
    }
  
    let sortedData;
    if (direction === 'default') {
      sortedData = initialRowData;
      setSortConfig({ key: null, direction: 'default' });
    } else {
      sortedData = [...rowData].sort((a, b) => {
        if (Array.isArray(a[key]) && Array.isArray(b[key])) {
          // Join the arrays as strings for comparison
          const aString = a[key].join(", ");
          const bString = b[key].join(", ");
    
          if (aString < bString) {
            return direction === 'asc' ? -1 : 1;
          }
          if (aString > bString) {
            return direction === 'asc' ? 1 : -1;
          }
        } else if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        } else if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    
      setSortConfig({ key, direction });
    }
    setRowData(sortedData);
    console.log(sortedData)
    console.log(rowData)
  };

  const Arrow = ({ direction }) => (
    <span className="arrow">
      {direction === "asc" ? "↑" : "↓"}
    </span>
  );

  const renderHeader = (key, label) => (
    <th
      onClick={() => sortData(key)}
      style={{ cursor: "pointer" }}
    >
      {label}
      {sortConfig.key === key && sortConfig.direction !== "default" && (
        <Arrow direction={sortConfig.direction} />
      )}
    </th>
  );

  return (
    <div
      style={{
        height: "calc(100vh - 20vh)",
        width: "100%",
        overflow: "auto",
      }}
    >
      <table className="firewall-policy-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === rowData.length}
                onChange={handleSelectAllCheckboxChange}
              />
            </th>
            {renderHeader("networkdestination", "Network Destination")}
            {renderHeader("netmask", "Netmask")}
            {renderHeader("gate", "Gateway/Interface Name")}
            {renderHeader("metric", "Metric")}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row) => (
            <RoutingRow
              key={row.id}
              row={row}
              rowId={row.id}
              selectedRows={selectedRows}
              onRowCheckboxChange={handleRowCheckboxChange}
          />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllFirewallPolicyTable;