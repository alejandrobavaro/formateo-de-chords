// ============================================
// ARCHIVO: MusicaCancionesLista.jsx
// OBJETIVO: Lista que muestra 100 canciones visualmente, luego scroll
// CARACTERÍSTICAS:
// - Contenedor con altura para 100 canciones (3200px)
// - Muestra TODAS las canciones (sin límite)
// - Si hay más de 100, se puede hacer scroll
// - Indicador visual cuando hay más canciones
// ============================================

import React, { useState, useEffect } from 'react';
import MusicaCancionItem from './MusicaCancionItem';
import "../../assets/scss/_03-Componentes/_MusicaCancionesLista.scss";

function MusicaCancionesLista({ songs, currentSong, onPlaySong, onViewDetails }) {
  const [hayMasDe100Canciones, setHayMasDe100Canciones] = useState(false);

  useEffect(() => {
    // Verificar si hay más de 100 canciones para mostrar el indicador
    setHayMasDe100Canciones(songs.length > 100);
  }, [songs]);

  return (
    <div className="lista-canciones-compacta">
      {songs.length === 0 ? (
        <div className="lista-vacia">
          <span>🎵</span>
          <p>No hay canciones</p>
        </div>
      ) : (
        <>
          {/* CONTENEDOR CON ALTURA PARA 100 CANCIONES */}
          <div className="contenedor-100-canciones">
            <ul className="lista-contenido">
              {songs.map((song, index) => (
                <MusicaCancionItem 
                  key={song.id} 
                  song={song}
                  index={index + 1}
                  isCurrent={currentSong?.id === song.id}
                  isPlaying={currentSong?.id === song.id}
                  onPlay={() => onPlaySong(song)}
                  onViewDetails={() => onViewDetails(song)}
                />
              ))}
            </ul>
          </div>
          
          {/* INDICADOR DE MÁS CANCIONES (solo si hay más de 100) */}
          {hayMasDe100Canciones && (
            <div className="indicador-mas-canciones visible">
              <span className="contador-total">{songs.length}</span> canciones en total
              <span className="icono-scroll">↓</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MusicaCancionesLista;