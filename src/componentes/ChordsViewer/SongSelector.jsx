import React, { useState } from 'react';
import { useHeaderSearch } from './HeaderSearchContext';
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongSelector.scss";

/**
 * Componente selector de canciones con filtrado por búsqueda
 * @param {Array} songs - Lista de canciones disponibles
 * @param {Object} selectedSong - Canción actualmente seleccionada
 * @param {Function} onSelectSong - Función para seleccionar una canción
 */
const SongSelector = ({ songs = [], selectedSong, onSelectSong }) => {
  // Obtener query de búsqueda del contexto global
  const { searchQuery } = useHeaderSearch();
  
  // Validar que songs sea un array
  const safeSongs = Array.isArray(songs) ? songs : [];
  
  /**
   * Filtrar canciones basado en la búsqueda con manejo seguro de propiedades
   */
  const filteredSongs = safeSongs.filter(song => {
    // Validar que song sea un objeto y tenga propiedades
    if (!song || typeof song !== 'object') return false;
    
    const title = song.title || '';
    const artist = song.artist || '';
    const key = song.key || '';
    
    // Convertir a string y minúsculas para búsqueda case-insensitive
    const searchTerm = searchQuery.toLowerCase();
    
    return (
      title.toString().toLowerCase().includes(searchTerm) ||
      artist.toString().toLowerCase().includes(searchTerm) ||
      key.toString().toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="song-selector-container">
      <div className="selector-search-combo">
        
        {/* Selector dropdown de canciones */}
        <select
          value={selectedSong?.id || ''}
          onChange={(e) => {
            const songId = e.target.value;
            if (songId) {
              // ✅ CORRECCIÓN: Buscar por ID directamente sin convertir a número
              const song = safeSongs.find(s => s.id === songId);
              if (song && onSelectSong) {
                onSelectSong(song);
              }
            }
          }}
          className="song-select"
          disabled={filteredSongs.length === 0}
        >
          <option value="">
            {filteredSongs.length === 0 ? 'No hay canciones' : 'Seleccionar canción...'}
          </option>
          
          {filteredSongs.map(song => (
            <option key={song.id || song.title} value={song.id}>
              {/* Mostrar información de la canción con valores por defecto */}
              {song.artist || 'Artista desconocido'} - {song.title || 'Sin título'} 
              {song.key ? ` (${song.key})` : ''}
            </option>
          ))}
        </select>
        
      </div>
    </div>
  );
};

export default SongSelector;