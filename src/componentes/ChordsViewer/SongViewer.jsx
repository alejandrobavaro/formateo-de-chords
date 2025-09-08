import React, { useRef, useState, useEffect } from 'react';
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongViewer.scss";

const SongViewer = ({ song, transposition, showA4Outline, fullscreenMode, printViewRef }) => {
  const viewerRef = useRef(null);
  const [autoFontSize, setAutoFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [columns, setColumns] = useState([[], []]);
  
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

  // Ajustar tamaño de fuente basado en el contenido
  useEffect(() => {
    const adjustFontSize = () => {
      if (!song || !song.content) return;
      
      // Calcular densidad de contenido
      const calculateContentDensity = (content) => {
        if (!content) return 0;
        
        let totalElements = 0;
        
        content.forEach(item => {
          totalElements += 1;
          if (item.lines) {
            totalElements += calculateContentDensity(item.lines);
          }
        });
        
        return totalElements;
      };
      
      const totalElements = calculateContentDensity(song.content);
      
      // Ajustar tamaño de fuente basado en la densidad
      if (totalElements > 100) {
        setAutoFontSize(11);
      } else if (totalElements > 70) {
        setAutoFontSize(12);
      } else if (totalElements > 40) {
        setAutoFontSize(13);
      } else {
        setAutoFontSize(14);
      }
      
      // Balancear columnas
      const balancedColumns = balanceColumns(song.content);
      setColumns(balancedColumns);
    };

    adjustFontSize();
  }, [song]);

  // Balancear columnas
  const balanceColumns = (content) => {
    if (!content || content.length === 0) return [[], []];
    
    const elementWeights = content.map(item => {
      if (item.type === "section") return 3;
      if (item.type === "voice") return item.lines ? item.lines.length + 2 : 2;
      if (item.type === "combined") return 1.5;
      if (item.type === "chords") return 1.2;
      if (item.type === "chord") return 1.1;
      if (item.type === "lyric") return 1;
      if (item.type === "text") return 0.8;
      if (item.type === "divider") return 0.3;
      return 1;
    });
    
    const totalWeight = elementWeights.reduce((sum, weight) => sum + weight, 0);
    const targetWeight = totalWeight / 2;
    
    let currentWeight = 0;
    let splitIndex = 0;
    
    for (let i = 0; i < elementWeights.length; i++) {
      currentWeight += elementWeights[i];
      
      if (currentWeight >= targetWeight) {
        if (i < content.length - 1 && 
            (content[i + 1].type === "section" || content[i + 1].type === "voice")) {
          splitIndex = i + 1;
        } else {
          splitIndex = i + 1;
        }
        break;
      }
    }
    
    splitIndex = Math.max(1, Math.min(splitIndex, content.length - 1));
    
    return [content.slice(0, splitIndex), content.slice(splitIndex)];
  };

  // Procesar líneas
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

  const [firstColumn, secondColumn] = columns;

  if (!song) {
    return <div className="song-loading">Cargando...</div>;
  }

  return (
    <div className={`song-viewer ${showA4Outline ? 'a4-outline' : ''} ${isFullscreen ? 'fullscreen' : ''}`} ref={viewerRef}>
      
      {/* Botón pantalla completa */}
      <button className="fullscreen-toggle" onClick={toggleFullscreen}>
        {isFullscreen ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* Vista impresión - SCROLL NATURAL */}
      <div className="print-container">
        <div 
          className="print-view" 
          ref={printViewRef}
          style={{
            fontSize: `${autoFontSize}px`,
            width: '210mm',
            minHeight: '297mm',
            height: 'auto'
          }}
        >
          <div className="song-header-print">
            <h1 className="song-title-print">
              {song.artist} - {song.title} 
              {song.originalKey && (
                <span className="tono-destacado"> (TONO: {transposeChord(song.originalKey)})</span>
              )}
            </h1>
          </div>

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

      {/* Contenido principal - SCROLL NATURAL */}
      <div className="song-header">
        <h1 className="song-title">
          {song.artist} - {song.title}
          {song.originalKey && (
            <span className="tono-destacado"> (TONO: {transposeChord(song.originalKey)})</span>
          )}
        </h1>
      </div>

      <div className="chords-viewer" style={{ fontSize: `${autoFontSize}px` }}>
        <div className="song-columns">
          <div className="column">
            {firstColumn && renderContent(firstColumn)}
          </div>
          <div className="column">
            {secondColumn && renderContent(secondColumn)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongViewer;