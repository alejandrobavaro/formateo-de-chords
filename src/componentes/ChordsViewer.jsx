// components/ChordsViewer.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SongSheet from "./SongSheet";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BsDownload, BsFullscreen } from "react-icons/bs";
import { FiMusic } from "react-icons/fi";
import "../assets/scss/_03-Componentes/_ChordsViewer.scss";

const ChordsViewer = () => {
  const [songData, setSongData] = useState(null);
  const [transposition, setTransposition] = useState(0);
  const [viewMode, setViewMode] = useState('default');
  const [fontSize, setFontSize] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadSongData();
  }, []);

  const loadSongData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/chordscovers.json");
      
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }

      const data = await response.json();
      setSongData(data[0]); // Tomar la primera canción por ahora
      
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setError("No se pudieron cargar los datos. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("song-sheet");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${songData.cancion}-${songData.artista}.pdf`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="chords-viewer-container">
        <div className="loading-state">
          <FiMusic className="loading-icon" />
          <p>Cargando partitura...</p>
        </div>
      </div>
    );
  }

  if (error || !songData) {
    return (
      <div className="chords-viewer-container">
        <div className="error-state">
          <p className="error-message">{error || "No se encontraron datos"}</p>
          <button onClick={loadSongData} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`chords-viewer-container ${isFullscreen ? 'mobile-fullscreen' : ''}`}>
      <Sidebar 
        onTransposeChange={setTransposition}
        onViewModeChange={setViewMode}
        onFontSizeChange={setFontSize}
      />
      
      <div className="chords-viewer-content">
        <div className="viewer-controls">
          <h2 className="viewer-title">
            <FiMusic className="title-icon" />
            Visualizador de Partituras
          </h2>
          
          <div className="control-buttons">
            <button onClick={handleExportPDF} className="control-button export-button">
              <BsDownload className="button-icon" />
              Exportar PDF
            </button>
            
            <button onClick={toggleFullscreen} className="control-button fullscreen-button">
              <BsFullscreen className="button-icon" />
              Pantalla Completa
            </button>
          </div>
        </div>

        <div id="song-sheet" className="song-sheet-wrapper">
          <SongSheet 
            songData={songData}
            transposition={transposition}
            fontSize={fontSize}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ChordsViewer;