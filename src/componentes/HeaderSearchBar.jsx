import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { HeaderSearchContextBuscadorModular } from './HeaderSearchContext';
import '../assets/scss/_03-Componentes/_HeaderSearchBar.scss';

function HeaderSearchBar({ placeholder = 'Buscar acordes, canciones...' }) {
  const [localQuery, setLocalQuery] = useState('');
  const navigate = useNavigate();

  // Usar el contexto si está disponible, sino usar valores por defecto
  const context = useContext(HeaderSearchContextBuscadorModular);
  const setSearchQuery = context?.setSearchQuery || (() => {});
  const setSelectedCategory = context?.setSelectedCategory || (() => {});

  const handleSearchChange = (event) => {
    setLocalQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      setSelectedCategory('TODOS');

      // Redirigir a la página de chords viewer con la búsqueda
      navigate('/chords-viewer', {
        state: {
          searchTerm: localQuery.trim(),
          fromSearch: true
        }
      });
    }
  };

  return (
    <form className="searchbar" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={localQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="searchbar-input"
        aria-label="Buscar acordes y canciones"
      />
      {/* <button type="submit" className="searchbar-button" aria-label="Buscar">
        <BsSearch className="search-icon" />
      </button> */}
    </form>
  );
}

export default HeaderSearchBar;
