import React, { useState, useEffect } from "react";
import jsPDF from "jspdf"; // Librería para exportar PDF
import html2canvas from "html2canvas"; // Librería para exportar JPG
import "../assets/scss/_03-Componentes/_ChordsAlmango.scss";

const ChordsAlmango = () => {
  const [data, setData] = useState([]);
  const [transposition, setTransposition] = useState(0); // Variable para transposición
  const [exportFormat, setExportFormat] = useState("PDF");

  useEffect(() => {
    fetch("/chordsalmango.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Datos cargados:", data);
      })
      .catch((error) => console.error("Error al cargar los datos:", error));
  }, []);

  // Función para transponer los acordes
  const transposeChord = (chord) => {
    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const index = chords.indexOf(chord);
    if (index === -1) return chord;
    const newIndex = (index + transposition + 12) % 12;
    return chords[newIndex];
  };

  // Función para transponer acordes en todas las secciones
  const transposeSections = (sections) => {
    return sections.map((section) => ({
      ...section,
      acordes: section.acordes.map(transposeChord),
    }));
  };

  // Función para exportar como PDF o JPG
  const handleExport = () => {
    const element = document.getElementById("chords-viewer");
    if (exportFormat === "PDF") {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.html(element, {
        callback: () => {
          pdf.save("chords.pdf");
        },
      });
    } else if (exportFormat === "JPG") {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "JPEG", 0, 0);
        pdf.save("chords.jpg");
      });
    }
  };

  // Función para cambiar el tono
  const handleTransposeChange = (step) => {
    setTransposition(transposition + step);
  };

  // Renderizar la canción en formato de prosa
  const renderSongProse = (song) => {
    return song.Secciones.map((section, index) => (
      <div key={index} className="song-prose-section">
        <h3 className="section-title">{section.titulo}</h3>
        <div className="prose-content">
          {/* Acordes en línea */}
          <div className="chords-line">
            {section.acordes.map((chord, i) => (
              <span key={i} className="chord">{chord}</span>
            ))}
          </div>
          {/* Letra de la canción */}
          <p className="lyrics">{section.letra}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="chords-display">
      <div className="controls">
        <button onClick={() => handleTransposeChange(-1)}>Bajar tono</button>
        <button onClick={() => handleTransposeChange(1)}>Subir tono</button>
        <select onChange={(e) => setExportFormat(e.target.value)} value={exportFormat}>
          <option value="PDF">Exportar a PDF</option>
          <option value="JPG">Exportar a JPG</option>
        </select>
        <button onClick={handleExport}>Exportar</button>
      </div>

      <div id="chords-viewer" className="chords-container">
        {data.map((song) => (
          <div key={song.id} className="chords-item">
            <h1 className="song-title">{song.Cancion}</h1>
            <h2 className="song-artist">{song.Artista}</h2>
            <div className="song-details">
              <p><strong>Género:</strong> {song.Genero}</p>
              <p><strong>Tempo:</strong> {song.tempo} BPM</p>
              <p><strong>Compás:</strong> {song.compas}</p>
              <p><strong>Capo:</strong> {song.capo}</p>
              <p><strong>Tono Original:</strong> {song.tonoOriginal}</p>
              <p><strong>Tono Actual:</strong> {song.tonoActual}</p>
            </div>

            <div className="song-prose">
              {renderSongProse(song)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordsAlmango;
