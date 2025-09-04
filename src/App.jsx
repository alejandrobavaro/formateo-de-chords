// ======================================================
// IMPORTACIONES DE LIBRERÍAS EXTERNAS
// ======================================================
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importaciones de Bootstrap para estilos y componentes
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Importación de estilos SCSS personalizados
import "./assets/scss/estilo.scss";

// ======================================================
// IMPORTACIONES DE COMPONENTES PROPIOS
// ======================================================
// Componente de encabezado principal
import Header from "./componentes/Header";

// Componente de contenido principal de la página de inicio
import MainContent from "./componentes/MainContent";

// Componente de ícono de WhatsApp flotante
import MainWhatsappIcon from "./componentes/MainWhatsappIcon";

// Componente de slider publicitario
import MainPublicidadSlider from "./componentes/MainPublicidadSlider";

// Componente de pie de página
import Footer from "./componentes/Footer";

// Páginas/componentes de diferentes secciones de la aplicación
import Contacto from "./componentes/Contacto";
import ChordsViewerIndex from "./componentes/ChordsViewer/ChordsViewerIndex";
import BibliotecaAcordes from "./componentes/BibliotecaAcordes";
import ConsultasAyuda from "./componentes/ConsultasAyuda";
import ReproductorVideo from "./componentes/ReproductorVideo";
import FormateoPartituras from "./componentes/FormateoPartituras";

// Contexto para manejar búsquedas globales
import { SearchProvider } from './componentes/SearchContext';

// ======================================================
// DEFINICIÓN DE BIBLIOTECAS DE CANCIONES
// Estas son las colecciones de canciones disponibles en el visor de acordes
// ======================================================
const SONG_LIBRARIES = [
  { 
    id: 'alegondra', 
    name: 'Ale Gondra', 
    path: '/data/listadocancionesalegondramusic.json',
    basePath: '/data/cancionesalegondramusic/' 
  },
  { 
    id: 'almangopop', 
    name: 'Almango Pop', 
    path: '/data/listadocancionesalmangopop.json',
    basePath: '/data/cancionesalmangopop/'  
  },
  { 
    id: 'casamiento', 
    name: 'Show Casamiento', 
    path: '/data/listadocancionescasamiento.json',
    basePath: '/data/cancionesshowcasamiento/'  
  },
  { 
    id: 'covers1', 
    name: 'Covers 1', 
    path: '/data/listadochordscoversseleccionados1.json',
    basePath: '/data/cancionescoversseleccionados1/' 
  }, 
  { 
    id: 'covers2', 
    name: 'Covers 2', 
    path: '/data/listadochordscoversseleccionados2.json',
    basePath: '/data/cancionescoversseleccionados2/' 
  }, 
  { 
    id: 'covers3', 
    name: 'Covers 3', 
    path: '/data/listadochordscoversseleccionados3.json',
    basePath: '/data/cancionescoversseleccionados3/' 
  }, 
  { 
    id: 'coverslatinos1', 
    name: 'Latinos 1', 
    path: '/data/listadochordscoverslatinos1.json',
    basePath: '/data/cancionescoverslatinos1/'
  },
  { 
    id: 'coversnacionales1', 
    name: 'Nacionales 1', 
    path: '/data/listadochordscoversnacionales1.json',
    basePath: '/data/cancionescoversnacionales1/' 
  }, 
];

// ======================================================
// DATOS DE EJEMPLO PARA FORMATEO DE PARTITURAS
// Secciones predefinidas para mostrar en el componente de formateo
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
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// Este es el componente raíz que contiene toda la estructura de la app
// ======================================================
function App() {
  return (
    // Proveedor del contexto de búsqueda que envuelve toda la aplicación
    // Esto permite que cualquier componente acceda a las funcionalidades de búsqueda
    <SearchProvider>
      {/* Router principal que habilita la navegación entre páginas */}
      <Router>
        <div className="App">
          
          {/* ========== HEADER UNIFICADO ========== */}
          {/* 
            Componente de encabezado que aparece en todas las páginas.
            Contiene la navegación principal y logo.
            Este Header es único para toda la aplicación.
          */}
          <Header />
          
          {/* Línea divisoria visual entre el header y el contenido */}
          <hr className="section-divider" />
          
          {/* ========== CONTENIDO PRINCIPAL ========== */}
          {/* 
            Contenedor principal donde se renderizan las diferentes páginas
            según la ruta/navegación del usuario
          */}
          <div className="main-content">
            <div className="content">
              
              {/* 
                Sistema de rutas que define qué componente mostrar según la URL:
                - Cada Route mapea una path (ruta) a un componente específico
                - El orden de las rutas es importante (más específicas primero)
              */}
              <Routes>
                
                {/* Ruta: Página de inicio (raíz del sitio) */}
                <Route path="/" element={<MainContent />} />
                
                {/* Ruta: Página de contacto */}
                <Route path="/contacto" element={<Contacto />} />
                
                {/* Ruta: Biblioteca de acordes */}
                <Route path="/formateo-chords" element={<BibliotecaAcordes />} />
                
                {/* Ruta: Ayuda y consultas */}
                <Route path="/ayuda" element={<ConsultasAyuda />} />
                
                {/* 
                  Ruta: Visor de acordes (página principal de cancioneros)
                  Se le pasa la prop songLibraries con todas las bibliotecas disponibles
                */}
                <Route 
                  path="/chords-viewer" 
                  element={
                    <ChordsViewerIndex 
                      songLibraries={SONG_LIBRARIES}
                    />
                  } 
                />
                
                {/* Ruta: Reproductor de video */}
                <Route path="/player" element={<ReproductorVideo />} />
                
                {/* 
                  Ruta: Formateo de partituras
                  Se le pasan props con datos de ejemplo para mostrar
                */}
                <Route path="/chords-format" element={
                  <FormateoPartituras
                    titulo="Creedence - Have You Ever Seen The Rain"
                    tono="A"
                    secciones={seccionesEjemplo}
                  />
                }/>
                
                {/* 
                  Ruta por defecto (404) - captura cualquier ruta no definida
                  y redirige al contenido principal
                */}
                <Route path="*" element={<MainContent />} />
              </Routes>
            </div>
          </div>
          
          {/* Línea divisoria visual entre el contenido y el footer */}
          <hr className="section-divider" />
          
          {/* ========== COMPONENTES ADICIONALES ========== */}
          {/* 
            Componentes que aparecen en todas las páginas de la aplicación:
            - Slider publicitario en la parte inferior
            - Footer con información adicional
            - Ícono flotante de WhatsApp para contacto rápido
          */}
          <MainPublicidadSlider />
          <Footer />
          <MainWhatsappIcon />
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;