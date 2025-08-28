import React, { useState, useEffect } from 'react';
import SongSelector from './SongSelector';
import SongViewer from './SongViewer';
import Controls from './Controls';
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

// Lista de todos los archivos JSON disponibles
const SONG_LIBRARIES = [
  { 
    id: 'alegondra', 
    name: 'Chords Discos - Ale Gondra Music', 
    path: '/data/cancionesalegondramusic.json',
    basePath: '/data/cancionesalegondramusic/' 
  },
  { 
    id: 'almangopop', 
    name: 'Chords Discos - Almango Pop Music', 
    path: '/data/cancionesalmangopop.json',
    basePath: '/data/cancionesalmangopop/'  
  },
   { 
    id: 'casamiento', 
    name: 'Chords - Set List Casamiento', 
    path: '/data/cancionescasamiento.json',
    basePath: '/data/cancionesshowcasamiento/'  
  },
  { 
    id: 'covers1', 
    name: 'Chords - Covers Seleccionados 1', 
    path: '/data/listadochordscoversseleccionados1.json',
    basePath: '/data/cancionescoversseleccionados1/' 
  }, 
  { 
    id: 'covers2', 
    name: 'Chords - Covers Seleccionados 2', 
    path: '/data/listadochordscoversseleccionados2.json',
    basePath: '/data/cancionescoversseleccionados2/' 
  }

];

