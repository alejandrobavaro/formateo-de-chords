import React from "react";
import { Routes, Route } from "react-router-dom";
import ReproductorVideo from "./ReproductorVideo";
import BibliotecaCancioneros from "./ChordsViewer/BibliotecaCancioneros"; 
import "../assets/scss/_03-Componentes/_MainContent.scss";

function MainContent() {
  return (
    <main className="mainContent">
  <div className="mainContentContainer">
  {/* <div className="gridItem">
    <ReproductorVideo />
  </div> */}
  <div className="gridItem">
    <BibliotecaCancioneros />
  </div>
</div>

    </main>
  );
}

export default MainContent;
