// MozambiqueChronicles.jsx
const MozambiqueChronicles = () => {
  // ... other code remains the same ...

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-purple-100 text-xl font-medium">
          Carregando crônicas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-red-400 text-xl font-medium">
          Erro ao carregar as crônicas: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="min-h-screen bg-[url('/noise.png')] bg-repeat bg-fixed mix-blend-overlay">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <HeroSection featuredChronicle={featuredChronicle} />
        <ChroniclesSection chronicles={chronicles} />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

// HeroSection.jsx
const HeroSection = ({ featuredChronicle }) => (
  <section id="inicio" className="pt-24 md:pt-32 px-4">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            O Lamento dos
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"> Renegados</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Uma crônica poderosa sobre a luta pela democracia em Moçambique, registrando os eventos cruciais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#cronicas"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Começar a leitura <ChevronRight className="w-5 h-5" />
            </a>
            {/* ... rest of the component */}
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
);

// CTASection.jsx
const CTASection = () => (
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
          <a
            href="https://chat.whatsapp.com/IfOjeKTuHPHCGUsAfBiECT"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-purple-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Entrar no Grupo do WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
);

// ChronicleCard.jsx
const ChronicleCard = ({ date, title, content, pdfUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { media } = useAPI();

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">{date}</span>
        </div>
        {pdfUrl && (
          <a
            href={media.getMediaUrl(pdfUrl)}
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
          <p className="text-gray-300 leading-relaxed">{content}</p>
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1729]/90 to-transparent" />
        )}
      </div>
      {/* ... rest of the component remains the same */}
    </div>
  );
};