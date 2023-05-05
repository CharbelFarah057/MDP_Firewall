//WebAccessTable.js
import React, { useCallback, useContext, useState, useEffect } from "react";
import { UserContext } from "../../../UserContext"
import RowRendering from "./RowRendering";
import ContextMenu from "../ContextMenu";
import {
    requestSort,
    sortRows,
    renderArrowIcon,
    filterRows,
    SingleRowContextMenu,} from "./TableUtilities.js";
import ToolBarComponent from "./ToolBarComponent";
import NewAccessRule from "./AccessRulePopUp/NewAccessRule";
import "./MainTable.css";

const WebAccessTable = () => {
  const [userContext] = useContext(UserContext)
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemsselectedRows, setItemsSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [searchValue, setSearchValue] = useState("");
  // Add Rule States
  const [showPopup, setShowPopup] = useState(false);
  const [Name, setName] = useState('');
  const [domain, setDomain] = useState([]);
  // Add Properties PopUp state

  const fetchRowDetails = useCallback(() => {
    fetch("http://localhost:3001/api/rules/squid_rules", {
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
        onClick: SingleRowContextMenu(rowData, selectedRows, setSelectedRows, userContext, fetchRowDetails)[label],
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
  };
  
  const handleSelectAllCheckboxChange = () => {
    if (selectedRows.length === rowData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rowData.map((_, index) => index));
    }
  };
  
  useEffect(() => {
    if (selectedRows.length === 0) {
      setItemsSelectedRows([]);
    } else if (selectedRows.length === 1)  {  
      setItemsSelectedRows(["Delete"]);
    }
  }, [selectedRows, rowData, setItemsSelectedRows]);

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
        setSelectedRows = {setSelectedRows}
        openPopup = {() => setShowPopup(true)}
        userContext={userContext}
        fetchRowDetails={fetchRowDetails}
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
            <th onClick={() => requestSort('name', sortConfig, setSortConfig)}>
              Name {renderArrowIcon('name', sortConfig)}
            </th>
            <th onClick={() => requestSort('domains', sortConfig, setSortConfig)}>
              Domain Names {renderArrowIcon('domains', sortConfig)}
            </th>
          </tr>
        </thead>
        <tbody>
          {filterRows(sortRows(rowData, sortConfig, rowData), searchValue).map((row, index) => (
            <RowRendering
              key={index}
              row={row}
              rowId={index}
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
      <NewAccessRule
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onFinish={fetchRowDetails}
        Name={Name}
        setName={setName}
        domain={domain}
        setDomain={setDomain}
        userContext = {userContext}
      />
    </div>
  );
};

export default WebAccessTable;