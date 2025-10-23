// src/componentes/ChordsViewer/ListNavigator.jsx - VERSIÓN CORREGIDA
import React, { useState } from 'react';
import { 
  BsChevronLeft, 
  BsChevronRight, 
  BsMusicNoteList,
  BsCollection,
  BsArrowLeftRight,
  BsFilter,
  BsArrowDown,
  BsArrowUp
} from "react-icons/bs";
import { useSearch } from '../SearchContext';
// IMPORTACIÓN CORREGIDA - verifica que la ruta sea correcta
import "../../assets/scss/_03-Componentes/ChordsViewer/_ListNavigator.scss";

const ListNavigator = ({ currentSong, onSongChange }) => {
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    getSongsByLibrary, 
    getAlbumsByLibrary, 
    getSongsByAlbum,
    getAdjacentSongs 
  } = useSearch();

  // OBTENER DATOS DE LA BIBLIOTECA ACTUAL
  const librarySongs = currentSong ? getSongsByLibrary(currentSong.libraryId) : [];
  const albums = currentSong ? getAlbumsByLibrary(currentSong.libraryId) : [];
  const { previous, next } = currentSong ? getAdjacentSongs(currentSong) : { previous: null, next: null };

  // FILTRAR CANCIONES POR ÁLBUM SELECCIONADO
  const filteredSongs = selectedAlbum 
    ? getSongsByAlbum(currentSong.libraryId, selectedAlbum)
    : librarySongs;

  // NAVEGAR A CANCIÓN ANTERIOR/SIGUIENTE
  const navigateToSong = (song) => {
    if (song && onSongChange) {
      onSongChange(song);
    }
  };

  // MANEJAR CAMBIO DE CANCIÓN DESDE EL SELECT
  const handleSongSelect = (event) => {
    const songFile = event.target.value;
    if (songFile) {
      const selectedSong = filteredSongs.find(song => song.file === songFile);
      if (selectedSong) {
        navigateToSong(selectedSong);
        setIsExpanded(false); // Cerrar el dropdown después de seleccionar
      }
    }
  };

  // OBTENER NÚMERO DE CANCIÓN ACTUAL EN LA LISTA
  const getCurrentSongNumber = () => {
    if (!currentSong) return 0;
    return librarySongs.findIndex(song => song.file === currentSong.file) + 1;
  };

  // OBTENER TEXTO PARA LA OPCIÓN DEL SELECT
  const getSongOptionText = (song, index) => {
    const trackNumber = song.trackNumber || index + 1;
    const albumInfo = song.albumName && !selectedAlbum ? ` - ${song.albumName}` : '';
    const keyInfo = song.key ? ` (${song.key})` : '';
    return `#${trackNumber} - ${song.title}${albumInfo}${keyInfo}`;
  };

  const currentSongNumber = getCurrentSongNumber();
  const totalSongs = filteredSongs.length;

  return (
    <div className="list-navigator improved-design">
      
      {/* CONTENEDOR PRINCIPAL COMPACTO */}
      <div className="nav-compact-view">
        
        {/* INFORMACIÓN DE LA LISTA */}
        <div className="list-info-compact">
          <BsCollection className="list-icon" />
          <div className="list-details-compact">
            <span className="list-name">{currentSong?.libraryName || 'Lista'}</span>
            <span className="song-counter-compact">
              {currentSongNumber} de {librarySongs.length}
            </span>
          </div>
        </div>

        {/* CONTROLES DE FLECHA */}
        <div className="arrow-controls-compact">
          <button
            className={`nav-arrow prev-arrow ${!previous ? 'disabled' : ''}`}
            onClick={() => navigateToSong(previous)}
            disabled={!previous}
            title="Canción anterior"
          >
            <BsChevronLeft />
          </button>
          
          <button
            className={`nav-arrow next-arrow ${!next ? 'disabled' : ''}`}
            onClick={() => navigateToSong(next)}
            disabled={!next}
            title="Siguiente canción"
          >
            <BsChevronRight />
          </button>
        </div>

        {/* SELECTOR DE CANCIÓN */}
        <div className="song-selector-compact">
          <div 
            className="selector-header" 
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyPress={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
            aria-label="Seleccionar canción de la lista"
          >
            <BsMusicNoteList className="selector-icon" />
            <span className="selector-label">Seleccionar canción</span>
            {isExpanded ? <BsArrowUp className="expand-icon" /> : <BsArrowDown className="expand-icon" />}
          </div>
          
          {isExpanded && (
            <div className="selector-dropdown">
              
              {/* FILTRO POR ÁLBUM (SI HAY MÚLTIPLES ÁLBUMES) */}
              {albums.length > 1 && (
                <div className="album-filter-compact">
                  <div className="filter-header-compact">
                    <BsFilter />
                    <span>Filtrar por álbum:</span>
                  </div>
                  <select
                    value={selectedAlbum}
                    onChange={(e) => setSelectedAlbum(e.target.value)}
                    className="album-select-compact"
                  >
                    <option value="">Todos los álbumes ({librarySongs.length})</option>
                    {albums.map(album => (
                      <option key={album.album_id} value={album.album_id}>
                        {album.album_name} ({album.year || 'Sin año'}) - {album.songs?.length || 0}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SELECT PRINCIPAL DE CANCIONES */}
              <div className="main-song-selector">
                <select
                  value={currentSong?.file || ''}
                  onChange={handleSongSelect}
                  className="song-select"
                  size={Math.min(8, filteredSongs.length)}
                  aria-label="Lista de canciones"
                >
                  {filteredSongs.map((song, index) => (
                    <option 
                      key={song.id || `${song.file}-${index}`} 
                      value={song.file}
                      className={currentSong?.file === song.file ? 'selected' : ''}
                    >
                      {getSongOptionText(song, index)}
                    </option>
                  ))}
                </select>
              </div>

              {/* INFORMACIÓN ADICIONAL */}
              <div className="selector-info">
                <div className="songs-count-badge">
                  {filteredSongs.length} canción{filteredSongs.length !== 1 ? 'es' : ''}
                </div>
                <div className="navigation-help">
                  <BsArrowLeftRight />
                  <span>Usa las flechas para navegar</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListNavigator;