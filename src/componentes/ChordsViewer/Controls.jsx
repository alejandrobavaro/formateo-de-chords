import React from 'react';
import "../../assets/scss/_03-Componentes/ChordsViewer/_Controls.scss";

const Controls = ({
  fontSize,
  setFontSize,
  transposition,
  setTransposition,
  showA4Outline,
  setShowA4Outline
}) => {
  return (
    <div className="controls-compact">
      <div className="control-group">
        <label>Tamaño:</label>
        <input
          type="range"
          min="8"
          max="18"
          step="1"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="font-size-slider"
        />
        <span>{fontSize}px</span>
      </div>
      
      <div className="control-group">
        <label>Transp.:</label>
        <button 
          onClick={() => setTransposition(transposition - 1)}
          className="control-btn"
        >-</button>
        <span className="transposition-value">
          {transposition > 0 ? '+' : ''}{transposition}
        </span>
        <button 
          onClick={() => setTransposition(transposition + 1)}
          className="control-btn"
        >+</button>
        <button 
          onClick={() => setTransposition(0)}
          className="control-btn reset"
        >R</button>
      </div>
      
      <div className="control-group">
        <label>A4:</label>
        <input
          type="checkbox"
          checked={showA4Outline}
          onChange={() => setShowA4Outline(!showA4Outline)}
          className="a4-toggle"
        />
      </div>
    </div>
  );
};

export default Controls;