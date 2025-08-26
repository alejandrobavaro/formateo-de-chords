import React from 'react';
import { useHeaderSearch } from './HeaderSearchContext';
import "../../assets/scss/_03-Componentes/_ChordsSearchBar.scss";

const ChordsSearchBar = () => {
  const { searchQuery, setSearchQuery } = useHeaderSearch();

  return (
    <div className="chords-search-bar">
      <input
        type="text"
        placeholder="Buscar canciones o artistas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default ChordsSearchBar;