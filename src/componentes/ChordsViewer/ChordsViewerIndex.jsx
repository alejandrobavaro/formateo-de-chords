// ======================================================
// COMPONENTE PRINCIPAL - SEARCHBAR ARRIBA DE BIBLIOTECAS
// ======================================================
import React, { useState, useEffect, useRef } from 'react';
import SongSelector from './SongSelector';
import SongViewer from './SongViewer';
import Controls from './Controls';
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

// ======================================================
// LISTA DE BIBLIOTECAS DISPONIBLES
// ======================================================
const SONG_LIBRARIES = [
  { id: 'alegondra', name: 'Ale Gondra', path: '/data/listadocancionesalegondramusic.json', basePath: '/data/cancionesalegondramusic/' },
  { id: 'almangopop', name: 'Almango Pop', path: '/data/listadocancionesalmangopop.json', basePath: '/data/cancionesalmangopop/' },
  { id: 'casamiento', name: 'Casamiento', path: '/data/listadocancionescasamiento.json', basePath: '/data/cancionesshowcasamiento/' },
  { id: 'covers1', name: 'Covers 1', path: '/data/listadochordscoversseleccionados1.json', basePath: '/data/cancionescoversseleccionados1/' },
  { id: 'covers2', name: 'Covers 2', path: '/data/listadochordscoversseleccionados2.json', basePath: '/data/cancionescoversseleccionados2/' },
  { id: 'covers3', name: 'Covers 3', path: '/data/listadochordscoversseleccionados3.json', basePath: '/data/cancionescoversseleccionados3/' },
  { id: 'coverslatinos1', name: 'Latinos 1', path: '/data/listadochordscoverslatinos1.json', basePath: '/data/cancionescoverslatinos1/' },
  { id: 'coversnacionales1', name: 'Nacionales 1', path: '/data/listadochordscoversnacionales1.json', basePath: '/data/cancionescoversnacionales1/' },
];

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================
const ChordsViewerIndex = () => {
  // Estados del componente
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState('casamiento');
  const [currentLibraryConfig, setCurrentLibraryConfig] = useState(SONG_LIBRARIES[0]);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Referencias
  const containerRef = useRef(null);
  const printViewRef = useRef(null);

  // Función para cargar archivos JSON
  const fetchJsonFile = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error cargando ${path}:`, error);
      throw error;
    }
  };

  // Función para cargar canción individual
  const loadIndividualSong = async (song, basePath = null) => {
    try {
      setLoading(true);
      setError(null);
      if (!song || !song.file) throw new Error('Datos de canción inválidos');

      const actualBasePath = basePath || currentLibraryConfig.basePath;
      const songPath = `${actualBasePath}${song.file}`;
      
      const response = await fetch(songPath);
      if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${song.file}`);

      const songData = await response.json();
      setSelectedSong({ ...song, ...songData });
      
    } catch (err) {
      console.error('Error loading individual song:', err);
      setError(`Error cargando contenido: ${err.message}`);
      setSelectedSong({
        ...song,
        lyrics: `⚠️ Error: ${err.message}`,
        chords: ''
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de eventos
  const handleSongSelect = (song) => {
    if (song) loadIndividualSong(song);
  };

  const handleLibraryChange = (libraryId) => {
    setSelectedLibrary(libraryId);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
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

  // Funciones de exportación
  const handleExportPDF = async () => {
    const element = printViewRef.current;
    if (!element || !selectedSong) return;
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedSong.artist} - ${selectedSong.title}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setError('Error al exportar PDF');
    }
  };

  const handleExportJPG = async () => {
    const element = printViewRef.current;
    if (!element || !selectedSong) return;
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${selectedSong.artist} - ${selectedSong.title}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error exporting JPG:', error);
      setError('Error al exportar JPG');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Efecto para cargar canciones cuando cambia la biblioteca
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const library = SONG_LIBRARIES.find(lib => lib.id === selectedLibrary);
        if (!library) throw new Error('Listado no encontrado');

        setCurrentLibraryConfig(library);
        const data = await fetchJsonFile(library.path);

        let songsArray = [];
        if (data.songs) songsArray = data.songs;
        else if (data.albums) songsArray = data.albums.flatMap(album => album.songs);
        else throw new Error('Formato inválido');

        setSongs(songsArray);
        if (songsArray.length > 0) await loadIndividualSong(songsArray[0], library.basePath);
        else setSelectedSong(null);
      } catch (err) {
        console.error('Error loading songs:', err);
        setError(`Error: ${err.message}`);
        setSongs([]);
        setSelectedSong(null);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, [selectedLibrary]);

  // Render de estados de carga y error
  if (loading && !selectedSong) return <div className="chords-loading">Cargando canciones...</div>;
  
  if (error) return (
    <div className="chords-error">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">Reintentar</button>
    </div>
  );

  // Render principal
  return (
    <div className="chords-viewer-search-top" ref={containerRef}>
      
      {/* Botón de pantalla completa */}
      <button className="fullscreen-toggle-btn" onClick={toggleFullscreen}>
        {fullscreenMode ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* Header con searchbar arriba de todo */}
      <div className="header-with-search">
        
        {/* Searchbar en la parte superior */}
        <div className="search-top-section">
          <SongSelector
            songs={songs}
            selectedSong={selectedSong}
            onSelectSong={handleSongSelect}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Selector de biblioteca debajo del search */}
        <div className="library-under-search">
          <select 
            value={selectedLibrary} 
            onChange={(e) => handleLibraryChange(e.target.value)}
            className="library-select-top"
            title="Seleccionar biblioteca"
          >
            {SONG_LIBRARIES.map(library => (
              <option key={library.id} value={library.id}>
                {library.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Layout principal */}
      <div className="main-content-search-top">
        
        {/* Columna de controles */}
        <div className="controls-column">
          <div className="controls-wrapper">
            <h3 className="controls-title">Controles</h3>
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

        {/* Columna del visualizador */}
        <div className="viewer-column">
          <div className="viewer-wrapper">
            {selectedSong ? (
              <SongViewer
                song={selectedSong}
                transposition={transposition}
                showA4Outline={showA4Outline}
                fullscreenMode={fullscreenMode}
                printViewRef={printViewRef}
              />
            ) : (
              !loading && (
                <div className="no-songs-message">
                  <p>Selecciona una canción para comenzar</p>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChordsViewerIndex;