import React, { useRef, useState, useEffect } from 'react';
import { BsDownload, BsPrinter } from "react-icons/bs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../assets/scss/_03-Componentes/ChordsViewer/_SongViewer.scss";

const SongViewer = ({ song, fontSize, transposition, showA4Outline }) => {
  const printViewRef = useRef(null);
  const [contentScale, setContentScale] = useState(1);
  const [autoFontSize, setAutoFontSize] = useState(fontSize);
  
  // Función para transponer acordes
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

  // Funciones de exportación
  const handleExportPDF = async () => {
    const element = printViewRef.current;
    if (!element) return;
    
    const pdf = new jsPDF("p", "mm", "a4");
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 210,
        height: 297,
        windowWidth: 210,
        windowHeight: 297
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${song.artist} - ${song.title}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportJPG = async () => {
    const element = printViewRef.current;
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 210,
        height: 297
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${song.artist} - ${song.title}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error exporting JPG:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Ajustar escala automáticamente según el contenido
  useEffect(() => {
    const adjustScale = () => {
      if (!song || !song.content) return;
      
      // Calcular densidad de contenido
      const totalLines = song.content.reduce((count, item) => {
        if (item.type === "voice" && item.lines) {
          return count + item.lines.length;
        }
        return count + 1;
      }, 0);
      
      // Ajustar tamaño de fuente basado en densidad de contenido
      let calculatedFontSize = fontSize;
      
      if (totalLines > 50) {
        calculatedFontSize = Math.max(8, fontSize - 3);
      } else if (totalLines > 40) {
        calculatedFontSize = Math.max(9, fontSize - 2);
      } else if (totalLines > 30) {
        calculatedFontSize = Math.max(10, fontSize - 1);
      } else if (totalLines < 15) {
        calculatedFontSize = Math.min(18, fontSize + 3);
      } else if (totalLines < 20) {
        calculatedFontSize = Math.min(17, fontSize + 2);
      } else if (totalLines < 25) {
        calculatedFontSize = Math.min(16, fontSize + 1);
      }
      
      setAutoFontSize(calculatedFontSize);
      
      // Ajustar escala para vista de impresión
      const content = printViewRef.current;
      if (!content) return;
      
      const contentHeight = content.scrollHeight;
      const maxHeight = 280;
      const scale = Math.min(1, maxHeight / contentHeight);
      
      setContentScale(scale);
    };

    adjustScale();
  }, [song, fontSize]);

  // Función para procesar líneas
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

  // Renderizar contenido con tamaño automático
  const renderContent = (content) => {
    if (!content) return null;
    
    return content.map((item, index) => {
      switch (item.type) {
        case "section":
          return (
            <React.Fragment key={index}>
              <div className="section-header">
                <span className="section-title">{item.name.toUpperCase()}</span>
              </div>
              {item.lines && renderContent(processLines(item.lines))}
            </React.Fragment>
          );
        
        case "voice":
          return (
            <div key={index} className={`voice-section voice-${item.color}`}>
              <div className="voice-label-vertical">
                <span>{item.name}</span>
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

  const [firstColumn, secondColumn] = song && song.content ? 
    [song.content.slice(0, Math.ceil(song.content.length / 2)), 
     song.content.slice(Math.ceil(song.content.length / 2))] : 
    [[], []];

  if (!song) {
    return <div className="song-loading">Cargando canción...</div>;
  }

  return (
    <div className={`song-viewer ${showA4Outline ? 'a4-outline' : ''}`}>
      {/* Vista de impresión/exportación */}
      <div className="print-container">
        <div 
          className="print-view" 
          ref={printViewRef}
          style={{
            transform: `scale(${contentScale})`,
            transformOrigin: 'top center',
            fontSize: `${autoFontSize}px`
          }}
        >
          <div className="song-header-print">
            <h1 className="song-title-print">
              {song.artist} - {song.title} (TONO: {transposeChord(song.originalKey)})
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

      {/* Contenido principal visible */}
      <div className="song-header">
        <h1 className="song-title">
          {song.artist} - {song.title} (TONO: {transposeChord(song.originalKey)})
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

      <div className="export-buttons">
        <button onClick={handleExportPDF} className="export-btn">
          <BsDownload /> PDF
        </button>
        <button onClick={handleExportJPG} className="export-btn">
          <BsDownload /> JPG
        </button>
        <button onClick={handlePrint} className="export-btn">
          <BsPrinter /> Imprimir
        </button>
      </div>
    </div>
  );
};

export default SongViewer;