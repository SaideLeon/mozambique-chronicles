// config.js
export const ENV = {
    development: {
        baseURL: 'http://127.0.0.1:8000/api',
        mediaURL: 'http://127.0.0.1:8000'
    },
    production: {
        baseURL: 'https://apicronicamz.choreoapps.dev/api',
        mediaURL: 'https://apicronicamz.choreoapps.dev'
    }
};

export const currentEnv = process.env.NODE_ENV || 'development';
export const config = ENV[currentEnv];
