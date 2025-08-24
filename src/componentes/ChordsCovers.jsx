// components/ChordsCovers.jsx (versión corregida)
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  BsWhatsapp, 
  BsFacebook, 
  BsInstagram, 
  BsEnvelope,
  BsDownload,
  BsEye
} from "react-icons/bs";
import { 
  FiChevronUp, 
  FiChevronDown, 
  FiFilter,
  FiMusic,
  FiAlertCircle
} from "react-icons/fi";
import "../assets/scss/_03-Componentes/_ChordsCovers.scss";

const ChordsCovers = () => {
  // Estados del componente
  const [almangoData, setAlmangoData] = useState([]);
  const [coversData, setCoversData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [transposition, setTransposition] = useState(0);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para cargar datos - VERSIÓN CORREGIDA
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Iniciando carga de datos...");
        
        // Solo cargamos un archivo JSON para evitar el problema
        const response = await fetch("/chordscovers.json");
        
        console.log("Response recibida:", response);
        
        if (!response || !response.ok) {
          throw new Error(`Error HTTP: ${response?.status || 'No response'}`);
        }

        const data = await response.json();
        console.log("Datos cargados:", data);
        
        // Asignamos los mismos datos a ambos estados para testing
        setAlmangoData(data);
        setCoversData(data);
        
      } catch (error) {
        console.error("Error completo al cargar los datos:", error);
        setError(`No se pudieron cargar los datos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Función para transponer acordes
  const transposeChord = (chord) => {
    if (!chord || chord === 'N.C.' || chord === '(E)') return chord;
    
    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const index = chords.indexOf(chord);
    if (index === -1) return chord;
    const newIndex = (index + transposition + 12) % 12;
    return chords[newIndex];
  };

  // Manejar cambio de transposición
  const handleTransposeChange = (step) => {
    setTransposition(prev => prev + step);
  };

  // Manejar exportación
  const handleExport = async () => {
    try {
      const element = document.getElementById("chords-viewer");
      if (exportFormat === "PDF") {
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.html(element, {
          callback: () => {
            pdf.save("chords-covers.pdf");
          },
        });
      } else if (exportFormat === "JPG") {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "chords-covers.jpg";
        link.click();
      }
    } catch (error) {
      console.error("Error en exportación:", error);
      alert("Error al exportar: " + error.message);
    }
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (category) => setSelectedCategory(category);

  // Manejar descarga de archivos
  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
  };

  // Manejar vista previa
  const handlePreview = (url) => window.open(url, "_blank");

  // Compartir por WhatsApp
  const shareOnWhatsApp = (item) => {
    const message = `🎵 ${item.cancion} - ${item.artista}\n🎶 Género: ${item.genero}\n📊 Información: ${item.informacionExtra}\n\n¡Mirá este acorde en Formateo Chords!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Renderizar prosa de canción
  const renderSongProse = (song) => {
    if (!song.Secciones) return null;
    
    return song.Secciones.map((section, sectionIndex) => (
      <div key={sectionIndex} className="song-prose-section">
        <h3 className="section-title">
          <FiMusic className="section-icon" />
          {section.titulo}
        </h3>
        <div className="prose-content">
          <div className="chords-line">
            {section.acordes && section.acordes.map((chord, chordIndex) => (
              <span key={chordIndex} className="chord">
                {transposeChord(chord)}
              </span>
            ))}
          </div>
          <p className="lyrics">{section.letra}</p>
        </div>
      </div>
    ));
  };

  // Filtrar datos por categoría
  const filteredData = coversData.filter && coversData.filter(
    (item) => selectedCategory === "TODOS" || item.genero === selectedCategory
  ) || [];

  // Obtener categorías únicas
  const categories = ["TODOS", ...new Set(coversData.map && coversData.map((item) => item.genero) || [])];

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="chords-covers-container">
        <Sidebar />
        <div className="loading-state">
          <FiMusic className="loading-icon" />
          <p>Cargando acordes y covers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chords-covers-container">
        <Sidebar />
        <div className="error-state">
          <FiAlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Reintentar
          </button>
          <div className="debug-info">
            <p>Ruta intentada: /chordscovers.json</p>
            <p>Verifica que el archivo existe en la carpeta public/</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chords-covers-container">
      <Sidebar />
      
      <div className="chords-covers-content">
        
        {/* Panel de Controles */}
        <div className="controls-panel">
          <h2 className="panel-title">
            <FiMusic className="title-icon" />
            Biblioteca de Covers
          </h2>
          
          <div className="controls-group">
            
            {/* Controles de Transposición */}
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

            {/* Controles de Exportación */}
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
                <BsDownload className="export-icon" />
                Exportar
              </button>
            </div>

          </div>
        </div>

        {/* Mostrar datos de prueba si existen */}
        <div id="chords-viewer" className="chords-container">
          {almangoData.length > 0 ? (
            almangoData.map((song, index) => (
              <div key={index} className="chords-item">
                <div className="song-header">
                  <h1 className="song-title">{song.cancion || "Título no disponible"}</h1>
                  <h2 className="song-artist">{song.artista || "Artista no disponible"}</h2>
                </div>

                <div className="song-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Género:</span>
                    <span className="detail-value">{song.genero || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tempo:</span>
                    <span className="detail-value">{song.tempo || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Compás:</span>
                    <span className="detail-value">{song.compas || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Capo:</span>
                    <span className="detail-value">{song.capo || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tono Original:</span>
                    <span className="detail-value">{song.tonoOriginal || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tono Actual:</span>
                    <span className="detail-value">
                      {transposeChord(song.tonoOriginal) || "N/A"}
                    </span>
                  </div>
                </div>

                {song.Secciones && (
                  <div className="song-prose-container">
                    {renderSongProse(song)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-data">
              <FiAlertCircle />
              <p>No hay datos disponibles para mostrar</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChordsCovers;