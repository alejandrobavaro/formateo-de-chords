import React from 'react';
import '../assets/scss/_03-Componentes/_HeaderSearchBar.scss';

function HeaderSearchBar({ searchQuery = '', setSearchQuery = () => {}, placeholder = 'Buscar...' }) {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="searchbar-input"
        aria-label="Buscar"
      />
    </div>
  );
}

export default HeaderSearchBar;