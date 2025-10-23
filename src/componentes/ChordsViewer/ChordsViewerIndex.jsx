// src/componentes/ChordsViewer/ChordsViewerIndex.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsArrowsFullscreen, BsFullscreenExit, BsMusicNoteBeamed } from "react-icons/bs";
import SongViewer from './SongViewer';
import Controls from './Controls';
import ListNavigator from './ListNavigator';
import PrintViewer from './Formats/PrintViewer';
import { useSearch } from '../SearchContext';
import { useContentAnalyzer } from './ContentAnalyzer';
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

const ChordsViewerIndex = () => {
  // ESTADOS DEL COMPONENTE
  const [selectedSong, setSelectedSong] = useState(null);
  const [songDetails, setSongDetails] = useState(null);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);

  // HOOKS Y REFERENCIAS
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const analysis = useContentAnalyzer(selectedSong);
  
  // USAR CONTEXTO DE BÚSQUEDA
  const { 
    librariesData, 
    getSongNavigationPath, 
    getSongByLibraryAndFile,
    isLoading: contextLoading 
  } = useSearch();

  // FUNCIÓN PARA CARGAR UNA CANCIÓN INDIVIDUAL
  const loadIndividualSong = async (song, basePath, libraryId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!song || !song.file) {
        throw new Error('Datos de canción inválidos');
      }

      const songPath = `${basePath}${song.file}`;
      console.log(`🎵 Cargando canción individual: ${songPath}`);
      
      const response = await fetch(songPath);
      
      if (!response.ok) {
        throw new Error(`No se pudo cargar: ${song.file} (${response.status})`);
      }

      const songData = await response.json();
      console.log(`✅ Canción cargada: ${song.title}`, songData);
      
      // AGREGAR INFORMACIÓN DE BIBLIOTECA A LA CANCIÓN
      const songWithLibrary = { 
        ...song, 
        ...songData,
        libraryId: libraryId,
        libraryName: song.libraryName || 'Lista',
        basePath: basePath
      };
      
      setSelectedSong(songWithLibrary);
      setSongDetails(songData);
      
      console.log(`🎯 Canción configurada en estado:`, songWithLibrary);
      
    } catch (err) {
      console.error('❌ Error cargando canción individual:', err);
      setError(`Error: ${err.message}`);
      setSelectedSong(null);
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN PARA CAMBIAR DE CANCIÓN DESDE EL NAVEGADOR
  const handleSongChange = async (newSong) => {
    if (!newSong) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Cambiando a canción:`, newSong);
      
      const songPath = `${newSong.basePath}${newSong.file}`;
      const response = await fetch(songPath);
      
      if (!response.ok) {
        throw new Error(`No se pudo cargar: ${newSong.file}`);
      }
      
      const songData = await response.json();
      
      // AGREGAR INFORMACIÓN DE BIBLIOTECA
      const songWithLibrary = { 
        ...newSong, 
        ...songData,
        libraryId: newSong.libraryId,
        libraryName: newSong.libraryName,
        basePath: newSong.basePath
      };
      
      setSelectedSong(songWithLibrary);
      setSongDetails(songData);
      
      // ACTUALIZAR URL SIN RECARGAR PÁGINA COMPLETA
      const encodedSongFile = encodeURIComponent(newSong.file);
      navigate(`/chords-viewer?library=${newSong.libraryId}&song=${encodedSongFile}`, { replace: true });
      
      console.log(`✅ Canción cambiada exitosamente: ${newSong.title}`);
      
    } catch (err) {
      console.error('❌ Error cambiando canción:', err);
      setError(`Error al cargar: ${newSong.title}`);
    } finally {
      setLoading(false);
    }
  };

  // EFECTO PARA CARGAR CANCIÓN DESDE LOS PARÁMETROS DE LA URL
  useEffect(() => {
    const loadSongFromURL = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const urlParams = new URLSearchParams(location.search);
        const libraryParam = urlParams.get('library');
        const songFileParam = urlParams.get('song');
        
        console.log('🔍 Parámetros URL:', { libraryParam, songFileParam });
        
        if (!libraryParam || !songFileParam) {
          console.log('ℹ️ No hay parámetros de canción en la URL - Mostrando estado vacío');
          setLoading(false);
          return;
        }

        // DECODIFICAR EL NOMBRE DEL ARCHIVO
        const decodedSongFile = decodeURIComponent(songFileParam);
        console.log(`📁 Archivo decodificado: ${decodedSongFile}`);

        // BUSCAR CANCIÓN EN EL CONTEXTO
        const targetSong = getSongByLibraryAndFile(libraryParam, decodedSongFile);
        
        if (targetSong) {
          console.log(`🎯 Canción encontrada en contexto:`, targetSong);
          await loadIndividualSong(targetSong, targetSong.basePath, libraryParam);
        } else {
          console.log('❌ Canción no encontrada en contexto, intentando carga manual...');
          
          // INTENTAR CARGA MANUAL SI NO ESTÁ EN EL CONTEXTO
          const libraryData = librariesData[libraryParam];
          if (libraryData) {
            let manualSong = null;
            
            // BUSCAR EN ÁLBUMES
            if (libraryData.albums && libraryData.albums.length > 0) {
              for (const album of libraryData.albums) {
                manualSong = album.songs?.find(song => song.file === decodedSongFile);
                if (manualSong) {
                  manualSong = {
                    ...manualSong,
                    libraryId: libraryParam,
                    libraryName: libraryData.name,
                    basePath: libraryData.basePath,
                    albumId: album.album_id,
                    albumName: album.album_name
                  };
                  break;
                }
              }
            }
            
            // BUSCAR EN CANCIONES DIRECTAS
            if (!manualSong && libraryData.songs && libraryData.songs.length > 0) {
              manualSong = libraryData.songs.find(song => song.file === decodedSongFile);
              if (manualSong) {
                manualSong = {
                  ...manualSong,
                  libraryId: libraryParam,
                  libraryName: libraryData.name,
                  basePath: libraryData.basePath
                };
              }
            }
            
            if (manualSong) {
              console.log(`✅ Canción encontrada manualmente:`, manualSong);
              await loadIndividualSong(manualSong, libraryData.basePath, libraryParam);
            } else {
              throw new Error(`Canción no encontrada: ${decodedSongFile}`);
            }
          } else {
            throw new Error(`Biblioteca no encontrada: ${libraryParam}`);
          }
        }
      } catch (err) {
        console.error('💥 Error cargando canción desde URL:', err);
        setError(`Error: ${err.message}`);
        setSelectedSong(null);
      } finally {
        setLoading(false);
      }
    };

    // CARGAR CANCIÓN CUANDO LOS DATOS DEL CONTEXTO ESTÉN LISTOS O CUANDO CAMBIE LA URL
    if (!contextLoading) {
      loadSongFromURL();
    }
  }, [location.search, librariesData, contextLoading, getSongByLibraryAndFile]);

  // FUNCIÓN PARA OBTENER METADATOS DE LA CANCIÓN
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

  // FUNCIÓN PARA ACTIVAR/DESACTIVAR PANTALLA COMPLETA
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
      setFullscreenMode(true);
    } else {
      document.exitFullscreen();
      setFullscreenMode(false);
    }
  };

  // FUNCIONES DE EXPORTACIÓN
  const handleExportPDF = async () => {
    console.log('Exportar PDF - Función por implementar');
  };

  const handleExportJPG = async () => {
    console.log('Exportar JPG - Función por implementar');
  };

  const handlePrint = () => {
    window.print();
  };

  // ESTADO DE CARGA INICIAL
  if (contextLoading) {
    return (
      <div className="chords-loading">
        <BsMusicNoteBeamed />
        <p>Cargando bibliotecas musicales...</p>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    );
  }

  if (loading && !selectedSong) {
    return (
      <div className="chords-loading">
        <BsMusicNoteBeamed />
        <p>Cargando canción...</p>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    );
  }
  
  // MANEJO DE ERRORES
  if (error) {
    return (
      <div className="chords-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  // OBTENER METADATOS PARA MOSTRAR
  const metadata = getSongMetadata();

  return (
    <div className="chords-viewer-integrated" ref={containerRef}>
      
      {/* BOTÓN DE PANTALLA COMPLETA */}
      <button className="fullscreen-toggle-btn" onClick={toggleFullscreen}>
        {fullscreenMode ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="unified-container">
        
        {/* HEADER CON TÍTULO */}
        <div className="main-header">
          <div className="header-title-section">
            <BsMusicNoteBeamed className="title-icon" />
            <h1>Visualizador de Acordes Inteligente</h1>
          </div>
        </div>

        {/* NAVEGADOR DE LISTA - DEBE MOSTRARSE SI HAY CANCIÓN SELECCIONADA */}
        {selectedSong && (
          <div className="navigator-section">
            <ListNavigator 
              currentSong={selectedSong}
              onSongChange={handleSongChange}
            />
          </div>
        )}

        {/* FILA DE CONTROLES E INFORMACIÓN */}
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
                      {selectedSong.libraryName && (
                        <span className="metadata-item">
                          <strong>Lista:</strong> {selectedSong.libraryName}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <h2 className="no-song-title">Selecciona una canción desde la biblioteca</h2>
            )}
          </div>
          
          {/* CONTROLES DE TRANSPOSICIÓN Y EXPORTACIÓN */}
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

        {/* ÁREA DE VISUALIZACIÓN DE LA CANCIÓN */}
        <div className="viewer-area">
          <SongViewer
            song={selectedSong}
            transposition={transposition}
            showA4Outline={showA4Outline}
            fullscreenMode={fullscreenMode}
          />
        </div>

      </div>

      {/* VISUALIZADOR DE IMPRESIÓN (OCULTO POR DEFECTO) */}
      <div className="print-container">
        {selectedSong && analysis && (
          <PrintViewer 
            song={selectedSong}
            transposition={transposition}
            analysis={analysis}
          />
        )}
      </div>

    </div>
  );
};

export default ChordsViewerIndex;