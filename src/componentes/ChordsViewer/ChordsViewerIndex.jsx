// ======================================================
// VISUALIZADOR DE ACORDES - COMPONENTE OPTIMIZADO
// ======================================================

// 📦 IMPORTACIONES DE REACT Y DEPENDENCIAS
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BsArrowsFullscreen, BsFullscreenExit, BsMusicNoteBeamed } from "react-icons/bs";
import SongViewer from './SongViewer';
import Controls from './Controls';
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

// 🗂️ BIBLIOTECAS DE CANCIONES DISPONIBLES
// Cada biblioteca tiene: ID único, nombre para mostrar, ruta al listado JSON y ruta base de las canciones
const SONG_LIBRARIES = [
  { id: 'alegondra', name: 'Ale Gondra', path: '/data/listadocancionesalegondramusic.json', basePath: '/data/cancionesalegondramusic/' },
  { id: 'almangopop', name: 'Almango Pop', path: '/data/listadocancionesalmangopop.json', basePath: '/data/cancionesalmangopop/' },
  { id: 'casamiento', name: 'Casamiento', path: '/data/listadocancionescasamiento.json', basePath: '/data/cancionesshowcasamiento/' },
  { id: 'covers1', name: 'Covers 1', path: '/data/listadochordscoversseleccionados1.json', basePath: '/data/cancionescoversseleccionados1/' },
  // ✅ BIBLIOTECA AGREGADA: COVERS 2 - Esta es la que faltaba!
  { id: 'covers2', name: 'Covers 2', path: '/data/listadochordscoversseleccionados2.json', basePath: '/data/cancionescoversseleccionados2/' },
  { id: 'covers3', name: 'Covers 3', path: '/data/listadochordscoversseleccionados3.json', basePath: '/data/cancionescoversseleccionados3/' },
  { id: 'coverslatinos1', name: 'Latinos', path: '/data/listadochordscoverslatinos1.json', basePath: '/data/cancionescoverslatinos1/' },
  { id: 'coversnacionales1', name: 'Nacionales', path: '/data/listadochordscoversnacionales1.json', basePath: '/data/cancionescoversnacionales1/' },
];

