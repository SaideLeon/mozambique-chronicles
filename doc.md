Para usar este serviço em seus componentes:

1. Importação básica:
```javascript
import { useAPI } from '../services/API';

function MeuComponente() {
    const api = useAPI();
    
    // Uso dos serviços
    const buscarCronicas = async () => {
        try {
            const cronicas = await api.chronicles.getAll();
            // Processar os dados...
        } catch (error) {
            // Tratar o erro...
        }
    };
}
```

2. Exemplo de uso para registro:
```javascript
import { useAPI } from '../services/API';

function RegistrationForm() {
    const api = useAPI();
    
    const handleSubmit = async (formData) => {
        try {
            const response = await api.visitors.register(formData);
            // Mostrar mensagem de sucesso
        } catch (error) {
            // Mostrar mensagem de erro
        }
    };
}
```

3. Exemplo de uso para listar crônicas:
```javascript
import { useAPI } from '../services/API';
import { useState, useEffect } from 'react';

function ChroniclesList() {
    const api = useAPI();
    const [chronicles, setChronicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchChronicles = async () => {
            try {
                const data = await api.chronicles.getAll();
                setChronicles(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChronicles();
    }, []);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;
    
    return (
        <div>
            {chronicles.map(chronicle => (
                <div key={chronicle.id}>
                    <h2>{chronicle.title}</h2>
                    <p>{chronicle.content}</p>
                </div>
            ))}
        </div>
    );
}
```

Características principais:

1. Configuração centralizada:
- Baseado em axios
- URL base configurável
- Interceptores para token
- Tratamento de erros unificado

2. Serviços organizados:
- Separação por domínio (crônicas, visitantes)
- Métodos claros e específicos
- Tratamento de erro consistente

3. Segurança:
- Gerenciamento automático de token
- Logout automático em erro 401
- Headers padrão configurados

4. Facilidade de uso:
- Hook customizado para acesso aos serviços
- Typescript pronto (se necessário)
- Documentação inline