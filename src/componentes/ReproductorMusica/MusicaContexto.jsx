// ████████████████████████████████████████████
// ARCHIVO: MusicaContexto.jsx - VERSIÓN COMPLETA ACTUALIZADA
// DESCRIPCIÓN: Contexto global para manejar el estado del reproductor de música en toda la aplicación
// FUNCIONALIDAD: 
//   - Gestiona el estado global de reproducción (canción actual, estado play/pause, tiempo, volumen)
//   - Proporciona funciones para controlar la reproducción desde cualquier componente
//   - Maneja el elemento de audio HTML5 de forma centralizada
//   - Gestiona playlist actual para next/prev funciones
// CORRECCIONES REALIZADAS:
//   - Agregado export de useMusicaContexto que faltaba
//   - Agregadas funciones de playlist para next/prev
//   - Mantenida compatibilidad con componentes existentes que usan props
// COMUNICACIÓN: 
//   - Se usa en MMusicaEscuchaOriginalDiscos.jsx y MMusicaEscuchaCovers.jsx para los botones de reproducción
//   - Se provee en App.jsx para que toda la aplicación tenga acceso
// ████████████████████████████████████████████

// ████████████████████████████████████████████
// IMPORTACIONES DE REACT
// DESCRIPCIÓN: Importamos todas las funciones de React necesarias para crear y manejar el contexto
// ████████████████████████████████████████████
import React, { createContext, useState, useRef, useEffect, useCallback, useContext } from 'react';

// ████████████████████████████████████████████
// CREACIÓN DEL CONTEXTO
// DESCRIPCIÓN: Creamos el contexto que almacenará todos los estados y funciones de música
// USO: Este contexto será proveído en App.jsx y consumido por componentes hijos mediante useMusicaContexto
// ████████████████████████████████████████████
export const MusicaContexto = createContext();

// ████████████████████████████████████████████
// COMPONENTE: MusicaProvider
// DESCRIPCIÓN: Proveedor del contexto que envuelve toda la aplicación para manejo global del estado de música
// PROPS: 
//   - children: Todos los componentes hijos de la aplicación que tendrán acceso al contexto
// FUNCIONALIDAD: Maneja el estado global de reproducción y proporciona funciones de control
// ████████████████████████████████████████████
export function MusicaProvider({ children }) {
  // ████████████████████████████████████████████
  // ESTADO: currentSong
  // DESCRIPCIÓN: Almacena la canción actualmente en reproducción
  // VALOR: Objeto con información de la canción {id, nombre, artista, url, imagen} o null si no hay canción
  // USO: Para saber qué canción se está reproduciendo actualmente en toda la aplicación
  // ████████████████████████████████████████████
  const [currentSong, setCurrentSong] = useState(null);
  
  // ████████████████████████████████████████████
  // ESTADO: isPlaying
  // DESCRIPCIÓN: Indica si el audio está reproduciéndose actualmente
  // VALOR: boolean - true si está reproduciendo, false si está pausado
  // USO: Para controlar el estado de reproducción y actualizar iconos de play/pause
  // ████████████████████████████████████████████
  const [isPlaying, setIsPlaying] = useState(false);
  
  // ████████████████████████████████████████████
  // ESTADO: currentTime
  // DESCRIPCIÓN: Tiempo actual de reproducción en segundos
  // USO: Para mostrar la barra de progreso y tiempo transcurrido en reproductores
  // ████████████████████████████████████████████
  const [currentTime, setCurrentTime] = useState(0);
  
  // ████████████████████████████████████████████
  // ESTADO: duration
  // DESCRIPCIÓN: Duración total de la canción en segundos
  // USO: Para calcular el progreso y mostrar el tiempo total de la canción
  // ████████████████████████████████████████████
  const [duration, setDuration] = useState(0);
  
  // ████████████████████████████████████████████
  // ESTADO: volume
  // DESCRIPCIÓN: Nivel de volumen del reproductor (0 = silencio, 1 = máximo)
  // VALOR: número entre 0 y 1
  // USO: Para controlar el volumen del audio en toda la aplicación
  // ████████████████████████████████████████████
  const [volume, setVolume] = useState(0.7);
  
  // ████████████████████████████████████████████
  // ESTADO: currentPlaylist
  // DESCRIPCIÓN: Lista actual de canciones disponibles para reproducción
  // VALOR: Array de objetos de canciones
  // USO: Para manejar las funciones next/prev dentro de una lista específica
  // ████████████████████████████████████████████
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  
  // ████████████████████████████████████████████
  // ESTADO: currentPlaylistIndex
  // DESCRIPCIÓN: Índice de la canción actual dentro de la playlist
  // VALOR: número (índice en el array)
  // USO: Para saber qué canción sigue/anterior en la lista
  // ████████████████████████████████████████████
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  
  // ████████████████████████████████████████████
  // REF: audioRef
  // DESCRIPCIÓN: Referencia al elemento HTML <audio> nativo que maneja la reproducción real
  // USO: Para controlar la reproducción directamente a nivel del DOM sin renderizar el elemento
  // ████████████████████████████████████████████
  const audioRef = useRef(null);

  // ████████████████████████████████████████████
  // EFECTO: Manejo de la reproducción del audio
  // DESCRIPCIÓN: Se ejecuta cuando cambia currentSong, isPlaying o volume para sincronizar el elemento de audio
  // DEPENDENCIAS: [currentSong, isPlaying, volume] - se re-ejecuta cuando cualquiera de estos cambia
  // FUNCIONALIDAD: 
  //   - Configura la fuente de audio cuando cambia la canción
  //   - Controla play/pause según el estado isPlaying
  //   - Ajusta el volumen cuando cambia
  //   - Escucha eventos del audio para actualizar estados (tiempo, duración, fin de canción)
  // ████████████████████████████████████████████
  useEffect(() => {
    // Obtenemos la referencia al elemento de audio
    const audio = audioRef.current;
    
    // Si no hay elemento de audio o no hay canción actual, no hacemos nada
    if (!audio || !currentSong) return;

    // ████████████████████████████████████████████
    // HANDLER: handleTimeUpdate
    // DESCRIPCIÓN: Se ejecuta cuando avanza el tiempo de reproducción del audio
    // FUNCIONALIDAD: Actualiza el estado currentTime con el tiempo actual del audio
    // ████████████████████████████████████████████
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    
    // ████████████████████████████████████████████
    // HANDLER: handleLoadedMetadata
    // DESCRIPCIÓN: Se ejecuta cuando se cargan los metadatos del audio (incluida la duración)
    // FUNCIONALIDAD: Actualiza el estado duration con la duración total del audio
    // ████████████████████████████████████████████
    const handleLoadedMetadata = () => setDuration(audio.duration);
    
    // ████████████████████████████████████████████
    // HANDLER: handleEnded
    // DESCRIPCIÓN: Se ejecuta cuando el audio termina de reproducirse
    // FUNCIONALIDAD: Pausa la reproducción y reinicia el tiempo a 0
    // ████████████████████████████████████████████
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Si hay playlist, reproducir siguiente canción automáticamente
      if (currentPlaylist.length > 0 && currentPlaylistIndex < currentPlaylist.length - 1) {
        const nextIndex = currentPlaylistIndex + 1;
        const nextSong = currentPlaylist[nextIndex];
        if (nextSong) {
          // Pequeño delay para mejor experiencia de usuario
          setTimeout(() => {
            setCurrentPlaylistIndex(nextIndex);
            setCurrentSong(nextSong);
            setIsPlaying(true);
          }, 500);
        }
      }
    };

    // Configuramos la fuente del audio con la URL de la canción actual
    audio.src = currentSong.url;
    
    // Configuramos el volumen del audio según el estado volume
    audio.volume = volume;
    
    // Cargamos el audio (prepara el elemento para reproducir)
    audio.load();

    // Agregamos event listeners al elemento de audio
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Manejamos la reproducción según el estado isPlaying
    if (isPlaying) {
      // Intentamos reproducir el audio
      audio.play().catch(err => {
        // Si hay error al reproducir, mostramos error en consola y pausamos
        console.error("Error al reproducir el audio:", err);
        setIsPlaying(false);
      });
    }

    // ████████████████████████████████████████████
    // FUNCIÓN DE LIMPIEZA DEL EFECTO
    // DESCRIPCIÓN: Se ejecuta cuando el componente se desmonta o antes de re-ejecutar el efecto
    // FUNCIONALIDAD: Remueve los event listeners para evitar memory leaks
    // ████████████████████████████████████████████
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isPlaying, volume, currentPlaylist, currentPlaylistIndex]);

  // ████████████████████████████████████████████
  // FUNCIÓN: playSong
  // DESCRIPCIÓN: Reproduce una canción específica
  // PARÁMETRO: song - objeto con información de la canción {id, nombre, artista, url, imagen}
  // USO: Se llama desde los botones de reproducción en discos y covers
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [currentSong, isPlaying, currentPlaylist] - se recrea si cambian estas dependencias
  // ████████████████████████████████████████████
  const playSong = useCallback((song) => {
    // Si ya es la misma canción y está reproduciendo, no hacemos nada (evita parpadeo)
    if (currentSong?.id === song.id && isPlaying) {
      return;
    }
    
    // Encontrar el índice de la canción en la playlist actual
    const songIndex = currentPlaylist.findIndex(s => s.id === song.id);
    if (songIndex !== -1) {
      setCurrentPlaylistIndex(songIndex);
    }
    
    // Establecemos la nueva canción como currentSong
    setCurrentSong(song);
    
    // Activamos el estado de reproducción
    setIsPlaying(true);
  }, [currentSong, isPlaying, currentPlaylist]);

  // ████████████████████████████████████████████
  // FUNCIÓN: pauseSong
  // DESCRIPCIÓN: Pausa la reproducción actual
  // USO: Se llama desde los botones de pausa en discos y covers
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [] - no tiene dependencias, se crea una sola vez
  // ████████████████████████████████████████████
  const pauseSong = useCallback(() => {
    // Desactivamos el estado de reproducción
    setIsPlaying(false);
  }, []);

  // ████████████████████████████████████████████
  // FUNCIÓN: togglePlayPause
  // DESCRIPCIÓN: Alterna entre reproducir y pausar la canción actual
  // USO: Para botones que alternan entre play y pause
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [currentSong] - se recrea si cambia la canción actual
  // ████████████████████████████████████████████
  const togglePlayPause = useCallback(() => {
    // Solo alternamos si hay una canción actual
    if (currentSong) {
      setIsPlaying(prev => !prev);
    }
  }, [currentSong]);

  // ████████████████████████████████████████████
  // FUNCIÓN: handleVolumeChange
  // DESCRIPCIÓN: Maneja el cambio de volumen del reproductor
  // PARÁMETRO: newVolume - nuevo nivel de volumen (0-1)
  // USO: Se llama desde controles de volumen en reproductores
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [] - no tiene dependencias, se crea una sola vez
  // ████████████████████████████████████████████
  const handleVolumeChange = useCallback((newVolume) => {
    // Actualizamos el estado del volumen
    setVolume(newVolume);
    
    // Si hay elemento de audio, actualizamos su volumen también
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // ████████████████████████████████████████████
  // FUNCIÓN: handleProgressChange
  // DESCRIPCIÓN: Maneja el cambio de progreso (cuando el usuario mueve la barra de tiempo)
  // PARÁMETRO: newTime - nuevo tiempo en segundos donde posicionar la reproducción
  // USO: Se llama cuando el usuario interactúa con la barra de progreso
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [] - no tiene dependencias, se crea una sola vez
  // ████████████████████████████████████████████
  const handleProgressChange = useCallback((newTime) => {
    // Si no hay elemento de audio, no hacemos nada
    if (!audioRef.current) return;
    
    // Establecemos el nuevo tiempo actual en el elemento de audio
    audioRef.current.currentTime = newTime;
    
    // Actualizamos el estado currentTime para reflejar el cambio
    setCurrentTime(newTime);
  }, []);

  // ████████████████████████████████████████████
  // FUNCIÓN: updatePlaylist
  // DESCRIPCIÓN: Actualiza la playlist actual
  // PARÁMETRO: songs - array de canciones para la nueva playlist
  // USO: Se llama desde MMusicaEscucha cuando cambia la lista de canciones filtradas
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [] - no tiene dependencias, se crea una sola vez
  // ████████████████████████████████████████████
  const updatePlaylist = useCallback((songs) => {
    setCurrentPlaylist(songs);
    setCurrentPlaylistIndex(0);
  }, []);

  // ████████████████████████████████████████████
  // FUNCIÓN: playNextSong
  // DESCRIPCIÓN: Reproduce la siguiente canción en la playlist
  // USO: Se llama desde el botón "siguiente" del reproductor
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [currentPlaylist, currentPlaylistIndex] - se recrea si cambian estas dependencias
  // ████████████████████████████████████████████
  const playNextSong = useCallback(() => {
    if (currentPlaylist.length === 0 || currentPlaylistIndex >= currentPlaylist.length - 1) {
      return; // No hay siguiente canción
    }
    
    const nextIndex = currentPlaylistIndex + 1;
    const nextSong = currentPlaylist[nextIndex];
    
    if (nextSong) {
      setCurrentPlaylistIndex(nextIndex);
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  }, [currentPlaylist, currentPlaylistIndex]);

  // ████████████████████████████████████████████
  // FUNCIÓN: playPrevSong
  // DESCRIPCIÓN: Reproduce la canción anterior en la playlist
  // USO: Se llama desde el botón "anterior" del reproductor
  // useCallback: Memoriza la función para evitar recreaciones innecesarias
  // DEPENDENCIAS: [currentPlaylist, currentPlaylistIndex] - se recrea si cambian estas dependencias
  // ████████████████████████████████████████████
  const playPrevSong = useCallback(() => {
    if (currentPlaylist.length === 0 || currentPlaylistIndex <= 0) {
      return; // No hay canción anterior
    }
    
    const prevIndex = currentPlaylistIndex - 1;
    const prevSong = currentPlaylist[prevIndex];
    
    if (prevSong) {
      setCurrentPlaylistIndex(prevIndex);
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
  }, [currentPlaylist, currentPlaylistIndex]);

  // ████████████████████████████████████████████
  // RETORNO DEL MUSICAPROVIDER
  // DESCRIPCIÓN: Provee todos los estados y funciones a través del contexto
  // ESTRUCTURA:
  //   - value: objeto con todos los estados y funciones que estarán disponibles para los componentes hijos
  //   - children: componentes hijos que tendrán acceso al contexto
  //   - Elemento <audio> oculto: elemento nativo que maneja la reproducción real
  // ████████████████████████████████████████████
  return (
    <MusicaContexto.Provider value={{
      // ████████████████████████████████████████████
      // ESTADOS PROVEÍDOS
      // DESCRIPCIÓN: Estados que los componentes pueden leer para conocer el estado actual
      // ████████████████████████████████████████████
      currentSong,           // Canción actualmente en reproducción
      isPlaying,             // Si está reproduciéndose algo
      currentTime,           // Tiempo actual de reproducción en segundos
      duration,              // Duración total de la canción en segundos
      volume,                // Nivel de volumen actual (0-1)
      currentPlaylist,       // Playlist actual de canciones
      currentPlaylistIndex,  // Índice actual en la playlist
      
      // ████████████████████████████████████████████
      // FUNCIONES PROVEÍDAS - CONTROL DE REPRODUCCIÓN
      // DESCRIPCIÓN: Funciones que los componentes pueden ejecutar para controlar la reproducción
      // ████████████████████████████████████████████
      playSong,              // Reproduce una canción específica
      pauseSong,             // Pausa la reproducción actual
      togglePlayPause,       // Alterna entre play y pause
      setVolume: handleVolumeChange,    // Cambia el volumen (alias para compatibilidad)
      handleProgressChange,  // Cambia el tiempo de reproducción
      updatePlaylist,        // Actualiza la playlist actual
      playNextSong,          // Reproduce siguiente canción en playlist
      playPrevSong,          // Reproduce canción anterior en playlist
      
      // ████████████████████████████████████████████
      // FUNCIONES DE ACTUALIZACIÓN DE ESTADO (para compatibilidad)
      // DESCRIPCIÓN: Estas funciones se proveen para mantener compatibilidad con componentes existentes
      // USO: Componentes como Musica.jsx que usan props pueden seguir funcionando
      // ████████████████████████████████████████████
      setCurrentSong,        // Para compatibilidad con componentes que usan props
      setIsPlaying           // Para compatibilidad con componentes que usan props
    }}>
      {children}
      
      {/* ████████████████████████████████████████████ */}
      {/* ELEMENTO DE AUDIO OCULTO */}
      {/* DESCRIPCIÓN: Elemento HTML5 <audio> que maneja la reproducción real */}
      {/* CARACTERÍSTICAS:
          - ref: audioRef para controlarlo programáticamente
          - No visible en la interfaz (controlado por componentes)
          - Maneja la reproducción real de archivos de audio
      */}
      {/* ████████████████████████████████████████████ */}
      <audio ref={audioRef} />
    </MusicaContexto.Provider>
  );
}

// ████████████████████████████████████████████
// HOOK PERSONALIZADO: useMusicaContexto
// DESCRIPCIÓN: Hook para acceder fácilmente al contexto de música desde cualquier componente
// FUNCIONALIDAD: 
//   - Obtiene el contexto actual de MusicaContexto
//   - Verifica que el componente esté dentro de un MusicaProvider
//   - Retorna el contexto para ser usado en el componente
// USO: En cualquier componente hijo para acceder a los estados y funciones de música
// ████████████████████████████████████████████
export const useMusicaContexto = () => {
  // Obtenemos el contexto actual usando useContext de React
  const context = useContext(MusicaContexto);
  
  // Verificamos que el contexto exista (que el componente esté dentro de un MusicaProvider)
  if (!context) {
    throw new Error('useMusicaContexto debe ser usado dentro de un MusicaProvider');
  }
  
  // Retornamos el contexto para que el componente lo use
  return context;
};