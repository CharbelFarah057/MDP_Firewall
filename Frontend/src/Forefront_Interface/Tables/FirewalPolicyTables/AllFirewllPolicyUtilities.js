import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export const toggleDisableEnable = (rowData, selectedRows, setRowData, action) => {
    const updatedData = [...rowData];
    selectedRows.forEach((selectedRowId) => {
      updatedData[selectedRowId].disabled = !action;
    });
    setRowData(updatedData);
  };

export const moveRowUp = (rowData, setRowData, setSelectedRows, rowId) => {
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
  
export const moveRowDown = (rowData, setRowData, setSelectedRows, rowId) => {
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

export const moveSelectedRowsUp = (rowData, selectedRows, setRowData, setSelectedRows) => {
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
  
export const moveSelectedRowsDown = (rowData, selectedRows, setRowData, setSelectedRows) => {
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
  
export const deleteSelectedRows = (rowData, selectedRows, setRowData, setSelectedRows) => {
    const updatedData = rowData.filter((_, index) => !selectedRows.includes(index));
  
    // Update the order values
    updatedData.forEach((row, index) => {
      row.order = String(index + 1);
      row.id = index;
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