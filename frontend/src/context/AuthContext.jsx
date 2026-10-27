import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('apex_role') || 'admin');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('apex_user');
    return saved ? JSON.parse(saved) : { name: 'John Doe', email: 'admin@apexstock.com', role: 'admin' };
  });

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('apex_role', newRole);
    const updatedUser = newRole === 'admin' 
      ? { name: 'John Doe', email: 'admin@apexstock.com', role: 'admin' }
      : newRole === 'cashier'
      ? { name: 'Maria Gomez', email: 'cashier@apexstock.com', role: 'cashier' }
      : { name: 'Alex Rivera', email: 'manager@apexstock.com', role: 'manager' };
    setUser(updatedUser);
    localStorage.setItem('apex_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ role, user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
