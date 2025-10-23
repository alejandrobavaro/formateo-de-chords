// src/componentes/ChordsViewer/ContentAnalyzer.jsx
import React from 'react';

// CONFIGURACIÓN INTELIGENTE BASADA EN ANÁLISIS REAL DEL CONTENIDO
export const FORMAT_CONFIG = {
  // 📱 MOBILE - 1 COLUMNA SIEMPRE, AJUSTE INTELIGENTE DE TAMAÑO
  mobile: {
    columns: 1,
    maxCharsPerLine: 30,
    // Tamaños basados en densidad REAL de contenido
    sizeBands: {
      MUY_BAJA: { maxLines: 50, fontSize: 18, lineHeight: 1.3 },    // 0-50 líneas: Grande
      BAJA: { maxLines: 100, fontSize: 16, lineHeight: 1.3 },       // 51-100 líneas: Ideal
      MEDIA: { maxLines: 180, fontSize: 14, lineHeight: 1.2 },      // 101-180 líneas: Compacto
      ALTA: { maxLines: 300, fontSize: 13, lineHeight: 1.2 },       // 181-300 líneas: Muy compacto
      MUY_ALTA: { maxLines: Infinity, fontSize: 12, lineHeight: 1.1 } // 300+ líneas: Ultra compacto
    }
  },
  
  // 📟 TABLET - 2 COLUMNAS SIEMPRE, OPTIMIZADO PARA LECTURA
  tablet: {
    columns: 2,
    maxCharsPerLine: 25,
    sizeBands: {
      MUY_BAJA: { maxLines: 60, fontSize: 20, gap: 25, lineHeight: 1.4 },
      BAJA: { maxLines: 120, fontSize: 18, gap: 23, lineHeight: 1.3 },
      MEDIA: { maxLines: 200, fontSize: 16, gap: 20, lineHeight: 1.3 },
      ALTA: { maxLines: 350, fontSize: 15, gap: 18, lineHeight: 1.2 },
      MUY_ALTA: { maxLines: Infinity, fontSize: 14, gap: 16, lineHeight: 1.2 }
    }
  },
  
  // 💻 DESKTOP - 3 COLUMNAS SIEMPRE, MÁXIMO APROVECHAMIENTO
  desktop: {
    columns: 3,
    maxCharsPerLine: 20,
    sizeBands: {
      MUY_BAJA: { maxLines: 70, fontSize: 22, gap: 25, lineHeight: 1.4 },   // Muy grande para poco contenido
      BAJA: { maxLines: 140, fontSize: 20, gap: 22, lineHeight: 1.3 },      // Grande para buen espacio
      MEDIA: { maxLines: 250, fontSize: 18, gap: 20, lineHeight: 1.3 },     // Ideal para contenido medio
      ALTA: { maxLines: 400, fontSize: 16, gap: 18, lineHeight: 1.2 },      // Compacto para mucho contenido
      MUY_ALTA: { maxLines: Infinity, fontSize: 15, gap: 16, lineHeight: 1.2 } // Muy compacto para contenido masivo
    }
  },
  
  // 🖨️ PRINT - 2 COLUMNAS A4, OPTIMIZADO PARA PAPEL
  print: {
    columns: 2,
    maxCharsPerLine: 28,
    charsPerPage: 2800,
    sizeBands: {
      MUY_BAJA: { maxLines: 80, fontSize: 14, gap: 12, lineHeight: 1.3 },
      BAJA: { maxLines: 160, fontSize: 12, gap: 11, lineHeight: 1.2 },
      MEDIA: { maxLines: 280, fontSize: 11, gap: 10, lineHeight: 1.2 },
      ALTA: { maxLines: 450, fontSize: 10, gap: 9, lineHeight: 1.1 },
      MUY_ALTA: { maxLines: Infinity, fontSize: 9, gap: 8, lineHeight: 1.1 }
    }
  }
};

