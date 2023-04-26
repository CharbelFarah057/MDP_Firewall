//AllFirewallPolicyTable.js
import React, { useState, useEffect } from "react";
import FirewallPolicyRow from "./FirewallPolicyRow";
import ContextMenu from "../ContextMenu";
import { AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import { rowData as initialRowData } from "./FirewallPolicyData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./SearchBar";
import "./FirewallPolicyTable.css";

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

    const areSelectedRowsContiguous = () => {
      const sortedSelectedRows = [...selectedRows].sort((a, b) => a - b);
      for (let i = 1; i < sortedSelectedRows.length; i++) {
        if (sortedSelectedRows[i] !== sortedSelectedRows[i - 1] + 1) {
          return false;
        }
      }
      return true;
    };
        
    if (selectedRows.length === 1) {
      items = [
        { label: "Properties", onClick: () => console.log("Properties clicked") },
        ...(isLastRow
          ? []
          : [
            { label: "Delete", onClick: () => deleteSelectedRows() },
              { label: "Create Group", onClick: () => console.log("Create Group clicked") },
              ...(isFirstRow
                ? []
                : [{ label: "Move Up", onClick: () => moveRowUp(rowId) }]),
              ...(isSecondToLastRow
                ? []
                : [{ label: "Move Down", onClick: () => moveRowDown(rowId) }]),
                {
                  label: isRowDisabled ? "Enable" : "Disable",
                  onClick: () => toggleDisableEnable(isRowDisabled),
                },
            ]),
      ];
    } else {
      const firstSelectedRow = Math.min(...selectedRows);
      const lastSelectedRow = Math.max(...selectedRows);
      items = [
        { label: "Delete", onClick: () => deleteSelectedRows() },
        ...(areSelectedRowsContiguous()
          ? [
              {
                label: "Create Group",
                onClick: () => console.log("Create Group clicked"),
              },
            ]
          : []),
        ...(firstSelectedRow === 0
          ? []
          : [{ label: "Move Up", onClick: () => moveSelectedRowsUp() },]),
        ...(lastSelectedRow === rowData.length - 2
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

  const filterRows = (rows) => {
    if (searchValue.trim() === "") {
      return rows;
    }

    return rows.filter((row) =>
      Object.values(row).some((cellValue) =>
        cellValue
          .toString()
          .toLowerCase()
          .includes(searchValue.trim().toLowerCase())
      )
    );
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
            <th onClick={() => requestSort('order')}>
              Order {renderArrowIcon('order')}
            </th>
            <th onClick={() => requestSort('name')}>
              Name {renderArrowIcon('name')}
            </th>
            <th onClick={() => requestSort('act')}>
              Action {renderArrowIcon('act')}
            </th>
            <th onClick={() => requestSort('protoc')}>
              Protocols {renderArrowIcon('protoc')}
            </th>
            <th onClick={() => requestSort('FL')}>
              From / Listener {renderArrowIcon('FL')}
            </th>
            <th onClick={() => requestSort('to')}>
              To {renderArrowIcon('to')}
            </th>
            <th onClick={() => requestSort('cond')}>
              Condition {renderArrowIcon('cond')}
            </th>
            <th onClick={() => requestSort('desc')}>
              Description {renderArrowIcon('desc')}
            </th>
            <th onClick={() => requestSort('policy')}>
              Policy {renderArrowIcon('policy')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filterRows(sortRows(rowData)).map((row) => (
            <FirewallPolicyRow
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