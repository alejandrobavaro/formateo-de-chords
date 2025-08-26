import React, { useState, useEffect } from 'react';
import SongSelector from './SongSelector';
import SongViewer from './SongViewer';
import Controls from './Controls';
import "../../assets/scss/_03-Componentes/ChordsViewer/_ChordsViewerIndex.scss";

const ChordsViewerIndex = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar el índice de canciones
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/songs.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de canciones');
        }
        const data = await response.json();
        setSongs(data.songs);
        
        // Cargar la primera canción por defecto
        if (data.songs.length > 0) {
          loadSong(data.songs[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  // Cargar una canción específica
  const loadSong = async (song) => {
    try {
      setLoading(true);
      const response = await fetch(`/data/songs/${song.file}`);
      if (!response.ok) {
        throw new Error(`No se pudo cargar la canción: ${song.title}`);
      }
      const songData = await response.json();
      setSelectedSong(songData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedSong) {
    return <div className="chords-loading">Cargando canciones...</div>;
  }

  if (error) {
    return <div className="chords-error">Error: {error}</div>;
  }

  return (
    <div className="chords-viewer-container">
      <div className="chords-header">
        <h1>Visualizador de Chords - Set List Show Casamiento - Almango Pop Covers</h1>
        
        <div className="chords-controls-top">
          <SongSelector 
            songs={songs} 
            selectedSong={selectedSong} 
            onSelectSong={loadSong} 
          />
          <Controls
            fontSize={fontSize}
            setFontSize={setFontSize}
            transposition={transposition}
            setTransposition={setTransposition}
            showA4Outline={showA4Outline}
            setShowA4Outline={setShowA4Outline}
          />
        </div>
      </div>
      
      <div className="chords-content">
        {selectedSong && (
          <SongViewer
            song={selectedSong}
            fontSize={fontSize}
            transposition={transposition}
            showA4Outline={showA4Outline}
          />
        )}
      </div>
    </div>
  );
};

export default ChordsViewerIndex;