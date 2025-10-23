// src/componentes/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsList, BsMusicNoteList, BsSearch, BsX, BsArrowRight, BsStar, BsClock } from "react-icons/bs";
import { FiHome, FiFileText, FiMusic, FiVideo, FiEdit } from "react-icons/fi";
import { Navbar, Nav, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useSearch } from './SearchContext';
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  // ESTADOS DEL COMPONENTE
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  // REFERENCIAS Y HOOKS
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  // USAR EL CONTEXTO CENTRALIZADO
  const { searchSongs, getSongNavigationPath, isLoading } = useSearch();
  
  const [searchResults, setSearchResults] = useState([]);

  // CARGAR BÚSQUEDAS RECIENTES DESDE LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem('recentSongSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // GUARDAR BÚSQUEDA RECIENTE
  const saveRecentSearch = (song) => {
    const searches = JSON.parse(localStorage.getItem('recentSongSearches') || '[]');
    
    // EVITAR DUPLICADOS
    const filtered = searches.filter(s => s.id !== song.id);
    const updated = [song, ...filtered].slice(0, 10);
    
    localStorage.setItem('recentSongSearches', JSON.stringify(updated));
    setRecentSearches(updated.slice(0, 5));
  };

  // BÚSQUEDA EN TIEMPO REAL
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = searchSongs(searchQuery);
    setSearchResults(results.slice(0, 8)); // MOSTRAR MÁXIMO 8 RESULTADOS
  }, [searchQuery, searchSongs]);

  // MANEJAR CLIC FUERA DEL COMPONENTE DE BÚSQUEDA
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

  // MANEJAR SELECCIÓN DE CANCIÓN
  const handleSongSelect = (song) => {
    saveRecentSearch(song);
    
    const path = getSongNavigationPath(song);
    if (path) {
      navigate(path);
      setSearchQuery("");
      setShowSearchSuggestions(false);
      setIsMobileMenuOpen(false);
    }
  };

  // LIMPIAR BÚSQUEDA
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchSuggestions(false);
  };

  // MANEJAR FOCO EN EL INPUT
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSearchSuggestions(true);
  };

  // RENDERIZAR SUGERENCIAS MEJORADAS
  const renderSuggestions = () => {
    if (!showSearchSuggestions || !searchQuery) return null;

    const hasResults = searchResults.length > 0;
    const hasRecentSearches = recentSearches.length > 0 && !searchQuery;

    if (!hasResults && !hasRecentSearches) return null;

    return (
      <div className="header-search-suggestions enhanced">
        <div className="suggestions-header">
          <span>
            {searchQuery 
              ? `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''}`
              : 'Búsquedas recientes'
            }
          </span>
          <button 
            className="close-suggestions-btn"
            onClick={() => setShowSearchSuggestions(false)}
          >
            <BsX />
          </button>
        </div>
        
        <div className="suggestions-list">
          {/* BÚSQUEDAS RECIENTES */}
          {!searchQuery && recentSearches.map((song) => (
            <div
              key={`recent-${song.id}`}
              className="suggestion-item recent"
              onClick={() => handleSongSelect(song)}
            >
              <BsClock className="recent-icon" />
              <div className="suggestion-info-single-line">
                <span className="suggestion-artist">{song.artist || 'Artista desconocido'}</span>
                <span className="suggestion-separator"> - </span>
                <span className="suggestion-title">{song.title}</span>
                <span className="suggestion-library">{song.libraryName}</span>
              </div>
              <BsArrowRight className="suggestion-arrow" />
            </div>
          ))}
          
          {/* RESULTADOS DE BÚSQUEDA */}
          {searchQuery && searchResults.map((song, index) => (
            <div
              key={song.id || index}
              className="suggestion-item"
              onClick={() => handleSongSelect(song)}
            >
              {index === 0 && <BsStar className="top-result-icon" />}
              <div className="suggestion-info-single-line">
                <span className="suggestion-artist">{song.artist || 'Artista desconocido'}</span>
                <span className="suggestion-separator"> - </span>
                <span className="suggestion-title">{song.title}</span>
                <span className="suggestion-key">{song.key}</span>
                <span className="suggestion-library">{song.libraryName}</span>
              </div>
              <BsArrowRight className="suggestion-arrow" />
            </div>
          ))}
          
          {/* SIN RESULTADOS */}
          {searchQuery && searchResults.length === 0 && (
            <div className="no-results-message">
              No se encontraron canciones para "{searchQuery}"
            </div>
          )}
        </div>
        
        {/* TIPS DE BÚSQUEDA */}
        <div className="search-tips">
          <span>💡 Tip: Busca por título, artista o tono musical</span>
        </div>
      </div>
    );
  };

  // ICONOS PARA LA NAVEGACIÓN
  const icons = {
    home: <FiHome size={14} />,
    chords: <FiMusic size={14} />,
    formateo: <FiFileText size={14} />,
    video: <FiVideo size={14} />,
    format: <FiEdit size={14} />,
    library: <BsMusicNoteList size={14} />
  };

  // TEXTO PARA TOOLTIPS
  const tooltips = {
    biblioteca: "Biblioteca completa de canciones",
    chords: "Visualizador de Cancioneros",
    player: "Reproductor con pistas",
    library: "Combinaciones de Acordes", 
    format: "Formateo de Partituras"
  };

  // MANEJADORES DE INTERACCIÓN MÓVIL
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobile = () => setIsMobileMenuOpen(false);
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  // RENDERIZADO DEL COMPONENTE
  return (
    <header className="header">
      <Navbar expand="lg" className="navbar">
        <Container className="header-container">

          {/* LOGO Y MARCA */}
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

          {/* BARRA DE BÚSQUEDA MEJORADA */}
          <div className="header-search-container" ref={searchRef}>
            <div className="header-search-wrapper enhanced">
              <BsSearch className="header-search-icon" />
              <input
                type="text"
                placeholder="Buscar canción, artista o tono..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={handleSearchFocus}
                className="header-search-input"
              />
              {isLoading && (
                <div className="search-loading-indicator">
                  <div className="loading-spinner"></div>
                </div>
              )}
              {searchQuery && !isLoading && (
                <button className="header-clear-btn" onClick={clearSearch}>
                  <BsX />
                </button>
              )}
            </div>

            {/* SUGERENCIAS MEJORADAS */}
            {renderSuggestions()}
          </div>

          {/* NAVEGACIÓN PRINCIPAL */}
          <div className="nav-section">
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler">
              <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav" className={isMobileMenuOpen ? "show" : ""}>
              <Nav className="nav-primary">

                {/* BIBLIOTECA CANCIONEROS */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.biblioteca)}>
                  <Nav.Link as={Link} to="/biblioteca-cancioneros" className="nav-link" onClick={closeMobile}>
                    {icons.library} 
                    <span className="nav-text-full">Biblioteca</span>
                    <span className="nav-text-short">Biblio</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* VISUALIZADOR CHORDS */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.chords)}>
                  <Nav.Link as={Link} to="/chords-viewer" className="nav-link" onClick={closeMobile}>
                    {icons.chords} 
                    <span className="nav-text-full">Chords</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* REPRODUCTOR PISTAS */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.player)}>
                  <Nav.Link as={Link} to="/player" className="nav-link" onClick={closeMobile}>
                    {icons.video} 
                    <span className="nav-text-full">Pistas</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* TEORÍA MUSICAL */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.library)}>
                  <Nav.Link as={Link} to="/formateo-chords" className="nav-link" onClick={closeMobile}>
                    {icons.formateo} 
                    <span className="nav-text-full">Teoría</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* FORMATEO */}
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