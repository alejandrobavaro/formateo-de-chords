import React, { useState, useEffect, useRef } from "react";
import "../assets/scss/_03-Componentes/_FormateoPartituras.scss";

const FormateoPartituras = () => {
  const [textoInput, setTextoInput] = useState("");
  const [columnas, setColumnas] = useState([[], []]);
  const [fontSize, setFontSize] = useState(14);
  const previewRef = useRef();

  const esLineaAcordes = (linea) =>
    /^[A-G][#b]?(?:m|maj7|m7|7|sus|dim|add)?[\sA-G#b0-9()-]*$/.test(linea.trim());

  const procesarTexto = () => {
    const lineas = textoInput.split("\n");

    const bloques = lineas.map((linea) => {
      if (/INTRO|PRE|ESTRIBILLO|BIS|CORO/i.test(linea)) {
        return { tipo: "titulo", texto: linea };
      }

      if (esLineaAcordes(linea)) {
        return { tipo: "acordes", texto: linea };
      }

      return { tipo: "letra", texto: linea };
    });

    const mitad = Math.ceil(bloques.length / 2);
    setColumnas([bloques.slice(0, mitad), bloques.slice(mitad)]);
  };

  // Ajuste automático A4
  useEffect(() => {
    if (!previewRef.current) return;
    const MAX_HEIGHT = 1123;
    let size = 14;
    const el = previewRef.current;

    const ajustar = () => {
      el.style.fontSize = `${size}px`;
      if (el.scrollHeight > MAX_HEIGHT && size > 9) {
        size -= 0.5;
        requestAnimationFrame(ajustar);
      } else {
        setFontSize(size);
      }
    };
    ajustar();
  }, [columnas]);

  return (
    <div className="formateo-unificado-container">
      <h1 className="formateo-titulo">🎼 Formateo de Chords (modo real)</h1>

      <div className="formateo-wrapper">
        <div className="input-section">
          <h2>Chord original</h2>
          <textarea
            value={textoInput}
            onChange={(e) => setTextoInput(e.target.value)}
            placeholder="Pegá el chord tal cual viene..."
          />
          <div className="acciones">
            <button onClick={procesarTexto}>Formatear</button>
          </div>
        </div>

        <div
          className="preview-section"
          ref={previewRef}
          style={{ fontSize }}
        >
          <h2>Vista A4</h2>

          <div className="partitura">
            <div className="columnas">
              {columnas.map((col, i) => (
                <div key={i} className="columna">
                  {col.map((b, idx) => (
                    <pre
                      key={idx}
                      className={`linea ${b.tipo}`}
                    >
                      {b.texto}
                    </pre>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormateoPartituras;
