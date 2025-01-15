#!/bin/bash

# Criar diretório de hooks se não existir
mkdir -p src/hooks

# Criar arquivo useChronicles.js
cat > src/hooks/useChronicles.js << 'EOL'
import { useState, useEffect } from 'react';
import { useAPI } from '../services/api';

export const useChronicles = () => {
  const [chronicles, setChronicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChronicle, setSelectedChronicle] = useState(null);
  
  const { chronicles: chronicleService } = useAPI();

  useEffect(() => {
    fetchChronicles();
  }, []);

  const fetchChronicles = async () => {
    try {
      const data = await chronicleService.getAll();
      setChronicles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createChronicle = async (formData) => {
    setLoading(true);
    try {
      await chronicleService.create(formData);
      await fetchChronicles();
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateChronicle = async (id, formData) => {
    setLoading(true);
    try {
      await chronicleService.update(id, formData);
      await fetchChronicles();
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChronicle = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta crônica?')) {
      return;
    }
    
    setLoading(true);
    try {
      await chronicleService.delete(id);
      await fetchChronicles();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectChronicle = (chronicle) => {
    setSelectedChronicle(selectedChronicle?.id === chronicle.id ? null : chronicle);
  };

  return {
    chronicles,
    loading,
    error,
    selectedChronicle,
    fetchChronicles,
    createChronicle,
    updateChronicle,
    deleteChronicle,
    selectChronicle
  };
};
EOL

# Criar arquivo useChronicleForm.js
cat > src/hooks/useChronicleForm.js << 'EOL'
import { useState } from 'react';

export const useChronicleForm = (onSubmit, onUpdate) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    pdf_file: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedChronicle, setSelectedChronicle] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'pdf_file' && files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && selectedChronicle) {
        await onUpdate(selectedChronicle.id, formData);
      } else {
        await onSubmit(formData);
      }
      resetForm();
    } catch (err) {
      // Error handling is done in the parent component
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setEditMode = (chronicle) => {
    setIsEditing(true);
    setSelectedChronicle(chronicle);
    setFormData({
      title: chronicle.title,
      content: chronicle.content,
      date: new Date(chronicle.date).toISOString().split('T')[0],
      pdf_file: null
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      date: '',
      pdf_file: null
    });
    setIsEditing(false);
    setSelectedChronicle(null);
  };

  return {
    formData,
    isEditing,
    loading,
    handleChange,
    handleSubmit,
    setEditMode,
    resetForm
  };
};
EOL

# Criar arquivo useAuth.js
cat > src/hooks/useAuth.js << 'EOL'
import { useState, useCallback } from 'react';
import { useAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { auth: authService } = useAPI();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, [authService]);

  const isSuperUser = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isSuperUser
  };
};
EOL
