import axios from "axios";
import config from "../config";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../utils/token";


const api = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (res) => res,
    async (error) =>{
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try{
                const refreshToken = getRefreshToken();
                const res = await api.post('/token-refresh', { refreshToken });
                setTokens(res.data.accessToken, res.data.refreshToken);
                originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
                return api(originalRequest);
            } catch (error) {
                clearTokens();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
export default api;