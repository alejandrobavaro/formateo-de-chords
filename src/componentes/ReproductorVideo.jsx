import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { 
  FiPlay, 
  FiPause, 
  FiRepeat, 
  FiMaximize, 
  FiMinimize, 
  FiSkipBack, 
  FiSkipForward,
  FiList
} from 'react-icons/fi';
import { MdTheaters, MdMusicNote } from 'react-icons/md';
import '../assets/scss/_03-Componentes/_ReproductorVideo.scss';

// Lista de videos con sus IDs y títulos
const videoList = [
  {
    id: "cuFdUSFs5aM",
    title: "Video Musical 1",
    url: "https://www.youtube.com/watch?v=cuFdUSFs5aM&list=OLAK5uy_nBTF6MeZ02WHJl_UYSLPRJvHGC7N7kTXw"
  },
  {
    id: "_MWBP9vcJ8A", 
    title: "Video Musical 2",
    url: "https://www.youtube.com/watch?v=_MWBP9vcJ8A&list=OLAK5uy_nymCtNL0baC7tqAoDQKo9gCYz6nx1jPys"
  },
  {
    id: "6KLJ9-t2Vhk",
    title: "Video Musical 3", 
    url: "https://www.youtube.com/watch?v=6KLJ9-t2Vhk&list=OLAK5uy_m4gbmFoiBaZU5EAspefDGUsEgwaQjHfwA"
  },
  {
    id: "lV6ix86wgs4",
    title: "Video Musical 4",
    url: "https://www.youtube.com/watch?v=lV6ix86wgs4&list=OLAK5uy_mR7JvU1BTwtFKwT44qqeFoNOWggnh8-_s"
  },
  {
    id: "eVZlr4_KXps",
    title: "Video Musical 5",
    url: "https://www.youtube.com/watch?v=eVZlr4_KXps&list=OLAK5uy_lpz8TB5dnwzhGBmS3IIhTIb7ZwJz8wz3s"
  }
];

const ReproductorVideo = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [inTheaterMode, setInTheaterMode] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapters, setChapters] = useState([]);
  const playerRef = useRef(null);

  const currentVideo = videoList[currentVideoIndex];

  useEffect(() => {
    loadChapters();
  }, [currentVideoIndex]);

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.internalPlayer.pauseVideo();
    } else {
      playerRef.current.internalPlayer.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleTheaterMode = () => {
    setInTheaterMode(!inTheaterMode);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  const onVideoReady = (event) => {
    playerRef.current = event.target;
  };

  const onVideoEnd = () => {
    if (repeat) {
      playerRef.current.internalPlayer.playVideo();
    } else {
      // Reproducir siguiente video automáticamente
      playNextVideo();
    }
  };

  const playNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => 
      prevIndex === videoList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const playPreviousVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videoList.length - 1 : prevIndex - 1
    );
  };

  const selectVideo = (index) => {
    setCurrentVideoIndex(index);
    setShowPlaylist(false);
    setIsPlaying(true); // Auto-play al seleccionar video
  };

  const loadChapters = async () => {
    // Capítulos de ejemplo - puedes personalizarlos por video
    const sampleChapters = [
      { title: 'Introducción', time: 10 },
      { title: 'Verso', time: 30 },
      { title: 'Coro', time: 60 },
      { title: 'Solo', time: 90 },
      { title: 'Final', time: 120 },
    ];
    setChapters(sampleChapters);
  };

  const seekTo = (time) => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.seekTo(time, true);
    }
  };

  return (
    <div className={`video-player ${inTheaterMode ? 'theater-mode' : ''}`}>
      <div className="video-header">
        <MdMusicNote className="music-icon" />
        <h2>Reproductor de Video Musical</h2>
        <span className="current-video-title">{currentVideo.title}</span>
      </div>
      
      <YouTube
        videoId={currentVideo.id}
        className="video-frame"
        onReady={onVideoReady}
        onEnd={onVideoEnd}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            color: 'white',
            playsinline: 1
          },
        }}
      />
      
      <div className="controls">
        {/* Controles de navegación */}
        <button 
          onClick={playPreviousVideo}
          className="control-btn nav-btn"
          aria-label="Video anterior"
        >
          <FiSkipBack />
        </button>

        {/* Play/Pause */}
        <button 
          onClick={handlePlayPause} 
          className={`control-btn ${isPlaying ? 'playing' : ''}`}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <FiPause /> : <FiPlay />}
          <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
        </button>

        <button 
          onClick={playNextVideo}
          className="control-btn nav-btn"
          aria-label="Siguiente video"
        >
          <FiSkipForward />
        </button>
        
        {/* Modo teatro */}
        <button 
          onClick={toggleTheaterMode} 
          className={`control-btn ${inTheaterMode ? 'active' : ''}`}
          aria-label={inTheaterMode ? 'Modo Normal' : 'Modo Teatro'}
        >
          {inTheaterMode ? <FiMinimize /> : <FiMaximize />}
          <span>{inTheaterMode ? 'Normal' : 'Teatro'}</span>
        </button>
        
        {/* Repetir */}
        <button 
          onClick={toggleRepeat} 
          className={`control-btn ${repeat ? 'active' : ''}`}
          aria-label={repeat ? 'Desactivar repetición' : 'Activar repetición'}
        >
          <FiRepeat />
          <span>Repetir</span>
        </button>

        {/* Lista de reproducción */}
        <button 
          onClick={togglePlaylist}
          className={`control-btn ${showPlaylist ? 'active' : ''}`}
          aria-label="Mostrar lista de reproducción"
        >
          <FiList />
          <span>Playlist</span>
        </button>
      </div>

      {/* Lista de reproducción */}
      {showPlaylist && (
        <div className="playlist-container">
          <h3>Lista de Reproducción</h3>
          <div className="playlist">
            {videoList.map((video, index) => (
              <div
                key={video.id}
                className={`playlist-item ${index === currentVideoIndex ? 'active' : ''}`}
                onClick={() => selectVideo(index)}
              >
                <span className="playlist-number">{index + 1}.</span>
                <span className="playlist-title">{video.title}</span>
                {index === currentVideoIndex && (
                  <span className="now-playing">Reproduciendo</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="chapters-section">
        <h3>Secciones de la Canción</h3>
        <div className="chapters">
          {chapters.map((chapter, index) => (
            <button 
              key={index} 
              onClick={() => seekTo(chapter.time)}
              className="chapter-btn"
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </div>

      {/* Indicador de video actual */}
      <div className="video-info">
        <span>Video {currentVideoIndex + 1} de {videoList.length}</span>
      </div>
    </div>
  );
};

export default ReproductorVideo;