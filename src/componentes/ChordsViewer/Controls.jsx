// ============================================
// ARCHIVO: Controls.jsx - VERSIÓN ULTRA COMPACTA
// OBJETIVO: Reducir controles a una sola línea muy compacta
// ============================================

import React from "react";
import { 
  BsPrinter, 
  BsFiletypePdf, 
  BsFiletypeJpg, 
  BsMusicNoteBeamed,
  BsDash,
  BsPlus,
  BsAspectRatio
} from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_Controls.scss";

const Controls = ({
  transposition,
  setTransposition,
  showA4Outline,
  setShowA4Outline,
  onExportPDF,
  onExportJPG,
  onPrint,
  hasSelectedSong
}) => {
  return (
    <div className="controls-micro-line">
      
      {/* Control de transposición compacto */}
      <div className="control-group-micro">
        <button
          onClick={() => setTransposition(transposition - 1)}
          className="control-btn-micro transp-btn-micro"
          disabled={!hasSelectedSong}
          title="Bajar semitono"
        >
          <BsDash />
        </button>
        <span className="transp-value-micro">
          {transposition > 0 ? "+" : ""}{transposition}
        </span>
        <button
          onClick={() => setTransposition(transposition + 1)}
          className="control-btn-micro transp-btn-micro"
          disabled={!hasSelectedSong}
          title="Subir semitono"
        >
          <BsPlus />
        </button>
        <span className="control-icon-micro">
          <BsMusicNoteBeamed />
        </span>
      </div>

      {/* Separador */}
      <div className="control-separator-micro"></div>

      {/* Guía A4 mini */}
      <button
        onClick={() => setShowA4Outline(!showA4Outline)}
        className={`control-btn-micro outline-btn-micro ${showA4Outline ? 'active' : ''}`}
        disabled={!hasSelectedSong}
        title={showA4Outline ? "Sin guía" : "Guía A4"}
      >
        <BsAspectRatio />
      </button>

      {/* Separador */}
      <div className="control-separator-micro"></div>

      {/* Exportación mini */}
      <div className="control-group-micro">
        <button 
          onClick={onExportPDF} 
          className="control-btn-micro export-btn-micro"
          title="Exportar PDF"
          disabled={!hasSelectedSong}
        >
          <BsFiletypePdf />
        </button>
        <button 
          onClick={onExportJPG} 
          className="control-btn-micro export-btn-micro"
          title="Exportar JPG"
          disabled={!hasSelectedSong}
        >
          <BsFiletypeJpg />
        </button>
        <button 
          onClick={onPrint} 
          className="control-btn-micro export-btn-micro"
          title="Imprimir"
          disabled={!hasSelectedSong}
        >
          <BsPrinter />
        </button>
      </div>

    </div>
  );
};

export default Controls;