// ======================================================
// 📦 IMPORTACIONES DE DEPENDENCIAS
// ======================================================
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsList, BsMusicNoteList, BsSearch, BsX, BsArrowRight } from "react-icons/bs";
import { FiHome, FiFileText, FiMusic, FiVideo, FiEdit } from "react-icons/fi";
import { Navbar, Nav, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

// ======================================================
// 🎵 COMPONENTE HEADER CON BÚSQUEDA INTEGRADA
// ======================================================
const Header = () => {
  // ======================================================
  // 🎯 ESTADOS DEL COMPONENTE
  // ======================================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Controla menú móvil
  const [searchQuery, setSearchQuery] = useState(""); // Término de búsqueda actual
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false); // Mostrar/ocultar sugerencias
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Estado de foco en búsqueda
  const [allSongs, setAllSongs] = useState([]); // Todas las canciones cargadas
  const [filteredSongs, setFilteredSongs] = useState([]); // Canciones filtradas por búsqueda
  
  // ======================================================
  // 🎯 REFERENCIAS Y HOOKS
  // ======================================================
  const searchRef = useRef(null); // Referencia al contenedor de búsqueda
  const navigate = useNavigate(); // Hook de navegación de React Router

  // ======================================================
  // 📁 RUTAS DE ARCHIVOS JSON DE CANCIONES
  // ======================================================
  const jsonFiles = [
    "/data/listadocancionesalegondramusic.json",
    "/data/listadocancionesalmangopop.json",
    "/data/listadocancionescasamiento.json",
    "/data/listadochordscoverslatinos1.json",
    "/data/listadochordscoversnacionales1.json",
    "/data/listadochordscoversseleccionados1.json",
    "/data/listadochordscoversseleccionados2.json",
    "/data/listadochordscoversseleccionados3.json"
  ];

  // ======================================================
  // ⚡ EFECTO: CARGAR TODAS LAS CANCIONES AL INICIAR
  // ======================================================
  useEffect(() => {
    const loadAllSongs = async () => {
      try {
        // 📥 Cargar todos los archivos JSON en paralelo
        const responses = await Promise.all(
          jsonFiles.map(file => 
            fetch(file)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          )
        );

        // 🎵 Procesar y aplanar todas las canciones
        const songs = responses
          .filter(res => res !== null)
          .flatMap(data => {
            if (data.albums) return data.albums.flatMap(album => album.songs || []);
            if (data.songs) return data.songs;
            return [];
          })
          .filter(song => song && song.title);

        setAllSongs(songs);
      } catch (error) {
        console.error("Error cargando canciones para búsqueda:", error);
      }
    };

    loadAllSongs();
  }, []);

  // ======================================================
  // 🔍 EFECTO: FILTRAR CANCIONES SEGÚN TÉRMINO DE BÚSQUEDA
  // ======================================================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSongs([]);
      return;
    }

    const term = searchQuery.toLowerCase().trim();
    const filtered = allSongs.filter(song => {
      const title = song.title || "";
      const artist = song.artist || "";
      const key = song.key || "";
      return (
        title.toLowerCase().includes(term) || 
        artist.toLowerCase().includes(term) ||
        key.toLowerCase().includes(term)
      );
    });

    setFilteredSongs(filtered.slice(0, 5)); // 🔢 Mostrar solo 5 resultados
  }, [searchQuery, allSongs]);

  // ======================================================
  // 🖱️ EFECTO: CERRAR SUGERENCIAS AL CLIC FUERA DEL COMPONENTE
  // ======================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ======================================================
  // 🎯 FUNCIÓN: MANEJAR SELECCIÓN DE CANCIÓN EN BÚSQUEDA
  // ======================================================
  const handleSongSelect = (song) => {
    // 🔍 Buscar en qué biblioteca está la canción
    const findSongLibrary = async () => {
      for (const file of jsonFiles) {
        try {
          const response = await fetch(file);
          if (!response.ok) continue;
          
          const data = await response.json();
          let songsArray = [];
          
          if (data.albums) songsArray = data.albums.flatMap(album => album.songs || []);
          else if (data.songs) songsArray = data.songs;
          
          const foundSong = songsArray.find(s => s.file === song.file);
          if (foundSong) {
            const libraryId = getLibraryIdFromPath(file);
            // 🧭 Navegar al visualizador de acordes
            navigate(`/chords-viewer?library=${libraryId}&song=${encodeURIComponent(song.file)}`);
            setSearchQuery("");
            setShowSearchSuggestions(false);
            return;
          }
        } catch (error) {
          console.warn(`Error buscando en ${file}:`, error);
        }
      }
    };

    findSongLibrary();
  };

  // ======================================================
  // 🆔 FUNCIÓN: OBTENER ID DE BIBLIOTECA DESDE RUTA DE ARCHIVO
  // ======================================================
  const getLibraryIdFromPath = (path) => {
    const filename = path.split('/').pop().replace('.json', '');
    const libraryMap = {
      'listadocancionesalegondramusic': 'alegondra',
      'listadocancionesalmangopop': 'almangopop',
      'listadocancionescasamiento': 'casamiento',
      'listadochordscoversseleccionados1': 'covers1',
      'listadochordscoversseleccionados2': 'covers2',
      'listadochordscoversseleccionados3': 'covers3',
      'listadochordscoverslatinos1': 'coverslatinos1',
      'listadochordscoversnacionales1': 'coversnacionales1'
    };
    
    return libraryMap[filename] || 'covers1';
  };

  // ======================================================
  // 🗑️ FUNCIÓN: LIMPIAR TÉRMINO DE BÚSQUEDA
  // ======================================================
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchSuggestions(false);
  };

  // ======================================================
  // 👁️ FUNCIÓN: MANEJAR FOCO EN CAMPO DE BÚSQUEDA
  // ======================================================
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSearchSuggestions(true);
  };

  // ======================================================
  // 🎵 ICONOS PARA LA NAVEGACIÓN
  // ======================================================
  const icons = {
    home: <FiHome size={14} />,
    chords: <FiMusic size={14} />,
    formateo: <FiFileText size={14} />,
    video: <FiVideo size={14} />,
    format: <FiEdit size={14} />,
    library: <BsMusicNoteList size={14} />
  };

  // ======================================================
  // 💬 TEXTO PARA TOOLTIPS DE NAVEGACIÓN
  // ======================================================
  const tooltips = {
    biblioteca: "Biblioteca completa de canciones",
    chords: "Visualizador de Cancioneros",
    player: "Reproductor con pistas",
    library: "Combinaciones de Acordes", 
    format: "Formateo de Partituras"
  };

  // ======================================================
  // 📱 MANEJADORES DE INTERACCIÓN MÓVIL
  // ======================================================
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobile = () => setIsMobileMenuOpen(false);
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  // ======================================================
  // 🎨 RENDERIZADO DEL COMPONENTE
  // ======================================================
  return (
    <header className="header">
      <Navbar expand="lg" className="navbar">
        <Container className="header-container">

          {/* 🏷️ LOGO Y MARCA */}
          <Navbar.Brand as={Link} to="/" className="logo-container">
            <img
              src="/img/02-logos/logo-formateo-chords.png"
              alt="Rockola Cancioneros"
              className="logoHeader"
            />
            <div className="brand-text">
              <span className="brand-name">ROCKOLA</span>
              <span className="brand-subtitle">CANCIONEROS</span>
            </div>
          </Navbar.Brand>

          {/* 🔍 BARRA DE BÚSQUEDA INTEGRADA */}
          <div className="header-search-container" ref={searchRef}>
            <div className="header-search-wrapper">
              <BsSearch className="header-search-icon" />
              <input
                type="text"
                placeholder="Buscar canción..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={handleSearchFocus}
                className="header-search-input"
              />
              {searchQuery && (
                <button className="header-clear-btn" onClick={clearSearch}>
                  <BsX />
                </button>
              )}
            </div>

            {/* 📋 SUGERENCIAS DE BÚSQUEDA (UNA SOLA LÍNEA) */}
            {showSearchSuggestions && searchQuery && filteredSongs.length > 0 && (
              <div className="header-search-suggestions">
                <div className="suggestions-header">
                  <span>Resultados de búsqueda</span>
                  <button 
                    className="close-suggestions-btn"
                    onClick={() => setShowSearchSuggestions(false)}
                  >
                    <BsX />
                  </button>
                </div>
                
                <div className="suggestions-list">
                  {filteredSongs.map((song) => (
                    <div
                      key={song.id || song.title}
                      className="suggestion-item"
                      onClick={() => handleSongSelect(song)}
                    >
                      <div className="suggestion-info-single-line">
                        <span className="suggestion-artist">{song.artist || 'Artista desconocido'}</span>
                        <span className="suggestion-separator"> - </span>
                        <span className="suggestion-title">{song.title}</span>
                      </div>
                      <BsArrowRight className="suggestion-arrow" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 📱 NAVEGACIÓN PRINCIPAL */}
          <div className="nav-section">
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler">
              <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav" className={isMobileMenuOpen ? "show" : ""}>
              <Nav className="nav-primary">

                {/* 📚 BIBLIOTECA CANCIONEROS */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.biblioteca)}>
                  <Nav.Link as={Link} to="/biblioteca-cancioneros" className="nav-link" onClick={closeMobile}>
                    {icons.library} 
                    <span className="nav-text-full">Biblioteca</span>
                    <span className="nav-text-short">Biblio</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* 🎼 VISUALIZADOR CHORDS */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.chords)}>
                  <Nav.Link as={Link} to="/chords-viewer" className="nav-link" onClick={closeMobile}>
                    {icons.chords} 
                    <span className="nav-text-full">Chords</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* ▶️ REPRODUCTOR PISTAS */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.player)}>
                  <Nav.Link as={Link} to="/player" className="nav-link" onClick={closeMobile}>
                    {icons.video} 
                    <span className="nav-text-full">Pistas</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* 🎵 TEORÍA MUSICAL */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.library)}>
                  <Nav.Link as={Link} to="/formateo-chords" className="nav-link" onClick={closeMobile}>
                    {icons.formateo} 
                    <span className="nav-text-full">Teoría</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* 📝 FORMATEO */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.format)}>
                  <Nav.Link as={Link} to="/chords-format" className="nav-link" onClick={closeMobile}>
                    {icons.format} 
                    <span className="nav-text-full">Formateo</span>
                  </Nav.Link>
                </OverlayTrigger>

              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;