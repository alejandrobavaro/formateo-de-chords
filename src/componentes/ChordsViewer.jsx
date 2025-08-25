import React, { useState, useRef } from "react";
import { BsDownload, BsPrinter } from "react-icons/bs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ChordsViewer = () => {
  const [fontSize, setFontSize] = useState(16);
  const [transposition, setTransposition] = useState(0);
  const [showA4Outline, setShowA4Outline] = useState(true);
  const printViewRef = useRef(null);
  const chordsViewerRef = useRef(null);

  // Función para transponer acordes
  const transposeChord = (chord) => {
    if (!chord || chord === 'N.C.' || chord === '(E)' || chord === '-' || chord === '–') return chord;

    const chords = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const cleanChord = chord.replace(/[()]/g, '');
    const index = chords.indexOf(cleanChord);
    
    if (index === -1) return chord;
    
    const newIndex = (index + transposition + 12) % 12;
    return chords[newIndex];
  };

  // Datos de la canción
  const songData = {
    artist: "Creedence",
    title: "Have You Ever Seen The Rain",
    originalKey: "A"
  };

  // Exportar a PDF
  const handleExportPDF = async () => {
    const element = printViewRef.current;
    const pdf = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${songData.title} - ${songData.artist}.pdf`);
  };

  // Exportar a JPG
  const handleExportJPG = async () => {
    const element = printViewRef.current;
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${songData.title} - ${songData.artist}.jpg`;
    link.click();
  };

  // Imprimir
  const handlePrint = () => {
    window.print();
  };

  // Preparar vista para impresión/exportación
  const preparePrintView = () => {
    return (
      <div className="print-view" ref={printViewRef}>
        <div className="song-header-print">
          <h1 className="song-title-print">{songData.artist} - {songData.title} (TONO: {transposeChord(songData.originalKey)})</h1>
        </div>

        <div className="chords-viewer-print">
          <div className="song-columns-print">
            {/* Columna 1 */}
            <div className="column-print">
              <div className="section-block intro-block">
                <div className="section-title">INTRO:</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">–</span>
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">–</span>
                  <span className="chord">{transposeChord("(E)")}</span>
                  <span className="chord">-</span>
                </div>
                <div className="text-line">(RIFF 1 - A) + (RIFF 2 + A)</div>
              </div>

              <div className="section-divider"></div>

              <div className="voice-block voz-ale-block">
                <div className="voice-label">1º VOZ ALE</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Someone told me long ago</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">There's a calm before the storm, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">And it's been coming for some time.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>

              <div className="voice-block voz-pato-block">
                <div className="voice-label">1º VOZ PATO</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">When it's over, so they say</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">It'll rain a sunny day, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Shining down like water.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>

              <div className="section-divider"></div>

              <div className="section-block estribillo-block">
                <div className="section-title">ESTRIBILLO:</div>
                <div className="voice-block voz-ale-block">
                  <div className="voice-label">1º VOZ ALE</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                  </div>
                </div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">2º VOZ PATO</div>
                  <div className="lyrics-line">I wanna know</div>
                </div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">I wanna know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">1º VOZ PATO</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                    <span className="chord">{transposeChord("A")}</span>
                  </div>
                  <div className="lyrics-line">Coming down on a sunny day.</div>
                </div>
              </div>

              <div className="section-divider"></div>
              <div className="voice-block voz-ale-block">
                <div className="voice-label">1º VOZ ALE</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Yesterday and days before</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">Sun is cold and rain is hard, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Been that way for all my time.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="column-print">
              <div className="voice-block voz-pato-block">
                <div className="voice-label">1º VOZ PATO</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">'Til forever on it goes</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">Thru the circle fast and slow, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">And it can't stop, I wonder.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>

              <div className="section-divider"></div>

              <div className="section-block estribillo-block">
                <div className="section-title">ESTRIBILLO:</div>
                <div className="voice-block voz-ale-block">
                  <div className="voice-label">1º VOZ ALE</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                  </div>
                </div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">2º VOZ PATO</div>
                  <div className="lyrics-line">I wanna know</div>
                </div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">I wanna know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">1º VOZ PATO</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                    <span className="chord">{transposeChord("A")}</span>
                  </div>
                  <div className="lyrics-line">Coming down on a sunny day.</div>
                </div>
              </div>

              <div className="section-divider"></div>

              <div className="voice-block voz-ale-block">
                <div className="voice-label">1º VOZ ALE</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Yeah!!</div>
              </div>

              <div className="section-divider"></div>

              <div className="section-block estribillo-block">
                <div className="section-title">ESTRIBILLO:</div>
                <div className="voice-block voz-ale-block">
                  <div className="voice-label">1º VOZ ALE</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                  </div>
                </div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">2º VOZ PATO</div>
                  <div className="lyrics-line">I wanna know</div>
                </div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">I wanna know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">1º VOZ PATO</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                    <span className="chord">{transposeChord("A")}</span>
                  </div>
                  <div className="lyrics-line">Coming down on a sunny day.</div>
                </div>
              </div>

              <div className="section-divider"></div>

              <div className="text-line">(RIFF 1)</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chords-viewer-container">
      {/* Vista de impresión/exportación (oculta) */}
      <div style={{ display: 'none' }}>
        {preparePrintView()}
      </div>

      {/* Controles */}
      <div className="controls">
        <div className="control-group">
          <label>Tamaño de texto:</label>
          <input
            type="range"
            min="12"
            max="20"
            step="1"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="font-size-slider"
          />
          <span>{fontSize}px</span>
        </div>
        <div className="control-group">
          <label>Transponer:</label>
          <button 
            onClick={() => setTransposition(transposition - 1)}
            className="control-btn"
          >-</button>
          <span className="transposition-value">{transposition > 0 ? '+' : ''}{transposition}</span>
          <button 
            onClick={() => setTransposition(transposition + 1)}
            className="control-btn"
          >+</button>
          <button 
            onClick={() => setTransposition(0)}
            className="control-btn reset"
          >Reset</button>
        </div>
        <div className="control-group">
          <label>Mostrar A4:</label>
          <input
            type="checkbox"
            checked={showA4Outline}
            onChange={() => setShowA4Outline(!showA4Outline)}
            className="a4-toggle"
          />
        </div>
        <div className="control-group export-buttons">
          <button onClick={handleExportJPG} className="export-btn">
            <BsDownload /> JPG
          </button>
          <button onClick={handleExportPDF} className="export-btn">
            <BsDownload /> PDF
          </button>
          <button onClick={handlePrint} className="export-btn">
            <BsPrinter /> Imprimir
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`chords-content ${showA4Outline ? 'a4-outline' : ''}`}>
        {/* Header de la canción */}
        <div className="song-header">
          <h1 className="song-title">{songData.artist} - {songData.title} (TONO: {transposeChord(songData.originalKey)})</h1>
        </div>

        {/* Visor de acordes */}
        <div className="chords-viewer" style={{ fontSize: `${fontSize}px` }} ref={chordsViewerRef}>
          <div className="song-columns">
            {/* Columna 1 */}
            <div className="column">
              <div className="section-block intro-block">
                <div className="section-title">INTRO:</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">–</span>
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">–</span>
                  <span className="chord">{transposeChord("(E)")}</span>
                  <span className="chord">-</span>
                </div>
                <div className="text-line">(RIFF 1 - A) + (RIFF 2 + A)</div>
              </div>

              <div className="section-divider"></div>

              <div className="voice-block voz-ale-block">
                <div className="voice-label">1º VOZ ALE</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Someone told me long ago</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">There's a calm before the storm, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">And it's been coming for some time.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>

              <div className="voice-block voz-pato-block">
                <div className="voice-label">1º VOZ PATO</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">When it's over, so they say</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">It'll rain a sunny day, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Shining down like water.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>

              <div className="section-divider"></div>

              <div className="section-block estribillo-block">
                <div className="section-title">ESTRIBILLO:</div>
                <div className="voice-block voz-ale-block">
                  <div className="voice-label">1º VOZ ALE</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                  </div>
                </div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">2º VOZ PATO</div>
                  <div className="lyrics-line">I wanna know</div>
                </div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">I wanna know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">1º VOZ PATO</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                    <span className="chord">{transposeChord("A")}</span>
                  </div>
                  <div className="lyrics-line">Coming down on a sunny day.</div>
                </div>
              </div>

              <div className="section-divider"></div>
              <div className="voice-block voz-ale-block">
                <div className="voice-label">1º VOZ ALE</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Yesterday and days before</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">Sun is cold and rain is hard, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Been that way for all my time.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="column">
              <div className="voice-block voz-pato-block">
                <div className="voice-label">1º VOZ PATO</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">'Til forever on it goes</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">Thru the circle fast and slow, I know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">And it can't stop, I wonder.</div>
                <div className="text-line">(RIFF 2 + A)</div>
              </div>

              <div className="section-divider"></div>

              <div className="section-block estribillo-block">
                <div className="section-title">ESTRIBILLO:</div>
                <div className="voice-block voz-ale-block">
                  <div className="voice-label">1º VOZ ALE</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                  </div>
                </div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">2º VOZ PATO</div>
                  <div className="lyrics-line">I wanna know</div>
                </div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">I wanna know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">1º VOZ PATO</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                    <span className="chord">{transposeChord("A")}</span>
                  </div>
                  <div className="lyrics-line">Coming down on a sunny day.</div>
                </div>
              </div>

              <div className="section-divider"></div>

              <div className="voice-block voz-ale-block">
                <div className="voice-label">1º VOZ ALE</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                </div>
                <div className="lyrics-line">Yeah!!</div>
              </div>

              <div className="section-divider"></div>

              <div className="section-block estribillo-block">
                <div className="section-title">ESTRIBILLO:</div>
                <div className="voice-block voz-ale-block">
                  <div className="voice-label">1º VOZ ALE</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                  </div>
                </div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">2º VOZ PATO</div>
                  <div className="lyrics-line">I wanna know</div>
                </div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("D")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                </div>
                <div className="lyrics-line">I wanna know</div>
                <div className="chords-line">
                  <span className="chord">{transposeChord("A")}</span>
                  <span className="chord">{transposeChord("E/G#")}</span>
                  <span className="chord">{transposeChord("F#m")}</span>
                  <span className="chord">{transposeChord("E")}</span>
                  <span className="chord">-</span>
                  <span className="chord">{transposeChord("D")}</span>
                </div>
                <div className="lyrics-line">Have you ever seen the rain.</div>
                <div className="voice-block voz-pato-block">
                  <div className="voice-label">1º VOZ PATO</div>
                  <div className="chords-line">
                    <span className="chord">{transposeChord("D")}</span>
                    <span className="chord">{transposeChord("E")}</span>
                    <span className="chord">{transposeChord("A")}</span>
                  </div>
                  <div className="lyrics-line">Coming down on a sunny day.</div>
                </div>
              </div>

              <div className="section-divider"></div>

              <div className="text-line">(RIFF 1)</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Estilos principales */
        .chords-viewer-container {
          width: 100%;
          margin: 0 auto;
          padding: 0;
          background-color: #ffffff;
          min-height: 100vh;
          position: relative;
          font-family: Arial, sans-serif;
          color: #000000;
          line-height: 1.2;
        }
        
        .controls {
          display: flex;
          justify-content: center;
          gap: 2rem;
          padding: 1rem;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }
        
        .control-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .chords-content {
          width: 100%;
          padding: 1rem;
          margin-left: 0;
          font-family: Arial, sans-serif;
        }
        
        .song-header {
          text-align: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #2c3e50;
        }
        
        .song-title {
          font-size: 1.8rem;
          margin: 0;
          color: #2c3e50;
          font-weight: 700;
        }
        
        /* Visor de acordes */
        .chords-viewer {
          background-color: #ffffff;
          padding: 0;
          border-radius: 0;
          border: none;
          box-shadow: none;
          line-height: 1.3;
          font-family: Arial, sans-serif;
        }
        
        .song-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .column {
          display: flex;
          flex-direction: column;
        }
        
        .section-block {
          margin-bottom: 1rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .intro-block {
          background-color: #f9f9f9;
        }
        
        .estribillo-block {
          background-color: #f0f8ff;
        }
        
        .section-title {
          font-size: 1em;
          margin: 0 0 0.5rem 0;
          padding-bottom: 0.2rem;
          border-bottom: 2px solid #000000;
          color: #000000;
          font-weight: 700;
          text-transform: uppercase;
          text-decoration: underline;
          text-align: center;
        }
        
        .voice-block {
          margin-bottom: 0.8rem;
          padding: 0.5rem;
          border-radius: 4px;
        }
        
        .voz-ale-block {
          background-color: rgba(255, 200, 200, 0.3);
        }
        
        .voz-pato-block {
          background-color: rgba(200, 255, 200, 0.3);
        }
        
        .voice-label {
          font-weight: 700;
          margin-bottom: 0.3rem;
          text-align: center;
        }
        
        .chords-line {
          display: block;
          margin: 0 0 0.1rem 0;
          padding: 0;
          background-color: transparent;
          border-left: none;
          height: 1.2em;
          line-height: 1;
          text-align: center;
        }
        
        .chord {
          font-weight: 700;
          color: #0000ff;
          font-size: 1em;
          padding: 0;
          background-color: transparent;
          font-family: Arial, sans-serif;
          white-space: nowrap;
          position: relative;
          margin: 0 0.2em;
          display: inline;
        }
        
        .lyrics-line, .text-line {
          line-height: 1.4;
          font-size: 1em;
          color: #000000;
          white-space: pre-wrap;
          padding: 0;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        
        .section-divider {
          text-align: center;
          font-weight: 700;
          letter-spacing: 2px;
          margin: 0.5rem 0;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 0.5rem;
        }
        
        /* Media queries para impresión */
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body, html, .chords-viewer-container {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
            background: white;
            font-size: 16px;
            line-height: 1.2;
            font-family: Arial, sans-serif;
          }
          
          .controls {
            display: none;
          }
          
          .chords-content {
            margin-left: 0;
            width: 210mm;
            padding: 5mm;
            height: 287mm;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default ChordsViewer;