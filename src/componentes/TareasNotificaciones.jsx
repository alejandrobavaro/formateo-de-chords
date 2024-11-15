import React from 'react';
import { FaBell } from 'react-icons/fa';
import '../assets/scss/_03-Componentes/_TareasNotificaciones.scss';

const TareasNotificaciones = ({ reminderCount, onClick }) => {
  return (
    <button className="headerNotificaciones" onClick={onClick}>
      <div className="notification-badge-container">
  
        <FaBell className="notification-icon" />
        {reminderCount > 0 && (
          <span className="notification-badge">{reminderCount}</span>
        )}
      </div>
    </button>
  );
};

export default TareasNotificaciones;
