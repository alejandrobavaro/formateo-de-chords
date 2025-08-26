import React, { createContext, useContext, useState } from 'react';

const HeaderSearchContext = createContext();

export const useHeaderSearch = () => {
  const context = useContext(HeaderSearchContext);
  if (!context) {
    throw new Error('useHeaderSearch debe ser usado dentro de un HeaderSearchProvider');
  }
  return context;
};

export const HeaderSearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <HeaderSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </HeaderSearchContext.Provider>
  );
};