//AllFirewallPolicyTable.js
import React, { useState, useEffect } from "react";
import AllFirewallPolicyRow from "./AllFirewallPolicyRow";
import ContextMenu from "../ContextMenu";
import { AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import initialRowData from "./AllFirewallPolicyData.json";
import { toggleDisableEnable, 
        moveRowDown,
        moveRowUp, 
        moveSelectedRowsDown, 
        moveSelectedRowsUp, 
        deleteSelectedRows, 
        areSelectedRowsContiguous,
        requestSort,
        sortRows,
        renderArrowIcon,
        filterRows
      } from "./AllFirewllPolicyUtilities";
import SearchBar from "./SearchBar";
import "./AllFirewallPolicyTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData, setRowData] = useState(initialRowData);
  const [selectedMultiCellClick, setselectedMultiCellClick] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [searchValue, setSearchValue] = useState("");

  const handleRowContextMenu = (event, rowId) => {
    // Check if the row is selected
    if (!selectedRows.includes(rowId)) {
      // Do not show the context menu if the row is not selected
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
  
    const isLastRow = rowId === rowData.length - 1;
    const isFirstRow = rowId === 0;
    const isSecondToLastRow = rowId === rowData.length - 2;
    const isRowDisabled = rowData[rowId].disabled;

    // Check if all selected rows are enabled
    const areAllSelectedRowsEnabled = selectedRows.every(
      (selectedRowId) => !rowData[selectedRowId].disabled
    );

    // Check if all selected rows are disabled
    const areAllSelectedRowsDisabled = selectedRows.every(
      (selectedRowId) => rowData[selectedRowId].disabled
    );
  
    let items;

    if (selectedRows.length === 1) {
      items = [
        { label: "Properties", onClick: () => console.log("Properties clicked") },
        ...(isLastRow
          ? []
          : [
            { label: "Delete", onClick: () => deleteSelectedRows(rowData, selectedRows, setRowData, setSelectedRows) },
              { label: "Create Group", onClick: () => console.log("Create Group clicked") },
              ...(isFirstRow
                ? []
                : [{ label: "Move Up", onClick: () => moveRowUp(rowData, setRowData, setSelectedRows, rowId) }]),
              ...(isSecondToLastRow
                ? []
                : [{ label: "Move Down", onClick: () => moveRowDown(rowData, setRowData, setSelectedRows, rowId) }]),
                {
                  label: isRowDisabled ? "Enable" : "Disable",
                  onClick: () => toggleDisableEnable(rowData, selectedRows, setRowData, isRowDisabled),
                },
            ]),
      ];
    } else {
      const firstSelectedRow = Math.min(...selectedRows);
      const lastSelectedRow = Math.max(...selectedRows);
      items = [
        { label: "Delete", onClick: () => deleteSelectedRows(rowData, selectedRows, setRowData, setSelectedRows) },
        ...(areSelectedRowsContiguous(selectedRows)
          ? [
              {
                label: "Create Group",
                onClick: () => console.log("Create Group clicked"),
              },
            ]
          : []),
        ...(firstSelectedRow === 0
          ? []
          : [{ label: "Move Up", onClick: () => moveSelectedRowsUp(rowData, selectedRows, setRowData, setSelectedRows) },]),
        ...(lastSelectedRow === rowData.length - 2
          ? []
          : [{ label: "Move Down", onClick: () => moveSelectedRowsDown(rowData, selectedRows, setRowData, setSelectedRows) },]),
      ];
      
      if (areAllSelectedRowsEnabled) {
        items.push({
          label: "Disable",
          onClick: () => toggleDisableEnable(rowData, selectedRows, setRowData, false),
        });
      } else if (areAllSelectedRowsDisabled) {
        items.push({
          label: "Enable",
          onClick: () => toggleDisableEnable(rowData, selectedRows, setRowData, true),
        });
      } else {
        items.push(
          { label: "Enable", onClick: () => toggleDisableEnable(rowData, selectedRows, setRowData, true) },
          { label: "Disable", onClick: () => toggleDisableEnable(rowData, selectedRows, setRowData, false) }
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

  const handleCellClick = (rowId, cellIndex) => {
    if (
      rowId === rowData.length - 1 ||
      cellIndex !== 2 ||
      rowData[rowId].act === ""
    ) { return; }
    if (selectedRows.includes(rowId)) {
      const cell = { rowId, cellIndex };
      setSelectedCells([cell]);
      setSelectedRows([]);
    }
  };

  const handleCellContextMenu = (event, rowId, cellIndex) => {
    if (!selectedCells.some((cell) => cell.rowId === rowId && cell.cellIndex === cellIndex)) {
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    const items = [
      {
        label: "Allow",
        checked: rowData[rowId].act === "Allow",
        onClick: () => {
          setRowData((prevRowData) => {
            const newRowData = [...prevRowData];
            newRowData[rowId].act = "Allow";
            newRowData[rowId].actionicon = (props) => (
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
        checked: rowData[rowId].act === "Deny",
        onClick: () => {
          setRowData((prevRowData) => {
            const newRowData = [...prevRowData];
            newRowData[rowId].act = "Deny";
            newRowData[rowId].actionicon = (props) => (
              <AiOutlineStop {...props} style={{ ...props.style, color: 'red' }} />);
            return newRowData;
          });
          setSelectedCells([]);
        },
      },
    ];
    setContextMenu({ x, y, items });
  };

  const handleRowCheckboxChange = (rowId) => {
    // If the last row is selected, deselect all other rows.
    if (rowId === rowData.length - 1) {
      setSelectedRows((prevRows) =>
      prevRows.includes(rowId)
      ? prevRows.filter((row) => row !== rowId)
      : [rowId]
      );
    } else {
      // If any other row is selected, deselect the last row.
      setSelectedRows((prevRows) => {
        if (prevRows.includes(rowId)) {
          return prevRows.filter((row) => row !== rowId);
        } else {
          return [...prevRows.filter((row) => row !== rowData.length - 1), rowId];
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

  const handleMultiCellClick = (rowId, cellIndex, MultiCellIndex) => {
    if ((cellIndex !== 3 && cellIndex !== 4 && cellIndex !== 5) ||
      rowId === rowData.length - 1 ||
      (cellIndex === 3 && JSON.stringify(rowData[rowId].protoc) === JSON.stringify(["All Outbound Traffic"]))
      ) { 
        return; }
    if ( selectedRows.includes(rowId) ) {
      const multi = {rowId, cellIndex, MultiCellIndex};
      setselectedMultiCellClick([multi]);
      setSelectedCells([]);
      setSelectedRows([]);
    }
  };

  const handleMultiCellContextMenu = (event, rowId, cellIndex, MultiCellIndex, cellDataLength) => {
    if (!selectedMultiCellClick.some((cell) => cell.rowId === rowId && cell.cellIndex === cellIndex && cell.MultiCellIndex === MultiCellIndex)) {
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;

    const items = [
      ...(cellDataLength === 1 ? [] : [
        {
          label: "Remove",
          onClick: () => {
            setRowData((prevRowData) => {
              const newRowData = [...prevRowData];
              if (cellIndex === 3) {
                newRowData[rowId].protoc.splice(MultiCellIndex, 1);
              }
              if (cellIndex === 4) {
                newRowData[rowId].FL.splice(MultiCellIndex, 1);
              }
              if (cellIndex === 5) {
                newRowData[rowId].to.splice(MultiCellIndex, 1);
              }
              return newRowData;
            });
            setselectedMultiCellClick([]);
          },
        }
      ]),
      { label: "Properties", onClick: () => console.log("Properties clicked") }
    ];
  
    setContextMenu({ x, y, items });
  };

  return (
    <div
      style={{
        height: "calc(100vh - 20vh)",
        width: "100%",
        overflow: "auto",
      }}
    >
      <SearchBar onSearch={(value) => setSearchValue(value)} />
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
            <th onClick={() => requestSort('order', sortConfig, setSortConfig)}>
              Order {renderArrowIcon('order', sortConfig)}
            </th>
            <th onClick={() => requestSort('name', sortConfig, setSortConfig)}>
              Name {renderArrowIcon('name', sortConfig)}
            </th>
            <th onClick={() => requestSort('act', sortConfig, setSortConfig)}>
              Action {renderArrowIcon('act', sortConfig)}
            </th>
            <th onClick={() => requestSort('protoc', sortConfig, setSortConfig)}>
              Protocols {renderArrowIcon('protoc', sortConfig)}
            </th>
            <th onClick={() => requestSort('FL', sortConfig, setSortConfig)}>
              From / Listener {renderArrowIcon('FL', sortConfig)}
            </th>
            <th onClick={() => requestSort('to', sortConfig, setSortConfig)}>
              To {renderArrowIcon('to', sortConfig)}
            </th>
            <th onClick={() => requestSort('cond', sortConfig, setSortConfig)}>
              Condition {renderArrowIcon('cond', sortConfig)}
            </th>
            <th onClick={() => requestSort('desc', sortConfig, setSortConfig)}>
              Description {renderArrowIcon('desc', sortConfig)}
            </th>
            <th onClick={() => requestSort('policy', sortConfig, setSortConfig)}>
              Policy {renderArrowIcon('policy', sortConfig)}
            </th>
          </tr>
        </thead>
        <tbody>
          {filterRows(sortRows(rowData, sortConfig, rowData), searchValue).map((row) => (
            <AllFirewallPolicyRow
              key={row.id}
              row={row}
              rowId={row.id}
              handleCellClick={handleCellClick}
              selectedCells={selectedCells}
              selectedRows={selectedRows}
              onRowCheckboxChange={handleRowCheckboxChange}
              onRowContextMenu={handleRowContextMenu}
              onCellContextMenu={handleCellContextMenu}
              selectedMultiCellClick={selectedMultiCellClick}
              handleMultiCellClick={handleMultiCellClick}
              onMultiCellContextMenu={handleMultiCellContextMenu}
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