import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8084/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    // Refresh token එකත් නැත්නම් ලොගින් පේජ් එකට යැවීම
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                const response = await axios.post('http://localhost:8084/api/v1/users/refresh-token', {
                    refreshToken: refreshToken
                });

                const { accessToken } = response.data.data;

                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return API(originalRequest);

            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;