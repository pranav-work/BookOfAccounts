import axios from "axios";
import appConfig from "../AppConfig";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../utils/token";


export const privateApi = axios.create({
    baseURL: appConfig.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const publicApi = axios.create({
    baseURL: appConfig.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

privateApi.interceptors.request.use(
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

privateApi.interceptors.response.use(
    (res) => res,
    async (error) =>{
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try{
                const refreshToken = getRefreshToken();
                const res = await privateApi.post('/token-refresh', { refreshToken });
                setTokens(res.data.accessToken, res.data.refreshToken);
                originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
                return privateApi(originalRequest);
            } catch {
                clearTokens();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
