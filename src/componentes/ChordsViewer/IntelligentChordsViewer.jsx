// ============================================
// ARCHIVO: IntelligentChordsViewer.jsx - VERSIÓN CORREGIDA
// CORRECCIÓN: Asegura que pasa analysis a todos los visualizadores
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import DesktopViewer from './Formats/DesktopViewer';
import MobileViewer from './Formats/MobileViewer';
import TabletViewer from './Formats/TabletViewer';
import { useContentAnalyzer } from './ContentAnalyzer';
import "../../assets/scss/_03-Componentes/ChordsViewer/_IntelligentChordsViewer.scss";

const IntelligentChordsViewer = ({ song, transposition, showA4Outline, fullscreenMode }) => {
  const [currentFormat, setCurrentFormat] = useState('desktop');
  const containerRef = useRef(null);
  
  // ANÁLISIS DEL CONTENIDO
  const analyzeContent = useContentAnalyzer(song);
  const analysis = analyzeContent();
  
  // DEBUG
  useEffect(() => {
    if (song && analysis) {
      console.log('🔍 IntelligentChordsViewer - Datos:', {
        songTitle: song.title,
        transposition: transposition,
        analysis: analysis ? 'Disponible' : 'No disponible',
        contentProcessed: analysis?.contentProcessed?.length || 0,
        chordCount: analysis?.chordCount || 0
      });
    }
  }, [song, transposition, analysis]);

  // DETECCIÓN DE FORMATO RESPONSIVE
  useEffect(() => {
    const detectOptimalFormat = () => {
      const width = window.innerWidth;
      
      if (width <= 768) {
        return 'mobile';
      } else if (width <= 1024) {
        return 'tablet';
      } else {
        return 'desktop';
      }
    };

    setCurrentFormat(detectOptimalFormat());
    
    const handleResize = () => {
      setCurrentFormat(detectOptimalFormat());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // RENDERIZAR VISUALIZADOR APROPIADO
  const renderViewer = () => {
    if (!song || !analysis) {
      return (
        <div className="error-missing-content">
          <h3>Error en procesamiento</h3>
          <p>No se pudo analizar la canción.</p>
        </div>
      );
    }
    
    const commonProps = { 
      song, 
      transposition,
      showA4Outline,
      currentFormat,
      analysis  // ✅ Pasar analysis a todos los visualizadores
    };
    
    switch (currentFormat) {
      case 'mobile':
        return <MobileViewer {...commonProps} />;
      case 'tablet':
        return <TabletViewer {...commonProps} />;
      default:
        return <DesktopViewer {...commonProps} />;
    }
  };

  if (!song) {
    return (
      <div className="intelligent-chords-viewer no-song">
        <div className="no-song-message">
          <h2>Visualizador de Acordes Inteligente</h2>
          <p>Reproduce una canción desde la lista para ver sus acordes</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="intelligent-chords-viewer analyzing">
        <div className="analyzing-message">
          <h2>Analizando canción...</h2>
          <p>Procesando estructura musical de "{song.title}"</p>
          <div className="loading-spinner"></div>
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