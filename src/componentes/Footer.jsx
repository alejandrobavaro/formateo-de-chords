import React from "react";
import "../assets/scss/_03-Componentes/_Footer.scss";

function Footer() {
  return (
    <footer className="footer-container">
      {/* Línea divisoria superior */}
      <hr className="footer-divider" />
      
      {/* Contenedor principal del footer */}
      <div className="footer-content">
        
        {/* Sección de logos y redes sociales - EN UNA SOLA LÍNEA */}
        <div className="footer-main-section">
          
          {/* Logo izquierdo */}
          <div className="footer-logo-section">
            <a href="#" className="footer-logo-link">
              <img
                className="footer-logo"
                src="/img/02-logos/logo-formateo-chords2.png"
                alt="Formateo Chords Logo 2"
              />
            </a>
          </div>

          {/* Redes sociales en el centro - COMPACTO */}
          <div className="footer-social-section">
            <div className="social-links">
              {/* Enlaces de redes sociales solo con iconos */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram social-icon" />
              </a>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="YouTube"
              >
                <i className="bi bi-youtube social-icon" />
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook social-icon" />
              </a>

              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <i className="bi bi-twitter social-icon" />
              </a>
            </div>
          </div>

          {/* Logo derecho */}
          <div className="footer-logo-section">
            <a href="#" className="footer-logo-link">
              <img
                className="footer-logo"
                src="/img/02-logos/logo-formateo-chords.png"
                alt="Formateo Chords Logo"
              />
            </a>
          </div>
        </div>

        {/* Línea divisoria inferior */}
        <hr className="footer-divider" />

        {/* Sección de derechos de autor y marca - COMPACTA */}
        <div className="footer-copyright">
          <a 
            href="https://alejandrobavaro.github.io/gondraworld-dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="copyright-link"
          >
            <div className="copyright-content">
              {/* Icono de brillo izquierdo */}
              <i className="bi bi-brilliance copyright-icon" />
              
              {/* Texto de derechos de autor */}
              <span className="copyright-text">Gondra World Dev</span>
              
              {/* Icono de brillo derecho */}
              <i className="bi bi-brilliance copyright-icon" />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;