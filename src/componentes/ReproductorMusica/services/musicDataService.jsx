// ============================================
// ARCHIVO: musicDataService.jsx - VERSIÓN COMPLETA CORREGIDA
// DESCRIPCIÓN: Servicio para cargar datos musicales de 3 categorías (original, covers, medleys)
// CORRECCIÓN PRINCIPAL: Función loadChordsData ahora maneja correctamente medleys (arrays en chords_url)
// COMUNICACIÓN: Se usa desde MMusicaEscucha.jsx para cargar datos y acordes
// ============================================

// ============================================
// FUNCIÓN: loadMusicData
// DESCRIPCIÓN: Carga datos de un archivo JSON y detecta su formato automáticamente
// PARÁMETROS: jsonPath - Ruta al archivo JSON
// RETORNO: Configuración procesada para discos/canciones
// FORMATOS SOPORTADOS:
//   1. Formato ORIGINAL/MEDLEYS: {artista: "...", discografia: [...]}
//   2. Formato COVERS: {name: "...", artist: "...", albums: [...]}
// ============================================
export const loadMusicData = async (jsonPath) => {
  try {
    console.log(`📥 Cargando: ${jsonPath}`);
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error(`Archivo no encontrado: ${jsonPath}`);
    }

    const jsonData = await response.json();

    // DETECTAR FORMATO Y TRANSFORMAR
    if (jsonData.artista && jsonData.discografia) {
      // FORMATO 1: ORIGINALES y MEDLEYS
      console.log(`🔧 Formato ORIGINAL/MEDLEY detectado: ${jsonPath}`);
      return transformToConfigDiscos(jsonData);
    } else if (jsonData.name && jsonData.albums) {
      // FORMATO 2: COVERS
      console.log(`🔧 Formato COVER detectado: ${jsonPath}`);
      return transformCoversFormat(jsonData);
    } else {
      console.error(`❌ Formato desconocido en ${jsonPath}:`, jsonData);
      throw new Error(`Formato no reconocido: ${jsonPath}`);
    }

  } catch (error) {
    console.error('Error en loadMusicData:', error);
    throw error;
  }
};

// ============================================
// FUNCIÓN: transformToConfigDiscos
// DESCRIPCIÓN: Transforma datos del formato ORIGINAL/MEDLEYS a configuración interna
// PARÁMETROS: artistData - Datos del artista con discografía
// RETORNO: Objeto de configuración de discos
// ESPECIAL: Marca canciones con esMedley: true cuando chords_url es un array
// ============================================
const transformToConfigDiscos = (artistData) => {
  const config = {};

  artistData.discografia.forEach((album, albumIndex) => {
    const artistaSlug = artistData.artista.toLowerCase().replace(/\s+/g, '-');
    const discoId = `${artistaSlug}-${album.album_id || albumIndex}`;

    // DETERMINAR PORTADA SEGÚN TIPO
    let portadaDefault = '/img/default-cover.png';

    if (artistData.artista.includes('Almango') ||
        album.album_name?.includes('COVERS')) {
      portadaDefault = '/img/09-discos/tapa-listado-covers.jpg';
    }

    if (album.album_name?.includes('MEDLEY') ||
        album.album_name?.includes('REMIX')) {
      portadaDefault = '/img/medleys-default.jpg';
    }

    config[discoId] = {
      id: discoId,
      nombre: album.album_name || `Álbum ${albumIndex + 1}`,
      artista: artistData.artista,
      portada: album.cover_image || portadaDefault,
      año: album.year || '2025',
      genero: album.genre || 'Varios',
      categoria: artistData.categoria || (album.album_name?.includes('MEDLEY') ? 'medleys' : 'original'),
      canciones: album.songs.map((song, songIndex) => {
        // DETECTAR SI ES MEDLEY (tiene array de chords_url) - CLAVE PARA LA SOLUCIÓN
        const esMedley = Array.isArray(song.chords_url);

        return {
          id: song.id || `song-${albumIndex}-${songIndex}`,
          nombre: song.title,
          artista: song.artist,
          duracion: song.duration || '3:30',
          url: song.mp3_url || song.url || '/audio/default-song.mp3',
          chords_url: esMedley ? song.chords_url : (song.chords_url || null),
          imagen: album.cover_image || portadaDefault,
          disco: discoId,
          detalles: song.details || {},
          esMedley: esMedley, // ← ESTA PROPIEDAD ES CLAVE
          cancionesIncluidas: esMedley ? song.chords_url.length : 1,
          track_number: song.track_number || songIndex + 1
        };
      })
    };
  });

  return config;
};

