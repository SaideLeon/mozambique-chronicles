#!/bin/bash

# Criar estrutura de diretórios
mkdir -p src/pages
mkdir -p src/components/Dashboard/DashboardLayout
mkdir -p src/components/Dashboard/ChronicleForm
mkdir -p src/components/Dashboard/ChroniclesList
mkdir -p src/components/shared

# Criar arquivo Dashboard.jsx
cat > src/pages/Dashboard.jsx << 'EOL'
import React from 'react';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout/DashboardLayout';
import { ChronicleForm } from '../components/Dashboard/ChronicleForm/ChronicleForm';
import { ChroniclesList } from '../components/Dashboard/ChroniclesList/ChroniclesList';
import { useChronicles } from '../hooks/useChronicles';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { chronicles, loading, error, fetchChronicles, createChronicle, updateChronicle, deleteChronicle } = useChronicles();
  const { isSuperUser } = useAuth();

  return (
    <DashboardLayout>
      {isSuperUser() && (
        <ChronicleForm 
          onSubmit={createChronicle}
          onUpdate={updateChronicle}
        />
      )}
      <ChroniclesList 
        chronicles={chronicles}
        loading={loading}
        error={error}
        onDelete={deleteChronicle}
        isSuperUser={isSuperUser()}
      />
    </DashboardLayout>
  );
};
EOL

# Criar arquivo DashboardLayout.jsx
cat > src/components/Dashboard/DashboardLayout/DashboardLayout.jsx << 'EOL'
import React from 'react';
import { DashboardHeader } from './DashboardHeader';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <DashboardHeader />
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  );
};
EOL

# Criar arquivo DashboardHeader.jsx
cat > src/components/Dashboard/DashboardLayout/DashboardHeader.jsx << 'EOL'
import React from 'react';
import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = () => {
  const { user, logout, isSuperUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="backdrop-blur-md bg-black/30 border-b border-white/10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <UserCircle className="w-5 h-5 text-purple-400" />
            <span>{user?.name}</span>
            {isSuperUser() && (
              <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                Admin
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};
EOL

# Criar arquivo ChronicleForm.jsx
cat > src/components/Dashboard/ChronicleForm/ChronicleForm.jsx << 'EOL'
import React from 'react';
import { useChronicleForm } from '../../../hooks/useChronicleForm';
import { Input } from '../../shared/Input';
import { TextArea } from '../../shared/TextArea';
import { FileUploadField } from './FileUploadField';
import { FormButtons } from './FormButtons';

export const ChronicleForm = ({ onSubmit, onUpdate }) => {
  const {
    formData,
    isEditing,
    handleChange,
    handleSubmit,
    resetForm,
    loading
  } = useChronicleForm(onSubmit, onUpdate);

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        {isEditing ? 'Editar Crônica' : 'Nova Crônica'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <TextArea
          name="content"
          placeholder="Conteúdo"
          value={formData.content}
          onChange={handleChange}
        />
        <div className="flex items-center gap-4">
          <FileUploadField
            value={formData.pdf_file}
            onChange={handleChange}
          />
          <FormButtons
            isEditing={isEditing}
            loading={loading}
            onReset={resetForm}
          />
        </div>
      </form>
    </div>
  );
};
EOL

# Criar arquivo FileUploadField.jsx
cat > src/components/Dashboard/ChronicleForm/FileUploadField.jsx << 'EOL'
import React from 'react';
import { FileText } from 'lucide-react';

export const FileUploadField = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={onChange}
        className="hidden"
        id="pdf-upload"
        name="pdf_file"
      />
      <label
        htmlFor="pdf-upload"
        className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg cursor-pointer
          hover:bg-white/20 transition-colors"
      >
        <FileText className="w-5 h-5" />
        {value ? value.name : 'Escolher PDF'}
      </label>
    </div>
  );
};
EOL

# Criar arquivo FormButtons.jsx
cat > src/components/Dashboard/ChronicleForm/FormButtons.jsx << 'EOL'
import React from 'react';
import { Button } from '../../shared/Button';
import { Loader2, PlusCircle } from 'lucide-react';

export const FormButtons = ({ isEditing, loading, onReset }) => {
  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <PlusCircle className="w-5 h-5" />
            {isEditing ? 'Atualizar' : 'Publicar'}
          </>
        )}
      </Button>
      {isEditing && (
        <Button variant="secondary" onClick={onReset}>
          Cancelar
        </Button>
      )}
    </div>
  );
};
EOL

# Criar arquivo ChroniclesList.jsx
cat > src/components/Dashboard/ChroniclesList/ChroniclesList.jsx << 'EOL'
import React from 'react';
import { ChronicleItem } from './ChronicleItem';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { ErrorMessage } from '../../shared/ErrorMessage';

export const ChroniclesList = ({ chronicles, loading, error, onDelete, isSuperUser }) => {
  if (loading && chronicles.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Crônicas Publicadas</h2>
      {error && <ErrorMessage message={error} />}
      <div className="space-y-4">
        {chronicles.map((chronicle) => (
          <ChronicleItem
            key={chronicle.id}
            chronicle={chronicle}
            onDelete={onDelete}
            isSuperUser={isSuperUser}
          />
        ))}
      </div>
    </div>
  );
};
EOL

# Criar arquivo ChronicleItem.jsx
cat > src/components/Dashboard/ChroniclesList/ChronicleItem.jsx << 'EOL'
import React, { useState } from 'react';
import { ChronicleItemActions } from './ChronicleItemActions';
import { ChronicleCard } from './ChronicleCard';

export const ChronicleItem = ({ chronicle, onDelete, isSuperUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (!isSuperUser) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white">{chronicle.title}</h3>
          <p className="text-gray-400 text-sm">
            {new Date(chronicle.date).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        {isSuperUser && (
          <ChronicleItemActions
            onDelete={() => onDelete(chronicle.id)}
            onEdit={() => {}} // Implement edit functionality
          />
        )}
      </div>
      {!isSuperUser && isExpanded && (
        <div className="mt-4">
          <ChronicleCard
            date={new Date(chronicle.date).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
            title={chronicle.title}
            content={chronicle.content}
            pdfUrl={chronicle.pdf_url}
          />
        </div>
      )}
    </div>
  );
};
EOL

# Criar arquivo ChronicleItemActions.jsx
cat > src/components/Dashboard/ChroniclesList/ChronicleItemActions.jsx << 'EOL'
import React from 'react';
import { PenSquare, Trash2 } from 'lucide-react';

export const ChronicleItemActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onEdit}
        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <PenSquare className="w-5 h-5" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-red-400 hover:text-red-300 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
EOL

# Criar componentes compartilhados
cat > src/components/shared/Button.jsx << 'EOL'
import React from 'react';

export const Button = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90',
    secondary: 'bg-white/10 text-white hover:bg-white/20'
  };

  return (
    <button
      className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
EOL

cat > src/components/shared/Input.jsx << 'EOL'
import React from 'react';

export const Input = ({ ...props }) => {
  return (
    <input
      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
      {...props}
    />
  );
};
EOL

cat > src/components/shared/TextArea.jsx << 'EOL'
import React from 'react';

export const TextArea = ({ rows = 4, ...props }) => {
  return (
    <textarea
      rows={rows}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      {...props}
    />
  );
};
EOL

cat > src/components/shared/ErrorMessage.jsx << 'EOL'
import React from 'react';

export const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4">
      {message}
    </div>
  );
};
EOL

cat > src/components/shared/LoadingSpinner.jsx << 'EOL'
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
    </div>
  );
};
EOL


