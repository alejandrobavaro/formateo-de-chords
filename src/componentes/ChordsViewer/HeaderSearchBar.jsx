import React from 'react';
import { BsSearch } from "react-icons/bs";
import { useHeaderSearch } from "./HeaderSearchContext";
import "../../assets/scss/_03-Componentes/_HeaderSearchBar.scss";

const HeaderSearchBar = ({ placeholder = "Buscar acordes, canciones..." }) => {
  const { searchQuery, setSearchQuery } = useHeaderSearch();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="header-search-bar">
      <div className="search-container">
        <BsSearch className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default HeaderSearchBar;