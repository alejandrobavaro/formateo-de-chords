import React, { useState, useEffect, useRef } from 'react';
import SongSelector from './SongSelector';
import SongViewer from './SongViewer';
import Controls from './Controls';
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

// Lista de todos los archivos JSON disponibles
const SONG_LIBRARIES = [
  { 
    id: 'alegondra', 
    name: 'Ale Gondra', 
    path: '/data/cancionesalegondramusic.json',
    basePath: '/data/cancionesalegondramusic/' 
  },
  { 
    id: 'almangopop', 
    name: 'Almango Pop', 
    path: '/data/cancionesalmangopop.json',
    basePath: '/data/cancionesalmangopop/'  
  },
  { 
    id: 'casamiento', 
    name: 'Casamiento', 
    path: '/data/cancionescasamiento.json',
    basePath: '/data/cancionesshowcasamiento/'  
  },
  { 
    id: 'covers1', 
    name: 'Listado Covers Seleccionados 1', 
    path: '/data/listadochordscoversseleccionados1.json',
    basePath: '/data/cancionescoversseleccionados1/' 
  }, 
  { 
    id: 'covers2', 
    name: 'Listado Covers Seleccionados 2', 
    path: '/data/listadochordscoversseleccionados2.json',
    basePath: '/data/cancionescoversseleccionados2/' 
  }, 
  { 
    id: 'covers3', 
    name: 'Listado Covers Seleccionados 3', 
    path: '/data/listadochordscoversseleccionados3.json',
    basePath: '/data/cancionescoversseleccionados3/' 
  }, 
  { 
    id: 'coverslatinos1', 
    name: 'Listado Covers Latinos 1', 
    path: '/data/listadochordscoverslatinos1.json',
    basePath: '/data/cancionescoverslatinos1/' 
  }
];

const ChordsViewerIndex = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [fontSize, setFontSize] = useState(12);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState('casamiento');
  const [currentLibraryConfig, setCurrentLibraryConfig] = useState(SONG_LIBRARIES[0]);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const containerRef = useRef(null);

  // ========== FUNCIONES DE CARGA JSON ==========
  const fetchJsonFile = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) throw new Error('Archivo no encontrado (404)');
        throw new Error('La respuesta no es JSON');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error cargando ${path}:`, error);
      throw error;
    }
  };

  const loadIndividualSong = async (song, basePath = null) => {
    try {
      setLoading(true);
      setError(null);
      if (!song || !song.file) throw new Error('Datos de canción inválidos');

      const actualBasePath = basePath || currentLibraryConfig.basePath;
      const songPath = `${actualBasePath}${song.file}`;
      const response = await fetch(songPath);
      if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${song.file}`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`El archivo ${song.file} no es JSON válido`);
      }

      const songData = await response.json();
      setSelectedSong({ ...song, ...songData });
    } catch (err) {
      console.error('Error loading individual song:', err);
      setError(`Error cargando contenido: ${err.message}. Mostrando información básica.`);
      setSelectedSong({
        ...song,
        lyrics: song.lyrics || `⚠️ No se pudo cargar el contenido completo.\nError: ${err.message}`,
        chords: song.chords || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSongSelect = (song) => {
    if (song) loadIndividualSong(song);
  };

  const handleLibraryChange = (libraryId) => {
    setSelectedLibrary(libraryId);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
      setFullscreenMode(true);
    } else {
      document.exitFullscreen();
      setFullscreenMode(false);
    }
  };

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const library = SONG_LIBRARIES.find(lib => lib.id === selectedLibrary);
        if (!library) throw new Error('Listado de canciones no encontrado');

        setCurrentLibraryConfig(library);
        const data = await fetchJsonFile(library.path);

        let songsArray = [];
        if (data.songs) songsArray = data.songs;
        else if (data.albums) songsArray = data.albums.flatMap(album => album.songs);
        else throw new Error('Formato de JSON inválido');

        setSongs(songsArray);
        if (songsArray.length > 0) await loadIndividualSong(songsArray[0], library.basePath);
        else setSelectedSong(null);
      } catch (err) {
        console.error('Error loading songs:', err);
        setError(`Error cargando listado: ${err.message}`);
        setSongs([]);
        setSelectedSong(null);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, [selectedLibrary]);

  if (loading && !selectedSong) return <div className="chords-loading">Cargando canciones...</div>;
  if (error) return (
    <div className="chords-error">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">Reintentar</button>
    </div>
  );

  return (
    <div className="chords-viewer-unificado-container" ref={containerRef}>
      <button className="fullscreen-toggle-btn" onClick={toggleFullscreen}>
        {fullscreenMode ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      <div className="chords-header">
        <div className="header-top-row">
          {/* BOTONES DE LISTAS PERMANENTES - REEMPLAZO DEL SELECT */}
          <div className="library-buttons-container">
            <div className="library-buttons-grid">
              {SONG_LIBRARIES.map(library => (
                <button
                  key={library.id}
                  className={`library-button ${selectedLibrary === library.id ? 'active' : ''}`}
                  onClick={() => handleLibraryChange(library.id)}
                  title={library.name}
                >
                  <span className="library-button-text">{library.name}</span>
                  {selectedLibrary === library.id && (
                    <span className="library-button-indicator">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SongSelector con barra de búsqueda */}
          <SongSelector
            songs={songs}
            selectedSong={selectedSong}
            onSelectSong={handleSongSelect}
          />
        </div>

        <Controls
          fontSize={fontSize}
          setFontSize={setFontSize}
          transposition={transposition}
          setTransposition={setTransposition}
          showA4Outline={showA4Outline}
          setShowA4Outline={setShowA4Outline}
        />
      </div>

      <div className="chords-content">
        {selectedSong ? (
          <SongViewer
            song={selectedSong}
            fontSize={fontSize}
            setFontSize={setFontSize}
            transposition={transposition}
            showA4Outline={showA4Outline}
            fullscreenMode={fullscreenMode}
          />
        ) : (
          !loading && (
            <div className="no-songs-message">
              <p>No hay canciones disponibles en este listado.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChordsViewerIndex;