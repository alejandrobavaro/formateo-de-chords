import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../assets/scss/_03-Componentes/_ChordsAlmango.scss";

// Importación de iconos para una mejor UI
import { FiDownload, FiChevronUp, FiChevronDown, FiMusic } from "react-icons/fi";

// Componente ChordsAlmango - Visualizador y editor de acordes musicales
const ChordsAlmango = () => {
  // Estados del componente
  const [data, setData] = useState([]); // Datos de los acordes
  const [transposition, setTransposition] = useState(0); // Nivel de transposición
  const [exportFormat, setExportFormat] = useState("PDF"); // Formato de exportación
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Efecto para cargar los datos de acordes
  useEffect(() => {
    // Función asíncrona para cargar datos
    const loadChordsData = async () => {
      try {
        setIsLoading(true); // Iniciar estado de carga
        const response = await fetch("/chordsalmango.json");
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const chordsData = await response.json();
        setData(chordsData);
        console.log("Datos de acordes cargados exitosamente:", chordsData);
      } catch (error) {
        console.error("Error al cargar los datos de acordes:", error);
        setError("No se pudieron cargar los datos. Por favor, intenta nuevamente.");
      } finally {
        setIsLoading(false); // Finalizar estado de carga
      }
    };

    loadChordsData();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función para transponer acordes
  const transposeChord = (chord) => {
    // Lista de acordes cromáticos
    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const index = chords.indexOf(chord);
    
    // Si el acorde no se encuentra, retornar original
    if (index === -1) return chord;
    
    // Calcular nuevo índice con transposición
    const newIndex = (index + transposition + 12) % 12;
    return chords[newIndex];
  };

  // Función para transponer todas las secciones de una canción
  const transposeSections = (sections) => {
    return sections.map((section) => ({
      ...section,
      acordes: section.acordes.map(transposeChord),
    }));
  };

  // Función para exportar los acordes
  const handleExport = () => {
    const element = document.getElementById("chords-viewer");
    
    if (exportFormat === "PDF") {
      // Exportar a PDF
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.html(element, {
        callback: () => {
          pdf.save("chords-almango.pdf");
        },
      });
    } else if (exportFormat === "JPG") {
      // Exportar a JPG
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "JPEG", 0, 0);
        pdf.save("chords-almango.jpg");
      });
    }
  };

  // Función para cambiar la transposición
  const handleTransposeChange = (step) => {
    setTransposition(transposition + step);
  };

  // Función para renderizar la prosa de la canción (acordes y letra)
  const renderSongProse = (song) => {
    return song.Secciones.map((section, index) => (
      <div key={index} className="song-prose-section">
        <h3 className="section-title">
          <FiMusic className="section-icon" />
          {section.titulo}
        </h3>
        <div className="prose-content">
          <div className="chords-line">
            {section.acordes.map((chord, i) => (
              <span key={i} className="chord">
                {chord}
              </span>
            ))}
          </div>
          <p className="lyrics">{section.letra}</p>
        </div>
      </div>
    ));
  };

  // Renderizado condicional basado en el estado
  if (isLoading) {
    return (
      <div className="chords-almango-container">
        <Sidebar />
        <div className="loading-state">
          <FiMusic className="loading-icon" />
          <p>Cargando acordes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chords-almango-container">
        <Sidebar />
        <div className="error-state">
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

  // Renderizado principal
  return (
    <div className="chords-almango-container">
      <Sidebar />
      
      <div className="chords-display">
        
        {/* Controles de transposición y exportación */}
        <div className="controls-panel">
          <h2 className="panel-title">
            <FiMusic className="title-icon" />
            Editor de Acordes
          </h2>
          
          <div className="controls-group">
            
            {/* Controles de transposición */}
            <div className="transpose-controls">
              <span className="control-label">Transponer:</span>
              <button 
                onClick={() => handleTransposeChange(-1)} 
                className="control-button"
                aria-label="Bajar tono"
              >
                <FiChevronDown />
              </button>
              <span className="transposition-value">{transposition}</span>
              <button 
                onClick={() => handleTransposeChange(1)} 
                className="control-button"
                aria-label="Subir tono"
              >
                <FiChevronUp />
              </button>
            </div>

            {/* Controles de exportación */}
            <div className="export-controls">
              <select 
                onChange={(e) => setExportFormat(e.target.value)} 
                value={exportFormat}
                className="format-select"
              >
                <option value="PDF">Exportar a PDF</option>
                <option value="JPG">Exportar a JPG</option>
              </select>
              <button 
                onClick={handleExport} 
                className="export-button"
              >
                <FiDownload className="export-icon" />
                Exportar
              </button>
            </div>

          </div>
        </div>

        {/* Contenedor de visualización de acordes */}
        <div id="chords-viewer" className="chords-container">
          {data.map((song) => (
            <div key={song.id} className="chords-item">
              
              {/* Información principal de la canción */}
              <div className="song-header">
                <h1 className="song-title">{song.Cancion}</h1>
                <h2 className="song-artist">{song.Artista}</h2>
              </div>

              {/* Detalles de la canción */}
              <div className="song-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Género:</span>
                  <span className="detail-value">{song.Genero}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tempo:</span>
                  <span className="detail-value">{song.tempo} BPM</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Compás:</span>
                  <span className="detail-value">{song.compas}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Capo:</span>
                  <span className="detail-value">{song.capo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tono Original:</span>
                  <span className="detail-value">{song.tonoOriginal}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tono Actual:</span>
                  <span className="detail-value">
                    {transposeChord(song.tonoOriginal)}
                  </span>
                </div>
              </div>

              {/* Secciones de acordes y letra */}
              <div className="song-prose-grid">
                {renderSongProse(song)}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChordsAlmango;