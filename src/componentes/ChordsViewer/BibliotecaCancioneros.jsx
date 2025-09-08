// ================================================================
// 📚 GALERÍA HOME CANCIONEROS - COMPONENTE PRINCIPAL
// ================================================================

// 🔗 IMPORTACIONES DE DEPENDENCIAS EXTERNAS
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BsSearch, 
  BsSortDown, 
  BsSortUp, 
  BsMusicNoteBeamed, 
  BsPlayFill,
  BsFilter,
  BsX,
  BsArrowRight,
  BsClock,
  BsMusicPlayer
} from "react-icons/bs";

// 🎨 IMPORTACIÓN DE ESTILOS LOCALES
import "../../assets/scss/_03-Componentes/ChordsViewer/_BibliotecaCancioneros.scss";

// 📁 LISTA DE ARCHIVOS JSON CON LAS CANCIONES - RUTAS ESTÁTICAS
const jsonFiles = [
  "/data/listadocancionesalegondramusic.json",
  "/data/listadocancionesalmangopop.json",
  "/data/listadocancionescasamiento.json",
  "/data/listadochordscoverslatinos1.json",
  "/data/listadochordscoversnacionales1.json",
  "/data/listadochordscoversseleccionados1.json",
  "/data/listadochordscoversseleccionados2.json",
  "/data/listadochordscoversseleccionados3.json"
];

