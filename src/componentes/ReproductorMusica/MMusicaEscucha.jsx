// ============================================
// ARCHIVO: MMusicaEscucha.jsx - VERSIÓN COMPLETA
// DESCRIPCIÓN: Componente principal del reproductor de música con soporte para ZAPADAS
// CORRECCIONES: Manejo específico para categoría zapadas
// ============================================

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useMusicaContexto } from './MusicaContexto';
import { loadAllMusicData, loadChordsData } from './services/musicDataService';
import MusicaCancionesLista from './MusicaCancionesLista';
import MusicaReproductor from './MusicaReproductor';
import ChordsViewerIndex from '../ChordsViewer/ChordsViewerIndex';
import { 
  FiMusic,
  FiPlayCircle,
  FiPauseCircle,
  FiVolume2,
  FiDownload,
  FiSkipForward,
  FiSkipBack,
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiPlay,
  FiVolumeX,
  FiVolume1,
  FiVolume,
  FiStar,
  FiZap
} from "react-icons/fi";
import '../../assets/scss/_03-Componentes/_MMusicaEscucha.scss';

// ============================================
// COMPONENTE ERROR BOUNDARY
// ============================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error capturado en ErrorBoundary:', error);
    console.error('📋 Información del error:', errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">¡Ups! Algo salió mal</h2>
            <p className="error-boundary-message">
              Se produjo un error al cargar el reproductor de música.
            </p>
            <div className="error-boundary-actions">
              <button 
                className="error-boundary-btn error-boundary-btn-primary"
                onClick={this.handleReload}
              >
                Recargar página completa
              </button>
              <button 
                className="error-boundary-btn error-boundary-btn-secondary"
                onClick={this.handleReset}
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================
// COMPONENTE DE IMAGEN SEGURO
// ============================================
const SafeImage = memo(({ src, alt, className, fallbackSrc, onError, onLoad }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (e) => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      decoding="async"
    />
  );
});

SafeImage.displayName = 'SafeImage';