// ANÁLISIS INTELIGENTE MEJORADO - CONTABILIZACIÓN REAL
export const useContentAnalyzer = (song) => {
  const analyzeContent = () => {
    if (!song || !song.content) return null;
    
    let metrics = {
      totalElements: 0,
      totalCharacters: 0,
      lineCount: 0,
      chordCount: 0,
      sectionCount: 0,
      voiceCount: 0,
      maxLineLength: 0,
      estimatedPages: 1,
      complexityScore: 0,
      densityBand: 'MEDIA',
      // Nuevas métricas para decisiones más inteligentes
      avgLineLength: 0,
      chordDensity: 0,
      structureComplexity: 0,
      contentDensity: 0
    };

    const analyzeItems = (items, depth = 0) => {
      items.forEach(item => {
        metrics.totalElements++;
        
        // ANÁLISIS DETALLADO POR TIPO DE ELEMENTO
        switch (item.type) {
          case 'section':
            metrics.sectionCount++;
            metrics.lineCount += 2; // Título + espacio
            if (item.name) {
              metrics.totalCharacters += item.name.length;
              metrics.maxLineLength = Math.max(metrics.maxLineLength, item.name.length);
            }
            break;
            
          case 'voice':
            metrics.voiceCount++;
            metrics.lineCount += 1.5; // Etiqueta + espacio
            if (item.name) {
              metrics.totalCharacters += item.name.length;
              metrics.maxLineLength = Math.max(metrics.maxLineLength, item.name.length);
            }
            break;
            
          case 'chord':
          case 'chords':
            metrics.chordCount++;
            metrics.lineCount += 0.8; // Línea de acordes
            const chords = Array.isArray(item.content) ? item.content : [item.content];
            chords.forEach(chord => {
              if (chord && !['-', '–', '', 'X', 'N.C.', '(E)'].includes(chord.trim())) {
                metrics.totalCharacters += chord.length;
                metrics.maxLineLength = Math.max(metrics.maxLineLength, chord.length);
              }
            });
            break;
            
          case 'lyric':
            metrics.lineCount += 1.2; // Línea de letra + espacio
            if (item.content) {
              metrics.totalCharacters += item.content.length;
              metrics.maxLineLength = Math.max(metrics.maxLineLength, item.content.length);
            }
            break;
            
          case 'text':
            metrics.lineCount += 1; // Línea de texto
            if (item.content) {
              metrics.totalCharacters += item.content.length;
              metrics.maxLineLength = Math.max(metrics.maxLineLength, item.content.length);
            }
            break;
            
          case 'combined':
            metrics.lineCount += 1.5; // Acordes + letra
            if (item.chords) {
              item.chords.forEach(chord => {
                if (chord) metrics.totalCharacters += chord.length;
              });
            }
            if (item.lyric) {
              metrics.totalCharacters += item.lyric.length;
              metrics.maxLineLength = Math.max(metrics.maxLineLength, item.lyric.length);
            }
            break;
            
          case 'divider':
            metrics.lineCount += 0.5; // Espacio visual
            break;
            
          default:
            metrics.lineCount += 1;
        }
        
        // ANÁLISIS RECURSIVO
        if (item.lines) analyzeItems(item.lines, depth + 1);
        if (item.content && Array.isArray(item.content)) {
          item.content.forEach(subItem => {
            if (typeof subItem === 'object' && subItem.lines) {
              analyzeItems(subItem.lines, depth + 1);
            }
          });
        }
      });
    };

    analyzeItems(song.content);
    
    // CÁLCULOS INTELIGENTES MEJORADOS
    metrics.lineCount = Math.max(1, Math.ceil(metrics.lineCount));
    metrics.avgLineLength = metrics.totalCharacters / Math.max(1, metrics.lineCount);
    metrics.chordDensity = metrics.chordCount / Math.max(1, metrics.lineCount);
    
    // SCORE DE COMPLEJIDAD MEJORADO (0-100)
    metrics.complexityScore = Math.min(100,
      (metrics.lineCount * 0.25) +           // Peso líneas: 25%
      (metrics.sectionCount * 4) +           // Peso secciones: 40%
      (metrics.voiceCount * 5) +             // Peso voces: 25%
      (metrics.maxLineLength * 0.1) +        // Peso longitud: 10%
      (metrics.chordDensity * 20)            // Peso densidad acordes: 20%
    );
    
    // DENSIDAD DE CONTENIDO (0-1)
    metrics.contentDensity = Math.min(1, 
      (metrics.totalCharacters / 5000) +     // Caracteres totales
      (metrics.lineCount / 300)              // Líneas totales
    );
    
    // COMPLEJIDAD ESTRUCTURAL
    metrics.structureComplexity = Math.min(1,
      (metrics.sectionCount / 10) +
      (metrics.voiceCount / 5)
    );
    
    // ESTIMACIÓN DE PÁGINAS MÁS PRECISA
    const adjustedCharsPerPage = FORMAT_CONFIG.print.charsPerPage * 
      (1 - metrics.contentDensity * 0.3); // Menos chars por página si es denso
    metrics.estimatedPages = Math.max(1, Math.ceil(metrics.totalCharacters / adjustedCharsPerPage));
    
    // BANDA DE DENSIDAD INTELIGENTE
    if (metrics.lineCount <= 50) metrics.densityBand = 'MUY_BAJA';
    else if (metrics.lineCount <= 100) metrics.densityBand = 'BAJA';
    else if (metrics.lineCount <= 200) metrics.densityBand = 'MEDIA';
    else if (metrics.lineCount <= 350) metrics.densityBand = 'ALTA';
    else metrics.densityBand = 'MUY_ALTA';
    
    // MÉTRICAS PARA DECISIONES
    metrics.isVeryShort = metrics.lineCount <= 50;
    metrics.isShort = metrics.lineCount <= 100;
    metrics.isMedium = metrics.lineCount <= 200;
    metrics.isLong = metrics.lineCount > 200;
    metrics.isVeryLong = metrics.lineCount > 350;
    metrics.isMassive = metrics.lineCount > 500;
    metrics.hasManySections = metrics.sectionCount > 8;
    metrics.hasManyVoices = metrics.voiceCount > 3;
    metrics.isComplex = metrics.complexityScore > 60;
    metrics.isVeryComplex = metrics.complexityScore > 80;
    metrics.hasLongLines = metrics.maxLineLength > 40;
    metrics.isDense = metrics.contentDensity > 0.7;
    
    return metrics;
  };

  return analyzeContent();
};

