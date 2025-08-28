import React, { useState, useEffect } from 'react';
import SongSelector from './SongSelector';
import SongViewer from './SongViewer';
import Controls from './Controls';
import ChordsSearchBar from './ChordsSearchBar';
import { HeaderSearchProvider } from './HeaderSearchContext';
import '../../assets/scss/_03-Componentes/_ChordsViewerIndex.scss';

const ChordsViewerIndex = () => {
  // Estados del componente
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentSongChordsViewerIndex, setCurrentSongChordsViewerIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar el índice de canciones
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/cancionescasamiento.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de canciones');
        }
        const data = await response.json();
        setSongs(data.songs);

        // Cargar la primera canción por defecto si hay canciones disponibles
        if (data.songs && data.songs.length > 0) {
          await loadSong(data.songs[0]);
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
      const response = await fetch(`/data/cancionesshowcasamiento/${song.file}`);
      if (!response.ok) {
        throw new Error(`No se pudo cargar la canción: ${song.title}`);
      }
      const songData = await response.json();
      setSelectedSong(songData);
      setCurrentSongChordsViewerIndex(songs.findChordsViewerIndex((s) => s.id === song.id));
    } catch (err) {
      setError(err.message);
      setSelectedSong(null);
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de canción
  const handleSongSelect = (song) => {
    loadSong(song);
  };

  // Navegación entre canciones
  const handleNextSong = () => {
    if (songs.length > 0 && currentSongChordsViewerIndex < songs.length - 1) {
      loadSong(songs[currentSongChordsViewerIndex + 1]);
    }
  };

  const handlePrevSong = () => {
    if (songs.length > 0 && currentSongChordsViewerIndex > 0) {
      loadSong(songs[currentSongChordsViewerIndex - 1]);
    }
  };

  // Filtrar canciones según el término de búsqueda
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar el término de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Renderizado condicional
  if (loading && !selectedSong) {
    return <div className="loading">Cargando canciones...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <HeaderSearchProvider>
      <div className="chords-viewer-container">
        {/* Encabezado con barra de búsqueda */}
        <div className="chords-header">
          <h1>Visualizador de Acordes</h1>
          <ChordsSearchBar onSearch={handleSearch} />
        </div>

        {/* Contenido principal */}
        <div className="chords-main-content">
          {/* Lista de canciones */}
          <div className="song-list-container">
            {songs.length > 0 ? (
              <SongSelector
                songs={filteredSongs}
                selectedSong={songs[currentSongChordsViewerIndex]}
                onSelectSong={handleSongSelect}
              />
            ) : (
              <div className="no-songs">No hay canciones disponibles.</div>
            )}
          </div>

          {/* Visualizador de la canción seleccionada */}
          <div className="song-viewer-container">
            <Controls
              fontSize={fontSize}
              setFontSize={setFontSize}
              transposition={transposition}
              setTransposition={setTransposition}
              showA4Outline={showA4Outline}
              setShowA4Outline={setShowA4Outline}
              onNext={handleNextSong}
              onPrev={handlePrevSong}
              hasNext={songs.length > 0 && currentSongChordsViewerIndex < songs.length - 1}
              hasPrev={songs.length > 0 && currentSongChordsViewerIndex > 0}
              currentSong={songs[currentSongChordsViewerIndex]}
            />

            {selectedSong ? (
              <SongViewer
                song={selectedSong}
                fontSize={fontSize}
                transposition={transposition}
                showA4Outline={showA4Outline}
              />
            ) : (
              !loading && <div className="no-song-selected">Selecciona una canción.</div>
            )}
          </div>
        </div>
      </div>
    </HeaderSearchProvider>
  );
};

export default ChordsViewerIndex;
