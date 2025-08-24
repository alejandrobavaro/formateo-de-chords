// components/SongSheet.jsx
import React from 'react';
import { FiMusic, FiClock, FiLayers, FiCircle } from 'react-icons/fi';
import '../assets/scss/_03-Componentes/_SongSheet.scss';

const SongSheet = ({ songData, transposition = 0, fontSize = 100, viewMode = 'default' }) => {
  const transposeChord = (chord) => {
    if (!chord || chord === 'N.C.' || chord === '(E)') return chord;
    
    const chordBase = chord.replace(/[#bm789susadd\/()]/g, '');
    const chordModifiers = chord.replace(chordBase, '');
    
    const chordMap = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    
    const reverseMap = [
      'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ];
    
    const baseIndex = chordMap[chordBase];
    if (baseIndex === undefined) return chord;
    
    const newIndex = (baseIndex + transposition + 12) % 12;
    return reverseMap[newIndex] + chordModifiers;
  };

  const getCurrentTone = () => {
    return transposeChord(songData.tonoOriginal);
  };

  return (
    <div className={`song-sheet-a4 ${viewMode} font-size-${fontSize}`}>
      {/* Header de la canción */}
      <div className="song-header">
        <h1 className="song-title">{songData.cancion}</h1>
        <h2 className="song-artist">{songData.artista}</h2>
        <div className="song-metadata">
          <span className="metadata-item">
            <FiMusic className="metadata-icon" />
            Tono: {getCurrentTone()}
          </span>
          <span className="metadata-item">
            <FiLayers className="metadata-icon" />
            Capo: {songData.capo}
          </span>
          <span className="metadata-item">
            <FiClock className="metadata-icon" />
            {songData.tempo}
          </span>
          <span className="metadata-item">
            <FiCircle className="metadata-icon" />
            {songData.compas}
          </span>
        </div>
        {songData.informacionExtra && (
          <div className="song-info">
            {songData.informacionExtra}
          </div>
        )}
      </div>

      {/* Contenido en dos columnas */}
      <div className="song-content-two-columns">
        {songData.secciones.map((section, index) => (
          <div key={index} className="song-section">
            <h3 className="section-title">
              <FiMusic className="section-icon" />
              {section.titulo}
              {section.duracion && (
                <span className="section-duration">({section.duracion})</span>
              )}
            </h3>
            
            {/* Línea de acordes compacta */}
            {section.acordes && section.acordes.length > 0 && (
              <div className="chords-line-compact">
                {section.acordes.map((chord, chordIndex) => (
                  <span key={chordIndex} className="chord-compact">
                    {transposeChord(chord)}
                  </span>
                ))}
              </div>
            )}
            
            {/* Letra formateada */}
            {section.letra && (
              <div className="lyrics-compact">
                {section.letra.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex} className="lyric-line">
                    {line || <br />}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer con información de la app */}
      <div className="song-footer">
        <span>Formateo Chords © {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

export default SongSheet;