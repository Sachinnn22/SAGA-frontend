import axios from 'axios';

const API = axios.create({
    baseURL: 'http://34.47.209.16:8084/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses and refresh access token
API.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Don't try refresh if there is no original request
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Handle unauthorized response
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    window.location.href = '/login';

                    return Promise.reject(error);
                }

                const response = await API.post(
                    '/users/refresh-token',
                    {
                        refreshToken,
                    }
                );

                const newAccessToken =
                    response.data?.data?.accessToken;

                if (!newAccessToken) {
                    throw new Error('New access token not received');
                }

                // Save new access token
                localStorage.setItem(
                    'accessToken',
                    newAccessToken
                );

                // Add new token to original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry original request
                return API(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;