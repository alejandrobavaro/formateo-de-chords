// Chords3.jsx
import React, { useState, useEffect } from 'react';
import "../assets/scss/_03-Componentes/_Chords3.scss";

const Chords3 = () => {
  const [chordsData, setChordsData] = useState([]);

  useEffect(() => {
    fetch("/chords3.json")
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
    <div className="chords3-container">
      <h1>Vista Previa de Acordes</h1>
      <div className="chords3-list">
        {chordsData.map((chord, index) => (
          <div key={index} className="chords3-chord">
            <h2>{chord.name}</h2>
            <p>{chord.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chords3;
