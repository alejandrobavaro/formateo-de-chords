// src/componentes/ChordsViewer/SongViewer.jsx
import React, { useRef, useState, useEffect } from 'react';
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import IntelligentChordsViewer from './IntelligentChordsViewer';
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongViewer.scss";

const SongViewer = ({ song, transposition, showA4Outline, fullscreenMode }) => {
  const viewerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Función para pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen().catch(err => {
          console.error('Error pantalla completa:', err);
        });
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Efecto para sincronizar estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Sincronizar con el prop fullscreenMode
  useEffect(() => {
    setIsFullscreen(fullscreenMode);
  }, [fullscreenMode]);

  if (!song) {
    return (
      <div className="song-viewer no-song">
        <div className="no-song-content">
          <h2>Visualizador de Acordes</h2>
          <p>Selecciona una canción desde la galería para ver los acordes</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`song-viewer ${showA4Outline ? 'a4-outline' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
      ref={viewerRef}
    >
      {/* Botón de pantalla completa */}
      <button className="fullscreen-toggle" onClick={toggleFullscreen} title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
        {isFullscreen ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* Visualizador inteligente */}
      <IntelligentChordsViewer 
        song={song}
        transposition={transposition}
        showA4Outline={showA4Outline}
        fullscreenMode={isFullscreen}
      />
    </div>
  );
};

export default SongViewer;