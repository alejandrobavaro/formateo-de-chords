import React from 'react';
import "../assets/scss/_03-Componentes/_FormateoRiderVideo.scss";
import Sidebar from './Sidebar';

const FormateoRiderVideo = () => {
  return (
    <div className="formateo-rider-video">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="contenido">
        <h1>Formateo de Rider Video</h1>
        <p>Este es el contenido para formateo de rider video...</p>
      </div>
    </div>
  );
};

export default FormateoRiderVideo;
