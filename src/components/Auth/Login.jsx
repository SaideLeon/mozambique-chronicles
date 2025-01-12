import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Componente de campo de entrada reutilizável
const InputField = ({ icon: Icon, type = 'text', showPassword, onTogglePassword, error, ...props }) => {
  const isPassword = type === 'password';
  
  return (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={showPassword ? 'text' : type}
          className={`w-full bg-white/5 border rounded-lg px-10 py-2 text-white placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-white/10'}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

// Componente de alerta reutilizável
const Alert = ({ message, variant = 'error' }) => {
  const variants = {
    error: 'bg-red-900/50 border-red-800 text-red-400',
    success: 'bg-green-900/50 border-green-800 text-green-400',
    info: 'bg-blue-900/50 border-blue-800 text-blue-400'
  };

  return (
    <div className={`rounded-lg border p-3 ${variants[variant]}`}>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

// Componente de Registro
export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  console.log('Auth context loaded:', !!register); // Debug log

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      console.log('Starting registration process...'); // Debug log

      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm
      };

      console.log('Sending registration data:', {
        ...registrationData,
        password: '[HIDDEN]',
        password_confirm: '[HIDDEN]'
      }); // Debug log

      const result = await register(registrationData);
      console.log('Registration result:', result); // Debug log

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message || 'Conta criada com sucesso! Redirecionando...'
        });
        // Aguardar um pouco mais antes de redirecionar
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Erro ao criar conta'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Erro ao criar conta'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Criar conta</h2>
          <p className="mt-2 text-gray-400">Preencha os dados para se cadastrar</p>
        </div>

        {status.message && (
          <Alert 
            message={status.message} 
            variant={status.type === 'success' ? 'success' : 'error'} 
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={User}
            name="name"
            placeholder="Seu nome"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <InputField
            icon={Mail}
            type="email"
            name="email"
            placeholder="Seu email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <InputField
            icon={Lock}
            type="password"
            name="password"
            placeholder="Sua senha"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <InputField
            icon={Lock}
            type="password"
            name="passwordConfirm"
            placeholder="Confirme sua senha"
            value={formData.passwordConfirm}
            onChange={handleChange}
            error={errors.passwordConfirm}
            showPassword={showPasswordConfirm}
            onTogglePassword={() => setShowPasswordConfirm(!showPasswordConfirm)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-lg
              hover:opacity-90 transition-opacity flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        <p className="text-center text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
};

// Componente de Login
export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      console.log('Attempting login...'); // Debug log
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Credenciais inválidas'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Erro ao fazer login'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Bem-vindo de volta</h2>
          <p className="mt-2 text-gray-400">Entre na sua conta para continuar</p>
        </div>

        {status.message && (
          <Alert 
            message={status.message} 
            variant={status.type === 'success' ? 'success' : 'error'} 
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={Mail}
            type="email"
            name="email"
            placeholder="Seu email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <InputField
            icon={Lock}
            type="password"
            name="password"
            placeholder="Sua senha"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-lg
              hover:opacity-90 transition-opacity flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="text-center text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default { Login, Register };