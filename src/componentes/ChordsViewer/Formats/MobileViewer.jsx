// src/componentes/ChordsViewer/Formats/MobileViewer.jsx
import React from 'react';
import { 
  getOptimalConfig,
  renderContent
} from '../ContentAnalyzer';
import "../../../assets/scss/_03-Componentes/ChordsViewer/Formats/_MobileViewer.scss";

const MobileViewer = ({ song, transposition, analysis, currentFormat }) => {
  if (!song || !analysis) {
    return (
      <div className="mobile-viewer loading">
        <div className="loading-message">Optimizando para móvil...</div>
      </div>
    );
  }

  // CONFIGURACIÓN INTELIGENTE PARA MOBILE
  const config = getOptimalConfig(analysis, 'mobile');

  return (
    <div 
      className="mobile-viewer"
      style={{ 
        fontSize: `${config.fontSize}px`
      }}
    >
      {/* Header móvil */}
      <div className="mobile-header">
        <h1 className="song-title-mobile">
          {song.artist} - {song.title}
          {song.originalKey && (
            <span className="tono-destacado"> (TONO: {song.originalKey})</span>
          )}
        </h1>
      </div>

      {/* CONTENIDO COMPLETO CON SCROLL AUTOMÁTICO */}
      <div className="chords-viewer">
        <div className="song-columns columns-1">
          <div className="column column-1">
            {renderContent(song.content, transposition)}
          </div>
        </div>
      </div>

      {/* Footer informativo solo para canciones largas */}
      {analysis.lineCount > 100 && (
        <div className="mobile-footer">
          <div className="mobile-optimization-info">
            📱 Mobile • {config.fontSize}px • {analysis.lineCount} líneas
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileViewer;