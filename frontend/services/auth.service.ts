import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const authService = {
    async register(data: any) {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    },

    async login(data: any) {
        const response = await axios.post(`${API_URL}/login`, data);
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getAuthHeader() {
        const token = localStorage.getItem('access_token');
        return { Authorization: `Bearer ${token}` };
    },

    async updateProfile(fullName: string) {
        const response = await axios.put(`${API_URL}/profile`, { full_name: fullName }, {
            headers: this.getAuthHeader()
        });
        // Update local storage user data
        const user = this.getCurrentUser();
        if (user) {
            user.full_name = fullName;
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },

    async changePassword(data: any) {
        const response = await axios.put(`${API_URL}/password`, data, {
            headers: this.getAuthHeader()
        });
        return response.data;
    }
};
