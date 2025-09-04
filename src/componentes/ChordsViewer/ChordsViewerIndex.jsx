// ======================================================
// IMPORTACIONES DE LIBRERÍAS EXTERNAS
// ======================================================
import React, { useState, useEffect, useRef } from 'react';
import SongSelector from './SongSelector';
import SongViewer from './SongViewer';
import Controls from './Controls';
import { BsArrowsFullscreen, BsFullscreenExit, BsChevronDown, BsChevronUp } from "react-icons/bs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

// ======================================================
// LISTA DE BIBLIOTECAS DISPONIBLES - CONFIGURACIÓN FIJA
// Cada biblioteca representa un cancionero diferente con sus rutas JSON
// ======================================================
const SONG_LIBRARIES = [
  { 
    id: 'alegondra', 
    name: 'Ale Gondra', 
    path: '/data/listadocancionesalegondramusic.json',
    basePath: '/data/cancionesalegondramusic/' 
  },
  { 
    id: 'almangopop', 
    name: 'Almango Pop', 
    path: '/data/listadocancionesalmangopop.json',
    basePath: '/data/cancionesalmangopop/'  
  },
  { 
    id: 'casamiento', 
    name: 'Show Casamiento', 
    path: '/data/listadocancionescasamiento.json',
    basePath: '/data/cancionesshowcasamiento/'  
  },
  { 
    id: 'covers1', 
    name: 'Covers 1', 
    path: '/data/listadochordscoversseleccionados1.json',
    basePath: '/data/cancionescoversseleccionados1/' 
  }, 
  { 
    id: 'covers2', 
    name: 'Covers 2', 
    path: '/data/listadochordscoversseleccionados2.json',
    basePath: '/data/cancionescoversseleccionados2/' 
  }, 
  { 
    id: 'covers3', 
    name: 'Covers 3', 
    path: '/data/listadochordscoversseleccionados3.json',
    basePath: '/data/cancionescoversseleccionados3/' 
  }, 
  { 
    id: 'coverslatinos1', 
    name: 'Latinos 1', 
    path: '/data/listadochordscoverslatinos1.json',
    basePath: '/data/cancionescoverslatinos1/'
  },
  { 
    id: 'coversnacionales1', 
    name: 'Nacionales 1', 
    path: '/data/listadochordscoversnacionales1.json',
    basePath: '/data/cancionescoversnacionales1/' 
  }, 
];

