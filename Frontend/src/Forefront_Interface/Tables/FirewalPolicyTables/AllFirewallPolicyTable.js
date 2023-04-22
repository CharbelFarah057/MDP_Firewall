//AllFirewallPolicyTable.js
import React, { useState, useEffect  } from "react";
import FirewallPolicyRow from "./FirewallPolicyRow";
import ContextMenu from "./ContextMenu";
import { AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import { rowData as initialRowData } from "./FirewallPolicyData";
import "./FirewallPolicyTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData, setRowData] = useState(initialRowData);
  const [selectedMultiCellClick, setselectedMultiCellClick] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

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
    if (
      rowIndex === rowData.length - 1 ||
      cellIndex !== 2 ||
      rowData[rowIndex].act === ""
    ) { return; }
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
    let items = [];

    switch(cellIndex) {
      case 2 :
        items = [
          {
            label: "Allow",
            checked: rowData[rowIndex].act === "Allow",
            onClick: () => {
              setRowData((prevRowData) => {
                const newRowData = [...prevRowData];
                newRowData[rowIndex].act = "Allow";
                newRowData[rowIndex].actionicon = (props) => (
                  <AiFillCheckCircle
                    {...props}
                    style={{
                      ...props.style,
                      color: 'white',
                      backgroundColor: 'green',
                      borderRadius: '50%',
                    }}
                  />
                );
                return newRowData;
              });
              setSelectedCells([]);
            },
          },
          {
            label: "Deny",
            checked: rowData[rowIndex].act === "Deny",
            onClick: () => {
              setRowData((prevRowData) => {
                const newRowData = [...prevRowData];
                newRowData[rowIndex].act = "Deny";
                newRowData[rowIndex].actionicon = (props) => (
                  <AiOutlineStop {...props} style={{ ...props.style, color: 'red' }} />);
                return newRowData;
              });
              setSelectedCells([]);
            },
          },
        ];
        break
    }
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
    setselectedMultiCellClick([]);
  };
    
  const handleSelectAllCheckboxChange = () => {
    if (selectedRows.length === rowData.length - 1) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rowData.slice(0, -1).map((_, index) => index));
    }
    setSelectedCells([]);
    setselectedMultiCellClick([]);
  };

  const handleMultiCellClick = (rowIndex, cellIndex, protocolIndex) => {
    if (cellIndex !== 3 && cellIndex !== 4 && cellIndex !== 5 ||
      rowIndex === rowData.length - 1 ||
      JSON.stringify(rowData[rowIndex].protoc) === JSON.stringify(["All Outbound Traffic"])
      ) { return; }
    if ( selectedRows.includes(rowIndex) ) {
      const multi = {rowIndex, cellIndex, protocolIndex};
      setselectedMultiCellClick([multi]);
      setSelectedCells([]);
      setSelectedRows([]);
    }
  };

  const sortData = (key) => {
    let direction;
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'default';
    } else {
      direction = 'asc';
    }

    if (direction === 'default') {
      setRowData(initialRowData);
      setSortConfig({ key: null, direction: 'default' });
    } else {
      const sortedData = [...rowData].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setRowData(sortedData);
      setSortConfig({ key, direction });
    }
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
            {renderHeader("order", "Order")}
            {renderHeader("name", "Name")}
            {renderHeader("act", "Action")}
            {renderHeader("protoc", "Protocols")}
            {renderHeader("from", "From / Listener")}
            {renderHeader("to", "To")}
            {renderHeader("cond", "Condition")}
            {renderHeader("desc", "Description")}
            {renderHeader("policy", "Policy")}
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
              selectedMultiCellClick={selectedMultiCellClick}
              handleMultiCellClick={handleMultiCellClick}
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