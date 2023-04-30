//AllFirewallPolicyUtilities.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import propertiesIcon from '../../../Images/properties-icon.svg';
import deleteIcon from '../../../Images/delete-icon.svg';
import multicelldeleteIcon from '../../../Images/delete-icon.svg';
import createGroupIcon from '../../../Images/create-group-icon.svg';
import deleteGroupIcon from '../../../Images/delete-group-icon.svg';
import moveUpIcon from '../../../Images/move-up-icon.svg';
import moveDownIcon from '../../../Images/move-down-icon.svg';
import enableIcon from '../../../Images/enable-icon.svg';
import disableIcon from '../../../Images/disable-icon.svg';
import checkIcon from '../../../Images/check-circle.svg';
import denyIcon from '../../../Images/deny-icon.svg';


const toggleDisableEnable = (rowData, selectedRows, setRowData, action) => {
    const updatedData = [...rowData];
    selectedRows.forEach((selectedRowId) => {
      updatedData[selectedRowId].disabled = !action;
    });
    setRowData(updatedData);
};

const moveRowUp = (rowData, setRowData, setSelectedRows, rowId) => {
    const updatedData = [...rowData];
    const temp = updatedData[rowId - 1];
    updatedData[rowId - 1] = updatedData[rowId];
    updatedData[rowId] = temp;
  
    // Swap the order and id values
    updatedData[rowId - 1].order = rowId;
    updatedData[rowId].order = rowId + 1;
  
    setRowData(updatedData);
    setSelectedRows([rowId - 1])
};
  
const moveRowDown = (rowData, setRowData, setSelectedRows, rowId) => {
    const updatedData = [...rowData];
    const temp = updatedData[rowId + 1];
    updatedData[rowId + 1] = updatedData[rowId];
    updatedData[rowId] = temp;
  
    // Swap the order and id values
    updatedData[rowId + 1].order = rowId + 2;
    updatedData[rowId].order = rowId + 1;
  
    setRowData(updatedData);
    setSelectedRows([rowId + 1])
};

const moveSelectedRowsUp = (rowData, selectedRows, setRowData, setSelectedRows) => {
    const updatedData = [...rowData];
    const sortedSelectedRows = [...selectedRows].sort((a, b) => a - b);
  
    sortedSelectedRows.forEach((rowId, index) => {
      if (rowId > index) {
        const temp = updatedData[rowId - 1];
        updatedData[rowId - 1] = updatedData[rowId];
        updatedData[rowId] = temp;
  
        // Swap the order and id values
        updatedData[rowId - 1].order = rowId;
        updatedData[rowId].order = rowId + 1;
  
        // Update selected rows array
        sortedSelectedRows[index] = rowId - 1;
      }
    });
  
    setRowData(updatedData);
    setSelectedRows(sortedSelectedRows);
};
  
const moveSelectedRowsDown = (rowData, selectedRows, setRowData, setSelectedRows) => {
    const updatedData = [...rowData];
    const sortedSelectedRows = [...selectedRows].sort((a, b) => b - a);
  
    sortedSelectedRows.forEach((rowId, index) => {
      if (rowId < rowData.length - 1 - index) {
        const temp = updatedData[rowId + 1];
        updatedData[rowId + 1] = updatedData[rowId];
        updatedData[rowId] = temp;
  
        // Swap the order and id values
        updatedData[rowId + 1].order = rowId + 2;
        updatedData[rowId].order = rowId + 1;
  
        // Update selected rows array
        sortedSelectedRows[index] = rowId + 1;
      }
    });
  
    setRowData(updatedData);
    setSelectedRows(sortedSelectedRows);
};
  
const deleteSelectedRows = (rowData, selectedRows, setRowData, setSelectedRows) => {
    const updatedData = rowData.filter((_, index) => !selectedRows.includes(index));
  
    // Update the order values
    updatedData.forEach((row, index) => {
      row.order = index + 1;
    });
  
    setRowData(updatedData);
    setSelectedRows([]);
};

