import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChronicleCard from '../components/ChronicleCard';
import { useAPI } from '../services/api';
import  CustomAlert from '../components/utils/Resources';
import  ErrorState from  '../components/utils/Resources';
import  LoadingState from  '../components/utils/Resources';
import  BackgroundDecorations 
 from  '../components/utils/Resources';

const Partilhado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chronicle, setChronicle] = useState(null);
  const [error, setError] = useState(null);
  
  const { chronicles: chronicleService } = useAPI();

  useEffect(() => {
    fetchChronicleById();
  }, [id]); // Added id as dependency

  const fetchChronicleById = async () => {
    try {
      const data = await chronicleService.getById(id);
      if (!data) {
        throw new Error('Chronicle not found');
      }
      setChronicle(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!chronicle) {
    return <ErrorState message="Chronicle not found" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <BackgroundDecorations />
      
      <div className="relative z-10">
        <Navbar 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          className="backdrop-blur-md bg-black/30 border-b border-white/5"
        />
        
        <main className="container mx-auto px-4 py-8">
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
              dashboard={false}
            />
          </div>
        </main>

        <Footer className="backdrop-blur-md bg-black/30 border-t border-white/5" />
      </div>
    </div>
  );
};

export default Partilhado;