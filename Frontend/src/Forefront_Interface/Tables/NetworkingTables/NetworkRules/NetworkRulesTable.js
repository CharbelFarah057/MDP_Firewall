//AllFirewallPolicyTable.js
import React, { useState, useEffect } from "react";
import NetworkRulesRow from "./NetworkRulesRows";
import ContextMenu from "../../ContextMenu";
import { rowData as initialRowData } from "./NetworkRulesData";
import "./NetworkRulesTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData, setRowData] = useState(initialRowData);
  const [selectedMultiCellClick, setselectedMultiCellClick] = useState([]);
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
  
    const isLastRow = rowId === rowData.length - 1;
    const isFirstRow = rowId === 0;
    const isSecondRow = rowId === 1;
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

    const moveRowUp = (rowId) => {
      const updatedData = [...rowData];
      const temp = updatedData[rowId - 1];
      updatedData[rowId - 1] = updatedData[rowId];
      updatedData[rowId] = temp;
    
      // Swap the order and id values
      updatedData[rowId - 1].order = String(rowId);
      updatedData[rowId].order = String(rowId + 1);
      updatedData[rowId - 1].id = rowId - 1;
      updatedData[rowId].id = rowId;
    
      setRowData(updatedData);
      setSelectedRows([rowId - 1])
    };
    
    const moveRowDown = (rowId) => {
      const updatedData = [...rowData];
      const temp = updatedData[rowId + 1];
      updatedData[rowId + 1] = updatedData[rowId];
      updatedData[rowId] = temp;
    
      // Swap the order and id values
      updatedData[rowId + 1].order = String(rowId + 2);
      updatedData[rowId].order = String(rowId + 1);
      updatedData[rowId + 1].id = rowId + 1;
      updatedData[rowId].id = rowId;
    
      setRowData(updatedData);
      setSelectedRows([rowId + 1])
    };

    const moveSelectedRowsUp = () => {
      const updatedData = [...rowData];
      const sortedSelectedRows = [...selectedRows].sort((a, b) => a - b);
    
      sortedSelectedRows.forEach((rowId, index) => {
        if (rowId > index) {
          const temp = updatedData[rowId - 1];
          updatedData[rowId - 1] = updatedData[rowId];
          updatedData[rowId] = temp;
    
          // Swap the order and id values
          updatedData[rowId - 1].order = String(rowId);
          updatedData[rowId].order = String(rowId + 1);
          updatedData[rowId - 1].id = rowId - 1;
          updatedData[rowId].id = rowId;
    
          // Update selected rows array
          sortedSelectedRows[index] = rowId - 1;
        }
      });
    
      setRowData(updatedData);
      setSelectedRows(sortedSelectedRows);
    };
    
    const moveSelectedRowsDown = () => {
      const updatedData = [...rowData];
      const sortedSelectedRows = [...selectedRows].sort((a, b) => b - a);
    
      sortedSelectedRows.forEach((rowId, index) => {
        if (rowId < rowData.length - 1 - index) {
          const temp = updatedData[rowId + 1];
          updatedData[rowId + 1] = updatedData[rowId];
          updatedData[rowId] = temp;
    
          // Swap the order and id values
          updatedData[rowId + 1].order = String(rowId + 2);
          updatedData[rowId].order = String(rowId + 1);
          updatedData[rowId + 1].id = rowId + 1;
          updatedData[rowId].id = rowId;
    
          // Update selected rows array
          sortedSelectedRows[index] = rowId + 1;
        }
      });
    
      setRowData(updatedData);
      setSelectedRows(sortedSelectedRows);
    };
    
    const deleteSelectedRows = () => {
      const updatedData = rowData.filter((_, index) => !selectedRows.includes(index));
    
      // Update the order values
      updatedData.forEach((row, index) => {
        row.order = String(index + 1);
        row.id = index;
      });
    
      setRowData(updatedData);
      setSelectedRows([]);
    };

    let items;
 
    if (selectedRows.length === 1) {
      items = [
        { label: "Properties", onClick: () => console.log("Properties clicked") },
        ...(isFirstRow
          ? []
          : [
            { label: "Delete", onClick: () => deleteSelectedRows() },
              ...(isSecondRow
                ? []
                : [{ label: "Move Up", onClick: () => moveRowUp(rowId) }]),
              ...(isLastRow
                ? []
                : [{ label: "Move Down", onClick: () => moveRowDown(rowId) }]),
                {
                  label: isRowDisabled ? "Enable" : "Disable",
                  onClick: () => toggleDisableEnable(isRowDisabled),
                },
            ]),
      ];
    } else {
      const SecondSelectedRow = Math.min(...selectedRows);
      const lastSelectedRow = Math.max(...selectedRows);
      items = [
        { label: "Delete", onClick: () => deleteSelectedRows() },
        ...(lastSelectedRow === rowData.length - 1
          ? []
          : [{ label: "Move Up", onClick: () => moveSelectedRowsUp() },]),
        ...(SecondSelectedRow === 1
          ? []
          : [{ label: "Move Down", onClick: () => moveSelectedRowsDown() },]),
      ];
      
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

  const handleCellClick = (rowId, cellIndex) => {
    if (
      rowId === 0 ||
      cellIndex !== 2 ||
      rowData[rowId].relation === ""
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
        label: "Route",
        checked: rowData[rowId].relation === "Route",
        onClick: () => {
          setRowData((prevRowData) => {
            const newRowData = [...prevRowData];
            newRowData[rowId].relation = "Route";
            return newRowData;
          });
          setSelectedCells([]);
        },
      },
      {
        label: "NAT",
        checked: rowData[rowId].relation === "NAT",
        onClick: () => {
          setRowData((prevRowData) => {
            const newRowData = [...prevRowData];
            newRowData[rowId].relation = "NAT";
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
    if (rowId === 0) {
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
          return [...prevRows, rowId];
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
      setSelectedRows(rowData.filter(row => row.id !== 0).map(row => row.id));
    }
    setSelectedCells([]);
    setselectedMultiCellClick([]);
  };

  const handleMultiCellClick = (rowId, cellIndex, MultiCellIndex) => {
    if ((cellIndex !== 3 && cellIndex !== 4) ||
      rowId === 0
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
                newRowData[rowId].srcnetworks.splice(MultiCellIndex, 1);
              }
              if (cellIndex === 4) {
                newRowData[rowId].dstnetworks.splice(MultiCellIndex, 1);
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
            {renderHeader("order", "Order")}
            {renderHeader("name", "Name")}
            {renderHeader("relation", "Relation")}
            {renderHeader("srcnetworks", "Source Netowrks")}
            {renderHeader("dstnetworks", "Destination Networks")}
            {renderHeader("nataddress", "NAT Address")}
            {renderHeader("desc", "Description")}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row) => (
            <NetworkRulesRow
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