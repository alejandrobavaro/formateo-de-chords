import React from "react";
import "../assets/scss/_03-Componentes/_Footer.scss";

// Importa la tipografía desde Google Fonts
const fontImport = document.createElement("link");
fontImport.href =
  "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap";
fontImport.rel = "stylesheet";
document.head.appendChild(fontImport);

function Footer() {
  return (
    <footer className="footer-container">
      {/* Primera fila: Logos y enlaces sociales */}
      <div className="footer-grid">
        <div className="footer-content">
          <div className="footer-column">
            <a href="#" target="_blank">
              <img
                className="footer-logo"
                src="/img/02-logos/logo-formateo-chords.png"
                alt="Logo Izquierda"
              />
            </a>
          </div>

          <div className="footer-column">
            <div className="social-links">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram" /> Instagram
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-youtube" /> Youtube
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook" /> Facebook
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-twitter" /> X (Twitter)
              </a>
            </div>
          </div>

          <div className="footer-column">
            <a href="#" target="_blank">
              <img
                className="footer-logo"
                src="../../img/02-logos/logo-formateo-chords2.png"
                alt="Logo Derecha"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Segunda fila: Sección de derechos de autor */}
      <div className="trademarkFooter">
        <div className="textoMovimientoFooter tituloImportanteFooter4">
          <h3>
            <a
              href="https://alejandrobavaro.github.io/gondraworld-dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-brilliance" /> - Gondra World Dev -{" "}
              <i className="bi bi-brilliance" />
            </a>
          </h3>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
