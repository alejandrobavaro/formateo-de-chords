// components/Sidebar.jsx (actualizado)
import React, { useState, useEffect } from "react";
import {
  FiArrowLeftCircle,
  FiCreditCard,
  FiBriefcase,
  FiHelpCircle,
  FiMusic,
  FiType,
  FiList,
  FiSettings,
  FiMinimize,
  FiColumns,
  FiGrid,
  FiPlus,
  FiMinus
} from "react-icons/fi";
import "../assets/scss/_03-Componentes/_Sidebar.scss";

const Sidebar = ({ onTransposeChange, onViewModeChange, onFontSizeChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [transposition, setTransposition] = useState(0);
  const [viewMode, setViewMode] = useState('default');
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleTranspose = (step) => {
    const newTransposition = transposition + step;
    setTransposition(newTransposition);
    if (onTransposeChange) onTransposeChange(newTransposition);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (onViewModeChange) onViewModeChange(mode);
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    if (onFontSizeChange) onFontSizeChange(newSize);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        aria-expanded={!isCollapsed}
      >
        <FiArrowLeftCircle />
      </button>

      <div className="sidebar-content">
        
        {/* Sección de Transposición */}
        <div className="sidebar-section">
          <h2 className="section-title">
            <FiCreditCard className="section-icon" />
            <span className="section-text">Tono</span>
          </h2>
          <ul className="section-list">
            <li className="list-item" onClick={() => handleTranspose(-1)}>
              <FiMinus className="item-icon" />
              <span>Bajar Tono</span>
            </li>
            <li className="list-item" onClick={() => handleTranspose(1)}>
              <FiPlus className="item-icon" />
              <span>Subir Tono</span>
            </li>
            <li className="list-item">
              <span className="transposition-value">Actual: {transposition > 0 ? '+' : ''}{transposition}</span>
            </li>
          </ul>
        </div>

        {/* Sección de Visualización */}
        <div className="sidebar-section">
          <h2 className="section-title">
            <FiGrid className="section-icon" />
            <span className="section-text">Visualización</span>
          </h2>
          <ul className="section-list">
            <li className="list-item" onClick={() => handleViewModeChange('default')}>
              <FiGrid className="item-icon" />
              <span>Normal</span>
            </li>
            <li className="list-item" onClick={() => handleViewModeChange('compact')}>
              <FiMinimize className="item-icon" />
              <span>Compacto</span>
            </li>
            <li className="list-item">
              <FiType className="item-icon" />
              <span>Tamaño: {fontSize}%</span>
              <input 
                type="range" 
                min="70" 
                max="130" 
                step="5"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="font-size-slider"
              />
            </li>
          </ul>
        </div>

        {/* Sección de Exportación */}
        <div className="sidebar-section">
          <h2 className="section-title">
            <FiBriefcase className="section-icon" />
            <span className="section-text">Exportar</span>
          </h2>
          <ul className="section-list">
            <li className="list-item">
              <FiSettings className="item-icon" />
              <span>PDF A4</span>
            </li>
            <li className="list-item">
              <FiSettings className="item-icon" />
              <span>Imagen</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;