// ======================================================
// COMPONENTE PRINCIPAL - VISOR DE ACORDES
// Gestiona la visualización de canciones, bibliotecas y controles
// ======================================================
const ChordsViewerIndex = () => {
  // ======================================================
  // ESTADOS PRINCIPALES DEL COMPONENTE
  // ======================================================
  
  // songs: Almacena la lista de canciones cargadas desde el JSON seleccionado
  const [songs, setSongs] = useState([]);
  
  // selectedSong: Canción actualmente seleccionada para visualización
  const [selectedSong, setSelectedSong] = useState(null);
  
  // transposition: Nivel de transposición de acordes (-6 a +6 semitonos)
  const [transposition, setTransposition] = useState(0);
  
  // showA4Outline: Controla si se muestran las guías de papel A4
  const [showA4Outline, setShowA4Outline] = useState(false);
  
  // loading: Indica cuando se están cargando datos
  const [loading, setLoading] = useState(true);
  
  // error: Almacena mensajes de error durante la carga
  const [error, setError] = useState(null);
  
  // selectedLibrary: Biblioteca/cancionero actualmente seleccionado
  const [selectedLibrary, setSelectedLibrary] = useState('casamiento');
  
  // currentLibraryConfig: Configuración completa de la biblioteca actual
  const [currentLibraryConfig, setCurrentLibraryConfig] = useState(SONG_LIBRARIES[0]);
  
  // fullscreenMode: Controla el estado de pantalla completa
  const [fullscreenMode, setFullscreenMode] = useState(false);
  
  // searchQuery: Término de búsqueda para filtrar canciones
  const [searchQuery, setSearchQuery] = useState('');
  
  // showControls: Controla la visibilidad de los controles avanzados
  const [showControls, setShowControls] = useState(false);

  // ======================================================
  // REFERENCIAS A ELEMENTOS DEL DOM
  // ======================================================
  
  // containerRef: Referencia al contenedor principal para funcionalidad de pantalla completa
  const containerRef = useRef(null);
  
  // printViewRef: Referencia al área que se exportará a PDF/JPG
  const printViewRef = useRef(null);

  // ======================================================
  // FUNCIÓN: fetchJsonFile - Carga archivos JSON del servidor
  // Parámetros: path (ruta del archivo JSON)
  // Retorna: datos JSON o lanza error
  // ======================================================
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

  // ======================================================
  // FUNCIÓN: loadIndividualSong - Carga una canción específica
  // Parámetros: song (objeto canción), basePath (ruta base opcional)
  // Carga el contenido JSON individual de cada canción
  // ======================================================
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

  // ======================================================
  // MANEJADORES DE EVENTOS - FUNCIONES QUE RESPONDEN A INTERACCIONES
  // ======================================================
  
  // handleSongSelect: Se ejecuta cuando el usuario selecciona una canción
  const handleSongSelect = (song) => {
    if (song) loadIndividualSong(song);
  };

  // handleLibraryChange: Cambia la biblioteca/cancionero activo
  const handleLibraryChange = (libraryId) => {
    setSelectedLibrary(libraryId);
  };

  // handleSearchChange: Actualiza el término de búsqueda
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // toggleFullscreen: Alterna entre modo normal y pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
      setFullscreenMode(true);
    } else {
      document.exitFullscreen();
      setFullscreenMode(false);
    }
  };

  // toggleControls: Alterna la visibilidad de los controles avanzados
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // ======================================================
  // FUNCIONES DE EXPORTACIÓN - PARA GUARDAR/IMPRIMIR CANCIONES
  // ======================================================
  
  // handleExportPDF: Exporta la canción actual a formato PDF
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

  // handleExportJPG: Exporta la canción actual a formato JPG
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

  // handlePrint: Abre el diálogo de impresión del navegador
  const handlePrint = () => {
    window.print();
  };

  // ======================================================
  // EFECTO: Carga canciones cuando cambia la biblioteca seleccionada
  // Se ejecuta automáticamente cuando selectedLibrary cambia
  // ======================================================
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

  // ======================================================
  // RENDER: Estados de carga y error - Muestra pantallas alternativas
  // ======================================================
  if (loading && !selectedSong) return <div className="chords-loading">Cargando canciones...</div>;
  
  if (error) return (
    <div className="chords-error">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">Reintentar</button>
    </div>
  );

  // ======================================================
  // RENDER PRINCIPAL - Estructura visual del componente
  // ======================================================
  return (
    <div className="chords-viewer-compact" ref={containerRef}>
      
      {/* Botón de pantalla completa - Esquina superior derecha */}
      <button className="fullscreen-toggle-btn" onClick={toggleFullscreen}>
        {fullscreenMode ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* Encabezado compacto - Contiene bibliotecas, buscador y controles */}
      <div className="compact-header">
        
        {/* Primera fila: Bibliotecas y búsqueda */}
        <div className="header-row primary-row">
          {/* Botones de bibliotecas - Selección de cancioneros */}
          <div className="library-section">
            <div className="compact-library-buttons">
              {SONG_LIBRARIES.map(library => (
                <button
                  key={library.id}
                  className={`compact-lib-btn ${selectedLibrary === library.id ? 'active' : ''}`}
                  onClick={() => handleLibraryChange(library.id)}
                  title={library.name}
                >
                  {library.name.split(' ')[0]}
                  {selectedLibrary === library.id && <span className="compact-indicator">•</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de canciones - Búsqueda y selección */}
          <div className="search-section">
            <SongSelector
              songs={songs}
              selectedSong={selectedSong}
              onSelectSong={handleSongSelect}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Botón para mostrar/ocultar controles avanzados */}
          <div className="controls-toggle-section">
            <button 
              className="controls-toggle-btn"
              onClick={toggleControls}
              title={showControls ? "Ocultar controles" : "Mostrar controles"}
            >
              {showControls ? <BsChevronUp /> : <BsChevronDown />}
              <span>Controles</span>
            </button>
          </div>
        </div>

        {/* Segunda fila: Controles avanzados (expandible) */}
        {showControls && (
          <div className="header-row secondary-row">
            <div className="controls-section">
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
        )}
      </div>

      {/* Área principal de contenido - Visualizador de canciones */}
      <div className="compact-content">
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
              <p>No hay canciones disponibles</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ======================================================
// EXPORTACIÓN DEL COMPONENTE
// ======================================================
export default ChordsViewerIndex;