const ChordsViewerIndex = () => {
  // ========== ESTADOS DEL COMPONENTE ==========
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState('casamiento');
  const [showLibrarySelector, setShowLibrarySelector] = useState(false);
  const [currentLibraryConfig, setCurrentLibraryConfig] = useState(SONG_LIBRARIES[0]);

  // ========== FUNCIÓN PARA CARGAR ARCHIVOS JSON ==========
  const fetchJsonFile = async (path) => {
    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error('Archivo no encontrado (404)');
        }
        throw new Error('La respuesta no es JSON');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error cargando ${path}:`, error);
      throw error;
    }
  };

  // ========== EFECTO PARA CARGAR CANCIONES ==========
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const library = SONG_LIBRARIES.find(lib => lib.id === selectedLibrary);
        if (!library) {
          throw new Error('Listado de canciones no encontrado');
        }
        
        setCurrentLibraryConfig(library);
        console.log(`Cargando listado: ${library.path}`);
        
        const data = await fetchJsonFile(library.path);
        
        let songsArray = [];
        if (data.songs) {
          // Estructura antigua: { songs: [...] }
          songsArray = data.songs;
          console.log(`Encontradas ${songsArray.length} canciones en estructura antigua`);
        } else if (data.albums) {
          // Estructura nueva: { albums: [ { songs: [...] } ] }
          songsArray = data.albums.flatMap(album => album.songs);
          console.log(`Encontradas ${songsArray.length} canciones en estructura nueva`);
        } else {
          throw new Error('Formato de JSON inválido. No tiene "songs" ni "albums"');
        }
        
        setSongs(songsArray);
        
        // Cargar la primera canción si existe
        if (songsArray.length > 0) {
          await loadIndividualSong(songsArray[0], library.basePath);
        } else {
          setSelectedSong(null);
        }
        
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

  // ========== FUNCIÓN PARA CARGAR CANCIÓN INDIVIDUAL ==========
  const loadIndividualSong = async (song, basePath = null) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!song || !song.file) {
        throw new Error('Datos de canción inválidos');
      }
      
      // Usar la basePath proporcionada o la de la librería actual
      const actualBasePath = basePath || currentLibraryConfig.basePath;
      const songPath = `${actualBasePath}${song.file}`;
      
      console.log(`Cargando canción individual: ${songPath}`);
      
      const response = await fetch(songPath);
      
      if (!response.ok) {
        throw new Error(`No se pudo cargar el archivo: ${song.file}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Respuesta no JSON:', text.substring(0, 200));
        throw new Error(`El archivo ${song.file} no es JSON válido`);
      }
      
      const songData = await response.json();
      
      // Combinar datos básicos del índice con datos completos del archivo individual
      const completeSongData = {
        ...song,          // Datos del índice (id, title, artist, etc.)
        ...songData       // Datos completos del archivo individual (lyrics, chords, etc.)
      };
      
      setSelectedSong(completeSongData);
      console.log('Canción cargada exitosamente:', completeSongData.title);
      
    } catch (err) {
      console.error('Error loading individual song:', err);
      
      // Si falla la carga individual, mostrar error pero mantener los datos básicos
      setError(`Error cargando contenido: ${err.message}. Mostrando información básica.`);
      
      // Usar solo los datos básicos del índice
      setSelectedSong({
        ...song,
        lyrics: song.lyrics || `⚠️ No se pudo cargar el contenido completo.\nError: ${err.message}`,
        chords: song.chords || ''
      });
    } finally {
      setLoading(false);
    }
  };

  // ========== MANEJADOR DE SELECCIÓN DE CANCIÓN ==========
  const handleSongSelect = (song) => {
    if (song) {
      loadIndividualSong(song);
    }
  };

  // ========== MANEJO DE CAMBIOS DE LISTADO ==========
  const handleLibraryChange = (libraryId) => {
    setSelectedLibrary(libraryId);
    setShowLibrarySelector(false);
  };

  const toggleLibrarySelector = () => {
    setShowLibrarySelector(!showLibrarySelector);
  };

  // ========== RENDERIZADO DE ESTADOS ==========
  if (loading && !selectedSong) {
    return <div className="chords-loading">Cargando canciones...</div>;
  }

  if (error) {
    return (
      <div className="chords-error">
        <h3>Error</h3>
        <p>{error}</p>
        <div className="error-help">
          <p>Verifica que:</p>
          <ul>
            <li>Los archivos JSON individuales existan en las carpetas correctas</li>
            <li>Las rutas de los archivos en el JSON principal sean correctas</li>
            <li>Los archivos JSON tengan formato válido</li>
          </ul>
          <p>Estructura esperada:</p>
          <ul>
            <li><strong>Covers/Casamiento:</strong> <code>public/data/cancionesshowcasamiento/archivo.json</code></li>
            <li><strong>Almango Pop:</strong> <code>public/data/cancionesalmangopop/archivo.json</code></li>
            <li><strong>Ale Gondra:</strong> <code>public/data/cancionesalegondramusic/archivo.json</code></li>
          </ul>
        </div>
        <button onClick={() => window.location.reload()} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  // ========== RENDERIZADO PRINCIPAL ==========
  return (
    <div className="chords-viewer-container">
      <div className="chords-header">
        <h1>Visualizador de Acordes y Canciones</h1>
        
        <div className="library-selector-container">
          <button className="library-selector-toggle" onClick={toggleLibrarySelector}>
            {SONG_LIBRARIES.find(lib => lib.id === selectedLibrary)?.name || 'Seleccionar Listado'}
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {showLibrarySelector && (
            <div className="library-selector-dropdown">
              {SONG_LIBRARIES.map(library => (
                <button
                  key={library.id}
                  className={`library-option ${selectedLibrary === library.id ? 'active' : ''}`}
                  onClick={() => handleLibraryChange(library.id)}
                >
                  {library.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="chords-controls-top">
          <SongSelector 
            songs={songs} 
            selectedSong={selectedSong} 
            onSelectSong={handleSongSelect} 
          />
          <Controls
            fontSize={fontSize}
            setFontSize={setFontSize}
            transposition={transposition}
            setTransposition={setTransposition}
            showA4Outline={showA4Outline}
            setShowA4Outline={setShowA4Outline}
          />
        </div>
      </div>
      
      <div className="chords-content">
        {selectedSong ? (
          <SongViewer
            song={selectedSong}
            fontSize={fontSize}
            transposition={transposition}
            showA4Outline={showA4Outline}
          />
        ) : (
          !loading && (
            <div className="no-songs-message">
              <p>No hay canciones disponibles en este listado.</p>
              <p>Selecciona otro listado o verifica los archivos.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChordsViewerIndex;