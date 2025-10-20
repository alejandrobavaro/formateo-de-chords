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
// BIBLIOTECAS DE CANCIONES - ESTRUCTURA ACTUALIZADA
// ======================================================
const SONG_LIBRARIES = [
  // ======================================================
  // 🎵 MÚSICA ORIGINAL - Carpeta: 01-chords-musica-original
  // ======================================================
  { 
    id: 'alegondra', 
    name: 'Ale Gondra', 
    path: '/listado-chords-alegondramusic.json', 
    basePath: '/data/01-chords-musica-original/chords-alegondramusic/' 
  },
  { 
    id: 'almangopop', 
    name: 'Almango Pop', 
    path: '/listado-chords-almango-pop.json', 
    basePath: '/data/01-chords-musica-original/chords-almangopop/' 
  },
  
  // ======================================================
  // 🎭 SHOWS ESPECÍFICOS - Carpeta: 03-chords-de-shows-por-listados
  // ======================================================
  { 
    id: 'casamiento', 
    name: 'Casamiento', 
    path: '/listado-chords-casamiento-ale-fabi.json', 
    basePath: '/data/03-chords-de-shows-por-listados/chords-show-casamiento-ale-fabi/' 
  },
  
  // ======================================================
  // 🎸 COVERS ORGANIZADOS POR GÉNERO - Carpeta: 02-chords-covers
  // ======================================================
  { 
    id: 'covers-baladasespanol', 
    name: 'Baladas Español', 
    path: '/data/02-chords-covers/listadocancionescovers-baladasespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-baladasespanol/' 
  },
  { 
    id: 'covers-baladasingles', 
    name: 'Baladas Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-baladasingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-baladasingles/' 
  },
  { 
    id: 'covers-poprockespanol', 
    name: 'Pop Rock Español', 
    path: '/data/02-chords-covers/listadocancionescovers-poprockespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-poprockespanol/' 
  },
  { 
    id: 'covers-poprockingles', 
    name: 'Pop Rock Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-poprockingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-poprockingles/' 
  },
  { 
    id: 'covers-latinobailableespanol', 
    name: 'Latino Bailable', 
    path: '/data/02-chords-covers/listadocancionescovers-latinobailableespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-latinobailableespanol/' 
  },
  { 
    id: 'covers-rockbailableespanol', 
    name: 'Rock Bailable Español', 
    path: '/data/02-chords-covers/listadocancionescovers-rockbailableespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-rockbailableespanol/' 
  },
  { 
    id: 'covers-rockbailableingles', 
    name: 'Rock Bailable Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-rockbailableingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-rockbailableingles/' 
  },
  { 
    id: 'covers-hardrock-punkespanol', 
    name: 'Hard Rock/Punk Español', 
    path: '/data/02-chords-covers/listadocancionescovers-hardrock-punkespanol.json', 
    basePath: '/data/02-chords-covers/cancionescovers-hardrock-punkespanol/' 
  },
  { 
    id: 'covers-hardrock-punkingles', 
    name: 'Hard Rock/Punk Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-hardrock-punkingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-hardrock-punkingles/' 
  },
  { 
    id: 'covers-discoingles', 
    name: 'Disco Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-discoingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-discoingles/' 
  },
  { 
    id: 'covers-reggaeingles', 
    name: 'Reggae Inglés', 
    path: '/data/02-chords-covers/listadocancionescovers-reggaeingles.json', 
    basePath: '/data/02-chords-covers/cancionescovers-reggaeingles/' 
  },
  { 
    id: 'covers-festivos-bso', 
    name: 'Festivos & BSO', 
    path: '/data/02-chords-covers/listadocancionescovers-festivos-bso.json', 
    basePath: '/data/02-chords-covers/cancionescovers-festivos-bso/' 
  }
];

// ======================================================
// DATOS DE EJEMPLO PARA EL FORMATEO DE PARTITURAS
// ======================================================
// ESTOS DATOS SE USAN EN LA RUTA /chords-format COMO EJEMPLO
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
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ======================================================
// ESTE ES EL COMPONENTE RAIZ QUE ENVUELVE TODA LA APLICACIÓN
// Y CONFIGURA EL RUTEO ENTRE DIFERENTES PÁGINAS
function App() {
  return (
    // 🔍 PROVIDER DEL CONTEXTO DE BÚSQUEDA
    // Este contexto permite compartir el estado de búsqueda entre componentes
    <SearchProvider>
      {/* 🧭 ROUTER PRINCIPAL DE REACT */}
      {/* Maneja la navegación entre diferentes páginas de la aplicación */}
      <Router>
        <div className="App">
          {/* 🏗️ COMPONENTES ESTRUCTURALES DE LA APLICACIÓN */}
          <Header /> {/* Encabezado con navegación */}
          <hr className="section-divider" /> {/* Línea divisoria */}
          
          {/* 📄 CONTENIDO PRINCIPAL DE LA APLICACIÓN */}
          <div className="main-content">
            <div className="content">
              {/* 🗺️ DEFINICIÓN DE RUTAS DE LA APLICACIÓN */}
              {/* Cada Route representa una página diferente */}
              <Routes>
                {/* 🏠 PÁGINA DE INICIO */}
                <Route path="/" element={<MainContent />} />
                
                {/* 📚 BIBLIOTECA DE CANCIONEROS - GALERÍA DE CANCIONES */}
                <Route path="/biblioteca-cancioneros" element={<BibliotecaCancioneros />} />
                
                {/* 📞 PÁGINA DE CONTACTO */}
                <Route path="/contacto" element={<Contacto />} />
                
                {/* 🎼 BIBLIOTECA DE TEORÍA MUSICAL */}
                <Route path="/formateo-chords" element={<BibliotecaTeoriaMusical />} />
                
                {/* ❓ PÁGINA DE AYUDA Y CONSULTAS */}
                <Route path="/ayuda" element={<ConsultasAyuda />} />
                
                {/* 👁️ VISUALIZADOR DE ACORDES - RECIBE LAS BIBLIOTECAS COMO PROP */}
                <Route path="/chords-viewer" element={<ChordsViewerIndex songLibraries={SONG_LIBRARIES} />} />
                
                {/* ▶️ REPRODUCTOR DE VIDEO */}
                <Route path="/player" element={<ReproductorVideo />} />
                
                {/* 🖨️ FORMATEO DE PARTITURAS - CON DATOS DE EJEMPLO */}
                <Route path="/chords-format" element={
                  <FormateoPartituras
                    titulo="Creedence - Have You Ever Seen The Rain"
                    tono="A"
                    secciones={seccionesEjemplo}
                  />
                }/>
                
                {/* 🎯 RUTA POR DEFECTO - REDIRIGE A INICIO SI NO ENCUENTRA LA RUTA */}
                <Route path="*" element={<MainContent />} />
              </Routes>
            </div>
          </div>
          
          {/* 📱 COMPONENTES ADICIONALES */}
          <hr className="section-divider" /> {/* Línea divisoria */}
          <MainPublicidadSlider /> {/* Slider de publicidad */}
          <Footer /> {/* Pie de página */}
          <MainWhatsappIcon /> {/* Icono flotante de WhatsApp */}
        </div>
      </Router>
    </SearchProvider>
  );
}

// 📤 EXPORTACIÓN DEL COMPONENTE PRINCIPAL
export default App;