export const areSelectedRowsContiguous = (selectedRows) => {
    const sortedSelectedRows = [...selectedRows].sort((a, b) => a - b);
    for (let i = 1; i < sortedSelectedRows.length; i++) {
      if (sortedSelectedRows[i] !== sortedSelectedRows[i - 1] + 1) {
        return false;
      }
    }
    return true;
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

export const SingleRowContextMenu = (rowData, selectedRows, setRowData, setSelectedRows, rowId, isRowDisabled, setShowPropertiesPopUp) => {
  return {
    Properties: () => setShowPropertiesPopUp(true),
    Delete: () => deleteSelectedRows(rowData, selectedRows, setRowData, setSelectedRows),
    "Create Group": () => console.log("Create Group clicked"),
    "Move Up": () => moveRowUp(rowData, setRowData, setSelectedRows, rowId),
    "Move Down": () => moveRowDown(rowData, setRowData, setSelectedRows, rowId),
    Enable: () => toggleDisableEnable(rowData, selectedRows, setRowData, isRowDisabled),
    Disable: () => toggleDisableEnable(rowData, selectedRows, setRowData, isRowDisabled),
  };
};

export const MultiRowContextMenu = (rowData, selectedRows, setRowData, setSelectedRows) => {
  return {
    Delete: () => deleteSelectedRows(rowData, selectedRows, setRowData, setSelectedRows),
    "Create Group": () => console.log("Create Group clicked"),
    "Move Up":  () => moveSelectedRowsUp(rowData, selectedRows, setRowData, setSelectedRows),
    "Move Down":  () => moveSelectedRowsDown(rowData, selectedRows, setRowData, setSelectedRows),
    Enable: () => toggleDisableEnable(rowData, selectedRows, setRowData, true),
    Disable: () => toggleDisableEnable(rowData, selectedRows, setRowData, false),
  };
};

export const SingleRowToolbarIcons = {
  Properties: propertiesIcon,
  Delete: deleteIcon,
  "Create Group": createGroupIcon,
  "Move Up": moveUpIcon,
  "Move Down": moveDownIcon,
  Enable: enableIcon,
  Disable: disableIcon,
};

export const MultiRowToolbarIcons = {
  Delete: deleteIcon,
  "Create Group": createGroupIcon,
  "Move Up": moveUpIcon,
  "Move Down": moveDownIcon,
  Enable: enableIcon,
  Disable: disableIcon,
};

export const tooltip_text = {
  Properties: "Properties",
  Delete: "Delete",
  "Create Group": "Create Group",
  "Move Up": "Move Up",
  "Move Down": "Move Down",
  Enable: "Enable",
  Disable: "Disable",
}

const toggleAllow = (rowId, setSelectedCells, setRowData) => {
  setRowData((prevRowData) => {
    const newRowData = [...prevRowData];
    newRowData[rowId].act = "Accept";
    return newRowData;
  });
  setSelectedCells([]);
};

const toggleDeny = (rowId, setSelectedCells, setRowData) => {
  setRowData((prevRowData) => {
    const newRowData = [...prevRowData];
    newRowData[rowId].act = "Drop";
    return newRowData;
  });
  setSelectedCells([]);
};

export const CellContextMenu = (rowId, setSelectedCells, setRowData) => {
  return{
    Accept : () => toggleAllow(rowId, setSelectedCells, setRowData),
    Drop : () => toggleDeny(rowId, setSelectedCells, setRowData),
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

const handleRemoveItems = (rowId, cellIndex, MultiCellIndex, setRowData, setselectedMultiCellClick) => {
  setRowData((prevRowData) => {
    const newRowData = [...prevRowData];
    if (cellIndex === 3) {
      const availableKey = ["selectedProtocols", "allOutbound", "allOutboundExcept"].find(
        (key) => key in newRowData[rowId].protoc);
      newRowData[rowId].protoc[availableKey].splice(MultiCellIndex, 1);
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
};

export const MultiCellContextMenu = (rowId, cellIndex, MultiCellIndex, setRowData, setselectedMultiCellClick) => {
  return {
    Remove : () => handleRemoveItems(rowId, cellIndex, MultiCellIndex, setRowData, setselectedMultiCellClick),
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
}