// ============================================
// FUNCIÓN: transformCoversFormat
// DESCRIPCIÓN: Transforma datos del formato COVERS a configuración interna
// PARÁMETROS: coverData - Datos de covers con álbumes
// RETORNO: Objeto de configuración de discos de covers
// NOTA: Los covers individuales NO son medleys (esMedley: false)
// ============================================
const transformCoversFormat = (coverData) => {
  const config = {};

  // Usar "albums" en lugar de "discografia"
  coverData.albums.forEach((album, albumIndex) => {
    const artistaSlug = coverData.artist.toLowerCase().replace(/\s+/g, '-');
    const discoId = `${artistaSlug}-${album.album_id || albumIndex}`;

    // PORTADA UNIFICADA PARA COVERS
    const portadaDefault = '/img/09-discos/tapa-listado-covers.jpg';

    config[discoId] = {
      id: discoId,
      nombre: album.album_name || `Covers ${coverData.name}`,
      artista: coverData.artist,
      portada: album.cover_image || portadaDefault,
      año: album.year || '2025',
      genero: album.genre || 'Covers',
      categoria: 'covers',
      canciones: album.songs.map((song, songIndex) => {
        // CONSTRUIR chords_url A PARTIR DEL file Y basePath
        let chordsUrl = null;

        if (song.file) {
          // Ejemplo: file: "alejandro-lerner-juntos-para-siempre.json"
          // basePath: "/data/02-chords-covers/cancionescovers-baladasespanol/"
          chordsUrl = `${coverData.basePath || '/chords/02-cancioneroscovers/'}${song.file}`;
        } else if (song.chords_url) {
          chordsUrl = song.chords_url;
        }

        // CONSTRUIR mp3_url
        let mp3Url = song.mp3_file || song.url || '/audio/default-cover-song.mp3';

        return {
          id: song.id || `song-${albumIndex}-${songIndex}`,
          nombre: song.title,
          artista: song.artist,
          duracion: song.duration || '3:30',
          url: mp3Url,
          chords_url: chordsUrl, // STRING individual (no array para covers individuales)
          imagen: album.cover_image || portadaDefault,
          disco: discoId,
          detalles: {
            ...song,
            categoria: coverData.name,
            genero: album.genre,
            style: song.style,
            // Agregar información adicional
            letra: song.details?.letra || '',
            acordes: song.details?.acordes || [],
            bpm: song.bpm || 0,
            key: song.key || '',
            tonalidad: song.details?.tonalidad || '',
            dificultad: song.details?.dificultad || 'Intermedia'
          },
          esMedley: false, // Los covers individuales NO son medleys
          cancionesIncluidas: 1,
          track_number: song.track_number || songIndex + 1
        };
      })
    };
  });

  console.log(`📊 Covers transformados: ${Object.keys(config).length} discos`);
  return config;
};

