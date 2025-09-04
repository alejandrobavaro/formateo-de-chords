// ======================================================
// IMPORTACIONES
// ======================================================
import React, { useState, useEffect, useRef } from "react";
import { BsSearch, BsMusicNoteList, BsPlayFill } from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongSelector.scss";

// ======================================================
// COMPONENTE SELECTOR DE CANCIONES ULTRA COMPACTO
// ======================================================
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
    
    if (term === "") {
      setFilteredSongs(songs);
    } else {
      setFilteredSongs(
        songs.filter((song) => {
          const title = song.title || "";
          const artist = song.artist || "";
          return (
            title.toLowerCase().includes(term) || 
            artist.toLowerCase().includes(term)
          );
        })
      );
    }
  }, [songs, searchQuery]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Manejar selección de canción
  const handleSongSelect = (song) => {
    if (onSelectSong) {
      onSelectSong(song);
    }
    setShowSuggestions(false);
    onSearchChange("");
  };

  return (
    <div className="song-selector-excel" ref={searchRef}>
      
      {/* Contenedor principal compacto */}
      <div className="excel-search-container">
        
        {/* Barra de búsqueda ultra compacta con icono */}
        <div className="excel-search-input-container">
          <BsSearch className="excel-search-icon" size={10} />
          <input
            type="text"
            placeholder="Buscar canción..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="excel-search-input"
          />
          
          {/* Contador de resultados */}
          {searchQuery && (
            <span className="excel-results-count">
              {filteredSongs.length}
            </span>
          )}
        </div>

        {/* Selector dropdown compacto con icono */}
        <div className="excel-select-container">
          <BsMusicNoteList className="excel-select-icon" size={10} />
          <select
            value={selectedSong?.id || ""}
            onChange={(e) => {
              const song = songs.find((s) => s.id === e.target.value);
              if (song && onSelectSong) onSelectSong(song);
            }}
            className="excel-song-select"
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
      </div>

      {/* Sugerencias compactas */}
      {showSuggestions && searchQuery && filteredSongs.length > 0 && (
        <div className="excel-suggestions">
          {filteredSongs.slice(0, 5).map((song) => (
            <div
              key={song.id}
              className="excel-suggestion-item"
              onClick={() => handleSongSelect(song)}
            >
              <div className="excel-suggestion-content">
                <span className="excel-suggestion-title">{song.title}</span>
                {song.artist && (
                  <span className="excel-suggestion-artist">{song.artist}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Indicador de canción actual ultra compacto */}
      {selectedSong && (
        <div className="excel-current-song">
          <BsPlayFill className="excel-current-icon" size={10} />
          <div className="excel-current-content">
            <span className="excel-current-title">{selectedSong.title}</span>
            {selectedSong.artist && (
              <span className="excel-current-artist">{selectedSong.artist}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongSelector;