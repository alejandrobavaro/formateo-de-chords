// ============================================
// ARCHIVO: musicDataService.jsx - VERSIÓN COMPLETA CON RUTAS ACTUALIZADAS
// DESCRIPCIÓN: Servicio para cargar datos musicales de 5 categorías con nuevas rutas
// RUTAS ACTUALIZADAS: Todas las rutas apuntan a public/listados/
// ZAPADAS ACTUALIZADAS: Ahora carga 17 archivos separados por género
// ============================================

// ============================================
// FUNCIÓN: loadMusicData
// DESCRIPCIÓN: Carga datos de un archivo JSON y detecta su formato
// PARÁMETROS: jsonPath - Ruta al archivo JSON
// RETORNO: Configuración procesada para discos/canciones
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
      // FORMATO 1: ORIGINALES, MEDLEYS, HOMENAJES Y ZAPADAS
      console.log(`🔧 Formato detectado: ${jsonPath}`);
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
// FUNCIÓN: transformToConfigDiscos - VERSIÓN CORREGIDA
// DESCRIPCIÓN: Transforma datos del formato original a configuración interna
// CORRECCIONES: 
// - Artista correcto para canciones de homenajes
// - Portada única para homenajes y zapadas
// ============================================
const transformToConfigDiscos = (artistData) => {
  const config = {};

  // VERIFICAR SI ES UN HOMENAJE
  const esHomenaje = artistData.categoria === 'homenajes' || 
                    (artistData.discografia && artistData.discografia[0]?.genre?.includes('Homenajes'));

  artistData.discografia.forEach((album, albumIndex) => {
    // USAR ARTISTA CORRECTO
    let artistaNombre = artistData.artista || 'Almango Pop';
    
    // PARA HOMENAJES, USAR EL NOMBRE DEL ARTISTA HOMENAJEADO
    if (esHomenaje) {
      const nombreArchivo = artistData._sourceFile || '';
      if (nombreArchivo.includes('homenaje-')) {
        // Extraer nombre del artista del nombre del archivo
        const artistaHomenajeado = nombreArchivo
          .replace('listado-musica-homenaje-', '')
          .replace('.json', '')
          .replace(/-/g, ' ')
          .toUpperCase();
        
        // Solo usar si no es "Almango Pop"
        if (artistaHomenajeado && !artistaNombre.toLowerCase().includes('almango')) {
          artistaNombre = artistaHomenajeado;
        }
      }
    }

    const artistaSlug = artistaNombre.toLowerCase().replace(/\s+/g, '-');
    const discoId = `${artistaSlug}-${album.album_id || albumIndex}`;

    // DETERMINAR PORTADA
    let portadaDefault = '/img/default-cover.png';

    if (esHomenaje || album.genre?.includes('Homenajes')) {
      portadaDefault = '/img/02-logos/logo-formateo-chords2.png';
    }

    if (album.genre?.includes('Zapadas')) {
      portadaDefault = '/img/300.jpg';
    }

    // CORREGIR NOMBRE DEL DISCO PARA HOMENAJES
    let nombreDisco = album.album_name || `Álbum ${albumIndex + 1}`;
    
    if (esHomenaje) {
      // Si ya es un nombre de homenaje, dejarlo como está
      if (!nombreDisco.includes('HOMENAJE')) {
        nombreDisco = `HOMENAJE A ${artistaNombre}`;
      }
    }

    config[discoId] = {
      id: discoId,
      nombre: nombreDisco,
      artista: artistaNombre,
      portada: album.cover_image || portadaDefault,
      año: album.year || '2024',
      genero: album.genre || (esHomenaje ? 'Homenajes' : 'Varios'),
      categoria: esHomenaje ? 'homenajes' : (artistData.categoria || 'original'),
      canciones: album.songs.map((song, songIndex) => {
        // USAR ARTISTA DE LA CANCIÓN (CRÍTICO PARA HOMENAJES)
        const artistaCancion = song.artist || artistaNombre;
        
        // VERIFICAR Y CORREGIR RUTAS
        let mp3Url = song.mp3_url || song.url || '';
        let chordsUrl = song.chords_url || null;
        
        // Para homenajes, verificar que las rutas sean válidas
        if (esHomenaje) {
          // Asegurar que las rutas comiencen con /
          if (mp3Url && !mp3Url.startsWith('/')) {
            mp3Url = '/' + mp3Url;
          }
          if (chordsUrl && !chordsUrl.startsWith('/')) {
            chordsUrl = '/' + chordsUrl;
          }
        }

        // Si no hay URL de MP3, intentar construir una
        if (!mp3Url && song.id && esHomenaje) {
          const idParts = song.id.split('-');
          if (idParts.length >= 3) {
            const artistaId = idParts[1]; // ej: "acdc"
            const cancionNombre = song.id.replace(/homenaje-\w+-/, '').replace(/\d+-/g, '');
            mp3Url = `/audio/04-mp3-homenajes/mp3-homenajes-${artistaId}/${artistaId}-${cancionNombre}.mp3`;
          }
        }

        return {
          id: song.id || `song-${albumIndex}-${songIndex}`,
          nombre: song.title,
          artista: artistaCancion,
          duracion: song.duration || '3:30',
          url: mp3Url || '/audio/default-song.mp3',
          chords_url: chordsUrl,
          imagen: album.cover_image || portadaDefault,
          disco: discoId,
          detalles: song.details || {},
          esMedley: false,
          cancionesIncluidas: 1,
          track_number: song.track_number || songIndex + 1,
          esHomenaje: esHomenaje,
          esZapada: album.genre?.includes('Zapadas') || false
        };
      })
    };
  });

  return config;
};

// ============================================
// FUNCIÓN: transformCoversFormat
// DESCRIPCIÓN: Transforma datos del formato COVERS a configuración interna
// ============================================
const transformCoversFormat = (coverData) => {
  const config = {};

  // Usar "discografia" en lugar de "discografia"
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
          chords_url: chordsUrl,
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
          esMedley: false,
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
// FUNCIÓN: transformZapadasData - VERSIÓN ESPECÍFICA
// DESCRIPCIÓN: Transforma datos de zapadas SIN afectar otras categorías
// ============================================
const transformZapadasData = (zapadasData) => {
  const config = {};

  // DETECTAR SI ES ZAPADA POR EL NOMBRE DEL ARCHIVO
  const esZapada = zapadasData.categoria === 'zapadas' || 
                  (zapadasData.discografia && zapadasData.discografia[0]?.genre?.includes('Zapadas'));

  zapadasData.discografia.forEach((album, albumIndex) => {
    // PARA ZAPADAS, SIEMPRE USAR "Almango Pop" como artista
    const artistaNombre = 'Almango Pop';
    const artistaSlug = artistaNombre.toLowerCase().replace(/\s+/g, '-');
    const discoId = `${artistaSlug}-${album.album_id || albumIndex}`;

    // PORTADA ESPECÍFICA PARA ZAPADAS
    const portadaDefault = '/img/300.jpg';

    // NOMBRE DEL DISCO PARA ZAPADAS
    let nombreDisco = album.album_name || 'ZAPADAS DE TODOS LOS ESTILOS';
    if (!nombreDisco.includes('ZAPADAS')) {
      nombreDisco = 'ZAPADAS DE TODOS LOS ESTILOS';
    }

    config[discoId] = {
      id: discoId,
      nombre: nombreDisco,
      artista: artistaNombre,
      portada: album.cover_image || portadaDefault,
      año: album.year || '2024',
      genero: album.genre || 'Zapadas',
      categoria: 'zapadas',
      canciones: album.songs.map((song, songIndex) => {
        // ARTISTA SIEMPRE "Almango Pop" PARA ZAPADAS
        const artistaCancion = 'Almango Pop';
        
        // CONSTRUIR URL DE MP3 BASADA EN EL ID
        let mp3Url = song.mp3_url || song.url || '';
        let chordsUrl = song.chords_url || null;
        
        // CORRECCIÓN CRÍTICA: Construir URL automática para zapadas
        if (!mp3Url || mp3Url === '/audio/default-song.mp3') {
          // Ejemplo: ID "zapada-rock-001" → estilo: "rock", número: "001"
          const match = song.id.match(/zapada-(\w+)-(\d+)/i);
          if (match) {
            const estilo = match[1].toLowerCase(); // "rock", "blues", etc.
            const numero = match[2]; // "001", "02", etc.
            mp3Url = `/audio/05-mp3-zapadas/mp3-zapadas-${estilo}/mp3-zapadas-${estilo}-${numero}.mp3`;
          }
        }
        
        // CORRECCIÓN CRÍTICA: Construir URL de chords automática
        if (!chordsUrl) {
          const match = song.id.match(/zapada-(\w+)-(\d+)/i);
          if (match) {
            const estilo = match[1].toLowerCase();
            const numero = match[2];
            chordsUrl = `/chords/05-cancioneroszapadas/cancioneroszapadas-${estilo}/cancioneroszapadas-${estilo}-${numero}.json`;
          }
        }

        return {
          id: song.id || `zapada-${albumIndex}-${songIndex}`,
          nombre: song.title,
          artista: artistaCancion,
          duracion: song.duration || '3:30',
          url: mp3Url || '/audio/default-song.mp3',
          chords_url: chordsUrl,
          imagen: album.cover_image || portadaDefault,
          disco: discoId,
          detalles: song.details || {},
          esMedley: false,
          cancionesIncluidas: 1,
          track_number: song.track_number || songIndex + 1,
          esHomenaje: false,
          esZapada: true
        };
      })
    };
  });

  console.log(`🎹 Zapadas transformadas: ${Object.keys(config).length} discos`);
  return config;
};

// ============================================
// FUNCIÓN: loadHomenajesData - VERSIÓN MEJORADA
// DESCRIPCIÓN: Carga todos los archivos JSON de homenajes individuales con mejor manejo de errores
// ============================================
const loadHomenajesData = async () => {
  try {
    console.log('📥 Cargando HOMENAJES (archivos individuales)...');
    
    // LISTA COMPLETA DE ARCHIVOS DE HOMENAJES CON NUEVAS RUTAS
    const homenajesFiles = [
      '/listados/listados-musica-homenajes/listado-musica-homenaje-acdc.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-adams-sting-stewart.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-aerosmith.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-alejandro-lerner.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-andres-calamaro.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-beatles.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-bon-jovi.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-cadillacs-pericos-kapanga.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-ccr.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-cerati-soda.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-coldplay.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-diego-torres.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-divididos.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-elton-john-georgemichael.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-enanitosverdes.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-garcia-paez-spinetta.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-green-day-offspring.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-gunsnroses.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-inxs.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-labersuit.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-laley-Mana.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-larenga-pappo-redondos-ratones.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-lenny-kravitz.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-los-pijos.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-michaeljackson.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-nirvana-foo-fighters-system.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-oasis.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-philcollins.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-queen.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-redhotchili.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-robbiewilliams.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-rolling-stones.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-roxette.json',
      '/listados/listados-musica-homenajes/listado-musica-homenaje-u2.json'
    ];

    let homenajesConfig = {};
    let cargasExitosas = 0;
    let cargasFallidas = 0;
    let archivosConProblemas = [];

    // CARGAR CADA ARCHIVO INDIVIDUALMENTE
    for (const file of homenajesFiles) {
      try {
        console.log(`📄 Intentando cargar: ${file}`);
        const response = await fetch(file);
        
        if (!response.ok) {
          console.log(`⚠️ Archivo no encontrado (${response.status}): ${file}`);
          cargasFallidas++;
          archivosConProblemas.push({file, error: `HTTP ${response.status}`});
          continue;
        }

        // VERIFICAR SI ES JSON VÁLIDO
        const responseText = await response.text();
        
        // Verificar si la respuesta es HTML (error 404)
        if (responseText.trim().startsWith('<!DOCTYPE') || 
            responseText.trim().startsWith('<html') ||
            responseText.includes('Page Not Found')) {
          console.log(`❌ El archivo devuelve HTML (probablemente 404): ${file}`);
          cargasFallidas++;
          archivosConProblemas.push({file, error: 'Devuelve HTML (404)'});
          continue;
        }

        // Intentar parsear como JSON
        let homenajeData;
        try {
          homenajeData = JSON.parse(responseText);
        } catch (parseError) {
          console.error(`❌ Error parseando JSON de ${file}:`, parseError.message);
          console.log('📄 Contenido recibido (primeros 500 chars):', responseText.substring(0, 500));
          cargasFallidas++;
          archivosConProblemas.push({file, error: `JSON inválido: ${parseError.message}`});
          continue;
        }
        
        // VERIFICAR ESTRUCTURA BÁSICA DEL JSON
        if (!homenajeData.artista || !homenajeData.discografia) {
          console.error(`❌ Estructura inválida en ${file}: falta "artista" o "discografia"`);
          cargasFallidas++;
          archivosConProblemas.push({file, error: 'Estructura JSON inválida'});
          continue;
        }

        // AGREGAR INFORMACIÓN DEL ARCHIVO FUENTE PARA DEPURACIÓN
        homenajeData._sourceFile = file.split('/').pop();
        
        // FORZAR CATEGORÍA PARA HOMENAJES
        homenajeData.categoria = 'homenajes';
        
        // TRANSFORMAR LOS DATOS
        const config = transformToConfigDiscos(homenajeData);
        
        // AGREGAR AL RESULTADO (Object.assign mantiene todas las propiedades)
        Object.assign(homenajesConfig, config);
        
        cargasExitosas++;
        
        // LOG DEL HOMENAJE PROCESADO
        const artistaHomenajeado = homenajeData._sourceFile
          .replace('listado-musica-homenaje-', '')
          .replace('.json', '')
          .replace(/-/g, ' ')
          .toUpperCase();
        
        console.log(`✅ Homenaje cargado: ${artistaHomenajeado}`);

      } catch (error) {
        console.error(`❌ Error cargando ${file}:`, error.message);
        cargasFallidas++;
        archivosConProblemas.push({file, error: error.message});
      }
    }

    console.log(`📊 Resumen Homenajes: ${cargasExitosas} exitosas, ${cargasFallidas} fallidas`);
    
    // MOSTRAR ARCHIVOS CON PROBLEMAS
    if (archivosConProblemas.length > 0) {
      console.log('📋 Archivos con problemas:');
      archivosConProblemas.forEach((item, index) => {
        console.log(`${index + 1}. ${item.file} - ${item.error}`);
      });
    }
    
    console.log(`🎵 Total discos de homenajes: ${Object.keys(homenajesConfig).length}`);

    // SI NO SE CARGÓ NINGÚN HOMENAJE, CREAR HOMENAJES DE EJEMPLO
    if (Object.keys(homenajesConfig).length === 0) {
      console.log('🔄 Creando homenajes de ejemplo...');
      homenajesConfig = crearHomenajesEjemplo();
    }

    return homenajesConfig;

  } catch (error) {
    console.error('❌ Error crítico en loadHomenajesData:', error);
    return crearHomenajesEjemplo();
  }
};

// ============================================
// FUNCIÓN AUXILIAR: crearHomenajesEjemplo
// DESCRIPCIÓN: Crea datos de homenajes de ejemplo
// ============================================
const crearHomenajesEjemplo = () => {
  const homenajesEjemplo = {
    'homenaje-ejemplo-00': {
      id: 'homenaje-ejemplo-00',
      nombre: 'HOMENAJE DE EJEMPLO',
      artista: 'Varios Artistas',
      portada: '/img/02-logos/logo-formateo-chords2.png',
      año: '2024',
      genero: 'Homenajes',
      categoria: 'homenajes',
      canciones: [
        {
          id: 'ejemplo-01',
          nombre: 'Back in Black',
          artista: 'AC/DC',
          duracion: '4:15',
          url: '/audio/ac-dc-back-in-black.mp3',
          chords_url: '/chords/ac-dc-back-in-black.json',
          imagen: '/img/02-logos/logo-formateo-chords2.png',
          disco: 'homenaje-ejemplo-00',
          detalles: {
            style: 'Hard Rock',
            genre: 'Rock',
            categoria: 'Homenajes Ejemplo'
          },
          esMedley: false,
          cancionesIncluidas: 1,
          track_number: 1,
          esHomenaje: true,
          esZapada: false
        },
        {
          id: 'ejemplo-02',
          nombre: 'Bohemian Rhapsody',
          artista: 'Queen',
          duracion: '5:55',
          url: '/audio/04-mp3-homenajes/mp3-homenajes-queen/queen-bohemian-rhapsody.mp3',
          chords_url: '/chords/04-cancioneroshomenajes/cancioneroshomenajes-queen/queen-bohemian-rhapsody.json',
          imagen: '/img/02-logos/logo-formateo-chords2.png',
          disco: 'homenaje-ejemplo-00',
          detalles: {
            style: 'Rock',
            genre: 'Rock',
            categoria: 'Homenajes Ejemplo'
          },
          esMedley: false,
          cancionesIncluidas: 1,
          track_number: 2,
          esHomenaje: true,
          esZapada: false
        }
      ]
    }
  };
  
  console.log('✅ Homenajes de ejemplo creados');
  return homenajesEjemplo;
};

// ============================================
// FUNCIÓN: loadZapadasData - VERSIÓN ACTUALIZADA PARA MÚLTIPLES ARCHIVOS
// DESCRIPCIÓN: Carga datos de zapadas desde los 17 archivos separados por género
// ============================================
const loadZapadasData = async () => {
  try {
    console.log('📥 Cargando ZAPADAS por género (17 archivos)...');
    
    // LISTA DE TODOS LOS ARCHIVOS DE ZAPADAS POR GÉNERO
    const zapadasFiles = [
      '/listados/listados-musica-zapadas/listado-musica-zapadas-blues.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-country.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-electronica.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-experimentales.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-folklore.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-funk.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-jazz.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-latino.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-metal.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-pop.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-r&b.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-reggae.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-rock.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-ska.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-soul.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-tango.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-urban.json'
    ];

    let zapadasConfig = {};
    let cargasExitosas = 0;
    let cargasFallidas = 0;
    let archivosConProblemas = [];

    // CARGAR CADA ARCHIVO DE ZAPADAS POR GÉNERO
    for (const file of zapadasFiles) {
      try {
        console.log(`📄 Intentando cargar zapadas: ${file}`);
        const response = await fetch(file);
        
        if (!response.ok) {
          console.log(`⚠️ Archivo no encontrado (${response.status}): ${file}`);
          cargasFallidas++;
          archivosConProblemas.push({file, error: `HTTP ${response.status}`});
          continue;
        }

        const responseText = await response.text();
        
        // Verificar si es HTML (error 404)
        if (responseText.trim().startsWith('<!DOCTYPE') || 
            responseText.trim().startsWith('<html') ||
            responseText.includes('Page Not Found')) {
          console.log(`❌ El archivo devuelve HTML (probablemente 404): ${file}`);
          cargasFallidas++;
          archivosConProblemas.push({file, error: 'Devuelve HTML (404)'});
          continue;
        }

        // Intentar parsear como JSON
        let zapadaData;
        try {
          zapadaData = JSON.parse(responseText);
        } catch (parseError) {
          console.error(`❌ Error parseando JSON de ${file}:`, parseError.message);
          cargasFallidas++;
          archivosConProblemas.push({file, error: `JSON inválido: ${parseError.message}`});
          continue;
        }
        
        // VERIFICAR ESTRUCTURA
        if (!zapadaData.artista || !zapadaData.discografia) {
          console.error(`❌ Estructura inválida en ${file}: falta "artista" o "discografia"`);
          cargasFallidas++;
          archivosConProblemas.push({file, error: 'Estructura JSON inválida'});
          continue;
        }

        // AGREGAR INFORMACIÓN DEL ARCHIVO FUENTE
        zapadaData._sourceFile = file.split('/').pop();
        
        // FORZAR CATEGORÍA PARA ZAPADAS Y AGREGAR GÉNERO
        zapadaData.categoria = 'zapadas';
        
        // Extraer el género del nombre del archivo
        const matchGenero = file.match(/zapadas-([^\.]+)\.json/);
        if (matchGenero) {
          let genero = matchGenero[1].replace('&', 'and');
          // Formatear el nombre del género
          genero = genero.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          // Asignar el género a cada disco
          if (zapadaData.discografia && zapadaData.discografia.length > 0) {
            zapadaData.discografia.forEach(disco => {
              disco.genre = `Zapadas ${genero}`;
            });
          }
        }
        
        // TRANSFORMAR LOS DATOS USANDO LA FUNCIÓN EXISTENTE
        const config = transformZapadasData(zapadaData);
        
        // AGREGAR AL RESULTADO
        Object.assign(zapadasConfig, config);
        
        cargasExitosas++;
        
        console.log(`✅ Zapadas cargadas: ${file.split('/').pop()}`);

      } catch (error) {
        console.error(`❌ Error cargando ${file}:`, error.message);
        cargasFallidas++;
        archivosConProblemas.push({file, error: error.message});
      }
    }

    console.log(`📊 Resumen Zapadas: ${cargasExitosas} exitosas, ${cargasFallidas} fallidas`);
    
    // MOSTRAR ARCHIVOS CON PROBLEMAS
    if (archivosConProblemas.length > 0) {
      console.warn('📋 Archivos de zapadas con problemas:');
      archivosConProblemas.forEach((item, index) => {
        console.warn(`${index + 1}. ${item.file} - ${item.error}`);
      });
    }
    
    console.log(`🎹 Total discos de zapadas: ${Object.keys(zapadasConfig).length}`);

    // SI NO SE CARGÓ NINGUNA ZAPADA, CREAR ZAPADAS DE EJEMPLO
    if (Object.keys(zapadasConfig).length === 0) {
      console.log('🔄 Creando zapadas de ejemplo...');
      zapadasConfig = crearZapadasEjemplo();
    }

    return zapadasConfig;

  } catch (error) {
    console.error('❌ Error crítico en loadZapadasData:', error);
    return crearZapadasEjemplo();
  }
};

// ============================================
// FUNCIÓN AUXILIAR: crearZapadasEjemplo
// DESCRIPCIÓN: Crea datos de zapadas de ejemplo
// ============================================
const crearZapadasEjemplo = () => {
  const zapadasEjemplo = {
    'zapadas-ejemplo-00': {
      id: 'zapadas-ejemplo-00',
      nombre: 'ZAPADAS DE EJEMPLO',
      artista: 'Almango Pop',
      portada: '/img/300.jpg',
      año: '2024',
      genero: 'Zapadas',
      categoria: 'zapadas',
      canciones: [
        {
          id: 'zapada-rock-001',
          nombre: 'Zapada Rock Clásico',
          artista: 'Almango Pop',
          duracion: '4:30',
          url: '/audio/05-mp3-zapadas/mp3-zapadas-rock/mp3-zapadas-rock-01.mp3',
          chords_url: '/chords/05-cancioneroszapadas/cancioneroszapadas-rock/cancioneroszapadas-rock-01.json',
          imagen: '/img/300.jpg',
          disco: 'zapadas-ejemplo-00',
          detalles: {
            style: 'Rock Clásico',
            genre: 'Rock',
            categoria: 'Zapadas'
          },
          esMedley: false,
          cancionesIncluidas: 1,
          track_number: 1,
          esHomenaje: false,
          esZapada: true
        }
      ]
    }
  };
  
  console.log('✅ Zapadas de ejemplo creadas');
  return zapadasEjemplo;
};

// ============================================
// FUNCIÓN PRINCIPAL: loadAllMusicData (5 CATEGORÍAS)
// DESCRIPCIÓN: Carga todos los datos musicales de las 5 categorías con nuevas rutas
// ============================================
export const loadAllMusicData = async () => {
  try {
    console.log('='.repeat(60));
    console.log('🔄 INICIANDO CARGA DE DATOS MUSICALES (5 CATEGORÍAS)');
    console.log('📁 Zapadas divididas en 17 archivos por género');
    console.log('='.repeat(60));

    // ================================
    // CATEGORÍA 1: ORIGINAL
    // ================================
    console.log('\n📥 CATEGORÍA 1: Cargando MÚSICA ORIGINAL...');

    let aleGondraData = {};
    let almangoData = {};

    try {
      // NUEVA RUTA PARA ALE GONDRA
      aleGondraData = await loadMusicData('/listados/listados-musica-original/listado-musica-alegondra.json');
      console.log(`✅ Ale Gondra: ${Object.keys(aleGondraData).length} discos`);
    } catch (error) {
      console.log(`❌ Error cargando Ale Gondra: ${error.message}`);
    }

    try {
      // NUEVA RUTA PARA ALMANGO POP
      almangoData = await loadMusicData('/listados/listados-musica-original/listado-musica-almango.json');
      console.log(`✅ Almango Pop: ${Object.keys(almangoData).length} discos`);
    } catch (error) {
      console.log(`❌ Error cargando Almango Pop: ${error.message}`);
    }

    // ================================
    // CATEGORÍA 2: COVERS (12 archivos con nuevas rutas)
    // ================================
    console.log('\n📥 CATEGORÍA 2: Cargando COVERS (12 categorías)...');

    // NUEVAS RUTAS PARA COVERS
    const coversFiles = [
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasespanol.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasingles.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-discoingles.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-festivos-bso.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkespanol.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkingles.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-latinobailableespanol.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockespanol.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockingles.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-reggaeingles.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableespanol.json',
      '/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableingles.json'
    ];

    let coversData = {};
    let coversCargados = 0;

    for (const file of coversFiles) {
      try {
        const data = await loadMusicData(file);
        Object.assign(coversData, data);
        coversCargados++;
        console.log(`✅ ${file.split('/').pop()}: cargado`);
      } catch (error) {
        console.log(`⚠️ No se pudo cargar ${file}: ${error.message}`);
      }
    }

    console.log(`📊 Covers: ${coversCargados}/${coversFiles.length} categorías cargadas`);

    // ================================
    // CATEGORÍA 3: MEDLEYS
    // ================================
    console.log('\n📥 CATEGORÍA 3: Cargando MEDLEYS...');

    let medleysData = {};
    try {
      // NUEVA RUTA PARA MEDLEYS
      medleysData = await loadMusicData('/listados/listados-musica-medleys/listado-musica-covers-medleys.json');
      console.log(`✅ Medleys: ${Object.keys(medleysData).length} discos`);
    } catch (error) {
      console.log('ℹ️ No se encontró archivo de medleys');
    }

    // ================================
    // CATEGORÍA 4: HOMENAJES
    // ================================
    console.log('\n📥 CATEGORÍA 4: Cargando HOMENAJES...');

    let homenajesData = {};
    try {
      homenajesData = await loadHomenajesData();

      const homenajesDiscos = Object.keys(homenajesData).length;
      const homenajesCanciones = Object.values(homenajesData)
        .reduce((acc, disco) => acc + (disco.canciones?.length || 0), 0);

      console.log(`✅ Homenajes: ${homenajesDiscos} artistas, ${homenajesCanciones} canciones`);
      
      // MOSTRAR ARTISTAS CARGADOS (solo primeros 5 para no saturar)
      console.log('\n👑 ARTISTAS DE HOMENAJES CARGADOS (primeros 5):');
      Object.values(homenajesData).slice(0, 5).forEach((disco, index) => {
        console.log(`${index + 1}. ${disco.nombre} - ${disco.canciones?.length || 0} canciones`);
      });
      
      if (homenajesDiscos > 5) {
        console.log(`   ... y ${homenajesDiscos - 5} más`);
      }

    } catch (error) {
      console.log('❌ Error cargando homenajes:', error.message);
      homenajesData = {};
    }

    // ================================
    // CATEGORÍA 5: ZAPADAS (POR GÉNERO)
    // ================================
    console.log('\n📥 CATEGORÍA 5: Cargando ZAPADAS por género (17 archivos)...');

    let zapadasData = {};
    try {
      zapadasData = await loadZapadasData();

      const zapadasDiscos = Object.keys(zapadasData).length;
      const zapadasCanciones = Object.values(zapadasData)
        .reduce((acc, disco) => acc + (disco.canciones?.length || 0), 0);

      console.log(`✅ Zapadas: ${zapadasDiscos} géneros, ${zapadasCanciones} canciones`);
      
      // MOSTRAR GÉNEROS DE ZAPADAS CARGADOS
      if (zapadasDiscos > 0) {
        console.log('\n🎹 GÉNEROS DE ZAPADAS CARGADOS:');
        const generosUnicos = [...new Set(Object.values(zapadasData).map(disco => disco.genero))];
        generosUnicos.slice(0, 5).forEach((genero, index) => {
          const cancionesEnGenero = Object.values(zapadasData)
            .filter(disco => disco.genero === genero)
            .reduce((acc, disco) => acc + (disco.canciones?.length || 0), 0);
          console.log(`${index + 1}. ${genero} - ${cancionesEnGenero} canciones`);
        });
        
        if (generosUnicos.length > 5) {
          console.log(`   ... y ${generosUnicos.length - 5} más`);
        }
      }

    } catch (error) {
      console.log('❌ Error cargando zapadas:', error.message);
      zapadasData = {};
    }

    // ================================
    // ESTRUCTURA FINAL CON 5 CATEGORÍAS
    // ================================
    const ALL_MUSIC_CONFIG = {
      original: {
        ...aleGondraData,
        ...almangoData
      },

      covers: coversData,

      medleys: medleysData,

      homenajes: homenajesData,

      zapadas: zapadasData
    };

    // ================================
    // ESTADÍSTICAS FINALES
    // ================================
    console.log('\n' + '='.repeat(60));
    console.log('🎵 RESUMEN FINAL DEL CATÁLOGO');
    console.log('='.repeat(60));

    let totalDiscos = 0;
    let totalCanciones = 0;

    Object.entries(ALL_MUSIC_CONFIG).forEach(([categoria, datos]) => {
      const numDiscos = Object.keys(datos).length;
      const numCanciones = Object.values(datos)
        .reduce((acc, disco) => acc + (disco.canciones?.length || 0), 0);
      
      totalDiscos += numDiscos;
      totalCanciones += numCanciones;
      
      const iconos = {
        original: '🎤',
        covers: '🎸',
        medleys: '🎶',
        homenajes: '👑',
        zapadas: '🎹'
      };
      
      console.log(`${iconos[categoria] || '📁'} ${categoria.toUpperCase()}: ${numDiscos} discos, ${numCanciones} canciones`);
    });

    console.log('='.repeat(60));
    console.log(`📊 TOTAL: ${totalDiscos} discos, ${totalCanciones} canciones`);
    console.log('='.repeat(60));
    console.log('✅ CARGA COMPLETADA EXITOSAMENTE');
    console.log('='.repeat(60));

    return ALL_MUSIC_CONFIG;

  } catch (error) {
    console.error('❌ Error crítico en loadAllMusicData:', error);

    // ESTRUCTURA DE FALLBACK
    return {
      original: {
        'fallback-original': {
          id: 'fallback-original',
          nombre: 'MÚSICA ORIGINAL',
          artista: 'Almango Pop',
          portada: '/img/default-cover.png',
          año: '2024',
          genero: 'Original',
          categoria: 'original',
          canciones: []
        }
      },
      covers: {
        'fallback-covers': {
          id: 'fallback-covers',
          nombre: 'COVERS',
          artista: 'Almango Pop',
          portada: '/img/09-discos/tapa-listado-covers.jpg',
          año: '2024',
          genero: 'Covers',
          categoria: 'covers',
          canciones: []
        }
      },
      medleys: {
        'fallback-medleys': {
          id: 'fallback-medleys',
          nombre: 'MEDLEYS',
          artista: 'Almango Pop',
          portada: '/img/medleys-default.jpg',
          año: '2024',
          genero: 'Medleys',
          categoria: 'medleys',
          canciones: []
        }
      },
      homenajes: {
        'fallback-homenajes': {
          id: 'fallback-homenajes',
          nombre: 'HOMENAJES',
          artista: 'Almango Pop',
          portada: '/img/02-logos/logo-formateo-chords2.png',
          año: '2024',
          genero: 'Homenajes',
          categoria: 'homenajes',
          canciones: []
        }
      },
      zapadas: {
        'fallback-zapadas': {
          id: 'fallback-zapadas',
          nombre: 'ZAPADAS',
          artista: 'Almango Pop',
          portada: '/img/02-logos/logo-formateo-chords2.png',
          año: '2024',
          genero: 'Zapadas',
          categoria: 'zapadas',
          canciones: []
        }
      }
    };
  }
};

// ============================================
// FUNCIÓN: loadChordsData - VERSIÓN MEJORADA
// DESCRIPCIÓN: Carga datos de acordes con manejo robusto de errores
// ============================================
export const loadChordsData = async (chordsUrl) => {
  try {
    console.log(`🎵 Intentando cargar chords:`, chordsUrl);

    // CASO 1: NO HAY chords_url
    if (!chordsUrl) {
      console.log('ℹ️ No hay chords_url disponible, creando ejemplo');
      return crearChordsEjemplo("Sin acordes disponibles");
    }

    // CASO 2: ES ARRAY (MEDLEY)
    if (Array.isArray(chordsUrl)) {
      console.log(`🎶 Cargando MEDLEY con ${chordsUrl.length} canciones...`);
      
      const chordsPromises = chordsUrl.map(url =>
        fetch(url)
          .then(response => {
            if (!response.ok) throw new Error(`Error ${response.status}`);
            return response.json();
          })
          .catch(err => {
            console.error(`❌ Error cargando ${url}:`, err.message);
            return crearChordsEjemplo("Error cargando");
          })
      );

      const allChordsData = await Promise.all(chordsPromises);
      
      const combinedChordsData = {
        id: `medley-${Date.now()}`,
        title: `Medley de ${allChordsData.length} canciones`,
        artist: 'Varios Artistas',
        originalKey: "C",
        esMedley: true,
        cancionesIncluidas: allChordsData.length,
        content: []
      };

      // AGREGAR CONTENIDO DE CADA CANCIÓN
      allChordsData.forEach((chordsData, index) => {
        combinedChordsData.content.push({
          type: 'section',
          name: `🎵 PARTE ${index + 1}: ${chordsData.title || `Canción ${index + 1}`}`,
          lines: [
            { type: 'lyric', content: `Artista: ${chordsData.artist || 'Desconocido'}` }
          ]
        });

        if (chordsData.content && Array.isArray(chordsData.content)) {
          combinedChordsData.content.push(...chordsData.content);
        }
      });

      console.log(`✅ Medley cargado: ${allChordsData.length} canciones`);
      return combinedChordsData;
    }

    // CASO 3: ES STRING (CANCIÓN INDIVIDUAL)
    console.log(`📄 Cargando canción individual: ${chordsUrl}`);
    const response = await fetch(chordsUrl);

    if (!response.ok) {
      console.error(`❌ No se encontró ${chordsUrl} (${response.status}), creando ejemplo`);
      return crearChordsEjemplo("Acordes no encontrados");
    }

    const chordsData = await response.json();
    console.log(`✅ Chords cargados: ${chordsData.title || chordsData.id}`);
    return chordsData;

  } catch (error) {
    console.error('❌ Error en loadChordsData:', error.message);
    return crearChordsEjemplo("Error cargando acordes");
  }
};

// ============================================
// FUNCIÓN AUXILIAR: crearChordsEjemplo
// DESCRIPCIÓN: Crea datos de acordes de ejemplo cuando hay errores
// ============================================
const crearChordsEjemplo = (titulo) => {
  return {
    id: `ejemplo-${Date.now()}`,
    title: titulo,
    artist: "Artista",
    originalKey: "C",
    tempo: "120",
    timeSignature: "4/4",
    esMedley: false,
    cancionesIncluidas: 1,
    content: [
      {
        type: "section",
        name: "INTRO",
        lines: [
          { type: "chords", content: ["C", "G", "Am", "F"] }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "section",
        name: "ESTROFA",
        lines: [
          { type: "chord", content: "C" },
          { type: "lyric", content: "Ejemplo de canción" },
          { type: "chord", content: "G" },
          { type: "lyric", content: "Mientras se cargan los acordes reales" },
          { type: "chord", content: "Am" },
          { type: "lyric", content: "O si hay algún error" },
          { type: "chord", content: "F" },
          { type: "lyric", content: "En la carga del archivo" }
        ]
      }
    ]
  };
};

// ============================================
// FUNCIÓN: loadCoversByCategory - VERSIÓN CON RUTAS ACTUALIZADAS
// DESCRIPCIÓN: Carga covers por categoría específica
// ============================================
export const loadCoversByCategory = async (category) => {
  try {
    // MAPA DE ARCHIVOS CON NUEVAS RUTAS
    const fileMap = {
      'baladasespanol': '/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasespanol.json',
      'baladasingles': '/listados/listados-musica-covers-por-genero/listadocancionescovers-baladasingles.json',
      'discoingles': '/listados/listados-musica-covers-por-genero/listadocancionescovers-discoingles.json',
      'festivos-bso': '/listados/listados-musica-covers-por-genero/listadocancionescovers-festivos-bso.json',
      'hardrock-punkespanol': '/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkespanol.json',
      'hardrock-punkingles': '/listados/listados-musica-covers-por-genero/listadocancionescovers-hardrock-punkingles.json',
      'latinobailableespanol': '/listados/listados-musica-covers-por-genero/listadocancionescovers-latinobailableespanol.json',
      'poprockespanol': '/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockespanol.json',
      'poprockingles': '/listados/listados-musica-covers-por-genero/listadocancionescovers-poprockingles.json',
      'reggaeingles': '/listados/listados-musica-covers-por-genero/listadocancionescovers-reggaeingles.json',
      'rockbailableespanol': '/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableespanol.json',
      'rockbailableingles': '/listados/listados-musica-covers-por-genero/listadocancionescovers-rockbailableingles.json',
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
// ============================================
export const getAvailableCategories = () => {
  return [
    { id: 'original', name: 'Música Original', icon: '🎤', desc: 'Musica Original' },
    { id: 'covers', name: 'Todos los Covers', icon: '🎸', desc: 'Covers Versionados' },
    { id: 'medleys', name: 'Medleys', icon: '🎶', desc: 'Enganchados' },
    { id: 'homenajes', name: 'Homenajes', icon: '👑', desc: 'Tributos Musicales' },
    { id: 'zapadas', name: 'Zapadas', icon: '🎹', desc: 'Sesiones Espontáneas' },
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
// FUNCIÓN: getAvailableZapadasGenres
// DESCRIPCIÓN: Retorna todos los géneros de zapadas disponibles
// ============================================
export const getAvailableZapadasGenres = () => {
  return [
    { id: 'zapadas-blues', name: 'Zapadas Blues', icon: '🎹', desc: 'Sesiones Blues' },
    { id: 'zapadas-rock', name: 'Zapadas Rock', icon: '🎹', desc: 'Sesiones Rock' },
    { id: 'zapadas-country', name: 'Zapadas Country', icon: '🎹', desc: 'Sesiones Country' },
    { id: 'zapadas-electronica', name: 'Zapadas Electrónica', icon: '🎹', desc: 'Sesiones Electrónicas' },
    { id: 'zapadas-experimentales', name: 'Zapadas Experimentales', icon: '🎹', desc: 'Sesiones Experimentales' },
    { id: 'zapadas-folklore', name: 'Zapadas Folklore', icon: '🎹', desc: 'Sesiones Folklore' },
    { id: 'zapadas-funk', name: 'Zapadas Funk', icon: '🎹', desc: 'Sesiones Funk' },
    { id: 'zapadas-jazz', name: 'Zapadas Jazz', icon: '🎹', desc: 'Sesiones Jazz' },
    { id: 'zapadas-latino', name: 'Zapadas Latino', icon: '🎹', desc: 'Sesiones Latino' },
    { id: 'zapadas-metal', name: 'Zapadas Metal', icon: '🎹', desc: 'Sesiones Metal' },
    { id: 'zapadas-pop', name: 'Zapadas Pop', icon: '🎹', desc: 'Sesiones Pop' },
    { id: 'zapadas-r&b', name: 'Zapadas R&B', icon: '🎹', desc: 'Sesiones R&B' },
    { id: 'zapadas-reggae', name: 'Zapadas Reggae', icon: '🎹', desc: 'Sesiones Reggae' },
    { id: 'zapadas-ska', name: 'Zapadas Ska', icon: '🎹', desc: 'Sesiones Ska' },
    { id: 'zapadas-soul', name: 'Zapadas Soul', icon: '🎹', desc: 'Sesiones Soul' },
    { id: 'zapadas-tango', name: 'Zapadas Tango', icon: '🎹', desc: 'Sesiones Tango' },
    { id: 'zapadas-urban', name: 'Zapadas Urban', icon: '🎹', desc: 'Sesiones Urban' }
  ];
};

// ============================================
// FUNCIÓN: searchSongs
// DESCRIPCIÓN: Busca canciones en todas las categorías
// ============================================
export const searchSongs = async (query, category = 'all') => {
  try {
    console.log(`🔍 Buscando: "${query}" en categoría: ${category}`);

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
    if (category === 'all' || category === 'covers' || (category !== 'original' && category !== 'medleys' && category !== 'homenajes' && category !== 'zapadas')) {
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

    // Buscar en homenajes si corresponde
    if (category === 'all' || category === 'homenajes') {
      Object.values(allData.homenajes).forEach(disco => {
        disco.canciones?.forEach(cancion => {
          if (
            cancion.nombre.toLowerCase().includes(queryLower) ||
            cancion.artista.toLowerCase().includes(queryLower) ||
            (cancion.esHomenaje && 'homenaje'.includes(queryLower)) ||
            disco.nombre.toLowerCase().includes(queryLower)
          ) {
            results.push({
              ...cancion,
              tipo: 'homenajes',
              discoNombre: disco.nombre,
              categoria: 'homenajes',
              esHomenaje: true
            });
          }
        });
      });
    }

    // Buscar en zapadas si corresponde
    if (category === 'all' || category === 'zapadas') {
      Object.values(allData.zapadas).forEach(disco => {
        disco.canciones?.forEach(cancion => {
          if (
            cancion.nombre.toLowerCase().includes(queryLower) ||
            cancion.artista.toLowerCase().includes(queryLower) ||
            (cancion.esZapada && 'zapada'.includes(queryLower)) ||
            disco.nombre.toLowerCase().includes(queryLower)
          ) {
            results.push({
              ...cancion,
              tipo: 'zapadas',
              discoNombre: disco.nombre,
              categoria: 'zapadas',
              esZapada: true
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

// ============================================
// FUNCIÓN AUXILIAR: getFileFromCategory
// DESCRIPCIÓN: Obtiene la ruta del archivo según la categoría
// ============================================
export const getFileFromCategory = (category) => {
  const categoryMap = {
    // Original
    'original': [
      '/listados/listados-musica-original/listado-musica-alegondra.json',
      '/listados/listados-musica-original/listado-musica-almango.json'
    ],
    
    // Covers por género
    'covers': '/listados/listados-musica-covers-por-genero/',
    
    // Medleys
    'medleys': '/listados/listados-musica-medleys/listado-musica-covers-medleys.json',
    
    // Homenajes
    'homenajes': '/listados/listados-musica-homenajes/',
    
    // Zapadas (lista de archivos)
    'zapadas': [
      '/listados/listados-musica-zapadas/listado-musica-zapadas-blues.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-country.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-electronica.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-experimentales.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-folklore.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-funk.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-jazz.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-latino.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-metal.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-pop.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-r&b.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-reggae.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-rock.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-ska.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-soul.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-tango.json',
      '/listados/listados-musica-zapadas/listado-musica-zapadas-urban.json'
    ]
  };
  
  return categoryMap[category] || null;
};

// ============================================
// EXPORTACIONES PRINCIPALES
// ============================================
export default {
  loadAllMusicData,
  loadMusicData,
  loadChordsData,
  loadCoversByCategory,
  loadZapadasData,
  getAvailableCategories,
  getAvailableZapadasGenres,
  searchSongs,
  getFileFromCategory
};