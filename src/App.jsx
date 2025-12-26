// ======================================================
// IMPORTACIONES DE LIBRERÍAS EXTERNAS
// ======================================================
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/estilo.scss";

// ======================================================
// IMPORTACIONES DE COMPONENTES PROPIOS
// ======================================================
import Header from "./componentes/Header";
import MainContent from "./componentes/MainContent";
import MainWhatsappIcon from "./componentes/MainWhatsappIcon";
import MainPublicidadSlider from "./componentes/MainPublicidadSlider";
import Footer from "./componentes/Footer";
import Contacto from "./componentes/Contacto";
import BibliotecaTeoriaMusical from "./componentes/BibliotecaTeoriaMusical";
import ConsultasAyuda from "./componentes/ConsultasAyuda";
import ReproductorVideo from "./componentes/ReproductorVideo"; // ✅ CORREGIDO: ReproductorVideo en lugar de Videos
import FormateoPartituras from "./componentes/FormateoPartituras";

// ======================================================
// IMPORTACIONES DEL REPRODUCTOR DE MÚSICA
// ======================================================
import MMusicaEscucha from "./componentes/ReproductorMusica/MMusicaEscucha";
import { MusicaProvider } from "./componentes/ReproductorMusica/MusicaContexto";

// ======================================================
// CONTEXTOS EXISTENTES
// ======================================================
import { SearchProvider } from './componentes/SearchContext';

// ======================================================
// BIBLIOTECAS DE CANCIONES
// ======================================================
const SONG_LIBRARIES = [
  { 
    id: 'alegondra', 
    name: 'Ale Gondra', 
    path: '/listado-chords-alegondramusic.json', 
    basePath: '/data/01-chords-musica-original/chords-alegondramusic/',
    tipo: 'original'
  },
  { 
    id: 'almangopop', 
    name: 'Almango Pop', 
    path: '/listado-chords-almango-pop.json', 
    basePath: '/data/01-chords-musica-original/chords-almangopop/',
    tipo: 'original'
  },
  { 
    id: 'covers-baladasespanol', 
    name: 'Baladas Español', 
    path: '/data/02-chords-covers/listadocancionescovers-baladasespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-baladasespanol/',
    tipo: 'covers'
  },
];

// ======================================================
// DATOS DE EJEMPLO PARA FORMATEO DE PARTITURAS
// ======================================================
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

// ======================================================
// COMPONENTE PRINCIPAL - APLICACIÓN
// ======================================================
function App() {
  return (
    <MusicaProvider>
      <SearchProvider>
        <Router>
          <div className="App">
            {/* HEADER */}
            <Header />
            <hr className="section-divider" />
            
            {/* CONTENIDO PRINCIPAL */}
            <div className="main-content">
              <div className="content">
                <Routes>
                  {/* RUTA PRINCIPAL */}
                  <Route path="/" element={<MainContent />} />
                  
                  {/* MÚSICA - REPRODUCTOR CON VISUALIZADOR DE ACORDES */}
                  <Route path="/musica" element={
                    <MMusicaEscucha 
                      songLibraries={SONG_LIBRARIES}
                      defaultCategory="original"
                    />
                  } />
                  
                  {/* VIDEOS - REPRODUCTOR DE VIDEO (CORREGIDO) */}
                  <Route path="/Videos" element={<ReproductorVideo />} /> {/* ✅ Ruta correcta */}
                  
                  {/* TEORÍA MUSICAL */}
                  <Route path="/formateo-chords" element={<BibliotecaTeoriaMusical />} />
                  
                  {/* FORMATEO DE PARTITURAS */}
                  <Route path="/chords-format" element={
                    <FormateoPartituras
                      titulo="Creedence - Have You Ever Seen The Rain"
                      tono="A"
                      secciones={seccionesEjemplo}
                    />
                  }/>
                  
                  {/* CONTACTO */}
                  <Route path="/contacto" element={<Contacto />} />
                  
                  {/* AYUDA */}
                  <Route path="/ayuda" element={<ConsultasAyuda />} />
                  
                  {/* RUTA COMODÍN */}
                  <Route path="*" element={<MainContent />} />
                </Routes>
              </div>
            </div>
            
            <hr className="section-divider" />
            <MainPublicidadSlider />
            <Footer />
            <MainWhatsappIcon />
          </div>
        </Router>
      </SearchProvider>
    </MusicaProvider>
  );
}

export default App;