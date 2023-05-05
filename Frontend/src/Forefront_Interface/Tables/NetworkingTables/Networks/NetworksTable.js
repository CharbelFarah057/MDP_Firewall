//NetworksTable.js
import React, { useState, useEffect, useContext } from "react";
import {UserContext} from "../../../../UserContext";
import NetworksRows from "./NetworksRows";
import ContextMenu from "../../ContextMenu";
import initialRowData from "./NetworksData.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import "./NetworksTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData] = useState(initialRowData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [userContext] = useContext(UserContext)

  const handleRowContextMenu = (event, rowId) => {
    // Check if the row is selected
    if (!selectedRows.includes(rowId)) {
      // Do not show the context menu if the row is not selected
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;

    let items = [];
 
    if (selectedRows.length === 1) {
      items = [
        { label: "Properties", onClick: () => console.log("Properties clicked") },
      ];
    }
    setContextMenu({ x, y, items });
  };
  
  const handleGlobalClick = (event) => {
    if (!event.target.closest(".context-menu")) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

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
            <th onClick={() => requestSort('name')}>
              Name {renderArrowIcon('name')}
            </th>
            <th onClick={() => requestSort('desc')}>
              Description {renderArrowIcon('desc')}
            </th>
            <th onClick={() => requestSort('addressRanges')}>
              Address Ranges {renderArrowIcon('addressRanges')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortRows(rowData).map((row) => (
            <NetworksRows
              key={row.id}
              row={row}
              rowId={row.id}
              selectedRows={selectedRows}
              onRowCheckboxChange={handleRowCheckboxChange}
              onRowContextMenu={handleRowContextMenu}
          />
          ))}
        </tbody>
      </table>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default AllFirewallPolicyTable;