// ============================================
// FUNCIÓN PRINCIPAL: loadAllMusicData (3 CATEGORÍAS)
// DESCRIPCIÓN: Carga todos los datos musicales de las 3 categorías
// CATEGORÍAS: original, covers, medleys
// RETORNO: Objeto con configuración completa de toda la música
// ESTADÍSTICAS: Muestra estadísticas detalladas en consola
// ============================================
export const loadAllMusicData = async () => {
  try {
    console.log('🔄 Iniciando carga de datos musicales (3 categorías)...');

    // ================================
    // CATEGORÍA 1: ORIGINAL
    // ================================
    console.log('📥 Cargando MÚSICA ORIGINAL...');

    const aleGondraData = await loadMusicData('/listado-musica-alegondra.json');
    const almangoData = await loadMusicData('/listado-musica-almango.json');

    console.log(`✅ Ale Gondra: ${Object.keys(aleGondraData).length} discos`);
    console.log(`✅ Almango Pop: ${Object.keys(almangoData).length} discos`);

    // ================================
    // CATEGORÍA 2: COVERS (12 archivos)
    // ================================
    console.log('📥 Cargando COVERS (12 categorías)...');

    const coversFiles = [
      '/listadocancionescovers-baladasespanol.json',
      '/listadocancionescovers-baladasingles.json',
      '/listadocancionescovers-discoingles.json',
      '/listadocancionescovers-festivos-bso.json',
      '/listadocancionescovers-hardrock-punkespanol.json',
      '/listadocancionescovers-hardrock-punkingles.json',
      '/listadocancionescovers-latinobailableespanol.json',
      '/listadocancionescovers-poprockespanol.json',
      '/listadocancionescovers-poprockingles.json',
      '/listadocancionescovers-reggaeingles.json',
      '/listadocancionescovers-rockbailableespanol.json',
      '/listadocancionescovers-rockbailableingles.json'
    ];

    let coversData = {};
    const cargasExitosas = [];

    for (const file of coversFiles) {
      try {
        const data = await loadMusicData(file);

        // Verificar que se cargaron datos
        const numDiscos = Object.keys(data).length;
        let numCanciones = 0;
        Object.values(data).forEach(disco => {
          numCanciones += (disco.canciones?.length || 0);
        });

        Object.assign(coversData, data);
        cargasExitosas.push({
          file,
          discos: numDiscos,
          canciones: numCanciones
        });

        console.log(`✅ ${file.split('/').pop()}: ${numDiscos} discos, ${numCanciones} canciones`);

        // DEBUG: Mostrar primera canción cargada
        const primerDisco = Object.values(data)[0];
        if (primerDisco?.canciones?.[0]) {
          const primeraCancion = primerDisco.canciones[0];
          console.log(`   🎵 Ejemplo: ${primeraCancion.nombre} - chords_url: ${primeraCancion.chords_url}`);
        }

      } catch (error) {
        console.log(`❌ No se pudo cargar ${file}: ${error.message}`);
      }
    }

    console.log(`📊 Covers: ${cargasExitosas.length}/${coversFiles.length} categorías cargadas`);

    // ================================
    // CATEGORÍA 3: MEDLEYS
    // ================================
    console.log('📥 Cargando MEDLEYS...');

    let medleysData = {};
    try {
      medleysData = await loadMusicData('/listado-musica-covers-medleys.json');

      // CONTAR MEDLEYS Y CANCIONES INCLUIDAS
      let totalMedleys = 0;
      let totalCancionesEnMedleys = 0;

      Object.values(medleysData).forEach(disco => {
        totalMedleys += disco.canciones?.length || 0;
        disco.canciones?.forEach(cancion => {
          if (cancion.esMedley) {
            totalCancionesEnMedleys += cancion.cancionesIncluidas || 1;
          } else {
            totalCancionesEnMedleys += 1;
          }
        });
      });

      console.log(`✅ Medleys: ${Object.keys(medleysData).length} discos, ${totalMedleys} medleys, ${totalCancionesEnMedleys} canciones incluidas`);

    } catch (error) {
      console.log('ℹ️ No se encontró archivo de medleys, continuando...');
      medleysData = {};
    }

    // ================================
    // ESTRUCTURA FINAL CON 3 CATEGORÍAS
    // ================================
    const ALL_MUSIC_CONFIG = {
      original: {
        ...aleGondraData,
        ...almangoData
      },

      covers: coversData,

      medleys: medleysData
    };

    // ================================
    // ESTADÍSTICAS FINALES DETALLADAS
    // ================================
    console.log('='.repeat(60));
    console.log('🎵 CATÁLOGO COMPLETO - ESTADÍSTICAS DETALLADAS');
    console.log('='.repeat(60));

    // Estadísticas ORIGINAL
    const originalDiscos = Object.keys(ALL_MUSIC_CONFIG.original).length;
    const originalCanciones = Object.values(ALL_MUSIC_CONFIG.original)
      .reduce((acc, disco) => acc + (disco.canciones?.length || 0), 0);

    // Estadísticas COVERS
    const coversDiscos = Object.keys(ALL_MUSIC_CONFIG.covers).length;
    const coversCanciones = Object.values(ALL_MUSIC_CONFIG.covers)
      .reduce((acc, disco) => acc + (disco.canciones?.length || 0), 0);

    // Estadísticas MEDLEYS
    const medleysDiscos = Object.keys(ALL_MUSIC_CONFIG.medleys).length;
    const medleysCanciones = Object.values(ALL_MUSIC_CONFIG.medleys)
      .reduce((acc, disco) => acc + (disco.canciones?.length || 0), 0);

    // Contar canciones incluidas en medleys
    let cancionesEnMedleys = 0;
    Object.values(ALL_MUSIC_CONFIG.medleys).forEach(disco => {
      disco.canciones?.forEach(cancion => {
        cancionesEnMedleys += cancion.cancionesIncluidas || 1;
      });
    });

    console.log(`🎤 ORIGINAL:`);
    console.log(`   • Discos: ${originalDiscos}`);
    console.log(`   • Canciones: ${originalCanciones}`);
    console.log('');

    console.log(`🎸 COVERS:`);
    console.log(`   • Discos/Géneros: ${coversDiscos}`);
    console.log(`   • Canciones: ${coversCanciones}`);
    // Mostrar detalles por categoría
    cargasExitosas.forEach(carga => {
      const nombre = carga.file.split('/').pop().replace('.json', '').replace('listadocancionescovers-', '');
      console.log(`     - ${nombre}: ${carga.discos} discos, ${carga.canciones} canciones`);
    });
    console.log('');

    console.log(`🎶 MEDLEYS:`);
    console.log(`   • Discos: ${medleysDiscos}`);
    console.log(`   • Medleys: ${medleysCanciones}`);
    console.log(`   • Canciones incluidas: ${cancionesEnMedleys}`);
    console.log('');

    console.log(`🎵 TOTALES:`);
    console.log(`   • Discos totales: ${originalDiscos + coversDiscos + medleysDiscos}`);
    console.log(`   • Canciones/Medleys: ${originalCanciones + coversCanciones + medleysCanciones}`);
    console.log(`   • Canciones únicas: ${originalCanciones + coversCanciones + cancionesEnMedleys}`);
    console.log('='.repeat(60));

    // ================================
    // DEBUG: Verificar estructura
    // ================================
    console.log('🔍 DEBUG - Verificando covers cargados:');
    if (coversDiscos > 0) {
      const primerCover = Object.values(ALL_MUSIC_CONFIG.covers)[0];
      console.log(`  Primer cover: ${primerCover.nombre}`);
      console.log(`  Artista: ${primerCover.artista}`);
      console.log(`  Canciones: ${primerCover.canciones?.length || 0}`);

      if (primerCover.canciones?.[0]) {
        const primeraCancion = primerCover.canciones[0];
        console.log(`  Primera canción: ${primeraCancion.nombre}`);
        console.log(`  chords_url: ${primeraCancion.chords_url}`);
        console.log(`  URL: ${primeraCancion.url}`);
      }
    }

    // ================================
    // RETORNAR CONFIGURACIÓN
    // ================================
    return ALL_MUSIC_CONFIG;

  } catch (error) {
    console.error('❌ Error crítico en loadAllMusicData:', error);

    // Configuración de fallback MÍNIMA
    return {
      original: {
        'fallback-original': {
          id: 'fallback-original',
          nombre: 'MÚSICA ORIGINAL',
          artista: 'Almango Pop',
          portada: '/img/default-cover.png',
          canciones: []
        }
      },
      covers: {
        'fallback-covers': {
          id: 'fallback-covers',
          nombre: 'COVERS',
          artista: 'Almango Pop',
          portada: '/img/09-discos/tapa-listado-covers.jpg',
          canciones: []
        }
      },
      medleys: {
        'fallback-medleys': {
          id: 'fallback-medleys',
          nombre: 'MEDLEYS',
          artista: 'Almango Pop',
          portada: '/img/medleys-default.jpg',
          canciones: []
        }
      }
    };
  }
};

