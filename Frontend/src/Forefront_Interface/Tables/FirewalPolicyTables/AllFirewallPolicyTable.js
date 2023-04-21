//AllFirewallPolicyTable.js
import React, { useState, useEffect  } from "react";
import { rowData } from "./FirewallPolicyData";
import FirewallPolicyRow from "./FirewallPolicyRow";
import ContextMenu from "./ContextMenu";
import { AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import "./FirewallPolicyTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  const handleRowContextMenu = (event, rowIndex) => {
    // Check if the row is selected
    if (!selectedRows.includes(rowIndex)) {
      // Do not show the context menu if the row is not selected
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
  
    const isLastRow = rowIndex === rowData.length - 1;
    const isFirstRow = rowIndex === 0;
    const isSecondToLastRow = rowIndex === rowData.length - 2;
  
    let items;
  
    if (selectedRows.length === 1) {
      items = [
        { label: "Properties", onClick: () => console.log("Properties clicked") },
        ...(isLastRow
          ? []
          : [
              { label: "Delete", onClick: () => console.log("Delete clicked") },
              { label: "Copy", onClick: () => console.log("Copy clicked") },
              { label: "Create Group", onClick: () => console.log("Create Group clicked") },
              ...(isFirstRow
                ? []
                : [{ label: "Move Up", onClick: () => console.log("Move Up clicked") }]),
              ...(isSecondToLastRow
                ? []
                : [{ label: "Move Down", onClick: () => console.log("Move Down clicked") }]),
              { label: "Disable", onClick: () => console.log("Disable clicked") },
            ]),
      ];
    } else {
      const firstSelectedRow = Math.min(...selectedRows);
      const lastSelectedRow = Math.max(...selectedRows);
      items = [
        { label: "Delete", onClick: () => console.log("Delete clicked") },
        { label: "Create Group", onClick: () => console.log("Create Group clicked") },
        ...(firstSelectedRow === 0
          ? []
          : [{ label: "Move Up", onClick: () => console.log("Move Up clicked") }]),
        ...(lastSelectedRow === rowData.length - 2
          ? []
          : [{ label: "Move Down", onClick: () => console.log("Move Down clicked") }]),
        { label: "Disable", onClick: () => console.log("Disable clicked") },
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

  const handleCellClick = (rowIndex, cellIndex) => {
    const totalColumns = Object.keys(rowData[0]).filter(key => !key.endsWith("icon")).length;

    if (
      rowIndex === rowData.length - 1 ||
      cellIndex < 2 ||
      cellIndex >= totalColumns - 2
    ) {
      return;
    }
    if (selectedRows.includes(rowIndex)) {
      const cell = { rowIndex, cellIndex };
      setSelectedCells([cell]);
      setSelectedRows([]);
    }
  };

  const handleCellContextMenu = (event, rowIndex, cellIndex) => {
    if (!selectedCells.some((cell) => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex)) {
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;

    const items = [
      {
        label: "Allow",
        checked: rowData[rowIndex].act === "Allow",
        onClick: () => {
          rowData[rowIndex].act = "Allow";
          rowData[rowIndex].actionicon = () => <i className="fas fa-check-circle"></i>;
          setSelectedCells([]);
        },
      },
      {
        label: "Deny",
        checked: rowData[rowIndex].act === "Deny",
        onClick: () => {
          rowData[rowIndex].act = "Deny";
          rowData[rowIndex].actionicon = () => <i className="fas fa-times-circle"></i>;
          setSelectedCells([]);
        },
      },
    ];

    setContextMenu({ x, y, items });
  };

  const handleRowCheckboxChange = (rowIndex) => {
    // If the last row is selected, deselect all other rows.
    if (rowIndex === rowData.length - 1) {
      setSelectedRows((prevRows) =>
        prevRows.includes(rowIndex)
          ? prevRows.filter((row) => row !== rowIndex)
          : [rowIndex]
      );
    } else {
      // If any other row is selected, deselect the last row.
      setSelectedRows((prevRows) => {
        if (prevRows.includes(rowIndex)) {
          return prevRows.filter((row) => row !== rowIndex);
        } else {
          return [...prevRows.filter((row) => row !== rowData.length - 1), rowIndex];
        }
      });
    }
    setSelectedCells([]);
  };
    
  const handleSelectAllCheckboxChange = () => {
    if (selectedRows.length === rowData.length - 1) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rowData.slice(0, -1).map((_, index) => index));
    }
    setSelectedCells([]);
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
            <th>Order</th>
            <th>Name</th>
            <th>Action</th>
            <th>Protocols</th>
            <th>From / Listener</th>
            <th>To</th>
            <th>Condition</th>
            <th>Description</th>
            <th>Policy</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, rowIndex) => (
            <FirewallPolicyRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              handleCellClick={handleCellClick}
              selectedCells={selectedCells}
              selectedRows={selectedRows}
              onRowCheckboxChange={handleRowCheckboxChange}
              onRowContextMenu={handleRowContextMenu}
              onCellContextMenu={handleCellContextMenu} 
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