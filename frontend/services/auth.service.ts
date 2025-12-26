import axios from 'axios';

// Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

// Response interceptor for silent refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and it's not a retry and not the login request
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/login')) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await axios.post(`${API_URL}/refresh`);

                // Retry the original request
                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout user
                await authService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {
    async register(data: any) {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    },

    async login(data: any) {
        const response = await axios.post(`${API_URL}/login`, data);
        // Note: access_token and refresh_token are now handled by cookies (HttpOnly)
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async logout() {
        try {
            await axios.post(`${API_URL}/logout`);
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('user');
            // Tokens in cookies are cleared by the backend
        }
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getAuthHeader() {
        return {};
    },

    async updateProfile(fullName: string) {
        const response = await axios.put(`${API_URL}/profile`, { full_name: fullName });
        // Update local storage user data
        const user = this.getCurrentUser();
        if (user) {
            user.full_name = fullName;
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },

    async changePassword(data: any) {
        const response = await axios.put(`${API_URL}/password`, data);
        return response.data;
    }
};
