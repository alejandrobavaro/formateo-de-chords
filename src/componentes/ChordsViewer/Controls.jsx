// ======================================================
// COMPONENTE CONTROLES COMPACTO (Modificado)
// ======================================================
import React from "react";
import { BsPrinter, BsFiletypePdf, BsFiletypeJpg, BsMusicNoteBeamed } from "react-icons/bs";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
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
    <div className="controls-compact-grid">
      
      {/* Transposición */}
      <div className="control-item">
        <div className="control-header">
          <BsMusicNoteBeamed className="control-icon" />
          <span className="control-label">Transposición</span>
        </div>
        <div className="transposition-controls">
          <button
            onClick={() => setTransposition(transposition - 1)}
            className="transp-btn"
            disabled={!hasSelectedSong}
            title="Bajar semitono"
          >
            -
          </button>
          <span className="transp-value">
            {transposition > 0 ? "+" : ""}{transposition}
          </span>
          <button
            onClick={() => setTransposition(transposition + 1)}
            className="transp-btn"
            disabled={!hasSelectedSong}
            title="Subir semitono"
          >
            +
          </button>
        </div>
      </div>

      {/* Visualización A4 */}
      <div className="control-item">
        <div className="control-header">
          <span className="control-label">Guía A4</span>
        </div>
        <label className="checkbox-control">
          <input
            type="checkbox"
            checked={showA4Outline}
            onChange={() => setShowA4Outline(!showA4Outline)}
            className="checkbox-input"
            disabled={!hasSelectedSong}
          />
          <span className="checkbox-custom">
            {showA4Outline ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank />}
          </span>
          <span className="checkbox-label">Mostrar bordes</span>
        </label>
      </div>

      {/* Exportación */}
      <div className="control-item">
        <div className="control-header">
          <span className="control-label">Exportar</span>
        </div>
        <div className="export-controls">
          <button 
            onClick={onExportPDF} 
            className="export-btn" 
            title="Exportar a PDF"
            disabled={!hasSelectedSong}
          >
            <BsFiletypePdf />
          </button>
          <button 
            onClick={onExportJPG} 
            className="export-btn" 
            title="Exportar a JPG"
            disabled={!hasSelectedSong}
          >
            <BsFiletypeJpg />
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