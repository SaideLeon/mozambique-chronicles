import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const UserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <User className="w-4 h-4 text-purple-400" />
        </div>
        <span>{user?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-black/90 border border-white/10 rounded-lg shadow-lg py-1 z-50">
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="backdrop-blur-md bg-black/30 fixed w-full z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
          >
            StoryByte
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/#inicio" 
              onClick={(e) => handleSmoothScroll(e, 'inicio')}
              className="text-white hover:text-purple-400 transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/#cronicas" 
              onClick={(e) => handleSmoothScroll(e, 'cronicas')}
              className="text-white hover:text-purple-400 transition-colors"
            >
              Crônicas
            </Link>
            <Link 
              to="/#sobre" 
              onClick={(e) => handleSmoothScroll(e, 'sobre')}
              className="text-white hover:text-purple-400 transition-colors"
            >
              Sobre
            </Link>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full 
                    hover:opacity-90 transition-opacity"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/#inicio" 
              onClick={(e) => handleSmoothScroll(e, 'inicio')}
              className="block text-white hover:text-purple-400 transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/#cronicas" 
              onClick={(e) => handleSmoothScroll(e, 'cronicas')}
              className="block text-white hover:text-purple-400 transition-colors"
            >
              Crônicas
            </Link>
            <Link 
              to="/#sobre" 
              onClick={(e) => handleSmoothScroll(e, 'sobre')}
              className="block text-white hover:text-purple-400 transition-colors"
            >
              Sobre
            </Link>

            {isAuthenticated ? (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Link
                  to="/dashboard"
                  className="block text-white hover:text-purple-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Link
                  to="/login"
                  className="block text-white hover:text-purple-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="block bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full
                    hover:opacity-90 transition-opacity text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;