// ======================================================
// IMPORTACIONES
// ======================================================
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsList, BsMusicNoteList } from "react-icons/bs";
import { FiHome, FiFileText, FiMusic, FiVideo, FiEdit } from "react-icons/fi";
import { Navbar, Nav, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

// ======================================================
// COMPONENTE HEADER OPTIMIZADO
// ======================================================
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Iconos optimizados
  const icons = {
    home: <FiHome size={14} />,
    chords: <FiMusic size={14} />,
    formateo: <FiFileText size={14} />,
    video: <FiVideo size={14} />,
    format: <FiEdit size={14} />,
    library: <BsMusicNoteList size={14} />
  };

  // Tooltips concisos
  const tooltips = {
    biblioteca: "Biblioteca completa de canciones",
    chords: "Visualizador de Cancioneros",
    player: "Reproductor con pistas",
    library: "Combinaciones de Acordes", 
    format: "Formateo de Partituras"
  };

  // Manejadores
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobile = () => setIsMobileMenuOpen(false);
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  return (
    <header className="header">
      <Navbar expand="lg" className="navbar">
        <Container className="header-container">

          {/* Logo compacto */}
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

          {/* Navegación optimizada */}
          <div className="nav-section">
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler">
              <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav" className={isMobileMenuOpen ? "show" : ""}>
              <Nav className="nav-primary">

                {/* Biblioteca Cancioneros */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.biblioteca)}>
                  <Nav.Link as={Link} to="/biblioteca-cancioneros" className="nav-link" onClick={closeMobile}>
                    {icons.library} 
                    <span className="nav-text-full">Biblioteca</span>
                    <span className="nav-text-short">Biblio</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* Visualizador Chords */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.chords)}>
                  <Nav.Link as={Link} to="/chords-viewer" className="nav-link" onClick={closeMobile}>
                    {icons.chords} 
                    <span className="nav-text-full">Chords</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* Reproductor Pistas */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.player)}>
                  <Nav.Link as={Link} to="/player" className="nav-link" onClick={closeMobile}>
                    {icons.video} 
                    <span className="nav-text-full">Pistas</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* Teoría Musical */}
                <OverlayTrigger placement="bottom" overlay={renderTooltip(tooltips.library)}>
                  <Nav.Link as={Link} to="/formateo-chords" className="nav-link" onClick={closeMobile}>
                    {icons.formateo} 
                    <span className="nav-text-full">Teoría</span>
                  </Nav.Link>
                </OverlayTrigger>

                {/* Formateo */}
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