// ALGORITMO MEJORADO DE CONFIGURACIÓN ÓPTIMA
export const getOptimalConfig = (metrics, format) => {
  if (!metrics) return { ...FORMAT_CONFIG[format].sizeBands.MEDIA, targetColumns: FORMAT_CONFIG[format].columns };
  
  const config = FORMAT_CONFIG[format];
  const { lineCount, complexityScore, contentDensity, isComplex, isVeryComplex, isDense } = metrics;
  
  // AJUSTE INTELIGENTE BASADO EN MÚLTIPLES FACTORES
  let adjustedLineCount = lineCount;
  
  // Ajustar por complejidad estructural
  if (isComplex) adjustedLineCount *= 1.2;
  if (isVeryComplex) adjustedLineCount *= 1.4;
  
  // Ajustar por densidad de contenido
  if (isDense) adjustedLineCount *= 1.3;
  
  // Determinar banda de tamaño
  let sizeConfig;
  const bands = config.sizeBands;
  
  if (adjustedLineCount <= bands.MUY_BAJA.maxLines) {
    sizeConfig = bands.MUY_BAJA;
  } else if (adjustedLineCount <= bands.BAJA.maxLines) {
    sizeConfig = bands.BAJA;
  } else if (adjustedLineCount <= bands.MEDIA.maxLines) {
    sizeConfig = bands.MEDIA;
  } else if (adjustedLineCount <= bands.ALTA.maxLines) {
    sizeConfig = bands.ALTA;
  } else {
    sizeConfig = bands.MUY_ALTA;
  }
  
  // AJUSTES FINOS POR FORMATO
  let finalConfig = { ...sizeConfig };
  
  if (format === 'mobile') {
    // MOBILE: Asegurar legibilidad mínima y evitar scroll horizontal
    finalConfig.fontSize = Math.max(11, finalConfig.fontSize);
    finalConfig.lineHeight = Math.max(1.1, finalConfig.lineHeight);
  }
  else if (format === 'desktop') {
    // DESKTOP: Aprovechar espacio para mejor legibilidad
    if (metrics.isVeryShort) {
      finalConfig.fontSize = Math.min(24, finalConfig.fontSize + 2);
    }
  }
  else if (format === 'print') {
    // PRINT: Asegurar legibilidad en papel
    finalConfig.fontSize = Math.max(8, finalConfig.fontSize);
  }
  
  return {
    ...finalConfig,
    targetColumns: config.columns, // Columnas fijas por formato
    format: format,
    actualLineCount: metrics.lineCount,
    adjustedLineCount: adjustedLineCount,
    complexityScore: complexityScore,
    contentDensity: contentDensity,
    needsScroll: format === 'mobile' && metrics.lineCount > 100 // Scroll solo en mobile para contenido extenso
  };
};

