import React, { useState } from 'react';
import { Menu, X, Calendar, ChevronRight, ChevronDown, Clock, Info, FileDown, ExternalLink, WhatsappIcon} from 'lucide-react';
import imagemBanner from "../assets/homem.jpg";

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
                  href="/documents/chronicles.pdf"
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
                <img src={imagemBanner} alt="Moçambique" className="rounded-xl" />
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
                Mantenha-se informado sobre os acontecimentos mais importantes de Moçambique através de nossas crônicas detalhadas e participe do nosso grupo de discussão.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://chat.whatsapp.com/IfOjeKTuHPHCGUsAfBiECT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-3 rounded-full hover:bg-[#128C7E] transition-colors flex items-center gap-2"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Entrar no Grupo do WhatsApp
                </a>
                <button className="bg-white text-purple-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2">
                  Receber Atualizações <ChevronRight className="w-5 h-5" />
                </button>
              </div>
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