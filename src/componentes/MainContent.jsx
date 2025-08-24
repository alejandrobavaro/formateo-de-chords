import React from "react";
import { Routes, Route } from "react-router-dom";
import ReproductorVideo from "./ReproductorVideo";
import "../assets/scss/_03-Componentes/_MainContent.scss";

function MainContent() {
  return (
    <main className="mainContent">
      <div className="gridPadre"></div>
      <div className="gridItem">
        {/* Mostrar ReproductorVideo en la ruta inicial */}
        <Routes>
          <Route path="/" element={<ReproductorVideo />} />
        </Routes>
      </div>
    </main>
  );
}

export default MainContent;
