// Importación de React y hooks necesarios
import React, { useState } from "react";

// Importación de componentes de enrutamiento de React Router
import { Link } from "react-router-dom";

// Importación de iconos de React Icons
import { BsList, BsSearch } from "react-icons/bs";
import { FiHome, FiPhone, FiHelpCircle, FiFileText, FiMusic } from "react-icons/fi";

// Importación de componentes de Bootstrap
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";

// Importación del componente de barra de búsqueda personalizado
import HeaderSearchBar from "./HeaderSearchBar";

// Importación de estilos SCSS
import "../assets/scss/_03-Componentes/_Header.scss";

// Componente principal del Header
const Header = () => {
  // Estado para controlar la visibilidad del menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado para almacenar la consulta de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  // Objeto que contiene los iconos utilizados en la navegación
  // Cada icono se importa de react-icons y se configura con tamaño específico
  const icons = {
    home: <FiHome size={16} />, // Icono de inicio
    chords: <FiMusic size={16} />, // Icono de acordes musicales
    formateo: <FiFileText size={16} />, // Icono de formateo de texto
    contacto: <FiPhone size={16} />, // Icono de contacto
    ayuda: <FiHelpCircle size={16} />, // Icono de ayuda
    search: <BsSearch size={14} /> // Icono de búsqueda
  };

  // Función para alternar la visibilidad del menú móvil
  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    // Contenedor principal del header
    <header className="header">
      {/* Componente Navbar de Bootstrap con expansión en pantallas grandes */}
      <Navbar expand="lg" className="navbar">
        {/* Contenedor de Bootstrap para estructura responsive */}
        <Container className="header-container">
          
          {/* SECCIÓN 1: LOGO Y MARCA */}
          {/* Enlace que lleva a la página de inicio */}
          <Navbar.Brand as={Link} to="/" className="logo-container">
            {/* Imagen del logo - se carga desde la carpeta pública /img */}
            <img
              src="/img/02-logos/logo-formateo-chords.png"
              alt="Formateo Chords - Herramientas para músicos"
              className="logoHeader"
            />
            {/* Contenedor de texto de la marca */}
            <div className="brand-text">
              {/* Nombre principal de la marca */}
              <span className="brand-name">FORMATEO</span>
              {/* Subtítulo de la marca */}
              <span className="brand-subtitle">CHORDS</span>
            </div>
          </Navbar.Brand>

          {/* SECCIÓN 2: BARRA DE BÚSQUEDA */}
          {/* Contenedor para la barra de búsqueda - ocupa espacio central */}
          <div className="search-section">
            {/* Componente personalizado de barra de búsqueda */}
            <HeaderSearchBar
              searchQuery={searchQuery} // Estado actual de la búsqueda
              setSearchQuery={setSearchQuery} // Función para actualizar la búsqueda
              placeholder="Buscar acordes, canciones..." // Texto placeholder
            />
          </div>

          {/* SECCIÓN 3: NAVEGACIÓN Y MENÚ */}
          <div className="nav-section">
            {/* Botón toggle para menú móvil - visible solo en pantallas pequeñas */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler">
              {/* Icono de lista para el botón del menú móvil */}
              <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
            </Navbar.Toggle>
            
            {/* Contenedor colapsable del menú de navegación */}
            <Navbar.Collapse 
              id="basic-navbar-nav" 
              className={`navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}
            >
              {/* Lista de navegación principal */}
              <Nav className="nav-primary">
                
                {/* Enlace de Inicio */}
                {/* <Nav.Link 
                  as={Link} 
                  to="/" 
                  className="nav-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {icons.home} Inicio
                </Nav.Link> */}

                {/* Dropdown de Acordes */}
                <Dropdown as={Nav.Item} className="nav-item">
                  {/* Toggle del dropdown */}
                  <Dropdown.Toggle as={Nav.Link} className="nav-link dropdown-toggle">
                    {icons.chords} Acordes
                  </Dropdown.Toggle>
                  {/* Menú desplegable con opciones */}
                  <Dropdown.Menu className="dropdown-menu">
              
                    {/* Opción: Chords Covers - RUTA CORREGIDA */}
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

                {/* Enlace directo a Formateo */}
                <Nav.Link 
                  as={Link} 
                  to="/formateo-chords" 
                  className="nav-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {icons.formateo} Formateo
                </Nav.Link>

                {/* Enlace directo a Contacto */}
                <Nav.Link 
                  as={Link} 
                  to="/contacto" 
                  className="nav-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {icons.contacto} Contacto
                </Nav.Link>

                {/* Enlace directo a Ayuda */}
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

// Exportación del componente para su uso en otras partes de la aplicación
export default Header;