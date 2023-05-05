//AllFirewallPolicyUtilities.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import propertiesIcon from '../../../Images/properties-icon.svg';
import deleteIcon from '../../../Images/delete-icon.svg';
import multicelldeleteIcon from '../../../Images/delete-icon.svg';
import moveUpIcon from '../../../Images/move-up-icon.svg';
import moveDownIcon from '../../../Images/move-down-icon.svg';
import checkIcon from '../../../Images/check-circle.svg';
import denyIcon from '../../../Images/deny-icon.svg';

const deleteSelectedRows = (rowData, selectedRows, userContext, setSelectedRows, fetchRowDetails, ruleType) => {
  console.log(rowData)
  const data = {
    "id" : rowData[selectedRows[0]]._id,
    "rule_type" : ruleType
  }
  fetch("http://localhost:3001/api/rules/delete/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userContext.token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        fetchRowDetails();
        setSelectedRows([]);
      } else {
        return response.json().then((errorData) => {
            console.log(errorData);
        });
      }
    })
};

const moveRow = (rowData, setSelectedRows, rowId, userContext, fetchRowDetails, ruleType, direction) => {
  const data = {
    "rule_type" : ruleType,
    "direction" : direction
  }

  fetch("http://localhost:3001/api/rules/move/" + rowData[rowId].order, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userContext.token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        fetchRowDetails();
        if (direction === "up") {
          setSelectedRows([rowId - 1])
        } else if (direction === "down") {
          setSelectedRows([rowId + 1])
        }
      } else {
        return response.json().then((errorData) => {
            console.log(errorData);
        });
      }
    })
};

export const SingleRowContextMenu = (rowData, selectedRows, setSelectedRows, rowId, setShowPropertiesPopUp, userContext, fetchRowDetails, ruleType) => {
  return {
    Properties: () => setShowPropertiesPopUp(true),
    Delete: () => deleteSelectedRows(rowData, selectedRows, userContext, setSelectedRows, fetchRowDetails, ruleType),
    "Move Up": () => moveRow(rowData, setSelectedRows, rowId, userContext,  fetchRowDetails, ruleType, "up"),
    "Move Down": () => moveRow(rowData, setSelectedRows, rowId, userContext,  fetchRowDetails, ruleType, "down"),
  };
};

export const requestSort = (key, sortConfig, setSortConfig) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
    direction = 'default';
  }
  setSortConfig({ key, direction });
};

export const sortRows = (rows, sortConfig, rowData) => {
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

export const renderArrowIcon = (key, sortConfig) => {
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

export const filterRows = (rows, searchValue) => {
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

export const SingleRowToolbarIcons = {
  Properties: propertiesIcon,
  Delete: deleteIcon,
  "Move Up": moveUpIcon,
  "Move Down": moveDownIcon,
};


export const tooltip_text = {
  Properties: "Properties",
  Delete: "Delete",
  "Move Up": "Move Up",
  "Move Down": "Move Down",
}

const toggleAcceptDrop = (rowData, rowId, setSelectedCells, userContext, fetchRowDetails, ruleType, action) => {
  const data = {...rowData[rowId], 
    "id" : rowData[rowId]._id,
    "action" : action,
    "rule_type" : ruleType
  };
  fetch("http://localhost:3001/api/rules/edit", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            fetchRowDetails();
          } else {
            return response.json().then((errorData) => {
              console.log(errorData);
            });
          }
        })
  setSelectedCells([]);
};

export const CellContextMenu = (rowData, rowId, setSelectedCells, userContext, fetchRowDetails, ruleType) => {
  return{
    Accept : () => toggleAcceptDrop(rowData, rowId, setSelectedCells, userContext, fetchRowDetails, ruleType, "Accept"),
    Drop : () => toggleAcceptDrop(rowData, rowId, setSelectedCells, userContext, fetchRowDetails, ruleType, "Drop"),
  }
}

export const CellToolbarIcons = {
  Accept : checkIcon,
  Drop : denyIcon
}

export const CellTooltipText = {
  Accept : "Accept",
  Drop : "Drop"
}

const handleRemoveItems = (rowId, rowData, cellIndex, MultiCellIndex, setselectedMultiCellClick, userContext, ruleType, fetchRowDetails) => {
  const newRowData = { ...rowData[rowId] };
  
  if (cellIndex === 3) {
    const availableKey = ["selectedProtocols", "allOutbound", "allOutboundExcept"].find(
      (key) => key in newRowData.tcp_protocol
    );
    newRowData.tcp_protocol[availableKey].splice(MultiCellIndex, 1);
  }
  else if (cellIndex === 4) {
    const availableKey = ["selectedProtocols", "allOutbound", "allOutboundExcept"].find(
      (key) => key in newRowData.udp_protocol
    );
    newRowData.udp_protocol[availableKey].splice(MultiCellIndex, 1);
  }
  else if (cellIndex === 5) {
    newRowData.source_network.splice(MultiCellIndex, 1);
  }
  else if (cellIndex === 6) {
    newRowData.destination_network.splice(MultiCellIndex, 1);
  }
  
  const data = {...newRowData, 
    "id" : rowData[rowId]._id,
    "rule_type" : ruleType,
    "tcp_protocol" : newRowData.tcp_protocol,
    "udp_protocol" : newRowData.udp_protocol,
    "source_network" : newRowData.FL,
    "destination_network" : newRowData.to
  };
  
  fetch("http://localhost:3001/api/rules/edit", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userContext.token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        fetchRowDetails();
      } else {
        return response.json().then((errorData) => {
          console.log(errorData);
        });
      }
    })
    setselectedMultiCellClick([]);
}

export const MultiCellContextMenu = (rowId, rowData, cellIndex, MultiCellIndex, setselectedMultiCellClick, userContext, ruleType, fetchRowDetails) => {
  return {
    Remove : () => handleRemoveItems(rowId, rowData, cellIndex, MultiCellIndex, setselectedMultiCellClick, userContext, ruleType, fetchRowDetails),
    Properties : () => console.log("Properties clicked")
  };
}

export const MultiCellToolbarIcons = {
  Remove : multicelldeleteIcon,
  Properties : propertiesIcon
}

export const MultiCellTooltipText = {
  Remove : "Remove",
  Properties : "Properties"
};