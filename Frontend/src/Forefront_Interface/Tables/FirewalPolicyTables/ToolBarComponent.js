//SearchBar.js
import React, { useState } from "react";
import "./ToolBarComponent.css";
import searchIcon from "../../../Images/search-magnifying-glass.svg";
import closeIcon from "../../../Images/cross-close.svg";

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <div className="search-bar-container">
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
    </div>
  );
};

export default SearchBar;
