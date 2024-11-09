// Chords2.jsx
import React, { useState, useEffect } from 'react';
import "../assets/scss/_03-Componentes/_Chords2.scss";

const Chords2 = () => {
  const [chordsData, setChordsData] = useState([]);

  useEffect(() => {
    fetch("/chords2.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el JSON");
        }
        return response.json();
      })
      .then((data) => setChordsData(data.chords || []))
      .catch((error) => console.error(error.message));
  }, []);

  if (!chordsData.length) {
    return <div>Cargando acordes...</div>;
  }

  return (
    <div className="chords2-container">
      <h1>Vista Previa de Acordes</h1>
      <div className="chords2-list">
        {chordsData.map((chord, index) => (
          <div key={index} className="chords2-chord">
            <h2>{chord.name}</h2>
            <p>{chord.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chords2;
