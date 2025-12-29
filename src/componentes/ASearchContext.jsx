// ============================================
// ARCHIVO: ASearchContext.jsx - VERSIÓN COMPLETA
// DESCRIPCIÓN: Contexto de búsqueda global para todas las categorías
// CORRECCIONES: Incluye zapadas en el sistema de carga
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ASearchContext = createContext();

export const useSearch = () => {
  const context = useContext(ASearchContext);
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
  const [loadingErrors, setLoadingErrors] = useState([]);

  // ============================================
  // BIBLIOTECAS CON RUTAS ACTUALIZADAS
  // ============================================
  const SONG_LIBRARIES = [
    // ======================================================
    // 🎵 MÚSICA ORIGINAL
    // ======================================================
    { 
      id: 'original-alegondra', 
      name: 'Ale Gondra', 
      path: '/listados/listados-musica-original/listado-musica-alegondra.json',
      type: 'original'
    },
    { 
      id: 'original-almango', 
      name: 'Almango Pop', 
      path: '/listados/listados-musica-original/listado-musica-almango.json',
      type: 'original'
    },
    
    // ======================================================
    // 🎸 COVERS ORGANIZADOS POR GÉNERO (12 categorías)
    // ======================================================
    { 
      id: 'covers-baladasespanol', 
      name: 'Baladas Español', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasespanol.json',
      type: 'covers',
      genre: 'Baladas Español'
    },
    { 
      id: 'covers-baladasingles', 
      name: 'Baladas Inglés', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasingles.json',
      type: 'covers',
      genre: 'Baladas Inglés'
    },
    { 
      id: 'covers-poprockespanol', 
      name: 'Pop Rock Español', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockespanol.json',
      type: 'covers',
      genre: 'Pop Rock Español'
    },
    { 
      id: 'covers-poprockingles', 
      name: 'Pop Rock Inglés', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockingles.json',
      type: 'covers',
      genre: 'Pop Rock Inglés'
    },
    { 
      id: 'covers-latinobailableespanol', 
      name: 'Latino Bailable', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-latinobailableespanol.json',
      type: 'covers',
      genre: 'Latino Bailable'
    },
    { 
      id: 'covers-rockbailableespanol', 
      name: 'Rock Bailable Español', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableespanol.json',
      type: 'covers',
      genre: 'Rock Bailable Español'
    },
    { 
      id: 'covers-rockbailableingles', 
      name: 'Rock Bailable Inglés', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableingles.json',
      type: 'covers',
      genre: 'Rock Bailable Inglés'
    },
    { 
      id: 'covers-hardrock-punkespanol', 
      name: 'Hard Rock/Punk Español', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkespanol.json',
      type: 'covers',
      genre: 'Hard Rock/Punk Español'
    },
    { 
      id: 'covers-hardrock-punkingles', 
      name: 'Hard Rock/Punk Inglés', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkingles.json',
      type: 'covers',
      genre: 'Hard Rock/Punk Inglés'
    },
    { 
      id: 'covers-discoingles', 
      name: 'Disco Inglés', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-discoingles.json',
      type: 'covers',
      genre: 'Disco Inglés'
    },
    { 
      id: 'covers-reggaeingles', 
      name: 'Reggae Inglés', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-reggaeingles.json',
      type: 'covers',
      genre: 'Reggae Inglés'
    },
    { 
      id: 'covers-festivos-bso', 
      name: 'Festivos & BSO', 
      path: '/listados/listados-musica-covers-por-genero/listadocancionescovers-festivos-bso.json',
      type: 'covers',
      genre: 'Festivos & BSO'
    },
    
    // ======================================================
    // 🎶 MEDLEYS
    // ======================================================
    { 
      id: 'medleys', 
      name: 'Medleys', 
      path: '/listados/listados-musica-medleys/listado-musica-covers-medleys.json',
      type: 'medleys'
    },
    
    // ======================================================
    // 👑 HOMENAJES (TODOS LOS ARCHIVOS)
    // ======================================================
    { 
      id: 'homenaje-acdc', 
      name: 'AC/DC', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-acdc.json',
      type: 'homenajes',
      genre: 'Hard Rock'
    },
    { 
      id: 'homenaje-adams-sting-stewart', 
      name: 'Bryan Adams, Sting, Rod Stewart', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-adams-sting-stewart.json',
      type: 'homenajes',
      genre: 'Rock Internacional'
    },
    { 
      id: 'homenaje-aerosmith', 
      name: 'Aerosmith', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-aerosmith.json',
      type: 'homenajes',
      genre: 'Hard Rock'
    },
    { 
      id: 'homenaje-alejandro-lerner', 
      name: 'Alejandro Lerner', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-alejandro-lerner.json',
      type: 'homenajes',
      genre: 'Rock Argentino'
    },
    { 
      id: 'homenaje-andres-calamaro', 
      name: 'Andrés Calamaro', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-andres-calamaro.json',
      type: 'homenajes',
      genre: 'Rock Argentino'
    },
    { 
      id: 'homenaje-beatles', 
      name: 'The Beatles', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-beatles.json',
      type: 'homenajes',
      genre: 'Rock'
    },
    { 
      id: 'homenaje-bersuit', 
      name: 'Bersuit Vergarabat', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-bersuit.json',
      type: 'homenajes',
      genre: 'Rock Argentino'
    },
    { 
      id: 'homenaje-bon-jovi', 
      name: 'Bon Jovi', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-bon-jovi.json',
      type: 'homenajes',
      genre: 'Rock'
    },
    { 
      id: 'homenaje-cadillacs-pericos-kapanga', 
      name: 'Cadillacs, Pericos, Kapanga', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-cadillacs-pericos-kapanga.json',
      type: 'homenajes',
      genre: 'Ska/Rock Argentino'
    },
    { 
      id: 'homenaje-ccr', 
      name: 'Creedence Clearwater Revival', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-ccr.json',
      type: 'homenajes',
      genre: 'Rock & Roll'
    },
    { 
      id: 'homenaje-cerati-soda', 
      name: 'Gustavo Cerati & Soda Stereo', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-cerati-soda.json',
      type: 'homenajes',
      genre: 'Rock Latino'
    },
    { 
      id: 'homenaje-coldplay', 
      name: 'Coldplay', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-coldplay.json',
      type: 'homenajes',
      genre: 'Pop Rock'
    },
    { 
      id: 'homenaje-diego-torres', 
      name: 'Diego Torres', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-diego-torres.json',
      type: 'homenajes',
      genre: 'Pop Latino'
    },
    { 
      id: 'homenaje-divididos', 
      name: 'Divididos', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-divididos.json',
      type: 'homenajes',
      genre: 'Rock Argentino'
    },
    { 
      id: 'homenaje-elton-john-georgemichael', 
      name: 'Elton John & George Michael', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-elton-john-georgemichael.json',
      type: 'homenajes',
      genre: 'Pop Rock'
    },
    { 
      id: 'homenaje-enanitosverdes', 
      name: 'Enanitos Verdes', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-enanitosverdes.json',
      type: 'homenajes',
      genre: 'Rock Latino'
    },
    { 
      id: 'homenaje-garcia-paez-spinetta', 
      name: 'Charly García, Fito Páez, Spinetta', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-garcia-paez-spinetta.json',
      type: 'homenajes',
      genre: 'Rock Argentino'
    },
    { 
      id: 'homenaje-green-day-offspring', 
      name: 'Green Day & The Offspring', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-green-day-offspring.json',
      type: 'homenajes',
      genre: 'Punk Rock'
    },
    { 
      id: 'homenaje-gunsnroses', 
      name: 'Guns N\' Roses', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-gunsnroses.json',
      type: 'homenajes',
      genre: 'Hard Rock'
    },
    { 
      id: 'homenaje-inxs', 
      name: 'INXS', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-inxs.json',
      type: 'homenajes',
      genre: 'Rock Alternativo'
    },
    { 
      id: 'homenaje-laley-maná', 
      name: 'La Ley & Maná', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-laley-maná.json',
      type: 'homenajes',
      genre: 'Rock Latino'
    },
    { 
      id: 'homenaje-larenga-pappo-redondos-ratones', 
      name: 'La Renga, Pappo, Los Redondos, Ratones', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-larenga-pappo-redondos-ratones.json',
      type: 'homenajes',
      genre: 'Rock Argentino'
    },
    { 
      id: 'homenaje-lenny-kravitz', 
      name: 'Lenny Kravitz', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-lenny-kravitz.json',
      type: 'homenajes',
      genre: 'Rock'
    },
    { 
      id: 'homenaje-los-pijos', 
      name: 'Los Piojos', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-los-pijos.json',
      type: 'homenajes',
      genre: 'Rock Argentino'
    },
    { 
      id: 'homenaje-michaeljackson', 
      name: 'Michael Jackson', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-michaeljackson.json',
      type: 'homenajes',
      genre: 'Pop'
    },
    { 
      id: 'homenaje-nirvana-foo-fighters-system', 
      name: 'Nirvana, Foo Fighters, System of a Down', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-nirvana-foo-fighters-system.json',
      type: 'homenajes',
      genre: 'Grunge/Rock Alternativo'
    },
    { 
      id: 'homenaje-oasis', 
      name: 'Oasis', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-oasis.json',
      type: 'homenajes',
      genre: 'Britpop'
    },
    { 
      id: 'homenaje-phillcollins', 
      name: 'Phil Collins', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-phillcollins.json',
      type: 'homenajes',
      genre: 'Pop Rock'
    },
    { 
      id: 'homenaje-queen', 
      name: 'Queen', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-queen.json',
      type: 'homenajes',
      genre: 'Rock'
    },
    { 
      id: 'homenaje-redhotchili', 
      name: 'Red Hot Chili Peppers', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-redhotchili.json',
      type: 'homenajes',
      genre: 'Funk Rock'
    },
    { 
      id: 'homenaje-robbiewilliams', 
      name: 'Robbie Williams', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-robbiewilliams.json',
      type: 'homenajes',
      genre: 'Pop'
    },
    { 
      id: 'homenaje-rolling-stones', 
      name: 'The Rolling Stones', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-rolling-stones.json',
      type: 'homenajes',
      genre: 'Rock & Roll'
    },
    { 
      id: 'homenaje-roxette', 
      name: 'Roxette', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-roxette.json',
      type: 'homenajes',
      genre: 'Pop'
    },
    { 
      id: 'homenaje-u2', 
      name: 'U2', 
      path: '/listados/listados-musica-homenajes/listado-musica-homenaje-u2.json',
      type: 'homenajes',
      genre: 'Rock'
    },
    
    // ======================================================
    // 🎹 ZAPADAS - ARCHIVO ESPECÍFICO
    // ======================================================
    { 
      id: 'zapadas', 
      name: 'Zapadas', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas.json',
      type: 'zapadas'
    }
  ];

  // ============================================
  // CARGAR DATOS DE UNA BIBLIOTECA
  // ============================================
  const loadLibraryData = useCallback(async (library) => {
    try {
      console.log(`📥 Cargando biblioteca: ${library.name} desde ${library.path}`);
      const response = await fetch(library.path);
      
      if (!response.ok) {
        console.warn(`⚠️ No se pudo cargar: ${library.path} - Status: ${response.status}`);
        return { ...library, rawData: null, albums: [], songs: [], error: `HTTP ${response.status}` };
      }

      const text = await response.text();
      
      // Verificar si la respuesta es HTML (error 404)
      if (text.trim().startsWith('<!DOCTYPE') || 
          text.trim().startsWith('<html') ||
          text.includes('Page Not Found') ||
          text.includes('404')) {
        console.warn(`⚠️ Archivo devuelve HTML (404): ${library.path}`);
        return { ...library, rawData: null, albums: [], songs: [], error: '404 HTML' };
      }

      if (!text.trim()) {
        console.warn(`⚠️ Archivo vacío: ${library.path}`);
        return { ...library, rawData: null, albums: [], songs: [], error: 'Empty file' };
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(`❌ Error parseando JSON de ${library.path}:`, parseError.message);
        return { ...library, rawData: null, albums: [], songs: [], error: 'Invalid JSON' };
      }
      
      console.log(`✅ Biblioteca cargada: ${library.name}`, { type: library.type, albums: data.albums?.length || 0, songs: data.songs?.length || 0 });

      return {
        ...library,
        rawData: data,
        albums: data.albums || [],
        songs: data.songs || [],
        // Para homenajes, originales y zapadas, usar discografía
        discografia: data.discografia || [],
        artista: data.artista || library.name,
        error: null
      };
    } catch (error) {
      console.error(`💥 Error cargando ${library.name}:`, error);
      return { ...library, rawData: null, albums: [], songs: [], error: error.message };
    }
  }, []);

  // ============================================
  // CARGAR TODAS LAS BIBLIOTECAS Y CONSTRUIR ÍNDICE
  // ============================================
  const loadAllLibraries = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingErrors([]);
      console.log('🔄 Iniciando carga completa de bibliotecas...');
      
      const librariesMap = {};
      const allSongsData = [];
      const searchMap = new Map();
      const errors = [];

      // CARGAR TODAS LAS BIBLIOTECAS EN PARALELO
      const libraryPromises = SONG_LIBRARIES.map(library => loadLibraryData(library));
      const libraryResults = await Promise.all(libraryPromises);

      libraryResults.forEach((libraryData) => {
        if (libraryData.error) {
          errors.push({
            library: libraryData.name,
            path: libraryData.path,
            error: libraryData.error
          });
          return;
        }

        const libraryId = libraryData.id;
        librariesMap[libraryId] = libraryData;
        
        // PROCESAR CANCIONES SEGÚN EL TIPO DE BIBLIOTECA
        let songs = [];
        
        // PARA COVERS Y MEDLEYS (formato con albums y songs)
        if (libraryData.type === 'covers' || libraryData.type === 'medleys') {
          if (libraryData.albums.length > 0) {
            songs = libraryData.albums.flatMap(album => 
              (album.songs || []).map(song => ({
                ...song,
                id: song.id || `${libraryId}-${song.file || song.title?.replace(/\s+/g, '-')}`,
                libraryId,
                libraryName: libraryData.name,
                libraryType: libraryData.type,
                albumId: album.album_id,
                albumName: album.album_name,
                trackNumber: song.track_number || 0,
                basePath: album.basePath || '/chords/',
                fullPath: song.file ? `${album.basePath || '/chords/'}${song.file}` : null,
                searchKey: `${song.title || ''} ${song.artist || ''} ${song.key || ''} ${libraryData.name} ${libraryData.genre || ''}`.toLowerCase(),
                // Para compatibilidad con el reproductor
                nombre: song.title,
                artista: song.artist,
                duracion: song.duration || '3:30',
                url: song.mp3_file || song.url || `/audio/default-${libraryData.type}.mp3`,
                chords_url: song.file ? `${album.basePath || '/chords/'}${song.file}` : null
              }))
            );
          }
        }
        // PARA ORIGINALES, HOMENAJES Y ZAPADAS (formato con discografía)
        else if (libraryData.discografia && libraryData.discografia.length > 0) {
          songs = libraryData.discografia.flatMap(disco => 
            (disco.songs || []).map(song => ({
              ...song,
              id: song.id || `${libraryId}-${disco.album_id || 'disco'}-${song.title?.replace(/\s+/g, '-')}`,
              libraryId,
              libraryName: libraryData.name,
              libraryType: libraryData.type,
              albumId: disco.album_id,
              albumName: disco.album_name,
              trackNumber: song.track_number || 0,
              searchKey: `${song.title || ''} ${song.artist || ''} ${song.key || ''} ${libraryData.name} ${libraryData.genre || ''}`.toLowerCase(),
              // Para compatibilidad con el reproductor
              nombre: song.title,
              artista: song.artist || libraryData.artista,
              duracion: song.duration || '3:30',
              url: song.mp3_url || song.url || `/audio/default-${libraryData.type}.mp3`,
              chords_url: song.chords_url,
              detalles: {
                genero: libraryData.genre || disco.genre,
                style: song.style,
                tipo: libraryData.type,
                categoria: libraryData.type === 'homenajes' ? 'Homenajes' : libraryData.type
              },
              esHomenaje: libraryData.type === 'homenajes',
              esZapada: libraryData.type === 'zapadas'
            }))
          );
        }
        
        // AGREGAR AL ÍNDICE DE BÚSQUEDA
        songs.forEach(song => {
          if (song.searchKey) {
            searchMap.set(song.searchKey, song);
          }
        });
        
        allSongsData.push(...songs);
        console.log(`📊 ${libraryData.name} (${libraryData.type}): ${songs.length} canciones procesadas`);
      });

      setLibrariesData(librariesMap);
      setAllSongs(allSongsData);
      setSearchIndex(searchMap);
      setLoadingErrors(errors);
      
      console.log('🎉 Carga completada:', {
        bibliotecas: Object.keys(librariesMap).length,
        canciones: allSongsData.length,
        indice: searchMap.size,
        errores: errors.length
      });

      // Mostrar errores si los hay
      if (errors.length > 0) {
        console.warn('📋 Bibliotecas con errores:');
        errors.forEach(err => {
          console.warn(`  - ${err.library}: ${err.error} (${err.path})`);
        });
      }

    } catch (error) {
      console.error('💥 Error crítico cargando bibliotecas:', error);
      setLoadingErrors([{ library: 'General', error: error.message }]);
    } finally {
      setIsLoading(false);
    }
  }, [loadLibraryData]);

  // ============================================
  // BÚSQUEDA INTELIGENTE EN EL ÍNDICE
  // ============================================
  const searchSongs = useCallback((query, category = 'all') => {
    if (!query.trim()) return [];
    
    const term = query.toLowerCase().trim();
    setLastSearch(term);
    
    const results = [];
    
    // BUSCAR EN EL ÍNDICE CON FILTRO POR CATEGORÍA
    for (const [key, song] of searchIndex.entries()) {
      if (key.includes(term)) {
        // Filtrar por categoría si se especifica
        if (category === 'all' || 
            (category === 'original' && song.libraryType === 'original') ||
            (category === 'covers' && song.libraryType === 'covers') ||
            (category === 'medleys' && song.libraryType === 'medleys') ||
            (category === 'homenajes' && song.libraryType === 'homenajes') ||
            (category === 'zapadas' && song.libraryType === 'zapadas')) {
          results.push(song);
        }
      }
    }

    // ORDENAR POR RELEVANCIA
    return results.sort((a, b) => {
      const aTitle = a.nombre || a.title || '';
      const bTitle = b.nombre || b.title || '';
      const aTitleLower = aTitle.toLowerCase();
      const bTitleLower = bTitle.toLowerCase();
      
      // PRIORIZAR COINCIDENCIAS EXACTAS EN TÍTULO
      if (aTitleLower === term && bTitleLower !== term) return -1;
      if (bTitleLower === term && aTitleLower !== term) return 1;
      
      // PRIORIZAR COINCIDENCIAS AL INICIO
      if (aTitleLower.startsWith(term) && !bTitleLower.startsWith(term)) return -1;
      if (bTitleLower.startsWith(term) && !aTitleLower.startsWith(term)) return 1;
      
      // PRIORIZAR POR TIPO (original primero, luego covers, etc.)
      const typeOrder = { original: 0, covers: 1, medleys: 2, homenajes: 3, zapadas: 4 };
      const aType = typeOrder[a.libraryType] || 5;
      const bType = typeOrder[b.libraryType] || 5;
      
      if (aType !== bType) return aType - bType;
      
      return aTitleLower.localeCompare(bTitleLower);
    });
  }, [searchIndex]);

  // ============================================
  // OBTENER CANCIONES POR TIPO
  // ============================================
  const getSongsByType = useCallback((type) => {
    const songs = allSongs.filter(song => song.libraryType === type);
    console.log(`🎵 Canciones de tipo ${type}:`, songs.length);
    return songs;
  }, [allSongs]);

  // ============================================
  // OBTENER CANCIONES DE UNA BIBLIOTECA
  // ============================================
  const getSongsByLibrary = useCallback((libraryId) => {
    const songs = allSongs.filter(song => song.libraryId === libraryId);
    console.log(`🎵 Canciones en biblioteca ${libraryId}:`, songs.length);
    return songs;
  }, [allSongs]);

  // ============================================
  // OBTENER ÁLBUMES DE UNA BIBLIOTECA
  // ============================================
  const getAlbumsByLibrary = useCallback((libraryId) => {
    const library = librariesData[libraryId];
    if (!library) return [];
    
    const albums = library.albums || [];
    console.log(`📀 Álbumes en biblioteca ${libraryId}:`, albums.length);
    return albums;
  }, [librariesData]);

  // ============================================
  // OBTENER CANCIONES DE UN ÁLBUM
  // ============================================
  const getSongsByAlbum = useCallback((libraryId, albumId) => {
    const library = librariesData[libraryId];
    if (!library) return [];
    
    let songs = [];
    
    if (library.albums && library.albums.length > 0) {
      const album = library.albums.find(a => a.album_id === albumId);
      songs = album?.songs || [];
    } else if (library.discografia && library.discografia.length > 0) {
      const disco = library.discografia.find(d => d.album_id === albumId);
      songs = disco?.songs || [];
    }
    
    console.log(`🎶 Canciones en álbum ${albumId}:`, songs.length);
    return songs;
  }, [librariesData]);

  // ============================================
  // OBTENER CANCIÓN SIGUIENTE/ANTERIOR EN LA LISTA
  // ============================================
  const getAdjacentSongs = useCallback((currentSong) => {
    if (!currentSong) {
      console.log('❌ No hay canción actual para obtener adyacentes');
      return { previous: null, next: null };
    }
    
    const librarySongs = getSongsByLibrary(currentSong.libraryId);
    const currentIndex = librarySongs.findIndex(song => 
      song.id === currentSong.id
    );
    
    const result = {
      previous: currentIndex > 0 ? librarySongs[currentIndex - 1] : null,
      next: currentIndex < librarySongs.length - 1 ? librarySongs[currentIndex + 1] : null
    };
    
    console.log(`🔍 Canciones adyacentes para ${currentSong.nombre || currentSong.title}:`, {
      currentIndex,
      total: librarySongs.length,
      previous: result.previous?.nombre || result.previous?.title,
      next: result.next?.nombre || result.next?.title
    });
    
    return result;
  }, [getSongsByLibrary]);

  // ============================================
  // OBTENER RUTA PARA NAVEGACIÓN
  // ============================================
  const getSongNavigationPath = useCallback((song) => {
    if (!song || !song.libraryId) {
      console.log('❌ No se puede generar ruta: canción o libraryId faltante');
      return null;
    }
    
    const encodedSongId = encodeURIComponent(song.id);
    const path = `/chords-viewer?library=${song.libraryId}&song=${encodedSongId}`;
    console.log(`🛣️ Ruta generada: ${path}`);
    return path;
  }, []);

  // ============================================
  // OBTENER CANCIÓN POR ID
  // ============================================
  const getSongById = useCallback((songId) => {
    const song = allSongs.find(s => s.id === songId);
    console.log(`🔎 Buscando canción por ID: ${songId}`, song ? '✅ Encontrada' : '❌ No encontrada');
    return song;
  }, [allSongs]);

  // ============================================
  // OBTENER ESTADÍSTICAS
  // ============================================
  const getStats = useCallback(() => {
    const stats = {
      total: allSongs.length,
      byType: {},
      byLibrary: {}
    };

    // Contar por tipo
    allSongs.forEach(song => {
      const type = song.libraryType || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      const library = song.libraryId || 'unknown';
      stats.byLibrary[library] = (stats.byLibrary[library] || 0) + 1;
    });

    return stats;
  }, [allSongs]);

  // ============================================
  // CARGAR AL INICIAR LA APLICACIÓN
  // ============================================
  useEffect(() => {
    loadAllLibraries();
  }, [loadAllLibraries]);

  // ============================================
  // VALOR DEL CONTEXTO
  // ============================================
  const value = {
    // DATOS
    allSongs,
    libraries: SONG_LIBRARIES,
    librariesData,
    
    // ESTADO
    isLoading,
    lastSearch,
    loadingErrors,
    
    // FUNCIONES DE BÚSQUEDA
    searchSongs,
    getSongNavigationPath,
    getSongById,
    
    // FUNCIONES DE NAVEGACIÓN Y FILTRADO
    getSongsByType,
    getSongsByLibrary,
    getAlbumsByLibrary,
    getSongsByAlbum,
    getAdjacentSongs,
    
    // UTILIDADES
    getStats,
    refreshData: loadAllLibraries
  };

  return (
    <ASearchContext.Provider value={value}>
      {children}
    </ASearchContext.Provider>
  );
};

export default ASearchContext;