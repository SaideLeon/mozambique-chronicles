import React, { useState } from 'react';
import { Menu, X, Calendar, ChevronRight, ChevronDown, Clock, Info, FileDown, ExternalLink } from 'lucide-react';
import banner from "../assets/homem.jpg";

const ChronicleCard = ({ date, title, content, pdfUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">{date}</span>
        </div>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FileDown className="w-5 h-5" />
            <span className="text-sm">PDF</span>
          </a>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="relative">
        <div className={`${!isExpanded && 'max-h-32 overflow-hidden'}`}>
          <p className="text-gray-300 leading-relaxed">
            {content}
          </p>
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1729]/90 to-transparent" />
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              Ler menos <ChevronDown className="w-4 h-4" />
            </>
          ) : (
            <>
              Ler mais <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
        {pdfUrl && isExpanded && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span className="text-sm">Versão completa</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

const MozambiqueChronicles = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const chronicles = [
    {
      date: "9 de Outubro de 2024",
      title: "O Anúncio das Sombras",
      content: "No dia em que o sol nasceu sobre Moçambique, um vento de mudança soprava, carregando consigo o cheiro de pólvora e promessas não cumpridas...",
      pdfUrl: "/documents/anuncio-sombras.pdf"
    },
    {
      date: "19 de Outubro de 2024",
      title: "A Noite dos Renegados",
      content: "A noite de 19 de outubro foi marcada por uma escuridão mais profunda do que a ausência de luz; foi a escuridão da traição e da perda...",
      pdfUrl: "/documents/noite-renegados.pdf"
    },
    {
      date: "21 de Outubro de 2024",
      title: "A Ascensão dos Desesperados",
      content: "A luz do dia 21 de outubro revelou um Moçambique transformado. A esperança havia sido substituída por uma determinação feroz...",
      pdfUrl: "/documents/ascensao-desespera.pdf"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-black/30 fixed w-full z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Crônicas
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-white hover:text-purple-400 transition-colors">Início</a>
              <a href="#cronicas" className="text-white hover:text-purple-400 transition-colors">Crônicas</a>
              <a href="#sobre" className="text-white hover:text-purple-400 transition-colors">Sobre</a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <a href="#inicio" className="text-white hover:text-purple-400 transition-colors">Início</a>
                <a href="#cronicas" className="text-white hover:text-purple-400 transition-colors">Crônicas</a>
                <a href="#sobre" className="text-white hover:text-purple-400 transition-colors">Sobre</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 md:pt-32 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                O Lamento dos 
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"> Renegados</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Uma crônica poderosa sobre a luta pela democracia em Moçambique, registrando os eventos cruciais de outubro de 2024.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2">
                  Começar a leitura <ChevronRight className="w-5 h-5" />
                </button>
                <a
                  href="/documents/cronicas-completas.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2 justify-center"
                >
                  <FileDown className="w-5 h-5" />
                  Baixar PDF Completo
                </a>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="w-full h-64 md:h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <img src={banner} alt="Moçambique" className="rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chronicles Section */}
      <section id="cronicas" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Linha do Tempo
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chronicles.map((chronicle, index) => (
              <ChronicleCard
                key={index}
                date={chronicle.date}
                title={chronicle.title}
                content={chronicle.content}
                pdfUrl={chronicle.pdfUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Acompanhe a História
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Mantenha-se informado sobre os acontecimentos mais importantes de Moçambique através de nossas crônicas detalhadas.
              </p>
              <button className="bg-white text-purple-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
                Receber Atualizações <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-black/30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Crônicas de Moçambique. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MozambiqueChronicles;