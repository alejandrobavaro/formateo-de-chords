import React, { useState } from 'react';
import { useHeaderSearch } from './HeaderSearchContext';
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongSelector.scss";

const SongSelector = ({ songs, selectedSong, onSelectSong }) => {
  const { searchQuery, setSearchQuery } = useHeaderSearch();
  
  // Filtrar canciones basado en la búsqueda
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="song-selector-container">
      <div className="selector-search-combo">
        <select
          value={selectedSong?.id || ''}
          onChange={(e) => {
            const song = songs.find(s => s.id === parseInt(e.target.value));
            if (song) onSelectSong(song);
          }}
          className="song-select"
        >
          <option value="">Seleccionar canción...</option>
          {filteredSongs.map(song => (
            <option key={song.id} value={song.id}>
              {song.artist} - {song.title} ({song.key})
            </option>
          ))}
        </select>
        
   
      </div>
    </div>
  );
};

export default SongSelector;