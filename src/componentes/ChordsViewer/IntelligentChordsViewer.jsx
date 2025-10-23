// src/componentes/ChordsViewer/IntelligentChordsViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useContentAnalyzer } from './ContentAnalyzer';
import TabletViewer from './Formats/TabletViewer';
import DesktopViewer from './Formats/DesktopViewer';
import MobileViewer from './Formats/MobileViewer';
import "../../assets/scss/_03-Componentes/ChordsViewer/_IntelligentChordsViewer.scss";

const IntelligentChordsViewer = ({ song, transposition, showA4Outline, fullscreenMode }) => {
  const [currentFormat, setCurrentFormat] = useState('desktop');
  const analysis = useContentAnalyzer(song);
  const containerRef = useRef(null);

  // Detectar formato automáticamente basado en pantalla
  useEffect(() => {
    const detectOptimalFormat = () => {
      const width = window.innerWidth;
      const aspectRatio = width / window.innerHeight;
      
      if (width <= 768) {
        return 'mobile';
      } else if (width <= 1024) {
        return 'tablet';
      } else if (width > 1600 && aspectRatio > 1.4) {
        return 'desktop';
      } else if (width > 1200) {
        return 'desktop';
      } else {
        return 'tablet';
      }
    };

    setCurrentFormat(detectOptimalFormat());
    
    const handleResize = () => {
      setCurrentFormat(detectOptimalFormat());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Renderizar el visualizador apropiado
  const renderViewer = () => {
    const commonProps = { 
      song, 
      transposition, 
      showA4Outline: showA4Outline,
      analysis,
      currentFormat
    };
    
    switch (currentFormat) {
      case 'mobile':
        return <MobileViewer {...commonProps} />;
      case 'tablet':
        return <TabletViewer {...commonProps} />;
      case 'desktop':
        return <DesktopViewer {...commonProps} />;
      default:
        return <TabletViewer {...commonProps} />;
    }
  };

  if (!song) {
    return (
      <div className="intelligent-chords-viewer no-song">
        <div className="no-song-message">
          <h2>Visualizador de Acordes Inteligente</h2>
          <p>Selecciona una canción desde la biblioteca para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`intelligent-chords-viewer format-${currentFormat} ${fullscreenMode ? 'fullscreen' : ''}`}
    >
      {renderViewer()}
    </div>
  );
};

export default IntelligentChordsViewer;