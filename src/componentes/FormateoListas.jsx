import React from 'react';
import "../assets/scss/_03-Componentes/_FormateoListas.scss";
import Sidebar from "./Sidebar";

const FormateoListas = () => {
  return (
    <div className="formateo-listas">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="listas-content">
        <h1>Formateo de Listas</h1>
        <p>Este es el contenido para formateo de listas...</p>
      </div>
    </div>
  );
};

export default FormateoListas;
