import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="relative z-10">
        <div className="text-center space-y-8 backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10 max-w-lg">
          {/* Ícone e Título */}
          <div className="space-y-4">
            <AlertCircle className="w-16 h-16 text-purple-400 mx-auto" />
            <h1 className="text-4xl font-bold text-white">Página não encontrada</h1>
          </div>

          {/* Mensagem */}
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">
              Desculpe, a página que você está procurando não existe ou foi movida.
            </p>
            <p className="text-purple-400">
              Error 404
            </p>
          </div>

          {/* Botão de retorno */}
          <div className="pt-4">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 
                text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 
                transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 
                focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black
                shadow-lg shadow-purple-500/20"
            >
              <Home className="w-5 h-5" />
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)]"
          style={{ backgroundSize: '40px 40px' }}
        />
      </div>
    </div>
  );
};

export default NotFound;