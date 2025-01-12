import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAPI } from '../services/api';

const AuthContext = createContext({});

const TOKEN_KEY = '@MozChronic:token';
const USER_KEY = '@MozChronic:user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  });
  
  const { visitors } = useAPI();

  const saveUserData = useCallback((userData) => {
    try {
      if (!userData) {
        throw new Error('Invalid user data');
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }, []);

  const saveToken = useCallback((token) => {
    try {
      if (!token) {
        throw new Error('Invalid token');
      }
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      const response = await visitors.login({ email, password });
      
      if (!response?.data) {
        throw new Error('Resposta inválida do servidor');
      }

      const { token, ...userData } = response.data;

      saveToken(token);
      saveUserData({
        email: userData.email,
        name: userData.name,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login. Verifique suas credenciais.' 
      };
    }
  }, [visitors, saveToken, saveUserData]);

  const register = useCallback(async (userData) => {
    try {
      if (!userData?.email || !userData?.password || !userData?.name || !userData?.password_confirm) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (userData.password !== userData.password_confirm) {
        throw new Error('As senhas não conferem');
      }

      const result = await visitors.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password_confirm
      });

      if (!result?.data) {
        throw new Error('Resposta inválida do servidor');
      }

      return { 
        success: true, 
        data: result.data,
        message: 'Registro realizado com sucesso!'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao criar conta'
      };
    }
  }, [visitors]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      return visitors.logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [visitors]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      if (!profileData) {
        throw new Error('Dados do perfil são obrigatórios');
      }

      const response = await visitors.updateProfile(profileData);
      
      if (!response?.data) {
        throw new Error('Resposta inválida do servidor');
      }

      const updatedUserData = {
        ...user,
        name: response.data.name,
        email: response.data.email
      };

      saveUserData(updatedUserData);

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao atualizar perfil'
      };
    }
  }, [visitors, user, saveUserData]);

  const getProfile = useCallback(async () => {
    try {
      const response = await visitors.getProfile();
      
      if (!response?.data) {
        throw new Error('Resposta inválida do servidor');
      }

      const profileData = {
        ...user,
        ...response.data
      };

      saveUserData(profileData);

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao buscar perfil'
      };
    }
  }, [visitors, user, saveUserData]);

  const verifyEmail = useCallback(async (token) => {
    try {
      if (!token) {
        throw new Error('Token é obrigatório');
      }

      const response = await visitors.verifyEmail(token);
      
      if (!response?.data) {
        throw new Error('Resposta inválida do servidor');
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao verificar email'
      };
    }
  }, [visitors]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (token && !user && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (!userData?.email || !userData?.name) {
          throw new Error('Invalid stored user data');
        }
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  }, [user, logout]);

  const value = {
    user,
    login,
    logout,
    register,
    updateProfile,
    getProfile,
    verifyEmail,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;