//AllFirewallPolicyUtilities.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import deleteIcon from '../../../Images/delete-icon.svg';

const deleteSelectedRows = (rowData, selectedRows, userContext, setSelectedRows, fetchRowDetails) => {
  console.log(rowData)
  const data = {
    "id" : rowData[selectedRows[0]].name,
  }
  fetch("http://localhost:3001/api/rules/squid_delete/", {
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

export const SingleRowContextMenu = (rowData, selectedRows, setSelectedRows, userContext, fetchRowDetails) => {
  return {
    Delete: () => deleteSelectedRows(rowData, selectedRows, userContext, setSelectedRows, fetchRowDetails),
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
  Delete: deleteIcon,
};

export const tooltip_text = {
  Delete: "Delete",
}