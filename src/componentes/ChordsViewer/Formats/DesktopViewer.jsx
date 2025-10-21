// src/componentes/ChordsViewer/Formats/DesktopViewer.jsx
import React from 'react';
import { 
  getOptimalConfig, 
  balanceColumnsIntelligently,
  renderContent 
} from '../ContentAnalyzer';
import "../../../assets/scss/_03-Componentes/ChordsViewer/Formats/_DesktopViewer.scss";

const DesktopViewer = ({ song, transposition, showA4Outline, analysis, currentFormat }) => {
  if (!song || !analysis) {
    return (
      <div className="desktop-viewer loading">
        <div className="loading-message">Optimizando para 3 columnas desktop...</div>
      </div>
    );
  }

  // CONFIGURACIÓN FIJA PARA DESKTOP - 3 COLUMNAS SIEMPRE
  const config = getOptimalConfig(analysis, 'desktop');
  
  // Forzar 3 columnas para desktop
  const forcedConfig = {
    ...config,
    targetColumns: 3, // SIEMPRE 3 columnas en desktop
    fontSize: Math.max(14, config.fontSize - 1) // Ajustar fuente para 3 columnas
  };
  
  // Balancear en 3 columnas perfectamente
  const columns = balanceColumnsIntelligently(
    song.content, 
    forcedConfig.targetColumns, 
    analysis
  );

  const [col1, col2, col3] = columns;

  return (
    <div 
      className={`desktop-viewer ${showA4Outline ? 'a4-outline' : ''} columns-3 widescreen-optimized`}
      style={{ 
        fontSize: `${forcedConfig.fontSize}px`,
        gap: `${forcedConfig.gap}px`,
        lineHeight: forcedConfig.lineHeight
      }}
    >
      {/* Header optimizado para 3 columnas */}
      <div className="song-header">
        <h1 className="song-title">
          {song.artist} - {song.title}
          {song.originalKey && (
            <span className="tono-destacado"> (TONO: {song.originalKey})</span>
          )}
        </h1>
        <div className="desktop-config-info">
          💻 DESKTOP • 3 COLUMNAS • {forcedConfig.fontSize}px • {analysis.lineCount} líneas • 
          {analysis.isVeryLong ? ' CONTENIDO EXTENSO' : ' CONTENIDO OPTIMIZADO'}
        </div>
      </div>

      {/* CONTENIDO EN 3 COLUMNAS - MÁXIMO APROVECHAMIENTO DEL ANCHO */}
      <div className="chords-viewer">
        <div className="song-columns columns-3">
          {/* Columna 1 - 33% del ancho */}
          <div className="column column-1">
            {renderContent(col1, transposition)}
          </div>
          
          {/* Columna 2 - 33% del ancho */}
          <div className="column column-2">
            {renderContent(col2, transposition)}
          </div>
          
          {/* Columna 3 - 33% del ancho */}
          <div className="column column-3">
            {renderContent(col3, transposition)}
          </div>
        </div>
      </div>
      
      {/* Footer informativo */}
      <div className="desktop-footer">
        <div className="optimization-info">
          ✅ TEXTO COMPLETO EN 3 COLUMNAS • {analysis.lineCount} líneas distribuidas perfectamente • 
          Máximo aprovechamiento del espacio horizontal
        </div>
      </div>
    </div>
  );
};

export default DesktopViewer;