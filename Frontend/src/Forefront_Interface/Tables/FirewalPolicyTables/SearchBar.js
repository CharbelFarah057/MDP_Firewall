import React from "react";
import "./SearchBar.css";
import searchIcon from '../../../Images/search-magnifying-glass.svg';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-bar-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ backgroundImage: `url(${searchIcon})` }}
      />
    </div>
  );
};

export default SearchBar;
