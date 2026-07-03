import {publicApi} from "./api";

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await publicApi.post('login/', { email, password });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};
