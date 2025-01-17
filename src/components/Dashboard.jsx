import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader2, FileText, Trash2, PenSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAPI } from '../services/api';
import ChronicleCard from './ChronicleCard';
import {ErrorMessage} from './ErrorMessage';
import Navbar from './HeaderX';

export const Dashboard = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chronicles, setChronicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedChronicle, setSelectedChronicle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    pdf_file: null
  });

  const { isSuperUser } = useAuth();
  const { chronicles: chronicleService } = useAPI();
  

  useEffect(() => {
    fetchChronicles();
  }, []);

  const fetchChronicles = async () => {
    try {
      const data = await chronicleService.getAll();
      setChronicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      pdf_file: e.target.files[0]
    }));
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperUser()) {
      setError('Você não tem permissão para realizar esta ação.');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await chronicleService.update(selectedChronicle.id, formData);
      } else {
        await chronicleService.create(formData);
      }
      fetchChronicles();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (chronicle) => {
    if (!isSuperUser()) {
      setError('Você não tem permissão para editar crônicas.');
      return;
    }
    setIsEditing(true);
    setSelectedChronicle(chronicle);
    setFormData({
      title: chronicle.title,
      content: chronicle.content,
      date: new Date(chronicle.date).toISOString().split('T')[0],
      pdf_file: null
    });
  };

  const handleDelete = async (id) => {
    if (!isSuperUser()) {
      setError('Você não tem permissão para excluir crônicas.');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta crônica?')) {
      setLoading(true);
      try {
        await chronicleService.delete(id);
        fetchChronicles();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChronicleClick = (chronicle) => {
    if (!isSuperUser()) {
      setSelectedChronicle(selectedChronicle?.id === chronicle.id ? null : chronicle);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedChronicle(null);
    setFormData({
      title: '',
      content: '',
      date: '',
      pdf_file: null
    });
  };

  if (loading && chronicles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-6">
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900">
    	 <Navbar 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          className="backdrop-blur-md bg-black/30 border-b border-white/5"
        />
      <div className="container mx-auto pt-16">
        {/* Form Section - Only visible to super users */}
        {isSuperUser() && (
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              {isEditing ? 'Editar Crônica' : 'Nova Crônica'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <textarea
                placeholder="Conteúdo"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                required
              />
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg cursor-pointer
                    hover:bg-white/20 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  {formData.pdf_file ? formData.pdf_file.name : 'Escolher PDF'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg
                      hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                  >
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
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-white/10 text-white px-6 py-2 rounded-lg
                        hover:bg-white/20 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Error Message Display */}
        {error && (
        <ErrorMessage error={error}/>
        )}

        {/* Chronicles List */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Crônicas Publicadas</h2>
          <div className="space-y-4">
            {chronicles.map((chronicle) => (
              <div key={chronicle.id}>
                {isSuperUser() ? (
                  <div
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
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(chronicle)}
                        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <PenSquare className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(chronicle.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => handleChronicleClick(chronicle)}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
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
                    </div>
                    {selectedChronicle?.id === chronicle.id && (
                      <div className="mt-4">
                        <ChronicleCard
                          date={new Date(chronicle.date).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                          id={chronicle.id}
                          title={chronicle.title}
                          content={chronicle.content}
                          pdfUrl={chronicle.pdf_url}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    	

      
    </div>
  );
};
