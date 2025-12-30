// ============================================
// ARCHIVO: ASearchContext.jsx - VERSIÓN COMPLETA
// DESCRIPCIÓN: Contexto de búsqueda global para todas las categorías
// CORRECCIONES: Zapadas ahora divididas por género en archivos separados
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
    // 🎹 ZAPADAS POR GÉNERO (17 archivos individuales)
    // ======================================================
    { 
      id: 'zapadas-blues', 
      name: 'Zapadas Blues', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-blues.json',
      type: 'zapadas',
      genre: 'Blues',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-rock', 
      name: 'Zapadas Rock', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-rock.json',
      type: 'zapadas',
      genre: 'Rock',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-country', 
      name: 'Zapadas Country', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-country.json',
      type: 'zapadas',
      genre: 'Country',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-electronica', 
      name: 'Zapadas Electrónica', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-electronica.json',
      type: 'zapadas',
      genre: 'Electrónica',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-experimentales', 
      name: 'Zapadas Experimentales', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-experimentales.json',
      type: 'zapadas',
      genre: 'Experimental',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-folklore', 
      name: 'Zapadas Folklore', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-folklore.json',
      type: 'zapadas',
      genre: 'Folklore',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-funk', 
      name: 'Zapadas Funk', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-funk.json',
      type: 'zapadas',
      genre: 'Funk',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-jazz', 
      name: 'Zapadas Jazz', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-jazz.json',
      type: 'zapadas',
      genre: 'Jazz',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-latino', 
      name: 'Zapadas Latino', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-latino.json',
      type: 'zapadas',
      genre: 'Latino',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-metal', 
      name: 'Zapadas Metal', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-metal.json',
      type: 'zapadas',
      genre: 'Metal',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-pop', 
      name: 'Zapadas Pop', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-pop.json',
      type: 'zapadas',
      genre: 'Pop',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-r&b', 
      name: 'Zapadas R&B', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-r&b.json',
      type: 'zapadas',
      genre: 'R&B',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-reggae', 
      name: 'Zapadas Reggae', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-reggae.json',
      type: 'zapadas',
      genre: 'Reggae',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-ska', 
      name: 'Zapadas Ska', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-ska.json',
      type: 'zapadas',
      genre: 'Ska',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-soul', 
      name: 'Zapadas Soul', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-soul.json',
      type: 'zapadas',
      genre: 'Soul',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-tango', 
      name: 'Zapadas Tango', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-tango.json',
      type: 'zapadas',
      genre: 'Tango',
      artista_real: 'Almango Pop'
    },
    { 
      id: 'zapadas-urban', 
      name: 'Zapadas Urban', 
      path: '/listados/listados-musica-zapadas/listado-musica-zapadas-urban.json',
      type: 'zapadas',
      genre: 'Urban',
      artista_real: 'Almango Pop'
    }
  ];

  // ============================================
  // CARGAR DATOS DE UNA BIBLIOTECA CON MANEJO DE ERRORES
  // ============================================
  const loadLibraryData = useCallback(async (library) => {
    try {
      console.log(`📥 Cargando biblioteca: ${library.name} desde ${library.path}`);
      const response = await fetch(library.path);
      
      if (!response.ok) {
        const errorMsg = `No se pudo cargar ${library.name} (${response.status})`;
        console.warn(`⚠️ ${errorMsg}`);
        return { 
          ...library, 
          rawData: null, 
          albums: [], 
          songs: [], 
          discografia: [],
          error: errorMsg,
          failed: true 
        };
      }

      const text = await response.text();
      
      // Verificar si la respuesta es HTML (error 404)
      if (text.trim().startsWith('<!DOCTYPE') || 
          text.trim().startsWith('<html') ||
          text.includes('Page Not Found') ||
          text.includes('404')) {
        const errorMsg = `Archivo no encontrado (404): ${library.path}`;
        console.warn(`⚠️ ${errorMsg}`);
        return { 
          ...library, 
          rawData: null, 
          albums: [], 
          songs: [], 
          discografia: [],
          error: errorMsg,
          failed: true 
        };
      }

      if (!text.trim()) {
        const errorMsg = `Archivo vacío: ${library.path}`;
        console.warn(`⚠️ ${errorMsg}`);
        return { 
          ...library, 
          rawData: null, 
          albums: [], 
          songs: [], 
          discografia: [],
          error: errorMsg,
          failed: true 
        };
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        const errorMsg = `Error parseando JSON: ${parseError.message}`;
        console.error(`❌ ${errorMsg} de ${library.path}`);
        return { 
          ...library, 
          rawData: null, 
          albums: [], 
          songs: [], 
          discografia: [],
          error: errorMsg,
          failed: true 
        };
      }
      
      console.log(`✅ Biblioteca cargada: ${library.name}`, { 
        type: library.type, 
        albums: data.albums?.length || 0, 
        songs: data.songs?.length || 0,
        discografia: data.discografia?.length || 0
      });

      return {
        ...library,
        rawData: data,
        albums: data.albums || [],
        songs: data.songs || [],
        discografia: data.discografia || [],
        artista: data.artista || library.name,
        error: null,
        failed: false
      };
    } catch (error) {
      console.error(`💥 Error cargando ${library.name}:`, error);
      return { 
        ...library, 
        rawData: null, 
        albums: [], 
        songs: [], 
        discografia: [],
        error: error.message,
        failed: true 
      };
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
        const libraryId = libraryData.id;
        
        // REGISTRAR ERRORES
        if (libraryData.failed || libraryData.error) {
          errors.push({
            library: libraryData.name,
            path: libraryData.path,
            error: libraryData.error || 'Error desconocido',
            type: libraryData.type
          });
          
          // Aun así, agregar la biblioteca vacía para mantener la estructura
          librariesMap[libraryId] = {
            ...libraryData,
            songs: [],
            albums: [],
            discografia: []
          };
          return;
        }

        // PROCESAR BIBLIOTECA EXITOSA
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
                chords_url: song.file ? `${album.basePath || '/chords/'}${song.file}` : null,
                esZapada: false
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
        exitosas: Object.keys(librariesMap).length - errors.length,
        fallidas: errors.length,
        canciones: allSongsData.length,
        indice: searchMap.size
      });

      // Mostrar errores si los hay
      if (errors.length > 0) {
        console.warn('📋 Bibliotecas con errores:');
        errors.forEach((err, index) => {
          console.warn(`  ${index + 1}. ${err.library} (${err.type}): ${err.error}`);
        });
      }

    } catch (error) {
      console.error('💥 Error crítico cargando bibliotecas:', error);
      setLoadingErrors([{ 
        library: 'General', 
        path: 'All libraries', 
        error: error.message,
        type: 'system'
      }]);
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
  // OBTENER ESTADÍSTICAS POR TIPO
  // ============================================
  const getStats = useCallback(() => {
    const stats = {
      total: allSongs.length,
      byType: {},
      byLibrary: {},
      failedLibraries: loadingErrors.length
    };

    // Contar por tipo
    allSongs.forEach(song => {
      const type = song.libraryType || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      const library = song.libraryId || 'unknown';
      stats.byLibrary[library] = (stats.byLibrary[library] || 0) + 1;
    });

    return stats;
  }, [allSongs, loadingErrors]);

  // ============================================
  // OBTENER ZAPADAS POR GÉNERO ESPECÍFICO
  // ============================================
  const getZapadasByGenre = useCallback((genre) => {
    const zapadasSongs = allSongs.filter(song => 
      song.libraryType === 'zapadas' && song.libraryId === `zapadas-${genre.toLowerCase()}`
    );
    return zapadasSongs;
  }, [allSongs]);

  // ============================================
  // OBTENER TODOS LOS GÉNEROS DE ZAPADAS DISPONIBLES
  // ============================================
  const getAvailableZapadasGenres = useCallback(() => {
    const zapadasLibraries = SONG_LIBRARIES.filter(lib => lib.type === 'zapadas');
    return zapadasLibraries.map(lib => ({
      id: lib.id.replace('zapadas-', ''),
      name: lib.name.replace('Zapadas ', ''),
      genre: lib.genre,
      path: lib.path,
      songCount: allSongs.filter(song => song.libraryId === lib.id).length
    }));
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
    getSongNavigationPath: (song) => {
      if (!song || !song.libraryId) return null;
      const encodedSongId = encodeURIComponent(song.id);
      return `/chords-viewer?library=${song.libraryId}&song=${encodedSongId}`;
    },
    getSongById: (songId) => allSongs.find(s => s.id === songId),
    
    // FUNCIONES DE NAVEGACIÓN Y FILTRADO
    getSongsByType: (type) => allSongs.filter(song => song.libraryType === type),
    getSongsByLibrary: (libraryId) => allSongs.filter(song => song.libraryId === libraryId),
    getAlbumsByLibrary: (libraryId) => librariesData[libraryId]?.albums || [],
    getSongsByAlbum: (libraryId, albumId) => {
      const library = librariesData[libraryId];
      if (!library) return [];
      
      let songs = [];
      if (library.albums?.length > 0) {
        const album = library.albums.find(a => a.album_id === albumId);
        songs = album?.songs || [];
      } else if (library.discografia?.length > 0) {
        const disco = library.discografia.find(d => d.album_id === albumId);
        songs = disco?.songs || [];
      }
      return songs;
    },
    
    // FUNCIONES ESPECÍFICAS PARA ZAPADAS
    getZapadasByGenre,
    getAvailableZapadasGenres,
    
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