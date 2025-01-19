import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAPI } from '../services/api';
import ImprimirCard from './ImprimirCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ChronicleDetail = () => {
  const { id } = useParams();
  const [chronicle, setChronicle] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { chronicles: chronicleService } = useAPI();

  useEffect(() => {
    const fetchChronicle = async () => {
      try {
        setLoading(true);
        const data = await chronicleService.getById(id);
        setChronicle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChronicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Erro ao carregar a crônica</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!chronicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Crônica não encontrada</h2>
        </div>
      </div>
    );
  }

  return (
  	<div>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <ImprimirCard
          id={chronicle.id}
          date={new Date(chronicle.date).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          title={chronicle.title}
          content={chronicle.content}
          pdfUrl={chronicle.pdf_file}
        />
      </div>
    </div>
                  <Link 
                to="/dashboard"
                onClick={(e) => handleSmoothScroll(e, 'cronicas')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-full 
                  hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
              >
                Mais cronicas <ChevronRight className="w-5 h-5" />
              </Link>
  	</div>

  );
};

export default ChronicleDetail;