// 🎵 COMPONENTE PRINCIPAL DEL VISUALIZADOR DE ACORDES
const ChordsViewerIndex = () => {
  // 🔄 ESTADOS DEL COMPONENTE
  const [selectedSong, setSelectedSong] = useState(null);          // Canción seleccionada actualmente
  const [songDetails, setSongDetails] = useState(null);            // Detalles completos de la canción
  const [transposition, setTransposition] = useState(0);           // Nivel de transposición (semitones)
  const [showA4Outline, setShowA4Outline] = useState(false);       // Mostrar outline A4 para impresión
  const [loading, setLoading] = useState(true);                    // Estado de carga
  const [error, setError] = useState(null);                        // Mensaje de error
  const [fullscreenMode, setFullscreenMode] = useState(false);     // Modo pantalla completa
  const [currentLibrary, setCurrentLibrary] = useState('');        // Biblioteca actual

  // 🎯 HOOKS Y REFERENCIAS
  const location = useLocation();                                  // Hook para acceder a la ubicación URL
  const containerRef = useRef(null);                               // Referencia al contenedor principal
  const printViewRef = useRef(null);                               // Referencia para la vista de impresión

  // 📥 FUNCIÓN PARA CARGAR ARCHIVOS JSON
  const fetchJsonFile = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error cargando ${path}:`, error);
      throw error;
    }
  };

  // 🎼 FUNCIÓN PARA CARGAR UNA CANCIÓN INDIVIDUAL
  const loadIndividualSong = async (song, basePath, libraryId) => {
    try {
      setLoading(true);
      setError(null);
      if (!song || !song.file) throw new Error('Datos inválidos');

      const songPath = `${basePath}${song.file}`;
      const response = await fetch(songPath);
      if (!response.ok) throw new Error(`No se pudo cargar: ${song.file}`);

      const songData = await response.json();
      setSelectedSong({ ...song, ...songData });
      setSongDetails(songData);
      
      // 📚 Establecer la biblioteca actual basada en el ID
      const library = SONG_LIBRARIES.find(lib => lib.id === libraryId);
      setCurrentLibrary(library ? library.name : '');
      
    } catch (err) {
      console.error('Error:', err);
      setError(`Error: ${err.message}`);
      setSelectedSong({
        ...song,
        lyrics: `⚠️ Error: ${err.message}`,
        chords: ''
      });
    } finally {
      setLoading(false);
    }
  };

  // 📋 FUNCIÓN PARA OBTENER METADATOS DE LA CANCIÓN
  const getSongMetadata = () => {
    if (!songDetails) return null;
    
    return {
      originalKey: songDetails.originalKey || selectedSong?.key || 'N/A',
      tempo: songDetails.tempo || 'N/A',
      timeSignature: songDetails.timeSignature || 'N/A',
      genre: songDetails.genre || 'N/A',
      duration: songDetails.duration || 'N/A'
    };
  };

  // 🖥️ FUNCIÓN PARA ACTIVAR/DESACTIVAR PANTALLA COMPLETA
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
      setFullscreenMode(true);
    } else {
      document.exitFullscreen();
      setFullscreenMode(false);
    }
  };

  // 🖨️ FUNCIONES DE EXPORTACIÓN (POR IMPLEMENTAR)
  const handleExportPDF = async () => {
    // ... implementación futura para exportar a PDF
  };

  const handleExportJPG = async () => {
    // ... implementación futura para exportar a JPG
  };

  const handlePrint = () => {
    window.print();
  };

  // ⚡ EFECTO PARA CARGAR CANCIÓN DESDE LOS PARÁMETROS DE LA URL
  useEffect(() => {
    const loadSongFromURL = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 📝 Obtener parámetros de la URL
        const urlParams = new URLSearchParams(location.search);
        const libraryParam = urlParams.get('library');
        const songFileParam = urlParams.get('song');
        
        if (!libraryParam || !songFileParam) {
          setLoading(false);
          return;
        }

        // 🔍 Buscar la biblioteca correspondiente
        const library = SONG_LIBRARIES.find(lib => lib.id === libraryParam);
        if (!library) throw new Error('Biblioteca no encontrada');

        // 📦 Cargar el listado de canciones de la biblioteca
        const data = await fetchJsonFile(library.path);
        let songsArray = [];
        
        // 📋 Procesar diferentes formatos de listados
        if (data.songs) songsArray = data.songs;
        else if (data.albums) songsArray = data.albums.flatMap(album => album.songs);
        else throw new Error('Formato inválido');

        // 🎯 Buscar la canción específica
        const decodedSongFile = decodeURIComponent(songFileParam);
        const targetSong = songsArray.find(song => song.file === decodedSongFile);
        
        if (targetSong) {
          await loadIndividualSong(targetSong, library.basePath, libraryParam);
        } else {
          throw new Error('Canción no encontrada');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(`Error: ${err.message}`);
        setSelectedSong(null);
      } finally {
        setLoading(false);
      }
    };

    loadSongFromURL();
  }, [location.search]);

  // ⏳ ESTADO DE CARGA INICIAL
  if (loading && !selectedSong) return <div className="chords-loading">Cargando...</div>;
  
  // ❌ MANEJO DE ERRORES
  if (error) return (
    <div className="chords-error">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">Reintentar</button>
    </div>
  );

  // 📊 OBTENER METADATOS PARA MOSTRAR
  const metadata = getSongMetadata();

  // 🎨 RENDERIZADO DEL COMPONENTE
  return (
    <div className="chords-viewer-integrated" ref={containerRef}>
      
      {/* 🔲 BOTÓN DE PANTALLA COMPLETA */}
      <button className="fullscreen-toggle-btn" onClick={toggleFullscreen}>
        {fullscreenMode ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* 📦 CONTENEDOR PRINCIPAL */}
      <div className="unified-container">
        
        {/* 🏷️ HEADER CON TÍTULO */}
        <div className="main-header">
          <div className="header-title-section">
            <BsMusicNoteBeamed className="title-icon" />
            <h1>Visualizador de Chords</h1>
          </div>
        </div>

        {/* 🎛️ FILA DE CONTROLES E INFORMACIÓN */}
        <div className="controls-row">
          <div className="song-info">
            {selectedSong ? (
              <div className="song-details-header">
                <h2 className="song-title-display">
                  {selectedSong.artist} - {selectedSong.title}
                </h2>
                <div className="song-metadata">
                  {metadata && (
                    <>
                      <span className="metadata-item">
                        <strong>Tono:</strong> {metadata.originalKey}
                      </span>
                      <span className="metadata-item">
                        <strong>Tempo:</strong> {metadata.tempo}
                      </span>
                      <span className="metadata-item">
                        <strong>Compás:</strong> {metadata.timeSignature}
                      </span>
                      {currentLibrary && (
                        <span className="metadata-item">
                          <strong>Lista:</strong> {currentLibrary}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <h2 className="no-song-title">Selecciona una canción</h2>
            )}
          </div>
          
          {/* 🎚️ CONTROLES DE TRANSPOSICIÓN Y EXPORTACIÓN */}
          <div className="controls-container">
            <Controls
              transposition={transposition}
              setTransposition={setTransposition}
              showA4Outline={showA4Outline}
              setShowA4Outline={setShowA4Outline}
              onExportPDF={handleExportPDF}
              onExportJPG={handleExportJPG}
              onPrint={handlePrint}
              hasSelectedSong={!!selectedSong}
            />
          </div>
        </div>

        {/* 👁️ ÁREA DE VISUALIZACIÓN DE LA CANCIÓN */}
        <div className="viewer-area">
          {selectedSong ? (
            <SongViewer
              song={selectedSong}
              transposition={transposition}
              showA4Outline={showA4Outline}
              fullscreenMode={fullscreenMode}
              printViewRef={printViewRef}
            />
          ) : (
            <div className="no-song-message">
              <div className="welcome-content">
                <h2>Visualizador de Acordes</h2>
                <p>Selecciona una canción desde la galería</p>
                <div className="instruction-box">
                  <span>Ve a la biblioteca y elige una canción</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ChordsViewerIndex;