//OutputTable.js
import React, { useCallback, useContext, useState, useEffect } from "react";
import { UserContext } from "../../../UserContext"
import RowRendering from "./RowRendering";
import ContextMenu from "../ContextMenu";
import {areSelectedRowsContiguous,
        requestSort,
        sortRows,
        renderArrowIcon,
        filterRows,
        SingleRowContextMenu,
        MultiRowContextMenu,
        CellContextMenu,
        MultiCellContextMenu} from "./TableUtilities.js";
import ToolBarComponent from "./ToolBarComponent.js";
import NewAccessRule from "./PopUps/AccessRulePopUp/NewAccessRule";
import PropertiesPopUp from "./PopUps/PropertiesPopUp/PropertiesPopUp";
import ToolBoxPopUp from "./PopUps/ToolBoxPopUp/ToolBoxPopUp";
import "./MainTable.css";

const OutputTable = () => {
  const ruleType = "output";
  const [userContext] = useContext(UserContext)
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemsselectedRows, setItemsSelectedRows] = useState([]);
  const [itemsselectedCells, setItemsSelectedCells] = useState([]);
  const [itemsselectedMultiCells, setItemsSelectedMultiCells] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [selectedMultiCellClick, setselectedMultiCellClick] = useState([]);
  const [MultiCellLength, setMultiCellLength] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [searchValue, setSearchValue] = useState("");
  // Add Rule States
  const [showPopup, setShowPopup] = useState(false);
  const [showToolBoxPopUp, setShowToolBoxPopUp] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleAction, setRuleAction] = useState('Drop');
  const [ruleAppliesTo, setRuleAppliesTo] = useState("selectedProtocols");
  const [items, setItems] = useState([]);
  const [sourceItems, setSourceItems] = useState([]);
  const [destinationItems, setDestinationItems] = useState([]);
  const [PortsPopupData, setPortsPopupData] = useState({"anySourcePort" : [0, 65535]});
  // Add Properties PopUp state
  const [showPropertiesPopUp, setShowPropertiesPopUp] = useState(false);

  const fetchRowDetails = useCallback(() => {
    fetch("http://localhost:3001/api/rules/"+ruleType, {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setRowData(
          data.map((item) => {
            const { __v, ...rest } = item;
            return rest;
          })
        );
      } else {
        if (response.status === 401) {
          window.location.reload()
        } else {
          setRowData([])
        }
      }
    })
  }, [userContext.token])

  useEffect(() => {
    // fetch only when user rowData are not present
    if (!userContext.rowData) {
      fetchRowDetails()
    }
  }, [userContext.rowData, fetchRowDetails])

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
        onClick: SingleRowContextMenu(rowData, selectedRows, setSelectedRows, rowId, isRowDisabled, setShowPropertiesPopUp, userContext, fetchRowDetails, ruleType)[label],
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
      setselectedMultiCellClick([]);
    }
  };

  const handleCellContextMenu = (event, rowId, cellIndex) => {
    if (!selectedCells.some((cell) => cell.rowId === rowId && cell.cellIndex === cellIndex)) {
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    const items = itemsselectedCells.map((label) => ({
        label : label,
        checked : rowData[rowId].act === label,
        onClick : CellContextMenu(rowData, rowId, setSelectedCells, userContext, fetchRowDetails, ruleType)[label],
      }));
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
        ...(isLastRow ? [] : ["Delete", 
        ...(isFirstRow ? [] : ["Move Up"]),
        ...(isSecondToLastRow ? [] : ["Move Down", isRowDisabled ? "Enable" : "Disable"]), ]),
        
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
  }, [selectedRows, rowData, setItemsSelectedRows]);

  useEffect(() => {
    if (selectedCells.length === 0) {
      setItemsSelectedCells([]);
    } else if (selectedCells.length === 1) {
      setItemsSelectedCells(["Accept", "Drop"]);
    }
  }, [selectedCells, setItemsSelectedCells]);

  useEffect(() => {
    if (selectedMultiCellClick.length === 0) {
      setItemsSelectedMultiCells([]);
    } else {
      if (MultiCellLength === 1) {
        setItemsSelectedMultiCells(["Properties"]);
      } else {
        setItemsSelectedMultiCells(["Remove", "Properties"]);
      }
    }
  }, [selectedMultiCellClick, MultiCellLength, setItemsSelectedMultiCells]);

  const handleMultiCellClick = (rowId, cellIndex, MultiCellIndex) => {
    const availableKey = ["selectedProtocols", "allOutbound", "allOutboundExcept"].find(
      (key) => key in rowData[rowId].protoc);
    if ((cellIndex !== 3 && cellIndex !== 4 && cellIndex !== 5) ||
      rowId === rowData.length - 1 ||
      (cellIndex === 3 && JSON.stringify(rowData[rowId].protoc[availableKey]) === JSON.stringify(["All outbound traffic"]))
      ) { 
        return; }
    if ( selectedRows.includes(rowId) ) {
      const multi = {rowId, cellIndex, MultiCellIndex};
      setselectedMultiCellClick([multi]);
      setSelectedCells([]);
      setSelectedRows([]);
    }
  };

  const handleMultiCellContextMenu = (event, rowId, cellIndex, MultiCellIndex) => {
    if (!selectedMultiCellClick.some((cell) => cell.rowId === rowId && cell.cellIndex === cellIndex && cell.MultiCellIndex === MultiCellIndex)) {
      return;
    }
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;

    const items = itemsselectedMultiCells.map((label) => ({
      label : label,
      onClick : MultiCellContextMenu(rowId, rowData, cellIndex, MultiCellIndex, setselectedMultiCellClick, userContext, ruleType, fetchRowDetails)[label],
    }));

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
      <ToolBarComponent 
        onSearch={(value) => setSearchValue(value)} 
        itemsSelectedRows={itemsselectedRows}
        itemsselectedCells={itemsselectedCells}
        rowData = {rowData}
        selectedRows = {selectedRows}
        setRowData = {setRowData}
        setSelectedRows = {setSelectedRows}
        setSelectedCells = {setSelectedCells}
        rowId = {selectedRows[0]}
        cellrowId = {selectedCells[0]?.rowId}
        isRowDisabled = {rowData[selectedRows[0]]?.disabled}
        openPopup = {() => setShowPopup(true)}
        openToolBoxPopUp = {() => setShowToolBoxPopUp(true)}
        setShowPropertiesPopUp = {setShowPropertiesPopUp}
        setselectedMultiCellClick = {setselectedMultiCellClick}
        itemsselectedMultiCells = {itemsselectedMultiCells}
        userContext={userContext}
        fetchRowDetails={fetchRowDetails}
        ruleType={ruleType}
        multicellrowid = {selectedMultiCellClick[0]?.rowId}
        multicellindex = {selectedMultiCellClick[0]?.cellIndex}
        multicellcellindex = {selectedMultiCellClick[0]?.MultiCellIndex}
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
          </tr>
        </thead>
        <tbody>
          {filterRows(sortRows(rowData, sortConfig, rowData), searchValue).map((row) => (
            <RowRendering
              key={row.order}
              row={row}
              dataLength = {rowData.length}
              rowId={row.order - 1}
              handleCellClick={handleCellClick}
              selectedCells={selectedCells}
              selectedRows={selectedRows}
              onRowCheckboxChange={handleRowCheckboxChange}
              onRowContextMenu={handleRowContextMenu}
              onCellContextMenu={handleCellContextMenu}
              selectedMultiCellClick={selectedMultiCellClick}
              handleMultiCellClick={handleMultiCellClick}
              onMultiCellContextMenu={handleMultiCellContextMenu}
              setMultiCellLength={setMultiCellLength}
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
        onFinish={fetchRowDetails}
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
        userContext = {userContext}
        ruleType = {ruleType}
      />
      {showPropertiesPopUp && selectedRows.length === 1 &&
        <PropertiesPopUp 
          onClose={() => setShowPropertiesPopUp(false)} 
          onUpdate={fetchRowDetails}
          totalRows = {rowData.length}
          id = {rowData[selectedRows[0]]._id}
          order = {rowData[selectedRows[0]].order}
          name = {rowData[selectedRows[0]].name}
          act = {rowData[selectedRows[0]].act}
          protoc = {rowData[selectedRows[0]].protoc}
          FL = {rowData[selectedRows[0]].FL}
          to = {rowData[selectedRows[0]].to}
          desc = {rowData[selectedRows[0]].desc}
          disabled = {rowData[selectedRows[0]].disabled}
          ports = {rowData[selectedRows[0]].ports}
          userContext = {userContext}
          ruleType = {ruleType}
        />}
      {showToolBoxPopUp && <ToolBoxPopUp
        onClose = {() => setShowToolBoxPopUp(false)}
       />}
    </div>
  );
};

export default OutputTable;