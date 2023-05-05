//ForwardTable.js
import React, { useCallback, useContext, useState, useEffect } from "react";
import { UserContext } from "../../../UserContext"
import RowRendering from "./RowRendering";
import ContextMenu from "../ContextMenu";
import {
        requestSort,
        sortRows,
        renderArrowIcon,
        filterRows,
        SingleRowContextMenu,
        CellContextMenu,
        MultiCellContextMenu} from "./TableUtilities.js";
import ToolBarComponent from "./ToolBarComponent.js";
import NewAccessRule from "./PopUps/AccessRulePopUp/NewAccessRule";
import PropertiesPopUp from "./PopUps/PropertiesPopUp/PropertiesPopUp";
import ToolBoxPopUp from "./PopUps/ToolBoxPopUp/ToolBoxPopUp";
import "./MainTable.css";

const ForwardTable = () => {
  const ruleType = "forward";
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
  const [tcp_protocol_items, setTcp_protocol_items] = useState([]);
  const [udp_protocol_items, setUdp_protocol_items] = useState([]);
  const [items, setItems] = useState([]);
  const [sourceItems, setSourceItems] = useState([]);
  const [destinationItems, setDestinationItems] = useState([]);
  const [PortsPopupData, setPortsPopupData] = useState({"anySourcePort" : [1, 65535, "tcp"]});
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
    
    let items = [];

    if (selectedRows.length === 1) {
      items = itemsselectedRows.map((label) => ({
        label : label,
        onClick: SingleRowContextMenu(rowData, selectedRows, setSelectedRows, rowId, setShowPropertiesPopUp, userContext, fetchRowDetails, ruleType)[label],
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
  
      setItemsSelectedRows([
        "Properties",
        ...(isLastRow ? [] : ["Delete", 
        ...(isFirstRow ? [] : ["Move Up"]),
        ...(isSecondToLastRow ? [] : ["Move Down"]), ]),
        
      ]);
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
      (key) => key in rowData[rowId].tcp_protocol);
    if ((cellIndex !== 3 && cellIndex !== 4 && cellIndex !== 5 && cellIndex !== 6) ||
      rowId === rowData.length - 1 ||
      (cellIndex === 3 && JSON.stringify(rowData[rowId].tcp_protocol[availableKey]) === JSON.stringify(["All outbound traffic"]))
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
            <th onClick={() => requestSort('action', sortConfig, setSortConfig)}>
              Action {renderArrowIcon('action', sortConfig)}
            </th>
            <th onClick={() => requestSort('tcp_protocol', sortConfig, setSortConfig)}>
              TCP Protocols {renderArrowIcon('tcp_protocol', sortConfig)}
            </th>
            <th onClick={() => requestSort('udp_protocol', sortConfig, setSortConfig)}>
              UDP Protocols {renderArrowIcon('udp_protocol', sortConfig)}
            </th>
            <th onClick={() => requestSort('source_networks', sortConfig, setSortConfig)}>
              From / Listener {renderArrowIcon('source_networks', sortConfig)}
            </th>
            <th onClick={() => requestSort('destination_networks', sortConfig, setSortConfig)}>
              To {renderArrowIcon('destination_networks', sortConfig)}
            </th>
            <th onClick={() => requestSort('condition', sortConfig, setSortConfig)}>
              Condition {renderArrowIcon('condition', sortConfig)}
            </th>
            <th onClick={() => requestSort('description', sortConfig, setSortConfig)}>
              Description {renderArrowIcon('description', sortConfig)}
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
        tcp_protocol_items={tcp_protocol_items}
        setTcp_protocol_items={setTcp_protocol_items}
        udp_protocol_items={udp_protocol_items}
        setUdp_protocol_items={setUdp_protocol_items}
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
          action = {rowData[selectedRows[0]].action}
          tcp_protocol = {rowData[selectedRows[0]].tcp_protocol}
          udp_protocol = {rowData[selectedRows[0]].udp_protocol}
          source_network = {rowData[selectedRows[0]].source_network}
          destination_network = {rowData[selectedRows[0]].destination_network}
          description = {rowData[selectedRows[0]].description}
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

export default ForwardTable;