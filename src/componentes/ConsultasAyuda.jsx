import React, { useState } from 'react';
import { 
  FiHelpCircle, 
  FiMail, 
  FiMessageSquare, 
  FiBookOpen,
  FiVideo,
  FiUsers,
  FiStar
} from 'react-icons/fi';
import '../assets/scss/_03-Componentes/_ConsultasAyuda.scss';

const ConsultasAyuda = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipoConsulta: 'general',
    instrumento: 'guitarra',
    nivel: 'principiante',
    mensaje: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Datos del formulario:', formData);
    setIsSubmitted(true);
    
    // Simular envío exitoso
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nombre: '',
        email: '',
        tipoConsulta: 'general',
        instrumento: 'guitarra',
        nivel: 'principiante',
        mensaje: ''
      });
    }, 3000);
  };

  const faqItems = [
    {
      pregunta: "¿Cómo transponer acordes correctamente?",
      respuesta: "Usa nuestro sistema de transposición automática. Selecciona la canción y ajusta los semitonos necesarios. El sistema recalculará todos los acordes manteniendo la estructura musical."
    },
    {
      pregunta: "¿Puedo exportar las partituras?",
      respuesta: "Sí, puedes exportar en formato PDF para imprimir o JPG para compartir digitalmente. Los formatos están optimizados para músicos."
    },
    {
      pregunta: "¿Cómo usar el metrónomo integrado?",
      respuesta: "En el sidebar encontrarás el metrónomo. Configura el BPM deseado y el compás. Ideal para practicar con timing preciso."
    },
    {
      pregunta: "¿Los acordes son verificados?",
      respuesta: "Todos nuestros acordes pasan por un proceso de verificación con músicos profesionales para garantizar su precisión."
    }
  ];

  const recursosItems = [
    {
      icono: <FiBookOpen />,
      titulo: "Guías de Acordes",
      descripcion: "Aprende las posiciones correctas de todos los acordes"
    },
    {
      icono: <FiVideo />,
      titulo: "Video Tutoriales",
      descripcion: "Clases en video para todos los niveles"
    },
    {
      icono: <FiUsers />,
      titulo: "Comunidad",
      descripcion: "Conecta con otros músicos y comparte experiencias"
    },
    {
      icono: <FiStar />,
      titulo: "Tips Profesionales",
      descripcion: "Consejos de músicos experimentados"
    }
  ];

  return (
    <div className="ayuda-container">
      
      {/* Header de la página */}
      <div className="ayuda-header">
        <FiHelpCircle className="header-icon" />
        <h1>Centro de Ayuda para Músicos</h1>
        <p>Encuentra respuestas, recursos y soporte especializado</p>
      </div>

      {/* Sección de FAQ */}
      <div className="faq-section">
        <h2>
          <FiHelpCircle className="section-icon" />
          Preguntas Frecuentes
        </h2>
        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <h3>{item.pregunta}</h3>
              <p>{item.respuesta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Recursos */}
      <div className="recursos-section">
        <h2>
          <FiBookOpen className="section-icon" />
          Recursos para Músicos
        </h2>
        <div className="recursos-grid">
          {recursosItems.map((item, index) => (
            <div key={index} className="recurso-card">
              <div className="recurso-icon">{item.icono}</div>
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de Contacto */}
      <div className="formulario-section">
        <h2>
          <FiMail className="section-icon" />
          ¿Necesitas ayuda personalizada?
        </h2>
        
        {isSubmitted ? (
          <div className="success-message">
            <FiMessageSquare className="success-icon" />
            <h3>¡Mensaje enviado con éxito!</h3>
            <p>Te contactaremos dentro de las próximas 24 horas.</p>
          </div>
        ) : (
          <form className="formulario-ayuda" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="tu.email@ejemplo.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoConsulta">Tipo de consulta *</label>
                <select
                  id="tipoConsulta"
                  name="tipoConsulta"
                  value={formData.tipoConsulta}
                  onChange={handleInputChange}
                  required
                >
                  <option value="general">Consulta general</option>
                  <option value="tecnica">Problema técnico</option>
                  <option value="acordes">Duda sobre acordes</option>
                  <option value="funcion">Funcionalidad de la app</option>
                  <option value="sugerencia">Sugerencia de mejora</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="instrumento">Instrumento principal</label>
                <select
                  id="instrumento"
                  name="instrumento"
                  value={formData.instrumento}
                  onChange={handleInputChange}
                >
                  <option value="guitarra">Guitarra</option>
                  <option value="piano">Piano/Teclado</option>
                  <option value="bajo">Bajo</option>
                  <option value="ukelele">Ukelele</option>
                  <option value="voz">Voz</option>
                  <option value="violin">Violín</option>
                  <option value="bateria">Batería</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="nivel">Nivel musical</label>
                <select
                  id="nivel"
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleInputChange}
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="profesional">Profesional</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="mensaje">Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Describe tu consulta en detalle..."
              />
            </div>

            <button type="submit" className="submit-button">
              <FiMail className="button-icon" />
              Enviar Consulta
            </button>
          </form>
        )}
      </div>

      {/* Sección de Contacto Directo */}
      <div className="contacto-directo">
        <h2>
          <FiMessageSquare className="section-icon" />
          Otros Canales de Contacto
        </h2>
        <div className="canales-contacto">
          <div className="canal">
            <h3>📧 Email Directo</h3>
            <p>soporte@BibliotecaTeoriaMusical.com</p>
            <span>Respuesta en 24 horas</span>
          </div>
          <div className="canal">
            <h3>💬 WhatsApp</h3>
            <p>+54 9 11 2345-6789</p>
            <span>Soporte rápido vía chat</span>
          </div>
          <div className="canal">
            <h3>🕒 Horario de Atención</h3>
            <p>Lunes a Viernes</p>
            <span>9:00 - 18:00 hs</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ConsultasAyuda;