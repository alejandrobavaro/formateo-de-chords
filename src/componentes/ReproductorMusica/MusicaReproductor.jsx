// ============================================
// ARCHIVO: MusicaReproductor.jsx - VERSIÓN ULTRA COMPACTA
// OBJETIVO: Reducir altura y optimizar espacio del reproductor
// CAMBIOS: 
// 1. Reducción de todos los paddings y márgenes
// 2. Elementos más pequeños pero manteniendo funcionalidad
// 3. Layout más denso y eficiente
// ============================================

import React, { useState, useEffect } from "react";
import { 
  BsPlayFill, 
  BsPauseFill, 
  BsSkipForward, 
  BsSkipBackward, 
  BsVolumeUp, 
  BsVolumeMute, 
  BsDownload 
} from "react-icons/bs";
import { useMusicaContexto } from './MusicaContexto';
import "../../assets/scss/_03-Componentes/_MusicaReproductor.scss";

function MusicaReproductor({ 
  onNext,
  onPrev
}) {
  const { 
    currentSong, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    togglePlayPause,
    handleProgressChange,
    setVolume
  } = useMusicaContexto();

  const [localVolume, setLocalVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(currentTime);

  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!isDragging) {
      setDragTime(currentTime);
    }
  }, [currentTime, isDragging]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(localVolume > 0 ? localVolume : 0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    updateProgress(e);
  };

  const handleProgressMouseMove = (e) => {
    if (isDragging) {
      updateProgress(e);
    }
  };

  const handleProgressMouseUp = (e) => {
    if (isDragging) {
      updateProgress(e);
      setIsDragging(false);
      handleProgressChange(dragTime);
    }
  };

  const updateProgress = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const totalWidth = rect.width;
    const percentage = Math.max(0, Math.min(1, clickPosition / totalWidth));
    const newTime = percentage * duration;
    
    if (!isNaN(newTime) && duration > 0) {
      setDragTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const descargarCancion = () => {
    if (!currentSong?.url) {
      alert('No hay canción para descargar');
      return;
    }
    const link = document.createElement('a');
    link.href = currentSong.url;
    link.download = `${currentSong.artista || 'Almango'} - ${currentSong.nombre || 'cancion'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayTime = isDragging ? dragTime : currentTime;

  return (
    <div className="reproductor-header-compacto">
      <div className="reproductor-contenido-compacto">
        
        {/* CONTROLES IZQUIERDOS - COMPACTOS */}
        <div className="reproductor-controls-left-compacto">
          <button 
            className="control-btn-compacto control-prev-compacto"
            onClick={onPrev}
            disabled={!currentSong}
            title="Anterior"
          >
            <BsSkipBackward />
          </button>
          
          <button 
            className="control-btn-compacto control-play-compacto"
            onClick={togglePlayPause}
            disabled={!currentSong}
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
          </button>
          
          <button 
            className="control-btn-compacto control-next-compacto"
            onClick={onNext}
            disabled={!currentSong}
            title="Siguiente"
          >
            <BsSkipForward />
          </button>
        </div>

        {/* CENTRO - BARRA DE PROGRESO COMPACTA */}
        <div className="reproductor-controls-center-compacto">
          <div className="tiempo-display-compacto">
            <span className="tiempo-actual-compacto">{formatTime(displayTime)}</span>
            <span className="tiempo-separador-compacto">/</span>
            <span className="tiempo-total-compacto">{formatTime(duration)}</span>
          </div>
          
          <div 
            className="progreso-container-compacto"
            onMouseDown={handleProgressMouseDown}
            onMouseMove={handleProgressMouseMove}
            onMouseUp={handleProgressMouseUp}
            onMouseLeave={() => {
              if (isDragging) {
                setIsDragging(false);
                handleProgressChange(dragTime);
              }
            }}
          >
            <div className="progreso-track-compacto"></div>
            <div 
              className="progreso-bar-compacto" 
              style={{ width: `${duration > 0 ? (displayTime / duration) * 100 : 0}%` }}
            ></div>
            <div 
              className="progreso-thumb-compacto"
              style={{ left: `${duration > 0 ? (displayTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* CONTROLES DERECHOS - COMPACTOS */}
        <div className="reproductor-controls-right-compacto">
          {/* VOLUMEN MINI */}
          <div className="volumen-control-compacto">
            <button 
              className="control-btn-mini control-vol-mini"
              onClick={toggleMute}
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? <BsVolumeMute /> : <BsVolumeUp />}
            </button>
            
            <div className="volumen-slider-container-mini">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : localVolume}
                onChange={handleVolumeChange}
                className="volumen-slider-mini"
                title="Volumen"
              />
            </div>
          </div>
          
          {/* DESCARGAR */}
          <button 
            className="control-btn-mini control-download-mini"
            onClick={descargarCancion}
            disabled={!currentSong}
            title="Descargar MP3"
          >
            <BsDownload />
          </button>
        </div>

      </div>
    </div>
  );
}

export default MusicaReproductor;