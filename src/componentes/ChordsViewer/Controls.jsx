// ======================================================
// IMPORTACIONES
// ======================================================
import React from "react";
import { BsPrinter, BsFiletypePdf, BsFiletypeJpg } from "react-icons/bs";
import { MdMusicNote, MdOutlinePictureAsPdf, MdImage } from "react-icons/md";
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
    <div className="controls-excel-compact">
      
      {/* Transposición compacta - Control de semitonos */}
      <div className="control-group-micro" title="Transposición de acordes">
        <span className="micro-label">
          <MdMusicNote size={10} />
        </span>
        <div className="btn-group-micro">
          <button
            onClick={() => setTransposition(transposition - 1)}
            className="micro-btn"
            disabled={!hasSelectedSong}
            title="Bajar semitono (-1)"
          >
            -
          </button>
          <span className="micro-value">
            {transposition > 0 ? "+" : ""}{transposition}
          </span>
          <button
            onClick={() => setTransposition(transposition + 1)}
            className="micro-btn"
            disabled={!hasSelectedSong}
            title="Subir semitono (+1)"
          >
            +
          </button>
        </div>
      </div>

      {/* Checkbox A4 micro - Visualización de bordes A4 */}
      <div className="control-group-micro" title="Mostrar/ocultar bordes A4">
        <span className="micro-label">A4</span>
        <label className="micro-checkbox-container">
          <input
            type="checkbox"
            checked={showA4Outline}
            onChange={() => setShowA4Outline(!showA4Outline)}
            className="micro-checkbox"
            disabled={!hasSelectedSong}
          />
          <span className="micro-checkbox-custom"></span>
        </label>
      </div>

      {/* Exportación compacta - Botones de exportación e impresión */}
      <div className="control-group-micro" title="Opciones de exportación">
        <span className="micro-label">Exp</span>
        <div className="export-group-micro">
          <button 
            onClick={onExportPDF} 
            className="micro-export-btn pdf-btn" 
            title="Exportar a PDF"
            disabled={!hasSelectedSong}
          >
            <BsFiletypePdf size={10} />
          </button>
          <button 
            onClick={onExportJPG} 
            className="micro-export-btn jpg-btn" 
            title="Exportar a JPG"
            disabled={!hasSelectedSong}
          >
            <MdImage size={10} />
          </button>
          <button 
            onClick={onPrint} 
            className="micro-export-btn print-btn" 
            title="Imprimir canción"
            disabled={!hasSelectedSong}
          >
            <BsPrinter size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;