import React from 'react';
import "../assets/scss/_03-Componentes/_FormateoGacetilla.scss";
import Sidebar from "./Sidebar";

const FormateoGacetilla = () => {
  return (
    <div className="formateo-gacetilla">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="gacetilla-content">
        <h1>Formateo de Gacetilla</h1>
        <p>Este es el contenido para formateo de gacetilla...</p>
      </div>
    </div>
  );
};

export default FormateoGacetilla;