// BALANCE INTELIGENTE MEJORADO - EVITA CORTES EN SECCIONES
export const balanceColumnsIntelligently = (content, targetColumns, metrics) => {
  if (!content || content.length === 0) {
    return Array(targetColumns).fill().map(() => []);
  }

  const columns = Array(targetColumns).fill().map(() => []);
  
  if (targetColumns === 1) {
    // MOBILE: Todo en una columna, orden natural
    columns[0] = [...content];
    
  } else if (targetColumns === 2) {
    // TABLET/PRINT: Balance perfecto para 2 columnas
    const sections = [];
    let currentSection = [];
    
    // Agrupar manteniendo estructura musical
    content.forEach(item => {
      const isStructural = item.type === 'section' || item.type === 'voice';
      
      if (isStructural && currentSection.length > 0) {
        sections.push([...currentSection]);
        currentSection = [item];
      } else {
        currentSection.push(item);
      }
    });
    
    if (currentSection.length > 0) {
      sections.push(currentSection);
    }
    
    // Distribuir secciones equilibradamente
    let col1Items = [];
    let col2Items = [];
    let col1Weight = 0;
    let col2Weight = 0;
    
    sections.forEach(section => {
      const sectionWeight = section.reduce((acc, item) => acc + getItemWeight(item), 0);
      
      if (col1Weight <= col2Weight) {
        col1Items.push(...section);
        col1Weight += sectionWeight;
      } else {
        col2Items.push(...section);
        col2Weight += sectionWeight;
      }
    });
    
    columns[0] = col1Items;
    columns[1] = col2Items;
    
  } else {
    // DESKTOP: 3 columnas - distribución óptima para contenido extenso
    const sections = [];
    let currentSection = [];
    
    content.forEach(item => {
      const isStructural = item.type === 'section' || item.type === 'voice';
      
      if (isStructural && currentSection.length > 0) {
        sections.push([...currentSection]);
        currentSection = [item];
      } else {
        currentSection.push(item);
      }
    });
    
    if (currentSection.length > 0) {
      sections.push(currentSection);
    }
    
    // Distribuir en 3 columnas
    const columnWeights = [0, 0, 0];
    const columnItems = [[], [], []];
    
    sections.forEach(section => {
      const sectionWeight = section.reduce((acc, item) => acc + getItemWeight(item), 0);
      const minWeightIndex = columnWeights.indexOf(Math.min(...columnWeights));
      
      columnItems[minWeightIndex].push(...section);
      columnWeights[minWeightIndex] += sectionWeight;
    });
    
    columns[0] = columnItems[0];
    columns[1] = columnItems[1];
    columns[2] = columnItems[2];
  }

  return columns;
};

// Peso de items para balance inteligente
const getItemWeight = (item) => {
  switch (item.type) {
    case 'section': return 4;      // Secciones pesan más (título + contenido)
    case 'voice': return 3;        // Voces pesan bastante
    case 'combined': return 2.5;   // Línea combinada (acordes + letra)
    case 'chords': return 1.5;     // Solo acordes
    case 'lyric': return 1.2;      // Solo letra
    case 'text': return 1;         // Texto normal
    case 'divider': return 0.3;    // Divisor pesa poco
    default: return 1;
  }
};

