// ============================================
// ARCHIVO: MMusicaEscucha.jsx - VERSIÓN COMPLETA CON MEJOR CONTRASTE
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMusicaContexto } from './MusicaContexto';
import { loadAllMusicData, loadChordsData } from './services/musicDataService';
import MusicaCancionesLista from './MusicaCancionesLista';
import MusicaReproductor from './MusicaReproductor';
import ChordsViewerIndex from '../ChordsViewer/ChordsViewerIndex';
import { 
  BsMusicNoteBeamed, 
  BsPlayCircle, 
  BsPauseCircle, 
  BsVolumeUp, 
  BsDownload,
  BsSkipForward,
  BsSkipBackward,
  BsListUl,
  BsChevronDown,
  BsChevronUp,
  BsSearch,
  BsFilter,
  BsCollectionPlay,
  BsVolumeMute,
  BsVolumeDown,
  BsVolumeUp as BsVolumeUpIcon
} from "react-icons/bs";
import '../../assets/scss/_03-Componentes/_MMusicaEscucha.scss';

const MMusicaEscucha = () => {
  // ============================================
  // ESTADOS PRINCIPALES - 3 CATEGORÍAS
  // ============================================
  const [categoria, setCategoria] = useState('original');
  const [bloques, setBloques] = useState({});
  const [bloqueActual, setBloqueActual] = useState('');
  const [cancionesFiltradas, setCancionesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cancionConChords, setCancionConChords] = useState(null);
  const [datosChords, setDatosChords] = useState(null);
  const [allMusicConfig, setAllMusicConfig] = useState(null);
  const [transposition, setTransposition] = useState(0);
  const [mostrarListaMobile, setMostrarListaMobile] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [autoExpandChords, setAutoExpandChords] = useState(true);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // ============================================
  // CONTEXTO Y REFERENCIAS
  // ============================================
  const audioRef = useRef(null);
  const chordsContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const { 
    currentSong,
    isPlaying,
    volume,
    setVolume,
    playSong,
    pauseSong,
    updatePlaylist,
    playNextSong,
    playPrevSong,
    currentTime,
    duration,
    handleProgressChange
  } = useMusicaContexto();

  // ============================================
  // FUNCIONES AUXILIARES - 3 CATEGORÍAS
  // ============================================
  const getNombreCategoria = (cat) => {
    const nombres = {
      'original': 'Original',
      'covers': 'Covers',
      'medleys': 'Medleys'
    };
    return nombres[cat] || cat;
  };

  const getIconoCategoria = (cat) => {
    const iconos = {
      'original': '🎤',
      'covers': '🎸',
      'medleys': '🎶'
    };
    return iconos[cat] || '🎵';
  };

  const getDescripcionCategoria = (cat) => {
    const descripciones = {
      'original': 'Música original de Ale Gondra y Almango Pop',
      'covers': 'Versiones de canciones clásicas y modernas',
      'medleys': 'Mezclas especiales y canciones enganchadas'
    };
    return descripciones[cat] || '';
  };

  // ============================================
  // EFECTOS PRINCIPALES
  // ============================================
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const config = await loadAllMusicData();
        setAllMusicConfig(config);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error cargando música. Recarga la página.');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const organizarBloques = () => {
      if (!allMusicConfig) return;
      try {
        const configCat = allMusicConfig[categoria] || {};
        const bloquesData = {};
        
        Object.keys(configCat).forEach(discoId => {
          const disco = configCat[discoId];
          bloquesData[discoId] = {
            nombre: disco.nombre,
            portada: disco.portada || '/img/default-cover.png',
            genero: disco.genero,
            artista: disco.artista,
            canciones: disco.canciones || []
          };
        });

        const todasCanciones = Object.values(configCat).flatMap(disco => disco.canciones || []);
        if (todasCanciones.length > 0) {
          bloquesData.todo = {
            nombre: `Todas (${getNombreCategoria(categoria)})`,
            portada: categoria === 'original' ? '/img/default-cover.png' : 
                    categoria === 'covers' ? '/img/covers-default.jpg' : 
                    '/img/medleys-default.jpg',
            genero: 'Todos',
            artista: 'Varios',
            canciones: todasCanciones
          };
        }

        setBloques(bloquesData);
        
        let bloquePorDefecto = '';
        if (bloquesData.todo) {
          bloquePorDefecto = 'todo';
        } else if (Object.keys(bloquesData).length > 0) {
          bloquePorDefecto = Object.keys(bloquesData)[0];
        }
        
        setBloqueActual(bloquePorDefecto);
        setCancionesFiltradas(bloquesData[bloquePorDefecto]?.canciones || []);
        
      } catch (err) {
        console.error('Error organizando bloques:', err);
        setError('Error procesando datos.');
      }
    };
    
    organizarBloques();
  }, [categoria, allMusicConfig]);

  useEffect(() => {
    if (!bloques[bloqueActual]) return;
    
    let canciones = bloques[bloqueActual].canciones || [];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      canciones = canciones.filter(c => 
        (c.nombre?.toLowerCase() || '').includes(query) || 
        (c.artista?.toLowerCase() || '').includes(query) ||
        (c.detalles?.genero?.toLowerCase() || '').includes(query) ||
        (c.detalles?.style?.toLowerCase() || '').includes(query)
      );
    }
    
    setCancionesFiltradas(canciones);
    
    if (canciones.length > 0) {
      updatePlaylist(canciones.map(c => ({
        id: c.id,
        nombre: c.nombre,
        artista: c.artista,
        duracion: c.duracion || '3:30',
        imagen: c.imagen || (categoria === 'original' ? '/img/default-cover.png' : 
                           categoria === 'covers' ? '/img/covers-default.jpg' : 
                           '/img/medleys-default.jpg'),
        url: c.url || '/audio/default-song.mp3',
        album: c.disco || getNombreCategoria(categoria),
        tipo: categoria
      })));
    }
  }, [bloqueActual, bloques, searchQuery, updatePlaylist, categoria]);

  useEffect(() => {
    if (currentSong && cancionesFiltradas.length > 0) {
      const cancionEncontrada = cancionesFiltradas.find(c => c.id === currentSong.id);
      if (cancionEncontrada) {
        cargarChords(cancionEncontrada);
      }
    }
  }, [currentSong, cancionesFiltradas]);

  // ============================================
  // FUNCIÓN: cargarChords
  // ============================================
  const cargarChords = async (cancion) => {
    try {
      console.log('🎵 Cargando chords para:', cancion.nombre);
      setCancionConChords(cancion);
      setTransposition(0);
      
      if (cancion.chords_url) {
        try {
          const chordsData = await loadChordsData(cancion.chords_url);
          
          console.log('📦 Chords cargados:', {
            title: chordsData.title,
            artist: chordsData.artist,
            esMedley: chordsData.esMedley || false,
            cancionesIncluidas: chordsData.cancionesIncluidas || 1,
            tieneContent: !!chordsData.content,
            longitudContent: Array.isArray(chordsData.content) ? chordsData.content.length : 'N/A'
          });
          
          setDatosChords(chordsData);
          
          if (autoExpandChords && chordsContainerRef.current) {
            setTimeout(() => {
              chordsContainerRef.current.style.height = 'auto';
              chordsContainerRef.current.style.minHeight = '800px';
            }, 100);
          }
          
        } catch (fetchError) {
          console.error('Error fetch chords_url:', fetchError);
          setDatosChords(crearChordsEjemploEstructurado(cancion));
        }
      } else {
        console.log('ℹ️ No hay chords_url, usando datos de ejemplo estructurado');
        setDatosChords(crearChordsEjemploEstructurado(cancion));
      }
    } catch (err) {
      console.error('Error general en cargarChords:', err);
      setDatosChords(crearChordsEjemploEstructurado(cancion));
    }
  };

  const crearChordsEjemploEstructurado = (cancion) => {
    return {
      id: `ejemplo-${Date.now()}`,
      title: cancion.nombre || "Canción Ejemplo",
      artist: cancion.artista || "Artista Ejemplo",
      originalKey: "C",
      tempo: "120",
      timeSignature: "4/4",
      esMedley: false,
      cancionesIncluidas: 1,
      content: [
        {
          type: "section",
          name: "INTRO",
          lines: [
            { type: "chords", content: ["C", "G", "Am", "F"] }
          ]
        },
        {
          type: "divider"
        },
        {
          type: "section",
          name: "ESTROFA",
          lines: [
            { type: "chord", content: "C" },
            { type: "lyric", content: "Esta es una canción de ejemplo" },
            { type: "chord", content: "G" },
            { type: "lyric", content: "Para mostrar cómo funciona" },
            { type: "chord", content: "Am" },
            { type: "lyric", content: "El visualizador de acordes" },
            { type: "chord", content: "F" },
            { type: "lyric", content: "Con la letra completa" }
          ]
        }
      ]
    };
  };

  // ============================================
  // FUNCIONES DE CONTROL DEL REPRODUCTOR
  // ============================================
  const manejarReproducirCancion = useCallback((cancion) => {
    const audioUrl = cancion.url || '/audio/default-song.mp3';
    
    const cancionFormateada = {
      id: cancion.id,
      nombre: cancion.nombre,
      artista: cancion.artista,
      album: cancion.disco || getNombreCategoria(categoria),
      duracion: cancion.duracion || '3:30',
      imagen: cancion.imagen || (categoria === 'original' ? '/img/default-cover.png' : 
                               categoria === 'covers' ? '/img/covers-default.jpg' : 
                               '/img/medleys-default.jpg'),
      url: audioUrl,
      tipo: categoria
    };

    const esActual = currentSong?.id === cancion.id;
    if (esActual && isPlaying) {
      pauseSong();
    } else {
      playSong(cancionFormateada);
      cargarChords(cancion);
    }
  }, [currentSong, isPlaying, pauseSong, playSong, categoria]);

  const cambiarCategoria = (cat) => {
    setCategoria(cat);
    setSearchQuery('');
    setCancionConChords(null);
    setDatosChords(null);
    setTransposition(0);
    setMostrarFiltros(false);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const descargarCancion = () => {
    if (!currentSong?.url) {
      alert('No hay canción para descargar');
      return;
    }
    const link = document.createElement('a');
    link.href = currentSong.url;
    link.download = `${currentSong.artista || 'Almango'} - ${currentSong.nombre || 'cancion'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNextSong = () => {
    if (cancionesFiltradas.length === 0) return;
    const currentIndex = cancionesFiltradas.findIndex(s => s.id === currentSong?.id);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % cancionesFiltradas.length;
    manejarReproducirCancion(cancionesFiltradas[nextIndex]);
  };

  const handlePrevSong = () => {
    if (cancionesFiltradas.length === 0) return;
    const currentIndex = cancionesFiltradas.findIndex(s => s.id === currentSong?.id);
    const prevIndex = currentIndex <= 0 ? cancionesFiltradas.length - 1 : currentIndex - 1;
    manejarReproducirCancion(cancionesFiltradas[prevIndex]);
  };

  const cambiarTransposicion = (delta) => {
    const nuevaTransposicion = transposition + delta;
    if (nuevaTransposicion >= -6 && nuevaTransposicion <= 6) {
      setTransposition(nuevaTransposicion);
    }
  };

  // ============================================
  // FUNCIONES PARA LA BARRA DE PROGRESO
  // ============================================
  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    if (handleProgressChange) {
      handleProgressChange(newTime);
    }
  };

  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };

  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
  };

  const handleProgressMouseMove = (e) => {
    if (!isDraggingProgress || !progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newTime = percentage * duration;
    
    if (handleProgressChange) {
      handleProgressChange(newTime);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ============================================
  // FUNCIÓN: Ajustar altura del contenedor de acordes
  // ============================================
  const ajustarAlturaChords = () => {
    if (chordsContainerRef.current && datosChords) {
      const contentHeight = chordsContainerRef.current.scrollHeight;
      const windowHeight = window.innerHeight;
      const headerHeight = 120;
      
      let optimalHeight = Math.max(contentHeight + 50, 600);
      optimalHeight = Math.min(optimalHeight, windowHeight - headerHeight);
      
      chordsContainerRef.current.style.height = 'auto';
      chordsContainerRef.current.style.minHeight = `${optimalHeight}px`;
      chordsContainerRef.current.style.maxHeight = 'none';
    }
  };

  useEffect(() => {
    if (datosChords && autoExpandChords) {
      setTimeout(ajustarAlturaChords, 300);
    }
  }, [datosChords, autoExpandChords]);

  // ============================================
  // RENDERIZADO COMPLETO
  // ============================================
  return (
    <div className="reproductor-almango-estructura-mas-altura reproductor-independiente">
      <audio ref={audioRef} />

      {/* HEADER ULTRA COMPACTO - TODO EN 1 LÍNEA */}
      <div className="header-ultra-compacto-todo-en-uno">
        
        {/* IZQUIERDA: TÍTULO Y CONTROLES BÁSICOS */}
        <div className="reproductor-izquierda-compacto">
          <button 
            className="boton-control-micro boton-lista-toggle"
            onClick={() => setMostrarListaMobile(!mostrarListaMobile)}
            title={mostrarListaMobile ? "Ocultar lista" : "Mostrar lista"}
          >
            <BsListUl />
            <span className="contador-micro">{cancionesFiltradas.length}</span>
          </button>

          {currentSong && (
            <div className="info-cancion-micro">
              <img 
                src={currentSong.imagen || 
                     (categoria === 'original' ? '/img/default-cover.png' : 
                      categoria === 'covers' ? '/img/covers-default.jpg' : 
                      '/img/medleys-default.jpg')} 
                alt="Portada" 
                className="portada-micro"
                onError={(e) => {
                  e.target.src = categoria === 'original' ? '/img/default-cover.png' : 
                                categoria === 'covers' ? '/img/covers-default.jpg' : 
                                '/img/medleys-default.jpg';
                }}
              />
              <div className="detalles-micro">
                <div className="titulo-micro">{currentSong.nombre}</div>
                <div className="artista-micro">{currentSong.artista}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* CENTRO: BARRA DE PROGRESO INTERACTIVA COMPACTA */}
        <div className="reproductor-centro-compacto">
          <div className="tiempo-micro">
            <span className="tiempo-actual">{formatTime(currentTime)}</span>
          </div>
          
          <div 
            className="barra-progreso-interactiva-micro"
            ref={progressBarRef}
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
            onMouseUp={handleProgressMouseUp}
            onMouseLeave={handleProgressMouseUp}
            onMouseMove={handleProgressMouseMove}
            title="Haz clic o arrastra para cambiar la posición"
          >
            <div className="barra-progreso-fondo-micro">
              <div 
                className="barra-progreso-relleno-micro"
                style={{ 
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  transition: isDraggingProgress ? 'none' : 'width 0.1s linear'
                }}
              ></div>
              
              <div 
                className="punto-progreso-micro"
                style={{ 
                  left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  transition: isDraggingProgress ? 'none' : 'left 0.1s linear',
                  display: duration > 0 ? 'block' : 'none'
                }}
              ></div>
            </div>
          </div>
          
          <div className="tiempo-micro">
            <span className="tiempo-total">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* CONTROLES DE REPRODUCCIÓN COMPACTOS */}
        <div className="controles-reproduccion-micro independiente">
          <button 
            className="boton-control-micro boton-prev-micro"
            onClick={handlePrevSong}
            disabled={!currentSong || cancionesFiltradas.length === 0}
            title="Canción anterior"
          >
            <BsSkipBackward />
          </button>
          
          <button 
            className="boton-control-micro boton-play-micro"
            onClick={() => isPlaying ? pauseSong() : playSong(currentSong)}
            disabled={!currentSong}
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <BsPauseCircle /> : <BsPlayCircle />}
          </button>
          
          <button 
            className="boton-control-micro boton-next-micro"
            onClick={handleNextSong}
            disabled={!currentSong || cancionesFiltradas.length === 0}
            title="Siguiente canción"
          >
            <BsSkipForward />
          </button>
        </div>

        {/* DERECHA: ACCIONES RÁPIDAS */}
        <div className="reproductor-derecha-compacto">
          <div className="volumen-contenedor-micro" ref={volumeSliderRef}>
            <button 
              className="boton-control-micro boton-volumen-micro"
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              title={volume === 0 ? "Activar sonido" : "Ajustar volumen"}
            >
              {volume === 0 ? <BsVolumeMute /> : 
               volume < 0.3 ? <BsVolumeDown /> : <BsVolumeUpIcon />}
            </button>
            
            {showVolumeSlider && (
              <div className="volumen-slider-micro">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="volumen-input-micro"
                  title={`Volumen: ${Math.round(volume * 100)}%`}
                />
                <div className="volumen-porcentaje-micro">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="boton-control-micro boton-descarga-micro"
            onClick={descargarCancion}
            disabled={!currentSong}
            title="Descargar MP3"
          >
            <BsDownload />
          </button>
          
          <div className="contador-canciones-micro">
            <span className="contador-icono">🎵</span>
            <span className="contador-numero">{cancionesFiltradas.length} Canciones</span>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN Y FILTROS COMPACTOS */}
      <div className="controles-superiores-compactos">
        
        <button 
          className="toggle-filtros-mobile"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          title={mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        >
          <BsFilter />
          <span>Filtros</span>
        </button>

        <div className={`filtros-contenedor ${mostrarFiltros ? 'visible' : ''}`}>
          <div className="nav-categorias-compacta">
            <div className="nav-botones-compactos">
              {['original', 'covers', 'medleys'].map(cat => (
                <button
                  key={cat}
                  className={`nav-btn-compacto ${categoria === cat ? 'nav-activo' : ''}`}
                  onClick={() => cambiarCategoria(cat)}
                  title={getDescripcionCategoria(cat)}
                >
                  <span className="nav-contenido-compacto">
                    <span className="nav-icono-compacto">{getIconoCategoria(cat)}</span>
                    <span className="nav-texto-compacto">{getNombreCategoria(cat)}</span>
                    <span className="nav-descripcion-micro">{getDescripcionCategoria(cat)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="filtros-micro">
            <div className="filtros-contenedor-micro">
              <select
                className="filtro-select-micro"
                value={bloqueActual}
                onChange={(e) => setBloqueActual(e.target.value)}
                aria-label={categoria === 'original' ? "Seleccionar disco" : 
                           categoria === 'covers' ? "Seleccionar género" : 
                           "Seleccionar medley"}
                disabled={loading}
              >
                {Object.keys(bloques).map(bloqueId => (
                  <option key={bloqueId} value={bloqueId}>
                    {bloques[bloqueId]?.nombre || bloqueId}
                    {bloques[bloqueId]?.canciones && 
                      ` (${bloques[bloqueId].canciones.length})`}
                  </option>
                ))}
              </select>
              
              <div className="buscador-con-icono">
                <BsSearch className="icono-busqueda" />
                <input
                  type="text"
                  className="filtro-busqueda-micro"
                  placeholder={`Buscar en ${getNombreCategoria(categoria)}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Buscar canción"
                  disabled={loading}
                />
                {searchQuery && (
                  <button 
                    className="buscador-limpiar-micro"
                    onClick={() => setSearchQuery('')}
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

              {bloqueActual && bloques[bloqueActual] && (
                <>
                  <div className="filtro-divisor"></div>
                  
                  <div className="filtro-info-micro-contenedor">
                    <div className="filtro-info-micro">
                      <span className="filtro-actual-micro">
                        <span className="filtro-icono-micro">📁</span>
                        {bloques[bloqueActual].nombre}
                        {bloques[bloqueActual].genero && 
                          <span className="filtro-genero-micro">
                            <span className="separador-filtro-micro"> • </span>
                            {bloques[bloqueActual].genero}
                          </span>
                        }
                      </span>
                      
                      <span className="filtro-contador-micro">
                        <span className="contador-icono-micro">🎵</span>
                        <span className="contador-numero-micro">{cancionesFiltradas.length}</span>
                        <span className="contador-texto-micro">canciones</span>
                        {searchQuery && (
                          <span className="contador-filtrado-micro">
                            <span className="filtrado-icono-micro">🔍</span>
                            <span className="filtrado-texto-micro">filtradas</span>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="contenido-estructura-optimizada-compacta">
        
        {/* ESTRUCTURA DESKTOP */}
        <div className="estructura-desktop-compacta">
          <div className="panel-lista-compacta">
            <div className="panel-header-micro">
              <h3 className="panel-titulo-micro">
                <span className="panel-categoria-micro">{getNombreCategoria(categoria)}</span>
                <span className="panel-contador-micro">{cancionesFiltradas.length}</span>
                {bloqueActual && bloques[bloqueActual] && bloqueActual !== 'todo' && (
                  <span className="panel-bloque-micro">
                    {bloques[bloqueActual].nombre}
                  </span>
                )}
              </h3>
            </div>
            
            <div className="panel-contenido-lista-compacta">
              {loading ? (
                <div className="cargando-micro">
                  <BsMusicNoteBeamed className="icono-cargando-micro" />
                  <span>Cargando {getNombreCategoria(categoria).toLowerCase()}...</span>
                </div>
              ) : error ? (
                <div className="error-micro">
                  <span>⚠️</span>
                  <span>{error}</span>
                  <button 
                    onClick={() => window.location.reload()}
                    className="btn-reintentar-micro"
                  >
                    Reintentar
                  </button>
                </div>
              ) : cancionesFiltradas.length === 0 ? (
                <div className="sin-resultados-micro">
                  <span>🔍</span>
                  <div>
                    <p>No se encontraron canciones</p>
                    {searchQuery && (
                      <p className="sin-resultados-sugerencia">
                        Intenta con otros términos o <button 
                          onClick={() => setSearchQuery('')}
                          className="btn-limpiar-busqueda-micro"
                        >
                          limpiar búsqueda
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="lista-canciones-con-scroll">
                  <div className="lista-canciones-compacta">
                    <MusicaCancionesLista
                      songs={cancionesFiltradas}
                      currentSong={currentSong}
                      onPlaySong={manejarReproducirCancion}
                      onViewDetails={cargarChords}
                      showCategory={categoria}
                      compactView={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="panel-chords-maxi-expandido" ref={chordsContainerRef}>
            <div className="panel-info-cancion-micro compacto">
              {currentSong ? (
                <div className="info-cancion-nano-en-linea">
                  <img 
                    src={currentSong.imagen || 
                         (categoria === 'original' ? '/img/default-cover.png' : 
                          categoria === 'covers' ? '/img/covers-default.jpg' : 
                          '/img/medleys-default.jpg')} 
                    alt="Portada" 
                    className="portada-img-nano-en-linea"
                    onError={(e) => {
                      e.target.src = categoria === 'original' ? '/img/default-cover.png' : 
                                    categoria === 'covers' ? '/img/covers-default.jpg' : 
                                    '/img/medleys-default.jpg';
                    }}
                  />
                  <div className="detalles-nano-en-linea">
                    <div className="titulo-nano-en-linea">{currentSong.nombre}</div>
                    <div className="metadatos-nano-en-linea">
                      <span className="artista-nano-en-linea">{currentSong.artista}</span>
                      <span className="separador-nano">•</span>
                      <span className="album-nano-en-linea">{currentSong.album || getNombreCategoria(categoria)}</span>
                      <span className="separador-nano">•</span>
                      <span className="categoria-nano-en-linea">{getNombreCategoria(categoria)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sin-cancion-nano-en-linea">
                  <span className="icono-sin-cancion">{getIconoCategoria(categoria)}</span>
                  <span>Selecciona una canción para ver los acordes</span>
                </div>
              )}
            </div>

            <div className="panel-chords-expandido-completo">
              <div className="panel-header-micro">
                <h3 className="panel-titulo-micro">
                  <span className="panel-categoria-micro">Letras & Acordes Inteligentes</span>
                  {cancionConChords && (
                    <span className="panel-cancion-micro">
                      {cancionConChords.nombre}
                      <button 
                        className="btn-toggle-expand"
                        onClick={() => {
                          setAutoExpandChords(!autoExpandChords);
                          ajustarAlturaChords();
                        }}
                        title={autoExpandChords ? "Altura automática" : "Altura fija"}
                      >
                        {autoExpandChords ? '⤓' : '⤒'}
                      </button>
                    </span>
                  )}
                </h3>
              </div>
              
              <div className="panel-contenido-chords-expandido">
                {datosChords ? (
                  <div className="chords-viewer-integrado-expandido">
                    <ChordsViewerIndex 
                      chordsData={datosChords}
                      transpositionProp={transposition}
                      songMetadata={{
                        coverImage: currentSong?.imagen,
                        album: currentSong?.album,
                        category: getNombreCategoria(categoria)
                      }}
                      compactMode="extreme"
                      autoExpand={autoExpandChords}
                    />
                  </div>
                ) : cancionConChords ? (
                  <div className="sin-chords-micro">
                    <BsMusicNoteBeamed className="icono-cargando-chords" />
                    <p>Cargando letra y acordes...</p>
                  </div>
                ) : (
                  <div className="instrucciones-chords-micro">
                    <div className="logo-titulo-micro">
                      <span className="icono-instrucciones">{getIconoCategoria(categoria)}</span>
                      <span>Reproduce una canción para ver sus acordes</span>
                    </div>
                    
                    <div className="logo-animado-container-micro">
                      <img 
                        src="/img/04-gif/logogondraworldanimado6.gif" 
                        alt="Almango Pop Covers" 
                        className="logo-animado-banda-micro"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = 
                            '<span class="logo-fallback-micro">🎵 Almango Pop Covers</span>';
                        }}
                      />
                    </div>
                    
                    <div className="logo-descripcion-micro">
                      <p>Selecciona una canción de la lista para ver su letra completa con acordes</p>
                      <p className="hint-micro">
                        Usa los botones <strong>+</strong> y <strong>-</strong> para transponer los acordes
                      </p>
                      <p className="hint-micro">
                        Presiona <strong>A4</strong> para activar el modo hoja de impresión
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ESTRUCTURA MOBILE COMPACTA */}
        <div className="estructura-mobile-compacta">
          <div className="mobile-toggle-lista">
            <button 
              className="toggle-btn-lista"
              onClick={() => setMostrarListaMobile(!mostrarListaMobile)}
              title={mostrarListaMobile ? "Ocultar lista" : "Mostrar lista"}
            >
              <BsListUl />
              <span>{mostrarListaMobile ? 'Ocultar lista' : 'Mostrar lista'}</span>
              <span className="contador-toggle">{cancionesFiltradas.length}</span>
            </button>
          </div>

          {mostrarListaMobile && (
            <div className="panel-mobile-lista-compacta">
              <div className="panel-header-micro">
                <h3 className="panel-titulo-micro">
                  <span className="panel-categoria-micro">{getNombreCategoria(categoria)}</span>
                  <span className="panel-contador-micro">{cancionesFiltradas.length}</span>
                </h3>
              </div>
              
              <div className="panel-contenido-mobile-lista">
                {loading ? (
                  <div className="cargando-micro">
                    <BsMusicNoteBeamed className="icono-cargando-micro" />
                    <span>Cargando...</span>
                  </div>
                ) : error ? (
                  <div className="error-micro">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                ) : (
                  <MusicaCancionesLista
                    songs={cancionesFiltradas}
                    currentSong={currentSong}
                    onPlaySong={manejarReproducirCancion}
                    onViewDetails={cargarChords}
                    mobileView={true}
                  />
                )}
              </div>
            </div>
          )}

          <div className="panel-mobile-reproductor-compacto">
            <MusicaReproductor
              currentSong={currentSong}
              isPlaying={isPlaying}
              volume={volume}
              onPlayPause={() => isPlaying ? pauseSong() : playSong(currentSong)}
              onNext={handleNextSong}
              onPrev={handlePrevSong}
              onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
              bloqueActual={bloqueActual}
              bloques={bloques}
              categoria={categoria}
            />
          </div>

          <div 
            className="panel-mobile-chords-expandido"
            ref={chordsContainerRef}
          >
            <div className="panel-header-micro">
              <h3 className="panel-titulo-micro">
                <span className="panel-categoria-micro">Letras & Acordes</span>
                <button 
                  className="btn-expand-mobile"
                  onClick={() => {
                    setAutoExpandChords(!autoExpandChords);
                    ajustarAlturaChords();
                  }}
                  title={autoExpandChords ? "Contraer" : "Expandir"}
                >
                  {autoExpandChords ? '−' : '+'}
                </button>
              </h3>
            </div>
            
            <div className="panel-contenido-chords-mobile">
              {datosChords ? (
                <div className="chords-viewer-integrado-mobile-expandido">
                  <ChordsViewerIndex 
                    chordsData={datosChords}
                    transpositionProp={transposition}
                    compactMode="extreme"
                    autoExpand={autoExpandChords}
                  />
                </div>
              ) : cancionConChords ? (
                <div className="sin-chords-micro">
                  <BsMusicNoteBeamed className="icono-cargando-chords" />
                  <p>Cargando letra y acordes...</p>
                </div>
              ) : (
                <div className="instrucciones-chords-micro-mobile">
                  <span className="icono-instrucciones-mobile">{getIconoCategoria(categoria)}</span>
                  <p>Selecciona una canción para ver los acordes</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MMusicaEscucha;