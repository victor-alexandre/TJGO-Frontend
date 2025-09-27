import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulação de API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          if (email === 'user@example.com' && password === 'password') {
            resolve({
              token: 'fake-jwt-token',
              user: {
                id: 1,
                name: 'Usuário Teste',
                email: email
              }
            });
          } else {
            resolve({ error: 'Credenciais inválidas' });
          }
        }, 1000);
      });

      if (response.error) {
        throw new Error(response.error);
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Simulação de API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Verifica se o email já existe
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const userExists = existingUsers.find(user => user.email === email);
          
          if (userExists) {
            resolve({ error: 'Email já cadastrado' });
          } else {
            const newUser = {
              id: Date.now(),
              name,
              email,
              password: btoa(password) // Não faça isso em produção!
            };
            
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            
            resolve({
              token: 'fake-jwt-token',
              user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
              }
            });
          }
        }, 1000);
      });

      if (response.error) {
        throw new Error(response.error);
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};