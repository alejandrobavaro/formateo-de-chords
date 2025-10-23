// src/componentes/ChordsViewer/Formats/PrintViewer.jsx
import React from 'react';
import { 
  getOptimalConfig, 
  balanceColumnsIntelligently,
  renderContent,
  getTranspositionInfo,
  getFormatInfo
} from '../ContentAnalyzer';
import "../../../assets/scss/_03-Componentes/ChordsViewer/Formats/_PrintViewer.scss";

const PrintViewer = ({ song, transposition, analysis }) => {
  if (!song || !analysis) {
    return null;
  }

  // CONFIGURACIÓN ULTRA COMPACTA PARA 1 HOJA A4
  const config = getOptimalConfig(analysis, 'print');
  
  const printConfig = {
    ...config,
    targetColumns: 2,
    fontSize: Math.max(9, config.fontSize),
    gap: 1,
    lineHeight: 1.1,
    compactMode: true
  };

  // Balancear en 2 columnas
  const columns = balanceColumnsIntelligently(
    song.content, 
    printConfig.targetColumns, 
    analysis
  );

  const [col1, col2] = columns;

  // Información de transposición
  const transpositionInfo = getTranspositionInfo(transposition, song.originalKey);
  
  // Información del formato
  const formatInfo = getFormatInfo('print', printConfig.fontSize, analysis.lineCount, analysis.isComplex);

  return (
    <div 
      className="print-viewer print-ultra-compact"
      style={{ 
        fontSize: `${printConfig.fontSize}px`,
        gap: `${printConfig.gap}mm`,
        lineHeight: printConfig.lineHeight
      }}
    >
      {/* CONTENIDO EN 2 COLUMNAS - TODO EN UNA MISMA PÁGINA */}
      <div className="print-content">
        
        {/* HEADER COMPACTO INTEGRADO EN LA MISMA PÁGINA */}
        <div className="print-header-integrated">
          <div className="song-title-print">
            <strong>{song.artist} - {song.title}</strong>
            {transpositionInfo && (
              <span className="transposition-info">{transpositionInfo}</span>
            )}
            {song.originalKey && (
              <span className="tono-destacado"> (TONO: {song.originalKey})</span>
            )}
          </div>
          <div className="print-format-info">
            {formatInfo}
          </div>
        </div>

        <div className="print-columns columns-2">
          <div className="print-column column-1">
            {renderContent(col1, transposition, {
              isPrint: true,
              ensureCompleteContent: true,
              compactMode: true,
              currentFormat: 'print'
            })}
          </div>
          <div className="print-column column-2">
            {renderContent(col2, transposition, {
              isPrint: true, 
              ensureCompleteContent: true,
              compactMode: true,
              currentFormat: 'print'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintViewer;