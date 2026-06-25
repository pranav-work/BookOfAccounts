const appConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    publicUrls : {
        home: "/",
        login: "api/v1/login",
        register: "api/v1/register",
    }
};

export default appConfig;