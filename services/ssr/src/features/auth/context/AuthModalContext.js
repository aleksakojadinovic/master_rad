import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  return useContext(AuthModalContext);
};
