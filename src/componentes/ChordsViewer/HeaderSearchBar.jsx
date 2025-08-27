import React from 'react';
import { BsSearch } from "react-icons/bs";
import { useHeaderSearch } from "./HeaderSearchContext";
import "../../assets/scss/_03-Componentes/_HeaderSearchBar.scss";

/**
 * Componente de barra de búsqueda para el header
 * Se conecta con el contexto global de búsqueda
 */
const HeaderSearchBar = ({ placeholder = "Buscar acordes, canciones..." }) => {
  // Obtener estado y función de búsqueda del contexto
  const { searchQuery, setSearchQuery } = useHeaderSearch();

  /**
   * Maneja el cambio en el input de búsqueda
   * @param {Object} e - Evento del input
   */
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