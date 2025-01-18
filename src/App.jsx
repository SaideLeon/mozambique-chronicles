import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MozambiqueChronicles from './components/MozambiqueChronicles';
import Imprimir from './components/Imprimir';

import { Login as LoginPage, Register as RegisterPage } from './components/Auth/Login'; // Corrigido o import
import { ProtectedRoute } from './contexts/ProtectedRoute';

import { Dashboard } from './components/Dashboard';

import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router> {/* Router deve envolver Routes */}
        <Routes>
          <Route path="/" element={<MozambiqueChronicles />} />
         <Route path="/imprimir" element={<Imprimir />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;