// ============================================
// ARCHIVO: MusicaCancionItem.jsx
// OBJETIVO: Item de canción ultra compacto BASADO EN LA VERSIÓN ORIGINAL
// CARACTERÍSTICAS:
// - Mismo diseño compacto que funcionaba
// - Icono mejorado para chords (🎵)
// - Todo el texto visible (sin cortes)
// ============================================

import React from "react";
import "../../assets/scss/_03-Componentes/_MusicaCancionItem.scss";

function MusicaCancionItem({ 
  song, 
  index, 
  isCurrent, 
  isPlaying,
  onPlay, 
  onViewDetails 
}) {
  return (
    <li className={`cancion-item ${isCurrent ? 'cancion-actual' : ''}`}>
      {/* Número de pista - Igual que antes */}
      <div className="item-numero">
        {isCurrent && isPlaying ? (
          <span className="numero-reproduciendo">▶</span>
        ) : (
          <span className="numero-normal">{index}</span>
        )}
      </div>
      
      {/* Portada mini - Igual que antes */}
      <div className="item-portada">
        <img 
          src={song.imagen || '/img/default-cover.png'} 
          alt={song.nombre}
          className="portada-img"
          onError={(e) => e.target.src = '/img/default-cover.png'}
        />
      </div>
      
      {/* Información principal - Todo el texto visible */}
      <div className="item-info">
        <div className="info-titulo" title={song.nombre}>{song.nombre}</div>
        <div className="info-artista" title={song.artista}>{song.artista}</div>
      </div>
      
      {/* Duración - Compacta */}
      <div className="item-duracion">{song.duracion || '3:00'}</div>
      
      {/* Controles de acción - Con icono mejorado */}
      <div className="item-controles">
        <button 
          className="control-btn control-play"
          onClick={onPlay}
          title={isCurrent && isPlaying ? "Pausar" : "Reproducir"}
        >
          {isCurrent && isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          className="control-btn control-chords"
          onClick={onViewDetails}
          title="Ver letra y acordes"
        >
          🎵
        </button>
      </div>
    </li>
  );
}

export default MusicaCancionItem;