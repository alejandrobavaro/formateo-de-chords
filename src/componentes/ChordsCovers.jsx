import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_ChordsCovers.scss";
import { BsWhatsapp, BsFacebook, BsInstagram, BsEnvelope } from "react-icons/bs"; // Importar íconos de Bootstrap

const ChordsCovers = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [filterField, setFilterField] = useState("Categoria");
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Cargar datos del archivo JSON
  useEffect(() => {
    fetch("/chordscovers.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        const initialIndexes = {};
        data.forEach((item) => {
          initialIndexes[item.id] = 0;
        });
        setCurrentImageIndex(initialIndexes);
        console.log("Datos cargados:", data);
      })
      .catch((error) => console.error("Error al cargar los datos:", error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filtrar los datos según la categoría seleccionada
  const filteredData = data.filter((item) => {
    const matchesCategory =
      selectedCategory === "TODOS" || item[filterField] === selectedCategory;
    return matchesCategory;
  });

  // Extraer las categorías de los datos
  const categories = [...new Set(data.map((item) => item[filterField]))];

  // Navegar entre las imágenes
  const handleNextImage = (id, totalImages) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [id]: (prevState[id] + 1) % totalImages,
    }));
  };

  const handlePrevImage = (id, totalImages) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [id]: (prevState[id] - 1 + totalImages) % totalImages,
    }));
  };

  // Compartir en WhatsApp
  const shareOnWhatsApp = (item) => {
    const message = `Mirá esta propiedad: ${item.Nombre}.\nDescripción: ${item.Tipo}\nValor alquiler: ${item.Alquilado}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Compartir en Facebook
  const shareOnFacebook = (item) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(facebookUrl, "_blank");
  };

  // Compartir en Instagram
  const shareOnInstagram = (item) => {
    const message = `Mirá esta propiedad: ${item.Nombre}.`;
    const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(
      message
    )}`;
    window.open(instagramUrl, "_blank");
  };

  // Compartir por email
  const shareOnEmail = (item) => {
    const subject = `Interesado en la propiedad: ${item.Nombre}`;
    const body = `Mirá esta propiedad: ${item.Nombre}.\nDescripción: ${item.Tipo}\nValor alquiler: ${item.Alquilado}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="chords-covers-container">
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
              <h3>{item.Nombre}</h3>

              {/* Mostrar las secciones de la canción */}
              <div className="song-sections">
                {item.Secciones.map((section, index) => (
                  <div key={index} className="song-section">
                    <h4>{section.Titulo}</h4>
                    <div className="lyrics">
                      <p>{section.Letras}</p>
                    </div>

                    {/* Acordes de la sección */}
                    <div className="chords-display">
                      <pre className="chords">{section.Acordes}</pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel de imágenes */}
              <div className="image-thumbnails">
                {item["Ver Fotos Propiedad"] && item["Ver Fotos Propiedad"].length > 0 && (
                  <div className="carousel">
                    <button
                      onClick={() =>
                        handlePrevImage(item.id, item["Ver Fotos Propiedad"].length)
                      }
                    >
                      &#9664;
                    </button>
                    <img
                      src={item["Ver Fotos Propiedad"][currentImageIndex[item.id]]}
                      alt={`Foto de ${item.Nombre}`}
                      className="thumbnail"
                    />
                    <button
                      onClick={() =>
                        handleNextImage(item.id, item["Ver Fotos Propiedad"].length)
                      }
                    >
                      &#9654;
                    </button>
                  </div>
                )}
              </div>

              {/* Botones para compartir en redes sociales */}
              <div className="share-buttons">
                <button onClick={() => shareOnWhatsApp(item)}>
                  <BsWhatsapp />
                </button>
                <button onClick={() => shareOnFacebook(item)}>
                  <BsFacebook />
                </button>
                <button onClick={() => shareOnInstagram(item)}>
                  <BsInstagram />
                </button>
                <button onClick={() => shareOnEmail(item)}>
                  <BsEnvelope />
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
