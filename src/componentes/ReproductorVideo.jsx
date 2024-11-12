import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import '../assets/scss/_03-Componentes/_ReproductorVideo.scss';

const ReproductorVideo = ({ videoId = "dQw4w9WgXcQ" }) => { // Video predeterminado
  const [uniqueId, setUniqueId] = useState('');
  const [inTheaterMode, setInTheaterMode] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapters, setChapters] = useState([]);
  const playerRef = useRef(null);

  useEffect(() => {
    const generateUniqueId = () => {
      const timeStamp = new Date().getTime().toString();
      setUniqueId(videoId ? timeStamp + videoId : timeStamp);
    };
    generateUniqueId();
  }, [videoId]);

  const handlePlayPause = () => {
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

  const onVideoReady = (event) => {
    playerRef.current = event.target;
  };

  const onVideoEnd = () => {
    if (repeat) {
      playerRef.current.internalPlayer.playVideo();
    }
  };

  const loadChapters = async () => {
    const sampleChapters = [
      { title: 'Capítulo 1', time: 10 },
      { title: 'Capítulo 2', time: 30 },
    ];
    setChapters(sampleChapters);
  };

  useEffect(() => {
    loadChapters();
  }, []);

  const seekTo = (time) => {
    playerRef.current.internalPlayer.seekTo(time, true);
  };

  return (
    <div className={`video-player ${inTheaterMode ? 'theater-mode' : ''}`}>
      <YouTube
        videoId={videoId}
        className="video-frame"
        onReady={onVideoReady}
        onEnd={onVideoEnd}
      />
      <div className="controls">
        <h2>Reproductor de Video</h2>
        <button onClick={handlePlayPause}>
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </button>
        <button onClick={toggleTheaterMode}>
          {inTheaterMode ? 'Modo Normal' : 'Modo Teatro'}
        </button>
        <button onClick={toggleRepeat}>
          {repeat ? 'Repetir: ON' : 'Repetir: OFF'}
        </button>
      </div>
      <div className="chapters">
        {chapters.map((chapter, index) => (
          <button key={index} onClick={() => seekTo(chapter.time)}>
            {chapter.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReproductorVideo;
