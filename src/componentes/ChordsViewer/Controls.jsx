// src/componentes/ChordsViewer/Controls.jsx
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
    <div className="controls-single-line">
      
      {/* Control de transposición */}
      <div className="control-group">
        <span className="control-label">
          <BsMusicNoteBeamed className="control-icon" />
          Tono:
        </span>
        <div className="transposition-controls">
          <button
            onClick={() => setTransposition(transposition - 1)}
            className="control-btn transp-btn"
            disabled={!hasSelectedSong}
            title="Bajar semitono"
          >
            <BsDash />
          </button>
          <span className="transp-value">
            {transposition > 0 ? "+" : ""}{transposition}
          </span>
          <button
            onClick={() => setTransposition(transposition + 1)}
            className="control-btn transp-btn"
            disabled={!hasSelectedSong}
            title="Subir semitono"
          >
            <BsPlus />
          </button>
        </div>
      </div>

      {/* Separador */}
      <div className="control-separator"></div>

      {/* Guía A4 */}
      <div className="control-group">
        <button
          onClick={() => setShowA4Outline(!showA4Outline)}
          className={`control-btn outline-btn ${showA4Outline ? 'active' : ''}`}
          disabled={!hasSelectedSong}
          title={showA4Outline ? "Ocultar guía A4" : "Mostrar guía A4"}
        >
          <BsAspectRatio />
          <span className="btn-label">A4</span>
        </button>
      </div>

      {/* Separador */}
      <div className="control-separator"></div>

      {/* Exportación */}
      <div className="control-group">
        <span className="control-label">Exportar:</span>
        <div className="export-controls">
          <button 
            onClick={onExportPDF} 
            className="control-btn export-btn"
            title="Exportar a PDF"
            disabled={!hasSelectedSong}
          >
            <BsFiletypePdf />
          </button>
          <button 
            onClick={onExportJPG} 
            className="control-btn export-btn"
            title="Exportar a JPG"
            disabled={!hasSelectedSong}
          >
            <BsFiletypeJpg />
          </button>
          <button 
            onClick={onPrint} 
            className="control-btn export-btn"
            title="Imprimir"
            disabled={!hasSelectedSong}
          >
            <BsPrinter />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Controls;