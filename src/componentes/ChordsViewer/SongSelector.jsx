import React, { useState, useEffect } from "react";
import { useHeaderSearch } from "../Header";
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongSelector.scss";

const SongSelector = ({ songs = [], selectedSong, onSelectSong }) => {
  const headerSearch = useHeaderSearch() || { searchQuery: "", setSearchQuery: () => {} };
  const { searchQuery, setSearchQuery } = headerSearch;

  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    if (!Array.isArray(songs)) return setFilteredSongs([]);
    const term = searchQuery.toLowerCase();
    setFilteredSongs(
      songs.filter((song) => {
        const title = song.title || "";
        const artist = song.artist || "";
        return title.toLowerCase().includes(term) || artist.toLowerCase().includes(term);
      })
    );
  }, [songs, searchQuery]);

  return (
    <div className="song-selector-unificado">
      {/* Select de canciones */}
      <select
        value={selectedSong?.id || ""}
        onChange={(e) => {
          const song = songs.find((s) => s.id === e.target.value);
          if (song && onSelectSong) onSelectSong(song);
        }}
        className="selector-item"
        disabled={filteredSongs.length === 0}
      >
        <option value="">
          {filteredSongs.length === 0 ? "No hay canciones" : "Seleccionar canción..."}
        </option>
        {filteredSongs.map((song) => (
          <option key={song.id} value={song.id}>
            {song.artist || "Artista desconocido"} - {song.title || "Sin título"}
          </option>
        ))}
      </select>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar canción o artista..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input selector-item"
      />
    </div>
  );
};

export default SongSelector;