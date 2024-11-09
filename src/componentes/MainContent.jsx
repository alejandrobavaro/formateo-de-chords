import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../assets/scss/_03-Componentes/_MainContent.scss";
import Chords1 from "./Chords1";
import Chords2 from "./Chords2";
import Chords3 from "./Chords3";

function MainContent() {
  return (
    <main className="mainContent">
      {/* <h1>Bienvenido a Personalización de Carteras</h1> */}
      <div className="button-container">
        {/* Botones para navegar a cada componente */}
        <Link to="/chords1">
          <div>
            <img
              className="botonSeleccion1"
              src="/img/02-logos/logoenganchadoscovers2a.png"
              alt=""
            />{" "}
            <span>
              <p>CHORDS 1</p>
            </span>
          </div>
        </Link>
        <Link to="/chords2">
          <div>
            <img
              className="botonSeleccion2"
              src="/img/02-logos/logoalmangopop1a.png"
              alt=""
            />{" "}
            <span>
              <p>CHORDS 2</p>
            </span>
          </div>
        </Link>
        <Link to="/chords3">
          <div>
            <img
              className="botonSeleccion3"
              src="/img/02-logos/logo-formateo-chords.png"
              alt=""
            />{" "}
            <span>
              <p>CHORDS 3</p>
            </span>
          </div>
        </Link>
      </div>
      <hr className="lineaSepadadora1" />
      <Routes>
        <Route path="/chords1" element={<Chords1 />} />
        <Route path="/chords2" element={<Chords2 />} />
        <Route path="/chords3" element={<Chords3 />} />
      </Routes>
    </main>
  );
}

export default MainContent;
