import React from 'react';
import { ChevronRight, FileDown } from 'lucide-react';
import banner from "../assets/homem.jpg";

const HeroSection = ({ featuredChronicle }) => (
  <section id="inicio" className="pt-24 md:pt-32 px-4">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Cronicas de Moz<br></br>
            {featuredChronicle.map((cronica) => (
                        <span key={cronica.id} className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
               {cronica.title}
            </span>
          ))}

          </h1>
          {featuredChronicle.map((cronica) => (
            <p key={cronica.id} className="text-gray-300 text-lg mb-8">
              {cronica.content}
            </p>
          ))}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a 
              href="#cronicas"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Começar a leitura <ChevronRight className="w-5 h-5" />
            </a>
            {featuredChronicle.map((cronica) => (
              <a
                key={cronica.id}
                href={cronica.pdf_file}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2 justify-center"
              >
                <FileDown className="w-5 h-5" />
                Baixar PDF Completo
              </a>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <div className="w-full h-64 md:h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <img 
              src={banner} 
              alt="Moçambique" 
              className="rounded-xl object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;