// ============================================
// FUNCIÓN: loadChordsData - VERSIÓN CORREGIDA
// DESCRIPCIÓN: Carga datos de acordes, maneja arrays (medleys) y strings (individuales)
// PARÁMETROS: chordsUrl - String (canción) o Array (medley)
// RETORNO: Datos procesados con contenido combinado para medleys
// ============================================
export const loadChordsData = async (chordsUrl) => {
  try {
    console.log(`🎵 Cargando chords:`, chordsUrl);

    // CASO 1: SI ES ARRAY (MEDLEY) - CARGAR TODAS LAS CANCIONES
    if (Array.isArray(chordsUrl)) {
      console.log(`🎶 Cargando MEDLEY con ${chordsUrl.length} canciones...`);

      // Cargar todos los archivos JSON del medley
      const chordsPromises = chordsUrl.map(url =>
        fetch(url).then(response => {
          if (!response.ok) throw new Error(`Error cargando ${url}`);
          return response.json();
        }).catch(err => {
          console.error(`❌ Error cargando ${url}:`, err);
          // Retornar datos de fallback
          return {
            id: `fallback-${Date.now()}`,
            title: url.split('/').pop().replace('.json', ''),
            artist: 'Canción no disponible',
            originalKey: "C",
            content: [
              {
                type: 'section',
                name: 'ERROR',
                lines: [
                  { type: 'lyric', content: `No se pudo cargar: ${url}` }
                ]
              }
            ]
          };
        })
      );

      // Esperar a que se carguen todas las canciones
      const allChordsData = await Promise.all(chordsPromises);

      // 3. CREAR ESTRUCTURA COMBINADA DEL MEDLEY
      const combinedChordsData = {
        id: `medley-${Date.now()}`,
        title: `Medley de ${allChordsData.length} canciones`,
        artist: 'Almango Pop',
        originalKey: "C",
        esMedley: true, // ← MARCADOR CLAVE: Indica que es un medley
        cancionesIncluidas: allChordsData.length,
        medleyButtons: [], // ← Puedes definir tus botones aquí si es necesario
        content: []
      };

      // 4. AGREGAR SECCIÓN DE CONTROLES DEL MEDLEY (APARECE PRIMERO)
      combinedChordsData.content.push({
        type: 'section',
        name: 'CONTROLES DEL MEDLEY',
        lines: [
          {
            type: 'lyric',
            content: `Este medley incluye ${allChordsData.length} canciones.`
          }
        ]
      });

      combinedChordsData.content.push({
        type: 'divider',
        name: 'INICIO DEL MEDLEY'
      });

      // 5. AGREGAR CADA CANCIÓN COMO SECCIÓN SEPARADA
      allChordsData.forEach((chordsData, index) => {
        // Agregar título de la canción incluida
        combinedChordsData.content.push({
          type: 'section',
          name: `🎵 PARTE ${index + 1}: ${chordsData.title || `Canción ${index + 1}`}`,
          lines: [
            { type: 'lyric', content: `Artista original: ${chordsData.artist || 'Desconocido'}` }
          ]
        });

        // Agregar el contenido de la canción
        if (chordsData.content && Array.isArray(chordsData.content)) {
          combinedChordsData.content.push(...chordsData.content);
        }

        // Agregar divisor entre canciones (excepto la última)
        if (index < allChordsData.length - 1) {
          combinedChordsData.content.push({
            type: 'divider',
            name: `TRANSICIÓN → Canción ${index + 2}`
          });
        }
      });

      // 6. AGREGAR SECCIÓN FINAL DEL MEDLEY
      combinedChordsData.content.push({
        type: 'divider',
        name: 'FIN DEL MEDLEY'
      });

      combinedChordsData.content.push({
        type: 'section',
        name: 'RESUMEN DEL MEDLEY',
        lines: [
          { type: 'lyric', content: `Medley completado: ${allChordsData.length} canciones combinadas.` }
        ]
      });

      console.log(`✅ Medley cargado exitosamente:`);
      console.log(`   • Canciones: ${combinedChordsData.cancionesIncluidas}`);
      console.log(`   • Secciones: ${combinedChordsData.content.length}`);

      return combinedChordsData;

    }
    // CASO 2: SI ES STRING (CANCIÓN INDIVIDUAL)
    else if (typeof chordsUrl === 'string') {
      console.log(`📄 Cargando canción individual: ${chordsUrl}`);
      const response = await fetch(chordsUrl);

      if (!response.ok) {
        throw new Error(`Error cargando chords: ${chordsUrl}`);
      }

      const chordsData = await response.json();
      console.log(`✅ Canción individual cargada: ${chordsData.title}`);
      return chordsData;
    }
    // CASO 3: SI NO HAY chords_url
    else {
      console.log('ℹ️ No hay chords_url disponible');
      throw new Error('No hay chords_url disponible');
    }
  } catch (error) {
    console.error('❌ Error en loadChordsData:', error);

    // Retornar datos de ejemplo como fallback
    return {
      id: `fallback-${Date.now()}`,
      title: 'Canción de ejemplo',
      artist: 'Artista',
      originalKey: 'C',
      esMedley: false,
      cancionesIncluidas: 1,
      content: [
        {
          type: 'section',
          name: 'INTRO',
          lines: [
            { type: 'chord', content: 'C' },
            { type: 'chord', content: 'G' }
          ]
        }
      ]
    };
  }
};

// ============================================
// FUNCIÓN: loadCoversByCategory
// DESCRIPCIÓN: Carga covers por categoría específica
// PARÁMETROS: category - Categoría de covers a cargar
// RETORNO: Datos de covers de la categoría especificada
// ============================================
export const loadCoversByCategory = async (category) => {
  try {
    const fileMap = {
      'baladasespanol': '/listadocancionescovers-baladasespanol.json',
      'baladasingles': '/listadocancionescovers-baladasingles.json',
      'discoingles': '/listadocancionescovers-discoingles.json',
      'festivos-bso': '/listadocancionescovers-festivos-bso.json',
      'hardrock-punkespanol': '/listadocancionescovers-hardrock-punkespanol.json',
      'hardrock-punkingles': '/listadocancionescovers-hardrock-punkingles.json',
      'latinobailableespanol': '/listadocancionescovers-latinobailableespanol.json',
      'poprockespanol': '/listadocancionescovers-poprockespanol.json',
      'poprockingles': '/listadocancionescovers-poprockingles.json',
      'reggaeingles': '/listadocancionescovers-reggaeingles.json',
      'rockbailableespanol': '/listadocancionescovers-rockbailableespanol.json',
      'rockbailableingles': '/listadocancionescovers-rockbailableingles.json',
      'todos': null
    };

    if (category === 'todos') {
      const allFiles = Object.values(fileMap).filter(Boolean);
      let combinedData = {};

      for (const file of allFiles) {
        try {
          const data = await loadMusicData(file);
          Object.assign(combinedData, data);
        } catch (error) {
          console.log(`⚠️ Omitiendo ${file}: ${error.message}`);
        }
      }

      return combinedData;
    }

    const filePath = fileMap[category];
    if (!filePath) {
      throw new Error(`Categoría no encontrada: ${category}`);
    }

    return await loadMusicData(filePath);
  } catch (error) {
    console.error(`Error cargando categoría ${category}:`, error);
    throw error;
  }
};

// ============================================
// FUNCIÓN: getAvailableCategories
// DESCRIPCIÓN: Retorna todas las categorías disponibles
// RETORNO: Array de categorías con nombre, icono y descripción
// ============================================
export const getAvailableCategories = () => {
  return [
    { id: 'original', name: 'Música Original', icon: '🎤', desc: 'Música original de Ale Gondra y Almango Pop' },
    { id: 'covers', name: 'Todos los Covers', icon: '🎸', desc: 'Versiones de canciones clásicas y modernas' },
    { id: 'medleys', name: 'Medleys', icon: '🎶', desc: 'Mezclas especiales y canciones enganchadas' },
    { id: 'baladasespanol', name: 'Baladas Español', icon: '💔', desc: 'Baladas románticas en español' },
    { id: 'baladasingles', name: 'Baladas Inglés', icon: '💔', desc: 'Baladas románticas en inglés' },
    { id: 'poprockespanol', name: 'Pop/Rock Español', icon: '🎸', desc: 'Pop y rock en español' },
    { id: 'poprockingles', name: 'Pop/Rock Inglés', icon: '🎸', desc: 'Pop y rock en inglés' },
    { id: 'rockbailableespanol', name: 'Rock Bailable Español', icon: '🕺', desc: 'Rock para bailar en español' },
    { id: 'rockbailableingles', name: 'Rock Bailable Inglés', icon: '🕺', desc: 'Rock para bailar en inglés' },
    { id: 'hardrock-punkespanol', name: 'Hard Rock/Punk Español', icon: '🤘', desc: 'Hard rock y punk en español' },
    { id: 'hardrock-punkingles', name: 'Hard Rock/Punk Inglés', icon: '🤘', desc: 'Hard rock y punk en inglés' },
    { id: 'discoingles', name: 'Disco Inglés', icon: '💃', desc: 'Música disco en inglés' },
    { id: 'latinobailableespanol', name: 'Latino Bailable Español', icon: '🌴', desc: 'Música latina bailable' },
    { id: 'reggaeingles', name: 'Reggae Inglés', icon: '☮️', desc: 'Reggae y música jamaiquina' },
    { id: 'festivos-bso', name: 'Festivos & BSO', icon: '🎄', desc: 'Música festiva y bandas sonoras' }
  ];
};

