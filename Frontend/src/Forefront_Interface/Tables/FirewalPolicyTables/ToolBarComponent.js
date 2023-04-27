// ToolBarComponent.js
import React, { useState } from "react";
import "./ToolBarComponent.css";
import searchIcon from "../../../Images/search-magnifying-glass.svg";
import closeIcon from "../../../Images/cross-close.svg";
import placeholderIcon from "../../../Images/plus-circle.svg";

import {MultiRowContextMenu,
        SingleRowContextMenu, 
        SingleRowToolbarIcons, 
        MultiRowToolbarIcons,
        tooltip_text} from "./AllFirewllPolicyUtilities";

const ToolBarComponent = ({ onSearch, itemsSelectedRows, rowData, selectedRows, setRowData, setSelectedRows, rowId, isRowDisabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [showTooltip, setShowTooltip] = useState({});

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  const labelToFunctionMap = (chosen_label, length) => {
    if (length === 1) {
      return {
        label : chosen_label,
        onClick: SingleRowContextMenu(rowData, selectedRows, setRowData, setSelectedRows, rowId, isRowDisabled)[chosen_label],
      };
    } else {
      return {
        label: chosen_label,
        onClick: MultiRowContextMenu(rowData, selectedRows, setRowData, setSelectedRows)[chosen_label],
      };
    }
  };
  
  const labelToIconMap = (chosen_label, length) => {
      if (length === 1) {
        return SingleRowToolbarIcons[chosen_label];
      } else {
        return MultiRowToolbarIcons[chosen_label];
      }
  };

  const selectedRowButtons = itemsSelectedRows.map((label) => (
    <div className="icon-container" key={label}>
      <img
        src={labelToIconMap(label, selectedRows.length)}
        alt={label}
        className="icon"
        onClick={labelToFunctionMap(label, selectedRows.length).onClick}
        onMouseEnter={() => setShowTooltip({ ...showTooltip, [label]: true })}
        onMouseLeave={() => setShowTooltip({ ...showTooltip, [label]: false })}
      />
      {showTooltip[label] && (<div className="tooltip">
        <span>{tooltip_text[label]}</span>
      </div>)}
    </div>
  ));

  return (
    <div className="tool-bar-container">
      {inputValue ? (
        <img
          src={closeIcon}
          alt="Clear"
          className="icon close-icon"
          onClick={handleClear}
        />
      ) : (
        <img src={searchIcon} alt="Search" className="icon search-icon" />
      )}
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={handleChange}
      />
      <div className="right-side-buttons">
        <div className="icon-container">
          <img
            src={placeholderIcon}
            alt="Create Policy"
            className="icon create-policy-icon"
            onMouseEnter={() => setShowTooltip({ ...showTooltip, CreateAccessRule: true })}
            onMouseLeave={() => setShowTooltip({ ...showTooltip, CreateAccessRule: false })}
          />
          {showTooltip.CreateAccessRule && (
            <div className="tooltip">
              <span>Create Access Rule</span>
            </div>
          )}
        </div>
        {selectedRowButtons}
      </div>
    </div>
  );
};

export default ToolBarComponent;
