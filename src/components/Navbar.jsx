import React from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => (
  <nav className="backdrop-blur-md bg-black/30 fixed w-full z-50">
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Crônicas
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#inicio" className="text-white hover:text-purple-400 transition-colors">Início</a>
          <a href="#cronicas" className="text-white hover:text-purple-400 transition-colors">Crônicas</a>
          <a href="#sobre" className="text-white hover:text-purple-400 transition-colors">Sobre</a>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
);

export default Navbar;