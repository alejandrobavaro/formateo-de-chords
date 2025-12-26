// ======================================================
// HEADER.JSX - VERSIÓN ACTUALIZADA CON RUTAS CORRECTAS
// ======================================================

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { 
  BsList, 
  BsSearch, 
  BsX, 
  BsArrowRight, 
  BsStar, 
  BsClock,
  BsMusicNoteBeamed,
  BsPlayCircle,
  BsFilm,
  BsBook,
  BsEnvelope,
  BsHouse,
  BsGear
} from "react-icons/bs";
import { useSearch } from './SearchContext';
import "../assets/scss/_03-Componentes/_Header.scss";

// ======================================================
// COMPONENTE PRINCIPAL HEADER
// ======================================================
const Header = () => {
  
  // ======================================================
  // ESTADOS DEL COMPONENTE
  // ======================================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  // ======================================================
  // REFERENCIAS Y HOOKS
  // ======================================================
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { searchSongs, getSongNavigationPath, isLoading } = useSearch();
  const [searchResults, setSearchResults] = useState([]);

  // ======================================================
  // ELEMENTOS DEL MENÚ PRINCIPAL (CON RUTAS CORRECTAS)
  // ======================================================
  const menuItems = [
    { 
      title: "Inicio", 
      path: "/", 
      icon: <BsHouse />, 
      tooltip: "Página principal"
    },
    { 
      title: "Música", 
      path: "/musica", 
      icon: <BsMusicNoteBeamed />, 
      tooltip: "Reproductor con visualizador de acordes",
      highlight: true
    },
    { 
      title: "Videos", 
      path: "/Videos", // ✅ Ruta correcta que apunta a ReproductorVideo.jsx
      icon: <BsFilm />, 
      tooltip: "Reproductor de video musical"
    },
    { 
      title: "Pistas", 
      path: "#", 
      icon: <BsPlayCircle />, 
      tooltip: "Componente en desarrollo (próximamente)",
      disabled: true
    },
    { 
      title: "Teoría", 
      path: "/formateo-chords", 
      icon: <BsBook />, 
      tooltip: "Teoría musical"
    },
    { 
      title: "Formateo", 
      path: "/chords-format", 
      icon: <BsGear />, 
      tooltip: "Formateo de partituras"
    },
    { 
      title: "Contacto", 
      path: "/contacto", 
      icon: <BsEnvelope />, 
      tooltip: "Contacto"
    },
  ];

  // ======================================================
  // EFECTO: CARGAR BÚSQUEDAS RECIENTES
  // ======================================================
  useEffect(() => {
    const saved = localStorage.getItem('recentSongSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 3));
    }
  }, []);

  // ======================================================
  // EFECTO: BÚSQUEDA EN TIEMPO REAL
  // ======================================================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = searchSongs(searchQuery);
    setSearchResults(results.slice(0, 5));
  }, [searchQuery, searchSongs]);

  // ======================================================
  // FUNCIÓN: GUARDAR BÚSQUEDA RECIENTE
  // ======================================================
  const saveRecentSearch = (song) => {
    const searches = JSON.parse(localStorage.getItem('recentSongSearches') || '[]');
    const filtered = searches.filter(s => s.id !== song.id);
    const updated = [song, ...filtered].slice(0, 5);
    localStorage.setItem('recentSongSearches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  // ======================================================
  // FUNCIÓN: MANEJAR SELECCIÓN DE CANCIÓN
  // ======================================================
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

  // ======================================================
  // FUNCIÓN: LIMPIAR BÚSQUEDA
  // ======================================================
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchSuggestions(false);
  };

  // ======================================================
  // FUNCIÓN: CERRAR MENÚ AL NAVEGAR
  // ======================================================
  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  // ======================================================
  // FUNCIÓN: MANEJAR CLIC EN BOTÓN DESHABILITADO
  // ======================================================
  const handleDisabledClick = (e, item) => {
    e.preventDefault();
    alert(`${item.title} está en desarrollo. Próximamente disponible.`);
  };

  // ======================================================
  // FUNCIÓN: RENDERIZAR SUGERENCIAS COMPACTAS
  // ======================================================
  const renderSuggestions = () => {
    if (!showSearchSuggestions) return null;

    return (
      <div className="header-search-suggestions-compact">
        <div className="suggestions-header-compact">
          <span className="suggestions-title">
            {searchQuery ? "Resultados" : "Recientes"}
          </span>
          <button 
            className="suggestions-close"
            onClick={() => setShowSearchSuggestions(false)}
            title="Cerrar"
          >
            <BsX size={12} />
          </button>
        </div>
        
        <div className="suggestions-list-compact">
          {/* BÚSQUEDAS RECIENTES */}
          {!searchQuery && recentSearches.map((song, index) => (
            <div
              key={`recent-${index}`}
              className="suggestion-item-compact"
              onClick={() => handleSongSelect(song)}
            >
              <BsClock size={10} className="suggestion-icon" />
              <span className="suggestion-text">{song.title}</span>
              <BsArrowRight size={10} className="suggestion-arrow" />
            </div>
          ))}
          
          {/* RESULTADOS DE BÚSQUEDA */}
          {searchQuery && searchResults.map((song, index) => (
            <div
              key={song.id || index}
              className="suggestion-item-compact"
              onClick={() => handleSongSelect(song)}
            >
              {index === 0 && <BsStar size={10} className="suggestion-icon" />}
              <span className="suggestion-text">
                {song.title.length > 25 ? `${song.title.substring(0, 25)}...` : song.title}
              </span>
              <BsArrowRight size={10} className="suggestion-arrow" />
            </div>
          ))}
          
          {/* SIN RESULTADOS */}
          {searchQuery && searchResults.length === 0 && (
            <div className="no-results-compact">
              No hay resultados para "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    );
  };

  // ======================================================
  // RENDER PRINCIPAL - DISEÑO COMPACTO
  // ======================================================
  return (
    <header className="header-compact">
      <div className="header-container-compact">
        
        {/* ====================================================== */}
        {/* LOGO Y MARCA - VERSIÓN COMPACTA */}
        {/* ====================================================== */}
        <Link to="/" className="logo-compact" onClick={handleNavigation}>
          <img
            src="/img/02-logos/logo-formateo-chords.png"
            alt="Rockola Cancioneros"
            className="logo-image-compact"
          />
          <div className="logo-text-compact">
            <span className="logo-main">ROCKOLA</span>
            <span className="logo-sub">CANCIONEROS</span>
          </div>
        </Link>

        {/* ====================================================== */}
        {/* BARRA DE BÚSQUEDA COMPACTA */}
        {/* ====================================================== */}
        <div className="search-container-compact" ref={searchRef}>
          <div className="search-wrapper-compact">
            <BsSearch className="search-icon-compact" size={14} />
            <input
              type="text"
              placeholder="Buscar canción..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              className="search-input-compact"
            />
            {isLoading && (
              <div className="search-loading-compact">
                <div className="loading-dot"></div>
              </div>
            )}
            {searchQuery && !isLoading && (
              <button className="search-clear-compact" onClick={clearSearch}>
                <BsX size={12} />
              </button>
            )}
          </div>
          {renderSuggestions()}
        </div>

        {/* ====================================================== */}
        {/* MENÚ DE NAVEGACIÓN COMPACTO */}
        {/* ====================================================== */}
        <nav className={`nav-compact ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          
          {/* BOTÓN TOGGLE PARA MÓVIL */}
          <button 
            className="nav-toggle-compact"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <BsList size={20} />
          </button>
          
          {/* LISTA DE ELEMENTOS DEL MENÚ */}
          <div className="nav-items-compact">
            {menuItems.map((item, index) => (
              item.disabled ? (
                <button
                  key={index}
                  className="nav-item-compact nav-item-disabled"
                  onClick={(e) => handleDisabledClick(e, item)}
                  title={item.tooltip}
                >
                  <span className="nav-icon-compact">{item.icon}</span>
                  <span className="nav-text-compact">{item.title}</span>
                  <span className="nav-badge">Pronto</span>
                </button>
              ) : (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-item-compact ${isActive ? 'nav-item-active' : ''} ${item.highlight ? 'nav-item-highlight' : ''}`
                  }
                  onClick={handleNavigation}
                  title={item.tooltip}
                >
                  <span className="nav-icon-compact">{item.icon}</span>
                  <span className="nav-text-compact">{item.title}</span>
                </NavLink>
              )
            ))}
          </div>
          
        </nav>

      </div>
    </header>
  );
};

export default Header;