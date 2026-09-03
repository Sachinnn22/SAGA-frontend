import axios from 'axios';

const API = axios.create({
    baseURL: 'http://8.234.86.175/api/v1',
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

        // Handle 5xx server errors / cold starts with 1 auto-retry
        if (
            (!error.response || (error.response.status >= 500 && error.response.status <= 504)) &&
            !originalRequest._serverRetry
        ) {
            originalRequest._serverRetry = true;
            // Wait 1.2s before retry to let service initialize
            await new Promise((resolve) => setTimeout(resolve, 1200));
            return API(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default API;