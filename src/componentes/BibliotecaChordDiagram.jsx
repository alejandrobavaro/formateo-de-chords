// ================================================
// BIBLIOTECA CHORD DIAGRAM - COMPONENTE MEJORADO
// Diagrama de acordes para guitarra con alineación perfecta
// ================================================

import React, { useMemo } from "react";
import "../assets/scss/_03-Componentes/_BibliotecaChordDiagram.scss";

const BibliotecaChordDiagram = ({ fingering }) => {
  // ============= CONSTANTES Y MEMOIZACIÓN =============
  const frets = 5; // Número de trastes a mostrar (0-4)
  
  // Memoización: Convertir el fingering en array solo cuando cambie
  const fingers = useMemo(() => fingering.split("-"), [fingering]);
  
  // Notas de las cuerdas (de la 6ta a la 1ra) - E, A, D, G, B, E
  const stringNotes = ["E", "A", "D", "G", "B", "e"];
  
  // Memoización: Generar array de trastes una sola vez
  const fretArray = useMemo(() => [...Array(frets)], [frets]);

  // ============= RENDERIZADO DEL COMPONENTE =============
  return (
    <div className="chord-diagram">
      {/* CONTENEDOR PRINCIPAL DEL DIAGRAMA */}
      <div className="guitar-diagram-container">
        
        {/* NOTAS DE CUERDAS EN LA PARTE SUPERIOR - ALINEACIÓN PERFECTA */}
        <div className="string-notes-top">
          {stringNotes.map((note, index) => (
            <div key={`note-${index}`} className="string-note">{note}</div>
          ))}
        </div>

        {/* DIAGRAMA DE LA GUITARRA */}
        <div className="guitar-fretboard">
          
          {/* NUMERACIÓN DE TRASTES A LA IZQUIERDA */}
          <div className="fret-numbers-left">
            {fretArray.map((_, index) => (
              <div 
                key={`fret-number-${index}`} 
                className={`fret-number ${index === 0 ? 'first-fret' : ''}`}
              >
                {index}
              </div>
            ))}
          </div>

          {/* REPRESENTACIÓN GRÁFICA DEL DIAPASÓN */}
          <div className="fretboard">
            
            {/* CEJILLA (TRASTE 0) - PARTE SUPERIOR DEL MÁSTIL */}
            <div className="guitar-nut"></div>
            
            {/* LÍNEAS DE TRASTES */}
            <div className="frets">
              {fretArray.map((_, fretIndex) => (
                <div 
                  key={`fret-${fretIndex}`} 
                  className={`fret ${fretIndex === 0 ? 'fret-zero' : ''}`}
                ></div>
              ))}
            </div>
            
            {/* CUERDAS Y POSICIONES DE DEDOS */}
            <div className="strings-container">
              {fingers.map((finger, stringIndex) => {
                // Determinar el estado de cada cuerda
                const isMuted = finger === "X";
                const isOpen = finger === "0";
                const fretPosition = parseInt(finger);
                
                return (
                  <div key={`string-${stringIndex}`} className="string-wrapper">
                    {/* LÍNEA VISUAL DE LA CUERDA */}
                    <div className="string-line"></div>
                    
                    {/* POSICIONAMIENTO DE DEDOS EN LOS TRASTES */}
                    <div className="finger-positions">
                      {fretArray.map((_, fretIndex) => {
                        const hasFinger = !isMuted && !isOpen && fretPosition === fretIndex;
                        
                        return (
                          <div key={`pos-${stringIndex}-${fretIndex}`} className="fret-position">
                            {/* PUNTO DE DEDO SI HAY QUE PRESIONAR LA CUERDA - NUEVO ESTILO */}
                            {hasFinger && (
                              <div className="finger-dot-container">
                                <div className="finger-dot-outer">
                                  <div className="finger-dot-inner"></div>
                                </div>
                              </div>
                            )}
                            
                            {/* SÍMBOLO DE CUERDA AL AIRE EN TRASTE 0 */}
                            {fretIndex === 0 && isOpen && (
                              <div className="open-symbol">○</div>
                            )}
                            
                            {/* SÍMBOLO DE CUERDA MUTEADA EN TRASTE 0 */}
                            {fretIndex === 0 && isMuted && (
                              <div className="mute-symbol">✕</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportar componente con React.memo para optimizar renderizados
export default React.memo(BibliotecaChordDiagram);