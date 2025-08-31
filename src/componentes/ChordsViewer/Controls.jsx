import React from "react";
import { BsDownload, BsPrinter } from "react-icons/bs";
import "../../assets/scss/_03-Componentes/ChordsViewer/_Controls.scss";

const Controls = ({
  fontSize,
  setFontSize,
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
    <div className="controls-unificado">
      {/* Grupo de transposición */}
      <div className="control-group">
        <label>Transposición</label>
        <div className="btn-group">
          <button
            onClick={() => setTransposition(transposition - 1)}
            className="control-btn"
            disabled={!hasSelectedSong}
          >
            -
          </button>
          <span className="transposition-value">
            {transposition > 0 ? "+" : ""}
            {transposition}
          </span>
          <button
            onClick={() => setTransposition(transposition + 1)}
            className="control-btn"
            disabled={!hasSelectedSong}
          >
            +
          </button>
          <button
            onClick={() => setTransposition(0)}
            className="control-btn reset"
            disabled={!hasSelectedSong}
          >
            R
          </button>
        </div>
      </div>

      {/* Grupo de tamaño de fuente */}
      <div className="control-group">
        <label>Tamaño</label>
        <input
          type="range"
          min="12"
          max="28"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="font-size-slider"
          disabled={!hasSelectedSong}
        />
        <span className="font-size-value">{fontSize}px</span>
      </div>

      {/* Grupo de bordes */}
      <div className="control-group toggle-group">
        <label>Bordes A4</label>
        <input
          type="checkbox"
          checked={showA4Outline}
          onChange={() => setShowA4Outline(!showA4Outline)}
          className="a4-toggle"
          disabled={!hasSelectedSong}
        />
      </div>

      {/* BOTONES DE EXPORTACIÓN */}
      <div className="control-group export-group">
        <label>Exportar</label>
        <div className="export-buttons">
          <button 
            onClick={onExportPDF} 
            className="export-btn" 
            title="Exportar PDF"
            disabled={!hasSelectedSong}
          >
            <BsDownload /> PDF
          </button>
          <button 
            onClick={onExportJPG} 
            className="export-btn" 
            title="Exportar JPG"
            disabled={!hasSelectedSong}
          >
            <BsDownload /> JPG
          </button>
          <button 
            onClick={onPrint} 
            className="export-btn" 
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