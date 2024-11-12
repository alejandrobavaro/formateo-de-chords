import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./SesionAuthContext";
import {
  BsFillPersonPlusFill,
  BsBoxArrowRight,
  BsList,
  BsClock,
} from "react-icons/bs";
import {
  FiCreditCard,
  FiBriefcase,
  FiHelpCircle,
  FiHome,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import HeaderNotificaciones from "./TareasNotificaciones";
import "../assets/scss/_03-Componentes/_Header.scss";
import { useTareasNotificaciones } from "./TareasNotificacionesContext";
import HeaderSearchBar from "./HeaderSearchBar"; // Importamos el componente HeaderSearchBar

const Header = () => {
  const { state, dispatch } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { notifications } = useTareasNotificaciones(); // Obtener notificaciones desde el contexto
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda

  // Iconos fijos para cada botón
  const icons = {
    home: <FiHome size={20} color="gray" />,
    contacto: <FiPhone size={20} color="gray" />,
    notas: <FiMessageCircle size={20} color="gray" />,
    tareas: <BsClock size={20} color="gray" />,
    ayuda: <FiHelpCircle size={20} color="gray" />,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getFormattedDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = today.toLocaleDateString("es-ES", options);
    const [weekday, dayMonthYear] = formattedDate.split(", ");
    return { weekday, dayMonthYear };
  };

  const { weekday, dayMonthYear } = getFormattedDate();

  return (
    <header className="header">
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo-container">
            <img
              src="/img/02-logos/logo-formateo-chords.png"
              alt="Logo"
              className="logoHeader"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
          </Navbar.Toggle>
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`${isMobileMenuOpen ? "show" : ""}`}
          >
            <Nav className="mr-auto">
              <Nav.Link
                className="nav-link home-link"
                as={Link}
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {icons.home} HOME
              </Nav.Link>

              {/* Dropdown CHORDS */}
              <Dropdown as={Nav.Item} className="nav-link">
                <Dropdown.Toggle as={Nav.Link} className="menu-dropdown-toggle">
                  {icons.notas} CHORDS
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>{icons.notas} Chords</Dropdown.Header>
                  <Dropdown.Item
                    as={Link}
                    to="/chordsalmango"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Chords Almango
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/chordscovers"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Chords Covers
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Dropdown Formateo */}
              <Dropdown as={Nav.Item} className="nav-link">
                <Dropdown.Toggle as={Nav.Link} className="menu-dropdown-toggle">
                  {icons.notas} FORMATEO
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>Formateo:</Dropdown.Header>
                  <Dropdown.Item
                    as={Link}
                    to="/formateo-chords"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Formateo de Chords
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/formateo-listas"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Formateo de Listas
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/formateo-rider-audio"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Formateo de Rider Audio
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/formateo-rider-video"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Formateo de Rider Video
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/formateo-gasetilla"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Formateo de Gasetilla
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/pedidos-fecha"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pedidos de Fecha
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Item className="searchbar-container">
                <HeaderSearchBar
                  categories={["Chords", "Formateo", "Tareas"]}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onCategoryChange={(category) => console.log("Category changed:", category)}
                />
              </Nav.Item>


              {/* Dropdown para TAREAS con íconos y notificaciones */}
              <Dropdown as={Nav.Item} className="nav-link tareas-link">
                <Dropdown.Toggle
                  as={Nav.Link}
                  className="tareas-dropdown-toggle"
                >
                  {icons.tareas} TAREAS
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HeaderNotificaciones reminderCount={notifications.today} />{" "}
                    Notificaciones
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/MainTemporizadorTareas"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {icons.tareas} Temporizador
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/to-do"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {icons.tareas} To-Do
                  </Dropdown.Item>

                  {/* Aquí agregamos el botón de NOTAS dentro del Dropdown */}
                  <Dropdown.Item
                    as={Link}
                    to="/main-notas"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {icons.notas} Notas
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Dropdown para OTROS */}
              <Dropdown as={Nav.Item} className="nav-link">
                <Dropdown.Toggle as={Nav.Link} className="menu-dropdown-toggle">
                  {icons.ayuda} CONTACTO
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to="/contacto"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {icons.contacto} Contacto
                  </Dropdown.Item>

                  <Dropdown.Item
                    as={Link}
                    to="/ayuda"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {icons.ayuda} Ayuda
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>

            <Nav className="ml-auto">
           
           
            <Navbar.Brand as={Link} to="/" className="logo-container">
                <img
                  src="/img/02-logos/logo-formateo-chords2.png"
                  alt="Logo"
                  className="logoHeader"
                />
              </Navbar.Brand>

              <Nav.Item className="auth-buttons-container">
                {state.isAuthenticated ? (
                  <div className="auth-welcome-container">
                    <div className="auth-welcome">
                      <span>Hola,</span>
                      {""}
                      <span>{state.user.email.split("@")[0]}</span>
                    </div>
                    <Link
                      className="nav-linkHeader auth-link logout-link"
                      to="/logout"
                      onClick={() => {
                        dispatch({ type: "LOGOUT" });
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <BsBoxArrowRight className="auth-icon" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link className="nav-linkHeader auth-link" to="/login">
                      <BsFillPersonPlusFill className="auth-icon" />
                    </Link>
                    <hr className="auth-divider" />
                    <Link className="nav-linkHeader auth-link" to="/register">
                      Regístrate
                    </Link>
                  </>
                )}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
