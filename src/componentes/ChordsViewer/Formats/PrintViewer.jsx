// src/componentes/ChordsViewer/Formats/PrintViewer.jsx
import React from 'react';
import { 
  getOptimalConfig, 
  balanceColumnsIntelligently,
  renderContent 
} from '../ContentAnalyzer';
import "../../../assets/scss/_03-Componentes/ChordsViewer/Formats/_PrintViewer.scss";

const PrintViewer = ({ song, transposition, analysis }) => {
  if (!song || !analysis) {
    return (
      <div className="print-viewer loading">
        <div className="loading-message">Optimizando para impresión A4...</div>
      </div>
    );
  }

  // CONFIGURACIÓN FIJA PARA IMPRESIÓN - 2 COLUMNAS SIEMPRE
  const config = getOptimalConfig(analysis, 'print');
  
  // Forzar configuración óptima para A4
  const forcedConfig = {
    ...config,
    targetColumns: 2, // SIEMPRE 2 columnas para A4
    fontSize: Math.max(9, config.fontSize) // Mínimo 9px para legibilidad
  };

  // Balancear en 2 columnas perfectamente para A4
  const columns = balanceColumnsIntelligently(
    song.content, 
    forcedConfig.targetColumns, 
    analysis
  );

  const [col1, col2] = columns;

  return (
    <div 
      className="print-viewer a4-outline print-optimized"
      style={{ 
        fontSize: `${forcedConfig.fontSize}px`,
        gap: `${forcedConfig.gap}mm`,
        lineHeight: forcedConfig.lineHeight
      }}
    >
      {/* Header de impresión profesional */}
      <div className="print-header">
        <h1 className="song-title-print">
          {song.artist} - {song.title}
        </h1>
        <div className="print-metadata">
          <span className="metadata-item">Tono: {song.originalKey || 'N/A'}</span>
          <span className="metadata-item">Líneas: {analysis.lineCount}</span>
          <span className="metadata-item">Columnas: 2</span>
          <span className="metadata-item">Formato: A4</span>
        </div>
      </div>
      
      {/* CONTENIDO EN 2 COLUMNAS PERFECTAS PARA A4 */}
      <div className="print-columns">
        <div className="print-column column-1">
          {renderContent(col1, transposition)}
        </div>
        <div className="print-column column-2">
          {renderContent(col2, transposition)}
        </div>
      </div>
      
      {/* Footer de impresión */}
      <div className="print-footer">
        <div className="print-optimization-info">
          ✅ TEXTO COMPLETO EN 2 COLUMNAS A4 • {analysis.lineCount} líneas • 
          Optimizado para impresión • {forcedConfig.fontSize}px
        </div>
      </div>
    </div>
  );
};

export default PrintViewer;