import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

import HeroSection from './HeroSection';
import ImprimirSection from './ImprimirSection';
import CTASection from './CTASection';
import Footer from './Footer';
import { useAPI } from '../services/api';

const CustomAlert = ({ title, message, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-800 border-gray-700',
    error: 'bg-red-900/50 border-red-800',
    success: 'bg-green-900/50 border-green-800',
  };

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]} backdrop-blur-sm`}>
      <div className="flex items-center gap-3">
        {variant === 'error' && <AlertCircle className="h-5 w-5 text-red-400" />}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-gray-300">{message}</p>
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
    <div className="text-center space-y-4 backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10">
      <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
      <p className="text-white text-lg font-medium">Carregando crônicas...</p>
      <p className="text-gray-400 text-sm">Por favor, aguarde enquanto carregamos o conteúdo</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
    <div className="max-w-md w-full space-y-4">
      <CustomAlert
        variant="error"
        title="Erro ao carregar as crônicas"
        message={message || 'Ocorreu um erro ao carregar as crônicas. Por favor, tente novamente mais tarde.'}
      />
      <button 
        onClick={() => window.location.reload()}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg
          hover:from-purple-600 hover:to-purple-700 transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black
          shadow-lg shadow-purple-500/20"
      >
        Tentar novamente
      </button>
    </div>
  </div>
);

const BackgroundDecorations = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradient orbs */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
    
    {/* Optional: subtle grid overlay */}
    <div 
      className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)]"
      style={{ backgroundSize: '40px 40px' }}
    />
  </div>
);

const Imprimir = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chronicles, setChronicles] = useState([]);
  const [featuredChronicle, setFeaturedChronicle] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    chronicles: true,
    featured: true
  });
  const [error, setError] = useState(null);
  
  const { chronicles: chronicleService, featuredChronicles: featuredChronicleService } = useAPI();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [chroniclesData, featuredData] = await Promise.all([
          chronicleService.getAll({ signal: controller.signal }),
          featuredChronicleService.getAll({ signal: controller.signal })
        ]);

        setChronicles(chroniclesData);
        setFeaturedChronicle(featuredData);
        
        setLoadingStates({
          chronicles: false,
          featured: false
        });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  if (loadingStates.chronicles || loadingStates.featured) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <BackgroundDecorations />
      
      <div className="relative z-10">

        
    <main className="pt-16">
          <HeroSection 
            featuredChronicle={featuredChronicle}
            className="animate-fadeIn"
          />
          
          <ImprimirSection
            chronicles={chronicles}
            className="animate-slideUp"
          />
          
          <CTASection className="animate-slideUp" />
        </main>
        
        <Footer className="backdrop-blur-md bg-black/30 border-t border-white/5" />
      </div>
    </div>
  );
};

export default Imprimir;