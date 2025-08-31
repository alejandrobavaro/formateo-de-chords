import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/estilo.scss";

import Header from "./componentes/Header";
import MainContent from "./componentes/MainContent";
import MainWhatsappIcon from "./componentes/MainWhatsappIcon";
import MainPublicidadSlider from "./componentes/MainPublicidadSlider";
import Footer from "./componentes/Footer";

import Contacto from "./componentes/Contacto";
import ChordsViewerIndex from "./componentes/ChordsViewer/ChordsViewerIndex";
import BibliotecaAcordes from "./componentes/BibliotecaAcordes";
import ConsultasAyuda from "./componentes/ConsultasAyuda";
import ReproductorVideo from "./componentes/ReproductorVideo";

import FormateoPartituras from "./componentes/FormateoPartituras";

// Ejemplo de secciones
const seccionesEjemplo = [
  [
    { tipo: "titulo", texto: "INTRO", voz: "VOZ1" },
    { tipo: "texto", texto: "F#m-D–A–(E)-\n(RIFF 1 - A) + (RIFF 2 + A)\n1º VOZ ALE      A\nSomeone told me long ago\nE\nThere's a calm before the storm, I know\nA\nAnd it's been coming for some time.", voz: "VOZ1" }
  ],
  [
    { tipo: "titulo", texto: "INTRO", voz: "VOZ2" },
    { tipo: "texto", texto: "1º VOZ ALE      A\nYesterday and days before\nE\nSun is cold and rain is hard, I know\nA\nBeen that way for all my time.", voz: "VOZ2" }
  ]
];

function App() {
  return (
    <Router>
      <Header />
      <hr className="section-divider" />
      <div className="main-content">
        <div className="content">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/formateo-chords" element={<BibliotecaAcordes />} />
            <Route path="/ayuda" element={<ConsultasAyuda />} />
            <Route path="/chords-viewer" element={<ChordsViewerIndex />} />
            <Route path="/player" element={<ReproductorVideo />} />
            {/* Nueva ruta: Formateo */}
            <Route path="/chords-format" element={
              <FormateoPartituras
                titulo="Creedence - Have You Ever Seen The Rain"
                tono="A"
                secciones={seccionesEjemplo}
              />
            }/>
            <Route path="*" element={<MainContent />} />
          </Routes>
        </div>
      </div>
      <hr className="section-divider" />
      <MainPublicidadSlider />
      <Footer />
      <MainWhatsappIcon />
    </Router>
  );
}

export default App;
