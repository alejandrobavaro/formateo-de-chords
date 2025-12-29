// ============================================
// ARCHIVO: ChordsViewerIndex.jsx - VERSIÓN COMPLETA CORREGIDA
// CORRECCIÓN CRÍTICA: Manejo seguro de imágenes y DOM
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BsArrowsFullscreen, 
  BsFullscreenExit, 
  BsMusicNoteBeamed,
  BsPrinter,
  BsDash,
  BsPlus,
  BsArrowCounterclockwise
} from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

// ============================================
// COMPONENTE DE IMAGEN SEGURA
// ============================================
const SafeImage = React.memo(({ src, alt, className, fallbackText = '🎵' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  if (hasError) {
    return (
      <span className="logo-fallback">
        {fallbackText}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      decoding="async"
      style={{ display: isLoaded ? 'block' : 'none' }}
    />
  );
});

SafeImage.displayName = 'SafeImage';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const ChordsViewerIndex = ({ 
  chordsData = null,
  transpositionProp = 0,
  songMetadata = null,
  compactMode = 'extreme'
}) => {
  
  // ============================================
  // ESTADOS PRINCIPALES
  // ============================================
  const [selectedSong, setSelectedSong] = useState(null);
  const [transposition, setTransposition] = useState(transpositionProp);
  const [showA4Outline, setShowA4Outline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [contentDensity, setContentDensity] = useState('medium');

  // ============================================
  // REFERENCIAS
  // ============================================
  const containerRef = useRef(null);

  // ============================================
  // EFECTO: PROCESAR DATOS CUANDO CAMBIA chordsData
  // ============================================
  useEffect(() => {
    let isMounted = true;

    const procesarDatosReproductor = () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);
        
        if (!chordsData) {
          setSelectedSong(null);
          setLoading(false);
          return;
        }

        // Verificar si es un objeto válido
        if (typeof chordsData === 'object' && chordsData !== null) {
          // Verificar si tiene contenido estructurado
          if (Array.isArray(chordsData.content)) {
            const cancionProcesada = {
              ...chordsData,
              id: chordsData.id || `song-${Date.now()}`,
              key: chordsData.originalKey || chordsData.key || 'C',
              title: chordsData.title || 'Canción',
              artist: chordsData.artist || 'Artista',
              // Propiedad especial para medleys
              esMedley: chordsData.esMedley || false,
              cancionesIncluidas: chordsData.cancionesIncluidas || 1
            };
            
            if (isMounted) {
              setSelectedSong(cancionProcesada);
              const densidad = analizarDensidadContenido(chordsData.content);
              setContentDensity(densidad);
            }
            
          } else if (typeof chordsData.content === 'string') {
            // Para contenido simple
            if (isMounted) {
              setSelectedSong({
                ...chordsData,
                esMedley: false,
                cancionesIncluidas: 1
              });
              setContentDensity('low');
            }
          }
        }

      } catch (err) {
        if (isMounted) {
          console.error('Error procesando datos:', err);
          setError(`Error: ${err.message}`);
          setSelectedSong(crearEjemplo());
          setContentDensity('medium');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    procesarDatosReproductor();
    
    return () => {
      isMounted = false;
    };
  }, [chordsData, songMetadata]);

  // ============================================
  // FUNCIÓN: analizarDensidadContenido
  // ============================================
  const analizarDensidadContenido = (contenido) => {
    if (!contenido || !Array.isArray(contenido)) return 'medium';
    
    let totalLineas = 0;
    let totalCaracteres = 0;
    
    const contarLineas = (items) => {
      items.forEach(item => {
        if (item.lines && Array.isArray(item.lines)) {
          totalLineas += item.lines.length;
          item.lines.forEach(line => {
            if (line.content) {
              if (Array.isArray(line.content)) {
                totalCaracteres += line.content.join('').length;
              } else {
                totalCaracteres += String(line.content).length;
              }
            }
          });
        }
      });
    };
    
    contarLineas(contenido);
    
    const densidad = totalCaracteres / Math.max(1, totalLineas);
    
    if (totalLineas < 30) return 'very-low';
    if (totalLineas < 60) return 'low';
    if (totalLineas < 120) return 'medium';
    if (totalLineas < 200) return 'high';
    return 'very-high';
  };

  // ============================================
  // FUNCIÓN: crearEjemplo
  // ============================================
  const crearEjemplo = () => {
    return {
      id: `ejemplo-${Date.now()}`,
      title: 'Ejemplo',
      artist: 'Artista',
      originalKey: 'C',
      key: 'C',
      tempo: '120',
      timeSignature: '4/4',
      esMedley: false,
      cancionesIncluidas: 1,
      content: [
        {
          type: 'section',
          name: 'INTRO',
          lines: [
            { type: 'chord', content: 'C' },
            { type: 'chord', content: 'G' }
          ]
        }
      ]
    };
  };

  // ============================================
  // FUNCIÓN: transponerAcorde
  // ============================================
  const transponerAcorde = (acorde, semitonos) => {
    if (!acorde || ['N.C.', '(E)', '-', '–', '', 'X'].includes(acorde.trim())) {
      return acorde;
    }
    
    const notas = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const regexAcorde = /^([A-G](#|b)?)(.*)$/i;
    const coincidencia = acorde.match(regexAcorde);
    
    if (!coincidencia) return acorde;
    
    let notaBase = coincidencia[1].toUpperCase();
    const modificadores = coincidencia[3] || '';
    
    const bemolASostenido = {
      'DB': 'C#', 'EB': 'D#', 'GB': 'F#', 'AB': 'G#', 'BB': 'A#',
      'D♭': 'C#', 'E♭': 'D#', 'G♭': 'F#', 'A♭': 'G#', 'B♭': 'A#',
      'CB': 'B', 'FB': 'E'
    };
    
    notaBase = bemolASostenido[notaBase] || notaBase;
    
    const posicionNota = notas.indexOf(notaBase);
    if (posicionNota === -1) return acorde;
    
    const nuevaPosicion = (posicionNota + semitonos + 12) % 12;
    return notas[nuevaPosicion] + modificadores;
  };

  // ============================================
  // FUNCIÓN: calcularTamañoFuente
  // ============================================
  const calcularTamañoFuente = () => {
    const baseSizes = {
      'mobile': { 'very-low': 13, 'low': 12, 'medium': 11, 'high': 10, 'very-high': 9 },
      'tablet': { 'very-low': 14, 'low': 13, 'medium': 12, 'high': 11, 'very-high': 10 },
      'desktop': { 'very-low': 15, 'low': 14, 'medium': 13, 'high': 12, 'very-high': 11 }
    };
    
    let size = baseSizes[screenSize]?.[contentDensity] || 12;
    
    if (compactMode === 'compact') size -= 1;
    if (compactMode === 'extreme') size -= 2;
    
    return Math.max(8, size);
  };

  // ============================================
  // FUNCIÓN: dividirEnColumnasOptimizado
  // ============================================
  const dividirEnColumnasOptimizado = (contenido) => {
    if (!contenido || !Array.isArray(contenido)) return [[], [], []];
    
    const columnas = [[], [], []];
    
    if (screenSize === 'mobile') {
      columnas[0] = [...contenido];
      
    } else if (screenSize === 'tablet') {
      const mitad = Math.ceil(contenido.length / 2);
      let puntoCorte = mitad;
      
      for (let i = mitad; i < Math.min(mitad + 5, contenido.length); i++) {
        if (contenido[i]?.type === 'section' || contenido[i]?.type === 'voice') {
          puntoCorte = i;
          break;
        }
      }
      
      columnas[0] = contenido.slice(0, puntoCorte);
      columnas[1] = contenido.slice(puntoCorte);
      
    } else {
      const tercios = [
        Math.ceil(contenido.length / 3),
        Math.ceil((contenido.length * 2) / 3)
      ];
      
      let cortes = [tercios[0], tercios[1]];
      
      for (let c = 0; c < cortes.length; c++) {
        for (let i = cortes[c]; i < Math.min(cortes[c] + 3, contenido.length); i++) {
          if (contenido[i]?.type === 'section' || contenido[i]?.type === 'voice') {
            cortes[c] = i;
            break;
          }
        }
      }
      
      columnas[0] = contenido.slice(0, cortes[0]);
      columnas[1] = contenido.slice(cortes[0], cortes[1]);
      columnas[2] = contenido.slice(cortes[1]);
    }
    
    return columnas;
  };

  // ============================================
  // FUNCIÓN: renderizarContenido
  // ============================================
  const renderizarContenido = (contenido) => {
    if (!contenido || !Array.isArray(contenido)) return null;

    return contenido.map((elemento, indice) => {
      
      switch (elemento.type) {
        case 'section':
          const mostrarTitulo = esSeccionEspecial(elemento.name);
          
          return (
            <div 
              key={indice} 
              className={`seccion-ultra-compacta densidad-${contentDensity}`}
            >
              {mostrarTitulo && (
                <div className="titulo-seccion-ultra-compacto especial">
                  {elemento.name ? elemento.name.toUpperCase() : 'SECCIÓN'}
                </div>
              )}
              {elemento.lines && renderizarLineas(elemento.lines)}
            </div>
          );
        
        case 'divider':
          return <div key={indice} className="divisor-ultra-compacto"></div>;
        
        case 'voice':
          const esVozAle = elemento.name?.includes('ALE') || elemento.name?.includes('Ale');
          const esVozPato = elemento.name?.includes('PATO') || elemento.name?.includes('Pato');
          
          return (
            <div 
              key={indice} 
              className={`voz-ultra-compacta ${esVozAle ? 'voz-ale' : ''} ${esVozPato ? 'voz-pato' : ''}`}
            >
              <div className="etiqueta-voz-ultra-compacta">
                {elemento.name || 'VOZ'}
              </div>
              {elemento.lines && renderizarLineas(elemento.lines, esVozAle, esVozPato)}
            </div>
          );
        
        default:
          return null;
      }
    });
  };

  // ============================================
  // FUNCIÓN: esSeccionEspecial
  // ============================================
  const esSeccionEspecial = (nombreSeccion) => {
    if (!nombreSeccion) return false;
    
    const nombreLower = nombreSeccion.toLowerCase();
    const seccionesEspeciales = [
      'intro', 'pre.?estribillo', 'estribillo', 'coro', 'chorus',
      'solo', 'instrumental', 'puente', 'bridge', 'outro', 'final',
      'interludio', 'interlude', 'coda', 'ad.?lib', 'repetición',
      'intro instrumental', 'solo de guitarra', 'break'
    ];
    
    return seccionesEspeciales.some(seccion => 
      new RegExp(seccion, 'i').test(nombreLower)
    );
  };

  // ============================================
  // FUNCIÓN: renderizarLineas
  // ============================================
  const renderizarLineas = (lineas, enVozAle = false, enVozPato = false) => {
    if (!lineas || !Array.isArray(lineas)) return null;

    return lineas.map((linea, indiceLinea) => {
      const claseVoz = enVozAle ? 'linea-ale' : enVozPato ? 'linea-pato' : '';
      
      switch (linea.type) {
        case 'chord':
          return (
            <div key={indiceLinea} className={`linea-acorde-ultra-compacta ${claseVoz}`}>
              <span className="acorde-ultra-compacto">
                {transponerAcorde(linea.content, transposition)}
              </span>
            </div>
          );
        
        case 'chords':
          return (
            <div key={indiceLinea} className={`linea-acordes-ultra-compacta ${claseVoz}`}>
              {Array.isArray(linea.content) ? 
                linea.content.map((acorde, idx) => (
                  <span key={idx} className="acorde-ultra-compacto">
                    {transponerAcorde(acorde, transposition)}
                    {idx < linea.content.length - 1 ? ' ' : ''}
                  </span>
                )) : 
                <span className="acorde-ultra-compacto">
                  {transponerAcorde(linea.content, transposition)}
                </span>
              }
            </div>
          );
        
        case 'lyric':
          return (
            <div key={indiceLinea} className={`linea-letra-ultra-compacta ${claseVoz}`}>
              {linea.content}
            </div>
          );
        
        default:
          return null;
      }
    });
  };

  // ============================================
  // DETECCIÓN DE TAMAÑO DE PANTALLA
  // ============================================
  useEffect(() => {
    let isMounted = true;

    const detectScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    if (isMounted) {
      setScreenSize(detectScreenSize());
    }
    
    const handleResize = () => {
      if (isMounted) {
        setScreenSize(detectScreenSize());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ============================================
  // FUNCIONES DE CONTROL
  // ============================================
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
      setFullscreenMode(true);
    } else {
      document.exitFullscreen?.();
      setFullscreenMode(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ============================================
  // EFECTOS ADICIONALES
  // ============================================
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreenMode(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    setTransposition(transpositionProp);
  }, [transpositionProp]);

  // ============================================
  // RENDER: ESTADOS ESPECIALES
  // ============================================
  if (loading) {
    return (
      <div className="cargando-ultra-compacto">
        <BsMusicNoteBeamed className="icono-cargando" />
        <span>Cargando acordes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-ultra-compacto">
        <span>⚠️</span>
        <span>{error}</span>
        <button onClick={() => setError(null)} className="btn-cerrar-error">×</button>
      </div>
    );
  }

  // ============================================
  // PREPARACIÓN DE DATOS
  // ============================================
  const columnas = selectedSong && Array.isArray(selectedSong.content) 
    ? dividirEnColumnasOptimizado(selectedSong.content) 
    : [[], [], []];
  
  const tamañoFuente = calcularTamañoFuente();
  const columnasVisibles = screenSize === 'mobile' ? 1 : screenSize === 'tablet' ? 2 : 3;

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return (
    <div 
      className={`visor-acordes-ultra-compacto-v2 densidad-${contentDensity} modo-${compactMode} ${showA4Outline ? 'borde-a4' : ''}`}
      ref={containerRef}
      style={{ fontSize: `${tamañoFuente}px` }}
    >
      
      {/* BOTÓN PANTALLA COMPLETA */}
      <button 
        className="btn-fullscreen-ultra-compacto" 
        onClick={toggleFullscreen}
        title={fullscreenMode ? "Salir pantalla completa" : "Pantalla completa"}
      >
        {fullscreenMode ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
      </button>

      {/* HEADER ULTRA COMPACTO */}
      <div className="header-una-linea-total">
        <div className="header-contenido-una-linea">
          
          {/* TÍTULO Y METADATA */}
          <div className="titulo-metadata-una-linea">
            {selectedSong ? (
              <>
                <span className="artista-micro">{selectedSong.artist}</span>
                <span className="separador-micro"> - </span>
                <span className="titulo-cancion-micro">{selectedSong.title}</span>
                <span className="tono-micro">
                  ({selectedSong.originalKey || selectedSong.key || 'C'})
                  {transposition !== 0 && (
                    <span className="transp-activa-micro">
                      {transposition > 0 ? '+' : ''}{transposition}
                    </span>
                  )}
                </span>
                
                {/* BADGE ESPECIAL PARA MEDLEYS */}
                {selectedSong.esMedley && (
                  <span className="medley-badge-mini">
                    🎶 {selectedSong.cancionesIncluidas} canciones
                  </span>
                )}
              </>
            ) : (
              <span className="sin-cancion-micro">🎵 Selecciona canción</span>
            )}
          </div>
          
          {/* CONTROLES */}
          <div className="controles-una-linea">
            
            {/* TRANSPOSICIÓN */}
            <div className="transp-controls-micro">
              <button 
                className="btn-transp-micro" 
                onClick={() => setTransposition(prev => Math.max(-6, prev - 1))}
                disabled={!selectedSong}
                title="Bajar semitono"
              >
                <BsDash />
              </button>
              
              <span className="transp-valor-micro">
                {transposition > 0 ? '+' : ''}{transposition}
              </span>
              
              <button 
                className="btn-transp-micro" 
                onClick={() => setTransposition(prev => Math.min(6, prev + 1))}
                disabled={!selectedSong}
                title="Subir semitono"
              >
                <BsPlus />
              </button>
              
              <button 
                className="btn-reset-transp-micro"
                onClick={() => setTransposition(0)}
                disabled={!selectedSong || transposition === 0}
                title="Tono original"
              >
                <BsArrowCounterclockwise />
              </button>
            </div>
            
            {/* SEPARADOR */}
            <div className="separador-controles"></div>
            
            {/* OPCIONES */}
            <div className="opciones-micro">
              <button 
                className={`btn-opcion-micro ${showA4Outline ? 'activo' : ''}`}
                onClick={() => setShowA4Outline(!showA4Outline)}
                disabled={!selectedSong}
                title={showA4Outline ? "Ocultar guía A4" : "Mostrar guía A4"}
              >
                A4
              </button>
              
              <button 
                className="btn-opcion-micro"
                onClick={handlePrint}
                disabled={!selectedSong}
                title="Imprimir"
              >
                <BsPrinter />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE VISUALIZACIÓN */}
      <div className="area-visual-ultra-compacta">
        
        {!selectedSong ? (
          <div className="instruccion-ultra-compacta">
            <div className="logo-banda-micro">
              <SafeImage 
                src="/img/04-gif/logogondraworldanimado6.gif" 
                alt="Almango Pop Covers"
                fallbackText="🎵 Almango"
              />
            </div>
            <p>Reproduce una canción para ver los acordes</p>
          </div>
        ) : (
          <div className="columnas-container-ultra-compacto">
            
            {/* COLUMNA 1 */}
            {columnas[0].length > 0 && (
              <div className="columna-ultra-compacta col-1">
                {renderizarContenido(columnas[0])}
              </div>
            )}
            
            {/* COLUMNA 2 */}
            {columnasVisibles >= 2 && columnas[1].length > 0 && (
              <div className="columna-ultra-compacta col-2">
                {renderizarContenido(columnas[1])}
              </div>
            )}
            
            {/* COLUMNA 3 */}
            {columnasVisibles >= 3 && columnas[2].length > 0 && (
              <div className="columna-ultra-compacta col-3">
                {renderizarContenido(columnas[2])}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LEYENDA */}
      {selectedSong && (
        <div className="leyenda-ultra-compacta">
          <div className="leyenda-contenido">
            <span className="leyenda-item">
              <span className="color-muestra ale"></span>
              <span>ALE</span>
            </span>
            <span className="leyenda-item">
              <span className="color-muestra pato"></span>
              <span>PATO</span>
            </span>
            <span className="leyenda-item">
              <span className="color-muestra acorde"></span>
              <span>ACORDES</span>
            </span>
            <span className="leyenda-item info-columnas">
              {columnasVisibles} col • {tamañoFuente}px
            </span>
            {/* INFO DE MEDLEY EN LEYENDA */}
            {selectedSong.esMedley && (
              <span className="leyenda-item medley-info">
                <span className="color-muestra medley">🎶</span>
                <span>MEDLEY</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* IMPRESIÓN */}
      <div className="impresion-oculta-ultra-compacta">
        {selectedSong && (
          <div className="pagina-a4-impresion">
            <div className="cabecera-impresion">
              <h1>{selectedSong.artist} - {selectedSong.title}</h1>
              {selectedSong.esMedley && (
                <div className="medley-info-impresion">
                  MEDLEY • {selectedSong.cancionesIncluidas} canciones incluidas
                </div>
              )}
              <div className="metadatos-impresion">
                Tono: {selectedSong.originalKey || selectedSong.key || 'C'}
                {transposition !== 0 && ` (Transportado ${transposition > 0 ? '+' : ''}${transposition})`}
              </div>
            </div>
            <div className="contenido-impresion">
              {renderizarContenido(selectedSong.content || [])}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordsViewerIndex;