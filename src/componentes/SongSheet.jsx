import React from 'react';
import "../assets/scss/_03-Componentes/_SongSheet.scss";

const SongSheet = () => {
  return (
    <div className="song-sheet">
      <h1 className="song-title">Creedence - Have You Ever Seen The Rain (TONO: A)</h1>
      <div className="song-content">
        <table>
          <tbody>
            <tr>
              <td className="column">
                {/* Contenido de la primera columna */}
                <div className="section-title">INTRO</div>
                <div className="chord-line">F#m - D - A - (E) -</div>
                <div className="lyrics-line ale">Someone told me long ago</div>
                <div className="chord blue">E</div>
                <div className="lyrics-line ale">There's a calm before the storm, I know</div>
                <div className="chord blue">A</div>
                {/* Más contenido... */}
              </td>
              <td className="column">
                {/* Contenido de la segunda columna */}
                <div className="lyrics-line pato">'Til forever on it goes</div>
                <div className="chord blue">E</div>
                <div className="lyrics-line pato">Thru the circle fast and slow, I know</div>
                <div className="chord blue">A</div>
                {/* Más contenido... */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongSheet;
