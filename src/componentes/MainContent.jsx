// ======================================================
// MAINCONTENT.JSX - VERSIÓN ACTUALIZADA
// ======================================================

import React from "react";
import { Link } from "react-router-dom";
import { 
  BsMusicNoteBeamed, 
  BsFilm,
  BsPlayCircle,
  BsBook,
  BsGear,
  BsEnvelope,
  BsLightning,
  BsHouse
} from "react-icons/bs";

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================
const MainContent = () => {
  
  // ======================================================
  // TARJETAS DE ACCIÓN RÁPIDA (ACTUALIZADAS)
  // ======================================================
  const actionCards = [
    {
      title: "Inicio",
      description: "Página principal",
      icon: <BsHouse />,
      path: "/",
      color: "#ffd166"
    },
    {
      title: "Música",
      description: "Reproductor con visualizador de acordes",
      icon: <BsMusicNoteBeamed />,
      path: "/musica",
      color: "#e63946",
      primary: true
    },
    {
      title: "Videos",
      description: "Reproductor de video musical",
      icon: <BsFilm />,
      path: "/Videos",
      color: "#118ab2"
    },
    {
      title: "Pistas",
      description: "Próximamente",
      icon: <BsPlayCircle />,
      path: "#",
      color: "#06d6a0",
      disabled: true
    },
    {
      title: "Teoría",
      description: "Teoría musical y recursos",
      icon: <BsBook />,
      path: "/formateo-chords",
      color: "#7209b7"
    },
    {
      title: "Formateo",
      description: "Formateo de partituras",
      icon: <BsGear />,
      path: "/chords-format",
      color: "#f15bb5"
    },
    {
      title: "Contacto",
      description: "Información de contacto",
      icon: <BsEnvelope />,
      path: "/contacto",
      color: "#4cc9f0"
    }
  ];

  // ======================================================
  // FUNCIÓN: MANEJAR CLIC EN BOTÓN DESHABILITADO
  // ======================================================
  const handleDisabledClick = (e) => {
    e.preventDefault();
    alert("Pistas está en desarrollo. Próximamente disponible.");
  };

  // ======================================================
  // RENDER PRINCIPAL
  // ======================================================
  return (
    <div className="main-content-compact">
      
      {/* ====================================================== */}
      {/* HERO SECTION COMPACTA */}
      {/* ====================================================== */}
      <section className="hero-compact">
        <div className="hero-content">
          <h1 className="hero-title">
            <BsLightning className="hero-icon" />
            Rockola Cancioneros
          </h1>
          <p className="hero-subtitle">
            Tu herramienta completa para música, acordes y partituras
          </p>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ACCESOS DIRECTOS - GRID COMPACTO */}
      {/* ====================================================== */}
      <section className="quick-access-section">
        <h2 className="section-title">Acceso Rápido</h2>
        <div className="cards-grid-compact">
          {actionCards.map((card, index) => (
            card.disabled ? (
              <button
                key={index}
                className="action-card-compact action-card-disabled"
                onClick={handleDisabledClick}
                style={{ borderTopColor: card.color }}
              >
                <div className="card-icon-compact" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="card-content-compact">
                  <h3 className="card-title-compact">{card.title}</h3>
                  <p className="card-desc-compact">{card.description}</p>
                  <span className="card-badge">Pronto</span>
                </div>
              </button>
            ) : (
              <Link 
                key={index} 
                to={card.path} 
                className={`action-card-compact ${card.primary ? 'action-card-primary' : ''}`}
                style={{ borderTopColor: card.color }}
              >
                <div className="card-icon-compact" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="card-content-compact">
                  <h3 className="card-title-compact">{card.title}</h3>
                  <p className="card-desc-compact">{card.description}</p>
                </div>
              </Link>
            )
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* INFORMACIÓN RÁPIDA */}
      {/* ====================================================== */}
      <section className="info-section-compact">
        <div className="info-grid-compact">
          <div className="info-item-compact">
            <div className="info-icon">🎵</div>
            <h4>Reproductor Completo</h4>
            <p>Escucha música con visualizador de acordes integrado</p>
          </div>
          <div className="info-item-compact">
            <div className="info-icon">🎸</div>
            <h4>Acordes Inteligentes</h4>
            <p>Visualiza y transpone acordes en tiempo real</p>
          </div>
          <div className="info-item-compact">
            <div className="info-icon">📺</div>
            <h4>Videos Musicales</h4>
            <p>Reproductor de video con lista de reproducción</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MainContent;