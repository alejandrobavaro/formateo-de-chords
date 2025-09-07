// ======================================================
// COMPONENTE SELECTOR DE CANCIONES COMPLETO
// ======================================================
import React, { useState, useEffect, useRef } from "react";
import { BsSearch, BsMusicNoteList, BsPlayFill, BsX } from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongSelector.scss";

const SongSelector = ({ songs = [], selectedSong, onSelectSong, searchQuery, onSearchChange }) => {
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Filtrar canciones según búsqueda
  useEffect(() => {
    if (!Array.isArray(songs)) {
      setFilteredSongs([]);
      return;
    }
    
    const term = searchQuery.toLowerCase().trim();
    setFilteredSongs(term === "" ? songs : songs.filter(song => {
      const title = song.title || "";
      const artist = song.artist || "";
      return title.toLowerCase().includes(term) || artist.toLowerCase().includes(term);
    }));
  }, [songs, searchQuery]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejadores
  const handleSongSelect = (song) => {
    onSelectSong?.(song);
    setShowSuggestions(false);
    onSearchChange("");
  };

  const clearSearch = () => {
    onSearchChange("");
    setShowSuggestions(false);
  };

  return (
    <div className="song-selector-header" ref={searchRef}>
      
      {/* Búsqueda para header */}
      <div className="search-header">
        <div className="search-input-wrapper">
          <BsSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar canción por título o artista..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={clearSearch}>
              <BsX />
            </button>
          )}
        </div>
      </div>

      {/* Selector compacto de canciones */}
      <div className="select-compact">
        <BsMusicNoteList className="select-icon" />
        <select
          value={selectedSong?.id || ""}
          onChange={(e) => {
            const song = songs.find((s) => s.id === e.target.value);
            if (song) onSelectSong?.(song);
          }}
          className="song-select"
          disabled={songs.length === 0}
        >
          <option value="">{songs.length === 0 ? "Sin canciones" : "Seleccionar..."}</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.artist ? `${song.artist} - ${song.title}` : song.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sugerencias */}
      {showSuggestions && searchQuery && filteredSongs.length > 0 && (
        <div className="suggestions-header">
          {filteredSongs.slice(0, 5).map((song) => (
            <div
              key={song.id}
              className="suggestion-item"
              onClick={() => handleSongSelect(song)}
            >
              <span className="suggestion-title">{song.title}</span>
              {song.artist && <span className="suggestion-artist">{song.artist}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Canción actual */}
      {selectedSong && (
        <div className="current-song-header">
          <BsPlayFill className="current-icon" />
          <div className="current-info">
            <span className="current-title">{selectedSong.title}</span>
            {selectedSong.artist && <span className="current-artist">{selectedSong.artist}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongSelector;