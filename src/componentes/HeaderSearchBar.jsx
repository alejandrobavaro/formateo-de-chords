import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/_03-Componentes/_HeaderSearchBar.scss';

function HeaderSearchBar({ searchQuery = '', setSearchQuery = () => {}, placeholder = 'Search...' }) {
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
      />
    </div>
  );
}

HeaderSearchBar.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
  placeholder: PropTypes.string,
};

export default HeaderSearchBar;
