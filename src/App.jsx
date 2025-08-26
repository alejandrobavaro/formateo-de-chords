import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// ============ IMPORTACIÓN DE ESTILOS ============
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/estilo.scss"; // Cambiado a importar el archivo principal

// ============ COMPONENTES DE LA APLICACIÓN ============
import Header from "./componentes/Header";
import MainContent from "./componentes/MainContent";
import MainWhatsappIcon from "./componentes/MainWhatsappIcon";
import MainPublicidadSlider from "./componentes/MainPublicidadSlider";
import Footer from "./componentes/Footer";
import Contacto from "./componentes/Contacto";
import ChordsViewerIndex from "./componentes/ChordsViewer/ChordsViewerIndex"; // Corregida la ruta
import FormateoChords from "./componentes/FormateoChords";
import ConsultasAyuda from "./componentes/ConsultasAyuda";

// ============ CONTEXTO ============
import { HeaderSearchProvider } from "./componentes/ChordsViewer/HeaderSearchContext"; // Corregida la ruta

// ============ COMPONENTE PRINCIPAL DE LA APLICACIÓN ============
function App() {
  return (
    <HeaderSearchProvider>
      <Router>
        {/* Estructura principal de la aplicación */}
        <Header />
        <hr className="section-divider" />
        
        <div className="main-content">
          <div className="content">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/formateo-chords" element={<FormateoChords />} />
              <Route path="/ayuda" element={<ConsultasAyuda />} />
              <Route path="/chords-viewer" element={<ChordsViewerIndex />} />
              <Route path="*" element={<MainContent />} />
            </Routes>
          </div>
        </div>
        
        <hr className="section-divider" />
        <MainPublicidadSlider />
        <Footer />
        <MainWhatsappIcon />
      </Router>
    </HeaderSearchProvider>
  );
}

export default App;