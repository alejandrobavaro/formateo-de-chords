import React from 'react';
import { FiMessageCircle, FiHelpCircle } from 'react-icons/fi';
import '../assets/scss/_03-Componentes/_MainWhatsappIcon.scss';

function MainWhatsappIcon() {
  const handleClick = () => {
    // Opcional: puedes añadir analytics o tracking aquí
    console.log('WhatsApp icon clicked - Redirecting to chat');
  };

  return (
    <div className='telefonoWhatsappMainContent'>
      <div className="whatsapp-tooltip">
        <FiHelpCircle className="tooltip-icon" />
        <span className="tooltip-text">¿Necesitas ayuda? ¡Escríbenos!</span>
      </div>
      
      <a
        href="https://api.whatsapp.com/send?phone=+542235455451&text=Hola!,%20en%20que%20puedo%20ayudarte?"
        rel="noopener noreferrer"
        target="_blank"
        className="whatsapp-link"
        onClick={handleClick}
        aria-label="Contactar por WhatsApp"
      >
        <div className="whatsapp-icon-container">
          <FiMessageCircle className="whatsapp-icon" />
          <span className="whatsapp-pulse"></span>
          {/* <span className="whatsapp-badge">¡Ayuda!</span> */}
        </div>
      </a>
    </div>
  );
}

export default MainWhatsappIcon;