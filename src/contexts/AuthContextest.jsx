// Parte relevante do Login.jsx
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
  
  const { register } = useAuth();  // Usando o hook useAuth
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Formatando os dados corretamente para a API
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm  // Note o formato correto aqui
      };

      console.log('Sending registration data:', registrationData);
      
      const result = await register(registrationData);
      console.log('Registration result:', result);

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message || 'Conta criada com sucesso! Redirecionando...'
        });
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

  // ... resto do componente permanece o mesmo
};