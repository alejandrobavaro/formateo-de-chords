import React, { useRef, useState, useEffect } from 'react';
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongViewer.scss";

const SongViewer = ({ song, transposition, showA4Outline, fullscreenMode, printViewRef }) => {
  const viewerRef = useRef(null);
  const [autoFontSize, setAutoFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [columns, setColumns] = useState([[], []]);
  const [columnCount, setColumnCount] = useState(2);
  const [needsScroll, setNeedsScroll] = useState(false);
  
  // Detectar tipo de pantalla y ajustar columnas
  useEffect(() => {
    const checkScreenType = () => {
      const width = window.innerWidth;
      const aspectRatio = width / window.innerHeight;
      
      let newColumnCount = 2;
      let scrollNeeded = false;

      if (width > 1600 && aspectRatio > 1.4) {
        // Desktop muy grande - 3 columnas
        newColumnCount = 3;
      } else if (width > 1200) {
        // Desktop - 2 columnas
        newColumnCount = 2;
      } else if (width > 768) {
        // Tablet - 2 columnas optimizadas
        newColumnCount = 2;
      } else {
        // Mobile - 1 columna
        newColumnCount = 1;
      }

      setColumnCount(newColumnCount);
      setNeedsScroll(scrollNeeded);
    };

    checkScreenType();
    window.addEventListener('resize', checkScreenType);
    
    return () => {
      window.removeEventListener('resize', checkScreenType);
    };
  }, []);

  // Pantalla completa
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

  // Transponer acordes
  const transposeChord = (chord) => {
    if (!chord || ['N.C.', '(E)', '-', '–', '', 'X'].includes(chord.trim())) {
      return chord;
    }
    
    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    
    const chordMatch = chord.match(/^([A-G](#|b)?)(.*)$/i);
    if (!chordMatch) return chord;
    
    let baseChord = chordMatch[1].toUpperCase();
    const modifier = chordMatch[3] || '';
    
    const flatToSharp = {
      'DB': 'C#', 'EB': 'D#', 'GB': 'F#', 'AB': 'G#', 'BB': 'A#',
      'D♭': 'C#', 'E♭': 'D#', 'G♭': 'F#', 'A♭': 'G#', 'B♭': 'A#',
      'CB': 'B', 'FB': 'E'
    };
    
    baseChord = flatToSharp[baseChord] || baseChord;
    
    const chordIndex = chords.indexOf(baseChord);
    if (chordIndex === -1) return chord;
    
    const newChordIndex = (chordIndex + transposition + 12) % 12;
    return chords[newChordIndex] + modifier;
  };

  // Analizar contenido y ajustar layout
  useEffect(() => {
    const analyzeAndAdjustLayout = () => {
      if (!song || !song.content) return;

      // Calcular densidad de contenido
      let totalElements = 0;
      let totalCharacters = 0;

      const countElements = (items) => {
        items.forEach(item => {
          totalElements++;
          
          if (item.name) totalCharacters += item.name.length;
          if (item.content) {
            if (Array.isArray(item.content)) {
              totalCharacters += item.content.join('').length;
            } else {
              totalCharacters += item.content.toString().length;
            }
          }
          
          if (item.lines) {
            countElements(item.lines);
          }
        });
      };

      countElements(song.content);

      // AJUSTE INTELIGENTE MEJORADO de tamaño de fuente
      const densityFactor = (totalElements * totalCharacters) / 1000;
      const width = window.innerWidth;
      
      let optimalFontSize = 16;
      let willNeedScroll = false;

      // Ajuste más agresivo para diferentes dispositivos
      if (width > 1600) {
        // Desktop grande - puede usar fuente más grande
        if (densityFactor > 250) {
          optimalFontSize = 12;
          willNeedScroll = true;
        } else if (densityFactor > 180) {
          optimalFontSize = 13;
        } else if (densityFactor > 120) {
          optimalFontSize = 14;
        } else if (densityFactor > 70) {
          optimalFontSize = 15;
        } else {
          optimalFontSize = 16;
        }
      } else if (width > 1200) {
        // Desktop estándar
        if (densityFactor > 200) {
          optimalFontSize = 11;
          willNeedScroll = true;
        } else if (densityFactor > 150) {
          optimalFontSize = 12;
        } else if (densityFactor > 100) {
          optimalFontSize = 13;
        } else if (densityFactor > 60) {
          optimalFontSize = 14;
        } else if (densityFactor > 30) {
          optimalFontSize = 15;
        } else {
          optimalFontSize = 16;
        }
      } else if (width > 768) {
        // Tablet - optimizado para pantalla táctil
        if (densityFactor > 150) {
          optimalFontSize = 12;
          willNeedScroll = true;
        } else if (densityFactor > 100) {
          optimalFontSize = 13;
        } else if (densityFactor > 70) {
          optimalFontSize = 14;
        } else if (densityFactor > 40) {
          optimalFontSize = 15;
        } else {
          optimalFontSize = 16;
        }
      } else {
        // Mobile
        if (densityFactor > 100) {
          optimalFontSize = 12;
          willNeedScroll = true;
        } else if (densityFactor > 70) {
          optimalFontSize = 13;
        } else if (densityFactor > 50) {
          optimalFontSize = 14;
        } else {
          optimalFontSize = 15;
        }
      }

      // Aplicar límites razonables
      optimalFontSize = Math.max(10, Math.min(18, optimalFontSize));
      
      setAutoFontSize(optimalFontSize);
      setNeedsScroll(willNeedScroll);

      // Balancear columnas SECUENCIALMENTE
      balanceColumnsSequentially(song.content, columnCount);
    };

    const balanceColumnsSequentially = (content, numColumns) => {
      if (!content || content.length === 0) {
        setColumns(Array(numColumns).fill().map(() => []));
        return;
      }

      const columns = Array(numColumns).fill().map(() => []);
      
      if (numColumns === 1) {
        // 1 columna - todo en la primera
        columns[0] = content;
      } else if (numColumns === 2) {
        // 2 columnas - división 60/40 aproximadamente
        const splitIndex = Math.ceil(content.length * 0.6);
        columns[0] = content.slice(0, splitIndex);
        columns[1] = content.slice(splitIndex);
      } else {
        // 3 columnas - división 40/35/25 aproximadamente
        const firstSplit = Math.ceil(content.length * 0.4);
        const secondSplit = Math.ceil(content.length * 0.75);
        columns[0] = content.slice(0, firstSplit);
        columns[1] = content.slice(firstSplit, secondSplit);
        columns[2] = content.slice(secondSplit);
      }

      setColumns(columns);
    };

    analyzeAndAdjustLayout();
  }, [song, columnCount]);

  // Procesar líneas para combinar acordes con letras
  const processLines = (lines) => {
    if (!lines) return [];
    
    const processedLines = [];
    let currentLine = { chords: [], lyric: null };
    
    lines.forEach((item) => {
      if (item.type === "chord" || item.type === "chords") {
        if (item.type === "chord") {
          currentLine.chords.push(item.content);
        } else {
          currentLine.chords = [...currentLine.chords, ...item.content];
        }
      } 
      else if (item.type === "lyric") {
        if (currentLine.chords.length > 0) {
          currentLine.lyric = item.content;
          processedLines.push({ type: "combined", ...currentLine });
          currentLine = { chords: [], lyric: null };
        } else {
          processedLines.push(item);
        }
      }
      else {
        if (currentLine.chords.length > 0) {
          processedLines.push({ type: "combined", ...currentLine });
          currentLine = { chords: [], lyric: null };
        }
        processedLines.push(item);
      }
    });
    
    if (currentLine.chords.length > 0) {
      processedLines.push({ type: "combined", ...currentLine });
    }
    
    return processedLines;
  };

  // Renderizar contenido
  const renderContent = (content) => {
    if (!content) return null;
    
    return content.map((item, index) => {
      switch (item.type) {
        case "section":
          return (
            <React.Fragment key={index}>
              <div className="section-header">
                <span className="section-title">{item.name?.toUpperCase() || 'SECCIÓN'}</span>
              </div>
              {item.lines && renderContent(processLines(item.lines))}
            </React.Fragment>
          );
        
        case "voice":
          return (
            <div key={index} className={`voice-section voice-${item.color || 'default'}`}>
              <div className="voice-label-horizontal">
                <span className="voice-name">{item.name || 'VOZ'}</span>
              </div>
              <div className="voice-content">
                {item.lines && renderContent(processLines(item.lines))}
              </div>
            </div>
          );
        
        case "combined":
          return (
            <div key={index} className="song-line-combined">
              <div className="chords-line">
                {item.chords.map((chord, i) => (
                  <span key={i} className="chord">
                    {transposeChord(chord)}
                  </span>
                ))}
              </div>
              {item.lyric && (
                <div className="lyrics-line">
                  {item.lyric}
                </div>
              )}
            </div>
          );
        
        case "chords":
          return (
            <div key={index} className="song-line">
              <div className="chords-line">
                {item.content.map((chord, i) => (
                  <span key={i} className="chord">
                    {transposeChord(chord)}
                  </span>
                ))}
              </div>
            </div>
          );
        
        case "chord":
          return (
            <div key={index} className="song-line">
              <div className="chords-line">
                <span className="chord">{transposeChord(item.content)}</span>
              </div>
            </div>
          );
        
        case "lyric":
          return (
            <div key={index} className="song-line">
              <div className="lyrics-line">{item.content}</div>
            </div>
          );
        
        case "text":
          return (
            <div key={index} className="song-line">
              <div className="text-line">{item.content}</div>
            </div>
          );
        
        case "divider":
          return (
            <div key={index} className="section-divider"></div>
          );
        
        default:
          return null;
      }
    });
  };

  const [firstColumn, secondColumn, thirdColumn] = columns;

  if (!song) {
    return <div className="song-loading">Cargando...</div>;
  }

  return (
    <div className={`song-viewer ${showA4Outline ? 'a4-outline' : ''} ${isFullscreen ? 'fullscreen' : ''} columns-${columnCount} ${needsScroll ? 'needs-scroll' : ''}`} ref={viewerRef}>
      
      {/* Botón pantalla completa */}
      <button className="fullscreen-toggle" onClick={toggleFullscreen}>
        {isFullscreen ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* Vista impresión - SOLO ACORDES, NADA MÁS */}
      <div className="print-container">
        <div 
          className="print-view" 
          ref={printViewRef}
          style={{
            fontSize: '14px',
            width: '210mm',
            minHeight: '297mm',
            height: 'auto'
          }}
        >
          <div className="chords-content-print">
            <div className="song-columns-print">
              <div className="column-print">
                {firstColumn && renderContent(firstColumn)}
              </div>
              <div className="column-print">
                {secondColumn && renderContent(secondColumn)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="song-header">
        <h1 className="song-title">
          {song.artist} - {song.title}
          {song.originalKey && (
            <span className="tono-destacado"> (TONO: {transposeChord(song.originalKey)})</span>
          )}
        </h1>
      </div>

      <div className="chords-viewer" style={{ fontSize: `${autoFontSize}px` }}>
        <div className={`song-columns columns-${columnCount}`}>
          {/* Columna 1 - Siempre se llena primero */}
          <div className="column column-1">
            {firstColumn && renderContent(firstColumn)}
          </div>
          
          {/* Columna 2 - Se llena después de la columna 1 */}
          {columnCount >= 2 && (
            <div className="column column-2">
              {secondColumn && renderContent(secondColumn)}
            </div>
          )}
          
          {/* Columna 3 - Solo en widescreen, se llena después de la columna 2 */}
          {columnCount >= 3 && (
            <div className="column column-3">
              {thirdColumn && renderContent(thirdColumn)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongViewer;