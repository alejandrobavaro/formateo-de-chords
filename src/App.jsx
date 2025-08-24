import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

// ============ IMPORTACIÓN DE ESTILOS ============
// Frameworks y librerías externas
import "bootstrap/dist/css/bootstrap.min.css"; // Framework Bootstrap para componentes base
import "bootstrap-icons/font/bootstrap-icons.css"; // Iconos de Bootstrap

// Estilos globales de la aplicación
import "./assets/scss/_01-General/_BodyIndexApp.scss";

// ============ COMPONENTES DE LA APLICACIÓN ============

// Header y Navegación
import Header from "./componentes/Header"; // Componente principal de navegación


// Contenido Principal y Elementos de UI
import MainContent from "./componentes/MainContent"; // Contenido principal de la página de inicio
import MainWhatsappIcon from "./componentes/MainWhatsappIcon"; // Botón flotante de WhatsApp
import MainPublicidadSlider from "./componentes/MainPublicidadSlider"; // Slider de publicidad

// Footer
import Footer from "./componentes/Footer"; // Footer unificado de la aplicación

// Páginas de Contenido
import Contacto from "./componentes/Contacto"; // Página de contacto unificada
import ChordsCovers from "./componentes/ChordsCovers"; // Página de chords covers
import ChordsAlmango from "./componentes/ChordsAlmango"; // Página de chords almango
import FormateoChords from "./componentes/FormateoChords"; // Herramienta de formateo de chords
import ConsultasAyuda from "./componentes/ConsultasAyuda"; // Página de ayuda y consultas

// ============ COMPONENTE PRINCIPAL DE LA APLICACIÓN ============
function App() {
  return (
    <Router>
      {/* Estructura principal de la aplicación */}
      
      {/* Header de navegación */}
      <Header />
      
      {/* Separador visual entre header y contenido */}
      <hr className="section-divider" />
      
      {/* Contenedor principal del contenido */}
      <div className="main-content">
        
  
        
        {/* Contenedor de rutas y contenido dinámico */}
        <div className="content">
          <Routes>
            
            {/* Ruta principal - Página de inicio */}
            <Route path="/" element={<MainContent />} />
            
            {/* Ruta de contacto - Página unificada */}
            <Route path="/contacto" element={<Contacto />} />
            
            {/* Ruta de formateo de chords - Herramienta principal */}
            <Route path="/formateo-chords" element={<FormateoChords />} />
            
            {/* Ruta de chords almango - Biblioteca de acordes */}
            <Route path="/chordsalmango" element={<ChordsAlmango />} />
            
            {/* Ruta de ayuda - Centro de consultas */}
            <Route path="/ayuda" element={<ConsultasAyuda />} />
            
            {/* Ruta de chords covers - Covers musicales */}
            <Route path="/chordscovers" element={<ChordsCovers />} />
            
            {/* Ruta comodín para manejar URLs no encontradas */}
            <Route path="*" element={<MainContent />} />
            
          </Routes>
        </div>
      </div>
      
      {/* Separador visual entre contenido y footer */}
      <hr className="section-divider" />
      
      {/* Slider de publicidad */}
      <MainPublicidadSlider />
      
      {/* Footer de la aplicación */}
      <Footer />
      
      {/* Botón flotante de WhatsApp */}
      <MainWhatsappIcon />
      
    </Router>
  );
}

// Exportación del componente principal
export default App;