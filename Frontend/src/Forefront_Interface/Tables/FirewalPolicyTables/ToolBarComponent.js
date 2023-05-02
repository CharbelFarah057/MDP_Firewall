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
        tooltip_text,
        CellContextMenu,
        CellTooltipText,
        CellToolbarIcons,
        MultiCellContextMenu,
        MultiCellToolbarIcons,
        MultiCellTooltipText
      } from "./TableUtilities.js";

const ToolBarComponent = ({ 
  onSearch,
  itemsSelectedRows, 
  itemsselectedCells,
  rowData, 
  selectedRows, 
  selectedCells,
  setRowData, 
  setSelectedRows, 
  setSelectedCells,
  rowId, 
  isRowDisabled,
  openPopup,
  setShowPropertiesPopUp,
  selectedMultiCellClick,
  setselectedMultiCellClick,
  itemsselectedMultiCells
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showTooltip, setShowTooltip] = useState({});
  const [showCellTooltip, setShowCellTooltip] = useState({});
  const [showMultiCellTooltip, setShowMultiCellTooltip] = useState({});

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
        onClick: SingleRowContextMenu(rowData, selectedRows, setRowData, setSelectedRows, rowId, isRowDisabled, setShowPropertiesPopUp)[chosen_label],
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

  // const labelToFunctionMapCell = (chosen_label) => {
  //   return {
  //     label : chosen_label,
  //     checked : chosen_label,
  //     onClick: CellContextMenu(0, setSelectedCells, setRowData)[chosen_label],
  //   };
  // };

  // const labelToIconMapCell = (chosen_label) => {
  //   return CellToolbarIcons[chosen_label];
  // };

  // const selectedCellButtons = itemsselectedCells.map((label) => (
  //   <div className="icon-container" key={label}>
  //     <img
  //       src={labelToIconMapCell(label)}
  //       alt={label}
  //       className="icon"
  //       onClick={labelToFunctionMapCell(label).onClick}
  //       onMouseEnter={() => setShowCellTooltip({ ...showCellTooltip, [label]: true })}
  //       onMouseLeave={() => setShowCellTooltip({ ...showCellTooltip, [label]: false })}
  //     />
  //     {showCellTooltip[label] && (<div className="tooltip">
  //       <span>{CellTooltipText[label]}</span>
  //     </div>)}
  //   </div>
  // ));

  // const labelToFunctionMapMultiCell = (chosen_label) => {
  //   return {
  //     label : chosen_label,
  //     onClick: MultiCellContextMenu(0, 3, 0, setRowData, setselectedMultiCellClick)[chosen_label],
  //   };
  // };

  // const labelToIconMapMultiCell = (chosen_label) => {
  //   return MultiCellToolbarIcons[chosen_label];
  // };

  // const selectedMultiCellButtons = itemsselectedMultiCells.map((label) => (
  //   <div className="icon-container" key={label}>
  //     <img
  //       src={labelToIconMapMultiCell(label)}
  //       alt={label}
  //       className="icon"
  //       onClick={labelToFunctionMapMultiCell(label).onClick}
  //       onMouseEnter={() => setShowMultiCellTooltip({ ...showMultiCellTooltip, [label]: true })}
  //       onMouseLeave={() => setShowMultiCellTooltip({ ...showMultiCellTooltip, [label]: false })}
  //     />
  //     {showMultiCellTooltip[label] && (<div className="tooltip">
  //       <span>{MultiCellTooltipText[label]}</span>
  //     </div>)}
  //   </div>
  // ));

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
            onClick={openPopup}
          />
          {showTooltip.CreateAccessRule && (
            <div className="tooltip">
              <span>Create Access Rule</span>
            </div>
          )}
        </div>
        {selectedRowButtons}
        {/* {selectedCellButtons} */}
        {/* {selectedMultiCellButtons} */}
      </div>
    </div>
  );
};

export default ToolBarComponent;