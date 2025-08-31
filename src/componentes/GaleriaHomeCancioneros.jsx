// ================================================================
// Galería Home Cancioneros
// Componente para mostrar múltiples grupos de canciones y acordes
// Carga datos desde varios archivos JSON y crea un grid responsive
// ================================================================

import React, { useEffect, useState } from "react"; // Hooks React
import { Link } from "react-router-dom"; // Para navegación interna
import "../assets/scss/_03-Componentes/_GaleriaHomeCancioneros.scss"; // Estilos SCSS del componente

// Lista de archivos JSON que se cargarán al montar el componente
const jsonFiles = [
  "/data/listadocancionesalegondramusic.json",
  "/data/listadocancionesalmangopop.json",
  "/data/listadocancionescasamiento.json",
  "/data/listadochordscoversseleccionados1.json",
  "/data/listadochordscoversseleccionados2.json"
];

const GaleriaHomeCancioneros = () => {
  // Estado local: almacena los grupos de canciones ya parseados
  const [groups, setGroups] = useState([]);

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch concurrente de todos los JSONs
        const responses = await Promise.all(
          jsonFiles.map(file => fetch(file).then(res => res.json()))
        );

        // Parseo de los JSONs en un formato uniforme: {groupName, artist, songs[]}
        const parsedGroups = responses.map((data, index) => {
          if (data.albums) {
            // JSON con estructura de álbumes
            return data.albums.map(album => ({
              groupName: album.album_name || "Sin título",
              artist: album.artist || null,
              songs: album.songs || []
            }));
          } else if (data.songs) {
            // JSON plano de canciones
            return [
              {
                groupName: `Grupo ${index + 1}`,
                songs: data.songs
              }
            ];
          }
          return [];
        });

        // Se asigna al estado aplanando los grupos
        setGroups(parsedGroups.flat());
      } catch (error) {
        console.error("Error cargando JSONs:", error);
      }
    };

    loadData();
  }, []); // Dependencias vacías => solo se ejecuta al montar

  return (
    <main className="chords-gallery">
      {/* Título principal de la galería */}
      <h1 className="gallery-title">🎶 Galería de Chords</h1>

      {/* Iteración sobre cada grupo de canciones */}
      {groups.map((group, gIndex) => (
        <section key={gIndex} className="chords-group">
          {/* Nombre del grupo */}
          <h2 className="group-title">{group.groupName}</h2>

          {/* Grid de canciones */}
          <div className="chords-grid">
            {group.songs.map((song, sIndex) => (
              <Link
                key={sIndex}
                to={`/chords/${song.id || sIndex}`} // Ruta dinámica
                className="chord-card"
              >
                {/* Imagen del chord */}
                <div className="chord-image">
                  <img
                    src="/img/02-logos/logo-formateo-chords.png"
                    alt={song.title}
                  />
                </div>

                {/* Información de la canción */}
                <div className="chord-info">
                  <h3 className="song-title">{song.title}</h3>
                  <p className="song-artist">{song.artist}</p>
                  {song.key && <span className="song-key">Tono: {song.key}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default GaleriaHomeCancioneros;
