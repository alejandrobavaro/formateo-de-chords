import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_Sidebar.scss";
import {
  FiArrowLeftCircle,
  FiCreditCard,
  FiBriefcase,
  FiHelpCircle,
} from "react-icons/fi";
import { BsClock } from "react-icons/bs"; // Asegúrate de importar BsClock


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Ejecuta la función en la carga inicial
    window.addEventListener("resize", handleResize); // Añade el event listener para cambios de tamaño de pantalla

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FiArrowLeftCircle />
      </button>
      <div className="sidebar-content">
        <h2>
          <FiCreditCard size={20} color="gray" /> Tono
        </h2>
        <ul>
          <li>Subir o Bajar Tono</li>
          <li>Tamaño Texto</li>
       
        </ul>

        <h2>
          <FiBriefcase size={20} color="gray" /> Listados
        </h2>

        <ul>
          <li>Chords</li>
          <li>Partes Canción</li>
          <li>Instrumentos</li>
        </ul>

        <h2>
          <BsClock size={20} color="gray" /> Otros
        </h2>
        <ul>
          <li>Afinacion</li>
          <li>Transportador</li>
          <li>Metronomo</li>
          <li>To-Do</li>
        </ul>

        <h2>
          <FiHelpCircle size={20} color="gray" /> Pistas
        </h2>
        <ul>
          <li>Por Instrumento</li>
          <li>Todo Mezclado</li>
          <li>Ver Tonalidad</li>
        </ul>
        
      </div>
    </div>
  );
};

export default Sidebar;
