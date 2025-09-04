// ======================================================
// IMPORTACIONES
// ======================================================
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsList } from "react-icons/bs";
import { FiHome, FiFileText, FiMusic, FiVideo, FiEdit } from "react-icons/fi";
import { Navbar, Nav, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

// ======================================================
// COMPONENTE HEADER SIMPLIFICADO
// Solo navegación, sin controles de búsqueda o cancioneros
// ======================================================
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mapa de iconos para navegación
  const icons = {
    home: <FiHome size={16} />,
    chords: <FiMusic size={16} />,
    formateo: <FiFileText size={16} />,
    video: <FiVideo size={16} />,
    format: <FiEdit size={16} />,
  };

  // Textos para tooltips
  const tooltips = {
    chords: "Visualizador de Cancioneros con Chords",
    player: "Reproductor con pistas y chords para practicar",
    library: "Consulta el archivo de todos las combinaciones de Acordes posibles",
    format: "Herramienta para formatear Partituras o Chords a Hoja A4 o Tablet"
  };

  // Manejadores de menú móvil
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobile = () => setIsMobileMenuOpen(false);
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  return (
    <header className="header">
      <Navbar expand="lg" className="navbar">
        <Container className="header-container">

          {/* Logo y marca */}
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

          {/* Navegación */}
          <div className="nav-section">
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" aria-expanded={isMobileMenuOpen}>
              <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav" className={`navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
              <Nav className="nav-primary">

                {/* Enlaces de navegación */}
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
  );
};

export default Header;