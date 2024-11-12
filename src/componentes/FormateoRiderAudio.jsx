import React from 'react';
import "../assets/scss/_03-Componentes/_FormateoRiderAudio.scss";
import Sidebar from './Sidebar';

const FormateoRiderAudio = () => {
  return (
    <div className="formateo-rider-audio">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="contenido">
        <h1>Formateo de Rider Audio</h1>
        <p>Este es el contenido para formateo de rider audio...</p>
      </div>
    </div>
  );
};

export default FormateoRiderAudio;
