import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LogOut, User, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Componente de rota protegida
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Componente Dashboard
export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Crônicas lidas', value: '12', icon: BookOpen },
    { label: 'Dias acompanhando', value: '45', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Header */}
      <header className="backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">{user?.name}</h2>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg
                hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400">{label}</p>
                  <p className="text-3xl font-bold text-white">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent chronicles */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Crônicas recentes</h3>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl">
            {/* Lista de crônicas recentes aqui */}
          </div>
        </div>
      </main>
    </div>
  );
};