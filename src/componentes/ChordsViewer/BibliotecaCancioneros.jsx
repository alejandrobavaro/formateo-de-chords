// ================================================================
// 📚 GALERÍA HOME CANCIONEROS - COMPONENTE CORREGIDO
// ================================================================

// 🔗 IMPORTACIONES DE DEPENDENCIAS EXTERNAS
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BsSearch, 
  BsSortDown, 
  BsSortUp, 
  BsMusicNoteBeamed, 
  BsPlayFill,
  BsPauseFill,
  BsFilter,
  BsX,
  BsArrowRight,
  BsClock,
  BsMusicPlayer,
  BsFilterLeft,
  BsFilterRight,
  BsArrowDownUp,
  BsAlphabet,
  BsHash,
  BsChevronDown,
  BsChevronRight,
  BsCollection,
  BsStars,
  BsLightning,
  BsEye,
  BsEyeSlash
} from "react-icons/bs";

// 🎨 IMPORTACIÓN DE ESTILOS LOCALES
import "../../assets/scss/_03-Componentes/ChordsViewer/_BibliotecaCancioneros.scss";

// ================================================================
// 📁 LISTA DE ARCHIVOS JSON CON LAS CANCIONES - RUTAS ACTUALIZADAS
// ================================================================
const jsonFiles = [
  // MÚSICA ORIGINAL
  "/listado-chords-alegondramusic.json",
  "/listado-chords-almango-pop.json",
  
  // SHOWS ESPECÍFICOS
  "/listado-chords-casamiento-ale-fabi.json",
  
  // COVERS ORGANIZADOS POR GÉNERO
  "/data/02-chords-covers/listadocancionescovers-baladasespanol.json",
  "/data/02-chords-covers/listadocancionescovers-baladasingles.json",
  "/data/02-chords-covers/listadocancionescovers-poprockespanol.json",
  "/data/02-chords-covers/listadocancionescovers-poprockingles.json",
  "/data/02-chords-covers/listadocancionescovers-latinobailableespanol.json",
  "/data/02-chords-covers/listadocancionescovers-rockbailableespanol.json",
  "/data/02-chords-covers/listadocancionescovers-rockbailableingles.json",
  "/data/02-chords-covers/listadocancionescovers-hardrock-punkespanol.json",
  "/data/02-chords-covers/listadocancionescovers-hardrock-punkingles.json",
  "/data/02-chords-covers/listadocancionescovers-discoingles.json",
  "/data/02-chords-covers/listadocancionescovers-reggaeingles.json",
  "/data/02-chords-covers/listadocancionescovers-festivos-bso.json"
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
  placeholder = "Buscar canción...",
  compact = false
}) => {
  // ESTADOS DEL COMPONENTE SELECTOR
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // EFECTO PARA FILTRAR CANCIONES SEGÚN LA BÚSQUEDA
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

  // EFECTO PARA MANEJAR CLIC FUERA DEL SELECTOR
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

  // FUNCIÓN PARA SELECCIONAR UNA CANCIÓN
  const handleSongSelect = (song) => {
    onSelectSong?.(song);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearchChange("");
  };

  // FUNCIÓN PARA LIMPIAR LA BÚSQUEDA
  const clearSearch = () => {
    onSearchChange("");
    setShowSuggestions(false);
  };

  // FUNCIÓN PARA MANEJAR EL FOCO DEL INPUT
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  return (
    <div className={`song-selector-gallery ${compact ? 'compact' : ''}`} ref={searchRef}>
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

        {searchQuery && (
          <div className="search-stats-gallery">
            <span className="results-count">
              {filteredSongs.length} resultado{filteredSongs.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

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
// 🎛️ COMPONENTE DE FILTROS Y ORDENAMIENTO
// ================================================================
const FilterControls = ({ 
  sortConfig, 
  onSortChange, 
  activeFilters, 
  onFilterChange,
  availableLists,
  visibleColumns,
  onToggleColumn,
  onExpandAll,
  onCollapseAll
}) => {
  // ALFABETO PARA FILTRO POR LETRA
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // OPCIONES DE ORDENAMIENTO
  const sortOptions = [
    { key: 'artist', label: 'Artista', icon: <BsAlphabet /> },
    { key: 'title', label: 'Título', icon: <BsAlphabet /> },
    { key: 'genre', label: 'Género', icon: <BsFilter /> },
    { key: 'bpm', label: 'BPM', icon: <BsHash /> },
    { key: 'key', label: 'Tono', icon: <BsMusicNoteBeamed /> },
    { key: 'duration', label: 'Duración', icon: <BsClock /> },
    { key: 'list', label: 'Lista', icon: <BsMusicPlayer /> }
  ];

  // OPCIONES DE COLUMNAS VISIBLES
  const columnOptions = [
    { key: 'artist', label: 'Artista', icon: <BsMusicPlayer /> },
    { key: 'title', label: 'Título', icon: <BsAlphabet /> },
    { key: 'genre', label: 'Género', icon: <BsFilter /> },
    { key: 'bpm', label: 'BPM', icon: <BsHash /> },
    { key: 'key', label: 'Tono', icon: <BsMusicNoteBeamed /> },
    { key: 'duration', label: 'Duración', icon: <BsClock /> },
    { key: 'list', label: 'Lista', icon: <BsCollection /> }
  ];

  return (
    <div className="filter-controls-container">
      {/* SECCIÓN: ACCIONES RÁPIDAS */}
      <div className="filter-section">
        <div className="filter-section-header">
          <BsLightning />
          <span>Acciones rápidas:</span>
        </div>
        <div className="quick-actions">
          <button className="action-btn" onClick={onExpandAll}>
            <BsChevronDown />
            <span>Expandir todo</span>
          </button>
          <button className="action-btn" onClick={onCollapseAll}>
            <BsChevronRight />
            <span>Colapsar todo</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN: FILTRO POR LETRA */}
      <div className="filter-section">
        <div className="filter-section-header">
          <BsAlphabet />
          <span>Filtrar por letra:</span>
        </div>
        <div className="alphabet-filter">
          {alphabet.map(letter => (
            <button
              key={letter}
              className={`letter-filter-btn ${activeFilters.letter === letter ? 'active' : ''}`}
              onClick={() => onFilterChange('letter', activeFilters.letter === letter ? null : letter)}
            >
              {letter}
            </button>
          ))}
          <button
            className={`letter-filter-btn ${activeFilters.letter === '0-9' ? 'active' : ''}`}
            onClick={() => onFilterChange('letter', activeFilters.letter === '0-9' ? null : '0-9')}
          >
            0-9
          </button>
          <button
            className={`letter-filter-btn ${activeFilters.letter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('letter', 'all')}
          >
            Todas
          </button>
        </div>
      </div>

      {/* SECCIÓN: FILTRO POR LISTA */}
      <div className="filter-section">
        <div className="filter-section-header">
          <BsCollection />
          <span>Filtrar por lista:</span>
        </div>
        <div className="list-filter">
          <select
            value={activeFilters.list || ''}
            onChange={(e) => onFilterChange('list', e.target.value || null)}
            className="list-filter-select"
          >
            <option value="">Todas las listas</option>
            {availableLists.map(list => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECCIÓN: ORDENAMIENTO */}
      <div className="filter-section">
        <div className="filter-section-header">
          <BsArrowDownUp />
          <span>Ordenar por:</span>
        </div>
        <div className="sort-controls">
          {sortOptions.map(option => (
            <button
              key={option.key}
              className={`sort-btn ${sortConfig.key === option.key ? 'active' : ''}`}
              onClick={() => onSortChange(option.key)}
            >
              {option.icon}
              <span>{option.label}</span>
              {sortConfig.key === option.key && (
                <span className="sort-direction">
                  {sortConfig.direction === 'ascending' ? <BsSortUp /> : <BsSortDown />}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SECCIÓN: COLUMNAS VISIBLES */}
      <div className="filter-section">
        <div className="filter-section-header">
          <BsEye />
          <span>Columnas visibles:</span>
        </div>
        <div className="column-controls">
          {columnOptions.map(column => (
            <button
              key={column.key}
              className={`column-toggle-btn ${visibleColumns[column.key] ? 'active' : ''}`}
              onClick={() => onToggleColumn(column.key)}
            >
              {visibleColumns[column.key] ? <BsEye /> : <BsEyeSlash />}
              <span>{column.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BOTÓN: CAMBIAR DIRECCIÓN DE ORDENAMIENTO */}
      {sortConfig.key && (
        <div className="filter-section">
          <button
            className="direction-toggle-btn"
            onClick={() => onSortChange(sortConfig.key, sortConfig.direction === 'ascending' ? 'descending' : 'ascending')}
          >
            {sortConfig.direction === 'ascending' ? <BsSortDown /> : <BsSortUp />}
            <span>{sortConfig.direction === 'ascending' ? 'Descendente' : 'Ascendente'}</span>
          </button>
        </div>
      )}

      {/* BOTÓN: LIMPIAR FILTROS */}
      {(activeFilters.letter || activeFilters.list) && (
        <div className="filter-section">
          <button
            className="clear-filters-btn"
            onClick={() => {
              onFilterChange('letter', null);
              onFilterChange('list', null);
            }}
          >
            <BsX />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ================================================================
// 🎵 COMPONENTE REPRODUCTOR DE AUDIO SIMPLIFICADO CON FADE
// ================================================================
const AudioPlayer = ({ 
  mp3File, 
  songId,
  currentlyPlaying,
  onPlay,
  onPause
}) => {
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const isPlaying = currentlyPlaying === songId;

  // FUNCIÓN PARA APLICAR FADE OUT
  const fadeOut = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const fadeDuration = 1000; // 1 segundo de fade
    const steps = 10;
    const stepTime = fadeDuration / steps;
    const stepDecrease = audio.volume / steps;
    
    clearInterval(fadeIntervalRef.current);
    
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > stepDecrease) {
        audio.volume -= stepDecrease;
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeIntervalRef.current);
        onPause?.();
      }
    }, stepTime);
  }, [onPause]);

  // FUNCIÓN PARA APLICAR FADE IN
  const fadeIn = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const fadeDuration = 1000; // 1 segundo de fade
    const steps = 10;
    const stepTime = fadeDuration / steps;
    const stepIncrease = 1 / steps;
    
    audio.volume = 0;
    
    clearInterval(fadeIntervalRef.current);
    
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < 0.9) {
        audio.volume += stepIncrease;
      } else {
        audio.volume = 1;
        clearInterval(fadeIntervalRef.current);
      }
    }, stepTime);
  }, []);

  // FUNCIÓN PARA REPRODUCIR O PAUSAR EL AUDIO
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Aplicar fade out y pausar
      fadeOut();
    } else {
      // Notificar que se va a reproducir esta canción (para pausar otras)
      onPlay?.(songId);
      
      // Aplicar fade in y reproducir
      audioRef.current.play().catch(err => {
        console.error("Error reproduciendo audio:", err);
        onPause?.();
      });
      
      // Iniciar fade in después de un pequeño delay
      setTimeout(() => {
        fadeIn();
      }, 100);
    }
  }, [isPlaying, songId, onPlay, onPause, fadeOut, fadeIn]);

  // EFECTO PARA SINCRONIZAR EL ESTADO DE REPRODUCCIÓN
  useEffect(() => {
    if (!audioRef.current) return;

    // Si esta canción debería estar reproduciéndose pero no lo está
    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    } 
    // Si esta canción NO debería estar reproduciéndose pero sí lo está
    else if (!isPlaying && !audioRef.current.paused) {
      fadeOut();
    }
  }, [isPlaying, fadeOut]);

  // EFECTO DE LIMPIEZA
  useEffect(() => {
    return () => {
      clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // MANEJADORES DE EVENTOS DEL AUDIO
  const handleEnded = () => {
    onPause?.();
  };

  const handleError = (e) => {
    console.error("Error de audio:", e);
    onPause?.();
  };

  // SI NO HAY ARCHIVO DE AUDIO, MOSTRAR BOTÓN DESHABILITADO
  if (!mp3File) {
    return (
      <button className="play-icon-btn disabled" disabled title="Audio no disponible">
        <BsMusicPlayer />
      </button>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={mp3File}
        onEnded={handleEnded}
        onError={handleError}
        preload="none"
      />
      <button 
        className={`play-icon-btn ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlay}
        title={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
      </button>
    </>
  );
};

// ================================================================
// 🏠 COMPONENTE PRINCIPAL DE LA GALERÍA MEJORADO
// ================================================================
const BibliotecaCancioneros = () => {
  // ESTADOS PRINCIPALES DEL COMPONENTE
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [songDetails, setSongDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    letter: null,
    list: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // ESTADO PARA COLUMNAS VISIBLES
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
  
  // HOOK DE NAVEGACIÓN DE REACT ROUTER
  const navigate = useNavigate();

  // ================================================================
  // FUNCIONES HELPER MEJORADAS
  // ================================================================

  // FUNCIÓN PARA OBTENER LA RUTA BASE SEGÚN EL ARCHIVO
  const getBasePath = (listPath) => {
    const filename = listPath.split('/').pop();
    
    if (listPath.includes('listado-chords-alegondramusic.json')) {
      return '/data/01-chords-musica-original/chords-alegondramusic/';
    } else if (listPath.includes('listado-chords-almango-pop.json')) {
      return '/data/01-chords-musica-original/chords-almangopop/';
    } else if (listPath.includes('listado-chords-casamiento-ale-fabi.json')) {
      return '/data/03-chords-de-shows-por-listados/chords-show-casamiento-ale-fabi/';
    } else if (listPath.includes('02-chords-covers')) {
      const baseName = filename.replace('listadocancionescovers-', '').replace('.json', '');
      return `/data/02-chords-covers/cancionescovers-${baseName}/`;
    }
    
    return '/data/';
  };

  // FUNCIÓN PARA OBTENER EL ID DE LA BIBLIOTECA DESDE LA RUTA
  const getLibraryIdFromPath = (path) => {
    const filename = path.split('/').pop().replace('.json', '');
    const libraryMap = {
      'listado-chords-alegondramusic': 'alegondra',
      'listado-chords-almango-pop': 'almangopop',
      'listado-chords-casamiento-ale-fabi': 'casamiento',
      'listadocancionescovers-baladasespanol': 'covers-baladasespanol',
      'listadocancionescovers-baladasingles': 'covers-baladasingles',
      'listadocancionescovers-poprockespanol': 'covers-poprockespanol',
      'listadocancionescovers-poprockingles': 'covers-poprockingles',
      'listadocancionescovers-latinobailableespanol': 'covers-latinobailableespanol',
      'listadocancionescovers-rockbailableespanol': 'covers-rockbailableespanol',
      'listadocancionescovers-rockbailableingles': 'covers-rockbailableingles',
      'listadocancionescovers-hardrock-punkespanol': 'covers-hardrock-punkespanol',
      'listadocancionescovers-hardrock-punkingles': 'covers-hardrock-punkingles',
      'listadocancionescovers-discoingles': 'covers-discoingles',
      'listadocancionescovers-reggaeingles': 'covers-reggaeingles',
      'listadocancionescovers-festivos-bso': 'covers-festivos-bso'
    };
    
    return libraryMap[filename] || filename;
  };

  // FUNCIÓN PARA OBTENER EL NOMBRE DE LA BIBLIOTECA DESDE LA RUTA
  const getLibraryNameFromPath = (path) => {
    const filename = path.split('/').pop().replace('.json', '');
    const nameMap = {
      'listado-chords-alegondramusic': 'Ale Gondra',
      'listado-chords-almango-pop': 'Almango Pop',
      'listado-chords-casamiento-ale-fabi': 'Show Casamiento',
      'listadocancionescovers-baladasespanol': 'Baladas Español',
      'listadocancionescovers-baladasingles': 'Baladas Inglés',
      'listadocancionescovers-poprockespanol': 'Pop Rock Español',
      'listadocancionescovers-poprockingles': 'Pop Rock Inglés',
      'listadocancionescovers-latinobailableespanol': 'Latino Bailable',
      'listadocancionescovers-rockbailableespanol': 'Rock Bailable Español',
      'listadocancionescovers-rockbailableingles': 'Rock Bailable Inglés',
      'listadocancionescovers-hardrock-punkespanol': 'Hard Rock/Punk Español',
      'listadocancionescovers-hardrock-punkingles': 'Hard Rock/Punk Inglés',
      'listadocancionescovers-discoingles': 'Disco Inglés',
      'listadocancionescovers-reggaeingles': 'Reggae Inglés',
      'listadocancionescovers-festivos-bso': 'Festivos & BSO'
    };
    
    return nameMap[filename] || filename.replace('listadocanciones', '').replace('covers-', '').replace(/-/g, ' ');
  };

  // ================================================================
  // FUNCIONES DE MANEJO DE ESTADO
  // ================================================================

  // FUNCIÓN PARA CAMBIAR FILTROS
  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // FUNCIÓN PARA CAMBIAR ORDENAMIENTO
  const handleSortChange = (key, direction = 'ascending') => {
    if (sortConfig.key === key && !direction) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    setSortConfig({ key, direction });
  };

  // FUNCIÓN PARA ALTERNAR VISIBILIDAD DE COLUMNAS
  const handleToggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // FUNCIÓN PARA EXPANDIR TODOS LOS GRUPOS
  const expandAllGroups = () => {
    const allGroupIds = groups.map(group => group.id);
    setSelectedGroups(new Set(allGroupIds));
  };

  // FUNCIÓN PARA COLAPSAR TODOS LOS GRUPOS
  const collapseAllGroups = () => {
    setSelectedGroups(new Set());
  };

  // ================================================================
  // FUNCIONES DE CONTROL DE AUDIO MEJORADAS
  // ================================================================

  // FUNCIÓN PARA REPRODUCIR UNA CANCIÓN (PAUSA LAS DEMÁS AUTOMÁTICAMENTE)
  const handlePlay = (songId) => {
    setCurrentlyPlaying(songId);
  };

  // FUNCIÓN PARA PAUSAR LA CANCIÓN ACTUAL
  const handlePause = () => {
    setCurrentlyPlaying(null);
  };

  // ================================================================
  // EFECTO PARA CARGAR LOS DATOS DE LOS ARCHIVOS JSON - MEJORADO
  // ================================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 Iniciando carga de archivos JSON...");
        
        // PRIMERO VERIFICAMOS QUÉ ARCHIVOS EXISTEN REALMENTE
        const fileChecks = await Promise.allSettled(
          jsonFiles.map(async (file) => {
            try {
              const response = await fetch(file, { method: 'HEAD' });
              return {
                file,
                exists: response.ok,
                status: response.status
              };
            } catch (err) {
              return {
                file,
                exists: false,
                error: err.message
              };
            }
          })
        );

        console.log("📋 Verificación de archivos:", fileChecks);

        const existingFiles = fileChecks
          .filter(result => result.status === 'fulfilled' && result.value.exists)
          .map(result => result.value.file);

        console.log("✅ Archivos existentes:", existingFiles);

        // AHORA CARGAMOS SOLO LOS ARCHIVOS QUE EXISTEN
        const responses = await Promise.allSettled(
          existingFiles.map(file => 
            fetch(file)
              .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status} - ${file}`);
                
                // VERIFICAMOS SI EL CONTENIDO ES VÁLIDO
                const text = await res.text();
                if (!text.trim()) {
                  throw new Error(`Archivo vacío - ${file}`);
                }
                
                try {
                  const data = JSON.parse(text);
                  return { file, data, success: true };
                } catch (parseError) {
                  throw new Error(`JSON inválido en ${file}: ${parseError.message}`);
                }
              })
              .catch(err => {
                console.warn(`❌ No se pudo cargar ${file}:`, err.message);
                return { file, error: err.message, success: false };
              })
          )
        );

        console.log("📦 Respuestas de carga:", responses);

        const validGroups = [];
        
        responses.forEach((response) => {
          if (response.status === 'fulfilled' && response.value.success) {
            const { file, data } = response.value;
            console.log(`🎵 Procesando archivo: ${file}`, data);
            
            if (data.albums && Array.isArray(data.albums)) {
              // ESTRUCTURA CON ÁLBUMES
              data.albums.forEach(album => {
                if (album.songs && Array.isArray(album.songs)) {
                  validGroups.push({
                    groupName: album.album_name || "Sin título",
                    artist: album.artist || null,
                    songs: album.songs,
                    id: `album-${file}-${album.album_name || 'sin-titulo'}`,
                    path: file,
                    type: 'album',
                    libraryId: getLibraryIdFromPath(file),
                    libraryName: getLibraryNameFromPath(file),
                    totalSongs: album.songs.length
                  });
                }
              });
            } else if (data.songs && Array.isArray(data.songs)) {
              // ESTRUCTURA DIRECTA CON CANCIONES
              validGroups.push({
                groupName: data.name || getLibraryNameFromPath(file),
                artist: data.artist || null,
                songs: data.songs,
                id: `collection-${file}`,
                path: file,
                type: 'collection',
                libraryId: getLibraryIdFromPath(file),
                libraryName: getLibraryNameFromPath(file),
                totalSongs: data.songs.length
              });
            } else {
              console.warn(`⚠️ Formato no reconocido en ${file}:`, data);
            }
          } else {
            const file = response.status === 'fulfilled' ? response.value.file : 'unknown';
            console.warn(`🚫 Archivo fallido: ${file}`, response.reason || response.value);
          }
        });

        console.log("🎯 Grupos procesados:", validGroups);
        setGroups(validGroups);
        setFilteredGroups(validGroups);
        
        setSelectedGroups(new Set());
      } catch (error) {
        console.error("💥 Error cargando JSONs:", error);
        setError("Error al cargar las canciones. Intenta recargar la página.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ================================================================
  // EFECTO PARA APLICAR FILTROS, BÚSQUEDA Y ORDENAMIENTO
  // ================================================================
  useEffect(() => {
    let result = [...groups];
    
    // FILTRAR POR TÉRMINO DE BÚSQUEDA
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
    
    // FILTRAR POR LETRA
    if (activeFilters.letter && activeFilters.letter !== 'all') {
      result = result.map(group => ({
        ...group,
        songs: group.songs.filter(song => {
          if (activeFilters.letter === '0-9') {
            return /^\d/.test(song.title || '');
          }
          return (song.title || '').toUpperCase().startsWith(activeFilters.letter);
        })
      })).filter(group => group.songs.length > 0);
    }
    
    // FILTRAR POR LISTA
    if (activeFilters.list) {
      result = result.filter(group => group.libraryId === activeFilters.list);
    }
    
    // APLICAR ORDENAMIENTO
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
            const aGroup = groups.find(g => g.songs?.includes(a))?.groupName || '';
            const bGroup = groups.find(g => g.songs?.includes(b))?.groupName || '';
            aValue = aGroup;
            bValue = bGroup;
          } else {
            aValue = a[sortConfig.key] || '';
            bValue = b[sortConfig.key] || '';
          }
          
          if (aValue === '' && bValue !== '') return sortConfig.direction === 'ascending' ? 1 : -1;
          if (aValue !== '' && bValue === '') return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue === '' && bValue === '') return 0;
          
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
  }, [groups, searchTerm, sortConfig, songDetails, activeFilters]);

  // FUNCIÓN PARA ALTERNAR EXPANSIÓN DE GRUPOS
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

  // FUNCIÓN PARA ABRIR CANCIÓN EN EL VISOR DE ACORDES
  const openInChordsViewer = (song, group) => {
    console.log("🎵 Abriendo canción:", song.title);
    console.log("📁 Grupo:", group.libraryName);
    console.log("📄 Archivo:", song.file);
    
    const libraryId = getLibraryIdFromPath(group.path);
    const encodedSongFile = encodeURIComponent(song.file);
    
    console.log("🔗 Navegando a:", `/chords-viewer?library=${libraryId}&song=${encodedSongFile}`);
    
    navigate(`/chords-viewer?library=${libraryId}&song=${encodedSongFile}`);
  };

  // FUNCIÓN PARA OBTENER DATOS REALES DE LA CANCIÓN (NO GENERADOS)
  const getSongExtraData = (song) => {
    // USAR LOS DATOS REALES DEL JSON EN LUGAR DE GENERAR ALEATORIOS
    return {
      genre: song.genre || 'No especificado',
      bpm: song.bpm || 'N/A',
      duration: song.duration || '0:00',
      key: song.key || 'N/A',
      style: song.style || 'No especificado'
    };
  };

  // ================================================================
  // LISTAS DISPONIBLES PARA FILTRO
  // ================================================================
  const availableLists = [
    { id: 'alegondra', name: 'Ale Gondra' },
    { id: 'almangopop', name: 'Almango Pop' },
    { id: 'casamiento', name: 'Show Casamiento' },
    { id: 'covers-baladasespanol', name: 'Baladas Español' },
    { id: 'covers-baladasingles', name: 'Baladas Inglés' },
    { id: 'covers-poprockespanol', name: 'Pop Rock Español' },
    { id: 'covers-poprockingles', name: 'Pop Rock Inglés' },
    { id: 'covers-latinobailableespanol', name: 'Latino Bailable' },
    { id: 'covers-rockbailableespanol', name: 'Rock Bailable Español' },
    { id: 'covers-rockbailableingles', name: 'Rock Bailable Inglés' },
    { id: 'covers-hardrock-punkespanol', name: 'Hard Rock/Punk Español' },
    { id: 'covers-hardrock-punkingles', name: 'Hard Rock/Punk Inglés' },
    { id: 'covers-discoingles', name: 'Disco Inglés' },
    { id: 'covers-reggaeingles', name: 'Reggae Inglés' },
    { id: 'covers-festivos-bso', name: 'Festivos & BSO' }
  ];

  // ================================================================
  // RENDERIZADO DE ESTADOS DE CARGA Y ERROR
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
  // RENDERIZADO PRINCIPAL DEL COMPONENTE
  // ================================================================
  return (
    <main className="modern-chords-gallery dark-theme excel-style compact-view">
      {/* HEADER PRINCIPAL DE LA GALERÍA */}
      <div className="gallery-header">
        <div className="header-main">
          <div className="header-title">
            <BsMusicNoteBeamed className="header-icon" />
            <h1>Biblioteca de Canciones</h1>
            <span className="subtitle">Explora y organiza tu colección musical</span>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{filteredGroups.length}</span>
              <span className="stat-label">Listas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {filteredGroups.reduce((total, group) => total + (group.songs?.length || 0), 0)}
              </span>
              <span className="stat-label">Canciones</span>
            </div>
            <div className="stat-item">
              <button
                className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <BsFilter />
                <span>Filtros</span>
              </button>
            </div>
            <div className="stat-item">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              >
                {viewMode === 'table' ? <BsCollection /> : <BsMusicNoteBeamed />}
                <span>{viewMode === 'table' ? 'Grid' : 'Tabla'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="header-controls">
          <SongSelector
            songs={groups.flatMap(group => group.songs || [])}
            selectedSong={null}
            onSelectSong={(song) => {
              const group = groups.find(g => g.songs?.includes(song));
              if (group) {
                setSelectedGroups(prev => new Set([...prev, group.id]));
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

      {/* PANEL DE FILTROS (SE MUESTRA CUANDO ESTÁ ACTIVO) */}
      {showFilters && (
        <div className="filters-panel">
          <FilterControls
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            availableLists={availableLists}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
            onExpandAll={expandAllGroups}
            onCollapseAll={collapseAllGroups}
          />
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL DE LA TABLA */}
      <div className="excel-table-container">
        <div className="table-wrapper">
          <table className="excel-table ultra-compact-table">
            <thead>
              <tr>
                <th className="col-expand"></th>
                {visibleColumns.artist && (
                  <th 
                    className="col-artist sortable"
                    onClick={() => handleSortChange('artist')}
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
                    onClick={() => handleSortChange('title')}
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
                    onClick={() => handleSortChange('genre')}
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
                    onClick={() => handleSortChange('bpm')}
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
                    onClick={() => handleSortChange('key')}
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
                    onClick={() => handleSortChange('duration')}
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
                    onClick={() => handleSortChange('list')}
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
              {filteredGroups.map((group, gIndex) => (
                <React.Fragment key={group.id}>
                  {/* FILA DE ENCABEZADO DEL GRUPO */}
                  <tr 
                    className={`group-header ${selectedGroups.has(group.id) ? 'expanded' : ''}`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <td className="col-expand">
                      <span className="expand-icon">
                        {selectedGroups.has(group.id) ? <BsChevronDown /> : <BsChevronRight />}
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
                  
                  {/* FILAS DE CANCIONES (SE MUESTRAN CUANDO EL GRUPO ESTÁ EXPANDIDO) */}
                  {selectedGroups.has(group.id) && group.songs.map((song, sIndex) => {
                    const extraData = getSongExtraData(song);
                    const songId = song.id || song.title;
                    
                    return (
                      <tr key={`${gIndex}-${sIndex}`} className="song-row">
                        <td className="col-expand"></td>
                        
                        {/* COLUMNA: ARTISTA */}
                        {visibleColumns.artist && (
                          <td className="col-artist">
                            <span className="artist-text">{song.artist || 'N/A'}</span>
                          </td>
                        )}
                        
                        {/* COLUMNA: TÍTULO */}
                        {visibleColumns.title && (
                          <td className="col-title">
                            <div className="song-title-cell">
                              <span className="title-text">{song.title}</span>
                            </div>
                          </td>
                        )}
                        
                        {/* COLUMNA: GÉNERO */}
                        {visibleColumns.genre && (
                          <td className="col-genre">
                            <span className="genre-badge">{song.genre || extraData.genre}</span>
                          </td>
                        )}
                        
                        {/* COLUMNA: BPM */}
                        {visibleColumns.bpm && (
                          <td className="col-bpm">
                            <span className="bpm-text">{song.bpm || extraData.bpm}</span>
                          </td>
                        )}
                        
                        {/* COLUMNA: TONO */}
                        {visibleColumns.key && (
                          <td className="col-key">
                            <span className="key-badge">
                              {song.key || 'N/A'}
                            </span>
                          </td>
                        )}
                        
                        {/* COLUMNA: DURACIÓN */}
                        {visibleColumns.duration && (
                          <td className="col-duration">
                            <div className="duration-cell">
                              <BsClock className="duration-icon" />
                              <span className="duration-text">{song.duration || extraData.duration}</span>
                            </div>
                          </td>
                        )}
                        
                        {/* COLUMNA: LISTA */}
                        {visibleColumns.list && (
                          <td className="col-list">
                            <span className="list-text">{group.libraryName || group.groupName}</span>
                          </td>
                        )}
                        
                        {/* COLUMNA: ACCIONES */}
                        {visibleColumns.actions && (
                          <td className="col-actions">
                            <div className="action-buttons">
                              {/* BOTÓN REPRODUCIR AUDIO MEJORADO CON FADE */}
                              <AudioPlayer 
                                mp3File={song.mp3_file} 
                                songId={songId}
                                currentlyPlaying={currentlyPlaying}
                                onPlay={handlePlay}
                                onPause={handlePause}
                              />
                              
                              {/* BOTÓN ABRIR ACORDES */}
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
        
        {/* MENSAJE CUANDO NO HAY RESULTADOS */}
        {filteredGroups.length === 0 && (
          <div className="no-results">
            <BsMusicNoteBeamed />
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
          </div>
        )}
      </div>

      {/* FOOTER DE LA TABLA CON INFORMACIÓN Y ACCIONES */}
      <div className="table-footer">
        <div className="footer-info">
          <span>Mostrando {filteredGroups.reduce((total, group) => total + (group.songs?.length || 0), 0)} canciones</span>
          {(activeFilters.letter || activeFilters.list) && (
            <span className="active-filters-info">
              {activeFilters.letter && ` • Letra: ${activeFilters.letter}`}
              {activeFilters.list && ` • Lista: ${availableLists.find(l => l.id === activeFilters.list)?.name}`}
            </span>
          )}
        </div>
        <div className="footer-actions">
          <button className="columns-toggle" onClick={() => setShowFilters(!showFilters)}>
            <BsFilter />
            <span>{showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default BibliotecaCancioneros;