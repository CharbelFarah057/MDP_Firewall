//NetworkAdapterTable.js
import React, { useState, useEffect } from "react";
import NetworkAdadptersRows from "./NetworkAdaptersRows";
import ContextMenu from "../../ContextMenu";
import { rowData as initialRowData } from "./NetworkAdaptersData";
import "./NetworkAdaptersTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData, setRowData] = useState(initialRowData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

  const handleRowContextMenu = (event, rowId) => {
    // Check if the row is selected
    if (!selectedRows.includes(rowId)) {
      // Do not show the context menu if the row is not selected
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
  
    const isRowDisabled = rowData[rowId].disabled;

    // Check if all selected rows are enabled
    const areAllSelectedRowsEnabled = selectedRows.every(
      (selectedRowId) => !rowData[selectedRowId].disabled
    );

    // Check if all selected rows are disabled
    const areAllSelectedRowsDisabled = selectedRows.every(
      (selectedRowId) => rowData[selectedRowId].disabled
    );
  
    const toggleDisableEnable = (action) => {
      const updatedData = [...rowData];
      selectedRows.forEach((selectedRowId) => {
        updatedData[selectedRowId].disabled = !action;
      });
      setRowData(updatedData);
    };
    
    let items = [];
 
    if (selectedRows.length === 1) {
      items = [
        { label: "Properties", onClick: () => console.log("Properties clicked") },
        {
          label: isRowDisabled ? "Enable" : "Disable",
          onClick: () => toggleDisableEnable(isRowDisabled),
        },
      ];
    } else {
      if (areAllSelectedRowsEnabled) {
        items.push({
          label: "Disable",
          onClick: () => toggleDisableEnable(false),
        });
      } else if (areAllSelectedRowsDisabled) {
        items.push({
          label: "Enable",
          onClick: () => toggleDisableEnable(true),
        });
      } else {
        items.push(
          { label: "Enable", onClick: () => toggleDisableEnable(true) },
          { label: "Disable", onClick: () => toggleDisableEnable(false) }
        );
      }
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
            {renderHeader("name", "Name")}
            {renderHeader("type", "Type")}
            {renderHeader("ip", "IP Address")}
            {renderHeader("subnet", "Subnets")}
            {renderHeader("status", "Status")}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row) => (
            <NetworkAdadptersRows
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