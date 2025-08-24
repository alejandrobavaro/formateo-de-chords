import React, { useEffect, useState } from "react";
import "../assets/scss/_03-Componentes/_Contacto.scss";

// Componente Contacto que combina logos, redes y formulario
const Contacto = () => {
  const [productos, setProductos] = useState([]);

  // Efecto para cargar productos (si aún es necesario)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/productos.json");
        const productos = await response.json();
        setProductos(productos);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="contacto-unificado-container">
      
      {/* SECCIÓN 1: LOGOS Y REDES SOCIALES */}
      <div className="contacto-logos-redes">
        
        {/* Contenedor de logos */}
        <div className="logos-container">
          
          {/* Logo principal */}
          <div className="logo-principal">
            <a href="#">
              <img
                alt="Logo Enganchados Covers"
                className="logo-img"
                src="/img/02-logos/logoenganchadoscovers4.png"
              />
            </a>
          </div>
          
          {/* Logos secundarios */}
          <div className="logos-secundarios">
            <a href="#">
              <img
                alt="Formateo Chords Logo 2"
                className="logo-secundario"
                src="/img/02-logos/logo-formateo-chords2.png"
              />
            </a>
            <a href="#">
              <img
                alt="Formateo Chords Logo"
                className="logo-secundario"
                src="/img/02-logos/logo-formateo-chords.png"
              />
            </a>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="redes-sociales">
          
          {/* Facebook */}
          <a
            href="https://www.facebook.com/alegondramusic"
            target="_blank"
            rel="noopener noreferrer"
            className="red-social-link"
          >
            <i className="bi bi-facebook" />
            <span>Facebook</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/alegondramusic/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="red-social-link"
          >
            <i className="bi bi-instagram" />
            <span>Instagram</span>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/channel/UCBhJkysp3SnHU1tR3qAA5pQ"
            target="_blank"
            rel="noopener noreferrer"
            className="red-social-link"
          >
            <i className="bi bi-youtube" />
            <span>YouTube</span>
          </a>

          {/* Spotify */}
          <a
            href="https://open.spotify.com/artist/7qo7PxAcvyyyZb6XztH7zE"
            target="_blank"
            rel="noopener noreferrer"
            className="red-social-link"
          >
            <i className="bi bi-spotify" />
            <span>Spotify</span>
          </a>

          {/* Email */}
          <a
            href="mailto:bavaroalejandro@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="red-social-link"
          >
            <i className="bi bi-envelope" />
            <span>Escríbenos</span>
          </a>

          {/* PayPal */}
          <a
            href="https://www.paypal.com/paypalme/alegondramusic?country.x=AR&locale.x=es_XC"
            target="_blank"
            rel="noopener noreferrer"
            className="red-social-link"
          >
            <i className="bi bi-paypal" />
            <span>Colaborá</span>
          </a>

          {/* Videos */}
          <a
            href="https://www.youtube.com/watch?v=c6fE_Y4ol98"
            target="_blank"
            rel="noopener noreferrer"
            className="red-social-link"
          >
            <i className="bi bi-play-btn" />
            <span>Ver Videos</span>
          </a>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="contacto-divider" />

      {/* SECCIÓN 2: FORMULARIO DE CONTACTO */}
      <div className="contacto-formulario">
        
        {/* Título del formulario */}
        <div className="formulario-titulo">
          <i className="bi bi-chat-dots" />
          <span>Envíanos un mensaje</span>
          <i className="bi bi-chat-dots" />
        </div>

        {/* Formulario de contacto */}
        <form
          className="formulario-contacto"
          action="https://formspree.io/f/xbjnlgzz"
          target="_blank"
          method="post"
        >
          
          {/* Campo: Nombre */}
          <div className="formulario-grupo">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          {/* Campo: Teléfono */}
          <div className="formulario-grupo">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Ingresa tu teléfono"
              required
            />
          </div>

          {/* Campo: Email */}
          <div className="formulario-grupo">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          {/* Campo: Asunto */}
          <div className="formulario-grupo">
            <label htmlFor="asunto">Asunto del Mensaje:</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              placeholder="Ingresa el asunto del mensaje"
              required
            />
          </div>

          {/* Campo: Mensaje */}
          <div className="formulario-grupo">
            <label htmlFor="mensaje">Mensaje:</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              placeholder="Escribe tu mensaje aquí"
              required
            />
          </div>

          {/* Botón de envío */}
          <div className="formulario-acciones">
            <button type="submit" className="boton-enviar">
              ENVIAR MENSAJE
            </button>
          </div>
        </form>

        {/* Imagen decorativa */}
        <div className="formulario-imagen">
          <img 
            src="/img/02-logos/logo-formateo-chords.png" 
            alt="Formateo Chords" 
            className="imagen-decorativa"
          />
        </div>
      </div>
    </div>
  );
};

export default Contacto;