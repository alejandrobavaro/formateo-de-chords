import React, { createContext, useState, useContext, useCallback } from 'react';
import '../assets/scss/_03-Componentes/_TareasNotificaciones.scss'; // Importa los estilos

// Contexto
const TareasNotificacionesContext = createContext();

// Proveedor del contexto
export const TareasNotificacionesProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({});

  // Usar useCallback para evitar la recreación de funciones en cada render
  const addNotification = useCallback((key, count) => {
    setNotifications(prev => ({ ...prev, [key]: count }));
  }, []);

  const removeNotification = useCallback((key) => {
    setNotifications(prev => {
      const newNotifications = { ...prev };
      delete newNotifications[key];
      return newNotifications;
    });
  }, []);

  return (
    <div className="nav-linkHeader">
      <TareasNotificacionesContext.Provider value={{ notifications, addNotification, removeNotification }}>
        {children}
      </TareasNotificacionesContext.Provider>
    </div>
  );
};

// Hook personalizado para usar el contexto
export const useTareasNotificaciones = () => {
  return useContext(TareasNotificacionesContext);
};
