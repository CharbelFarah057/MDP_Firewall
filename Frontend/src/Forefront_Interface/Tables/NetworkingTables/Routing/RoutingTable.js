//RoutingTable.js
import React, { useState } from "react";
import RoutingRow from "./RoutingRows.js";
import initialRowData from "./RoutingData.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import "./RoutingTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData] = useState(initialRowData);
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

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'default';
    }
    setSortConfig({ key, direction });
  };

  const sortRows = (rows) => {
      const sortedRows = [...rows];
    
      sortedRows.sort((a, b) => {
        if (Array.isArray(a[sortConfig.key]) && Array.isArray(b[sortConfig.key])) {
          const arrayA = a[sortConfig.key].join(',').toLowerCase();
          const arrayB = b[sortConfig.key].join(',').toLowerCase();
          if (arrayA < arrayB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (arrayA > arrayB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    
      if (sortConfig.direction === 'default') {
        return rowData;
      }
    
      return sortedRows;
  };

  const renderArrowIcon = (key) => {
      const iconStyle = {
        fontSize: "0.8rem",
        marginLeft: "5px",
      };

      if (sortConfig.key === key) {
        if (sortConfig.direction === 'asc') {
          return <FontAwesomeIcon icon={faArrowUp} size="sm" style={iconStyle} />;
        }
        if (sortConfig.direction === 'desc') {
          return <FontAwesomeIcon icon={faArrowDown} size="sm" style={iconStyle} />;
        }
      }
      return null;
  };

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
            <th onClick={() => requestSort('networkdestination')}>
              Network Destination {renderArrowIcon('networkdestination')}
            </th>
            <th onClick={() => requestSort('netmask')}>
              Netmask {renderArrowIcon('netmask')}
            </th>
            <th onClick={() => requestSort('gate')}>
              Gateway/Interface Name {renderArrowIcon('gate')}
            </th>
            <th onClick={() => requestSort('metric')}>
              Metric {renderArrowIcon('metric')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortRows((initialRowData)).map((row) => (
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