import React, { useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { BsList } from "react-icons/bs";
import { FiHome, FiFileText, FiMusic, FiVideo, FiSearch, FiEdit } from "react-icons/fi";
import { Navbar, Nav, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

const HeaderSearchContext = createContext(null);
export const useHeaderSearch = () => useContext(HeaderSearchContext);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const icons = {
    home: <FiHome size={16} />,
    chords: <FiMusic size={16} />,
    formateo: <FiFileText size={16} />,
    video: <FiVideo size={16} />,
    format: <FiEdit size={16} />,
  };

  const tooltips = {
    chords: "Visualizador de Cancioneros con Chords",
    player: "Reproductor con pistas y chords para practicar",
    library: "Consulta el archivo de todos las combinaciones de Acordes posibles",
    format: "Herramienta para formatear Partituras o Chords a Hoja A4 o Tablet"
  };

  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobile = () => setIsMobileMenuOpen(false);
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  return (
    <HeaderSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <header className="header">
        <Navbar expand="lg" className="navbar">
          <Container className="header-container">

            <Navbar.Brand as={Link} to="/" className="logo-container" aria-label="Ir a inicio">
              <img
                src="/img/02-logos/logo-formateo-chords.png"
                alt="Formateo Chords - Herramientas para músicos"
                className="logoHeader"
              />
              <div className="brand-text">
                <span className="brand-name">ROCKOLA</span>
                <span className="brand-subtitle">CANCIONEROS</span>
              </div>
            </Navbar.Brand>

            <div className="search-section" role="search">
              <div className="searchbar">
                <input
                  type="text"
                  className="searchbar-input"
                  placeholder="Buscar en Rockola"
                  aria-label="Buscar acordes o canciones"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="searchbar-icon" aria-hidden="true" />
              </div>
            </div>

            <div className="nav-section">
              <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" aria-expanded={isMobileMenuOpen}>
                <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
              </Navbar.Toggle>

              <Navbar.Collapse id="basic-navbar-nav" className={`navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
                <Nav className="nav-primary">

                  <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.chords)}>
                    <Nav.Link as={Link} to="/chords-viewer" className="nav-link" onClick={closeMobile}>
                      {icons.chords} <span className="nav-text-full">Cancioneros</span>
                    </Nav.Link>
                  </OverlayTrigger>

                  <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.player)}>
                    <Nav.Link as={Link} to="/player" className="nav-link" onClick={closeMobile}>
                      {icons.video} <span className="nav-text-full">Reproductor</span>
                    </Nav.Link>
                  </OverlayTrigger>

                  <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.library)}>
                    <Nav.Link as={Link} to="/formateo-chords" className="nav-link" onClick={closeMobile}>
                      {icons.formateo} <span className="nav-text-full">Biblioteca</span>
                    </Nav.Link>
                  </OverlayTrigger>

                  <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.format)}>
                    <Nav.Link as={Link} to="/chords-format" className="nav-link" onClick={closeMobile}>
                      {icons.format} <span className="nav-text-full">Formateo</span>
                    </Nav.Link>
                  </OverlayTrigger>

                </Nav>
              </Navbar.Collapse>
            </div>
          </Container>
        </Navbar>
      </header>
    </HeaderSearchContext.Provider>
  );
};

export default Header;
