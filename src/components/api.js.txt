
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
                config.headers.Authorization = `Bearer ${token}`;
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

// Visitor service
export const visitorService = {
    register: async (userData) => {
        try {
            const response = await api.post('/visitors/register/', userData);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/visitors/login/', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    verifyEmail: async (token) => {
        try {
            const response = await api.get(`/visitors/verify-email/?token=${token}`);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/visitors/profile/');
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/visitors/profile/', profileData);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },
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
        media: mediaHelper
    };
};

export default api;