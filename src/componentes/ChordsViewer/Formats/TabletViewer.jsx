// src/componentes/ChordsViewer/Formats/TabletViewer.jsx
import React from 'react';
import { 
  getOptimalConfig, 
  balanceColumnsIntelligently,
  renderContent 
} from '../ContentAnalyzer';
import "../../../assets/scss/_03-Componentes/ChordsViewer/Formats/_TabletViewer.scss";

const TabletViewer = ({ song, transposition, showA4Outline, analysis, currentFormat }) => {
  if (!song || !analysis) {
    return (
      <div className="tablet-viewer loading">
        <div className="loading-message">Optimizando para 2 columnas tablet...</div>
      </div>
    );
  }

  // CONFIGURACIÓN FIJA PARA TABLET - 2 COLUMNAS SIEMPRE
  const config = getOptimalConfig(analysis, 'tablet');
  
  // Forzar 2 columnas para tablet
  const forcedConfig = {
    ...config,
    targetColumns: 2 // SIEMPRE 2 columnas en tablet
  };

  // Balancear en 2 columnas perfectamente
  const columns = balanceColumnsIntelligently(
    song.content, 
    forcedConfig.targetColumns, 
    analysis
  );

  const [col1, col2] = columns;

  return (
    <div 
      className={`tablet-viewer ${showA4Outline ? 'a4-outline' : ''} columns-2 tablet-optimized`}
      style={{ 
        fontSize: `${forcedConfig.fontSize}px`,
        gap: `${forcedConfig.gap}px`,
        lineHeight: forcedConfig.lineHeight
      }}
    >
      {/* Header optimizado para tablet */}
      <div className="song-header">
        <h1 className="song-title">
          {song.artist} - {song.title}
          {song.originalKey && (
            <span className="tono-destacado"> (TONO: {song.originalKey})</span>
          )}
        </h1>
        <div className="tablet-info-badge">
          📟 TABLET • 2 COLUMNAS • {forcedConfig.fontSize}px • {analysis.lineCount} líneas
        </div>
      </div>

      {/* CONTENIDO EN 2 COLUMNAS VERTICALES - FORMATO TABLET */}
      <div className="chords-viewer">
        <div className="song-columns columns-2">
          {/* Columna 1 - 50% del ancho */}
          <div className="column column-1">
            {renderContent(col1, transposition)}
          </div>
          {/* Columna 2 - 50% del ancho */}
          <div className="column column-2">
            {renderContent(col2, transposition)}
          </div>
        </div>
      </div>
      
      {/* Footer informativo */}
      <div className="tablet-footer">
        <div className="optimization-info">
          ✅ TEXTO COMPLETO EN 2 COLUMNAS • {analysis.lineCount} líneas • 
          Formato vertical optimizado para tablet
        </div>
      </div>
    </div>
  );
};

export default TabletViewer;