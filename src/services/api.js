// api.js
import axios from 'axios';
import { config } from './config';

// Custom error class
class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'APIError';
        this.status = status;
    }
}

// Base API configuration
const createAPIInstance = () => {
    const instance = axios.create({
        baseURL: config.baseURL,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Request interceptor for auth token
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Token ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                visitorService.logout();
                window.location.href = '/login';
            }
            return Promise.reject(handleError(error));
        }
    );

    return instance;
};

// Error handler
const handleError = (error) => {
    if (error.response) {
        const message = 
            error.response.data.message || 
            error.response.data.detail || 
            'Ocorreu um erro no servidor';
        return new APIError(message, error.response.status);
    } 
    if (error.request) {
        return new APIError(
            'Não foi possível conectar ao servidor. Verifique sua conexão.',
            0
        );
    }
    return new APIError('Erro ao processar a requisição.', 0);
};

const api = createAPIInstance();

// Chronicle service
export const chronicleService = {
    getAll: async (params = {}) => {
        try {
            const response = await api.get('/chronicles/', { params });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/chronicles/${id}/`);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    create: async (chronicleData) => {
        try {
            const formData = new FormData();
            Object.entries(chronicleData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await api.post('/chronicles/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    update: async (id, chronicleData) => {
        try {
            const formData = new FormData();
            Object.entries(chronicleData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await api.patch(`/chronicles/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/chronicles/${id}/`);
            return true;
        } catch (error) {
            throw handleError(error);
        }
    },
};

// Featured chronicle service
export const featuredChronicleService = {
    getAll: async (params = {}) => {
        try {
            const response = await api.get('/featured-chronicles/', { params });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/featured-chronicles/${id}/`);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    create: async (chronicleData) => {
        try {
            const formData = new FormData();
            Object.entries(chronicleData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await api.post('/featured-chronicles/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    update: async (id, chronicleData) => {
        try {
            const formData = new FormData();
            Object.entries(chronicleData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await api.patch(`/featured-chronicles/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/featured-chronicles/${id}/`);
            return true;
        } catch (error) {
            throw handleError(error);
        }
    },
};
// Social Service
export const socialService = {
    // Comentários
   getComments: async (chronicleId) => {
        try {
            const response = await api.get('/comments/', { params: { chronicle: chronicleId } });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    

    createComment: async (commentData) => {
        try {
            const response = await api.post('/comments/', commentData);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    updateComment: async (commentId, commentData) => {
        try {
            const response = await api.patch(`/comments/${commentId}/`, commentData);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    deleteComment: async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}/`);
            return true;
        } catch (error) {
            throw handleError(error);
        }
    },

    // Likes
    getLikes: async (chronicleId) => {
        try {
            const response = await api.get('/likes/', { params: { chronicle: chronicleId } });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    like: async (data) => {
        try {
            const response = await api.post('/likes/', data);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    unlike: async (likeId) => {
        try {
            await api.delete(`/likes/${likeId}/`);
            return true;
        } catch (error) {
            throw handleError(error);
        }
    },

    // Compartilhamentos
    getShares: async (params = {}) => {
        try {
            const response = await api.get('/shares/', { params });
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    share: async (shareData) => {
        try {
            const response = await api.post('/shares/', shareData);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    // Métodos auxiliares para verificar status
    getLikeStatus: async (chronicleId, isFeatured = false) => {
        try {
            const params = isFeatured 
                ? { featured_chronicle: chronicleId }
                : { chronicle: chronicleId };
            
            const response = await api.get('/likes/', { params });
            const likes = response.data;
            
            const currentUser = visitorService.getCurrentUser();
            const userLike = currentUser ? 
                likes.find(like => like.owner === currentUser.id || like.user === currentUser.id) : 
                null;

            return {
                isLiked: !!userLike,
                likeId: userLike?.id,
                totalLikes: likes.length
            };
        } catch (error) {
            throw handleError(error);
        }
    },

    getChronicleStats: async (chronicleId, isFeatured = false) => {
        try {
            const params = isFeatured 
                ? { featured_chronicle: chronicleId }
                : { chronicle: chronicleId };
            
            // Fazer todas as chamadas em paralelo para melhor performance
            const [comments, likes, shares] = await Promise.all([
                api.get('/comments/', { params }),
                api.get('/likes/', { params }),
                api.get('/shares/', { params })
            ]);

            const currentUser = visitorService.getCurrentUser();
            const userLike = currentUser ? 
                likes.data.find(like => like.owner === currentUser.id || like.user === currentUser.id) : 
                null;

            return {
                commentsCount: comments.data.length,
                likesCount: likes.data.length,
                sharesCount: shares.data.length,
                comments: comments.data,
                isLiked: !!userLike,
                likeId: userLike?.id
            };
        } catch (error) {
            throw handleError(error);
        }
    },

    like: async (data) => {
        try {
            const response = await api.post('/likes/', data);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    unlike: async (likeId) => {
        try {
            await api.delete(`/likes/${likeId}/`);
            return true;
        } catch (error) {
            throw handleError(error);
        }
    },
    // Método para obter URLs de compartilhamento
    getShareUrls: (chronicleId, isFeatured = false) => {
        const baseUrl = window.location.origin;
        const path = isFeatured ? 'featured-chronicles' : 'chronicles';
        const url = encodeURIComponent(`${baseUrl}/${path}/${chronicleId}`);
        
        return {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
twitter: `https://twitter.com/intent/tweet?url=${url}`,
            whatsapp: `https://api.whatsapp.com/send?text=${url}`,
            telegram: `https://t.me/share/url?url=${url}`
        };
    }
};

// Visitor service
export const visitorService = {
    register: async (userData) => {
        try {
            console.log('Registration Data:', userData);

            const formattedData = {
                email: userData.email,
                name: userData.name,
                password: userData.password,
                password_confirm: userData.password_confirm
            };

            console.log('Formatted Data:', formattedData);

            const response = await api.post('/register/', formattedData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Registration Error:', error.response?.data);
            
            if (error.response?.data) {
                const fieldErrors = Object.entries(error.response.data)
                    .map(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            return `${field}: ${errors[0]}`;
                        }
                        return `${field}: ${errors}`;
                    })
                    .join(', ');
                
                throw new Error(fieldErrors || 'Erro na validação dos dados');
            }
            
            throw new Error(error.message || 'Erro ao criar conta');
        }
    },

    login: async ({ email, password }) => {
        try {
            const response = await api.post('/login/', { email, password });
            if (response.data.token) {
                // Armazena o token
                localStorage.setItem('token', response.data.token);
                
                // Armazena os dados do usuário
                if (response.data.user) {
                    const userData = {
                        id: response.data.user.id,
                        email: response.data.user.email,
                        name: response.data.user.name,
                        is_superuser: response.data.user.is_superuser
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.detail 
                || error.response?.data?.non_field_errors?.[0]
                || error.message;
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        // Remove todos os dados do usuário do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        // Função auxiliar para obter os dados do usuário atual
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            return null;
        }
    },

    isLoggedIn: () => {
        // Função auxiliar para verificar se o usuário está logado
        return !!localStorage.getItem('token');
    },

    isSuperUser: () => {
        // Função auxiliar para verificar se o usuário é superusuário
        const user = visitorService.getCurrentUser();
        return user ? user.is_superuser : false;
    },

    verifyEmail: async (token) => {
        try {
            const response = await api.get(`/verify-email/?token=${token}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error 
                || error.message;
            throw new Error(errorMessage);
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/profile/');
            // Atualiza os dados do usuário no localStorage quando obtém o perfil
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.detail 
                || error.message;
            throw new Error(errorMessage);
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/profile/', profileData);
            // Atualiza os dados do usuário no localStorage após atualizar o perfil
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.detail 
                || Object.values(error.response?.data || {})[0]?.[0]
                || error.message;
            throw new Error(errorMessage);
        }
    }
};

// Media helper
export const mediaHelper = {
    getMediaUrl: (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${config.mediaURL}${path}`;
    }
};

// Custom hook for API consumption
export const useAPI = () => {
    return {
        chronicles: chronicleService,
        featuredChronicles: featuredChronicleService,
        visitors: visitorService,
        media: mediaHelper,
        social: socialService,
    };
};

export default api;