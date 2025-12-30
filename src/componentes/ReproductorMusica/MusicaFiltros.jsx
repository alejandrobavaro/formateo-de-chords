// ============================================
// ARCHIVO: MusicaFiltros.jsx - VERSIÓN 5 CATEGORÍAS
// DESCRIPCIÓN: Filtros para las 5 categorías musicales
// ============================================

import React, { useState } from 'react';
import { 
  BsFilter, 
  BsSearch, 
  BsMusicNoteBeamed, 
  BsCollectionPlay,
  BsMic,
  BsGuitar,
  BsVinyl,
  BsStar,
  BsKeyboard
} from 'react-icons/bs';
import './MusicaFiltros.scss';

const MusicaFiltros = ({ 
  categoria, 
  setCategoria,
  bloqueActual,
  setBloqueActual,
  bloques,
  searchQuery,
  setSearchQuery,
  loading 
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // ICONOS POR CATEGORÍA (5 CATEGORÍAS)
  const getIconoCategoria = (cat) => {
    const iconos = {
      'original': <BsMic />,
      'covers': <BsGuitar />, 
      'medleys': <BsVinyl />,
      'homenajes': <BsStar />,
      'zapadas': <BsKeyboard />
    };
    return iconos[cat] || <BsMusicNoteBeamed />;
  };
  
  // NOMBRES DE CATEGORÍA
  const getNombreCategoria = (cat) => {
    const nombres = {
      'original': 'Original',
      'covers': 'Covers',
      'medleys': 'Medleys',
      'homenajes': 'Homenajes',
      'zapadas': 'Zapadas'
    };
    return nombres[cat] || cat;
  };
  
  // DESCRIPCIÓN DE CATEGORÍA
  const getDescripcionCategoria = (cat) => {
    const descripciones = {
      'original': 'Musica Original',
      'covers': 'Covers Versionados',
      'medleys': 'Canciones Enganchadas',
      'homenajes': 'Tributos Musicales',
      'zapadas': 'Sesiones Espontáneas'
    };
    return descripciones[cat] || '';
  };

  // TÍTULO PARA EL SELECTOR DE BLOQUE
  const getTituloBloques = (cat) => {
    const titulos = {
      'original': 'Seleccionar Disco',
      'covers': 'Seleccionar Género',
      'medleys': 'Seleccionar Medley',
      'homenajes': 'Seleccionar Artista',
      'zapadas': 'Seleccionar Estilo'
    };
    return titulos[cat] || 'Seleccionar';
  };

  return (
    <div className="musica-filtros-container">
      
      {/* BOTÓN TOGGLE PARA MOBILE */}
      <button 
        className="filtros-toggle-mobile"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        <BsFilter />
        <span>Filtros</span>
        <span className="filtros-badge">{Object.keys(bloques).length}</span>
      </button>
      
      {/* CONTENEDOR DE FILTROS */}
      <div className={`filtros-contenedor ${mostrarFiltros ? 'visible' : ''}`}>
        
        {/* ============================================
            SELECTOR DE CATEGORÍA (5 OPCIONES)
        ============================================ */}
        <div className="categorias-seccion">
          <h3 className="filtros-titulo">
            <BsMusicNoteBeamed />
            <span>Seleccionar Categoría</span>
          </h3>
          
          <div className="categorias-grid">
            {['original', 'covers', 'medleys', 'homenajes', 'zapadas'].map(cat => (
              <button
                key={cat}
                className={`categoria-card ${categoria === cat ? 'categoria-activa' : ''}`}
                onClick={() => {
                  setCategoria(cat);
                  setSearchQuery('');
                  // Resetear al primer bloque de la categoría
                  if (bloques[cat] && Object.keys(bloques[cat]).length > 0) {
                    const primerBloque = Object.keys(bloques[cat])[0];
                    setBloqueActual(primerBloque);
                  }
                }}
                title={getDescripcionCategoria(cat)}
              >
                <div className="categoria-icono">
                  {getIconoCategoria(cat)}
                </div>
                <div className="categoria-info">
                  <h4>{getNombreCategoria(cat)}</h4>
                  <p>{getDescripcionCategoria(cat)}</p>
                </div>
                <div className="categoria-badge">
                  {bloques[cat] ? Object.keys(bloques[cat]).length : 0}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* ============================================
            SELECTOR DE BLOQUE/DISCO
        ============================================ */}
        {bloques[categoria] && Object.keys(bloques[categoria]).length > 0 && (
          <div className="bloques-seccion">
            <h3 className="filtros-titulo">
              <BsCollectionPlay />
              <span>{getTituloBloques(categoria)}</span>
            </h3>
            
            <div className="bloques-grid">
              {Object.entries(bloques[categoria]).map(([bloqueId, bloque]) => (
                <button
                  key={bloqueId}
                  className={`bloque-card ${bloqueActual === bloqueId ? 'bloque-activo' : ''}`}
                  onClick={() => setBloqueActual(bloqueId)}
                >
                  <div className="bloque-portada">
                    <img 
                      src={bloque.portada || '/img/default-cover.png'} 
                      alt={bloque.nombre}
                      onError={(e) => {
                        e.target.src = '/img/default-cover.png';
                      }}
                    />
                  </div>
                  <div className="bloque-info">
                    <h4>{bloque.nombre}</h4>
                    <div className="bloque-meta">
                      <span className="bloque-canciones">
                        {bloque.canciones?.length || 0} canciones
                      </span>
                      {bloque.genero && (
                        <span className="bloque-genero">{bloque.genero}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* SELECTOR DROPDOWN PARA MOBILE */}
            <div className="bloques-select-mobile">
              <select
                value={bloqueActual}
                onChange={(e) => setBloqueActual(e.target.value)}
                disabled={loading}
              >
                {Object.entries(bloques[categoria]).map(([bloqueId, bloque]) => (
                  <option key={bloqueId} value={bloqueId}>
                    {bloque.nombre} ({bloque.canciones?.length || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* ============================================
            BUSCADOR
        ============================================ */}
        <div className="buscador-seccion">
          <h3 className="filtros-titulo">
            <BsSearch />
            <span>Buscar Canción</span>
          </h3>
          
          <div className="buscador-contenedor">
            <input
              type="text"
              className="buscador-input"
              placeholder={`Buscar en ${getNombreCategoria(categoria)}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
            <button 
              className="buscador-limpiar"
              onClick={() => setSearchQuery('')}
              disabled={!searchQuery}
            >
              ✕
            </button>
          </div>
          
          {searchQuery && (
            <div className="buscador-info">
              <span>Buscando: "{searchQuery}"</span>
            </div>
          )}
        </div>
        
      </div>
      
    </div>
  );
};

export default MusicaFiltros;