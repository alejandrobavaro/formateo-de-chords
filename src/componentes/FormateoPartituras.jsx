import React, { useState, useEffect, useRef } from "react";
import "../assets/scss/_03-Componentes/_FormateoPartituras.scss";

const FormateoPartituras = () => {
  const [textoInput, setTextoInput] = useState("");
  const [columnas, setColumnas] = useState([[], []]);
  const [fontSize, setFontSize] = useState(16); // tamaño inicial en px
  const previewRef = useRef();

  const colorVoz1 = "#ffe5e5";
  const colorVoz2 = "#e5f0ff";

  const chordRegex = /\b[A-G][#b]?m?(maj7|m7|7|sus4|sus2|dim|add9)?\b/g;

  const procesarTexto = () => {
    if (!textoInput) return;

    const lineas = textoInput.split("\n");
    const bloques = [];
    let currentVoz = null;

    lineas.forEach((linea) => {
      let bloque = { tipo: "texto", lineParts: [], voz: null };

      if (/INTRO|PRE-ESTRIBILLO|ESTRIBILLO|CORO|RIFF/i.test(linea)) {
        bloque.tipo = "titulo";
        bloque.lineParts.push({ texto: linea, tipo: "titulo" });
      } else {
        const parts = [];
        let lastIndex = 0;
        linea.replace(chordRegex, (match, offset) => {
          if (offset > lastIndex) {
            parts.push({ texto: linea.slice(lastIndex, offset), tipo: "texto" });
          }
          parts.push({ texto: match, tipo: "acorde" });
          lastIndex = offset + match.length;
        });
        if (lastIndex < linea.length) {
          parts.push({ texto: linea.slice(lastIndex), tipo: "texto" });
        }
        bloque.lineParts = parts;
      }

      if (/VOZ ALE/i.test(linea)) {
        currentVoz = "VOZ1";
      } else if (/VOZ PATO/i.test(linea)) {
        currentVoz = "VOZ2";
      }
      bloque.voz = currentVoz;
      bloques.push(bloque);
    });

    const mitad = Math.ceil(bloques.length / 2);
    setColumnas([bloques.slice(0, mitad), bloques.slice(mitad)]);
  };

  // Ajusta tamaño de fuente para que quepa en A4
  useEffect(() => {
    if (!previewRef.current) return;
    const MAX_HEIGHT = 1123; // altura A4 px aprox
    let currentFont = 16; // tamaño inicial
    const step = 0.5; // decremento por iteración
    const container = previewRef.current;

    const ajustarFuente = () => {
      container.style.fontSize = `${currentFont}px`;
      if (container.scrollHeight > MAX_HEIGHT && currentFont > 8) {
        currentFont -= step;
        requestAnimationFrame(ajustarFuente);
      } else {
        setFontSize(currentFont);
      }
    };
    ajustarFuente();
  }, [columnas]);

  const copiarPartitura = () => {
    if (!previewRef.current) return;
    const textoPlano = columnas
      .map((col) =>
        col
          .map((bloque) => bloque.lineParts.map((p) => p.texto).join(""))
          .join("\n")
      )
      .join("\n------------------------\n");
    navigator.clipboard.writeText(textoPlano);
    alert("Partitura copiada al portapapeles!");
  };

  return (
    <div className="formateo-unificado-container">
      <h1 className="formateo-titulo">🎼 Formateo de Partituras / Chords</h1>

      <div className="formateo-wrapper">
        {/* Textarea para pegar la canción */}
        <div className="input-section">
          <h2>Texto sin formato</h2>
          <textarea
            value={textoInput}
            onChange={(e) => setTextoInput(e.target.value)}
            placeholder="Pega aquí tu canción con acordes..."
          ></textarea>
          <div className="acciones">
            <button onClick={procesarTexto}>Formatear</button>
            <button onClick={copiarPartitura}>Copiar partitura</button>
          </div>
        </div>

        {/* Vista previa */}
        <div className="preview-section" ref={previewRef} style={{ fontSize: `${fontSize}px` }}>
          <h2>Vista formateada</h2>
          <div className="partitura">
            <div className="columnas">
              {columnas.map((col, i) => (
                <div key={i} className="columna">
                  {col.map((bloque, idx) => (
                    <div
                      key={idx}
                      className={`bloque ${
                        bloque.voz === "VOZ1" ? "voz1" : bloque.voz === "VOZ2" ? "voz2" : ""
                      }`}
                    >
                      {bloque.tipo === "titulo" ? (
                        <div className="seccion-titulo">{bloque.lineParts[0].texto}</div>
                      ) : (
                        <pre className="texto">
                          {bloque.lineParts.map((p, i) => (
                            <span key={i} className={p.tipo === "acorde" ? "acorde" : ""}>
                              {p.texto}
                            </span>
                          ))}
                        </pre>
                      )}
                    </div>
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