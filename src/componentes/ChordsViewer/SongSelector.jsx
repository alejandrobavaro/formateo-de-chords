// ================================================================
// Selector de Canciones Mejorado para Galería Home Cancioneros
// ================================================================

import React, { useState, useEffect, useRef } from "react";
import { BsSearch, BsMusicNoteList, BsPlayFill, BsX, BsArrowRight } from "react-icons/bs";

const SongSelector = ({ 
  songs = [], 
  selectedSong, 
  onSelectSong, 
  searchQuery, 
  onSearchChange,
  placeholder = "Buscar canción por título o artista...",
  compact = false
}) => {
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // Filtrar canciones según búsqueda
  useEffect(() => {
    if (!Array.isArray(songs)) {
      setFilteredSongs([]);
      return;
    }
    
    const term = searchQuery.toLowerCase().trim();
    const filtered = term === "" ? [] : songs.filter(song => {
      const title = song.title || "";
      const artist = song.artist || "";
      const key = song.key || "";
      return (
        title.toLowerCase().includes(term) || 
        artist.toLowerCase().includes(term) ||
        key.toLowerCase().includes(term)
      );
    });
    
    setFilteredSongs(filtered);
  }, [songs, searchQuery]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejadores
  const handleSongSelect = (song) => {
    onSelectSong?.(song);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearchChange("");
  };

  const clearSearch = () => {
    onSearchChange("");
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  return (
    <div className={`song-selector-gallery ${compact ? 'compact' : ''}`} ref={searchRef}>
      
      {/* Búsqueda principal */}
      <div className="search-container-gallery">
        <div className="search-input-wrapper-gallery">
          <BsSearch className="search-icon-gallery" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={handleFocus}
            className="search-input-gallery"
          />
          {searchQuery && (
            <button className="clear-btn-gallery" onClick={clearSearch}>
              <BsX />
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        {searchQuery && (
          <div className="search-stats-gallery">
            <span className="results-count">
              {filteredSongs.length} resultado{filteredSongs.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Sugerencias en dropdown */}
      {showSuggestions && searchQuery && filteredSongs.length > 0 && (
        <div className="suggestions-dropdown-gallery">
          <div className="suggestions-header-gallery">
            <span>Resultados de búsqueda</span>
            <button 
              className="close-suggestions-btn"
              onClick={() => setShowSuggestions(false)}
            >
              <BsX />
            </button>
          </div>
          
          <div className="suggestions-list-gallery">
            {filteredSongs.slice(0, 8).map((song) => (
              <div
                key={song.id}
                className="suggestion-item-gallery"
                onClick={() => handleSongSelect(song)}
              >
                <div className="suggestion-info">
                  <span className="suggestion-title">{song.title}</span>
                  {song.artist && (
                    <span className="suggestion-artist">{song.artist}</span>
                  )}
                  {song.key && (
                    <span className="suggestion-key">{song.key}</span>
                  )}
                </div>
                <BsArrowRight className="suggestion-arrow" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selector de canciones alternativo */}
      {!compact && (
        <div className="song-picker-gallery">
          <div className="picker-header">
            <BsMusicNoteList className="picker-icon" />
            <span>Seleccionar canción</span>
          </div>
          
          <select
            value={selectedSong?.id || ""}
            onChange={(e) => {
              const song = songs.find((s) => s.id === e.target.value);
              if (song) onSelectSong?.(song);
            }}
            className="song-select-gallery"
            disabled={songs.length === 0}
          >
            <option value="">{songs.length === 0 ? "Sin canciones disponibles" : "Elige una canción..."}</option>
            {songs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.artist ? `${song.artist} - ${song.title}` : song.title}
                {song.key && ` (${song.key})`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Canción actual seleccionada */}
      {selectedSong && (
        <div className="current-song-gallery">
          <div className="current-song-header">
            <BsPlayFill className="current-icon" />
            <span>Reproduciendo:</span>
          </div>
          <div className="current-song-info">
            <span className="current-title">{selectedSong.title}</span>
            {selectedSong.artist && (
              <span className="current-artist">{selectedSong.artist}</span>
            )}
            {selectedSong.key && (
              <span className="current-key">{selectedSong.key}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongSelector;