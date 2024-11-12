import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BsWhatsapp, BsFacebook, BsInstagram, BsEnvelope } from "react-icons/bs";
import { FaDownload, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../assets/scss/_03-Componentes/_ChordsCovers.scss";

const ChordsCovers = () => {
  const [almangoData, setAlmangoData] = useState([]);
  const [coversData, setCoversData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [transposition, setTransposition] = useState(0);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Cargar ambos archivos JSON
    fetch("/chordsalmango.json")
      .then((response) => response.json())
      .then((data) => {
        setAlmangoData(data);
        console.log("Datos Almango cargados:", data);
      })
      .catch((error) => console.error("Error al cargar los datos Almango:", error));

    fetch("/chordscovers.json")
      .then((response) => response.json())
      .then((data) => {
        setCoversData(data);
        console.log("Datos Covers cargados:", data);
      })
      .catch((error) => console.error("Error al cargar los datos Covers:", error));
  }, []);

  const transposeChord = (chord) => {
    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const index = chords.indexOf(chord);
    if (index === -1) return chord;
    const newIndex = (index + transposition + 12) % 12;
    return chords[newIndex];
  };

  const transposeSections = (sections) => {
    return sections.map((section) => ({
      ...section,
      acordes: section.acordes.map(transposeChord),
    }));
  };

  const handleTransposeChange = (step) => {
    setTransposition(transposition + step);
  };

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

  const handleCategoryChange = (category) => setSelectedCategory(category);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
  };

  const handlePreview = (url) => window.open(url, "_blank");

  const filteredData = coversData.filter(
    (item) => selectedCategory === "TODOS" || item.genero === selectedCategory
  );

  const categories = ["TODOS", ...new Set(coversData.map((item) => item.genero))];

  const shareOnWhatsApp = (item) => {
    const message = `Mirá este acorde: ${item.cancion} de ${item.artista}.\nInformación extra: ${item.informacionExtra}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const renderSongProse = (song) => {
    return song.Secciones.map((section, index) => (
      <div key={index} className="song-prose-section">
        <h3 className="section-title">{section.titulo}</h3>
        <div className="prose-content">
          <div className="chords-line">
            {section.acordes.map((chord, i) => (
              <span key={i} className="chord">{chord}</span>
            ))}
          </div>
          <p className="lyrics">{section.letra}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="chords-covers-container">
      <Sidebar />
      <div className="controls">
        <button onClick={() => handleTransposeChange(-1)}>Bajar tono</button>
        <button onClick={() => handleTransposeChange(1)}>Subir tono</button>
        <select onChange={(e) => setExportFormat(e.target.value)} value={exportFormat}>
          <option value="PDF">Exportar a PDF</option>
          <option value="JPG">Exportar a JPG</option>
        </select>
        <button onClick={handleExport}>Exportar</button>
      </div>

      {/* Almango Section */}
      <div id="chords-viewer" className="chords-container">
        {almangoData.map((song) => (
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

      {/* Covers Section */}
      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "selected" : ""}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredData.length === 0 ? (
        <h4>No se encontraron datos en la búsqueda. Verifique su selección.</h4>
      ) : (
        <div className="data-container">
          {filteredData.map((item) => (
            <div key={item.id} className="data-item">
              <h3>{item.cancion}</h3>
              <h5>{item.artista}</h5>
              <p><strong>Género:</strong> {item.genero}</p>
              <p><strong>Tempo:</strong> {item.tempo}</p>
              <p><strong>Compás:</strong> {item.compas}</p>
              <p><strong>Capo:</strong> {item.capo}</p>
              <p><strong>Tono Original:</strong> {item.tonoOriginal}</p>
              <p><strong>Tono Actual:</strong> {item.tonoActual}</p>
              <p><strong>Información Extra:</strong> {item.informacionExtra}</p>

              {item.imagenReferencia && (
                <div className="image-thumbnail">
                  <img src={item.imagenReferencia} alt={`Portada de ${item.cancion}`} />
                  <div className="image-buttons">
                    <button onClick={() => handlePreview(item.imagenReferencia)}>
                      <FaEye /> Vista Previa
                    </button>
                    <button onClick={() => handleDownload(item.imagenReferencia, `${item.cancion}.jpg`)}>
                      <FaDownload /> Descargar
                    </button>
                  </div>
                </div>
              )}

              <div className="song-sections">
                {item.secciones.map((section, index) => (
                  <div key={index} className="song-section">
                    <h4>{section.titulo}</h4>
                    <pre className="chords">{section.acordes.join(" - ")}</pre>
                    <p className="lyrics">{section.letra}</p>
                  </div>
                ))}
              </div>

              <div className="social-sharing">
                <button onClick={() => shareOnWhatsApp(item)}>
                  <BsWhatsapp /> Compartir en WhatsApp
                </button>
                <button>
                  <BsFacebook /> Compartir en Facebook
                </button>
                <button>
                  <BsInstagram /> Compartir en Instagram
                </button>
                <button>
                  <BsEnvelope /> Compartir por Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChordsCovers;