// Función para transponer acordes
export const transposeChord = (chord, transposition = 0) => {
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

// Procesar líneas para combinar acordes con letras
export const processLines = (lines) => {
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

// Renderizador de contenido común
export const renderContent = (content, transposition = 0, options = {}) => {
  if (!content) return null;

  const { isPrint = false, compactMode = false, currentFormat = 'desktop' } = options;

  return content.map((item, index) => {
    // Lógica especial para modo compacto en impresión
    if (compactMode && isPrint) {
      // Agrupar múltiples voces en una línea
      if (item.type === "voice" && content[index + 1]?.type === "voice") {
        const voiceGroup = [item];
        let nextIndex = index + 1;
        
        // Agrupar voces consecutivas
        while (content[nextIndex]?.type === "voice") {
          voiceGroup.push(content[nextIndex]);
          nextIndex++;
        }
        
        return (
          <div key={index} className="voice-group-compact">
            <div className="voice-label-horizontal">
              <div className="voice-names-inline">
                {voiceGroup.map((voice, i) => (
                  <span 
                    key={i} 
                    className={`voice-name voice-${voice.color || 'default'} voice-tag voice-tag-${voice.color || 'default'}`}
                  >
                    {voice.name || 'VOZ'}
                  </span>
                ))}
              </div>
            </div>
            <div className="voice-content-compact">
              {voiceGroup.map((voice, i) => (
                <React.Fragment key={i}>
                  {voice.lines && renderContent(processLines(voice.lines), transposition, { isPrint, compactMode, currentFormat })}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      }
    }

    switch (item.type) {
      case "section":
        return (
          <React.Fragment key={index}>
            <div className={`section-header ${compactMode ? 'compact' : ''}`}>
              <span className={`section-title ${compactMode ? 'compact' : ''}`}>
                {item.name?.toUpperCase() || 'SECCIÓN'}
              </span>
            </div>
            {item.lines && renderContent(processLines(item.lines), transposition, { isPrint, compactMode, currentFormat })}
          </React.Fragment>
        );
      
      case "voice":
        return (
          <div key={index} className={`voice-section voice-${item.color || 'default'} ${compactMode ? 'compact' : ''}`}>
            <div className="voice-label-horizontal">
              <span className={`voice-name ${compactMode ? 'compact' : ''} voice-${item.color || 'default'}`}>
                {item.name || 'VOZ'}
              </span>
            </div>
            <div className={`voice-content ${compactMode ? 'compact' : ''}`}>
              {item.lines && renderContent(processLines(item.lines), transposition, { isPrint, compactMode, currentFormat })}
            </div>
          </div>
        );
      
      case "combined":
        return (
          <div key={index} className={`song-line-combined ${compactMode ? 'compact' : ''}`}>
            <div className="chords-line">
              {item.chords.map((chord, i) => (
                <span key={i} className={`chord ${compactMode ? 'compact' : ''}`}>
                  {transposeChord(chord, transposition)}
                </span>
              ))}
            </div>
            {item.lyric && (
              <div className={`lyrics-line ${compactMode ? 'compact' : ''}`}>
                {item.lyric}
              </div>
            )}
          </div>
        );
      
      case "chords":
        return (
          <div key={index} className={`song-line ${compactMode ? 'compact' : ''}`}>
            <div className="chords-line">
              {item.content.map((chord, i) => (
                <span key={i} className={`chord ${compactMode ? 'compact' : ''}`}>
                  {transposeChord(chord, transposition)}
                </span>
              ))}
            </div>
          </div>
        );
      
      case "chord":
        return (
          <div key={index} className={`song-line ${compactMode ? 'compact' : ''}`}>
            <div className="chords-line">
              <span className={`chord ${compactMode ? 'compact' : ''}`}>
                {transposeChord(item.content, transposition)}
              </span>
            </div>
          </div>
        );
      
      case "lyric":
        return (
          <div key={index} className={`song-line ${compactMode ? 'compact' : ''}`}>
            <div className={`lyrics-line ${compactMode ? 'compact' : ''}`}>
              {item.content}
            </div>
          </div>
        );
      
      case "text":
        return (
          <div key={index} className={`song-line ${compactMode ? 'compact' : ''}`}>
            <div className={`text-line ${compactMode ? 'compact' : ''}`}>
              {item.content}
            </div>
          </div>
        );
      
      case "divider":
        return (
          <div key={index} className={`section-divider ${compactMode ? 'compact' : ''}`}></div>
        );
      
      default:
        return (
          <div key={index} className="unknown-element">
            Elemento no reconocido: {item.type}
          </div>
        );
    }
  });
};

// Función para obtener información de transposición
export const getTranspositionInfo = (transposition, originalKey) => {
  if (transposition === 0) return '';
  
  const direction = transposition > 0 ? '+' : '';
  const trasteInfo = Math.abs(transposition);
  const trasteText = trasteInfo === 1 ? 'er Traste' : 'º Traste';
  
  return ` (Transportado ${direction}${transposition} - ${trasteInfo}${trasteText})`;
};

// Función para obtener información del formato
export const getFormatInfo = (currentFormat, fontSize, lineCount, isComplex = false) => {
  const formatIcons = {
    mobile: '📱',
    tablet: '📟', 
    desktop: '💻',
    print: '🖨️'
  };
  
  const formatNames = {
    mobile: 'MOBILE',
    tablet: 'TABLET',
    desktop: 'DESKTOP',
    print: 'PRINT'
  };
  
  const columnInfo = {
    mobile: '1 COLUMNA',
    tablet: '2 COLUMNAS',
    desktop: '3 COLUMNAS',
    print: '2 COLUMNAS'
  };
  
  const complexityInfo = isComplex ? ' • CONTENIDO COMPLEJO' : ' • CONTENIDO OPTIMIZADO';
  
  return `${formatIcons[currentFormat] || '📄'} ${formatNames[currentFormat] || 'FORMATO'} • ${columnInfo[currentFormat] || ''} • ${fontSize}px • ${lineCount} líneas${complexityInfo}`;
};

export default useContentAnalyzer;