// ================================================================
// 🎵 COMPONENTE SELECTOR DE CANCIONES MEJORADO
// ================================================================
const SongSelector = ({ 
  songs = [], 
  selectedSong, 
  onSelectSong, 
  searchQuery, 
  onSearchChange,
  placeholder = "Buscar canción por título o artista...",
  compact = false
}) => {
  // 🎯 ESTADOS PARA GESTIONAR LAS SUGERENCIAS Y EL FOCO
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // 🔍 EFECTO PARA FILTRAR CANCIONES SEGÚN EL TÉRMINO DE BÚSQUEDA
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

  // 🖱️ EFECTO PARA CERRAR SUGERENCIAS AL HACER CLIC FUERA DEL COMPONENTE
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

  // 🎵 FUNCIÓN PARA MANEJAR LA SELECCIÓN DE UNA CANCIÓN
  const handleSongSelect = (song) => {
    onSelectSong?.(song);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearchChange("");
  };

  // 🗑️ FUNCIÓN PARA LIMPIAR LA BÚSQUEDA
  const clearSearch = () => {
    onSearchChange("");
    setShowSuggestions(false);
  };

  // 👁️ FUNCIÓN PARA MANEJAR EL FOCO EN EL INPUT DE BÚSQUEDA
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  return (
    <div className={`song-selector-gallery ${compact ? 'compact' : ''}`} ref={searchRef}>
      
      {/* 🔍 CONTENEDOR DE BÚSQUEDA PRINCIPAL */}
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

        {/* 📊 CONTADOR DE RESULTADOS DE BÚSQUEDA */}
        {searchQuery && (
          <div className="search-stats-gallery">
            <span className="results-count">
              {filteredSongs.length} resultado{filteredSongs.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* 📋 DROPDOWN DE SUGERENCIAS DE BÚSQUEDA */}
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
    </div>
  );
};

// ================================================================
// 🏠 COMPONENTE PRINCIPAL DE LA GALERÍA
// ================================================================
const BibliotecaCancioneros = () => {
  // 📊 ESTADOS PARA GESTIONAR LOS DATOS Y LA INTERFAZ
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [songDetails, setSongDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🎛️ ESTADO PARA CONTROLAR LAS COLUMNAS VISIBLES EN LA TABLA
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    artist: true,
    genre: true,
    bpm: true,
    key: true,
    duration: true,
    list: true,
    actions: true
  });
  
  // 🧭 HOOK DE NAVEGACIÓN DE REACT ROUTER
  const navigate = useNavigate();

  // ================================================================
  // 📥 EFECTO PARA CARGAR LOS DATOS DE LOS ARCHIVOS JSON
  // ================================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // ⚡ Cargar todos los archivos JSON en paralelo
        const responses = await Promise.all(
          jsonFiles.map(file => 
            fetch(file)
              .then(res => {
                if (!res.ok) throw new Error(`Error cargando ${file}`);
                return res.json();
              })
              .catch(err => {
                console.warn(`No se pudo cargar ${file}:`, err);
                return null;
              })
          )
        );

        // 🎯 Filtrar respuestas válidas
        const validResponses = responses.filter(res => res !== null);
        
        // 🔄 Procesar los datos según la estructura de cada archivo
        const parsedGroups = validResponses.map((data, index) => {
          if (data.albums) {
            // 📀 Procesar archivos con estructura de álbumes
            return data.albums.map(album => ({
              groupName: album.album_name || "Sin título",
              artist: album.artist || null,
              songs: album.songs || [],
              id: `group-${index}-${album.album_name || ''}`,
              path: jsonFiles[index],
              type: 'album'
            }));
          } else if (data.songs) {
            // 🎵 Procesar archivos con estructura de colecciones
            return [{
              groupName: data.name || `Lista ${index + 1}`,
              songs: data.songs,
              id: `group-${index}`,
              path: jsonFiles[index],
              type: 'collection'
            }];
          }
          return [];
        });

        // 📦 Aplanar el array de grupos
        const flattenedGroups = parsedGroups.flat();
        setGroups(flattenedGroups);
        setFilteredGroups(flattenedGroups);
        
        // 📂 Expandir todos los grupos por defecto
        const allGroupIds = flattenedGroups.map(group => group.id);
        setSelectedGroups(new Set(allGroupIds));
      } catch (error) {
        console.error("Error cargando JSONs:", error);
        setError("Error al cargar las canciones. Intenta recargar la página.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ================================================================
  // 📝 EFECTO PARA CARGAR DETALLES ADICIONALES DE LAS CANCIONES
  // ================================================================
  useEffect(() => {
    const loadSongDetails = async () => {
      const details = {};
      const songsToLoad = [];
      
      // 📋 Recolectar canciones para cargar detalles
      groups.forEach(group => {
        if (selectedGroups.has(group.id) && group.songs) {
          group.songs.slice(0, 10).forEach(song => {
            if (song.file && !songDetails[song.id || song.title]) {
              songsToLoad.push({ song, group });
            }
          });
        }
      });

      // ⚡ Cargar detalles en paralelo
      const detailPromises = songsToLoad.map(async ({ song, group }) => {
        try {
          const basePath = getBasePath(group.path);
          const songPath = `${basePath}${song.file}`;
          const response = await fetch(songPath);
          if (response.ok) {
            const songData = await response.json();
            details[song.id || song.title] = songData;
          }
        } catch (err) {
          console.warn(`No se pudo cargar detalles de ${song.title}:`, err);
        }
      });

      await Promise.all(detailPromises);
      setSongDetails(prev => ({ ...prev, ...details }));
    };

    if (groups.length > 0) {
      loadSongDetails();
    }
  }, [groups, selectedGroups]);

  // ================================================================
  // 🗺️ FUNCIÓN PARA OBTENER LA RUTA BASE DESDE LA RUTA DEL LISTADO
  // ================================================================
  const getBasePath = (listPath) => {
    const filename = listPath.split('/').pop();
    const baseName = filename.replace('listado', '').replace('.json', '');
    return `/data/${baseName}/`;
  };

  // ================================================================
  // 🔍 EFECTO PARA APLICAR FILTROS Y BÚSQUEDA
  // ================================================================
  useEffect(() => {
    let result = [...groups];
    
    // 🔎 Aplicar filtro de búsqueda si hay término
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.map(group => ({
        ...group,
        songs: group.songs.filter(song => 
          (song.title && song.title.toLowerCase().includes(term)) ||
          (song.artist && song.artist.toLowerCase().includes(term)) ||
          (song.key && song.key.toLowerCase().includes(term)) ||
          (songDetails[song.id || song.title]?.originalKey?.toLowerCase().includes(term))
        )
      })).filter(group => group.songs.length > 0);
    }
    
    // 🔄 Aplicar ordenamiento si está configurado
    if (sortConfig.key) {
      result = result.map(group => ({
        ...group,
        songs: [...group.songs].sort((a, b) => {
          let aValue, bValue;
          
          if (sortConfig.key === 'bpm' || sortConfig.key === 'duration') {
            const aDetails = songDetails[a.id || a.title] || {};
            const bDetails = songDetails[b.id || b.title] || {};
            aValue = aDetails[sortConfig.key] || '';
            bValue = bDetails[sortConfig.key] || '';
          } else if (sortConfig.key === 'list') {
            // 📋 Ordenar por nombre de lista
            const aGroup = groups.find(g => g.songs?.includes(a))?.groupName || '';
            const bGroup = groups.find(g => g.songs?.includes(b))?.groupName || '';
            aValue = aGroup;
            bValue = bGroup;
          } else {
            aValue = a[sortConfig.key] || '';
            bValue = b[sortConfig.key] || '';
          }
          
          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        })
      }));
    }
    
    setFilteredGroups(result);
  }, [groups, searchTerm, sortConfig, songDetails]);

  // ================================================================
  // 🔄 FUNCIÓN PARA MANEJAR EL ORDENAMIENTO DE LA TABLA
  // ================================================================
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // ================================================================
  // 📂 FUNCIÓN PARA ALTERNAR LA EXPANSIÓN/COLAPSO DE GRUPOS
  // ================================================================
  const toggleGroup = (groupId) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // ================================================================
  // 🎵 FUNCIÓN PARA NAVEGAR AL VISOR DE ACORDES
  // ================================================================
  const openInChordsViewer = (song, group) => {
    const libraryId = getLibraryIdFromPath(group.path);
    navigate(`/chords-viewer?library=${libraryId}&song=${encodeURIComponent(song.file)}`);
  };

  // ================================================================
  // 🆔 FUNCIÓN PARA OBTENER ID DE BIBLIOTECA DESDE LA RUTA
  // ================================================================
  const getLibraryIdFromPath = (path) => {
    const filename = path.split('/').pop().replace('.json', '');
    const libraryMap = {
      'listadocancionesalegondramusic': 'alegondra',
      'listadocancionesalmangopop': 'almangopop',
      'listadocancionescasamiento': 'casamiento',
      'listadochordscoversseleccionados1': 'covers1',
      'listadochordscoversseleccionados2': 'covers2',
      'listadochordscoversseleccionados3': 'covers3',
      'listadochordscoverslatinos1': 'coverslatinos1',
      'listadochordscoversnacionales1': 'coversnacionales1'
    };
    
    return libraryMap[filename] || 'covers1';
  };

  // ================================================================
  // 🎲 FUNCIÓN PARA GENERAR DATOS DE EJEMPLO (BPM, GÉNERO, DURACIÓN)
  // ================================================================
  const getSongExtraData = (song) => {
    // 📊 Datos de ejemplo hasta que tengamos los datos reales
    const titleHash = song.title ? song.title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) : 0;
    
    const genres = ['Pop', 'Rock', 'Balada', 'Latino', 'Folklore', 'Cumbia', 'Reggaeton'];
    const genre = genres[Math.abs(titleHash) % genres.length];
    
    const bpm = 80 + (Math.abs(titleHash) % 60); // BPM entre 80 y 140
    const duration = `${Math.floor(Math.abs(titleHash) % 4)}:${Math.floor(Math.abs(titleHash) % 60).toString().padStart(2, '0')}`;
    
    return { genre, bpm, duration };
  };

  // ================================================================
  // ⏳ RENDERIZADO DE ESTADOS DE CARGA Y ERROR
  // ================================================================
  if (isLoading) {
    return (
      <div className="loading-state">
        <BsMusicNoteBeamed />
        <p>Cargando biblioteca musical...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  // ================================================================
  // 🎨 RENDERIZADO PRINCIPAL DEL COMPONENTE
  // ================================================================
  return (
    <main className="modern-chords-gallery dark-theme excel-style compact-view">
      
      {/* 🎯 HEADER CON CONTROLES Y ESTADÍSTICAS */}
      <div className="gallery-header">
        <div className="header-main">
          <div className="header-title">
            <BsMusicNoteBeamed className="header-icon" />
            <h1>Biblioteca de Canciones</h1>
            <span className="subtitle">Explora y organiza tu colección musical</span>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{groups.length}</span>
              <span className="stat-label">Listas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {groups.reduce((total, group) => total + (group.songs?.length || 0), 0)}
              </span>
              <span className="stat-label">Canciones</span>
            </div>
          </div>
        </div>

        {/* 🔍 SELECTOR DE BÚSQUEDA MEJORADO */}
        <div className="header-controls">
          <SongSelector
            songs={groups.flatMap(group => group.songs || [])}
            selectedSong={null}
            onSelectSong={(song) => {
              // 📍 Encontrar el grupo al que pertenece la canción
              const group = groups.find(g => g.songs?.includes(song));
              if (group) {
                // 📂 Expandir el grupo
                setSelectedGroups(prev => new Set([...prev, group.id]));
                // 🎵 Navegar a la canción
                openInChordsViewer(song, group);
              }
            }}
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar en toda la biblioteca..."
            compact={true}
          />
        </div>
      </div>

      {/* 📊 TABLA PRINCIPAL DE CANCIONES */}
      <div className="excel-table-container">
        <div className="table-wrapper">
          <table className="excel-table compact-table">
            <thead>
              <tr>
                <th className="col-expand"></th>
                {visibleColumns.artist && (
                  <th 
                    className="col-artist sortable"
                    onClick={() => requestSort('artist')}
                  >
                    <span>Artista</span>
                    {sortConfig.key === 'artist' && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                      </span>
                    )}
                  </th>
                )}
                {visibleColumns.title && (
                  <th 
                    className="col-title sortable"
                    onClick={() => requestSort('title')}
                  >
                    <span>Título</span>
                    {sortConfig.key === 'title' && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                      </span>
                    )}
                  </th>
                )}
                {visibleColumns.genre && (
                  <th 
                    className="col-genre sortable"
                    onClick={() => requestSort('genre')}
                  >
                    <span>Género</span>
                    {sortConfig.key === 'genre' && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                      </span>
                    )}
                  </th>
                )}
                {visibleColumns.bpm && (
                  <th 
                    className="col-bpm sortable"
                    onClick={() => requestSort('bpm')}
                  >
                    <span>BPM</span>
                    {sortConfig.key === 'bpm' && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                      </span>
                    )}
                  </th>
                )}
                {visibleColumns.key && (
                  <th 
                    className="col-key sortable"
                    onClick={() => requestSort('key')}
                  >
                    <span>Tono</span>
                    {sortConfig.key === 'key' && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                      </span>
                    )}
                  </th>
                )}
                {visibleColumns.duration && (
                  <th 
                    className="col-duration sortable"
                    onClick={() => requestSort('duration')}
                  >
                    <span>Duración</span>
                    {sortConfig.key === 'duration' && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                      </span>
                    )}
                  </th>
                )}
                {visibleColumns.list && (
                  <th 
                    className="col-list sortable"
                    onClick={() => requestSort('list')}
                  >
                    <span>Lista</span>
                    {sortConfig.key === 'list' && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                      </span>
                    )}
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="col-actions">
                    <span>Acciones</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* 🔄 RENDERIZADO DE GRUPOS Y CANCIONES */}
              {filteredGroups.map((group, gIndex) => (
                <React.Fragment key={group.id}>
                  
                  {/* 📁 FILA DE ENCABEZADO DE GRUPO */}
                  <tr 
                    className={`group-header ${selectedGroups.has(group.id) ? 'expanded' : ''}`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <td className="col-expand">
                      <span className="expand-icon">
                        {selectedGroups.has(group.id) ? '−' : '+'}
                      </span>
                    </td>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}>
                      <div className="group-header-content">
                        <span className="group-name">{group.groupName}</span>
                        <span className="group-meta">
                          {group.type === 'album' && group.artist && `• ${group.artist} •`}
                          <span className="song-count">{group.songs?.length || 0} canciones</span>
                        </span>
                      </div>
                    </td>
                  </tr>
                  
                  {/* 🎵 FILAS DE CANCIONES DENTRO DEL GRUPO */}
                  {selectedGroups.has(group.id) && group.songs.map((song, sIndex) => {
                    const extraData = getSongExtraData(song);
                    
                    return (
                      <tr key={`${gIndex}-${sIndex}`} className="song-row">
                        <td className="col-expand"></td>
                        
                        {visibleColumns.artist && (
                          <td className="col-artist">
                            <span className="artist-text">{song.artist || 'N/A'}</span>
                          </td>
                        )}
                        
                        {visibleColumns.title && (
                          <td className="col-title">
                            <div className="song-title-cell">
                              <span className="title-text">{song.title}</span>
                            </div>
                          </td>
                        )}
                        
                        {visibleColumns.genre && (
                          <td className="col-genre">
                            <span className="genre-badge">{extraData.genre}</span>
                          </td>
                        )}
                        
                        {visibleColumns.bpm && (
                          <td className="col-bpm">
                            <span className="bpm-text">{extraData.bpm}</span>
                          </td>
                        )}
                        
                        {visibleColumns.key && (
                          <td className="col-key">
                            <span className="key-badge">
                              {songDetails[song.id || song.title]?.originalKey || song.key || 'N/A'}
                            </span>
                          </td>
                        )}
                        
                        {visibleColumns.duration && (
                          <td className="col-duration">
                            <div className="duration-cell">
                              <BsClock className="duration-icon" />
                              <span className="duration-text">{extraData.duration}</span>
                            </div>
                          </td>
                        )}
                        
                        {visibleColumns.list && (
                          <td className="col-list">
                            <span className="list-text">{group.groupName}</span>
                          </td>
                        )}
                        
                        {visibleColumns.actions && (
                          <td className="col-actions">
                            <div className="action-buttons">
                              <button
                                className="play-icon-btn"
                                title="Reproducir (próximamente)"
                              >
                                <BsMusicPlayer />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInChordsViewer(song, group);
                                }}
                                className="chords-btn"
                                title="Abrir acordes"
                              >
                                <BsPlayFill />
                                <span>Chord</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 📝 MENSAJE CUANDO NO HAY RESULTADOS */}
        {filteredGroups.length === 0 && (
          <div className="no-results">
            <BsMusicNoteBeamed />
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
          </div>
        )}
      </div>

      {/* 📋 FOOTER DE LA TABLA CON INFORMACIÓN Y CONTROLES */}
      <div className="table-footer">
        <div className="footer-info">
          <span>Mostrando {filteredGroups.reduce((total, group) => total + (group.songs?.length || 0), 0)} canciones</span>
        </div>
        <div className="footer-actions">
          <button className="columns-toggle" onClick={() => setVisibleColumns(prev => ({
            ...prev,
            genre: !prev.genre,
            bpm: !prev.bpm,
            duration: !prev.duration
          }))}>
            <BsFilter />
            {visibleColumns.genre ? 'Ocultar columnas' : 'Mostrar columnas'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default BibliotecaCancioneros;