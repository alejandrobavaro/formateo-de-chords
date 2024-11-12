import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_FormateoChords.scss";
import Sidebar from "./Sidebar";

const FormateoChords = () => {
  const [chords, setChords] = useState([]);

  useEffect(() => {
    // Carga el archivo JSON desde la carpeta `public` usando `fetch`
    fetch("/chordsData.json")
      .then((response) => response.json())
      .then((data) => setChords(data))
      .catch((error) => console.error("Error cargando el archivo JSON:", error));
  }, []);

  return (
    <div className="formateo-chords">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="formateo-content">
        <h1>Formateo de Chords</h1>
        <p>Este es el contenido para formateo de chords...</p>

        {/* Galería de Chords */}
        <div className="chords-gallery">
          {chords.map((chord, index) => (
            <div key={index} className="chord-item">
              <img src={chord.image} alt={chord.name} className="chord-image" />
              <h2 className="chord-name">{chord.name}</h2>
              <p className="chord-description">{chord.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormateoChords;
