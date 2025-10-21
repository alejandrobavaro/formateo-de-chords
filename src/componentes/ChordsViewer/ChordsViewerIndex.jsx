// src/componentes/ChordsViewer/ChordsViewerIndex.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BsArrowsFullscreen, BsFullscreenExit, BsMusicNoteBeamed } from "react-icons/bs";
import SongViewer from './SongViewer';
import Controls from './Controls';
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

// BIBLIOTECAS DE CANCIONES DISPONIBLES
const SONG_LIBRARIES = [
  // MÚSICA ORIGINAL
  { 
    id: 'alegondra', 
    name: 'Ale Gondra', 
    path: '/listado-chords-alegondramusic.json', 
    basePath: '/data/01-chords-musica-original/chords-alegondramusic/' 
  },
  { 
    id: 'almangopop', 
    name: 'Almango Pop', 
    path: '/listado-chords-almango-pop.json', 
    basePath: '/data/01-chords-musica-original/chords-almangopop/' 
  },
  
  // SHOWS ESPECÍFICOS
  { 
    id: 'casamiento', 
    name: 'Casamiento', 
    path: '/listado-chords-casamiento-ale-fabi.json', 
    basePath: '/data/03-chords-de-shows-por-listados/chords-show-casamiento-ale-fabi/' 
  },
  
  // COVERS ORGANIZADOS POR GÉNERO
  { 
    id: 'covers-baladasespanol', 
    name: 'Baladas Español', 
    path: '/data/02-chords-covers/listadocancionescovers-baladasespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-baladasespanol/' 
  },
  { 
    id: 'covers-baladasingles', 
    name: 'Baladas Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-baladasingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-baladasingles/' 
  },
  { 
    id: 'covers-poprockespanol', 
    name: 'Pop Rock Español', 
    path: '/data/02-chords-covers/listadocancionescovers-poprockespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-poprockespanol/' 
  },
  { 
    id: 'covers-poprockingles', 
    name: 'Pop Rock Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-poprockingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-poprockingles/' 
  },
  { 
    id: 'covers-latinobailableespanol', 
    name: 'Latino Bailable', 
    path: '/data/02-chords-covers/listadocancionescovers-latinobailableespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-latinobailableespanol/' 
  },
  { 
    id: 'covers-rockbailableespanol', 
    name: 'Rock Bailable Español', 
    path: '/data/02-chords-covers/listadocancionescovers-rockbailableespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-rockbailableespanol/' 
  },
  { 
    id: 'covers-rockbailableingles', 
    name: 'Rock Bailable Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-rockbailableingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-rockbailableingles/' 
  },
  { 
    id: 'covers-hardrock-punkespanol', 
    name: 'Hard Rock/Punk Español', 
    path: '/data/02-chords-covers/listadocancionescovers-hardrock-punkespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-hardrock-punkespanol/' 
  },
  { 
    id: 'covers-hardrock-punkingles', 
    name: 'Hard Rock/Punk Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-hardrock-punkingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-hardrock-punkingles/' 
  },
  { 
    id: 'covers-discoingles', 
    name: 'Disco Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-discoingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-discoingles/' 
  },
  { 
    id: 'covers-reggaeingles', 
    name: 'Reggae Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-reggaeingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-reggaeingles/' 
  },
  { 
    id: 'covers-festivos-bso', 
    name: 'Festivos & BSO', 
    path: '/data/02-chords-covers/listadocancionescovers-festivos-bso.json', 
    basePath: '/data/02-chords-covers/cancionescovers-festivos-bso/' 
  }
];

const ChordsViewerIndex = () => {
  // ESTADOS DEL COMPONENTE
  const [selectedSong, setSelectedSong] = useState(null);
  const [songDetails, setSongDetails] = useState(null);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [currentLibrary, setCurrentLibrary] = useState('');

  // HOOKS Y REFERENCIAS
  const location = useLocation();
  const containerRef = useRef(null);
  const printViewRef = useRef(null);

  // FUNCIÓN PARA CARGAR ARCHIVOS JSON
  const fetchJsonFile = async (path) => {
    try {
      console.log(`📥 Intentando cargar: ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} - ${path}`);
      }
      
      const text = await response.text();
      
      if (!text.trim()) {
        throw new Error(`Archivo vacío - ${path}`);
      }
      
      try {
        const data = JSON.parse(text);
        console.log(`✅ JSON cargado correctamente: ${path}`);
        return data;
      } catch (parseError) {
        console.error(`❌ Error parseando JSON en ${path}:`, parseError);
        throw new Error(`JSON inválido en ${path}: ${parseError.message}`);
      }
    } catch (error) {
      console.error(`💥 Error cargando ${path}:`, error);
      throw error;
    }
  };

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
      
      setSelectedSong({ ...song, ...songData });
      setSongDetails(songData);
      
      const library = SONG_LIBRARIES.find(lib => lib.id === libraryId);
      setCurrentLibrary(library ? library.name : '');
      
    } catch (err) {
      console.error('❌ Error cargando canción individual:', err);
      setError(`Error: ${err.message}`);
      setSelectedSong({
        ...song,
        lyrics: `⚠️ Error cargando la canción: ${err.message}`,
        chords: ''
      });
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
          console.log('ℹ️ No hay parámetros de canción en la URL');
          setLoading(false);
          return;
        }

        const library = SONG_LIBRARIES.find(lib => lib.id === libraryParam);
        if (!library) {
          throw new Error(`Biblioteca no encontrada: ${libraryParam}`);
        }

        console.log(`📚 Biblioteca encontrada: ${library.name}`);

        // CARGAR EL LISTADO DE LA BIBLIOTECA
        const data = await fetchJsonFile(library.path);
        let songsArray = [];
        
        if (data.songs) {
          songsArray = data.songs;
        } else if (data.albums) {
          songsArray = data.albums.flatMap(album => album.songs || []);
        } else {
          throw new Error('Formato de biblioteca inválido');
        }

        console.log(`🎵 Total de canciones en biblioteca: ${songsArray.length}`);

        const decodedSongFile = decodeURIComponent(songFileParam);
        const targetSong = songsArray.find(song => song.file === decodedSongFile);
        
        if (targetSong) {
          console.log(`🎯 Canción encontrada: ${targetSong.title}`);
          await loadIndividualSong(targetSong, library.basePath, libraryParam);
        } else {
          throw new Error(`Canción no encontrada: ${decodedSongFile}`);
        }
      } catch (err) {
        console.error('💥 Error cargando canción desde URL:', err);
        setError(`Error: ${err.message}`);
        setSelectedSong(null);
      } finally {
        setLoading(false);
      }
    };

    loadSongFromURL();
  }, [location.search]);

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
  if (loading && !selectedSong) {
    return (
      <div className="chords-loading">
        <BsMusicNoteBeamed />
        <p>Cargando canción...</p>
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
            printViewRef={printViewRef}
          />
        </div>

      </div>

    </div>
  );
};

export default ChordsViewerIndex;