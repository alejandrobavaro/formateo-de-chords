// src/componentes/SearchContext.jsx - VERSIÓN COMPLETA ACTUALIZADA
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch debe usarse dentro de SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState([]);
  const [librariesData, setLibrariesData] = useState({});
  const [searchIndex, setSearchIndex] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [lastSearch, setLastSearch] = useState('');

  // BIBLIOTECAS CENTRALIZADAS - ESTRUCTURA COMPLETA ACTUALIZADA
  const SONG_LIBRARIES = [
    // ======================================================
    // 🎵 MÚSICA ORIGINAL - Carpeta: 01-chords-musica-original
    // ======================================================
    { 
      id: 'alegondra', 
      name: 'Ale Gondra', 
      path: '/listado-chords-alegondramusic.json', 
      basePath: '/data/01-chords-musica-original/chords-alegondramusic/' 
    },
    { 
      id: 'almangopop', 
      name: 'Almango Pop', 
      path: '/listado-chords-almango-pop.json', 
      basePath: '/data/01-chords-musica-original/chords-almangopop/' 
    },
    
    // ======================================================
    // 🎭 SHOWS ESPECÍFICOS - Carpeta: 03-chords-de-shows-por-listados
    // ======================================================
    { 
      id: 'casamiento', 
      name: 'Casamiento', 
      path: '/listado-chords-casamiento-ale-fabi.json', 
      basePath: '/data/03-chords-de-shows-por-listados/chords-show-casamiento-ale-fabi/' 
    },
    
    // ======================================================
    // 🎸 COVERS ORGANIZADOS POR GÉNERO - Carpeta: 02-chords-covers
    // ======================================================
    { 
      id: 'covers-baladasespanol', 
      name: 'Baladas Español', 
      path: '/listadocancionescovers-baladasespanol.json', 
      basePath: '/data/02-chords-covers/cancionescovers-baladasespanol/' 
    },
    { 
      id: 'covers-baladasingles', 
      name: 'Baladas Inglés', 
      path: '/listadocancionescovers-baladasingles.json', 
      basePath: '/data/02-chords-covers/cancionescovers-baladasingles/' 
    },
    { 
      id: 'covers-poprockespanol', 
      name: 'Pop Rock Español', 
      path: '/listadocancionescovers-poprockespanol.json', 
      basePath: '/data/02-chords-covers/cancionescovers-poprockespanol/' 
    },
    { 
      id: 'covers-poprockingles', 
      name: 'Pop Rock Inglés', 
      path: '/listadocancionescovers-poprockingles.json', 
      basePath: '/data/02-chords-covers/cancionescovers-poprockingles/' 
    },
    { 
      id: 'covers-latinobailableespanol', 
      name: 'Latino Bailable', 
      path: '/listadocancionescovers-latinobailableespanol.json', 
      basePath: '/data/02-chords-covers/cancionescovers-latinobailableespanol/' 
    },
    { 
      id: 'covers-rockbailableespanol', 
      name: 'Rock Bailable Español', 
      path: '/listadocancionescovers-rockbailableespanol.json', 
      basePath: '/data/02-chords-covers/cancionescovers-rockbailableespanol/' 
    },
    { 
      id: 'covers-rockbailableingles', 
      name: 'Rock Bailable Inglés', 
      path: '/listadocancionescovers-rockbailableingles.json', 
      basePath: '/data/02-chords-covers/cancionescovers-rockbailableingles/' 
    },
    { 
      id: 'covers-hardrock-punkespanol', 
      name: 'Hard Rock/Punk Español', 
      path: '/listadocancionescovers-hardrock-punkespanol.json', 
      basePath: '/data/02-chords-covers/cancionescovers-hardrock-punkespanol/' 
    },
    { 
      id: 'covers-hardrock-punkingles', 
      name: 'Hard Rock/Punk Inglés', 
      path: '/listadocancionescovers-hardrock-punkingles.json', 
      basePath: '/data/02-chords-covers/cancionescovers-hardrock-punkingles/' 
    },
    { 
      id: 'covers-discoingles', 
      name: 'Disco Inglés', 
      path: '/listadocancionescovers-discoingles.json', 
      basePath: '/data/02-chords-covers/cancionescovers-discoingles/' 
    },
    { 
      id: 'covers-reggaeingles', 
      name: 'Reggae Inglés', 
      path: '/listadocancionescovers-reggaeingles.json', 
      basePath: '/data/02-chords-covers/cancionescovers-reggaeingles/' 
    },
    { 
      id: 'covers-festivos-bso', 
      name: 'Festivos & BSO', 
      path: '/listadocancionescovers-festivos-bso.json', 
      basePath: '/data/02-chords-covers/cancionescovers-festivos-bso/' 
    }
  ];

  // CARGAR DATOS COMPLETOS DE UNA BIBLIOTECA
  const loadLibraryData = useCallback(async (library) => {
    try {
      console.log(`📥 Cargando biblioteca: ${library.name} desde ${library.path}`);
      const response = await fetch(library.path);
      
      if (!response.ok) {
        console.warn(`❌ No se pudo cargar: ${library.path} - Status: ${response.status}`);
        return null;
      }

      const text = await response.text();
      if (!text.trim()) {
        console.warn(`⚠️ Archivo vacío: ${library.path}`);
        return null;
      }

      const data = JSON.parse(text);
      console.log(`✅ Biblioteca cargada: ${library.name}`, data);

      return {
        ...library,
        rawData: data,
        albums: data.albums || [],
        songs: data.songs || []
      };
    } catch (error) {
      console.error(`💥 Error cargando ${library.name}:`, error);
      return null;
    }
  }, []);

  // CARGAR TODAS LAS BIBLIOTECAS Y CONSTRUIR ÍNDICE
  const loadAllLibraries = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Iniciando carga completa de bibliotecas...');
      
      const librariesMap = {};
      const allSongsData = [];
      const searchMap = new Map();

      // CARGAR TODAS LAS BIBLIOTECAS EN PARALELO
      const libraryPromises = SONG_LIBRARIES.map(library => loadLibraryData(library));
      const libraryResults = await Promise.all(libraryPromises);

      libraryResults.forEach((libraryData, index) => {
        if (libraryData) {
          const library = SONG_LIBRARIES[index];
          librariesMap[library.id] = libraryData;
          
          // PROCESAR CANCIONES DE LA BIBLIOTECA
          let songs = [];
          if (libraryData.albums.length > 0) {
            // ESTRUCTURA CON ÁLBUMES
            songs = libraryData.albums.flatMap(album => 
              (album.songs || []).map(song => ({
                ...song,
                id: song.id || `${library.id}-${song.file}`,
                libraryId: library.id,
                libraryName: library.name,
                basePath: library.basePath,
                albumId: album.album_id,
                albumName: album.album_name,
                trackNumber: song.track_number,
                fullPath: `${library.basePath}${song.file}`,
                searchKey: `${song.title} ${song.artist} ${song.key} ${library.name}`.toLowerCase()
              }))
            );
          } else if (libraryData.songs.length > 0) {
            // ESTRUCTURA DIRECTA CON CANCIONES
            songs = libraryData.songs.map(song => ({
              ...song,
              id: song.id || `${library.id}-${song.file}`,
              libraryId: library.id,
              libraryName: library.name,
              basePath: library.basePath,
              fullPath: `${library.basePath}${song.file}`,
              searchKey: `${song.title} ${song.artist} ${song.key} ${library.name}`.toLowerCase()
            }));
          }
          
          // AGREGAR AL ÍNDICE DE BÚSQUEDA
          songs.forEach(song => {
            if (song.searchKey) {
              searchMap.set(song.searchKey, song);
            }
          });
          
          allSongsData.push(...songs);
          console.log(`📊 ${library.name}: ${songs.length} canciones procesadas`);
        }
      });

      setLibrariesData(librariesMap);
      setAllSongs(allSongsData);
      setSearchIndex(searchMap);
      console.log('🎉 Carga completada:', {
        bibliotecas: Object.keys(librariesMap).length,
        canciones: allSongsData.length,
        indice: searchMap.size
      });

    } catch (error) {
      console.error('💥 Error crítico cargando bibliotecas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadLibraryData]);

  // BÚSQUEDA INTELIGENTE EN EL ÍNDICE
  const searchSongs = useCallback((query) => {
    if (!query.trim()) return [];
    
    const term = query.toLowerCase().trim();
    setLastSearch(term);
    
    const results = [];
    
    // BUSCAR EN EL ÍNDICE
    for (const [key, song] of searchIndex.entries()) {
      if (key.includes(term)) {
        results.push(song);
      }
    }

    // ORDENAR POR RELEVANCIA
    return results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // PRIORIZAR COINCIDENCIAS EXACTAS EN TÍTULO
      if (aTitle === term && bTitle !== term) return -1;
      if (bTitle === term && aTitle !== term) return 1;
      
      // PRIORIZAR COINCIDENCIAS AL INICIO
      if (aTitle.startsWith(term) && !bTitle.startsWith(term)) return -1;
      if (bTitle.startsWith(term) && !aTitle.startsWith(term)) return 1;
      
      return aTitle.localeCompare(bTitle);
    });
  }, [searchIndex]);

  // OBTENER CANCIONES DE UNA BIBLIOTECA
  const getSongsByLibrary = useCallback((libraryId) => {
    const songs = allSongs.filter(song => song.libraryId === libraryId);
    console.log(`🎵 Canciones en biblioteca ${libraryId}:`, songs.length);
    return songs;
  }, [allSongs]);

  // OBTENER ÁLBUMES DE UNA BIBLIOTECA
  const getAlbumsByLibrary = useCallback((libraryId) => {
    const library = librariesData[libraryId];
    const albums = library?.albums || [];
    console.log(`📀 Álbumes en biblioteca ${libraryId}:`, albums.length);
    return albums;
  }, [librariesData]);

  // OBTENER CANCIONES DE UN ÁLBUM
  const getSongsByAlbum = useCallback((libraryId, albumId) => {
    const library = librariesData[libraryId];
    if (!library) return [];
    
    const album = library.albums.find(a => a.album_id === albumId);
    const songs = album?.songs || [];
    console.log(`🎶 Canciones en álbum ${albumId}:`, songs.length);
    return songs;
  }, [librariesData]);

  // OBTENER CANCIÓN SIGUIENTE/ANTERIOR EN LA LISTA
  const getAdjacentSongs = useCallback((currentSong) => {
    if (!currentSong) {
      console.log('❌ No hay canción actual para obtener adyacentes');
      return { previous: null, next: null };
    }
    
    const librarySongs = getSongsByLibrary(currentSong.libraryId);
    const currentIndex = librarySongs.findIndex(song => 
      song.file === currentSong.file
    );
    
    const result = {
      previous: currentIndex > 0 ? librarySongs[currentIndex - 1] : null,
      next: currentIndex < librarySongs.length - 1 ? librarySongs[currentIndex + 1] : null
    };
    
    console.log(`🔍 Canciones adyacentes para ${currentSong.title}:`, {
      currentIndex,
      total: librarySongs.length,
      previous: result.previous?.title,
      next: result.next?.title
    });
    
    return result;
  }, [getSongsByLibrary]);

  // OBTENER RUTA PARA NAVEGACIÓN
  const getSongNavigationPath = useCallback((song) => {
    if (!song || !song.libraryId) {
      console.log('❌ No se puede generar ruta: canción o libraryId faltante');
      return null;
    }
    
    const encodedSongFile = encodeURIComponent(song.file);
    const path = `/chords-viewer?library=${song.libraryId}&song=${encodedSongFile}`;
    console.log(`🛣️ Ruta generada: ${path}`);
    return path;
  }, []);

  // OBTENER CANCIÓN POR LIBRARY Y FILE
  const getSongByLibraryAndFile = useCallback((libraryId, file) => {
    const song = allSongs.find(s => s.libraryId === libraryId && s.file === file);
    console.log(`🔎 Buscando canción: ${libraryId} - ${file}`, song ? '✅ Encontrada' : '❌ No encontrada');
    return song;
  }, [allSongs]);

  // CARGAR AL INICIAR LA APLICACIÓN
  useEffect(() => {
    loadAllLibraries();
  }, [loadAllLibraries]);

  const value = {
    // DATOS
    allSongs,
    libraries: SONG_LIBRARIES,
    librariesData,
    
    // ESTADO
    isLoading,
    lastSearch,
    
    // FUNCIONES DE BÚSQUEDA
    searchSongs,
    getSongNavigationPath,
    getSongByLibraryAndFile,
    
    // FUNCIONES DE NAVEGACIÓN
    getSongsByLibrary,
    getAlbumsByLibrary,
    getSongsByAlbum,
    getAdjacentSongs,
    
    // UTILIDADES
    refreshData: loadAllLibraries
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};