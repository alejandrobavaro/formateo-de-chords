import React, { createContext, useContext, useState } from 'react';

// ========== CONTEXTO PARA BÚSQUEDA GLOBAL ==========
// Este contexto permite compartir el estado de búsqueda entre componentes
const HeaderSearchContext = createContext();

/**
 * Hook personalizado para acceder al contexto de búsqueda
 * @returns {Object} Contexto con searchQuery y setSearchQuery
 */
export const useHeaderSearch = () => {
  const context = useContext(HeaderSearchContext);
  if (!context) {
    throw new Error('useHeaderSearch debe ser usado dentro de un HeaderSearchProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de búsqueda
 * Envuelve la aplicación para proveer funcionalidad de búsqueda global
 */
export const HeaderSearchProvider = ({ children }) => {
  // Estado para almacenar el texto de búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <HeaderSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </HeaderSearchContext.Provider>
  );
};