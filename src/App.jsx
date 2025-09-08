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
import ChordsViewerIndex from "./componentes/ChordsViewer/ChordsViewerIndex";
import BibliotecaTeoriaMusical from "./componentes/BibliotecaTeoriaMusical";
import ConsultasAyuda from "./componentes/ConsultasAyuda";
import ReproductorVideo from "./componentes/ReproductorVideo";
import FormateoPartituras from "./componentes/FormateoPartituras";
import BibliotecaCancioneros from "./componentes/ChordsViewer/BibliotecaCancioneros";
import { SearchProvider } from './componentes/SearchContext';

// ======================================================
// BIBLIOTECAS DE CANCIONES
// ======================================================
const SONG_LIBRARIES = [
  { id: 'alegondra', name: 'Ale Gondra', path: '/data/listadocancionesalegondramusic.json', basePath: '/data/cancionesalegondramusic/' },
  { id: 'almangopop', name: 'Almango Pop', path: '/data/listadocancionesalmangopop.json', basePath: '/data/cancionesalmangopop/' },
  { id: 'casamiento', name: 'Casamiento', path: '/data/listadocancionescasamiento.json', basePath: '/data/cancionesshowcasamiento/' },
  { id: 'covers1', name: 'Covers 1', path: '/data/listadochordscoversseleccionados1.json', basePath: '/data/cancionescoversseleccionados1/' },
  { id: 'covers2', name: 'Covers 2', path: '/data/listadochordscoversseleccionados2.json', basePath: '/data/cancionescoversseleccionados2/' },
  { id: 'covers3', name: 'Covers 3', path: '/data/listadochordscoversseleccionados3.json', basePath: '/data/cancionescoversseleccionados3/' },
  { id: 'coverslatinos1', name: 'Latinos', path: '/data/listadochordscoverslatinos1.json', basePath: '/data/cancionescoverslatinos1/' },
  { id: 'coversnacionales1', name: 'Nacionales', path: '/data/listadochordscoversnacionales1.json', basePath: '/data/cancionescoversnacionales1/' },
];

// ======================================================
// DATOS DE EJEMPLO
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
// COMPONENTE PRINCIPAL
// ======================================================
function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="App">
          <Header />
          <hr className="section-divider" />
          
          <div className="main-content">
            <div className="content">
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/biblioteca-cancioneros" element={<BibliotecaCancioneros />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/formateo-chords" element={<BibliotecaTeoriaMusical />} />
                <Route path="/ayuda" element={<ConsultasAyuda />} />
                <Route path="/chords-viewer" element={<ChordsViewerIndex songLibraries={SONG_LIBRARIES} />} />
                <Route path="/player" element={<ReproductorVideo />} />
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
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;