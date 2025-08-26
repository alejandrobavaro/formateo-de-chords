import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsList } from "react-icons/bs";
import { FiHome, FiPhone, FiHelpCircle, FiFileText, FiMusic } from "react-icons/fi";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import HeaderSearchBar from "./ChordsViewer/HeaderSearchBar"; // Corregida la ruta
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const icons = {
    home: <FiHome size={16} />,
    chords: <FiMusic size={16} />,
    formateo: <FiFileText size={16} />,
    contacto: <FiPhone size={16} />,
    ayuda: <FiHelpCircle size={16} />,
  };

  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="header">
      <Navbar expand="lg" className="navbar">
        <Container className="header-container">
          <Navbar.Brand as={Link} to="/" className="logo-container">
            <img
              src="/img/02-logos/logo-formateo-chords.png"
              alt="Formateo Chords - Herramientas para músicos"
              className="logoHeader"
            />
            <div className="brand-text">
              <span className="brand-name">FORMATEO</span>
              <span className="brand-subtitle">CHORDS</span>
            </div>
          </Navbar.Brand>
          <div className="search-section">
            <HeaderSearchBar placeholder="Buscar acordes, canciones..." />
          </div>
          <div className="nav-section">
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler">
              <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
            </Navbar.Toggle>
            <Navbar.Collapse
              id="basic-navbar-nav"
              className={`navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}
            >
              <Nav className="nav-primary">
                <Dropdown as={Nav.Item} className="nav-item">
                  <Dropdown.Toggle as={Nav.Link} className="nav-link dropdown-toggle">
                    {icons.chords} Acordes
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item
                      as={Link}
                      to="/chords-viewer"
                      className="dropdown-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Chords Covers
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Nav.Link
                  as={Link}
                  to="/formateo-chords"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {icons.formateo} Formateo
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contacto"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {icons.contacto} Contacto
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/ayuda"
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {icons.ayuda} Ayuda
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;