//AllFirewallPolicyTable.js
import React, { useState, useEffect } from "react";
import AllFirewallPolicyRow from "./AllFirewallPolicyRow";
import ContextMenu from "../ContextMenu";
import { AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import initialRowData from "./AllFirewallPolicyData.json";
import {areSelectedRowsContiguous,
        requestSort,
        sortRows,
        renderArrowIcon,
        filterRows,
        SingleRowContextMenu,
        MultiRowContextMenu} from "./AllFirewallPolicyUtilities.js";
import ToolBarComponent from "./ToolBarComponent.js";
import NewAccessRule from "./PopUps/AccessRulePopUp/NewAccessRule";
import "./AllFirewallPolicyTable.css";

const AllFirewallPolicyTable = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemsselectedRows, setItemsSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData, setRowData] = useState(initialRowData);
  const [selectedMultiCellClick, setselectedMultiCellClick] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [searchValue, setSearchValue] = useState("");
  // Add Rule States
  const [showPopup, setShowPopup] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleAction, setRuleAction] = useState('Deny');
  const [ruleAppliesTo, setRuleAppliesTo] = useState("selectedProtocols");
  const [items, setItems] = useState([]);
  const [sourceItems, setSourceItems] = useState([]);
  const [destinationItems, setDestinationItems] = useState([]);
  const [PortsPopupData, setPortsPopupData] = useState([
    "anySourcePort",
    0,
    0,
  ]);

  const handleRowContextMenu = (event, rowId) => {
    if (!selectedRows.includes(rowId)) {
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
  
    const isRowDisabled = rowData[rowId].disabled;
  
    let items;

    if (selectedRows.length === 1) {
      items = itemsselectedRows.map((label) => ({
        label : label,
        onClick: SingleRowContextMenu(rowData, selectedRows, setRowData, setSelectedRows, rowId, isRowDisabled)[label],
      }));
    } else {
      items = itemsselectedRows.map((label) => ({
        label : label,
        onClick: MultiRowContextMenu(rowData, selectedRows, setRowData, setSelectedRows)[label],
      }));
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
  
  useEffect(() => {
    if (selectedRows.length === 0) {
      setItemsSelectedRows([]);
    } else if (selectedRows.length === 1)  {
      const rowId = selectedRows[0];
      const isLastRow = rowId === rowData.length - 1;
      const isFirstRow = rowId === 0;
      const isSecondToLastRow = rowId === rowData.length - 2;
      const isRowDisabled = rowData[rowId].disabled;
  
      setItemsSelectedRows([
        "Properties",
        ...(isLastRow ? [] : ["Delete", "Create Group"]),
        ...(isFirstRow ? [] : ["Move Up"]),
        ...(isSecondToLastRow ? [] : ["Move Down", isRowDisabled ? "Enable" : "Disable"]),
      ]);
    } else {
      const firstSelectedRow = Math.min(...selectedRows);
      const lastSelectedRow = Math.max(...selectedRows);
      const areAllSelectedRowsEnabled = selectedRows.every((rowId) => !rowData[rowId].disabled);
      const areAllSelectedRowsDisabled = selectedRows.every((rowId) => rowData[rowId].disabled);

      let multiSelectedItems = [
        "Delete",
        ...(areSelectedRowsContiguous(selectedRows) ? ["Create Group"] : []),
        ...(firstSelectedRow === 0 ? [] : ["Move Up"]),
        ...(lastSelectedRow === rowData.length - 2 ? [] : ["Move Down"]),
      ];
  
      if (areAllSelectedRowsEnabled) {
        multiSelectedItems.push("Disable");
      } else if (areAllSelectedRowsDisabled) {
        multiSelectedItems.push("Enable");
      } else {
        multiSelectedItems.push("Enable", "Disable");
      }
  
      setItemsSelectedRows(multiSelectedItems);
    }
  }, [selectedRows, rowData]);

  const handleMultiCellClick = (rowId, cellIndex, MultiCellIndex) => {
    if ((cellIndex !== 3 && cellIndex !== 4 && cellIndex !== 5) ||
      rowId === rowData.length - 1 ||
      (cellIndex === 3 && JSON.stringify(rowData[rowId].protoc) === JSON.stringify(["All outbound traffic"]))
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

  const openPopup = () => {
    setShowPopup(true);
  };

  const handleAccessRuleData = (data) => {
    // Create a new object without the 'ports' key
    const { ports, ...newRow } = data;
  
    // Increment the 'id' and 'order' values in the existing rowData
    const updatedRows = rowData.map((row) => {
      // If the order is 'Last', leave it as is
      if (row.order === "Last") {
        return {
          ...row,
          id: row.id + 1,
        };
      }
      // Otherwise, increment the order value
      return {
        ...row,
        id: row.id + 1,
        order: (parseInt(row.order) + 1).toString(),
      };
    });
  
    // Add the new dictionary to the rowData array
    const newRowData = [newRow, ...updatedRows];
  
    // Update the rowData state with the new array
    setRowData(newRowData);
  
    // You can use the 'ports' value for other purposes here
    console.log(ports);
  };  
  

  return (
    <div
      style={{
        height: "calc(100vh - 20vh)",
        width: "100%",
        overflow: "auto",
      }}
    >
      <ToolBarComponent 
        onSearch={(value) => setSearchValue(value)} 
        itemsSelectedRows={itemsselectedRows}
        rowData = {rowData}
        selectedRows = {selectedRows}
        setRowData = {setRowData}
        setSelectedRows = {setSelectedRows}
        rowId = {selectedRows[0]}
        isRowDisabled = {rowData[selectedRows[0]]?.disabled}
        openPopup = {openPopup}
      />
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
      <NewAccessRule
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onFinish={handleAccessRuleData}
        ruleName={ruleName}
        setRuleName={setRuleName}
        ruleAction={ruleAction}
        setRuleAction={setRuleAction}
        ruleAppliesTo={ruleAppliesTo}
        setRuleAppliesTo={setRuleAppliesTo}
        items={items}
        setItems={setItems}
        PortsPopupData={PortsPopupData}
        setPortsPopupData={setPortsPopupData}
        sourceItems={sourceItems}
        setSourceItems={setSourceItems}
        destinationItems={destinationItems}
        setDestinationItems={setDestinationItems}
      />
    </div>
  );
};

export default AllFirewallPolicyTable;