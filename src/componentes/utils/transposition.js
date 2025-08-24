// utils/transposition.js
export const transposeChord = (chord, transposition) => {
    if (!chord || chord === 'N.C.') return chord;
    
    const chordBase = chord.replace(/[#bm789susadd\/]/g, '');
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
  
  export const transposeSong = (songData, transposition) => {
    return {
      ...songData,
      tonoOriginal: songData.tonoOriginal,
      secciones: songData.secciones.map(section => ({
        ...section,
        acordes: section.acordes.map(acorde => 
          typeof acorde === 'object' 
            ? {...acorde, acorde: transposeChord(acorde.acorde, transposition)}
            : transposeChord(acorde, transposition)
        )
      }))
    };
  };