// ============================================
// FUNCIÓN: searchSongs
// DESCRIPCIÓN: Busca canciones en todas las categorías
// PARÁMETROS: query - Término de búsqueda, category - Categoría específica (opcional)
// RETORNO: Array de canciones que coinciden con la búsqueda
// ============================================
export const searchSongs = async (query, category = 'all') => {
  try {
    console.log(`🔍 Buscando: "${query}" en categoría: ${category}`);

    // Cargar todos los datos
    const allData = await loadAllMusicData();

    const results = [];
    const queryLower = query.toLowerCase();

    // Buscar en original si corresponde
    if (category === 'all' || category === 'original') {
      Object.values(allData.original).forEach(disco => {
        disco.canciones?.forEach(cancion => {
          if (
            cancion.nombre.toLowerCase().includes(queryLower) ||
            cancion.artista.toLowerCase().includes(queryLower) ||
            (cancion.detalles?.genero?.toLowerCase() || '').includes(queryLower)
          ) {
            results.push({
              ...cancion,
              tipo: 'original',
              discoNombre: disco.nombre,
              categoria: 'original'
            });
          }
        });
      });
    }

    // Buscar en covers si corresponde
    if (category === 'all' || category === 'covers' || (category !== 'original' && category !== 'medleys')) {
      Object.values(allData.covers).forEach(disco => {
        disco.canciones?.forEach(cancion => {
          if (
            cancion.nombre.toLowerCase().includes(queryLower) ||
            cancion.artista.toLowerCase().includes(queryLower) ||
            (cancion.detalles?.categoria?.toLowerCase() || '').includes(queryLower) ||
            (cancion.detalles?.genero?.toLowerCase() || '').includes(queryLower)
          ) {
            results.push({
              ...cancion,
              tipo: 'covers',
              discoNombre: disco.nombre,
              categoria: disco.genero || 'covers'
            });
          }
        });
      });
    }

    // Buscar en medleys si corresponde
    if (category === 'all' || category === 'medleys') {
      Object.values(allData.medleys).forEach(disco => {
        disco.canciones?.forEach(cancion => {
          if (
            cancion.nombre.toLowerCase().includes(queryLower) ||
            cancion.artista.toLowerCase().includes(queryLower) ||
            (cancion.esMedley && 'medley'.includes(queryLower))
          ) {
            results.push({
              ...cancion,
              tipo: 'medleys',
              discoNombre: disco.nombre,
              categoria: 'medleys',
              esMedley: cancion.esMedley,
              cancionesIncluidas: cancion.cancionesIncluidas
            });
          }
        });
      });
    }

    console.log(`✅ Búsqueda completada: ${results.length} resultados`);

    return results;
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    return [];
  }
};
