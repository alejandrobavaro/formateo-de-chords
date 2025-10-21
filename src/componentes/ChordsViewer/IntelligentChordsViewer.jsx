// src/componentes/ChordsViewer/IntelligentChordsViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useContentAnalyzer } from './ContentAnalyzer';
import TabletViewer from './Formats/TabletViewer';
import PrintViewer from './Formats/PrintViewer';
import DesktopViewer from './Formats/DesktopViewer';
import MobileViewer from './Formats/MobileViewer';
import "../../assets/scss/_03-Componentes/ChordsViewer/_IntelligentChordsViewer.scss";

const IntelligentChordsViewer = ({ song, transposition, showA4Outline, fullscreenMode }) => {
  const [currentFormat, setCurrentFormat] = useState('desktop');
  const [isPrintMode, setIsPrintMode] = useState(false);
  const analysis = useContentAnalyzer(song);
  const containerRef = useRef(null);

  // Detectar formato automáticamente basado en pantalla
  useEffect(() => {
    const detectOptimalFormat = () => {
      if (isPrintMode) return 'print';
      
      const width = window.innerWidth;
      const aspectRatio = width / window.innerHeight;
      
      // Detección precisa por formato
      if (width <= 768) {
        return 'mobile';
      } else if (width <= 1024) {
        return 'tablet';
      } else if (width > 1600 && aspectRatio > 1.4) {
        return 'desktop'; // Widescreen
      } else if (width > 1200) {
        return 'desktop'; // Desktop estándar
      } else {
        return 'tablet'; // Por defecto
      }
    };

    setCurrentFormat(detectOptimalFormat());
    
    const handleResize = () => {
      setCurrentFormat(detectOptimalFormat());
    };
    
    // Detectar modo impresión
    const handleBeforePrint = () => {
      setIsPrintMode(true);
      setCurrentFormat('print');
    };
    
    const handleAfterPrint = () => {
      setIsPrintMode(false);
      setCurrentFormat(detectOptimalFormat());
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [isPrintMode]);

  // Renderizar el visualizador apropiado
  const renderViewer = () => {
    const commonProps = { 
      song, 
      transposition, 
      showA4Outline: showA4Outline && !isPrintMode,
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
      case 'print':
        return <PrintViewer {...commonProps} />;
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
      className={`intelligent-chords-viewer format-${currentFormat} ${fullscreenMode ? 'fullscreen' : ''} ${isPrintMode ? 'print-mode' : ''}`}
    >
      {renderViewer()}
    </div>
  );
};

export default IntelligentChordsViewer;