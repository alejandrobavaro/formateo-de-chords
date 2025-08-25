import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { HeaderSearchContextBuscadorModular } from "./HeaderSearchContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BsDownload,
  BsPrinter,
  BsGear,
  BsChevronRight,
  BsChevronLeft
} from "react-icons/bs";
import {
  FiMusic,
  FiAlertCircle,
  FiCreditCard,
  FiBriefcase,
  FiType,
  FiPlus,
  FiMinus,
  FiRotateCw,
  FiX
} from "react-icons/fi";
import '../assets/scss/_03-Componentes/_ChordsViewer.scss';

const ChordsViewer = () => {
  // Estados del componente
  const [songsData, setSongsData] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [transposition, setTransposition] = useState(0);
  const [fontSize, setFontSize] = useState(90);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chordsViewerRef = useRef(null);
  const printViewRef = useRef(null);

  // Manejar el contexto de forma segura
  const context = useContext(HeaderSearchContextBuscadorModular);
  const searchQuery = context?.searchQuery || '';
  const setSearchQuery = context?.setSearchQuery || (() => {});

  const location = useLocation();

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/chordscovers.json");
        if (!response || !response.ok) {
          throw new Error(`Error HTTP: ${response?.status || 'No response'}`);
        }
        const data = await response.json();
        console.log("Datos cargados:", data); // Para debug
        
        // Manejar tanto array como objeto individual
        let songsArray = [];
        if (Array.isArray(data)) {
          songsArray = data;
        } else if (typeof data === 'object' && data !== null) {
          // Si es un objeto individual, convertirlo a array
          songsArray = [data];
        }
        
        setSongsData(songsArray);
        setFilteredSongs(songsArray);
        if (songsArray.length > 0) setSelectedSong(songsArray[0]);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError(`No se pudieron cargar los datos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrar canciones basado en la búsqueda desde el contexto
  useEffect(() => {
    if (searchQuery && songsData.length > 0) {
      const filtered = songsData.filter(song =>
        song.cancion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artista.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.genero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Para estructura nueva
        (song.contenido && song.contenido.some(col => 
          col.secciones.some(section => 
            section.lineas.some(linea => 
              (linea.letra && linea.letra.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (linea.acordes && linea.acordes.some(acorde => 
                acorde && acorde.toLowerCase().includes(searchQuery.toLowerCase())
              ))
            )
          )
        )) ||
        // Para estructura antigua
        (song.Secciones && song.Secciones.some(section =>
          section.letra.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (section.acordes && section.acordes.some(chord =>
            chord && chord.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        ))
      );
      setFilteredSongs(filtered);
      if (filtered.length > 0) setSelectedSong(filtered[0]);
    } else {
      setFilteredSongs(songsData);
    }
  }, [searchQuery, songsData]);

  // Función para transponer acordes
  const transposeChord = (chord) => {
    if (!chord || chord === 'N.C.' || chord === '(E)' || chord === '-' || chord === '–') return chord;

    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const cleanChord = chord.replace(/[()]/g, '');
    const index = chords.indexOf(cleanChord);
    
    if (index === -1) {
      const baseChord = cleanChord.replace(/m|7|sus|dim|aug|M|\/.*/g, '');
      const modifier = cleanChord.replace(baseChord, '');
      const baseIndex = chords.indexOf(baseChord);
      
      if (baseIndex === -1) return chord;
      
      const newIndex = (baseIndex + transposition + 12) % 12;
      return chords[newIndex] + modifier;
    }
    
    const newIndex = (index + transposition + 12) % 12;
    return chords[newIndex];
  };

  // Manejar transposición
  const handleTranspose = (step) => {
    setTransposition(prev => prev + step);
  };

  // Resetear transposición
  const resetTransposition = () => {
    setTransposition(0);
  };

  // Manejar cambio de tamaño de fuente
  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };

  // Alternar barra lateral
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Preparar vista para impresión/exportación
  const preparePrintView = () => {
    return (
      <div className="print-view" ref={printViewRef}>
        {selectedSong && (
          <>
            <div className="song-header">
              <h1 className="song-title">{selectedSong.cancion}</h1>
              <div className="song-subtitle">
                <span className="artist">{selectedSong.artista}</span>
                <span className="tono">Tono: {transposeChord(selectedSong.tonoOriginal)}</span>
              </div>
              <div className="song-metadata">
                <span><strong>Género:</strong> {selectedSong.genero}</span>
                <span><strong>Tempo:</strong> {selectedSong.tempo}</span>
                <span><strong>Compás:</strong> {selectedSong.compas}</span>
                <span><strong>Capo:</strong> {selectedSong.capo}</span>
              </div>
            </div>

            <div className="chords-viewer print-mode">
              {/* Formato nuevo */}
              {selectedSong.contenido && (
                <div className="song-columns">
                  {selectedSong.contenido.map((columna, colIndex) => (
                    <div key={colIndex} className="column">
                      {columna.secciones.map((seccion, secIndex) => (
                        <div key={secIndex} className="section">
                          {seccion.titulo && <h3 className="section-title">{seccion.titulo}</h3>}
                          <div className="song-lines">
                            {seccion.lineas.map((linea, lineIndex) => (
                              <div key={lineIndex} className="line">
                                {linea.acordes && linea.acordes.length > 0 && (
                                  <div className="chords-line">
                                    {linea.acordes.map((acorde, chordIndex) => (
                                      <span key={chordIndex} className="chord">
                                        {transposeChord(acorde)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {linea.letra && <div className="lyrics-line">{linea.letra}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Formato antiguo */}
              {selectedSong.Secciones && !selectedSong.contenido && (
                <div className="song-sections-columns">
                  {(() => {
                    const [firstColumn, secondColumn] = splitSectionsIntoColumns(selectedSong.Secciones);
                    return (
                      <>
                        <div className="column">
                          {firstColumn.map((section, index) => (
                            <div key={index} className="section">
                              <h3 className="section-title">{section.titulo}</h3>
                              <div className="lyrics-with-chords print-mode">
                                {renderChordLines(section.letra, section.acordes)}
                              </div>
                            </div>
                          ))}
                        </div>
                        {secondColumn.length > 0 && (
                          <div className="column">
                            {secondColumn.map((section, index) => (
                              <div key={index} className="section">
                                <h3 className="section-title">{section.titulo}</h3>
                                <div className="lyrics-with-chords print-mode">
                                  {renderChordLines(section.letra, section.acordes)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // Función para renderizar líneas de acordes (formato antiguo)
  const renderChordLines = (lyrics, chords) => {
    if (!chords || chords.length === 0) {
      return lyrics.split('\n').map((line, index) => (
        <div key={index} className="line">
          <div className="lyrics-line">{line}</div>
        </div>
      ));
    }

    const lines = lyrics.split('\n');
    
    // Si tenemos la misma cantidad de acordes que líneas, colocamos un acorde por línea
    if (chords.length === lines.length) {
      return lines.map((line, index) => (
        <div key={index} className="line">
          <div className="chords-line">
            <span className="chord">{transposeChord(chords[index])}</span>
          </div>
          <div className="lyrics-line">{line}</div>
        </div>
      ));
    }
    
    // Si no, mostramos todos los acordes primero y luego la letra
    return (
      <>
        <div className="chords-line">
          {chords.map((chord, index) => (
            <span key={index} className="chord">
              {transposeChord(chord)}
            </span>
          ))}
        </div>
        {lines.map((line, index) => (
          <div key={index} className="line">
            <div className="lyrics-line">{line}</div>
          </div>
        ))}
      </>
    );
  };

  // Dividir las secciones en dos columnas (formato antiguo)
  const splitSectionsIntoColumns = (sections) => {
    if (!sections) return [[], []];
    
    const midPoint = Math.ceil(sections.length / 2);
    const firstColumn = sections.slice(0, midPoint);
    const secondColumn = sections.slice(midPoint);
    
    return [firstColumn, secondColumn];
  };

  // Exportar a PDF
  const handleExport = async (format) => {
    try {
      setTimeout(async () => {
        const element = printViewRef.current;
        if (format === "PDF") {
          const pdf = new jsPDF("p", "mm", "a4");
          const canvas = await html2canvas(element, { 
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL("image/jpeg", 0.9);
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${selectedSong.cancion} - ${selectedSong.artista}.pdf`);
        } else if (format === "JPG") {
          const canvas = await html2canvas(element, { 
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL("image/jpeg", 0.9);
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `${selectedSong.cancion} - ${selectedSong.artista}.jpg`;
          link.click();
        }
      }, 100);
    } catch (error) {
      console.error("Error en exportación:", error);
      alert("Error al exportar: " + error.message);
    }
  };

  // Imprimir directamente
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredSongs(songsData);
  };

  // Encontrar el índice de la canción seleccionada
  const findSongIndex = () => {
    if (!Array.isArray(filteredSongs) || !selectedSong) return 0;
    return filteredSongs.findIndex(song => song.id === selectedSong.id);
  };

  // Función para manejar el cambio de canción en el selector
  const handleSongChange = (e) => {
    const index = parseInt(e.target.value);
    if (Array.isArray(filteredSongs) && filteredSongs[index]) {
      setSelectedSong(filteredSongs[index]);
    }
  };

  if (isLoading) {
    return (
      <div className="chords-viewer-container">
        <div className="loading-state">
          <FiMusic className="loading-icon" />
          <p>Cargando acordes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chords-viewer-container">
        <div className="error-state">
          <FiAlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chords-viewer-container">
      {/* Vista de impresión/exportación (oculta) */}
      <div style={{ display: 'none' }}>
        {preparePrintView()}
      </div>

      {/* Botón para toggle sidebar */}
      <button
        className={`sidebar-toggle-button ${isSidebarCollapsed ? 'collapsed' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarCollapsed ? <BsChevronRight /> : <BsChevronLeft />}
        <BsGear />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-content">
          {/* Información de la canción */}
          {selectedSong && (
            <div className="song-info-sidebar">
              <div className="metadata-item">
                <span className="label">Género:</span>
                <span className="value">{selectedSong.genero}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Tempo:</span>
                <span className="value">{selectedSong.tempo}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Compás:</span>
                <span className="value">{selectedSong.compas}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Capo:</span>
                <span className="value">{selectedSong.capo}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Tono Original:</span>
                <span className="value">{selectedSong.tonoOriginal}</span>
              </div>
              
              {selectedSong.informacionExtra && (
                <p className="song-info">{selectedSong.informacionExtra}</p>
              )}
            </div>
          )}

          {/* Selector de canciones - Solo mostrar si hay más de una canción */}
          {filteredSongs.length > 1 && (
            <div className="song-selector">
              <select
                onChange={handleSongChange}
                value={findSongIndex()}
                className="song-dropdown"
              >
                {Array.isArray(filteredSongs) && filteredSongs.map((song, index) => (
                  <option key={index} value={index}>
                    {song.cancion} - {song.artista}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sección de Transposición */}
          <div className="sidebar-section">
            <h2 className="section-title">
              <FiCreditCard className="section-icon" />
              <span>Transponer</span>
            </h2>
            <div className="transposition-controls">
              <button onClick={() => handleTranspose(-1)} className="control-btn">
                <FiMinus />
              </button>
              <span className="transposition-value">{transposition > 0 ? '+' : ''}{transposition}</span>
              <button onClick={() => handleTranspose(1)} className="control-btn">
                <FiPlus />
              </button>
              <button onClick={resetTransposition} className="control-btn reset">
                <FiRotateCw />
              </button>
            </div>
          </div>
          
          {/* Sección de Tamaño de texto */}
          <div className="sidebar-section">
            <h2 className="section-title">
              <FiType className="section-icon" />
              <span>Tamaño de texto</span>
            </h2>
            <div className="font-size-control">
              <input
                type="range"
                min="70"
                max="110"
                step="5"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="font-size-slider"
              />
              <span>{fontSize}%</span>
            </div>
          </div>
          
          {/* Sección de Exportación */}
          <div className="sidebar-section">
            <h2 className="section-title">
              <FiBriefcase className="section-icon" />
              <span>Exportar</span>
            </h2>
            <div className="export-options">
              <button onClick={() => handleExport("PDF")} className="export-btn">
                <BsDownload /> PDF
              </button>
              <button onClick={() => handleExport("JPG")} className="export-btn">
                <BsDownload /> Imagen
              </button>
              <button onClick={handlePrint} className="export-btn">
                <BsPrinter /> Imprimir
              </button>
            </div>
          </div>

          {/* Limpiar búsqueda */}
          {searchQuery && (
            <div className="sidebar-section">
              <button onClick={clearSearch} className="clear-search-btn">
                <FiX /> Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="chords-content">
        {/* Indicador de búsqueda */}
        {searchQuery && (
          <div className="search-results-info">
            <p>
              {Array.isArray(filteredSongs) ? filteredSongs.length : 0} resultado(s) para: <strong>"{searchQuery}"</strong>
              <button
                onClick={clearSearch}
                className="clear-search-btn"
              >
                <FiX /> Limpiar búsqueda
              </button>
            </p>
          </div>
        )}

        {/* Header de la canción */}
        {selectedSong && (
          <div className="song-header">
            <h1 className="song-title">{selectedSong.cancion}</h1>
            <div className="song-subtitle">
              <span className="artist">{selectedSong.artista}</span>
              <span className="tono">Tono: {transposeChord(selectedSong.tonoOriginal)}</span>
            </div>
          </div>
        )}

        {/* Visor de acordes */}
        <div
          ref={chordsViewerRef}
          className={`chords-viewer font-size-${fontSize}`}
        >
          {/* Formato nuevo */}
          {selectedSong?.contenido && (
            <div className="song-columns">
              {selectedSong.contenido.map((columna, colIndex) => (
                <div key={colIndex} className="column">
                  {columna.secciones.map((seccion, secIndex) => (
                    <div key={secIndex} className="section">
                      {seccion.titulo && <h3 className="section-title">{seccion.titulo}</h3>}
                      <div className="song-lines">
                        {seccion.lineas.map((linea, lineIndex) => (
                          <div key={lineIndex} className="line">
                            {linea.acordes && linea.acordes.length > 0 && (
                              <div className="chords-line">
                                {linea.acordes.map((acorde, chordIndex) => (
                                  <span key={chordIndex} className="chord">
                                    {transposeChord(acorde)}
                                  </span>
                                ))}
                              </div>
                            )}
                            {linea.letra && <div className="lyrics-line">{linea.letra}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {/* Formato antiguo */}
          {selectedSong?.Secciones && !selectedSong.contenido && (
            <div className="song-sections-columns">
              {(() => {
                const [firstColumn, secondColumn] = splitSectionsIntoColumns(selectedSong.Secciones);
                return (
                  <>
                    <div className="column">
                      {firstColumn.map((section, index) => (
                        <div key={index} className="section">
                          <h3 className="section-title">{section.titulo}</h3>
                          <div className="lyrics-with-chords">
                            {renderChordLines(section.letra, section.acordes)}
                          </div>
                        </div>
                      ))}
                    </div>
                    {secondColumn.length > 0 && (
                      <div className="column">
                        {secondColumn.map((section, index) => (
                          <div key={index} className="section">
                            <h3 className="section-title">{section.titulo}</h3>
                            <div className="lyrics-with-chords">
                              {renderChordLines(section.letra, section.acordes)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChordsViewer;