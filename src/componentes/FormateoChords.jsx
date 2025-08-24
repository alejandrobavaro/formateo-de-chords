import React, { useState, useEffect } from "react";
import { 
  FiMusic, 
  FiDownload, 
  FiCopy, 
  FiEdit2,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter
} from "react-icons/fi";

import "../assets/scss/_03-Componentes/_FormateoChords.scss";

const FormateoChords = () => {
  const [chords, setChords] = useState([]);
  const [filteredChords, setFilteredChords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODOS");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedChord, setSelectedChord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChordsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/chordsData.json");
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const chordsData = await response.json();
        setChords(chordsData);
        setFilteredChords(chordsData);
        
      } catch (error) {
        console.error("Error cargando los acordes:", error);
        setError("No se pudieron cargar los acordes. Por favor, intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadChordsData();
  }, []);

  // Filtrar acordes por búsqueda y categoría
  useEffect(() => {
    let results = chords;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      results = results.filter(chord =>
        chord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chord.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chord.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== "TODOS") {
      results = results.filter(chord => chord.category === selectedCategory);
    }
    
    setFilteredChords(results);
  }, [searchTerm, selectedCategory, chords]);

  // Obtener categorías únicas
  const categories = ["TODOS", ...new Set(chords.map(chord => chord.category))];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleChordSelect = (chord) => {
    setSelectedChord(chord);
  };

  const handleCopyChord = (chordName) => {
    navigator.clipboard.writeText(chordName);
    // Aquí podrías agregar una notificación de copiado exitoso
  };

  const handleDownloadChord = (chordImage, chordName) => {
    const link = document.createElement("a");
    link.href = chordImage;
    link.download = `${chordName.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const renderChordDetail = () => {
    if (!selectedChord) return null;

    return (
      <div className="chord-detail-modal">
        <div className="chord-detail-content">
          <button 
            className="close-button"
            onClick={() => setSelectedChord(null)}
          >
            ×
          </button>
          
          <div className="chord-detail-header">
            <h2>{selectedChord.name}</h2>
            <span className="chord-category">{selectedChord.category}</span>
          </div>

          <div className="chord-detail-body">
            <img 
              src={selectedChord.image} 
              alt={selectedChord.name}
              className="chord-detail-image"
            />
            
            <div className="chord-detail-info">
              <h3>Descripción</h3>
              <p>{selectedChord.description}</p>
              
              <h3>Posición de Dedos</h3>
              <p>{selectedChord.fingering || "Información de digitación no disponible."}</p>
              
              <h3>Notas del Acorde</h3>
              <p>{selectedChord.notes || "Do - Mi - Sol"}</p>
            </div>
          </div>

          <div className="chord-detail-actions">
            <button 
              className="action-button copy-button"
              onClick={() => handleCopyChord(selectedChord.name)}
            >
              <FiCopy className="button-icon" />
              Copiar Nombre
            </button>
            
            <button 
              className="action-button download-button"
              onClick={() => handleDownloadChord(selectedChord.image, selectedChord.name)}
            >
              <FiDownload className="button-icon" />
              Descargar Imagen
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="formateo-chords-container">
        <Sidebar />
        <div className="loading-state">
          <FiMusic className="loading-icon" />
          <p>Cargando acordes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="formateo-chords-container">
        <Sidebar />
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="formateo-chords-container">
      <Sidebar />
      
      <div className="formateo-content">
        
        {/* Header del Formateo de Acordes */}
        <div className="formateo-header">
          <div className="header-content">
            <FiMusic className="header-icon" />
            <h1>Biblioteca de Acordes</h1>
            <p>Explora, visualiza y utiliza todos los acordes para tus composiciones</p>
          </div>
        </div>

        {/* Controles de Filtrado y Búsqueda */}
        <div className="controls-panel">
          <div className="search-section">
            <div className="search-input-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar acordes por nombre, descripción o categoría..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters-section">
            <div className="view-mode-toggle">
              <button
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
              >
                <FiGrid className="button-icon" />
                Cuadrícula
              </button>
              <button
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
              >
                <FiList className="button-icon" />
                Lista
              </button>
            </div>

            <div className="category-filters">
              <span className="filter-label">
                <FiFilter className="filter-icon" />
                Filtrar por:
              </span>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Información de Resultados */}
        <div className="results-info">
          <p>
            Mostrando <strong>{filteredChords.length}</strong> de <strong>{chords.length}</strong> acordes
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategory !== "TODOS" && ` en ${selectedCategory}`}
          </p>
        </div>

        {/* Galería de Acordes */}
        <div className={`chords-container ${viewMode}-view`}>
          {filteredChords.length === 0 ? (
            <div className="no-results">
              <FiMusic className="no-results-icon" />
              <h3>No se encontraron acordes</h3>
              <p>Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
            </div>
          ) : (
            filteredChords.map((chord, index) => (
              <div 
                key={index} 
                className="chord-item"
                onClick={() => handleChordSelect(chord)}
              >
                <div className="chord-image-container">
                  <img 
                    src={chord.image} 
                    alt={chord.name}
                    className="chord-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="chord-placeholder">
                    <FiMusic className="placeholder-icon" />
                  </div>
                  <div className="chord-overlay">
                    <button className="overlay-button">
                      <FiEdit2 className="button-icon" />
                      Ver Detalles
                    </button>
                  </div>
                </div>
                
                <div className="chord-info">
                  <h3 className="chord-name">{chord.name}</h3>
                  <p className="chord-description">{chord.description}</p>
                  <span className="chord-category">{chord.category}</span>
                </div>

                <div className="chord-actions">
                  <button 
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyChord(chord.name);
                    }}
                  >
                    <FiCopy />
                  </button>
                  <button 
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadChord(chord.image, chord.name);
                    }}
                  >
                    <FiDownload />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalle de Acorde */}
        {renderChordDetail()}

      </div>
    </div>
  );
};

export default FormateoChords;