// ============================================
// COMPONENTE PRINCIPAL MMusicaEscucha
// ============================================
const MMusicaEscucha = () => {
  // ============================================
  // ESTADOS PRINCIPALES - 5 CATEGORÍAS
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
  const [isLoadingChords, setIsLoadingChords] = useState(false);

  // ============================================
  // CONTEXTO Y REFERENCIAS
  // ============================================
  const audioRef = useRef(null);
  const chordsContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const chordsAbortControllerRef = useRef(null);
  
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
  // FUNCIONES AUXILIARES - 5 CATEGORÍAS
  // ============================================
  const getNombreCategoria = (cat) => {
    const nombres = {
      'original': 'Original',
      'covers': 'Covers',
      'medleys': 'Medleys',
      'homenajes': 'Homenajes',
      'zapadas': 'Zapadas'
    };
    return nombres[cat] || cat;
  };

  const getIconoCategoria = (cat) => {
    const iconos = {
      'original': '🎤',
      'covers': '🎸',
      'medleys': '🎶',
      'homenajes': '👑',
      'zapadas': '🎹'
    };
    return iconos[cat] || '🎵';
  };

  const getDescripcionCategoria = (cat) => {
    const descripciones = {
      'original': 'Música Original',
      'covers': 'Covers Versionados',
      'medleys': 'Enganchados',
      'homenajes': 'Tributos Musicales',
      'zapadas': 'Sesiones Espontáneas'
    };
    return descripciones[cat] || '';
  };

  // ============================================
  // FUNCIÓN: getPortadaDefault
  // ============================================
  const getPortadaDefault = (cat) => {
    switch(cat) {
      case 'original': return '/img/default-cover.png';
      case 'covers': return '/img/09-discos/tapa-listado-covers.jpg';
      case 'medleys': return '/img/medleys-default.jpg';
      case 'homenajes': return '/img/Logo Almango pop Somprero 4.jpg';
      case 'zapadas': return '/img/300.jpg';
      default: return '/img/default-cover.png';
    }
  };

  // ============================================
  // FUNCIÓN: crearChordsEjemploEstructurado
  // ============================================
  const crearChordsEjemploEstructurado = (cancion) => {
    const esZapada = cancion.esZapada || categoria === 'zapadas';
    
    let introText = "Esta es una canción de ejemplo";
    if (esZapada) {
      introText = "Improvisación en vivo - Sesión espontánea";
    }
    
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
            { type: "lyric", content: introText },
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
  // EFECTO PRINCIPAL: Cargar datos musicales
  // ============================================
  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Iniciando carga de datos musicales...');
        const config = await loadAllMusicData();
        
        if (!isMounted) return;
        
        console.log('✅ Datos cargados:', {
          original: Object.keys(config.original || {}).length,
          covers: Object.keys(config.covers || {}).length,
          medleys: Object.keys(config.medleys || {}).length,
          homenajes: Object.keys(config.homenajes || {}).length,
          zapadas: Object.keys(config.zapadas || {}).length
        });
        
        setAllMusicConfig(config);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('❌ Error cargando datos:', err);
        setError(`Error cargando música: ${err.message}. Recarga la página.`);
      } finally {
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 500);
        }
      }
    };
    
    cargarDatos();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================
  // EFECTO: Organizar bloques
  // ============================================
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    const organizarBloques = () => {
      if (!allMusicConfig || !isMounted) return;
      
      try {
        console.log(`🎯 Organizando bloques para categoría: ${categoria}`);
        
        const configCat = allMusicConfig[categoria] || {};
        console.log(`📊 Configuración de ${categoria}:`, Object.keys(configCat).length, 'bloques');
        
        const bloquesData = {};
        
        // Procesar cada "disco" o "artista" en la categoría
        Object.keys(configCat).forEach(discoId => {
          const disco = configCat[discoId];
          
          // CORRECCIÓN ESPECÍFICA PARA ZAPADAS
          let nombreMostrar = disco.nombre || '';
          let artistaMostrar = disco.artista || '';
          
          if (categoria === 'zapadas') {
            // Para zapadas, el artista siempre es "Almango Pop"
            artistaMostrar = 'Almango Pop';
            
            // El nombre del disco lo mantenemos como está
            if (nombreMostrar.includes('ZAPADAS')) {
              // Ya está bien
            } else {
              nombreMostrar = 'ZAPADAS DE TODOS LOS ESTILOS';
            }
          }
          
          bloquesData[discoId] = {
            nombre: nombreMostrar,
            portada: disco.portada || getPortadaDefault(categoria),
            genero: disco.genero || (categoria === 'zapadas' ? 'Zapadas' : 'Varios'),
            artista: artistaMostrar || 'Varios',
            canciones: disco.canciones || []
          };
        });

        // Agregar opción "Todos" solo si hay múltiples bloques
        const todasCanciones = Object.values(configCat).flatMap(disco => disco.canciones || []);
        if (todasCanciones.length > 0 && Object.keys(bloquesData).length > 1) {
          bloquesData.todo = {
            nombre: `Todos los ${getNombreCategoria(categoria).toLowerCase()}`,
            portada: getPortadaDefault(categoria),
            genero: 'Todos',
            artista: 'Varios',
            canciones: todasCanciones
          };
        }

        if (isMounted) {
          requestAnimationFrame(() => {
            if (isMounted) {
              setBloques(bloquesData);
              
              // Seleccionar bloque por defecto
              let bloquePorDefecto = '';
              if (bloquesData.todo) {
                bloquePorDefecto = 'todo';
              } else if (Object.keys(bloquesData).length > 0) {
                bloquePorDefecto = Object.keys(bloquesData)[0];
              }
              
              console.log(`🎵 Bloque por defecto: ${bloquePorDefecto}`);
              setBloqueActual(bloquePorDefecto);
              setCancionesFiltradas(bloquesData[bloquePorDefecto]?.canciones || []);
            }
          });
        }
        
      } catch (err) {
        if (isMounted) {
          console.error('❌ Error organizando bloques:', err);
          setError('Error procesando datos. Intenta recargar la página.');
        }
      }
    };
    
    timeoutId = setTimeout(organizarBloques, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [categoria, allMusicConfig]);

  // ============================================
  // EFECTO: Filtrar canciones
  // ============================================
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    const actualizarCanciones = () => {
      if (!bloques[bloqueActual] || !isMounted) return;
      
      let canciones = bloques[bloqueActual].canciones || [];
      
      // CORRECCIÓN ESPECÍFICA PARA ZAPADAS: Validar URLs
      if (categoria === 'zapadas') {
        canciones = canciones.map(cancion => {
          // Verificar y corregir URL del MP3
          let urlMP3 = cancion.url;
          
          if (!urlMP3 || urlMP3 === '/audio/default-song.mp3') {
            // Intentar construir URL basada en el ID
            if (cancion.id && cancion.id.includes('zapada-')) {
              const idParts = cancion.id.split('-');
              if (idParts.length >= 3) {
                const estilo = idParts[1]; // "rock", "blues", etc.
                const numero = idParts[2]; // "001", "04", etc.
                
                // Construir URL real
                urlMP3 = `/audio/05-mp3-zapadas/mp3-zapadas-${estilo}/mp3-zapadas-${estilo}-${numero}.mp3`;
              }
            }
          }
          
          return {
            ...cancion,
            url: urlMP3 || '/audio/default-song.mp3'
          };
        });
      }
      
      // Aplicar filtro de búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        canciones = canciones.filter(c => {
          const nombre = (c.nombre || '').toLowerCase();
          const artista = (c.artista || '').toLowerCase();
          const genero = (c.detalles?.genero || '').toLowerCase();
          const estilo = (c.detalles?.style || '').toLowerCase();
          const tipo = (c.detalles?.tipo || '').toLowerCase();
          
          return nombre.includes(query) || 
                 artista.includes(query) ||
                 genero.includes(query) ||
                 estilo.includes(query) ||
                 tipo.includes(query);
        });
      }
      
      if (isMounted) {
        requestAnimationFrame(() => {
          if (isMounted) {
            setCancionesFiltradas(canciones);
            
            // Actualizar playlist para navegación
            if (canciones.length > 0) {
              const playlist = canciones.map(c => ({
                id: c.id,
                nombre: c.nombre,
                artista: c.artista,
                duracion: c.duracion || '3:30',
                imagen: c.imagen || getPortadaDefault(categoria),
                url: c.url || '/audio/default-song.mp3',
                album: c.disco || getNombreCategoria(categoria),
                tipo: categoria,
                esHomenaje: categoria === 'homenajes',
                esZapada: categoria === 'zapadas'
              }));
              
              updatePlaylist(playlist);
              console.log(`🎧 Playlist actualizada: ${playlist.length} canciones en ${categoria}`);
            }
          }
        });
      }
    };
    
    timeoutId = setTimeout(actualizarCanciones, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [bloqueActual, bloques, searchQuery, updatePlaylist, categoria]);

  // ============================================
  // EFECTO: Cargar chords cuando cambia la canción actual
  // ============================================
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    const cargarChordsParaCancion = async () => {
      // Cancelar cualquier carga previa de chords
      if (chordsAbortControllerRef.current) {
        chordsAbortControllerRef.current.abort();
      }
      
      if (!isMounted || !currentSong || cancionesFiltradas.length === 0) return;
      
      const cancionEncontrada = cancionesFiltradas.find(c => c.id === currentSong.id);
      if (cancionEncontrada && isMounted) {
        try {
          await cargarChords(cancionEncontrada);
        } catch (error) {
          if (isMounted && error.name !== 'AbortError') {
            console.error('Error cargando chords:', error);
          }
        }
      }
    };
    
    timeoutId = setTimeout(cargarChordsParaCancion, 150);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (chordsAbortControllerRef.current) {
        chordsAbortControllerRef.current.abort();
      }
    };
  }, [currentSong, cancionesFiltradas]);

  // ============================================
  // FUNCIÓN: cargarChords
  // ============================================
  const cargarChords = async (cancion, signal) => {
    // Si hay una carga en curso, cancelarla
    if (isLoadingChords) {
      console.log('⏸️ Cancelando carga anterior de chords...');
      if (chordsAbortControllerRef.current) {
        chordsAbortControllerRef.current.abort();
      }
    }
    
    setIsLoadingChords(true);
    
    const controller = new AbortController();
    chordsAbortControllerRef.current = controller;
    
    try {
      console.log('🎵 Cargando chords para:', cancion.nombre);
      
      if (controller.signal.aborted) {
        console.log('🚫 Carga abortada antes de comenzar');
        return;
      }
      
      setCancionConChords(cancion);
      setTransposition(0);
      
      if (cancion.chords_url) {
        try {
          const chordsData = await loadChordsData(cancion.chords_url);
          
          if (controller.signal.aborted) {
            console.log('🚫 Carga abortada durante fetch');
            return;
          }
          
          console.log('📦 Chords cargados:', {
            title: chordsData.title,
            artist: chordsData.artist
          });
          
          requestAnimationFrame(() => {
            setDatosChords(chordsData);
            
            if (autoExpandChords && chordsContainerRef.current) {
              setTimeout(() => {
                if (chordsContainerRef.current) {
                  chordsContainerRef.current.style.height = 'auto';
                  chordsContainerRef.current.style.minHeight = '800px';
                }
              }, 100);
            }
          });
          
        } catch (fetchError) {
          if (fetchError.name === 'AbortError') {
            console.log('🚫 Carga de chords abortada');
            return;
          }
          
          console.error('Error fetch chords_url:', fetchError);
          setDatosChords(crearChordsEjemploEstructurado(cancion));
        }
      } else {
        console.log('ℹ️ No hay chords_url, usando datos de ejemplo estructurado');
        setDatosChords(crearChordsEjemploEstructurado(cancion));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('🚫 Carga de chords abortada');
        return;
      }
      
      console.error('Error general en cargarChords:', err);
      setDatosChords(crearChordsEjemploEstructurado(cancion));
    } finally {
      setTimeout(() => {
        setIsLoadingChords(false);
      }, 100);
    }
  };

  // ============================================
  // FUNCIÓN: manejarReproducirCancion
  // ============================================
  const manejarReproducirCancion = useCallback((cancion) => {
    console.log('▶️ Intentando reproducir:', cancion.nombre);
    
    // CORRECCIÓN ESPECÍFICA PARA ZAPADAS
    let audioUrl = cancion.url || '/audio/default-song.mp3';
    
    // Si es zapada y la URL es default, intentar construir URL real
    if (categoria === 'zapadas' && (audioUrl === '/audio/default-song.mp3' || !audioUrl.includes('mp3-zapadas'))) {
      if (cancion.id && cancion.id.includes('zapada-')) {
        const idParts = cancion.id.split('-');
        if (idParts.length >= 3) {
          const estilo = idParts[1]; // "rock", "blues", etc.
          const numero = idParts[2]; // "001", "04", etc.
          audioUrl = `/audio/05-mp3-zapadas/mp3-zapadas-${estilo}/mp3-zapadas-${estilo}-${numero}.mp3`;
        }
      }
    }
    
    console.log('🔊 URL de audio final:', audioUrl);
    
    const cancionFormateada = {
      id: cancion.id,
      nombre: cancion.nombre,
      artista: cancion.artista,
      album: cancion.disco || getNombreCategoria(categoria),
      duracion: cancion.duracion || '3:30',
      imagen: cancion.imagen || getPortadaDefault(categoria),
      url: audioUrl,
      tipo: categoria,
      detalles: cancion.detalles || {},
      esHomenaje: categoria === 'homenajes',
      esZapada: categoria === 'zapadas'
    };

    const esActual = currentSong?.id === cancion.id;
    if (esActual && isPlaying) {
      pauseSong();
    } else {
      playSong(cancionFormateada);
      
      // Cargar chords para la canción con un pequeño delay
      setTimeout(() => {
        cargarChords(cancion);
      }, 200);
    }
  }, [currentSong, isPlaying, pauseSong, playSong, categoria]);

  // ============================================
  // FUNCIÓN: cambiarCategoria
  // ============================================
  const cambiarCategoria = (cat) => {
    console.log(`🔄 Cambiando categoría a: ${cat}`);
    
    // Cancelar cualquier carga en curso
    if (chordsAbortControllerRef.current) {
      chordsAbortControllerRef.current.abort();
    }
    
    // Resetear estados relacionados con la categoría anterior
    requestAnimationFrame(() => {
      setCategoria(cat);
      setSearchQuery('');
      setCancionConChords(null);
      setDatosChords(null);
      setTransposition(0);
      setMostrarFiltros(false);
      setMostrarListaMobile(false);
      setIsLoadingChords(false);
      
      // Resetear la playlist actual
      updatePlaylist([]);
    });
  };

  // ============================================
  // FUNCIONES DE UTILIDAD
  // ============================================
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
  // FUNCIÓN: Renderizar mensaje cuando no hay canciones
  // ============================================
  const renderMensajeSinCanciones = () => {
    if (loading) return null;
    
    if (error) {
      return (
        <div className="error-micro">
          <span className="error-icono">⚠️</span>
          <span className="error-texto">{error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="btn-reintentar-micro"
          >
            Reintentar
          </button>
        </div>
      );
    }
    
    if (cancionesFiltradas.length === 0) {
      if (searchQuery) {
        return (
          <div className="sin-resultados-micro">
            <span className="sin-resultados-icono">🔍</span>
            <div className="sin-resultados-contenido">
              <p>No se encontraron canciones con "{searchQuery}"</p>
              <p className="sin-resultados-sugerencia">
                Intenta con otros términos o{' '}
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn-limpiar-busqueda-micro"
                >
                  limpiar búsqueda
                </button>
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="sin-resultados-micro">
            <span className="sin-resultados-icono">
              {categoria === 'homenajes' ? '👑' : 
               categoria === 'zapadas' ? '🎹' : '🎵'}
            </span>
            <div className="sin-resultados-contenido">
              <p>
                {categoria === 'homenajes' ? 'No hay homenajes disponibles todavía' :
                 categoria === 'zapadas' ? 'No hay sesiones de zapadas disponibles' :
                 'No se encontraron canciones'}
              </p>
            </div>
          </div>
        );
      }
    }
    
    return null;
  };

  // ============================================
  // RENDERIZADO COMPLETO
  // ============================================
  return (
    <div className="reproductor-almango-estructura-mas-altura reproductor-independiente">
      <audio ref={audioRef} />

      {/* ============================================
      SECCIÓN: BOTONES DE CATEGORÍA EN UNA SOLA LÍNEA
      ============================================ */}
      <div className="botones-categoria-lineal-header">
        <div className="contenedor-botones-categoria-lineal">
          <div className="nav-categorias-compacta nav-categorias-lineal">
            <div className="nav-botones-compactos linea-horizontal-botones">
              {['original', 'covers', 'medleys', 'homenajes', 'zapadas'].map(cat => (
                <button
                  key={cat}
                  className={`nav-btn-rockero nav-btn-${cat} ${categoria === cat ? 'nav-activo' : 'nav-inactivo'}`}
                  onClick={() => cambiarCategoria(cat)}
                  title={getDescripcionCategoria(cat)}
                >
                  <span className="nav-contenido-rockero">
                    <span className="nav-icono-rockero">
                      {getIconoCategoria(cat)}
                    </span>
                    <span className="nav-texto-rockero">
                      {getNombreCategoria(cat).toUpperCase()}
                    </span>
                    <span className="nav-subtitulo-rockero">
                      {getDescripcionCategoria(cat)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
      HEADER ULTRA COMPACTO
      ============================================ */}
      <div className="header-ultra-compacto-todo-en-uno">
        
        {/* IZQUIERDA: TÍTULO Y CONTROLES BÁSICOS */}
        <div className="reproductor-izquierda-compacto">
          <button 
            className="boton-control-micro boton-lista-toggle"
            onClick={() => setMostrarListaMobile(!mostrarListaMobile)}
            title={mostrarListaMobile ? "Ocultar lista" : "Mostrar lista"}
          >
            <FiList />
            <span className="contador-micro">{cancionesFiltradas.length}</span>
          </button>

          {currentSong && (
            <div className="info-cancion-micro">
              <SafeImage 
                src={currentSong.imagen || getPortadaDefault(categoria)} 
                fallbackSrc={getPortadaDefault(categoria)}
                alt="Portada" 
                className="portada-micro"
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
            <FiSkipBack />
          </button>
          
          <button 
            className="boton-control-micro boton-play-micro"
            onClick={() => isPlaying ? pauseSong() : playSong(currentSong)}
            disabled={!currentSong}
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <FiPauseCircle /> : <FiPlayCircle />}
          </button>
          
          <button 
            className="boton-control-micro boton-next-micro"
            onClick={handleNextSong}
            disabled={!currentSong || cancionesFiltradas.length === 0}
            title="Siguiente canción"
          >
            <FiSkipForward />
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
              {volume === 0 ? <FiVolumeX /> : 
               volume < 0.3 ? <FiVolume1 /> : <FiVolume2 />}
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
            <FiDownload />
          </button>
          
          <div className="contador-canciones-micro">
            <span className="contador-icono">🎵</span>
            <span className="contador-numero">{cancionesFiltradas.length} Canciones</span>
          </div>
        </div>
      </div>

      {/* ============================================
      NAVEGACIÓN Y FILTROS COMPACTOS
      ============================================ */}
      <div className="controles-superiores-compactos">
        
        <button 
          className="toggle-filtros-mobile"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          title={mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        >
          <FiFilter />
          <span className="toggle-filtros-texto">Filtros</span>
          <span className="toggle-filtros-indicador">{mostrarFiltros ? '▲' : '▼'}</span>
        </button>

        <div className={`filtros-contenedor ${mostrarFiltros ? 'visible' : ''}`}>
          <div className="filtros-micro">
            <div className="filtros-contenedor-micro">
              <select
                className="filtro-select-micro"
                value={bloqueActual}
                onChange={(e) => setBloqueActual(e.target.value)}
                aria-label={
                  categoria === 'original' ? "Seleccionar disco" : 
                  categoria === 'covers' ? "Seleccionar género" : 
                  categoria === 'homenajes' ? "Seleccionar artista homenajeado" :
                  categoria === 'zapadas' ? "Seleccionar sesión" :
                  "Seleccionar medley"
                }
                disabled={loading || Object.keys(bloques).length === 0}
              >
                {Object.keys(bloques).map(bloqueId => (
                  <option key={bloqueId} value={bloqueId}>
                    {bloques[bloqueId]?.nombre || bloqueId}
                    {bloques[bloqueId]?.canciones && 
                      ` (${bloques[bloqueId].canciones.length})`}
                  </option>
                ))}
              </select>
              
              <div className="buscador-con-icono buscador-enfocado">
                <FiSearch className="icono-busqueda" />
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
                        <span className="filtro-icono-micro">
                          {categoria === 'homenajes' ? '👑' : 
                           categoria === 'zapadas' ? '🎹' : '📁'}
                        </span>
                        <span className="filtro-nombre-micro">{bloques[bloqueActual].nombre}</span>
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

      {/* ============================================
      CONTENIDO PRINCIPAL
      ============================================ */}
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
                    {categoria === 'homenajes' ? '🎭 ' : ''}
                    {bloques[bloqueActual].nombre}
                  </span>
                )}
              </h3>
            </div>
            
            <div className="panel-contenido-lista-compacta">
              {loading ? (
                <div className="cargando-micro">
                  <div className="spinner-micro"></div>
                  <span>Cargando {getNombreCategoria(categoria).toLowerCase()}...</span>
                </div>
              ) : (
                <>
                  {renderMensajeSinCanciones()}
                  
                  {cancionesFiltradas.length > 0 && (
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
                </>
              )}
            </div>
          </div>

          <div className="panel-chords-maxi-expandido" ref={chordsContainerRef}>
            <div className="panel-info-cancion-micro compacto">
              {currentSong ? (
                <div className="info-cancion-nano-en-linea">
                  <SafeImage 
                    src={currentSong.imagen || getPortadaDefault(categoria)} 
                    fallbackSrc={getPortadaDefault(categoria)}
                    alt="Portada" 
                    className="portada-img-nano-en-linea"
                  />
                  <div className="detalles-nano-en-linea">
                    <div className="titulo-nano-en-linea">{currentSong.nombre}</div>
                    <div className="metadatos-nano-en-linea">
                      <span className="artista-nano-en-linea">{currentSong.artista}</span>
                      <span className="separador-nano">•</span>
                      <span className="album-nano-en-linea">{currentSong.album || getNombreCategoria(categoria)}</span>
                      <span className="separador-nano">•</span>
                      <span className="categoria-nano-en-linea categoria-badge">{getNombreCategoria(categoria)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sin-cancion-nano-en-linea">
                  <span className="icono-sin-cancion">{getIconoCategoria(categoria)}</span>
                  <span>
                    {categoria === 'homenajes' ? 'Selecciona un homenaje para ver los acordes' :
                     categoria === 'zapadas' ? 'Selecciona una sesión para ver los acordes' :
                     'Selecciona una canción para ver los acordes'}
                  </span>
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
                {isLoadingChords ? (
                  <div className="sin-chords-micro">
                    <div className="spinner-chords"></div>
                    <p>Cargando letra y acordes...</p>
                  </div>
                ) : datosChords ? (
                  <div className="chords-viewer-integrado-expandido">
                    <ChordsViewerIndex 
                      chordsData={datosChords}
                      transpositionProp={transposition}
                      songMetadata={{
                        coverImage: currentSong?.imagen,
                        album: currentSong?.album,
                        category: getNombreCategoria(categoria),
                        isHomenaje: categoria === 'homenajes',
                        isZapada: categoria === 'zapadas'
                      }}
                      compactMode="extreme"
                      autoExpand={autoExpandChords}
                    />
                  </div>
                ) : cancionConChords ? (
                  <div className="sin-chords-micro">
                    <div className="spinner-chords"></div>
                    <p>Cargando letra y acordes...</p>
                  </div>
                ) : (
                  <div className="instrucciones-chords-micro">
                    <div className="logo-titulo-micro">
                      <span className="icono-instrucciones">{getIconoCategoria(categoria)}</span>
                      <span className="titulo-instrucciones">
                        {categoria === 'homenajes' ? 'Homenajes Musicales' :
                         categoria === 'zapadas' ? 'Sesiones de Zapadas' :
                         'Rockola Cancioneros'}
                      </span>
                    </div>
                    
                    <div className="logo-animado-container-micro">
                      <SafeImage 
                        src={categoria === 'homenajes' ? '/img/Logo Almango pop Somprero 4.jpg' :
                             categoria === 'zapadas' ? '/img/300.jpg' :
                             '/img/02-logos/logo-formateo-chords.png'} 
                        fallbackSrc="/img/default-cover.png"
                        alt={getNombreCategoria(categoria)} 
                        className="logo-principal-instrucciones"
                      />
                    </div>
                    
                    <div className="logo-descripcion-micro">
                      <p className="descripcion-principal">
                        {categoria === 'homenajes' ? 'Selecciona un tributo musical para ver su letra completa con acordes' :
                         categoria === 'zapadas' ? 'Selecciona una sesión espontánea para ver su letra completa con acordes' :
                         'Selecciona una canción de la lista para ver su letra completa con acordes'}
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
              <FiList />
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
                    <div className="spinner-micro"></div>
                    <span>Cargando...</span>
                  </div>
                ) : error ? (
                  <div className="error-micro">
                    <span className="error-icono">⚠️</span>
                    <span className="error-texto">{error}</span>
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
              {isLoadingChords ? (
                <div className="sin-chords-micro">
                  <div className="spinner-chords"></div>
                  <p>Cargando letra y acordes...</p>
                </div>
              ) : datosChords ? (
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
                  <div className="spinner-chords"></div>
                    <p>Cargando letra y acordes...</p>
                </div>
              ) : (
                <div className="instrucciones-chords-micro-mobile">
                  <div className="logo-mobile-container">
                    <SafeImage 
                      src={categoria === 'homenajes' ? '/img/Logo Almango pop Somprero 4.jpg' :
                           categoria === 'zapadas' ? '/img/300.jpg' :
                           '/img/02-logos/logo-formateo-chords.png'} 
                      fallbackSrc="/img/default-cover.png"
                      alt={getNombreCategoria(categoria)} 
                      className="logo-mobile-instrucciones"
                    />
                  </div>
                  <p className="instrucciones-mobile-texto">
                    {categoria === 'homenajes' ? 'Selecciona un homenaje para ver los acordes' :
                     categoria === 'zapadas' ? 'Selecciona una zapada para ver los acordes' :
                     'Selecciona una canción para ver los acordes'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTACIÓN CON ERROR BOUNDARY
// ============================================
const MMusicaEscuchaWithErrorBoundary = () => (
  <ErrorBoundary>
    <MMusicaEscucha />
  </ErrorBoundary>
);

export default MMusicaEscuchaWithErrorBoundary;