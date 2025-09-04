// ======================================================
// CONTEXTO PARA LA BÚSQUEDA
// ======================================================
import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const SearchContext = createContext(null);

// Proveedor del contexto
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch debe ser usado dentro de un SearchProvider');
  }
  return context;
};