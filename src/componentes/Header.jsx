import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/SesionAuthContext";
import { BsFillPersonPlusFill, BsBoxArrowRight, BsList } from "react-icons/bs";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const { state, dispatch } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="header encabezado">
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <BsList className="menu-icon" onClick={handleToggleMobileMenu} />
          </Navbar.Toggle>

          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}
          >
            <Navbar.Brand as={Link} to="#"    target="_blank" className="logo-container">
              <img
                src="/img/02-logos/logo-formateo-chords.png"
                alt="Logo"
                className="logoHeader"
              />
            </Navbar.Brand>

            <Nav className="ml-auto navbar-nav">
              <Nav.Link
                as="a" // Cambiar a un enlace estándar
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
              >
                INICIO
              </Nav.Link>

              {/* <Nav.Link
                as={Link}
                to="/personaliza"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PERSONALIZA
              </Nav.Link>  */}
            </Nav>

            {/* <Nav.Item className="auth-buttons-container">
              {state.isAuthenticated ? (
                <div className="auth-welcome-container">
                  <div className="auth-welcome">
                    <span>Hola,</span>
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
                  <Link
                    className="nav-linkHeader auth-link"
                    to="/register"
                  ></Link>
                </>
              )}
            </Nav.Item> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
